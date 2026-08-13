import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { databaseUnavailableResponse, isDatabaseUnavailable } from '@/lib/api-error';

async function requireAdmin() { const user = await getCurrentUser(); return user?.role === 'ADMIN' ? user : null; }

export async function GET() {
 try {
  if (!await requireAdmin()) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  const vehicles = await prisma.vehicle.findMany({ where: { status: { in: ['PENDING_REVIEW', 'REJECTED'] } }, include: { owner: { select: { firstName: true, lastName: true, email: true } }, photos: { take: 1, orderBy: { orderIndex: 'asc' } } }, orderBy: { createdAt: 'asc' } });
  return NextResponse.json({ success: true, vehicles });
 } catch (error) {
   if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
   return NextResponse.json({ error: 'No se pudo cargar la cola de anuncios' }, { status: 500 });
 }
}

export async function PATCH(request: Request) {
 try {
  if (!await requireAdmin()) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  const { vehicleId, action } = await request.json();
  if (!vehicleId || !['approve', 'reject'].includes(action)) return NextResponse.json({ error: 'Acción inválida' }, { status: 400 });
  const vehicle = await prisma.vehicle.update({ where: { id: vehicleId }, data: { status: action === 'approve' ? 'ACTIVE' : 'REJECTED' } });
  return NextResponse.json({ success: true, vehicle });
 } catch (error) {
   if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
   return NextResponse.json({ error: 'No se pudo revisar el anuncio' }, { status: 500 });
 }
}
