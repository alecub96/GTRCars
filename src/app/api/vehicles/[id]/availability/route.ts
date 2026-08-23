import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { databaseUnavailableResponse, isDatabaseUnavailable } from '@/lib/api-error';

async function respond(operation: () => Promise<NextResponse>) {
  try { return await operation(); }
  catch (error) {
    console.error('Availability API error:', error);
    if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
    return NextResponse.json({ error: 'No se pudo actualizar la disponibilidad' }, { status: 500 });
  }
}

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
 return respond(async () => {
  const user = await getCurrentUser();
  const { id } = await context.params;
  const vehicle = await prisma.vehicle.findUnique({ where: { id }, select: { ownerId: true, status: true } });
  const isOwner = Boolean(user && (vehicle?.ownerId === user.id || user.role === 'ADMIN'));
  if (!vehicle || (!isOwner && vehicle.status !== 'ACTIVE')) return NextResponse.json({ error: 'Vehículo no encontrado' }, { status: 404 });
  const blocks = await prisma.availabilityBlock.findMany({ where: { vehicleId: id }, orderBy: { startDate: 'asc' } });
  return NextResponse.json({ success: true, blocks });
 });
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
 return respond(async () => {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 });
  const { id } = await context.params;
  const vehicle = await prisma.vehicle.findUnique({ where: { id }, select: { ownerId: true } });
  if (!vehicle || (vehicle.ownerId !== user.id && user.role !== 'ADMIN')) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  const { startDate, endDate } = await request.json();
  const start = new Date(startDate); const end = new Date(endDate);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const horizon = new Date(today); horizon.setFullYear(horizon.getFullYear() + 3);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start < today || start >= end || end > horizon) return NextResponse.json({ error: 'Elige un rango futuro de hasta tres años' }, { status: 400 });
  const conflict = await prisma.availabilityBlock.findFirst({ where: { vehicleId: id, startDate: { lt: end }, endDate: { gt: start } } });
  if (conflict) return NextResponse.json({ error: 'Las fechas ya están bloqueadas' }, { status: 409 });
  const block = await prisma.availabilityBlock.create({ data: { vehicleId: id, startDate: start, endDate: end, reason: 'OWNER_BLOCK' } });
  return NextResponse.json({ success: true, block });
 });
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
 return respond(async () => {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 });
  const { id } = await context.params;
  const { blockId } = await request.json();
  const block = await prisma.availabilityBlock.findUnique({ where: { id: blockId }, include: { vehicle: { select: { ownerId: true } } } });
  if (!block || block.vehicleId !== id || (block.vehicle.ownerId !== user.id && user.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'No autorizado para eliminar este bloqueo' }, { status: 403 });
  }

  // Si el bloqueo proviene de una reserva, extraer el código de reserva y actualizar si no está confirmada
  if (block.reason?.startsWith('BOOKING_')) {
    const bookingCode = block.reason.replace('BOOKING_', '').trim();
    if (bookingCode) {
      await prisma.booking.updateMany({
        where: {
          code: bookingCode,
          status: { in: ['REQUESTED', 'OWNER_ACCEPTED', 'PAYMENT_PENDING'] },
        },
        data: { status: 'CANCELLED' },
      }).catch(() => {});
    }
  }

  await prisma.availabilityBlock.delete({ where: { id: block.id } });
  return NextResponse.json({ success: true });
 });
}
