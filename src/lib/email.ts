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
