import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { calculatePricing } from '@/lib/pricing';
import { sendBookingCreatedOwnerEmail } from '@/lib/email';
import { Prisma } from '@/generated/prisma/client';
import { databaseUnavailableResponse, isDatabaseUnavailable } from '@/lib/api-error';

const MAX_BOOKING_ATTEMPTS = 3;

function isSerializationConflict(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2034';
}

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 });
    const { searchParams } = new URL(request.url);
    const asRole = searchParams.get('as') || searchParams.get('role');
    const where = asRole === 'traveler'
      ? { travelerId: user.id }
      : asRole === 'owner'
      ? { ownerId: user.id }
      : { OR: [{ ownerId: user.id }, { travelerId: user.id }] };

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        vehicle: { include: { photos: { take: 1 } } },
        traveler: { select: { firstName: true, lastName: true, email: true } },
        owner: { select: { firstName: true, lastName: true, email: true } },
        conversations: { select: { id: true }, take: 1 },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, bookings }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
    return NextResponse.json({ error: 'No se pudieron cargar las reservas' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Debes iniciar sesión para realizar una reserva' }, { status: 401 });
    }

    const body = await request.json();
    const { vehicleId, startDate, endDate, pickupTime, returnTime } = body;
    const selectedExtraIds = Array.isArray(body.selectedExtraIds)
      ? body.selectedExtraIds.filter((id: unknown): id is string => typeof id === 'string')
      : [];

    if (!vehicleId || !startDate || !endDate) {
      return NextResponse.json({ error: 'Parámetros de reserva incompletos' }, { status: 400 });
    }

    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
      include: {
        extras: { include: { extra: true } },
        availabilityBlocks: true,
        pricingRules: true,
        owner: { select: { email: true, firstName: true } },
      },
    });

    if (!vehicle || vehicle.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'El vehículo no está disponible' }, { status: 404 });
    }
    if (vehicle.ownerId === user.id) {
      return NextResponse.json({ error: 'No puedes reservar tu propio vehículo' }, { status: 400 });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return NextResponse.json({ error: 'La fecha de salida debe ser anterior a la de devolución' }, { status: 400 });
    }
    if (start < new Date(new Date().toISOString().slice(0, 10))) return NextResponse.json({ error: 'La fecha de entrega no puede estar en el pasado' }, { status: 400 });
    const requestedDays = Math.ceil((end.getTime() - start.getTime()) / 86400000);
    if (requestedDays < vehicle.minDays || requestedDays > vehicle.maxDays) return NextResponse.json({ error: `Este vehículo admite reservas de ${vehicle.minDays} a ${vehicle.maxDays} días` }, { status: 400 });

    // Comprobar Double-Booking con bloques de disponibilidad existentes
    const isConflict = vehicle.availabilityBlocks.some((block) => {
      return start < block.endDate && end > block.startDate;
    });

    if (isConflict) {
      return NextResponse.json({ error: 'Las fechas seleccionadas ya no están disponibles' }, { status: 409 });
    }

    // Filtrar extras seleccionados válidos
    const chosenExtras = vehicle.extras
      .filter((ve) => selectedExtraIds.includes(ve.extraId) && ve.enabled)
      .map((ve) => ({
        id: ve.extra.id,
        name: ve.extra.name,
        price: ve.price,
        priceType: ve.extra.priceType as 'PER_RENTAL' | 'PER_DAY',
      }));

    // Calcular precios autoritativos en Backend
    const pricing = calculatePricing({
      basePricePerDay: vehicle.basePricePerDay,
      startDate: start,
      endDate: end,
      selectedExtras: chosenExtras,
      cleaningFee: vehicle.cleaningFee,
      ownershipType: vehicle.ownershipType as 'PLATFORM' | 'THIRD_PARTY',
      pricingRules: vehicle.pricingRules,
    });

    let booking = null;
    for (let attempt = 1; attempt <= MAX_BOOKING_ATTEMPTS; attempt += 1) {
      try {
        booking = await prisma.$transaction(async (tx) => {
          // Comprobar si hay conflicto con bloqueos de calendario o reservas ya confirmadas/pagadas
          const blockConflict = await tx.availabilityBlock.findFirst({
            where: {
              vehicleId: vehicle.id,
              startDate: { lt: end },
              endDate: { gt: start },
            },
            select: { id: true },
          });
          if (blockConflict) throw new Error('BOOKING_DATES_CONFLICT');

          const confirmedBookingConflict = await tx.booking.findFirst({
            where: {
              vehicleId: vehicle.id,
              status: { in: ['CONFIRMED', 'ACTIVE', 'COMPLETED', 'CHECKIN_PENDING', 'CHECKOUT_PENDING'] },
              pickupDate: { lt: end },
              returnDate: { gt: start },
            },
            select: { id: true },
          });
          if (confirmedBookingConflict) throw new Error('BOOKING_DATES_CONFLICT');

          const bookingCode = `NC-${crypto.randomUUID().replaceAll('-', '').slice(0, 8).toUpperCase()}`;
          const newBooking = await tx.booking.create({
            data: {
              code: bookingCode,
              travelerId: user.id,
              ownerId: vehicle.ownerId,
              vehicleId: vehicle.id,
              pickupDate: start,
              returnDate: end,
              pickupTime: pickupTime || '10:00',
              returnTime: returnTime || '18:00',
              totalDays: pricing.totalDays,
              basePrice: pricing.basePriceTotal,
              extrasTotal: pricing.extrasTotal,
              cleaningFee: pricing.cleaningFee,
              travelerFee: pricing.travelerFee,
              ownerFee: pricing.ownerFee,
              ownerPayout: pricing.ownerPayout,
              depositAmount: vehicle.securityDeposit,
              totalAmount: pricing.totalAmount,
              pricingSnapshot: JSON.stringify(pricing),
              status: vehicle.bookingType === 'INSTANT_BOOKING' ? 'OWNER_ACCEPTED' : 'REQUESTED',
              depositStatus: 'PENDING',
              extras: {
                create: chosenExtras
                  .map((e) => {
                    const found = vehicle.extras.find((ve) => ve.extraId === e.id);
                    return found ? { vehicleExtraId: found.id, name: e.name, price: e.price } : null;
                  })
                  .filter((item): item is { vehicleExtraId: string; name: string; price: number } => Boolean(item)),
              },
            },
          });

          await tx.conversation.create({
        data: {
          travelerId: user.id, ownerId: vehicle.ownerId, vehicleId: vehicle.id, bookingId: newBooking.id,
          messages: { create: { senderId: user.id, content: `Solicitud ${newBooking.code}: quiero alquilar esta camper del ${start.toLocaleDateString('es-ES')} al ${end.toLocaleDateString('es-ES')}.` } },
        },
          });

          return newBooking;
        }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
        break;
      } catch (error) {
        if (error instanceof Error && error.message === 'BOOKING_DATES_CONFLICT') {
          return NextResponse.json({ error: 'Las fechas seleccionadas ya no están disponibles' }, { status: 409 });
        }
        if (!isSerializationConflict(error) || attempt === MAX_BOOKING_ATTEMPTS) throw error;
      }
    }

    if (!booking) throw new Error('No se pudo confirmar la reserva');

    sendBookingCreatedOwnerEmail(vehicle.owner.email, vehicle.owner.firstName, {
      code: booking.code,
      vehicle: vehicle.title,
      traveler: `${user.firstName} ${user.lastName}`,
      start,
      end,
      instant: booking.status === 'OWNER_ACCEPTED',
      reservationId: booking.id,
    }).catch((error) => console.error('Booking owner notification email error:', error));

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        code: booking.code,
        status: booking.status,
        totalAmount: booking.totalAmount,
        depositAmount: booking.depositAmount,
      },
    });
  } catch (error) {
    console.error('API Booking Creation Error:', error);
    if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
    return NextResponse.json({ error: 'Error al procesar la reserva' }, { status: 500 });
  }
}
