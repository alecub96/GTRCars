import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

async function ownedVehicle(id: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'OWNER') return { user: null, vehicle: null };
  const vehicle = await prisma.vehicle.findUnique({ where: { id }, select: { ownerId: true } });
  return { user, vehicle: vehicle?.ownerId === user.id ? vehicle : null };
}

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const vehicle = await prisma.vehicle.findUnique({ where: { id }, select: { status: true, pricingRules: { orderBy: { startDate: 'asc' } } } });
  if (!vehicle) return NextResponse.json({ error: 'Vehículo no encontrado' }, { status: 404 });
  return NextResponse.json({ success: true, rules: vehicle.pricingRules });
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const { vehicle } = await ownedVehicle(id);
  if (!vehicle) return NextResponse.json({ error: 'Solo el propietario puede gestionar tarifas' }, { status: 403 });
  const body = await request.json();
  const name = String(body.name || 'Tarifa especial').trim().slice(0, 80);
  const start = new Date(body.startDate);
  const end = new Date(body.endDate);
  const pricePerDay = Number(body.pricePerDay);
  if (!name || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start >= end || !Number.isFinite(pricePerDay) || pricePerDay <= 0) return NextResponse.json({ error: 'Completa un periodo y una tarifa válida' }, { status: 400 });
  const count = await prisma.pricingRule.count({ where: { vehicleId: id } });
  if (count >= 5) return NextResponse.json({ error: 'Puedes crear hasta cinco tarifas por camper' }, { status: 400 });
  const overlap = await prisma.pricingRule.findFirst({ where: { vehicleId: id, startDate: { lt: end }, endDate: { gt: start } } });
  if (overlap) return NextResponse.json({ error: 'Ese periodo se solapa con otra tarifa' }, { status: 409 });
  const rule = await prisma.pricingRule.create({ data: { vehicleId: id, name, startDate: start, endDate: end, pricePerDay: Math.round(pricePerDay * 100) / 100 } });
  return NextResponse.json({ success: true, rule });
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const { vehicle } = await ownedVehicle(id);
  if (!vehicle) return NextResponse.json({ error: 'Solo el propietario puede gestionar tarifas' }, { status: 403 });
  const { ruleId } = await request.json();
  const rule = await prisma.pricingRule.findUnique({ where: { id: ruleId } });
  if (!rule || rule.vehicleId !== id) return NextResponse.json({ error: 'Tarifa no encontrada' }, { status: 404 });
  await prisma.pricingRule.delete({ where: { id: rule.id } });
  return NextResponse.json({ success: true });
}
