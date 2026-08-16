import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { closeInactiveSupportChats, SUPPORT_WAIT_MESSAGE } from '@/lib/support';
import { databaseUnavailableResponse, isDatabaseUnavailable } from '@/lib/api-error';
import { ensureDbSchema } from '@/lib/prisma-ensure-schema';

function canAccess(user: { id: string; role: string }, conversation: { userId: string }) {
  return user.role === 'ADMIN' || conversation.userId === user.id;
}

export async function GET(request: Request) {
  try {
    await ensureDbSchema();
    await closeInactiveSupportChats().catch((error) => console.error('Support cleanup error:', error));
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

    const conversationId = new URL(request.url).searchParams.get('conversationId');
    if (conversationId) {
      const conversation = await prisma.supportConversation.findUnique({
        where: { id: conversationId },
        select: { userId: true },
      });
      if (!conversation || !canAccess(user, conversation)) {
        return NextResponse.json({ error: 'Acceso restringido' }, { status: 403 });
      }

      const messages = await prisma.supportMessage.findMany({
        where: { conversationId },
        include: { sender: { select: { id: true, firstName: true, lastName: true, role: true } } },
        orderBy: { createdAt: 'asc' },
      });
      await prisma.supportMessage.updateMany({
        where: { conversationId, senderId: { not: user.id }, read: false },
        data: { read: true },
      });
      return NextResponse.json({ success: true, messages });
    }

    if (user.role === 'ADMIN') {
      const conversations = await prisma.supportConversation.findMany({
        include: {
          user: { select: { id: true, firstName: true, lastName: true, email: true, role: true } },
          messages: { orderBy: { createdAt: 'desc' }, take: 1 },
          _count: { select: { messages: { where: { read: false, senderId: { not: user.id } } } } },
        },
        orderBy: { updatedAt: 'desc' },
      });
      return NextResponse.json({ success: true, conversations });
    }

    const conversation = await prisma.supportConversation.findUnique({
      where: { userId: user.id },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true, role: true } },
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    });
    return NextResponse.json({ success: true, conversations: conversation ? [conversation] : [] });
  } catch (error) {
    console.error('Support Messages GET Error:', error);
    if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
    return NextResponse.json({ error: 'No se pudo cargar el chat de soporte' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await ensureDbSchema();
    await closeInactiveSupportChats().catch((error) => console.error('Support cleanup error:', error));
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

    const { conversationId, content } = await request.json();
    const cleanContent = typeof content === 'string' ? content.trim() : '';
    if (!cleanContent || cleanContent.length > 4000) {
      return NextResponse.json({ error: 'Escribe un mensaje de hasta 4.000 caracteres' }, { status: 400 });
    }

    let conversation;
    if (user.role === 'ADMIN') {
      if (!conversationId) return NextResponse.json({ error: 'Selecciona una conversación' }, { status: 400 });
      conversation = await prisma.supportConversation.findUnique({ where: { id: conversationId } });
      if (!conversation) return NextResponse.json({ error: 'Conversación no encontrada' }, { status: 404 });
      if (conversation.status === 'CLOSED') {
        conversation = await prisma.supportConversation.update({
          where: { id: conversation.id },
          data: { status: 'OPEN', closedAt: null, userSummarySentAt: null, adminSummarySentAt: null },
        });
      }
    } else {
      conversation = await prisma.supportConversation.findUnique({ where: { userId: user.id } });
      if (!conversation) {
        conversation = await prisma.supportConversation.create({
          data: {
            userId: user.id,
            messages: { create: { content: SUPPORT_WAIT_MESSAGE, system: true } },
          },
        });
      } else if (conversation.status === 'CLOSED') {
        conversation = await prisma.supportConversation.update({
          where: { id: conversation.id },
          data: {
            status: 'OPEN', closedAt: null, userSummarySentAt: null, adminSummarySentAt: null,
            messages: { create: { content: SUPPORT_WAIT_MESSAGE, system: true } },
          },
        });
      }
    }

    const message = await prisma.supportMessage.create({
      data: { conversationId: conversation.id, senderId: user.id, content: cleanContent },
      include: { sender: { select: { id: true, firstName: true, lastName: true, role: true } } },
    });
    await prisma.supportConversation.update({
      where: { id: conversation.id },
      data: { status: 'OPEN', closedAt: null },
    });
    return NextResponse.json({ success: true, conversationId: conversation.id, message });
  } catch (error) {
    console.error('Support Messages POST Error:', error);
    if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
    return NextResponse.json({ error: 'No se pudo enviar el mensaje' }, { status: 500 });
  }
}
