import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'OWNER') return NextResponse.json({ error: 'Solo propietarios' }, { status: 403 });
  const [vehicles, views, bookings] = await Promise.all([
    prisma.vehicle.findMany({ where: { ownerId: user.id }, select: { id: true, title: true } }),
    prisma.vehicleView.findMany({ where: { vehicle: { ownerId: user.id } }, select: { vehicleId: true, country: true, source: true, createdAt: true } }),
    prisma.booking.findMany({ where: { ownerId: user.id }, select: { vehicleId: true, status: true, ownerPayout: true, ownerFee: true, totalAmount: true, createdAt: true } }),
  ]);
  const activeStatuses = ['CONFIRMED', 'CHECKIN_PENDING', 'ACTIVE', 'CHECKOUT_PENDING', 'COMPLETED'];
  const perVehicle = vehicles.map((vehicle) => {
    const vehicleViews = views.filter((view) => view.vehicleId === vehicle.id);
    const vehicleBookings = bookings.filter((booking) => booking.vehicleId === vehicle.id);
    return { id: vehicle.id, title: vehicle.title, views: vehicleViews.length, requests: vehicleBookings.length, confirmed: vehicleBookings.filter((booking) => activeStatuses.includes(booking.status)).length, conversion: vehicleViews.length ? Number(((vehicleBookings.length / vehicleViews.length) * 100).toFixed(1)) : 0 };
  });
  const countries = Object.entries(views.reduce<Record<string, number>>((result, view) => { const key = view.country || 'No disponible'; result[key] = (result[key] || 0) + 1; return result; }, {})).sort((a, b) => b[1] - a[1]);
  const paid = bookings.filter((booking) => activeStatuses.includes(booking.status));
  return NextResponse.json({ success: true, stats: { views: views.length, requests: bookings.length, confirmed: paid.length, conversion: views.length ? Number(((bookings.length / views.length) * 100).toFixed(1)) : 0, countries, perVehicle }, finance: { gross: paid.reduce((sum, booking) => sum + booking.totalAmount, 0), platformFees: paid.reduce((sum, booking) => sum + booking.ownerFee, 0), net: paid.reduce((sum, booking) => sum + booking.ownerPayout, 0), pending: bookings.filter((booking) => ['REQUESTED', 'OWNER_ACCEPTED', 'PAYMENT_PENDING'].includes(booking.status)).reduce((sum, booking) => sum + booking.ownerPayout, 0) } });
}
