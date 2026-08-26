import React, { Suspense } from 'react';
import HomeClientHero from '@/components/HomeClientHero';
import { prisma } from '@/lib/prisma';
import { getFeaturedAudience } from '@/lib/featured';

export const revalidate = 60;
const isBuild = process.env.NEXT_PHASE === 'phase-production-build';

export default async function HomePage() {
  let featuredVehicles: any[] = [];
  try {
    if (!isBuild) {
      const { ensureDbSchema } = await import('@/lib/prisma-ensure-schema');
      await ensureDbSchema().catch(() => {});
    }
    const fetchVehiclesPromise = prisma.vehicle.findMany({
      where: { status: 'ACTIVE' },
      include: {
        photos: { orderBy: { orderIndex: 'asc' }, take: 1 },
        owner: { select: { firstName: true, avatarUrl: true, verification: true } },
        reviews: { select: { rating: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 12,
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('DB Timeout')), 800)
    );

    const vehicles = await Promise.race([fetchVehiclesPromise, timeoutPromise]);
    const featured = await getFeaturedAudience();
    featuredVehicles = (vehicles as any[])
      .map((vehicle) => ({
        ...vehicle,
        isFeatured:
          featured.ownerIds.has(vehicle.ownerId) ||
          featured.vehicleIds.has(vehicle.id) ||
          featured.subscriptionOwnerIds.has(vehicle.ownerId),
      }))
      .sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
  } catch (err) {
    // Si la base de datos no responde, la home muestra estado vacío; nunca inventa inventario.
  }

  return (
    <Suspense fallback={null}>
      <HomeClientHero initialVehicles={featuredVehicles.slice(0, 9)} />
    </Suspense>
  );
}
