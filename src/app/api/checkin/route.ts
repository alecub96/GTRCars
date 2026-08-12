import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { saveUpload, UploadConfigurationError } from '@/lib/uploads';
import { databaseUnavailableResponse, isDatabaseUnavailable } from '@/lib/api-error';

const LEVELS = new Set(['FULL', '3/4', '1/2', '1/4', 'EMPTY']);
const CLEANLINESS = new Set(['EXCELLENT', 'GOOD', 'FAIR']);

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 });
    const bookingId = new URL(request.url).searchParams.get('bookingId');
    if (!bookingId) return NextResponse.json({ error: 'Reserva requerida' }, { status: 400 });
    const booking = await prisma.booking.findUnique({ where: { id: bookingId }, select: { travelerId: true, ownerId: true, code: true, vehicle: { select: { title: true } }, checkIn: { include: { photos: true } } } });
    if (!booking || (![booking.travelerId, booking.ownerId].includes(user.id) && user.role !== 'ADMIN')) return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 });
    return NextResponse.json({ success: true, booking: { code: booking.code, vehicle: booking.vehicle.title, canSubmit: user.id === booking.ownerId }, checkIn: booking.checkIn });
  } catch (error) {
    if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
    return NextResponse.json({ error: 'No se pudo cargar el acta de entrega' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 });
  try {
    const form = await request.formData();
    const bookingId = String(form.get('bookingId') || '');
    const booking = await prisma.booking.findUnique({ where: { id: bookingId }, select: { travelerId: true, ownerId: true, status: true, checkIn: { select: { id: true } } } });
    if (!booking || booking.ownerId !== user.id) return NextResponse.json({ error: 'El acta de entrega debe registrarla el propietario' }, { status: 403 });
    if (!['CONFIRMED', 'CHECKIN_PENDING'].includes(booking.status) || booking.checkIn) return NextResponse.json({ error: 'El acta de entrega no está disponible o ya fue registrada' }, { status: 409 });

    const odometer = Number(form.get('odometer'));
    const fuelLevel = String(form.get('fuelLevel') || '');
    const waterLevel = String(form.get('waterLevel') || '');
    const cleanliness = String(form.get('cleanliness') || '');
    const notes = String(form.get('notes') || '').trim();
    const files = ['front', 'dashboard', 'interior'].map((name) => form.get(name));
    if (!Number.isInteger(odometer) || odometer < 0 || odometer > 10_000_000 || !LEVELS.has(fuelLevel) || !LEVELS.has(waterLevel) || !CLEANLINESS.has(cleanliness) || notes.length > 3_000 || files.some((file) => !(file instanceof File))) return NextResponse.json({ error: 'Completa correctamente todos los datos y fotografías' }, { status: 400 });
    for (const file of files as File[]) {
      if (file.size > 5 * 1024 * 1024 || !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return NextResponse.json({ error: 'Cada evidencia debe ser JPG, PNG o WEBP y pesar menos de 5 MB' }, { status: 400 });
    }
    const urls = await Promise.all((files as File[]).map((file) => saveUpload(file, 'inspections')));
    const checkIn = await prisma.$transaction(async (tx) => {
      const created = await tx.checkIn.create({ data: { bookingId, odometer, fuelLevel, waterLevel, cleanliness, notes: notes || null, signed: true, photos: { create: [{ url: urls[0], tag: 'FRONT' }, { url: urls[1], tag: 'DASHBOARD' }, { url: urls[2], tag: 'INTERIOR' }] } }, include: { photos: true } });
      await tx.booking.update({ where: { id: bookingId }, data: { status: 'ACTIVE' } });
      return created;
    });
    return NextResponse.json({ success: true, checkIn });
  } catch (error) {
    console.error('Check-in error:', error);
    if (error instanceof UploadConfigurationError) return NextResponse.json({ error: 'El almacenamiento seguro no está configurado' }, { status: 503 });
    if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
    return NextResponse.json({ error: 'No se pudo registrar el acta de entrega' }, { status: 500 });
  }
}
