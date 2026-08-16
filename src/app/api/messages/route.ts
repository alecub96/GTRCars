import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { databaseUnavailableResponse, isDatabaseUnavailable } from '@/lib/api-error';

// REGEX DE BLINDAJE ANTI-BYPASS Y ANTI-FRAUDE
// 1. Detección de números de teléfono (españoles o internacionales, con espacios, puntos, guiones o texto disimulado "seis doce...")
const PHONE_REGEX = /(\+?34|0034)?[\s\.\-_]*[6789](\s*\d){8}/i;
const SPELLED_NUMBERS_REGEX = /(seis|siete|ocho|nueve|cero|uno|dos|tres|cuatro|cinco)[\s\.\-_]+(seis|siete|ocho|nueve|cero|uno|dos|tres|cuatro|cinco)/i;

// 2. Detección de correos electrónicos
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i;
const AT_SPELLED_REGEX = /(arroba|at|gmail|hotmail|yahoo|outlook|icloud)/i;

// 3. Detección de competidores y plataformas externas
const COMPETITORS_REGEX = /(yescapa|booking|airbnb|wikiloc|milanuncios|wallapop|idealista|furgovw|campercontact|park4night)/i;

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
        { error: '🛡️ Seguridad: No está permitido mencionar plataformas externas o de la competencia (Yescapa, Booking, etc.).' },
        { status: 422 }
      );
    }

    let activeConversationId = conversationId;

    if (activeConversationId) {
      const conversation = await prisma.conversation.findUnique({ where: { id: activeConversationId } });
      if (!conversation || (conversation.travelerId !== user.id && conversation.ownerId !== user.id)) {
        return NextResponse.json({ error: 'No tienes acceso a esta conversación' }, { status: 403 });
      }
    }

    // Si es la primera interacción, crear la conversación
    if (!activeConversationId) {
      if (!vehicleId || !recipientId) {
        return NextResponse.json({ error: 'Parámetros de conversación incompletos' }, { status: 400 });
      }

      const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId }, select: { ownerId: true, status: true } });
      if (!vehicle || vehicle.status !== 'ACTIVE' || vehicle.ownerId !== recipientId || recipientId === user.id) {
        return NextResponse.json({ error: 'No se puede iniciar esta conversación' }, { status: 403 });
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
        sender: { select: { firstName: true, lastName: true, avatarUrl: true } },
      },
    });

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

    let requestedConversationId: string | null = null;
    if (bookingId) {
      const booking = await prisma.booking.findUnique({ where: { id: bookingId }, select: { id: true, travelerId: true, ownerId: true, vehicleId: true } });
      if (!booking || ![booking.travelerId, booking.ownerId].includes(user.id)) {
        return NextResponse.json({ error: 'No tienes acceso a esta reserva' }, { status: 403 });
      }
      let conversation = await prisma.conversation.findFirst({ where: { bookingId: booking.id }, select: { id: true } });
      if (!conversation) {
        conversation = await prisma.conversation.create({
          data: { bookingId: booking.id, travelerId: booking.travelerId, ownerId: booking.ownerId, vehicleId: booking.vehicleId },
          select: { id: true },
        });
      }
      requestedConversationId = conversation.id;
    }

    if (conversationId) {
      const conversation = await prisma.conversation.findUnique({ where: { id: conversationId }, select: { travelerId: true, ownerId: true } });
      if (!conversation || (conversation.travelerId !== user.id && conversation.ownerId !== user.id)) {
        return NextResponse.json({ error: 'No tienes acceso a esta conversación' }, { status: 403 });
      }
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
        vehicle: { select: { title: true, photos: { take: 1 } } },
        traveler: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
        owner: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ success: true, conversations, requestedConversationId });
  } catch (error) {
    console.error('API Get Messages Error:', error);
    if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
    return NextResponse.json({ error: 'Error al cargar mensajes' }, { status: 500 });
  }
}
