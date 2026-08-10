import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

const cancellable = ['REQUESTED', 'OWNER_ACCEPTED', 'PAYMENT_PENDING'];

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 });
  const { id } = await context.params;
  const body = await request.json();
  const action = body.action;
  const booking = await prisma.booking.findUnique({ where: { id }, include: { vehicle: true } });
  if (!booking) return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 });

  const isTraveler = booking.travelerId === user.id;
  const isOwner = booking.ownerId === user.id;
  const isAdmin = user.role === 'ADMIN';
  if (!isTraveler && !isOwner && !isAdmin) return NextResponse.json({ error: 'No tienes permiso sobre esta reserva' }, { status: 403 });

  let status = booking.status;
  if (action === 'accept' && (isOwner || isAdmin) && booking.status === 'REQUESTED') status = 'OWNER_ACCEPTED';
  else if (action === 'reject' && (isOwner || isAdmin) && ['REQUESTED', 'OWNER_ACCEPTED'].includes(booking.status)) status = 'OWNER_REJECTED';
  else if (action === 'cancel' && (isTraveler || isOwner || isAdmin) && cancellable.includes(booking.status)) status = 'CANCELLED';
  else return NextResponse.json({ error: 'La acción no está permitida para el estado actual' }, { status: 409 });

  const updated = await prisma.$transaction(async (tx) => {
    const result = await tx.booking.update({ where: { id }, data: { status } });
    if (status === 'CANCELLED' || status === 'OWNER_REJECTED') {
      await tx.availabilityBlock.deleteMany({ where: { vehicleId: booking.vehicleId, reason: `BOOKING_${booking.code}` } });
    }
    return result;
  });
  return NextResponse.json({ success: true, booking: updated });
}
