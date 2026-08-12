import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { sendBookingStatusEmail } from '@/lib/email';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature') || '';

  if (!stripeSecretKey || stripeSecretKey.includes('mock')) {
    return NextResponse.json({ received: true, note: 'Mock mode active' });
  }

  const stripe = new Stripe(stripeSecretKey);

  let event: Stripe.Event;

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 503 });
    } else {
      event = JSON.parse(body);
    }
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Manejar el evento de pago completado
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const bookingId = paymentIntent.metadata?.bookingId;

    if (bookingId) {
      await prisma.$transaction([
        prisma.booking.update({
          where: { id: bookingId },
          data: {
            status: 'CONFIRMED',
            stripePaymentIntentId: paymentIntent.id,
          },
        }),
        prisma.payment.updateMany({
          where: { stripeId: paymentIntent.id },
          data: { status: 'SUCCEEDED' },
        }),
      ]);
      const booking = await prisma.booking.findUnique({ where: { id: bookingId }, include: { traveler: { select: { email: true, firstName: true } }, vehicle: { select: { title: true } } } });
      if (booking) sendBookingStatusEmail(booking.traveler.email, booking.traveler.firstName, { code: booking.code, status: 'CONFIRMED', vehicle: booking.vehicle.title, reservationId: booking.id }).catch((error) => console.error('Payment confirmation email error:', error));
    }
  }

  if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
    const session = event.data.object as Stripe.Checkout.Session;
    const featureUserId = session.metadata?.userId;
    const featureVehicleId = session.metadata?.vehicleId;
    if (featureUserId && featureVehicleId && session.mode === 'subscription' && session.subscription) {
      const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription.id;
      const subscription = await stripe.subscriptions.retrieve(subscriptionId) as any;
      const periodEnd = new Date((subscription.current_period_end || Math.floor(Date.now() / 1000) + 30 * 86400) * 1000);
      const existing = await prisma.vipSubscription.findFirst({ where: { stripeSubscriptionId: subscriptionId } });
      if (existing) {
        await prisma.vipSubscription.update({ where: { id: existing.id }, data: { status: 'ACTIVE', currentPeriodEnd: periodEnd } });
      } else {
        await prisma.vipSubscription.create({ data: { userId: featureUserId, vehicleId: featureVehicleId, stripeSubscriptionId: subscriptionId, status: 'ACTIVE', amount: 2.99, currency: 'EUR', currentPeriodEnd: periodEnd } });
      }
      await prisma.vehicle.update({ where: { id: featureVehicleId }, data: { isVip: true, vipExpiresAt: periodEnd } });
    }
    const bookingId = session.metadata?.bookingId;
    if (bookingId && session.payment_status !== 'unpaid') {
      const paymentIntentId = typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id;
      await prisma.$transaction([
        prisma.booking.update({ where: { id: bookingId }, data: { status: 'CONFIRMED', stripePaymentIntentId: paymentIntentId || null } }),
        prisma.payment.updateMany({ where: { stripeId: session.id }, data: { status: 'SUCCEEDED' } }),
      ]);
      const booking = await prisma.booking.findUnique({ where: { id: bookingId }, include: { traveler: { select: { email: true, firstName: true } }, vehicle: { select: { title: true } } } });
      if (booking) sendBookingStatusEmail(booking.traveler.email, booking.traveler.firstName, { code: booking.code, status: 'CONFIRMED', vehicle: booking.vehicle.title, reservationId: booking.id }).catch((error) => console.error('Checkout confirmation email error:', error));
    }
  }

  if (event.type === 'customer.subscription.deleted' || event.type === 'customer.subscription.updated') {
    const subscription = event.data.object as Stripe.Subscription;
    const subscriptionId = subscription.id;
    const active = subscription.status === 'active' || subscription.status === 'trialing';
    const periodEnd = new Date(((subscription as any).current_period_end || Math.floor(Date.now() / 1000)) * 1000);
    const stored = await prisma.vipSubscription.findFirst({ where: { stripeSubscriptionId: subscriptionId } });
    if (stored) {
      await prisma.$transaction([
        prisma.vipSubscription.update({ where: { id: stored.id }, data: { status: active ? 'ACTIVE' : 'CANCELLED', currentPeriodEnd: periodEnd } }),
        prisma.vehicle.update({ where: { id: stored.vehicleId }, data: { isVip: active, vipExpiresAt: active ? periodEnd : new Date() } }),
      ]);
    }
  }

  if (event.type === 'account.updated') {
    const account = event.data.object as Stripe.Account;
    await prisma.user.updateMany({ where: { stripeAccountId: account.id }, data: { stripeAccountId: account.id } });
  }

  if (event.type === 'payment_intent.canceled') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    await prisma.payment.updateMany({ where: { stripeId: paymentIntent.id }, data: { status: 'CANCELLED' } });
  }

  return NextResponse.json({ received: true });
}
