import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';
import { databaseUnavailableResponse, isDatabaseUnavailable } from '@/lib/api-error';
import { ensureDbSchema } from '@/lib/prisma-ensure-schema';

export const dynamic = 'force-dynamic';

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

      return NextResponse.json({ success: true, conversation });
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

    // Filtrar si hay término de búsqueda
    if (q) {
      conversations = conversations.filter((c) => {
        const travelerName = `${c.traveler?.firstName || ''} ${c.traveler?.lastName || ''} ${c.traveler?.email || ''}`.toLowerCase();
        const ownerName = `${c.owner?.firstName || ''} ${c.owner?.lastName || ''} ${c.owner?.email || ''}`.toLowerCase();
        const vehicleTitle = (c.vehicle?.title || '').toLowerCase();
        const lastMsg = (c.messages?.[0]?.content || '').toLowerCase();
        return travelerName.includes(q) || ownerName.includes(q) || vehicleTitle.includes(q) || lastMsg.includes(q);
      });
    }

    const totalConversations = await prisma.conversation.count().catch(() => conversations.length);
    const totalMessages = await prisma.message.count().catch(() => 0);

    return NextResponse.json({
      success: true,
      conversations,
      metrics: {
        totalConversations,
        totalMessages,
      },
    });
  } catch (error: any) {
    console.error('API Admin Conversations Error:', error);
    if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
    return NextResponse.json({ error: error?.message || 'Error al cargar las conversaciones para auditoría' }, { status: 500 });
  }
}
