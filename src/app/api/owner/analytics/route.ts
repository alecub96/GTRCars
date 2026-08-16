import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { databaseUnavailableResponse, isDatabaseUnavailable } from '@/lib/api-error';

export async function GET() {
 try {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'OWNER' && user.role !== 'ADMIN')) return NextResponse.json({ error: 'Solo propietarios' }, { status: 403 });
  const [vehicles, views, bookings] = await Promise.all([
    prisma.vehicle.findMany({ where: { ownerId: user.id }, select: { id: true, title: true } }),
    prisma.vehicleView.findMany({ where: { vehicle: { ownerId: user.id } }, select: { vehicleId: true, country: true, source: true, event: true, createdAt: true } }),
    prisma.booking.findMany({ where: { ownerId: user.id }, select: { vehicleId: true, status: true, ownerPayout: true, ownerFee: true, totalAmount: true, createdAt: true } }),
  ]);
  const activeStatuses = ['CONFIRMED', 'CHECKIN_PENDING', 'ACTIVE', 'CHECKOUT_PENDING', 'COMPLETED'];
  const perVehicle = vehicles.map((vehicle) => {
    const vehicleViews = views.filter((view) => view.vehicleId === vehicle.id && view.event === 'VIEW');
    const impressions = views.filter((view) => view.vehicleId === vehicle.id && view.event === 'IMPRESSION');
    const vehicleBookings = bookings.filter((booking) => booking.vehicleId === vehicle.id);
    return { id: vehicle.id, title: vehicle.title, impressions: impressions.length, views: vehicleViews.length, requests: vehicleBookings.length, confirmed: vehicleBookings.filter((booking) => activeStatuses.includes(booking.status)).length, conversion: vehicleViews.length ? Number(((vehicleBookings.length / vehicleViews.length) * 100).toFixed(1)) : 0 };
  });
  const detailViews = views.filter((view) => view.event === 'VIEW');
  const impressions = views.filter((view) => view.event === 'IMPRESSION');
  const countries = Object.entries(detailViews.reduce<Record<string, number>>((result, view) => { const key = view.country || 'No disponible'; result[key] = (result[key] || 0) + 1; return result; }, {})).sort((a, b) => b[1] - a[1]);
  const paid = bookings.filter((booking) => activeStatuses.includes(booking.status));
  return NextResponse.json({
    success: true,
    stats: {
      impressions: impressions.length,
      views: detailViews.length,
      requests: bookings.length,
      confirmed: paid.length,
      conversion: detailViews.length ? Number(((bookings.length / detailViews.length) * 100).toFixed(1)) : 0,
      countries,
      perVehicle,
    },
    finance: {
      gross: paid.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0),
      platformFees: paid.reduce((sum, booking) => sum + (booking.ownerFee || 0), 0),
      net: paid.reduce((sum, booking) => sum + (booking.ownerPayout || 0), 0),
      pending: bookings
        .filter((booking) => ['REQUESTED', 'OWNER_ACCEPTED', 'PAYMENT_PENDING'].includes(booking.status))
        .reduce((sum, booking) => sum + (booking.ownerPayout || 0), 0),
    },
  });
 } catch (error) {
   console.error('Owner analytics error:', error);
   if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
   return NextResponse.json({ error: 'No se pudieron cargar las estadísticas' }, { status: 500 });
 }
}
