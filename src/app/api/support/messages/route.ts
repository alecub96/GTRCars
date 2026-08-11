import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

function canAccess(user: { id: string; role: string }, conversation: { userId: string }) {
  return user.role === 'ADMIN' || conversation.userId === user.id;
}

export async function GET(request: Request) {
  try {
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
    return NextResponse.json({ error: 'No se pudo cargar el chat de soporte' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
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
    } else {
      conversation = await prisma.supportConversation.upsert({
        where: { userId: user.id },
        update: { status: 'OPEN' },
        create: { userId: user.id },
      });
    }

    const message = await prisma.supportMessage.create({
      data: { conversationId: conversation.id, senderId: user.id, content: cleanContent },
      include: { sender: { select: { id: true, firstName: true, lastName: true, role: true } } },
    });
    await prisma.supportConversation.update({ where: { id: conversation.id }, data: { status: 'OPEN' } });
    return NextResponse.json({ success: true, conversationId: conversation.id, message });
  } catch (error) {
    console.error('Support Messages POST Error:', error);
    return NextResponse.json({ error: 'No se pudo enviar el mensaje' }, { status: 500 });
  }
}
