import { createHash, randomBytes } from 'node:crypto';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/email';
import { checkRateLimit } from '@/lib/rate-limit';
import { databaseUnavailableResponse, isDatabaseUnavailable } from '@/lib/api-error';

const genericMessage = 'Si existe una cuenta con ese correo, recibirás un enlace para restablecer la contraseña.';

export async function POST(request: Request) {
  try {
    const rateLimit = checkRateLimit(request, 'password-reset', 5, 30 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json({ success: true, message: genericMessage }, { headers: { 'Retry-After': String(rateLimit.retryAfter), 'Cache-Control': 'no-store' } });
    }
    const { email } = await request.json();
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return NextResponse.json({ error: 'Introduce un correo electrónico válido' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (user) {
      const token = randomBytes(32).toString('hex');
      const resetTokenHash = createHash('sha256').update(token).digest('hex');
      const resetTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000);

      await prisma.user.update({
        where: { id: user.id },
        data: { resetTokenHash, resetTokenExpiresAt },
      });

      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vaneando.com';
      const resetUrl = `${appUrl}/restablecer-contrasena?token=${token}`;
      try {
        await sendPasswordResetEmail(user.email, user.firstName, resetUrl);
      } catch (emailError) {
        await prisma.user.update({
          where: { id: user.id },
          data: { resetTokenHash: null, resetTokenExpiresAt: null },
        });
        console.error('Password Reset Email Error:', emailError);
        return NextResponse.json(
          { error: 'El correo transaccional no está disponible. Administración debe revisar SMTP_USER y SMTP_PASSWORD.' },
          { status: 503, headers: { 'Retry-After': '300', 'Cache-Control': 'no-store' } },
        );
      }
    }

    return NextResponse.json({ success: true, message: genericMessage }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Password Reset Request Error:', error);
    if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
    return NextResponse.json({ error: 'No se pudo enviar el correo. Inténtalo de nuevo más tarde.' }, { status: 500 });
  }
}
