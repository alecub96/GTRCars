import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';

export async function POST(request: Request) {
  try {
    if (process.env.NODE_ENV === 'production' && (!stripeSecretKey || stripeSecretKey.includes('mock'))) {
      return NextResponse.json({ error: 'Los pagos reales de Stripe no están configurados' }, { status: 503 });
    }
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Usuario no autenticado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: sessionUser.id },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const body = await request.json();
    const { bookingId } = body;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { vehicle: true, owner: true },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 });
    }
    if (booking.travelerId !== sessionUser.id) {
      return NextResponse.json({ error: 'No tienes permiso para pagar esta reserva' }, { status: 403 });
    }

    // SI EXISTE UNA CLAVE REAL DE STRIPE (sk_live_... o sk_test_... real de producción)
    if (stripeSecretKey && !stripeSecretKey.includes('mock')) {
      const stripe = new Stripe(stripeSecretKey, {
        apiVersion: '2025-02-24.acacia' as any,
      });

      // 1. Crear o recuperar Stripe Customer
      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
        });
        customerId = customer.id;
        await prisma.user.update({
          where: { id: user.id },
          data: { stripeCustomerId: customerId },
        });
      }

      // 2. Calcular comisión de la plataforma en céntimos (Traveler Fee + Owner Fee)
      const totalAmountCents = Math.round(booking.totalAmount * 100);
      const platformFeeCents = Math.round((booking.travelerFee + booking.ownerFee) * 100);

      // Params para Checkout / PaymentIntent
      const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
        amount: totalAmountCents,
        currency: 'eur',
        customer: customerId,
        metadata: {
          bookingId: booking.id,
          bookingCode: booking.code,
          vehicleTitle: booking.vehicle.title,
        },
      };

      // Si el propietario tiene cuenta de Stripe Connect vinculada
      if (booking.owner.stripeAccountId) {
        paymentIntentParams.application_fee_amount = platformFeeCents;
        paymentIntentParams.transfer_data = {
          destination: booking.owner.stripeAccountId,
        };
      }

      const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams);

      await prisma.payment.create({
        data: {
          bookingId: booking.id,
          stripeId: paymentIntent.id,
          amount: booking.totalAmount,
          currency: 'EUR',
          status: 'PENDING',
          type: 'RENTAL_CHARGE',
        },
      });

      return NextResponse.json({
        success: true,
        mode: 'STRIPE_LIVE',
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      });
    }

    // SI AÚN NO SE HAN INTRODUCIDO LAS CLAVES REALES EN EL .ENV -> MODO SIMULADOR DE STRIPE
    const mockStripePaymentIntentId = `pi_mock_${Math.random().toString(36).substring(2, 11)}`;

    await prisma.$transaction([
      prisma.payment.create({
        data: {
          bookingId: booking.id,
          stripeId: mockStripePaymentIntentId,
          amount: booking.totalAmount,
          currency: 'EUR',
          status: 'SUCCEEDED',
          type: 'RENTAL_CHARGE',
        },
      }),
      prisma.booking.update({
        where: { id: booking.id },
        data: {
          status: 'CONFIRMED',
          stripePaymentIntentId: mockStripePaymentIntentId,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      mode: 'STRIPE_SIMULATOR',
      message: 'Pago procesado correctamente en entorno de prueba de Stripe',
      bookingId: booking.id,
    });
  } catch (error: any) {
    console.error('API Payment Processing Error:', error);
    return NextResponse.json({ error: error.message || 'Error en la pasarela de pago' }, { status: 500 });
  }
}
