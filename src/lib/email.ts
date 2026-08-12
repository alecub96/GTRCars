import nodemailer from 'nodemailer';

const smtpPassword = process.env.SMTP_PASSWORD;
const smtpUser = process.env.SMTP_USER || '';
const smtpHost = process.env.SMTP_HOST || 'smtp.hostinger.com';
const smtpPort = Number(process.env.SMTP_PORT || 465);
const smtpSecure = process.env.SMTP_SECURE !== 'false';

const transporter = smtpPassword && smtpUser
  ? nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
      disableFileAccess: true,
      disableUrlAccess: true,
    })
  : null;

const from = process.env.EMAIL_FROM || (smtpUser ? `vaneando. <${smtpUser}>` : '');

export async function sendWelcomeEmail(to: string, firstName: string) {
  if (!transporter) {
    console.warn('Correo de bienvenida omitido: faltan SMTP_USER o SMTP_PASSWORD');
    return;
  }

  await transporter.sendMail({
    from,
    to,
    subject: 'Bienvenido a vaneando.',
    text: `Hola ${firstName},\n\nTu cuenta en vaneando. se ha creado correctamente. Ya puedes descubrir Canarias sobre ruedas.\n\nhttps://vaneando.com`,
    html: `<p>Hola ${firstName},</p><p>Tu cuenta en <strong>vaneando.</strong> se ha creado correctamente.</p><p>Ya puedes descubrir Canarias sobre ruedas.</p><p><a href="https://vaneando.com">Entrar en vaneando.</a></p>`,
  });
}

export async function sendPasswordResetEmail(to: string, firstName: string, resetUrl: string) {
  if (!transporter) {
    throw new Error('Faltan SMTP_USER o SMTP_PASSWORD');
  }

  await transporter.sendMail({
    from,
    to,
    subject: 'Restablece tu contraseña de vaneando.',
    text: `Hola ${firstName},\n\nUsa este enlace para crear una contraseña nueva. Caduca en una hora:\n${resetUrl}\n\nSi no solicitaste el cambio, ignora este correo.`,
    html: `<p>Hola ${firstName},</p><p>Usa el siguiente enlace para crear una contraseña nueva. Caduca en una hora:</p><p><a href="${resetUrl}">Restablecer contraseña</a></p><p>Si no solicitaste el cambio, ignora este correo.</p>`,
  });
}

export function getEmailConfiguration() {
  return {
    configured: Boolean(transporter),
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    user: smtpUser || null,
    from,
    missing: [!smtpUser && 'SMTP_USER', !smtpPassword && 'SMTP_PASSWORD', !from && 'EMAIL_FROM'].filter(Boolean),
  };
}

export async function sendEmailTest(to: string) {
  if (!transporter) throw new Error('Faltan SMTP_USER o SMTP_PASSWORD');
  await transporter.verify();
  await transporter.sendMail({
    from,
    to,
    subject: 'Prueba de correo de vaneando.',
    text: 'La configuración de correo de vaneando. funciona correctamente.',
    html: '<p>La configuración de correo de <strong>vaneando.</strong> funciona correctamente.</p>',
  });
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] || character);
}

export async function sendChatSummaryEmail(to: string, participantName: string, messages: Array<{ author: string; content: string; createdAt: Date }>) {
  if (!transporter) throw new Error('Faltan SMTP_USER o SMTP_PASSWORD');
  const lines = messages.map((message) => `[${message.createdAt.toLocaleString('es-ES')}] ${message.author}: ${message.content}`);
  const rows = messages.map((message) => `<p><small>${escapeHtml(message.createdAt.toLocaleString('es-ES'))}</small><br><strong>${escapeHtml(message.author)}:</strong> ${escapeHtml(message.content)}</p>`).join('');
  await transporter.sendMail({
    from,
    to,
    subject: 'Resumen de tu chat con vaneando.',
    text: `Hola ${participantName},\n\nEl chat se cerró automáticamente después de una hora sin actividad.\n\n${lines.join('\n')}\n\nPuedes abrir una nueva conversación desde tu cuenta.`,
    html: `<p>Hola ${escapeHtml(participantName)},</p><p>El chat se cerró automáticamente después de una hora sin actividad.</p>${rows}<p>Puedes abrir una nueva conversación desde tu cuenta.</p>`,
  });
}

export async function sendBookingRequestEmail(to: string, ownerName: string, details: { code: string; vehicle: string; traveler: string; start: Date; end: Date }) {
  if (!transporter) throw new Error('Faltan SMTP_USER o SMTP_PASSWORD');
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vaneando.com';
  await transporter.sendMail({
    from, to,
    subject: `Nueva solicitud ${details.code} para ${details.vehicle}`,
    text: `Hola ${ownerName},\n\n${details.traveler} quiere alquilar ${details.vehicle} del ${details.start.toLocaleDateString('es-ES')} al ${details.end.toLocaleDateString('es-ES')}.\n\nGestiona la solicitud: ${appUrl}/propietario`,
    html: `<p>Hola ${escapeHtml(ownerName)},</p><p><strong>${escapeHtml(details.traveler)}</strong> quiere alquilar <strong>${escapeHtml(details.vehicle)}</strong> del ${escapeHtml(details.start.toLocaleDateString('es-ES'))} al ${escapeHtml(details.end.toLocaleDateString('es-ES'))}.</p><p><a href="${appUrl}/propietario">Aceptar o rechazar la solicitud</a></p>`,
  });
}

export async function sendBookingStatusEmail(to: string, firstName: string, details: { code: string; status: string; vehicle: string; reservationId: string; appUrl?: string }) {
  if (!transporter) return;
  const labels: Record<string, string> = { OWNER_ACCEPTED: 'El propietario ha aceptado tu solicitud', OWNER_REJECTED: 'El propietario no ha podido aceptar tu solicitud', CANCELLED: 'La reserva ha sido cancelada', CONFIRMED: 'Tu reserva está confirmada', REFUNDED: 'Tu reserva ha sido reembolsada' };
  const message = labels[details.status] || 'La reserva se ha actualizado';
  const url = `${details.appUrl || process.env.NEXT_PUBLIC_APP_URL || 'https://vaneando.com'}/reserva/${details.reservationId}`;
  await transporter.sendMail({ from, to, subject: `${message} · ${details.vehicle}`, text: `Hola ${firstName},\n\n${message} para ${details.vehicle}. Código: ${details.code}.\n\nConsulta tu reserva: ${url}`, html: `<p>Hola ${escapeHtml(firstName)},</p><p><strong>${escapeHtml(message)}</strong> para ${escapeHtml(details.vehicle)}.</p><p>Código: ${escapeHtml(details.code)}</p><p><a href="${url}">Ver reserva</a></p>` });
}
