import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { sendBookingStatusEmail } from '@/lib/email';
import { databaseUnavailableResponse, isDatabaseUnavailable } from '@/lib/api-error';

export async function POST(request: Request) {
 try {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 });
  if (user.role !== 'ADMIN') return NextResponse.json({ error: 'Los reembolsos solo pueden ser autorizados por administración' }, { status: 403 });
  const { bookingId } = await request.json();
  const booking = await prisma.booking.findUnique({ where: { id: bookingId }, include: { traveler: { select: { email: true, firstName: true } }, vehicle: { select: { title: true } }, payments: { where: { type: 'RENTAL_CHARGE' }, orderBy: { createdAt: 'desc' }, take: 1 } } });
  if (!booking) return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 });
  const payment = booking.payments[0];
  if (!payment || payment.status !== 'SUCCEEDED' || payment.stripeId.startsWith('pi_mock_')) return NextResponse.json({ error: 'No existe un pago real reembolsable' }, { status: 409 });
  const key = process.env.STRIPE_SECRET_KEY || '';
  if (!key || key.includes('mock')) return NextResponse.json({ error: 'Stripe no está configurado' }, { status: 503 });
    const stripe = new Stripe(key);
    const refund = await stripe.refunds.create({ payment_intent: payment.stripeId });
    await prisma.$transaction([
      prisma.payment.update({ where: { id: payment.id }, data: { status: refund.status === 'succeeded' ? 'REFUNDED' : 'REFUND_PENDING' } }),
      ...(refund.status === 'succeeded'
        ? [prisma.booking.update({ where: { id: booking.id }, data: { status: 'REFUNDED' as const } })]
        : []),
    ]);
    if (refund.status === 'succeeded') sendBookingStatusEmail(booking.traveler.email, booking.traveler.firstName, { code: booking.code, status: 'REFUNDED', vehicle: booking.vehicle.title, reservationId: booking.id }).catch((error) => console.error('Refund email error:', error));
    return NextResponse.json({ success: true, refundId: refund.id });
  } catch (error: unknown) {
    if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
    const message = error instanceof Error ? error.message : '';
    return NextResponse.json({ error: message || 'No se pudo procesar el reembolso' }, { status: 500 });
  }
}
