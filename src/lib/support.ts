import { getConfiguredAdminEmails } from './admin';
import { sendChatSummaryEmail } from './email';
import { prisma } from './prisma';

export const SUPPORT_INACTIVITY_MS = 60 * 60 * 1000;
export const SUPPORT_WAIT_MESSAGE = '¡Bienvenido al chat de soporte de vaneando.! Hemos recibido tu mensaje. El tiempo de respuesta habitual es de unos 15 minutos. Si no hay actividad durante una hora, el chat se cerrará automáticamente y recibirás un resumen por correo.';

export async function closeInactiveSupportChats() {
  const cutoff = new Date(Date.now() - SUPPORT_INACTIVITY_MS);
  const conversations = await prisma.supportConversation.findMany({
    where: {
      OR: [
        { status: 'OPEN', updatedAt: { lt: cutoff } },
        { status: 'CLOSED', OR: [{ userSummarySentAt: null }, { adminSummarySentAt: null }] },
      ],
    },
    include: {
      user: { select: { email: true, firstName: true, lastName: true } },
      messages: {
        include: { sender: { select: { firstName: true, lastName: true, role: true } } },
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  let closed = 0;
  let summariesSent = 0;
  for (const conversation of conversations) {
    if (conversation.status === 'OPEN') {
      await prisma.supportConversation.update({ where: { id: conversation.id }, data: { status: 'CLOSED', closedAt: new Date() } });
      closed += 1;
    }

    const summary = conversation.messages.map((message) => ({
      author: message.system ? 'Equipo vaneando.' : message.sender?.role === 'ADMIN' ? 'Equipo vaneando.' : `${message.sender?.firstName || 'Usuario'} ${message.sender?.lastName || ''}`.trim(),
      content: message.content,
      createdAt: message.createdAt,
    }));

    if (!conversation.userSummarySentAt) {
      try {
        await sendChatSummaryEmail(conversation.user.email, conversation.user.firstName, summary);
        await prisma.supportConversation.update({ where: { id: conversation.id }, data: { userSummarySentAt: new Date() } });
        summariesSent += 1;
      } catch (error) {
        console.error('User chat summary email error:', error);
      }
    }

    if (!conversation.adminSummarySentAt) {
      const adminEmails = getConfiguredAdminEmails();
      if (adminEmails.length) {
        try {
          await Promise.all(adminEmails.map((email) => sendChatSummaryEmail(email, 'Administrador', summary)));
          await prisma.supportConversation.update({ where: { id: conversation.id }, data: { adminSummarySentAt: new Date() } });
          summariesSent += adminEmails.length;
        } catch (error) {
          console.error('Admin chat summary email error:', error);
        }
      }
    }
  }

  return { processed: conversations.length, closed, summariesSent };
}
