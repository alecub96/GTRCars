import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';

export async function POST(request: Request) {
  try {
    if (process.env.NODE_ENV === 'production' && (!stripeSecretKey || stripeSecretKey.includes('mock'))) {
      return NextResponse.json({ error: 'Stripe no está configurado para pagos reales' }, { status: 503 });
    }
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Usuario no autenticado' }, { status: 401 });
    }
    if (sessionUser.role !== 'OWNER') {
      return NextResponse.json({ error: 'Solo los propietarios pueden activar Usuario destacado' }, { status: 403 });
    }

    const body = await request.json();
    const { vehicleId } = body;

    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });

    if (!vehicle || vehicle.ownerId !== sessionUser.id) {
      return NextResponse.json({ error: 'No tienes permiso sobre este vehículo' }, { status: 403 });
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 días de suscripción activa

    if (stripeSecretKey && !stripeSecretKey.includes('mock')) {
      const stripe = new Stripe(stripeSecretKey, { apiVersion: '2025-02-24.acacia' as any });

      // Suscripción real recurrente de 2,99€/mes en Stripe
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: `Suscripción Usuario destacado - ${vehicle.title}`,
                description: 'Insignia Usuario destacado para tu perfil y anuncios',
              },
              unit_amount: 299, // 2,99€
              recurring: { interval: 'month' },
            },
            quantity: 1,
          },
        ],
        mode: 'subscription',
        metadata: { userId: sessionUser.id, vehicleId: vehicle.id, feature: 'featured' },
        success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3003'}/propietario?featured=success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3003'}/propietario?featured=cancel`,
      });

      return NextResponse.json({ success: true, url: session.url });
    }

    // MODO SIMULADOR DE SUSCRIPCIÓN Usuario destacado 2,99€/MES
    await prisma.$transaction([
      prisma.vehicle.update({
        where: { id: vehicleId },
        data: {
          isVip: true,
          vipExpiresAt: expiresAt,
        },
      }),
      prisma.vipSubscription.create({
        data: {
          userId: sessionUser.id,
          vehicleId: vehicle.id,
          amount: 2.99,
          currency: 'EUR',
          status: 'ACTIVE',
          currentPeriodEnd: expiresAt,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: 'Usuario destacado activado con éxito por 2,99€/mes.',
    });
  } catch (error: any) {
    console.error('API Featured Subscription Error:', error);
    return NextResponse.json({ error: error.message || 'Error al activar Usuario destacado' }, { status: 500 });
  }
}
