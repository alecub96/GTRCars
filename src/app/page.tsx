import React from 'react';
import HomeClientHero from '@/components/HomeClientHero';
import { prisma } from '@/lib/prisma';
import { getFeaturedAudience } from '@/lib/featured';
import { REALISTIC_CANARIAN_CAMPERS } from '@/lib/demo-campers-data';

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
      .sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
  } catch (err) {
    // Modo fallback
  }

  // Si hay pocos vehículos en base de datos, enriquecer con las campers hiperrealistas de Canarias
  const combinedVehicles = [...featuredVehicles];
  for (const demo of REALISTIC_CANARIAN_CAMPERS) {
    if (!combinedVehicles.some((v) => v.slug === demo.slug)) {
      combinedVehicles.push(demo);
    }
  }

  return <HomeClientHero initialVehicles={combinedVehicles.slice(0, 9)} />;
}
