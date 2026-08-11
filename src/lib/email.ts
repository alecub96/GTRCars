import nodemailer from 'nodemailer';

const smtpPassword = process.env.SMTP_PASSWORD;

const transporter = smtpPassword
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.hostinger.com',
      port: Number(process.env.SMTP_PORT || 465),
      secure: process.env.SMTP_SECURE !== 'false',
      auth: {
        user: process.env.SMTP_USER || 'contacto@vaneando.com',
        pass: smtpPassword,
      },
    })
  : null;

const from = process.env.EMAIL_FROM || 'vaneando. <contacto@vaneando.com>';

export async function sendWelcomeEmail(to: string, firstName: string) {
  if (!transporter) {
    console.warn('Correo de bienvenida omitido: SMTP_PASSWORD no configurada');
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
    throw new Error('SMTP_PASSWORD no está configurada');
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
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: Number(process.env.SMTP_PORT || 465),
    user: process.env.SMTP_USER || 'contacto@vaneando.com',
    from,
  };
}

export async function sendEmailTest(to: string) {
  if (!transporter) throw new Error('SMTP_PASSWORD no está configurada');
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
  if (!transporter) throw new Error('SMTP_PASSWORD no está configurada');
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
  if (!transporter) throw new Error('SMTP_PASSWORD no está configurada');
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vaneando.com';
  await transporter.sendMail({
    from, to,
    subject: `Nueva solicitud ${details.code} para ${details.vehicle}`,
    text: `Hola ${ownerName},\n\n${details.traveler} quiere alquilar ${details.vehicle} del ${details.start.toLocaleDateString('es-ES')} al ${details.end.toLocaleDateString('es-ES')}.\n\nGestiona la solicitud: ${appUrl}/propietario`,
    html: `<p>Hola ${escapeHtml(ownerName)},</p><p><strong>${escapeHtml(details.traveler)}</strong> quiere alquilar <strong>${escapeHtml(details.vehicle)}</strong> del ${escapeHtml(details.start.toLocaleDateString('es-ES'))} al ${escapeHtml(details.end.toLocaleDateString('es-ES'))}.</p><p><a href="${appUrl}/propietario">Aceptar o rechazar la solicitud</a></p>`,
  });
}
