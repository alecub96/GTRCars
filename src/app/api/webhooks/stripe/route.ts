import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { sendBookingStatusEmail } from '@/lib/email';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';

async function confirmBookingPayment(bookingId: string, paymentIntentId: string | null, checkoutSessionId?: string) {
  const result = await prisma.$transaction(async (tx) => {
    const updated = await tx.booking.updateMany({
      where: {
        id: bookingId,
        status: { in: ['OWNER_ACCEPTED', 'PAYMENT_PENDING'] },
      },
      data: { status: 'CONFIRMED', stripePaymentIntentId: paymentIntentId },
    });

    await tx.payment.updateMany({
      where: {
        bookingId,
        status: 'PENDING',
        ...(checkoutSessionId ? { stripeId: checkoutSessionId } : {}),
      },
      data: {
        status: 'SUCCEEDED',
        ...(paymentIntentId ? { stripeId: paymentIntentId } : {}),
      },
    });

    if (updated.count === 0) return null;
    return tx.booking.findUnique({
      where: { id: bookingId },
      include: {
        traveler: { select: { email: true, firstName: true } },
        vehicle: { select: { title: true } },
      },
    });
  });

  if (result) {
    await sendBookingStatusEmail(result.traveler.email, result.traveler.firstName, {
      code: result.code,
      status: 'CONFIRMED',
      vehicle: result.vehicle.title,
      reservationId: result.id,
    }).catch((error) => console.error('Payment confirmation email error:', error));
  }
}

function getSubscriptionPeriodEnd(subscription: Stripe.Subscription) {
  const itemPeriodEnd = subscription.items.data
    .map((item) => item.current_period_end)
    .filter((value): value is number => typeof value === 'number')
    .sort((a, b) => b - a)[0];
  return new Date((itemPeriodEnd || Math.floor(Date.now() / 1000) + 30 * 86400) * 1000);
}

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
      await confirmBookingPayment(bookingId, paymentIntent.id);
    }
  }

  if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
    const session = event.data.object as Stripe.Checkout.Session;
    const featureUserId = session.metadata?.userId;
    const featureVehicleId = session.metadata?.vehicleId;
    if (featureUserId && featureVehicleId && session.mode === 'subscription' && session.subscription) {
      const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription.id;
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const periodEnd = getSubscriptionPeriodEnd(subscription);
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
      await confirmBookingPayment(bookingId, paymentIntentId || null, session.id);
    }
  }

  if (event.type === 'customer.subscription.deleted' || event.type === 'customer.subscription.updated') {
    const subscription = event.data.object as Stripe.Subscription;
    const subscriptionId = subscription.id;
    const active = subscription.status === 'active' || subscription.status === 'trialing';
    const periodEnd = getSubscriptionPeriodEnd(subscription);
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
