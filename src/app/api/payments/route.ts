import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { databaseUnavailableResponse, isDatabaseUnavailable } from '@/lib/api-error';
import { ensureDbSchema } from '@/lib/prisma-ensure-schema';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';

export async function POST(request: Request) {
  try {
    await ensureDbSchema();
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
      include: {
        vehicle: true,
        owner: true,
        contract: true,
        payments: { where: { type: 'RENTAL_CHARGE' }, orderBy: { createdAt: 'desc' }, take: 1 },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 });
    }
    if (booking.travelerId !== sessionUser.id) {
      return NextResponse.json({ error: 'No tienes permiso para pagar esta reserva' }, { status: 403 });
    }
    if (!booking.contract?.signedByTraveler || !booking.contract?.signedByOwner) {
      return NextResponse.json({ error: 'El contrato debe estar firmado por viajero y propietario antes de pagar' }, { status: 409 });
    }
    const latestPayment = booking.payments[0];
    if (latestPayment?.status === 'SUCCEEDED' || booking.stripePaymentIntentId) {
      return NextResponse.json({ error: 'Esta reserva ya está pagada' }, { status: 409 });
    }
    if (!['OWNER_ACCEPTED', 'PAYMENT_PENDING'].includes(booking.status)) {
      return NextResponse.json({ error: 'El propietario debe aceptar la solicitud antes del pago' }, { status: 409 });
    }

    // SI EXISTE UNA CLAVE REAL DE STRIPE (sk_live_... o sk_test_... real de producción)
    if (stripeSecretKey && !stripeSecretKey.includes('mock')) {
      const stripe = new Stripe(stripeSecretKey);

      if (latestPayment?.status === 'PENDING' && latestPayment.stripeId.startsWith('cs_')) {
        const existingCheckout = await stripe.checkout.sessions.retrieve(latestPayment.stripeId);
        if (existingCheckout.status === 'open' && existingCheckout.client_secret) {
          return NextResponse.json({ success: true, mode: 'STRIPE_ELEMENTS', clientSecret: existingCheckout.client_secret });
        }
      }

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

      const totalAmountCents = Math.round(booking.totalAmount * 100);
      const platformFeeCents = Math.round((booking.travelerFee + booking.ownerFee) * 100);
      const paymentIntentData: Stripe.Checkout.SessionCreateParams.PaymentIntentData = {
        metadata: { bookingId: booking.id, bookingCode: booking.code, vehicleTitle: booking.vehicle.title },
      };
      const ownerHasPayoutDetails = Boolean(booking.owner.stripeAccountId && booking.owner.iban && booking.owner.bankHolder);
      if (ownerHasPayoutDetails) {
        paymentIntentData.application_fee_amount = platformFeeCents;
        paymentIntentData.transfer_data = { destination: booking.owner.stripeAccountId as string };
      }
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const checkout = await stripe.checkout.sessions.create({
        mode: 'payment',
        ui_mode: 'elements',
        customer: customerId,
        // Stripe muestra tarjeta y Klarna dinámicamente según país, importe y elegibilidad de la cuenta.
        automatic_tax: { enabled: false },
        line_items: [{
          price_data: { currency: 'eur', unit_amount: totalAmountCents, product_data: { name: `Reserva ${booking.code}`, description: booking.vehicle.title } },
          quantity: 1,
        }],
        payment_method_types: ['card', 'klarna'],
        metadata: { bookingId: booking.id, bookingCode: booking.code },
        payment_intent_data: paymentIntentData,
        return_url: `${appUrl}/reserva/${booking.id}?pago=procesado&session_id={CHECKOUT_SESSION_ID}`,
      });

      await prisma.payment.create({
        data: {
          bookingId: booking.id,
          stripeId: checkout.id,
          amount: booking.totalAmount,
          currency: 'EUR',
          status: 'PENDING',
          type: 'RENTAL_CHARGE',
        },
      });
      await prisma.booking.update({
        where: { id: booking.id },
        data: { status: 'PAYMENT_PENDING', payoutStatus: ownerHasPayoutDetails ? 'READY' : 'HELD' },
      });

      return NextResponse.json({
        success: true,
        mode: 'STRIPE_ELEMENTS',
        clientSecret: checkout.client_secret,
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
          payoutStatus: booking.owner.iban && booking.owner.bankHolder ? 'READY' : 'HELD',
        },
      }),
      prisma.availabilityBlock.create({
        data: {
          vehicleId: booking.vehicleId,
          startDate: booking.pickupDate,
          endDate: booking.returnDate,
          reason: `BOOKING_${booking.code}`,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      mode: 'STRIPE_SIMULATOR',
      message: 'Pago procesado correctamente en entorno de prueba de Stripe',
      bookingId: booking.id,
    });
  } catch (error: unknown) {
    if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
    console.error('API Payment Processing Error:', error);
    const message = error instanceof Error ? error.message : '';
    return NextResponse.json({ error: message || 'Error en la pasarela de pago' }, { status: 500 });
  }
}
