import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { token, platform = 'web' } = await req.json();
    if (!token || typeof token !== 'string') {
      return NextResponse.json({ error: 'Token FCM requerido' }, { status: 400 });
    }

    // Guardar o actualizar suscripción push del usuario
    await prisma.pushSubscription.upsert({
      where: { endpoint: token },
      create: {
        userId: user.id,
        endpoint: token,
        p256dh: platform,
        auth: 'firebase-fcm',
      },
      update: {
        userId: user.id,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, message: 'FCM Token registrado correctamente' });
  } catch (error: any) {
    console.error('Error registrando FCM token:', error);
    return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 });
  }
}
