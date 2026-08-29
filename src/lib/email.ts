import nodemailer from 'nodemailer';

const smtpPassword = process.env.SMTP_PASSWORD || '';
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

const from = process.env.EMAIL_FROM || (smtpUser ? `vaneando. <${smtpUser}>` : 'vaneando. <contacto@vaneando.com>');

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] || character);
}

/**
 * Plantilla Maestra HTML para todos los correos de Vaneando.com
 */
function renderEmailLayout({
  title,
  previewText,
  contentHtml,
  ctaText,
  ctaUrl,
}: {
  title: string;
  previewText?: string;
  contentHtml: string;
  ctaText?: string;
  ctaUrl?: string;
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vaneando.com';

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F7F6F2; margin: 0; padding: 0; color: #13322E; }
    .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #E9E1D2; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
    .header { background-color: #13322E; padding: 32px; text-align: center; color: #ffffff; }
    .header h1 { font-family: Georgia, serif; margin: 0; font-size: 32px; font-weight: bold; letter-spacing: -0.5px; }
    .header h1 span { color: #16B8AA; }
    .header p { margin: 6px 0 0 0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #16B8AA; opacity: 0.9; }
    .body { padding: 36px 32px; font-size: 15px; line-height: 1.6; color: #2D3748; }
    .button-container { text-align: center; margin: 32px 0 24px 0; }
    .btn { display: inline-block; background-color: #16B8AA; color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-weight: 800; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 14px rgba(22, 184, 170, 0.3); }
    .btn:hover { background-color: #0F766E; }
    .card { background-color: #FAF7F0; border: 1px solid #E9E1D2; border-radius: 16px; padding: 20px; margin: 24px 0; }
    .invoice-table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px; }
    .invoice-table th { text-align: left; padding: 10px 0; border-bottom: 2px solid #E9E1D2; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #6B726E; }
    .invoice-table td { padding: 12px 0; border-bottom: 1px solid #E9E1D2; }
    .invoice-total { font-size: 18px; font-weight: bold; color: #13322E; text-align: right; padding-top: 14px; }
    .footer { background-color: #F7F6F2; padding: 24px 32px; text-align: center; font-size: 12px; color: #718096; border-top: 1px solid #E9E1D2; }
    .footer a { color: #16B8AA; text-decoration: none; font-weight: bold; }
  </style>
</head>
<body>
  ${previewText ? `<div style="display:none;font-size:1px;color:#333;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${escapeHtml(previewText)}</div>` : ''}
  <div class="container">
    <div class="header">
      <h1>vaneando<span>.com</span></h1>
      <p>Canarias sobre ruedas</p>
    </div>
    <div class="body">
      ${contentHtml}
      ${ctaText && ctaUrl ? `
        <div class="button-container">
          <a href="${ctaUrl}" class="btn" target="_blank">${escapeHtml(ctaText)}</a>
        </div>
      ` : ''}
    </div>
    <div class="footer">
  <p><strong>vaneando.com</strong> — Alquiler de campers y vehículos recreativos en las Islas Canarias.</p>
      <p>¿Tienes alguna duda? Contáctanos en <a href="mailto:contacto@vaneando.com">contacto@vaneando.com</a></p>
      <p style="margin-top:12px;font-size:11px;color:#A0AEC0;">
        Las Palmas de Gran Canaria / Santa Cruz de Tenerife · España<br>
        Desglose de precio · Información del anuncio · Soporte de reserva
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * 1. Correo de Bienvenida al Registrarse
 */
export async function sendWelcomeEmail(to: string, firstName: string) {
  if (!transporter) {
    console.warn('Correo de bienvenida omitido: faltan SMTP_USER o SMTP_PASSWORD');
    return;
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vaneando.com';
  const title = `¡Bienvenido a vaneando.com, ${firstName}!`;
  const previewText = `Tu cuenta ha sido creada con éxito. Empieza a descubrir las Islas Canarias sobre ruedas.`;

  const contentHtml = `
    <h2 style="font-family: Georgia, serif; color: #13322E; margin-top: 0;">¡Hola ${escapeHtml(firstName)}! 👋</h2>
    <p>Te damos la bienvenida a <strong>vaneando.com</strong>, la comunidad de viajeros y propietarios locales de furgonetas camperizadas y autocaravanas de las Islas Canarias.</p>
    
    <div class="card">
      <h3 style="margin-top: 0; color: #13322E; font-size: 16px;">🔐 Datos de tu Cuenta de Acceso</h3>
      <p style="margin: 6px 0;"><strong>Correo Electrónico:</strong> ${escapeHtml(to)}</p>
      <p style="margin: 6px 0;"><strong>Plataforma:</strong> <a href="${appUrl}" style="color:#16B8AA;font-weight:bold;">vaneando.com</a></p>
      <p style="margin: 6px 0; font-size: 13px; color: #6B726E;">Ya puedes iniciar sesión en cualquier momento con tu correo y contraseña elegida.</p>
    </div>

    <h3 style="color: #13322E; font-size: 16px; margin-top: 24px;">🏝️ Lo que puedes hacer ahora:</h3>
    <ul style="padding-left: 20px; color: #4A5568;">
      <li><strong>Explorar el archipiélago:</strong> Encuentra campers en Gran Canaria, Tenerife, Lanzarote, Fuerteventura y más.</li>
      <li><strong>Alquilar a locales:</strong> Vehículos únicos, económicos y con recomendaciones secretas de pernocta.</li>
      <li><strong>Publicar tu camper:</strong> Si tienes una furgoneta o autocaravana, consulta las condiciones y publica información precisa del vehículo.</li>
    </ul>

    <p style="margin-top: 24px;">¡Nos vemos en la carretera!</p>
    <p><strong>El equipo de vaneando.com</strong></p>
  `;

  await transporter.sendMail({
    from,
    to,
    subject: `¡Bienvenido a vaneando.com, ${firstName}! 🚐✨`,
    text: `Hola ${firstName},\n\n¡Bienvenido a vaneando.com! Tu cuenta con el correo ${to} se ha creado correctamente.\n\nEntra ahora y descubre Canarias sobre ruedas: ${appUrl}\n\nContacto: hola@vaneando.com`,
    html: renderEmailLayout({
      title,
      previewText,
      contentHtml,
      ctaText: 'Entrar a mi Cuenta',
      ctaUrl: `${appUrl}/cuenta`,
    }),
  });
}

/**
 * 2. Correo de Confirmación de Pago y Factura / Recibo
 */
export async function sendPaymentInvoiceEmail(
  to: string,
  firstName: string,
  invoice: {
    invoiceNumber: string;
    bookingCode: string;
    vehicleTitle: string;
    startDate: string;
    endDate: string;
    totalDays: number;
    baseAmount: number;
    serviceFee: number;
    taxAmount: number;
    totalAmount: number;
    reservationId: string;
  }
) {
  if (!transporter) {
    console.warn('Correo de factura omitido: faltan SMTP_USER o SMTP_PASSWORD');
    return;
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vaneando.com';
  const title = `Factura y Confirmación de Pago · ${invoice.invoiceNumber}`;
  const previewText = `Hemos recibido tu pago de ${invoice.totalAmount.toFixed(2)}€ para la reserva ${invoice.bookingCode}.`;

  const contentHtml = `
    <h2 style="font-family: Georgia, serif; color: #13322E; margin-top: 0;">¡Pago Confirmado y Factura Emitida! 🎉</h2>
    <p>Hola ${escapeHtml(firstName)}, gracias por tu pago. Tu reserva para disfrutar de <strong>${escapeHtml(invoice.vehicleTitle)}</strong> está 100% confirmada.</p>
    
    <div class="card">
      <table style="width:100%; font-size: 13px;">
        <tr>
          <td><strong>Nº de Factura:</strong> ${escapeHtml(invoice.invoiceNumber)}</td>
          <td style="text-align:right;"><strong>Código Reserva:</strong> ${escapeHtml(invoice.bookingCode)}</td>
        </tr>
        <tr>
          <td><strong>Fecha de Emisión:</strong> ${new Date().toLocaleDateString('es-ES')}</td>
          <td style="text-align:right;"><strong>Estado:</strong> <span style="color:#16B8AA;font-weight:bold;">PAGADO (Stripe SSL)</span></td>
        </tr>
      </table>
    </div>

    <h3 style="color: #13322E; font-size: 16px; margin-top: 24px;">📋 Detalle de la Reserva y Alquiler</h3>
    <p style="margin: 4px 0; font-size: 14px;"><strong>Vehículo:</strong> ${escapeHtml(invoice.vehicleTitle)}</p>
    <p style="margin: 4px 0; font-size: 14px;"><strong>Fechas:</strong> Del ${escapeHtml(invoice.startDate)} al ${escapeHtml(invoice.endDate)} (${invoice.totalDays} ${invoice.totalDays === 1 ? 'día' : 'días'})</p>

    <table class="invoice-table">
      <thead>
        <tr>
          <th>Concepto</th>
          <th style="text-align:right;">Importe</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Alquiler de camper (${invoice.totalDays} días)</td>
          <td style="text-align:right;">${invoice.baseAmount.toFixed(2)} €</td>
        </tr>
        <tr>
          <td>Gastos de Gestión y Cobertura Vaneando</td>
          <td style="text-align:right;">${invoice.serviceFee.toFixed(2)} €</td>
        </tr>
        <tr>
          <td style="color:#6B726E; font-size:12px;">Impuestos e IGIC (7% incl.)</td>
          <td style="text-align:right; color:#6B726E; font-size:12px;">${invoice.taxAmount.toFixed(2)} €</td>
        </tr>
      </tbody>
    </table>

    <div class="invoice-total">
      Total Pagado: <span style="color:#16B8AA;">${invoice.totalAmount.toFixed(2)} €</span>
    </div>

    <p style="margin-top: 28px; font-size: 13px; color: #6B726E;">
      Esta confirmación sirve como comprobante del pago registrado para tu reserva. Consulta la ficha completa y las instrucciones de entrega en tu perfil.
    </p>
  `;

  await transporter.sendMail({
    from,
    to,
    subject: `Factura ${invoice.invoiceNumber} · Pago Confirmado de tu Camper 🧾✨`,
    text: `Hola ${firstName},\n\nPago confirmado para ${invoice.vehicleTitle}. Factura: ${invoice.invoiceNumber}. Total: ${invoice.totalAmount.toFixed(2)}€.\n\nVer reserva: ${appUrl}/reserva/${invoice.reservationId}`,
    html: renderEmailLayout({
      title,
      previewText,
      contentHtml,
      ctaText: 'Ver Ficha de Reserva',
      ctaUrl: `${appUrl}/reserva/${invoice.reservationId}`,
    }),
  });
}

/**
 * 3. Restablecimiento de Contraseña
 */
export async function sendPasswordResetEmail(to: string, firstName: string, resetUrl: string) {
  if (!transporter) {
    throw new Error('Faltan SMTP_USER o SMTP_PASSWORD');
  }

  const title = 'Restablece tu contraseña de vaneando.com';
  const previewText = 'Usa este enlace para restablecer la contraseña de tu cuenta. Caduca en una hora.';

  const contentHtml = `
    <h2 style="font-family: Georgia, serif; color: #13322E; margin-top: 0;">Restablecer Contraseña 🔐</h2>
    <p>Hola ${escapeHtml(firstName)}, hemos recibido una solicitud para cambiar la contraseña de tu cuenta en <strong>vaneando.com</strong>.</p>
    <p>Haz clic en el siguiente botón para crear una contraseña nueva. Por seguridad, este enlace caducará en 1 hora.</p>
    <p style="font-size: 13px; color: #6B726E; margin-top: 20px;">Si no solicitaste este cambio, puedes ignorar este correo de forma segura.</p>
  `;

  await transporter.sendMail({
    from,
    to,
    subject: 'Restablece tu contraseña de vaneando.com 🔐',
    text: `Hola ${firstName},\n\nUsa este enlace para crear una contraseña nueva. Caduca en una hora:\n${resetUrl}\n\nSi no solicitaste el cambio, ignora este correo.`,
    html: renderEmailLayout({
      title,
      previewText,
      contentHtml,
      ctaText: 'Cambiar Contraseña',
      ctaUrl: resetUrl,
    }),
  });
}

/**
 * 4. Notificaciones de Estado de Reserva
 */
export async function sendBookingStatusEmail(
  to: string,
  firstName: string,
  details: { code: string; status: string; vehicle: string; reservationId: string; appUrl?: string }
) {
  if (!transporter) return;

  const labels: Record<string, string> = {
    OWNER_ACCEPTED: 'El propietario ha aceptado tu solicitud de reserva',
    OWNER_REJECTED: 'El propietario no ha podido aceptar tu solicitud',
    CANCELLED: 'La reserva ha sido cancelada',
    CONFIRMED: '¡Tu reserva está confirmada y lista!',
    REFUNDED: 'Tu reserva ha sido reembolsada correctamente',
  };

  const message = labels[details.status] || 'La reserva se ha actualizado';
  const url = `${details.appUrl || process.env.NEXT_PUBLIC_APP_URL || 'https://vaneando.com'}/reserva/${details.reservationId}`;

  const contentHtml = `
    <h2 style="font-family: Georgia, serif; color: #13322E; margin-top: 0;">Actualización de Reserva 🚐</h2>
    <p>Hola ${escapeHtml(firstName)},</p>
    <div class="card">
      <h3 style="margin-top:0; color:#13322E;">${escapeHtml(message)}</h3>
      <p style="margin: 4px 0;"><strong>Vehículo:</strong> ${escapeHtml(details.vehicle)}</p>
      <p style="margin: 4px 0;"><strong>Código de Reserva:</strong> ${escapeHtml(details.code)}</p>
    </div>
    <p>Puedes acceder a la plataforma para ver todos los detalles, comunicarte con el propietario o consultar el estado del alquiler.</p>
  `;

  await transporter.sendMail({
    from,
    to,
    subject: `${message} · ${details.vehicle}`,
    text: `Hola ${firstName},\n\n${message} para ${details.vehicle}. Código: ${details.code}.\n\nConsulta tu reserva: ${url}`,
    html: renderEmailLayout({
      title: message,
      previewText: `${message} para ${details.vehicle}.`,
      contentHtml,
      ctaText: 'Ver Reserva',
      ctaUrl: url,
    }),
  });
}

/**
 * 5. Notificación al Propietario de Nueva Solicitud
 */
export async function sendBookingRequestEmail(
  to: string,
  ownerName: string,
  details: { code: string; vehicle: string; traveler: string; start: Date; end: Date }
) {
  if (!transporter) throw new Error('Faltan SMTP_USER o SMTP_PASSWORD');
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vaneando.com';

  const contentHtml = `
    <h2 style="font-family: Georgia, serif; color: #13322E; margin-top: 0;">¡Tienes una nueva solicitud de alquiler! 📥</h2>
    <p>Hola ${escapeHtml(ownerName)}, un viajero quiere alquilar tu camper.</p>
    <div class="card">
      <p style="margin: 4px 0;"><strong>Viajero:</strong> ${escapeHtml(details.traveler)}</p>
      <p style="margin: 4px 0;"><strong>Vehículo:</strong> ${escapeHtml(details.vehicle)}</p>
      <p style="margin: 4px 0;"><strong>Fechas:</strong> Del ${details.start.toLocaleDateString('es-ES')} al ${details.end.toLocaleDateString('es-ES')}</p>
      <p style="margin: 4px 0;"><strong>Código de Solicitud:</strong> ${escapeHtml(details.code)}</p>
    </div>
    <p>Entra a tu panel de propietario para responder y confirmar la disponibilidad.</p>
  `;

  await transporter.sendMail({
    from,
    to,
    subject: `¡Nueva solicitud ${details.code} para ${details.vehicle}! 🚐`,
    text: `Hola ${ownerName},\n\n${details.traveler} quiere alquilar ${details.vehicle} del ${details.start.toLocaleDateString('es-ES')} al ${details.end.toLocaleDateString('es-ES')}.\n\nGestiona la solicitud: ${appUrl}/propietario`,
    html: renderEmailLayout({
      title: `Nueva solicitud para ${details.vehicle}`,
      previewText: `${details.traveler} quiere alquilar ${details.vehicle}`,
      contentHtml,
      ctaText: 'Gestionar Solicitud',
      ctaUrl: `${appUrl}/propietario`,
    }),
  });
}

/** Aviso al propietario para cualquier reserva creada, incluida la reserva instantánea. */
export async function sendBookingCreatedOwnerEmail(
  to: string,
  ownerName: string,
  details: { code: string; vehicle: string; traveler: string; start: Date; end: Date; instant: boolean; reservationId: string }
) {
  if (!transporter) throw new Error('Faltan SMTP_USER o SMTP_PASSWORD');
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vaneando.com';
  const title = details.instant ? '¡Reserva instantánea recibida!' : '¡Nueva solicitud de reserva!';
  const contentHtml = `
    <h2 style="font-family: Georgia, serif; color: #13322E; margin-top: 0;">${title} 🚐</h2>
    <p>Hola ${escapeHtml(ownerName)}, ${details.instant ? 'un viajero ha reservado' : 'un viajero ha enviado una solicitud para'} tu camper.</p>
    <div class="card">
      <p style="margin: 4px 0;"><strong>Viajero:</strong> ${escapeHtml(details.traveler)}</p>
      <p style="margin: 4px 0;"><strong>Vehículo:</strong> ${escapeHtml(details.vehicle)}</p>
      <p style="margin: 4px 0;"><strong>Fechas:</strong> Del ${details.start.toLocaleDateString('es-ES')} al ${details.end.toLocaleDateString('es-ES')}</p>
      <p style="margin: 4px 0;"><strong>Código:</strong> ${escapeHtml(details.code)}</p>
    </div>
    <p>${details.instant ? 'La reserva está pendiente de completar el proceso de pago y contrato.' : 'Revisa la solicitud y responde desde tu panel de propietario.'}</p>
  `;
  await transporter.sendMail({
    from,
    to,
    subject: `${title} · ${details.vehicle}`,
    text: `Hola ${ownerName}, ${details.traveler} ${details.instant ? 'ha reservado' : 'ha solicitado'} ${details.vehicle} del ${details.start.toLocaleDateString('es-ES')} al ${details.end.toLocaleDateString('es-ES')}. Código: ${details.code}. Gestiona la reserva: ${appUrl}/reserva/${details.reservationId}`,
    html: renderEmailLayout({ title, previewText: `${title} para ${details.vehicle}`, contentHtml, ctaText: 'Gestionar reserva', ctaUrl: `${appUrl}/reserva/${details.reservationId}` }),
  });
}

export async function sendChatSummaryEmail(
  to: string,
  participantName: string,
  messages: Array<{ author: string; content: string; createdAt: Date }>
) {
  if (!transporter) throw new Error('Faltan SMTP_USER o SMTP_PASSWORD');
  const lines = messages.map((message) => `[${message.createdAt.toLocaleString('es-ES')}] ${message.author}: ${message.content}`);
  const rows = messages.map((message) => `<p style="margin:6px 0;"><small style="color:#6B726E;">${escapeHtml(message.createdAt.toLocaleString('es-ES'))}</small><br><strong>${escapeHtml(message.author)}:</strong> ${escapeHtml(message.content)}</p>`).join('');

  const contentHtml = `
    <h2 style="font-family: Georgia, serif; color: #13322E; margin-top: 0;">Resumen de Conversación 💬</h2>
    <p>Hola ${escapeHtml(participantName)}, aquí tienes la copia de tu chat en vaneando.com.</p>
    <div class="card">
      ${rows}
    </div>
  `;

  await transporter.sendMail({
    from,
    to,
    subject: 'Resumen de tu chat con vaneando.com 💬',
    text: `Hola ${participantName},\n\n${lines.join('\n')}`,
    html: renderEmailLayout({
      title: 'Resumen de tu chat',
      previewText: 'Resumen de tu conversación en soporte de vaneando.com',
      contentHtml,
      ctaText: 'Volver a Vaneando',
      ctaUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://vaneando.com',
    }),
  });
}

/**
 * Notificación al viajero cuando el propietario cancela una reserva
 */
export async function sendBookingCancelledByOwnerEmail(
  to: string,
  travelerName: string,
  details: {
    code: string;
    vehicle: string;
    reason?: string;
    bookingId: string;
  }
) {
  if (!transporter) return;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vaneando.com';
  const reasonText = details.reason ? details.reason : 'El propietario ha tenido un imprevisto con la disponibilidad del vehículo.';

  const contentHtml = `
    <h2>Hola ${escapeHtml(travelerName)},</h2>
    <p>Te informamos de que el propietario ha cancelado la reserva <strong>${escapeHtml(details.code)}</strong> para el vehículo <strong>${escapeHtml(details.vehicle)}</strong>.</p>
    
    <div class="card" style="border-left: 4px solid #E07A5F; background-color: #FFF5F2;">
      <p style="margin: 0 0 8px 0; font-weight: bold; color: #9C4221;">Motivo de la cancelación:</p>
      <p style="margin: 0; color: #4A5568; font-style: italic;">"${escapeHtml(reasonText)}"</p>
    </div>

    <p>Si ya se había procesado algún pago o retención por esta reserva, el reembolso íntegro se tramitará automáticamente a tu método de pago original.</p>
    <p>Puedes explorar otras campers disponibles en Canarias para las mismas fechas desde nuestro buscador.</p>
  `;

  await transporter.sendMail({
    from,
    to,
    subject: `Reserva cancelada: ${details.code} (${details.vehicle}) 🚐`,
    text: `Hola ${travelerName},\n\nEl propietario ha cancelado tu reserva ${details.code} para ${details.vehicle}.\n\nMotivo: ${reasonText}\n\nPuedes buscar otras opciones en: ${appUrl}/buscar`,
    html: renderEmailLayout({
      title: 'Reserva Cancelada por el Propietario',
      previewText: `Tu reserva ${details.code} ha sido cancelada por el propietario`,
      contentHtml,
      ctaText: 'Buscar Otras Campers',
      ctaUrl: `${appUrl}/buscar`,
    }),
  }).catch((err: any) => console.error('Error sending booking cancelled by owner email:', err));
}

/**
 * Notificación al viajero cuando el propietario cancela un contrato de alquiler
 */
export async function sendContractCancelledEmail(
  to: string,
  travelerName: string,
  details: {
    code: string;
    vehicle: string;
    reason?: string;
    bookingId: string;
  }
) {
  if (!transporter) return;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vaneando.com';
  const reasonText = details.reason ? details.reason : 'El propietario necesita actualizar las cláusulas, inspección o datos del contrato.';

  const contentHtml = `
    <h2>Hola ${escapeHtml(travelerName)},</h2>
    <p>El contrato digital asociado a tu reserva <strong>${escapeHtml(details.code)}</strong> para <strong>${escapeHtml(details.vehicle)}</strong> ha sido cancelado temporalmente por el propietario.</p>
    
    <div class="card" style="border-left: 4px solid #D97706; background-color: #FFFBEB;">
      <p style="margin: 0 0 8px 0; font-weight: bold; color: #92400E;">Motivo indicado:</p>
      <p style="margin: 0; color: #4A5568; font-style: italic;">"${escapeHtml(reasonText)}"</p>
    </div>

    <p>El propietario va a regenerar el contrato con los datos actualizados. En cuanto esté disponible, recibirás un nuevo aviso para revisar y firmar el contrato digital actualizado desde tu panel.</p>
  `;

  await transporter.sendMail({
    from,
    to,
    subject: `Contrato cancelado / en revisión: Reserva ${details.code} 📄`,
    text: `Hola ${travelerName},\n\nEl contrato de tu reserva ${details.code} ha sido cancelado para su actualización.\nMotivo: ${reasonText}\n\nRevisa el estado en: ${appUrl}/reserva/${details.bookingId}`,
    html: renderEmailLayout({
      title: 'Contrato Digital Cancelado / En Revisión',
      previewText: `El contrato de tu reserva ${details.code} ha sido cancelado por el propietario`,
      contentHtml,
      ctaText: 'Ver Estado de la Reserva',
      ctaUrl: `${appUrl}/reserva/${details.bookingId}`,
    }),
  }).catch((err: any) => console.error('Error sending contract cancelled email:', err));
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
    subject: 'Prueba de correo de vaneando.com ✉️',
    text: 'La configuración de correo de vaneando.com funciona correctamente.',
    html: renderEmailLayout({
      title: 'Prueba de Correo',
      previewText: 'Verificación del servicio de mensajería SMTP de vaneando.com',
      contentHtml: '<p>La configuración de correo SMTP de <strong>vaneando.com</strong> funciona perfectamente.</p>',
    }),
  });
}
