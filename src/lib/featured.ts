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
