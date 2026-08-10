import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

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
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalVolume = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
    const totalPlatformCommission = bookings.reduce((sum, b) => sum + (b.travelerFee + b.ownerFee), 0);
    const totalOwnerPayoutsPending = bookings
      .filter((b) => b.status === 'CONFIRMED' || b.status === 'COMPLETED')
      .reduce((sum, b) => sum + b.ownerPayout, 0);

    return NextResponse.json({
      success: true,
      metrics: {
        totalBookings: bookings.length,
        totalVolume,
        totalPlatformCommission,
        totalOwnerPayoutsPending,
      },
      payouts: bookings.map((b) => ({
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
    return NextResponse.json({ error: 'Error al consultar panel financiero' }, { status: 500 });
  }
}
