import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 });
  const body = await request.json();
  const rating = Number(body.rating);
  if (!body.bookingId || rating < 1 || rating > 5 || !body.comment?.trim()) return NextResponse.json({ error: 'Reserva, valoración y comentario son obligatorios' }, { status: 400 });
  const booking = await prisma.booking.findUnique({ where: { id: body.bookingId } });
  if (!booking || booking.travelerId !== user.id || booking.status !== 'COMPLETED') return NextResponse.json({ error: 'Solo puedes valorar tus reservas completadas' }, { status: 403 });
  const review = await prisma.review.create({ data: { bookingId: booking.id, vehicleId: booking.vehicleId, authorId: user.id, subjectId: booking.ownerId, rating, cleanliness: Number(body.cleanliness || rating), communication: Number(body.communication || rating), accuracy: Number(body.accuracy || rating), condition: Number(body.condition || rating), comment: body.comment.trim() } });
  return NextResponse.json({ success: true, review });
}
