import React from 'react';
import HomeClientHero from '@/components/HomeClientHero';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let featuredVehicles: any[] = [];
  try {
    featuredVehicles = await prisma.vehicle.findMany({
      where: { status: 'ACTIVE' },
      take: 6,
      include: {
        photos: { orderBy: { orderIndex: 'asc' }, take: 1 },
        owner: { select: { firstName: true, avatarUrl: true, verification: true } },
        reviews: { select: { rating: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch (err) {
    console.warn('Prisma no conectado durante SSR. Usando fallback.');
  }

  return <HomeClientHero initialVehicles={featuredVehicles} />;
}
