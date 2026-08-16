import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { databaseUnavailableResponse, isDatabaseUnavailable } from '@/lib/api-error';

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json().catch(() => ({}));
    const event = body.event === 'IMPRESSION' ? 'IMPRESSION' : 'VIEW';
    const user = await getCurrentUser().catch(() => null);

    const vehicle = await prisma.vehicle.findUnique({ where: { id }, select: { ownerId: true, status: true } }).catch(() => null);
    if (!vehicle) return NextResponse.json({ success: true, tracked: false, demo: true });
    if (user?.id === vehicle.ownerId || user?.role === 'ADMIN') return NextResponse.json({ success: true, tracked: false });

    const country = request.headers.get('x-vercel-ip-country') || request.headers.get('cf-ipcountry') || null;
    const referer = request.headers.get('referer');
    let source = 'directo';
    if (referer) { try { source = new URL(referer).hostname; } catch {} }

    await prisma.vehicleView.create({
      data: { vehicleId: id, viewerId: user?.id || null, country, source, event },
    }).catch(() => {});

    return NextResponse.json({ success: true, tracked: true });
  } catch (error) {
    console.warn('Vehicle analytics event error:', error);
    return NextResponse.json({ success: true, tracked: false });
  }
}
