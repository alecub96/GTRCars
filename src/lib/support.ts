import { getConfiguredAdminEmails } from './admin';
import { sendChatSummaryEmail, sendUnreadMessageNotificationEmail } from './email';
import { prisma } from './prisma';

export const SUPPORT_INACTIVITY_MS = 60 * 60 * 1000;
export const SUPPORT_WAIT_MESSAGE = '¡Bienvenido al servicio Concierge de GTRCars.es! Hemos recibido tu consulta. El tiempo habitual de respuesta es de 15 minutos. Si no hay actividad durante una hora, el chat se cerrará y recibirás un resumen por correo.';

// 30 minutos de tiempo de espera antes de enviar aviso por email al destinatario
export const P2P_UNREAD_NOTIFICATION_DELAY_MS = 30 * 60 * 1000;

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
      author: message.system ? 'Equipo GTRCars' : message.sender?.role === 'ADMIN' ? 'Equipo GTRCars' : `${message.sender?.firstName || 'Usuario'} ${message.sender?.lastName || ''}`.trim(),
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

/**
 * Notificación por email para mensajes P2P no leídos / no contestados tras 30 minutos.
 * Comprueba los mensajes recibidos hace más de 30 minutos sin leer, o conversaciones
 * donde el último mensaje tiene más de 30 minutos y no ha habido réplica.
 */
export async function notifyUnreadP2PMessages() {
  const thirtyMinutesAgo = new Date(Date.now() - P2P_UNREAD_NOTIFICATION_DELAY_MS);
  // Buscar conversaciones activas
  const conversations = await prisma.conversation.findMany({
    where: {
      updatedAt: { lte: thirtyMinutesAgo },
    },
    include: {
      traveler: { select: { id: true, email: true, firstName: true, lastName: true } },
      owner: { select: { id: true, email: true, firstName: true, lastName: true } },
      vehicle: { select: { title: true } },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        include: {
          sender: { select: { id: true, firstName: true, lastName: true } },
        },
      },
    },
  });

  let notificationsSent = 0;

  for (const conv of conversations) {
    const lastMessage = conv.messages[0];
    // Si no hay mensajes o el último mensaje ya está marcado como leído, no enviar aviso
    if (!lastMessage || lastMessage.read) {
      continue;
    }

    // Comprobar si el mensaje fue enviado hace al menos 30 minutos
    if (new Date(lastMessage.createdAt).getTime() > thirtyMinutesAgo.getTime()) {
      continue;
    }

    // Identificar quién es el receptor
    const isSenderTraveler = lastMessage.senderId === conv.travelerId;
    const recipient = isSenderTraveler ? conv.owner : conv.traveler;
    const sender = isSenderTraveler ? conv.traveler : conv.owner;

    if (!recipient?.email) {
      continue;
    }

    try {
      const senderDisplayName = sender ? `${sender.firstName} ${sender.lastName || ''}`.trim() : 'Otro miembro';
      const recipientDisplayName = recipient.firstName || 'Usuario';

      await sendUnreadMessageNotificationEmail(
        recipient.email,
        recipientDisplayName,
        senderDisplayName,
        lastMessage.content,
        conv.id,
        conv.vehicle?.title
      );

      notificationsSent += 1;
    } catch (err) {
      console.error(`Error sending unread message email for conversation ${conv.id}:`, err);
    }
  }

  return { processed: conversations.length, notificationsSent };
}
