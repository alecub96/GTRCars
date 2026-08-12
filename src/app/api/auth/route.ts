import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/jwt';
import { sendWelcomeEmail } from '@/lib/email';
import { isConfiguredAdmin } from '@/lib/admin';
import { databaseUnavailableResponse, isDatabaseUnavailable } from '@/lib/api-error';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, email, password, firstName, lastName, role } = body;
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

    if (action === 'register') {
      if (!email || !password || !firstName || !lastName) {
        return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
      }

      const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
      if (existingUser) {
        return NextResponse.json({ error: 'El correo electrónico ya está registrado' }, { status: 400 });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const userRole = isConfiguredAdmin(normalizedEmail) ? 'ADMIN' : role === 'OWNER' ? 'OWNER' : 'TRAVELER';
      const user = await prisma.user.create({
        data: {
          email: normalizedEmail,
          passwordHash,
          firstName,
          lastName,
          role: userRole,
        },
      });

      const token = signToken({ userId: user.id, email: user.email, role: userRole as any });

      const response = NextResponse.json({
        success: true,
        user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
      });

      response.cookies.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });

      await sendWelcomeEmail(user.email, user.firstName).catch((error) => {
        console.error('Welcome Email Error:', error);
      });

      return response;
    }

    if (action === 'login') {
      if (!email || !password) {
        return NextResponse.json({ error: 'Email y contraseña requeridos' }, { status: 400 });
      }

      let user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
      if (!user) {
        return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
      }

      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
      }

      if (isConfiguredAdmin(user.email) && user.role !== 'ADMIN') {
        user = await prisma.user.update({ where: { id: user.id }, data: { role: 'ADMIN' } });
      }

      const token = signToken({ userId: user.id, email: user.email, role: user.role as any });

      const response = NextResponse.json({
        success: true,
        user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
      });

      response.cookies.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });

      return response;
    }

    if (action === 'logout') {
      const response = NextResponse.json({ success: true });
      response.cookies.set('auth_token', '', { maxAge: 0, path: '/' });
      return response;
    }

    return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
  } catch (error) {
    console.error('API Auth Error:', error);
    if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
