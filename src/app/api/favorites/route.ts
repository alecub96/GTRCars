import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 });
  const favorites = await prisma.favorite.findMany({ where: { userId: user.id }, include: { vehicle: { include: { photos: { take: 1 } } } } });
  return NextResponse.json({ success: true, favorites });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 });
  const { vehicleId } = await request.json();
  if (!vehicleId) return NextResponse.json({ error: 'Vehículo requerido' }, { status: 400 });
  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId }, select: { status: true } });
  if (!vehicle || vehicle.status !== 'ACTIVE') return NextResponse.json({ error: 'Vehículo no disponible' }, { status: 404 });
  const favorite = await prisma.favorite.upsert({ where: { userId_vehicleId: { userId: user.id, vehicleId } }, update: {}, create: { userId: user.id, vehicleId } });
  return NextResponse.json({ success: true, favorite });
}

export async function DELETE(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 });
  const { vehicleId } = await request.json();
  await prisma.favorite.deleteMany({ where: { userId: user.id, vehicleId } });
  return NextResponse.json({ success: true });
}
