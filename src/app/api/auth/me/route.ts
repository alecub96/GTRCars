import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { databaseUnavailableResponse, isDatabaseUnavailable } from '@/lib/api-error';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ user: null }, { headers: { 'Cache-Control': 'no-store' } });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Auth me error:', error);
    if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
    return NextResponse.json({ error: 'No se pudo comprobar la sesión' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}
