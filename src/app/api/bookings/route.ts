import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { calculatePricing } from '@/lib/pricing';
import { sendBookingRequestEmail } from '@/lib/email';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 });
  const where = user.role === 'OWNER' ? { ownerId: user.id } : { travelerId: user.id };
  const bookings = await prisma.booking.findMany({ where, include: { vehicle: { include: { photos: { take: 1 } } }, traveler: { select: { firstName: true, lastName: true } }, owner: { select: { firstName: true, lastName: true } } }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ success: true, bookings });
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Debes iniciar sesión para realizar una reserva' }, { status: 401 });
    }

    const body = await request.json();
    const { vehicleId, startDate, endDate, pickupTime, returnTime, selectedExtraIds = [] } = body;

    if (!vehicleId || !startDate || !endDate) {
      return NextResponse.json({ error: 'Parámetros de reserva incompletos' }, { status: 400 });
    }

    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
      include: {
        extras: { include: { extra: true } },
        availabilityBlocks: true,
        owner: { select: { email: true, firstName: true } },
      },
    });

    if (!vehicle || vehicle.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'El vehículo no está disponible' }, { status: 404 });
    }
    if (vehicle.ownerId === user.id || user.role === 'OWNER' || user.role === 'ADMIN') {
      return NextResponse.json({ error: 'Cambia a modo viajero para solicitar una reserva' }, { status: 403 });
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
    const isConflict = vehicle.availabilityBlocks.some((block: any) => {
      return start < block.endDate && end > block.startDate;
    });

    if (isConflict) {
      return NextResponse.json({ error: 'Las fechas seleccionadas ya no están disponibles' }, { status: 409 });
    }

    // Filtrar extras seleccionados válidos
    const chosenExtras = vehicle.extras
      .filter((ve: any) => selectedExtraIds.includes(ve.extraId) && ve.enabled)
      .map((ve: any) => ({
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
    });

    // Código aleatorio único de reserva
    const bookingCode = `NC-${Math.floor(100000 + Math.random() * 900000)}`;

    // Transacción atómica para evitar solapamientos
    const booking = await prisma.$transaction(async (tx: any) => {
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
            create: chosenExtras.map((e: any) => ({
              vehicleExtraId: vehicle.extras.find((ve: any) => ve.extraId === e.id)!.id,
              name: e.name,
              price: e.price,
            })),
          },
        },
      });

      // Crear bloqueo de calendario automáticamente
      await tx.availabilityBlock.create({
        data: {
          vehicleId: vehicle.id,
          startDate: start,
          endDate: end,
          reason: `BOOKING_${newBooking.code}`,
        },
      });

      await tx.conversation.create({
        data: {
          travelerId: user.id, ownerId: vehicle.ownerId, vehicleId: vehicle.id, bookingId: newBooking.id,
          messages: { create: { senderId: user.id, content: `Solicitud ${newBooking.code}: quiero alquilar esta camper del ${start.toLocaleDateString('es-ES')} al ${end.toLocaleDateString('es-ES')}.` } },
        },
      });

      return newBooking;
    });

    if (booking.status === 'REQUESTED') {
      sendBookingRequestEmail(vehicle.owner.email, vehicle.owner.firstName, { code: booking.code, vehicle: vehicle.title, traveler: `${user.firstName} ${user.lastName}`, start, end }).catch((error) => console.error('Booking request email error:', error));
    }

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
    return NextResponse.json({ error: 'Error al procesar la reserva' }, { status: 500 });
  }
}
