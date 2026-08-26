import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { getFeaturedAudience, sortVehiclesWithHalfHourFeaturedRotation } from '@/lib/featured';
import { ensureDbSchema } from '@/lib/prisma-ensure-schema';

export async function GET(request: Request) {
  try {
    await ensureDbSchema().catch(() => {});

    const { searchParams } = new URL(request.url);
    const island = searchParams.get('island');
    const minPassengers = searchParams.get('passengers');
    const ownerOnly = searchParams.get('owner') === 'me' || searchParams.get('mine') === 'true';

    const currentUser = await getCurrentUser().catch(() => null);
    const whereClause: any = {};

    if (ownerOnly) {
      if (!currentUser) {
        return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 });
      }
      whereClause.OR = [
        { ownerId: currentUser.id },
        ...(currentUser.email ? [
          { owner: { email: currentUser.email } },
          { owner: { email: currentUser.email.toLowerCase() } },
          { owner: { email: currentUser.email.trim() } },
        ] : []),
      ];
    } else {
      whereClause.status = 'ACTIVE';
    }

    if (island && island !== 'todas') whereClause.island = island;
    if (minPassengers) whereClause.passengers = { gte: Number(minPassengers) };

    let vehicles: any[] = [];
    try {
      vehicles = await prisma.vehicle.findMany({
        where: whereClause,
        include: {
          photos: { orderBy: { orderIndex: 'asc' } },
          reviews: { select: { rating: true } },
          owner: { select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (dbErr) {
      console.warn('Prisma findMany vehicles warning:', dbErr);
    }

    const featured = await getFeaturedAudience().catch(() => ({ ownerIds: new Set<string>(), vehicleIds: new Set<string>(), subscriptionOwnerIds: new Set<string>() }));
    const featuredVehicles = vehicles.map((vehicle) => ({
      ...vehicle,
      isFeatured: Boolean(featured.ownerIds.has(vehicle.ownerId) || featured.vehicleIds.has(vehicle.id) || featured.subscriptionOwnerIds.has(vehicle.ownerId) || vehicle.isFeatured),
    }));

    if (ownerOnly) {
      return NextResponse.json(
        { success: true, vehicles: featuredVehicles },
        { headers: { 'Cache-Control': 'no-store, max-age=0' } }
      );
    }

    const finalSortedVehicles = sortVehiclesWithHalfHourFeaturedRotation(featuredVehicles);

    return NextResponse.json(
      { success: true, vehicles: finalSortedVehicles },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  } catch (error: any) {
    console.error('API Vehicles Search Error:', error);
    return NextResponse.json({ error: 'No se pudo consultar el inventario' }, { status: 503 });
  }
}
