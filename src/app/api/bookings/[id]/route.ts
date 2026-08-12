import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { sendBookingStatusEmail } from '@/lib/email';

const cancellable = ['REQUESTED', 'OWNER_ACCEPTED', 'PAYMENT_PENDING'];

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 });
  const { id } = await context.params;
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      vehicle: { select: { title: true, brand: true, model: true, year: true, island: true, municipality: true, rules: true, cancellationPolicy: true, includedKmPerDay: true, extraKmPrice: true } },
      traveler: { select: { id: true, firstName: true, lastName: true, email: true } },
      owner: { select: { id: true, firstName: true, lastName: true, email: true } },
      contract: true,
    },
  });
  if (!booking) return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 });
  if (![booking.travelerId, booking.ownerId].includes(user.id) && user.role !== 'ADMIN') return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  const viewerRole = booking.travelerId === user.id ? 'TRAVELER' : booking.ownerId === user.id ? 'OWNER' : 'ADMIN';
  return NextResponse.json({ success: true, booking, viewerRole });
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 });
  const { id } = await context.params;
  const body = await request.json();
  const action = body.action;
  const booking = await prisma.booking.findUnique({ where: { id }, include: { vehicle: true, traveler: { select: { email: true, firstName: true } }, owner: { select: { email: true, firstName: true } } } });
  if (!booking) return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 });

  const isTraveler = booking.travelerId === user.id;
  const isOwner = booking.ownerId === user.id;
  const isAdmin = user.role === 'ADMIN';
  if (!isTraveler && !isOwner && !isAdmin) return NextResponse.json({ error: 'No tienes permiso sobre esta reserva' }, { status: 403 });

  let status = booking.status;
  if (action === 'accept' && (isOwner || isAdmin) && booking.status === 'REQUESTED') status = 'OWNER_ACCEPTED';
  else if (action === 'reject' && (isOwner || isAdmin) && ['REQUESTED', 'OWNER_ACCEPTED'].includes(booking.status)) status = 'OWNER_REJECTED';
  else if (action === 'cancel' && (isTraveler || isOwner || isAdmin) && cancellable.includes(booking.status)) status = 'CANCELLED';
  else if (action === 'sign-contract' && (isTraveler || isOwner)) {
    const signature = typeof body.signature === 'string' ? body.signature.trim() : '';
    const accepted = body.acceptedTerms === true && body.acceptedPrivacy === true && body.acceptedDeposit === true;
    if (signature.length < 5 || !accepted) return NextResponse.json({ error: 'Completa la firma y acepta todas las condiciones' }, { status: 400 });
    const termsSnapshot = JSON.stringify({
      version: '2026-08-11', bookingCode: booking.code, vehicle: booking.vehicle.title,
      pickupDate: booking.pickupDate, returnDate: booking.returnDate, totalAmount: booking.totalAmount,
      depositAmount: booking.depositAmount, pricingSnapshot: booking.pricingSnapshot,
      acceptedAt: new Date().toISOString(), acceptedTerms: true, acceptedPrivacy: true, acceptedDeposit: true,
    });
    const signatureUpdate = isTraveler
      ? { signedByTraveler: true, travelerSignature: signature }
      : { signedByOwner: true, ownerSignature: signature };
    const contract = await prisma.contract.upsert({
      where: { bookingId: booking.id },
      update: { ...signatureUpdate, signedAt: new Date(), termsSnapshot },
      create: { bookingId: booking.id, ...signatureUpdate, signedAt: new Date(), termsSnapshot },
    });
    return NextResponse.json({ success: true, contract });
  } else return NextResponse.json({ error: 'La acción no está permitida para el estado actual' }, { status: 409 });

  const updated = await prisma.$transaction(async (tx) => {
    const result = await tx.booking.update({ where: { id }, data: { status } });
    if (status === 'CANCELLED' || status === 'OWNER_REJECTED') {
      await tx.availabilityBlock.deleteMany({ where: { vehicleId: booking.vehicleId, reason: `BOOKING_${booking.code}` } });
    }
    return result;
  });
  const recipient = isTraveler ? booking.owner : booking.traveler;
  sendBookingStatusEmail(recipient.email, recipient.firstName, { code: booking.code, status, vehicle: booking.vehicle.title, reservationId: booking.id }).catch((error) => console.error('Booking status email error:', error));
  return NextResponse.json({ success: true, booking: updated });
}
