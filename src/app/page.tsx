import React from 'react';
import HomeClientHero from '@/components/HomeClientHero';
import { prisma } from '@/lib/prisma';
import { getFeaturedAudience } from '@/lib/featured';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let featuredVehicles: any[] = [];
  try {
    const vehicles = await prisma.vehicle.findMany({
      where: { status: 'ACTIVE' },
      include: {
        photos: { orderBy: { orderIndex: 'asc' }, take: 1 },
        owner: { select: { firstName: true, avatarUrl: true, verification: true } },
        reviews: { select: { rating: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    const featured = await getFeaturedAudience();
    featuredVehicles = vehicles
      .map((vehicle) => ({ ...vehicle, isFeatured: featured.ownerIds.has(vehicle.ownerId) || featured.vehicleIds.has(vehicle.id) || featured.subscriptionOwnerIds.has(vehicle.ownerId) }))
      .sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured))
      .slice(0, 6);
  } catch (err) {
    console.warn('Prisma no conectado durante SSR. Usando fallback.');
  }

  return <HomeClientHero initialVehicles={featuredVehicles} />;
}
