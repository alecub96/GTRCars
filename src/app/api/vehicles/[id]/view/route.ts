import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const vehicle = await prisma.vehicle.findUnique({ where: { id }, select: { ownerId: true, status: true } });
  if (!vehicle || vehicle.status !== 'ACTIVE') return NextResponse.json({ error: 'Anuncio no encontrado' }, { status: 404 });
  const user = await getCurrentUser();
  if (user?.id === vehicle.ownerId || user?.role === 'ADMIN') return NextResponse.json({ success: true, tracked: false });
  const body = await request.json().catch(() => ({}));
  const event = body.event === 'IMPRESSION' ? 'IMPRESSION' : 'VIEW';
  const country = request.headers.get('x-vercel-ip-country') || request.headers.get('cf-ipcountry') || null;
  const referer = request.headers.get('referer');
  let source = 'directo';
  if (referer) { try { source = new URL(referer).hostname; } catch {} }
  await prisma.vehicleView.create({ data: { vehicleId: id, viewerId: user?.id || null, country, source, event } });
  return NextResponse.json({ success: true, tracked: true });
}
