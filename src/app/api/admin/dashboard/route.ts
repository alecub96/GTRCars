import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';
import { databaseUnavailableResponse, isDatabaseUnavailable } from '@/lib/api-error';

export async function GET() {
  try {
    const user = await requireAdmin();
    if (!user) return NextResponse.json({ error: 'Acceso restringido' }, { status: 403 });

    const bookings = await prisma.booking.findMany({
      include: {
        vehicle: { select: { title: true, island: true } },
        traveler: { select: { firstName: true, lastName: true, email: true } },
        owner: { select: { firstName: true, lastName: true, email: true, stripeAccountId: true } },
        payments: { select: { status: true, amount: true, currency: true, createdAt: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const paidBookings = bookings.filter((b: any) => b.payments.some((payment: any) => payment.status === 'SUCCEEDED'));
    const totalVolume = paidBookings.reduce((sum: number, b: any) => sum + b.totalAmount, 0);
    const totalPlatformCommission = paidBookings.reduce((sum: number, b: any) => sum + (b.travelerFee + b.ownerFee), 0);
    const totalOwnerPayoutsPending = paidBookings
      .filter((b: any) => b.status === 'CONFIRMED' || b.status === 'COMPLETED')
      .reduce((sum: number, b: any) => sum + b.ownerPayout, 0);

    const [pendingVehiclesCount, pendingVerificationsCount, pendingIncidentsCount, activeSupportChatsCount] = await Promise.all([
      prisma.vehicle.count({ where: { status: 'PENDING_REVIEW' } }).catch(() => 0),
      prisma.user.count({ where: { verification: 'PENDING' } }).catch(() => 0),
      prisma.incident.count({ where: { status: { in: ['OPEN', 'UNDER_REVIEW', 'AWAITING_TRAVELER', 'AWAITING_OWNER'] } } }).catch(() => 0),
      prisma.supportConversation.count({ where: { status: 'OPEN' } }).catch(() => 0),
    ]);

    return NextResponse.json({
      success: true,
      metrics: {
        totalBookings: bookings.length,
        totalVolume,
        totalPlatformCommission,
        totalOwnerPayoutsPending,
        pendingVehiclesCount,
        pendingVerificationsCount,
        pendingIncidentsCount,
        unreadMessagesCount: activeSupportChatsCount,
        stripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('mock')),
        connectedOwners: new Set(bookings.filter((booking: any) => booking.owner.stripeAccountId).map((booking: any) => booking.owner.email)).size,
      },
      payouts: paidBookings.map((b: any) => ({
        bookingId: b.id,
        bookingCode: b.code,
        vehicleTitle: b.vehicle.title,
        island: b.vehicle.island,
        travelerName: `${b.traveler.firstName} ${b.traveler.lastName}`,
        ownerName: `${b.owner.firstName} ${b.owner.lastName}`,
        ownerEmail: b.owner.email,
        totalCollectedFromTraveler: b.totalAmount,
        platformCommissionTaken: b.travelerFee + b.ownerFee,
        ownerPayoutAmount: b.ownerPayout,
        status: b.status,
        date: b.createdAt,
      })),
    });
  } catch (error) {
    console.error('API Admin Dashboard Error:', error);
    if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
    return NextResponse.json({ error: 'Error al consultar panel financiero' }, { status: 500 });
  }
}
