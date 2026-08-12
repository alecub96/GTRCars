import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { databaseUnavailableResponse, isDatabaseUnavailable } from '@/lib/api-error';

const incidentSchema = z.object({
  bookingId: z.string().min(1),
  type: z.enum(['DAMAGE', 'DELAY', 'FUEL', 'CLEANING', 'MILEAGE', 'ACCIDENT', 'CANCELLATION', 'DOCUMENTATION', 'OTHER']),
  description: z.string().trim().min(20).max(5000),
  claimedAmount: z.number().min(0).max(100_000).optional(),
});

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 });
    const bookingId = new URL(request.url).searchParams.get('bookingId');
    if (!bookingId) return NextResponse.json({ error: 'Falta la reserva' }, { status: 400 });
    const booking = await prisma.booking.findUnique({ where: { id: bookingId }, select: { travelerId: true, ownerId: true } });
    if (!booking) return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 });
    if (![booking.travelerId, booking.ownerId].includes(user.id) && user.role !== 'ADMIN') return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    const incidents = await prisma.incident.findMany({ where: { bookingId }, orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ success: true, incidents });
  } catch (error) {
    if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
    console.error('Incident list error:', error);
    return NextResponse.json({ error: 'No se pudieron cargar las incidencias' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 });
    const parsed = incidentSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: 'Revisa el tipo, la descripción y el importe' }, { status: 400 });
    const booking = await prisma.booking.findUnique({ where: { id: parsed.data.bookingId }, select: { travelerId: true, ownerId: true, status: true } });
    if (!booking) return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 });
    if (![booking.travelerId, booking.ownerId].includes(user.id)) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    if (!['CONFIRMED', 'CHECKIN_PENDING', 'ACTIVE', 'CHECKOUT_PENDING', 'COMPLETED', 'DISPUTED'].includes(booking.status)) {
      return NextResponse.json({ error: 'Solo se pueden abrir incidencias en reservas confirmadas o realizadas' }, { status: 409 });
    }
    const incident = await prisma.$transaction(async (tx) => {
      const created = await tx.incident.create({
        data: {
          bookingId: parsed.data.bookingId,
          type: parsed.data.type,
          title: `${user.firstName} ${user.lastName}: incidencia ${parsed.data.type.toLowerCase()}`,
          description: parsed.data.description,
          claimedAmount: parsed.data.claimedAmount || 0,
        },
      });
      await tx.booking.update({ where: { id: parsed.data.bookingId }, data: { status: 'DISPUTED' } });
      return created;
    });
    return NextResponse.json({ success: true, incident }, { status: 201 });
  } catch (error) {
    if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
    console.error('Incident creation error:', error);
    return NextResponse.json({ error: 'No se pudo registrar la incidencia' }, { status: 500 });
  }
}
