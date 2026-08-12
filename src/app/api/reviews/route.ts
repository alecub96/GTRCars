import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { databaseUnavailableResponse, isDatabaseUnavailable } from '@/lib/api-error';

export async function POST(request: Request) {
 try {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 });
  const body = await request.json();
  const rating = Number(body.rating);
  const comment = typeof body.comment === 'string' ? body.comment.trim() : '';
  const categoryRatings = ['cleanliness', 'communication', 'accuracy', 'condition'].map((key) => Number(body[key] ?? rating));
  if (!body.bookingId || !Number.isInteger(rating) || rating < 1 || rating > 5 || !comment || comment.length > 2_000 || categoryRatings.some((value) => !Number.isInteger(value) || value < 1 || value > 5)) return NextResponse.json({ error: 'Completa una valoración válida de 1 a 5 y un comentario de hasta 2.000 caracteres' }, { status: 400 });
  const booking = await prisma.booking.findUnique({ where: { id: body.bookingId } });
  if (!booking || ![booking.travelerId, booking.ownerId].includes(user.id) || booking.status !== 'COMPLETED') return NextResponse.json({ error: 'Solo puedes valorar tus reservas completadas' }, { status: 403 });
  const isOwnerReviewingTraveler = user.id === booking.ownerId;
  const review = await prisma.review.upsert({
    where: { bookingId_authorId: { bookingId: booking.id, authorId: user.id } },
    update: { rating, cleanliness: categoryRatings[0], communication: categoryRatings[1], accuracy: categoryRatings[2], condition: categoryRatings[3], comment },
    create: { bookingId: booking.id, vehicleId: booking.vehicleId, authorId: user.id, subjectId: isOwnerReviewingTraveler ? booking.travelerId : booking.ownerId, subjectRole: isOwnerReviewingTraveler ? 'TRAVELER' : 'OWNER', rating, cleanliness: categoryRatings[0], communication: categoryRatings[1], accuracy: categoryRatings[2], condition: categoryRatings[3], comment },
  });
  return NextResponse.json({ success: true, review });
 } catch (error) {
   if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
   console.error('Review creation error:', error);
   return NextResponse.json({ error: 'No se pudo guardar la valoración' }, { status: 500 });
 }
}
