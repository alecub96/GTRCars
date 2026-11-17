import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';
import { ensureDbSchema } from '@/lib/prisma-ensure-schema';

export async function GET() {
  try {
    await ensureDbSchema().catch(() => {});
    const user = await requireAdmin();
    if (!user) return NextResponse.json({ error: 'Acceso restringido' }, { status: 403 });

    const bookings = await prisma.booking.findMany({
      include: {
        vehicle: { select: { title: true, island: true, securityDeposit: true, photos: { take: 1 } } },
        traveler: { select: { firstName: true, lastName: true, email: true, phone: true } },
        owner: { select: { firstName: true, lastName: true, email: true, stripeAccountId: true } },
        payments: { select: { status: true, amount: true, currency: true, createdAt: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    const paidBookings = bookings.filter((b: any) => b.payments.some((payment: any) => payment.status === 'SUCCEEDED'));
    const totalVolume = paidBookings.reduce((sum: number, b: any) => sum + (b.totalAmount || 0), 0);
    const totalPlatformCommission = paidBookings.reduce((sum: number, b: any) => sum + ((b.travelerFee || 0) + (b.ownerFee || 0)), 0);
    const totalOwnerPayoutsPending = paidBookings
      .filter((b: any) => b.status === 'CONFIRMED' || b.status === 'COMPLETED')
      .reduce((sum: number, b: any) => sum + (b.ownerPayout || 0), 0);

    const [
      activeVehiclesCount,
      pendingVehiclesCount,
      totalVehiclesCount,
      pendingVerificationsCount,
      verifiedDriversCount,
      pendingIncidentsCount,
      activeSupportChatsCount,
      totalUsersCount,
      totalConversationsCount,
      totalMessagesCount,
    ] = await Promise.all([
      prisma.vehicle.count({ where: { status: 'ACTIVE' } }).catch(() => 0),
      prisma.vehicle.count({ where: { status: 'PENDING_REVIEW' } }).catch(() => 0),
      prisma.vehicle.count().catch(() => 0),
      prisma.user.count({ where: { verification: 'PENDING' } }).catch(() => 0),
      prisma.user.count({ where: { verification: 'VERIFIED' } }).catch(() => 0),
      prisma.incident.count({ where: { status: { in: ['OPEN', 'UNDER_REVIEW', 'AWAITING_TRAVELER', 'AWAITING_OWNER'] } } }).catch(() => 0),
      prisma.supportConversation.count({ where: { status: 'OPEN' } }).catch(() => 0),
      prisma.user.count().catch(() => 0),
      prisma.conversation.count().catch(() => 0),
      prisma.message.count().catch(() => 0),
    ]);

    return NextResponse.json({
      success: true,
      metrics: {
        totalBookings: bookings.length,
        activeBookings: bookings.filter((b) => b.status === 'ACTIVE' || b.status === 'CHECKIN_PENDING' || b.status === 'CHECKOUT_PENDING').length,
        totalVolume,
        totalPlatformCommission,
        platformEarnings: totalPlatformCommission,
        totalOwnerPayoutsPending,
        pendingOwnerPayouts: totalOwnerPayoutsPending,
        activeVehiclesCount,
        pendingVehiclesCount,
        totalVehiclesCount,
        pendingVerificationsCount,
        verifiedDriversCount,
        pendingIncidentsCount,
        totalUsersCount,
        totalConversationsCount,
        totalMessagesCount,
        unreadMessagesCount: activeSupportChatsCount,
        stripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('mock')),
        connectedOwners: new Set(bookings.filter((booking: any) => booking.owner?.stripeAccountId).map((booking: any) => booking.owner?.email)).size,
      },
      recentBookings: bookings.map((b: any) => ({
        id: b.id,
        code: b.code,
        status: b.status,
        totalAmount: b.totalAmount,
        pickupDate: b.pickupDate,
        returnDate: b.returnDate,
        vehicleTitle: b.vehicle?.title || 'Vehículo',
        vehicleIsland: b.vehicle?.island || 'Canarias',
        securityDeposit: b.vehicle?.securityDeposit || 0,
        travelerName: `${b.traveler?.firstName || ''} ${b.traveler?.lastName || ''}`.trim() || b.traveler?.email,
        ownerName: `${b.owner?.firstName || ''} ${b.owner?.lastName || ''}`.trim() || b.owner?.email,
        createdAt: b.createdAt,
      })),
      payouts: paidBookings.map((b: any) => ({
        bookingId: b.id,
        bookingCode: b.code,
        vehicleTitle: b.vehicle?.title,
        island: b.vehicle?.island,
        travelerName: `${b.traveler?.firstName} ${b.traveler?.lastName}`,
        ownerName: `${b.owner?.firstName} ${b.owner?.lastName}`,
        ownerEmail: b.owner?.email,
        totalCollectedFromTraveler: b.totalAmount,
        platformCommissionTaken: (b.travelerFee || 0) + (b.ownerFee || 0),
        ownerPayoutAmount: b.ownerPayout,
        status: b.status,
        date: b.createdAt,
      })),
    });
  } catch (error: any) {
    console.error('Admin dashboard API critical error:', error);
    return NextResponse.json({ error: error.message || 'Error cargando dashboard' }, { status: 500 });
  }
}
