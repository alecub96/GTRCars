import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const smtpPassword = process.env.SMTP_PASSWORD || 'Vaneando2026!Smtp';
const smtpUser = process.env.SMTP_USER || 'contacto@vaneando.com';
const smtpHost = process.env.SMTP_HOST || 'smtp.hostinger.com';
const smtpPort = Number(process.env.SMTP_PORT || 465);
const smtpSecure = process.env.SMTP_SECURE !== 'false';

const transporter = smtpPassword && smtpUser
  ? nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: { user: smtpUser, pass: smtpPassword },
      disableFileAccess: true,
      disableUrlAccess: true,
    })
  : null;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, island, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Por favor, completa los campos obligatorios (Nombre, Email y Mensaje).' },
        { status: 400 }
      );
    }

    if (!email.includes('@') || email.length < 5) {
      return NextResponse.json(
        { error: 'Introduce un correo electrónico válido.' },
        { status: 400 }
      );
    }

    if (transporter) {
      await transporter.sendMail({
        from: `vaneando. <${smtpUser}>`,
        to: smtpUser,
        replyTo: email,
        subject: `[Contacto Web] ${subject || 'Consulta General'} - ${name}`,
        text: `Nuevo mensaje de contacto desde vaneando.com:\n\nNombre: ${name}\nEmail: ${email}\nTeléfono: ${phone || 'No indicado'}\nIsla: ${island || 'Todas'}\nAsunto: ${subject}\n\nMensaje:\n${message}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; background: #F7F6F2; color: #13322E;">
            <div style="max-width: 550px; margin: 0 auto; background: white; border-radius: 16px; p: 24px; border: 1px solid #E9E1D2; padding: 24px;">
              <h2 style="color: #16B8AA; margin-top: 0;">Nuevo mensaje de contacto</h2>
              <p><strong>Nombre:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Teléfono:</strong> ${phone || 'No especificado'}</p>
              <p><strong>Isla de interés:</strong> ${island || 'Canarias'}</p>
              <p><strong>Asunto:</strong> ${subject || 'Consulta general'}</p>
              <hr style="border: none; border-top: 1px solid #E9E1D2; margin: 20px 0;" />
              <p style="white-space: pre-wrap; font-size: 14px; line-height: 1.6;">${message}</p>
            </div>
          </div>
        `,
      }).catch((err: any) => console.error('Error enviando email de contacto:', err));
    }

    return NextResponse.json({
      success: true,
      message: '¡Tu mensaje ha sido enviado con éxito! Nos pondremos en contacto contigo en menos de 24 horas.',
    });
  } catch (error: any) {
    console.error('Error en API de contacto:', error);
    return NextResponse.json(
      { error: 'No se pudo enviar el mensaje en este momento. Inténtalo de nuevo.' },
      { status: 500 }
    );
  }
}
