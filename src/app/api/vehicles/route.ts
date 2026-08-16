import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { getFeaturedAudience } from '@/lib/featured';
import { ensureDbSchema } from '@/lib/prisma-ensure-schema';
import { REALISTIC_CANARIAN_CAMPERS } from '@/lib/demo-campers-data';

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

    // Si no hay campers en BD y no es consulta privada de propietario, usar campers de respaldo
    if ((!vehicles || vehicles.length === 0) && !ownerOnly) {
      vehicles = REALISTIC_CANARIAN_CAMPERS.filter((c) => {
        if (island && island !== 'todas' && !c.island.toLowerCase().includes(island.toLowerCase())) return false;
        if (minPassengers && c.passengers < Number(minPassengers)) return false;
        return true;
      });
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

    const now = new Date();
    const activeFeaturedVehicles = featuredVehicles.filter((vehicle) => vehicle.isFeatured);
    const standardVehicles = featuredVehicles.filter((vehicle) => !vehicle.isFeatured);

    const dayOfYear = Math.floor(
      (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
    );

    const rotatedFeaturedVehicles = [...activeFeaturedVehicles].sort((a, b) => {
      const hashA = ((a.id || '').charCodeAt(0) + dayOfYear) % 100;
      const hashB = ((b.id || '').charCodeAt(0) + dayOfYear) % 100;
      return hashB - hashA;
    });

    const sortedStandardVehicles = [...standardVehicles].sort((a, b) => {
      const avgA = a.reviews && a.reviews.length > 0 ? a.reviews.reduce((s: number, r: any) => s + (r.rating || 5), 0) / a.reviews.length : 5;
      const avgB = b.reviews && b.reviews.length > 0 ? b.reviews.reduce((s: number, r: any) => s + (r.rating || 5), 0) / b.reviews.length : 5;
      return avgB - avgA;
    });

    const finalSortedVehicles = [...rotatedFeaturedVehicles, ...sortedStandardVehicles];

    return NextResponse.json(
      { success: true, vehicles: finalSortedVehicles },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  } catch (error: any) {
    console.error('API Vehicles Search Error:', error);
    // Fallback garantizado a campers de Canarias
    return NextResponse.json(
      { success: true, vehicles: REALISTIC_CANARIAN_CAMPERS },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  }
}
