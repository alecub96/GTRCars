import { prisma } from '@/lib/prisma';

/** A propietario is highlighted by merit (20 five-star owner reviews) or an active subscription. */
export async function getFeaturedAudience() {
  const now = new Date();
  const [meritOwners, activeSubscriptions] = await Promise.all([
    prisma.review.groupBy({
      by: ['subjectId'],
      where: { subjectRole: 'OWNER', rating: 5 },
      _count: { _all: true },
      having: { subjectId: { _count: { gte: 20 } } },
    }),
    prisma.vipSubscription.findMany({
      where: { status: 'ACTIVE', currentPeriodEnd: { gt: now } },
      select: { userId: true, vehicleId: true },
    }),
  ]);

  return {
    ownerIds: new Set(meritOwners.map((owner) => owner.subjectId)),
    vehicleIds: new Set(activeSubscriptions.map((subscription) => subscription.vehicleId)),
    subscriptionOwnerIds: new Set(activeSubscriptions.map((subscription) => subscription.userId)),
  };
}
