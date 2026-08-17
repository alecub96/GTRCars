import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateIcsCalendar } from '@/lib/ical';
import { ensureDbSchema } from '@/lib/prisma-ensure-schema';
import { REALISTIC_CANARIAN_CAMPERS } from '@/lib/demo-campers-data';

export const dynamic = 'force-dynamic';

/**
 * Endpoint oficial de exportación de calendario iCal (.ics)
 * URL de uso: https://vaneando.com/api/calendar/export/[id]
 */
export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await ensureDbSchema();
    const { id } = await context.params;

    let vehicle: any = null;
    try {
      vehicle = await prisma.vehicle.findFirst({
        where: {
          OR: [{ id }, { slug: id }],
        },
        select: {
          id: true,
          slug: true,
          title: true,
          bookings: {
            where: { status: { in: ['CONFIRMED', 'ACTIVE', 'COMPLETED'] } },
            select: { id: true, code: true, pickupDate: true, returnDate: true, status: true },
          },
          availabilityBlocks: {
            select: { id: true, startDate: true, endDate: true, reason: true },
          },
        },
      });
    } catch {}

    // Fallback a camper demo si no está en la BD
    if (!vehicle) {
      const demo = REALISTIC_CANARIAN_CAMPERS.find((d) => d.id === id || d.slug === id);
      if (demo) {
        vehicle = {
          id: demo.id,
          slug: demo.slug,
          title: demo.title,
          bookings: [],
          availabilityBlocks: [],
        };
      }
    }

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehículo no encontrado' }, { status: 404 });
    }

    const icsString = generateIcsCalendar({
      vehicleTitle: vehicle.title,
      vehicleSlug: vehicle.slug,
      bookings: (vehicle.bookings || []).map((b: any) => ({
        id: b.id,
        code: b.code,
        startDate: b.pickupDate,
        endDate: b.returnDate,
        status: b.status,
      })),
      blocks: vehicle.availabilityBlocks || [],
    });

    return new NextResponse(icsString, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="${vehicle.slug}-vaneando.ics"`,
        'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
      },
    });
  } catch (error: any) {
    console.error('Calendar export endpoint error:', error);
    return NextResponse.json({ error: 'Error exportando calendario' }, { status: 500 });
  }
}
