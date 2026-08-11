import { createHash, randomBytes } from 'node:crypto';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/email';

const genericMessage = 'Si existe una cuenta con ese correo, recibirás un enlace para restablecer la contraseña.';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

    if (!normalizedEmail) {
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
      await sendPasswordResetEmail(user.email, user.firstName, resetUrl).catch((error) => {
        console.error('Password Reset Email Error:', error);
      });
    }

    return NextResponse.json({ success: true, message: genericMessage });
  } catch (error) {
    console.error('Password Reset Request Error:', error);
    return NextResponse.json({ error: 'No se pudo enviar el correo. Inténtalo de nuevo más tarde.' }, { status: 500 });
  }
}
