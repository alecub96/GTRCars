import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { databaseUnavailableResponse, isDatabaseUnavailable } from '@/lib/api-error';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    if (user.role !== 'ADMIN') return NextResponse.json({ error: 'Acceso restringido' }, { status: 403 });
    const bookings = await prisma.booking.findMany({
      include: {
        vehicle: { select: { title: true, island: true } },
        traveler: { select: { firstName: true, lastName: true, email: true } },
        owner: { select: { firstName: true, lastName: true, email: true, stripeAccountId: true } },
        payments: { select: { status: true, amount: true, currency: true, createdAt: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const paidBookings = bookings.filter((b) => b.payments.some((payment) => payment.status === 'SUCCEEDED'));
    const totalVolume = paidBookings.reduce((sum, b) => sum + b.totalAmount, 0);
    const totalPlatformCommission = paidBookings.reduce((sum, b) => sum + (b.travelerFee + b.ownerFee), 0);
    const totalOwnerPayoutsPending = paidBookings
      .filter((b) => b.status === 'CONFIRMED' || b.status === 'COMPLETED')
      .reduce((sum, b) => sum + b.ownerPayout, 0);

    return NextResponse.json({
      success: true,
      metrics: {
        totalBookings: bookings.length,
        totalVolume,
        totalPlatformCommission,
        totalOwnerPayoutsPending,
        stripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('mock')),
        connectedOwners: new Set(bookings.filter((booking) => booking.owner.stripeAccountId).map((booking) => booking.owner.email)).size,
      },
      payouts: paidBookings.map((b) => ({
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
