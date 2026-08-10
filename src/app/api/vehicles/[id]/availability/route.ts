import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const blocks = await prisma.availabilityBlock.findMany({ where: { vehicleId: id }, orderBy: { startDate: 'asc' } });
  return NextResponse.json({ success: true, blocks });
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'OWNER') return NextResponse.json({ error: 'Solo los propietarios pueden bloquear fechas' }, { status: 403 });
  const { id } = await context.params;
  const vehicle = await prisma.vehicle.findUnique({ where: { id }, select: { ownerId: true } });
  if (!vehicle || vehicle.ownerId !== user.id) return NextResponse.json({ error: 'Vehículo no encontrado' }, { status: 404 });
  const { startDate, endDate, reason } = await request.json();
  const start = new Date(startDate); const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start >= end) return NextResponse.json({ error: 'Rango de fechas inválido' }, { status: 400 });
  const conflict = await prisma.availabilityBlock.findFirst({ where: { vehicleId: id, startDate: { lt: end }, endDate: { gt: start } } });
  if (conflict) return NextResponse.json({ error: 'Las fechas ya están bloqueadas' }, { status: 409 });
  const block = await prisma.availabilityBlock.create({ data: { vehicleId: id, startDate: start, endDate: end, reason: reason || 'OWNER_BLOCK' } });
  return NextResponse.json({ success: true, block });
}
