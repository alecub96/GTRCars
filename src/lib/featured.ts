import { prisma } from '@/lib/prisma';

/** A propietario is highlighted by merit (20 five-star owner reviews) or an active subscription. */
export async function getFeaturedAudience() {
  try {
    const now = new Date();
    const [meritOwners, activeSubscriptions] = await Promise.all([
      prisma.review.groupBy({
        by: ['subjectId'],
        where: { subjectRole: 'OWNER', rating: 5 },
        _count: { _all: true },
        having: { subjectId: { _count: { gte: 20 } } },
      }).catch(() => []),
      prisma.vipSubscription.findMany({
        where: { status: 'ACTIVE', currentPeriodEnd: { gt: now } },
        select: { userId: true, vehicleId: true },
      }).catch(() => []),
    ]);

    return {
      ownerIds: new Set(meritOwners.map((owner) => owner.subjectId).filter(Boolean)),
      vehicleIds: new Set(activeSubscriptions.map((subscription) => subscription.vehicleId).filter(Boolean)),
      subscriptionOwnerIds: new Set(activeSubscriptions.map((subscription) => subscription.userId).filter(Boolean)),
    };
  } catch (err) {
    console.warn('Featured audience fetch fallback:', err);
    return {
      ownerIds: new Set<string>(),
      vehicleIds: new Set<string>(),
      subscriptionOwnerIds: new Set<string>(),
    };
  }
}

/**
 * Ordena los vehículos colocando SIEMPRE los destacados de primero.
 * Los anuncios destacados rotan equitativamente cada 30 minutos (media hora).
 * Los estándar se ordenan por valoración y fecha de publicación.
 */
export function sortVehiclesWithHalfHourFeaturedRotation(vehicles: any[]) {
  if (!Array.isArray(vehicles) || vehicles.length === 0) return [];

  const now = new Date();
  // Intervalo exacto de 30 minutos (media hora)
  const halfHourSlot = Math.floor(now.getTime() / (1000 * 60 * 30));

  const featured = vehicles.filter((v) => Boolean(v.isFeatured));
  const standard = vehicles.filter((v) => !v.isFeatured);

  // Rotación determinista equitativa de destacados cada media hora
  const rotatedFeatured = [...featured].sort((a, b) => {
    const strA = String(a.id || a.slug || a.title || '');
    const strB = String(b.id || b.slug || b.title || '');
    const seedA = strA.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const seedB = strB.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const hashA = (seedA * 31 + halfHourSlot * 97) % 10000;
    const hashB = (seedB * 31 + halfHourSlot * 97) % 10000;
    return hashB - hashA;
  });

  // Estándar ordenados por mejor valoración y luego fecha
  const sortedStandard = [...standard].sort((a, b) => {
    const avgA = a.reviews && a.reviews.length > 0 ? a.reviews.reduce((s: number, r: any) => s + (r.rating || 5), 0) / a.reviews.length : 5;
    const avgB = b.reviews && b.reviews.length > 0 ? b.reviews.reduce((s: number, r: any) => s + (r.rating || 5), 0) / b.reviews.length : 5;
    if (avgB !== avgA) return avgB - avgA;
    const dateA = new Date(a.createdAt || 0).getTime();
    const dateB = new Date(b.createdAt || 0).getTime();
    return dateB - dateA;
  });

  return [...rotatedFeatured, ...sortedStandard];
}
