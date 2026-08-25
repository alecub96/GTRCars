import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';
import { databaseUnavailableResponse, isDatabaseUnavailable } from '@/lib/api-error';
import { ensureDbSchema } from '@/lib/prisma-ensure-schema';

export const dynamic = 'force-dynamic';

function maskEmail(email?: string | null) {
  if (!email) return 'anonimo@privacidad.vaneando';
  const parts = email.split('@');
  if (parts.length !== 2) return 'u***@***.com';
  const name = parts[0];
  const domain = parts[1];
  const maskedName = name.length > 2 ? `${name[0]}***${name[name.length - 1]}` : `${name[0]}***`;
  return `${maskedName}@***.${domain.split('.').pop() || 'com'}`;
}

function anonymizeUser(user: any, defaultRole: 'Viajero' | 'Propietario') {
  if (!user) return null;
  const shortId = (user.id || '').replace(/-/g, '').slice(0, 6).toUpperCase();
  return {
    id: user.id,
    firstName: `${defaultRole} #${shortId}`,
    lastName: '',
    email: maskEmail(user.email),
    phone: '[Protegido por RGPD]',
    avatarUrl: '/default-avatar.svg',
    isAnonymous: true,
  };
}

export async function GET(request: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'No autorizado como administrador' }, { status: 403 });
    }

    await ensureDbSchema().catch(() => {});

    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');
    const q = searchParams.get('q')?.trim().toLowerCase();

    // 1. Si se solicita inspeccionar una conversación en detalle
    if (conversationId) {
      const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
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
          traveler: { select: { id: true, firstName: true, lastName: true, email: true, phone: true, avatarUrl: true } },
          owner: { select: { id: true, firstName: true, lastName: true, email: true, phone: true, avatarUrl: true } },
          booking: { select: { id: true, code: true, status: true, totalAmount: true, pickupDate: true, returnDate: true } },
          messages: {
            include: {
              sender: { select: { id: true, firstName: true, lastName: true, email: true, role: true, avatarUrl: true } },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      if (!conversation) {
        return NextResponse.json({ error: 'Conversación no encontrada' }, { status: 404 });
      }

      // Anonimizar participantes y mensajes para proteger la privacidad de los usuarios
      const anonTraveler = anonymizeUser(conversation.traveler, 'Viajero');
      const anonOwner = anonymizeUser(conversation.owner, 'Propietario');

      const anonymizedMessages = (conversation.messages || []).map((m: any) => {
        const isTraveler = m.sender?.id === conversation.travelerId;
        const shortId = (m.sender?.id || '').replace(/-/g, '').slice(0, 6).toUpperCase();
        return {
          ...m,
          sender: {
            id: m.sender?.id,
            firstName: isTraveler ? `Viajero #${shortId}` : `Propietario #${shortId}`,
            lastName: '',
            email: maskEmail(m.sender?.email),
            role: isTraveler ? 'TRAVELER' : 'OWNER',
            avatarUrl: '/default-avatar.svg',
          },
        };
      });

      return NextResponse.json({
        success: true,
        conversation: {
          ...conversation,
          traveler: anonTraveler,
          owner: anonOwner,
          messages: anonymizedMessages,
          rgpdComplianceNotice: 'Identidades anonimizadas conforme al Art. 5.1.c RGPD (Principio de minimización de datos).',
        },
      });
    }

    // 2. Listar todas las conversaciones de la plataforma para auditoría
    let conversations: any[] = [];
    try {
      conversations = await prisma.conversation.findMany({
        include: {
          vehicle: {
            select: {
              id: true,
              title: true,
              slug: true,
              island: true,
              basePricePerDay: true,
              photos: { take: 1, orderBy: { orderIndex: 'asc' } },
            },
          },
          traveler: { select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true } },
          owner: { select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true } },
          booking: { select: { id: true, code: true, status: true } },
          _count: {
            select: { messages: true },
          },
          messages: {
            take: 1,
            orderBy: { createdAt: 'desc' },
            select: { content: true, createdAt: true, senderId: true },
          },
        },
        orderBy: { updatedAt: 'desc' },
      });
    } catch (countErr) {
      console.warn('Admin conversations _count fallback:', countErr);
      conversations = await prisma.conversation.findMany({
        include: {
          vehicle: { select: { id: true, title: true, slug: true, island: true } },
          traveler: { select: { id: true, firstName: true, lastName: true, email: true } },
          owner: { select: { id: true, firstName: true, lastName: true, email: true } },
          messages: { take: 1, orderBy: { createdAt: 'desc' } },
        },
        orderBy: { updatedAt: 'desc' },
      }).catch(() => []);
    }

    // Anonimizar listado completo
    const anonymizedList = conversations.map((c) => ({
      ...c,
      traveler: anonymizeUser(c.traveler, 'Viajero'),
      owner: anonymizeUser(c.owner, 'Propietario'),
    }));

    // Filtrar si hay término de búsqueda
    let filteredList = anonymizedList;
    if (q) {
      filteredList = anonymizedList.filter((c) => {
        const travelerName = `${c.traveler?.firstName || ''} ${c.traveler?.email || ''}`.toLowerCase();
        const ownerName = `${c.owner?.firstName || ''} ${c.owner?.email || ''}`.toLowerCase();
        const vehicleTitle = (c.vehicle?.title || '').toLowerCase();
        const lastMsg = (c.messages?.[0]?.content || '').toLowerCase();
        return travelerName.includes(q) || ownerName.includes(q) || vehicleTitle.includes(q) || lastMsg.includes(q);
      });
    }

    const totalConversations = await prisma.conversation.count().catch(() => conversations.length);
    const totalMessages = await prisma.message.count().catch(() => 0);

    return NextResponse.json({
      success: true,
      conversations: filteredList,
      metrics: {
        totalConversations,
        totalMessages,
      },
      rgpdProtection: 'Modo Anonimizado Activo',
    });
  } catch (error: any) {
    console.error('API Admin Conversations Error:', error);
    if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
    return NextResponse.json({ error: error?.message || 'Error al cargar las conversaciones para auditoría' }, { status: 500 });
  }
}
