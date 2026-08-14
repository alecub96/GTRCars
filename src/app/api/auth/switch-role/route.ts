import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/jwt';
import { databaseUnavailableResponse, isDatabaseUnavailable } from '@/lib/api-error';

export async function POST(request: Request) {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Usuario no autenticado' }, { status: 401 });
    }
    if (sessionUser.role === 'ADMIN') {
      return NextResponse.json({ error: 'La cuenta de administrador no puede cambiar de modo' }, { status: 403 });
    }

    const body = await request.json();
    const { targetRole } = body; // 'TRAVELER' o 'OWNER'

    if (targetRole !== 'TRAVELER' && targetRole !== 'OWNER') {
      return NextResponse.json({ error: 'Rol no válido' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: sessionUser.id },
      data: { role: targetRole },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    const token = signToken({
      userId: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role as any,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        role: updatedUser.role,
      },
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
  } catch (error) {
    console.error('API Switch Role Error:', error);
    if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
    return NextResponse.json({ error: 'Error al cambiar de modo' }, { status: 500 });
  }
}
