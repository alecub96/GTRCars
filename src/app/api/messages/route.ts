import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { databaseUnavailableResponse, isDatabaseUnavailable } from '@/lib/api-error';

// REGEX DE BLINDAJE ANTI-BYPASS Y ANTI-FRAUDE
// 1. Detección de números de teléfono (españoles o internacionales, con espacios, puntos, guiones o texto disimulado "seis doce...")
const PHONE_REGEX = /(\+?34|0034)?[\s\.\-_]*[6789](\s*\d){8}/i;
const SPELLED_NUMBERS_REGEX = /\b(cero|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve)([\s\.\-_]+(cero|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve)){3,}\b/i;

// 2. Detección de correos electrónicos y dominios
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i;
const AT_SPELLED_REGEX = /\b(arroba|gmail(\.com)?|hotmail(\.com)?|yahoo(\.com)?|outlook(\.com)?|icloud(\.com)?|protonmail)\b/i;

// 3. Detección de competidores y plataformas externas
const COMPETITORS_REGEX = /\b(yescapa|booking|airbnb|wikiloc|milanuncios|wallapop|idealista|furgovw|campercontact|park4night)\b/i;

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Debes iniciar sesión para enviar mensajes' }, { status: 401 });
    }

    const body = await request.json();
    const { conversationId, content, recipientId, vehicleId } = body;

    if (typeof content !== 'string' || content.trim().length === 0 || content.trim().length > 4000) {
      return NextResponse.json({ error: 'Escribe un mensaje de hasta 4.000 caracteres' }, { status: 400 });
    }

    // === SISTEMA DE BLINDAJE DE MENSAJERÍA SEGURA ===
    const cleanContent = content.trim();
    const isAdmin = user.role === 'ADMIN';

    // Los administradores de la plataforma no tienen restricciones de filtrado
    if (!isAdmin) {
      // Validar Teléfonos
      if (PHONE_REGEX.test(cleanContent) || SPELLED_NUMBERS_REGEX.test(cleanContent)) {
        return NextResponse.json(
          { error: '🛡️ Seguridad: Por tu protección, no está permitido compartir números de teléfono antes de confirmar la reserva.' },
          { status: 422 }
        );
      }

      // Validar Correos Electrónicos
      if (EMAIL_REGEX.test(cleanContent) || AT_SPELLED_REGEX.test(cleanContent)) {
        return NextResponse.json(
          { error: '🛡️ Seguridad: No se permite enviar emails externos por política de protección de datos de la plataforma.' },
          { status: 422 }
        );
      }

      // Validar Menciones a Plataformas Competidoras
      if (COMPETITORS_REGEX.test(cleanContent)) {
        return NextResponse.json(
          { error: '🛡️ Seguridad: No está permitido mencionar marcas de la competencia o plataformas externas.' },
          { status: 422 }
        );
      }
    }

    let activeConversationId = conversationId;

    if (activeConversationId) {
      const conversation = await prisma.conversation.findUnique({ where: { id: activeConversationId } });
      if (!conversation || (conversation.travelerId !== user.id && conversation.ownerId !== user.id)) {
        return NextResponse.json({ error: 'No tienes acceso a esta conversación' }, { status: 403 });
      }
    }

    // Si es la primera interacción, crear o encontrar la conversación por vehicleId + recipientId
    if (!activeConversationId) {
      if (!vehicleId || !recipientId) {
        return NextResponse.json({ error: 'Parámetros de conversación incompletos' }, { status: 400 });
      }

      if (recipientId === user.id) {
        return NextResponse.json({ error: 'No puedes iniciar una conversación contigo mismo' }, { status: 400 });
      }

      const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId }, select: { id: true, ownerId: true } });
      if (!vehicle) {
        return NextResponse.json({ error: 'Vehículo no encontrado' }, { status: 404 });
      }

      // Buscar si ya existe una conversación entre estos usuarios para este vehículo
      let conv = await prisma.conversation.findFirst({
        where: {
          vehicleId,
          OR: [
            { travelerId: user.id, ownerId: recipientId },
            { travelerId: recipientId, ownerId: user.id },
          ],
        },
      });

      if (!conv) {
        conv = await prisma.conversation.create({
          data: {
            vehicleId,
            travelerId: user.id,
            ownerId: recipientId,
          },
        });
      }
      activeConversationId = conv.id;
    }

    // Guardar el mensaje seguro en la base de datos
    const message = await prisma.message.create({
      data: {
        conversationId: activeConversationId,
        senderId: user.id,
        content: cleanContent,
      },
      include: {
        sender: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
      },
    });

    // Actualizar fecha de la conversación para ordenarla primera
    await prisma.conversation.update({
      where: { id: activeConversationId },
      data: { updatedAt: new Date() },
    }).catch(() => {});

    return NextResponse.json({ success: true, message, conversationId: activeConversationId });
  } catch (error) {
    console.error('API Messaging Error:', error);
    if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
    return NextResponse.json({ error: 'Error al enviar el mensaje' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');
    const bookingId = searchParams.get('bookingId');
    const vehicleId = searchParams.get('vehicleId');
    const recipientId = searchParams.get('recipientId');

    let requestedConversationId: string | null = null;

    // Caso 1: Inicializar / consultar por bookingId
    if (bookingId) {
      const booking = await prisma.booking.findUnique({ where: { id: bookingId }, select: { id: true, travelerId: true, ownerId: true, vehicleId: true } });
      if (booking && [booking.travelerId, booking.ownerId].includes(user.id)) {
        let conversation = await prisma.conversation.findFirst({ where: { bookingId: booking.id }, select: { id: true } });
        if (!conversation) {
          conversation = await prisma.conversation.create({
            data: { bookingId: booking.id, travelerId: booking.travelerId, ownerId: booking.ownerId, vehicleId: booking.vehicleId },
            select: { id: true },
          });
        }
        requestedConversationId = conversation.id;
      }
    }

    // Caso 2: Inicializar / consultar pre-reserva por vehicleId + recipientId (desde el botón del anuncio)
    if (!requestedConversationId && vehicleId && recipientId && recipientId !== user.id) {
      let conv = await prisma.conversation.findFirst({
        where: {
          vehicleId,
          OR: [
            { travelerId: user.id, ownerId: recipientId },
            { travelerId: recipientId, ownerId: user.id },
          ],
        },
        select: { id: true },
      });

      if (!conv) {
        const targetVehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId }, select: { id: true, ownerId: true } });
        if (targetVehicle) {
          conv = await prisma.conversation.create({
            data: {
              vehicleId: targetVehicle.id,
              travelerId: user.id,
              ownerId: targetVehicle.ownerId,
            },
            select: { id: true },
          });
        }
      }

      if (conv) {
        requestedConversationId = conv.id;
      }
    }

    // Si se pide una conversación concreta
    const targetConvId = conversationId || requestedConversationId;
    if (conversationId) {
      const conversation = await prisma.conversation.findUnique({ where: { id: conversationId }, select: { travelerId: true, ownerId: true } });
      if (!conversation || (conversation.travelerId !== user.id && conversation.ownerId !== user.id)) {
        return NextResponse.json({ error: 'No tienes acceso a esta conversación' }, { status: 403 });
      }

      // Marcar mensajes no leídos como leídos
      await prisma.message.updateMany({
        where: {
          conversationId,
          senderId: { not: user.id },
          read: false,
        },
        data: { read: true },
      }).catch(() => {});

      const messages = await prisma.message.findMany({
        where: { conversationId },
        include: {
          sender: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
        },
        orderBy: { createdAt: 'asc' },
      });
      return NextResponse.json({ success: true, messages });
    }

    // Listar todas las conversaciones del usuario
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [{ travelerId: user.id }, { ownerId: user.id }],
      },
      include: {
        vehicle: {
          select: {
            id: true,
            title: true,
            slug: true,
            island: true,
            municipality: true,
            basePricePerDay: true,
            photos: { take: 1, orderBy: { orderIndex: 'asc' } },
          },
        },
        traveler: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
        owner: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
        booking: { select: { id: true, code: true, status: true, pickupDate: true, returnDate: true } },
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      currentUser: { id: user.id, firstName: user.firstName, lastName: user.lastName, avatarUrl: user.avatarUrl },
      conversations,
      requestedConversationId: targetConvId,
    });
  } catch (error) {
    console.error('API Get Messages Error:', error);
    if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
    return NextResponse.json({ error: 'Error al cargar mensajes' }, { status: 500 });
  }
}
