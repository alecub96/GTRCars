import { createHash } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rate-limit';
import { databaseUnavailableResponse, isDatabaseUnavailable } from '@/lib/api-error';

export async function POST(request: Request) {
  try {
    const rateLimit = checkRateLimit(request, 'password-reset-confirm', 10, 30 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Demasiados intentos. Solicita un enlace nuevo más tarde.' }, { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfter) } });
    }
    const { token, password } = await request.json();

    if (typeof token !== 'string' || token.length !== 64 || typeof password !== 'string' || password.length < 8 || password.length > 128) {
      return NextResponse.json({ error: 'El enlace o la contraseña no son válidos' }, { status: 400 });
    }

    const resetTokenHash = createHash('sha256').update(token).digest('hex');
    const user = await prisma.user.findFirst({
      where: {
        resetTokenHash,
        resetTokenExpiresAt: { gt: new Date() },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'El enlace ha caducado o ya fue utilizado' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash, resetTokenHash: null, resetTokenExpiresAt: null },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Password Reset Confirm Error:', error);
    if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
    return NextResponse.json({ error: 'No se pudo restablecer la contraseña' }, { status: 500 });
  }
}
