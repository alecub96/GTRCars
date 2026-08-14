import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/jwt';
import { sendWelcomeEmail } from '@/lib/email';
import { isConfiguredAdmin } from '@/lib/admin';
import { databaseUnavailableResponse, isDatabaseUnavailable } from '@/lib/api-error';
import { checkRateLimit } from '@/lib/rate-limit';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DUMMY_PASSWORD_HASH = '$2b$10$4lZfJpPJvBxVmC1t8Rr1Ruv3FOP8Kp1nFB60c9UlQVL0Ekd2mmCTm';

function authResponse(body: object, status = 200) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: Request) {
  try {
    const rateLimit = checkRateLimit(request, 'auth', 20, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Demasiados intentos. Espera unos minutos antes de volver a intentarlo.' },
        { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfter), 'Cache-Control': 'no-store' } },
      );
    }

    const body = await request.json();
    const { action, email, password, firstName, lastName, role } = body;
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

    if (action === 'register') {
      const cleanFirstName = typeof firstName === 'string' ? firstName.trim() : '';
      const cleanLastName = typeof lastName === 'string' ? lastName.trim() : '';
      if (!EMAIL_PATTERN.test(normalizedEmail) || typeof password !== 'string' || password.length < 8 || password.length > 128 || !cleanFirstName || !cleanLastName) {
        return authResponse({ error: 'Revisa el correo, el nombre y usa una contraseña de al menos 8 caracteres' }, 400);
      }
      if (cleanFirstName.length > 80 || cleanLastName.length > 120) {
        return authResponse({ error: 'El nombre o los apellidos son demasiado largos' }, 400);
      }

      const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
      if (existingUser) {
        return authResponse({ error: 'El correo electrónico ya está registrado' }, 400);
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const userRole = isConfiguredAdmin(normalizedEmail) ? 'ADMIN' : role === 'OWNER' ? 'OWNER' : 'TRAVELER';
      const user = await prisma.user.create({
        data: {
          email: normalizedEmail,
          passwordHash,
          firstName: cleanFirstName,
          lastName: cleanLastName,
          role: userRole,
        },
      });

      const token = signToken({ userId: user.id, email: user.email, role: userRole as any });

      const response = authResponse({
        success: true,
        user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
      });

      response.cookies.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        priority: 'high',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });

      await sendWelcomeEmail(user.email, user.firstName).catch((error) => {
        console.error('Welcome Email Error:', error);
      });

      return response;
    }

    if (action === 'login') {
      if (!EMAIL_PATTERN.test(normalizedEmail) || typeof password !== 'string' || !password || password.length > 128) {
        return authResponse({ error: 'Email y contraseña requeridos' }, 400);
      }

      let user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
      if (!user) {
        await bcrypt.compare(password, DUMMY_PASSWORD_HASH);
        return authResponse({ error: 'Credenciales inválidas' }, 401);
      }

      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        return authResponse({ error: 'Credenciales inválidas' }, 401);
      }

      if (isConfiguredAdmin(user.email) && user.role !== 'ADMIN') {
        user = await prisma.user.update({ where: { id: user.id }, data: { role: 'ADMIN' } });
      }

      const token = signToken({ userId: user.id, email: user.email, role: user.role as any });

      const response = authResponse({
        success: true,
        user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
      });

      response.cookies.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        priority: 'high',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });

      return response;
    }

    if (action === 'logout') {
      const response = authResponse({ success: true });
      response.cookies.set('auth_token', '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 0, path: '/' });
      return response;
    }

    return authResponse({ error: 'Acción no válida' }, 400);
  } catch (error) {
    console.error('API Auth Error:', error);
    if (isDatabaseUnavailable(error)) return databaseUnavailableResponse(error);
    return authResponse({ error: 'Error interno del servidor' }, 500);
  }
}
