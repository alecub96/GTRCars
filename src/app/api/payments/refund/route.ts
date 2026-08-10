import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 });
  const { bookingId } = await request.json();
  const booking = await prisma.booking.findUnique({ where: { id: bookingId }, include: { payments: { where: { type: 'RENTAL_CHARGE' }, orderBy: { createdAt: 'desc' }, take: 1 } } });
  if (!booking || (booking.travelerId !== user.id && user.role !== 'ADMIN')) return NextResponse.json({ error: 'No tienes permiso para reembolsar esta reserva' }, { status: 403 });
  const payment = booking.payments[0];
  if (!payment || payment.status !== 'SUCCEEDED' || payment.stripeId.startsWith('pi_mock_')) return NextResponse.json({ error: 'No existe un pago real reembolsable' }, { status: 409 });
  const key = process.env.STRIPE_SECRET_KEY || '';
  if (!key || key.includes('mock')) return NextResponse.json({ error: 'Stripe no está configurado' }, { status: 503 });
  try {
    const stripe = new Stripe(key, { apiVersion: '2025-02-24.acacia' as any });
    const refund = await stripe.refunds.create({ payment_intent: payment.stripeId });
    await prisma.$transaction([prisma.payment.update({ where: { id: payment.id }, data: { status: refund.status === 'succeeded' ? 'REFUNDED' : 'REFUND_PENDING' } }), prisma.booking.update({ where: { id: booking.id }, data: { status: 'REFUNDED' } })]);
    return NextResponse.json({ success: true, refundId: refund.id });
  } catch (error: any) { return NextResponse.json({ error: error.message || 'No se pudo procesar el reembolso' }, { status: 500 }); }
}
