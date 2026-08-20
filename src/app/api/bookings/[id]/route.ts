import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { sendBookingStatusEmail, sendBookingCancelledByOwnerEmail, sendContractCancelledEmail } from '@/lib/email';
import { databaseUnavailableResponse, isDatabaseUnavailable } from '@/lib/api-error';

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
 try {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 });
  const { id } = await context.params;
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      vehicle: { select: { id: true, title: true, brand: true, model: true, year: true, island: true, municipality: true, rules: true, cancellationPolicy: true, includedKmPerDay: true, extraKmPrice: true, photos: { orderBy: { orderIndex: 'asc' } } } },
      traveler: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
      owner: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
      contract: true,
      checkIn: { include: { photos: true } },
      checkOut: { include: { photos: true } },
    },
  });
  if (!booking) return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 });
  if (![booking.travelerId, booking.ownerId].includes(user.id) && user.role !== 'ADMIN') return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  const viewerRole = booking.travelerId === user.id ? 'TRAVELER' : booking.ownerId === user.id ? 'OWNER' : 'ADMIN';
  return NextResponse.json({ success: true, booking, viewerRole });
 } catch (error) {
   if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
   return NextResponse.json({ error: 'No se pudo cargar la reserva' }, { status: 500 });
 }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
 try {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 });
  const { id } = await context.params;
  const body = await request.json();
  const action = body.action;
  const cancelReason = typeof body.reason === 'string' ? body.reason.trim() : '';

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      vehicle: true,
      traveler: { select: { id: true, email: true, firstName: true, lastName: true } },
      owner: { select: { id: true, email: true, firstName: true, lastName: true } },
      checkIn: { include: { photos: true } },
      contract: true,
    },
  });
  if (!booking) return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 });

  const isTraveler = booking.travelerId === user.id;
  const isOwner = booking.ownerId === user.id;
  const isAdmin = user.role === 'ADMIN';
  if (!isTraveler && !isOwner && !isAdmin) return NextResponse.json({ error: 'No tienes permiso sobre esta reserva' }, { status: 403 });

  // 1. CANCELAR CONTRATO (PROPIETARIO / ADMIN)
  if (action === 'cancel-contract' && (isOwner || isAdmin)) {
    let existingSnapshot: any = {};
    try {
      if (booking.contract?.termsSnapshot) existingSnapshot = JSON.parse(booking.contract.termsSnapshot);
    } catch (_) {}

    const termsSnapshot = JSON.stringify({
      ...existingSnapshot,
      contractCancelled: true,
      cancelledBy: isOwner ? 'OWNER' : 'ADMIN',
      cancelledByName: `${user.firstName || 'Propietario'} ${user.lastName || ''}`.trim(),
      cancelledAt: new Date().toISOString(),
      cancelledReason: cancelReason || 'Cancelado por el propietario para corrección de datos o cláusulas.',
    });

    const updatedContract = await prisma.contract.upsert({
      where: { bookingId: booking.id },
      update: {
        signedByTraveler: false,
        travelerSignature: null,
        signedByOwner: false,
        ownerSignature: null,
        termsSnapshot,
      },
      create: {
        bookingId: booking.id,
        signedByTraveler: false,
        signedByOwner: false,
        termsSnapshot,
      },
    });

    // Enviar correo de notificación al viajero
    sendContractCancelledEmail(booking.traveler.email, booking.traveler.firstName, {
      code: booking.code,
      vehicle: booking.vehicle.title,
      reason: cancelReason,
      bookingId: booking.id,
    }).catch((err) => console.error('Error sending contract cancelled email:', err));

    return NextResponse.json({
      success: true,
      contract: updatedContract,
      message: 'Contrato cancelado con éxito. Se ha enviado un correo al cliente y ahora puedes regenerarlo.',
    });
  }

  // 2. REHACER CONTRATO (PROPIETARIO / ADMIN)
  if (action === 'redo-contract' && (isOwner || isAdmin)) {
    let existingSnapshot: any = {};
    try {
      if (booking.contract?.termsSnapshot) existingSnapshot = JSON.parse(booking.contract.termsSnapshot);
    } catch (_) {}

    const termsSnapshot = JSON.stringify({
      ...existingSnapshot,
      contractCancelled: false,
      cancelledReason: null,
      cancelledAt: null,
      version: '2026-08-20',
      bookingCode: booking.code,
      vehicle: booking.vehicle.title,
      pickupDate: booking.pickupDate,
      returnDate: booking.returnDate,
      totalAmount: booking.totalAmount,
      depositAmount: booking.depositAmount,
      pricingSnapshot: booking.pricingSnapshot,
      regeneratedAt: new Date().toISOString(),
    });

    const updatedContract = await prisma.contract.upsert({
      where: { bookingId: booking.id },
      update: {
        signedByTraveler: false,
        travelerSignature: null,
        signedByOwner: false,
        ownerSignature: null,
        signedAt: null,
        termsSnapshot,
      },
      create: {
        bookingId: booking.id,
        signedByTraveler: false,
        signedByOwner: false,
        termsSnapshot,
      },
    });

    return NextResponse.json({
      success: true,
      contract: updatedContract,
      message: 'Nuevo contrato preparado. Ya puedes firmarlo y enviarlo al viajero.',
    });
  }

  // 3. ACEPTAR / RECHAZAR / CANCELAR RESERVAS
  let status = booking.status;
  let isOwnerCancellation = false;

  if (action === 'accept' && (isOwner || isAdmin) && booking.status === 'REQUESTED') {
    status = 'OWNER_ACCEPTED';
  } else if (action === 'reject' && (isOwner || isAdmin) && ['REQUESTED', 'OWNER_ACCEPTED'].includes(booking.status)) {
    status = 'OWNER_REJECTED';
  } else if (action === 'cancel' || action === 'owner-cancel') {
    // Los propietarios y administradores pueden cancelar cualquier reserva (incluso automáticas o confirmadas)
    if (isOwner || isAdmin) {
      status = 'CANCELLED';
      isOwnerCancellation = true;
    } else if (isTraveler && ['REQUESTED', 'OWNER_ACCEPTED', 'PAYMENT_PENDING', 'CONFIRMED'].includes(booking.status)) {
      status = 'CANCELLED';
    } else {
      return NextResponse.json({ error: 'No tienes permiso para cancelar en este estado' }, { status: 409 });
    }
  } else if (action === 'save-inspection' && (isOwner || isTraveler || isAdmin)) {
    const { odometer = 0, fuelLevel = 'FULL', waterLevel = 'FULL', cleanliness = 'EXCELLENT', notes = '', photos = [] } = body;
    
    const checkIn = await prisma.checkIn.upsert({
      where: { bookingId: booking.id },
      update: {
        odometer: Number(odometer) || 0,
        fuelLevel: String(fuelLevel),
        waterLevel: String(waterLevel),
        cleanliness: String(cleanliness),
        notes: String(notes || ''),
        signed: true,
      },
      create: {
        bookingId: booking.id,
        odometer: Number(odometer) || 0,
        fuelLevel: String(fuelLevel),
        waterLevel: String(waterLevel),
        cleanliness: String(cleanliness),
        notes: String(notes || ''),
        signed: true,
      },
    });

    if (Array.isArray(photos) && photos.length > 0) {
      await prisma.checkInPhoto.deleteMany({ where: { checkInId: checkIn.id } });
      for (const p of photos) {
        if (p?.url) {
          await prisma.checkInPhoto.create({
            data: {
              checkInId: checkIn.id,
              url: p.url,
              tag: p.tag || 'INSPECTION',
            },
          });
        }
      }
    }

    return NextResponse.json({ success: true, checkIn });
  } else if (action === 'sign-contract' && (isTraveler || isOwner || isAdmin)) {
    const signature = typeof body.signature === 'string' ? body.signature.trim() : '';
    const accepted = body.acceptedTerms === true && body.acceptedPrivacy === true && body.acceptedDeposit === true;
    if (signature.length < 5 || !accepted) return NextResponse.json({ error: 'Completa la firma y acepta todas las condiciones' }, { status: 400 });
    
    let existingSnapshot: any = {};
    try {
      if (booking.contract?.termsSnapshot) existingSnapshot = JSON.parse(booking.contract.termsSnapshot);
    } catch (_) {}

    const termsSnapshot = JSON.stringify({
      ...existingSnapshot,
      contractCancelled: false,
      version: '2026-08-20',
      bookingCode: booking.code,
      vehicle: booking.vehicle.title,
      pickupDate: booking.pickupDate,
      returnDate: booking.returnDate,
      totalAmount: booking.totalAmount,
      depositAmount: booking.depositAmount,
      pricingSnapshot: booking.pricingSnapshot,
      inspectionSnapshot: body.inspectionData || existingSnapshot.inspectionSnapshot || null,
      acceptedAt: new Date().toISOString(),
      acceptedTerms: true,
      acceptedPrivacy: true,
      acceptedDeposit: true,
    });

    const signatureUpdate = isTraveler
      ? { signedByTraveler: true, travelerSignature: signature }
      : { signedByOwner: true, ownerSignature: signature };

    const contract = await prisma.contract.upsert({
      where: { bookingId: booking.id },
      update: { ...signatureUpdate, signedAt: new Date(), termsSnapshot },
      create: { bookingId: booking.id, ...signatureUpdate, signedAt: new Date(), termsSnapshot },
    });
    return NextResponse.json({ success: true, contract });
  } else {
    return NextResponse.json({ error: 'La acción no está permitida para el estado actual' }, { status: 409 });
  }

  // Transacción para actualizar el estado de la reserva y liberar calendario
  const updated = await prisma.$transaction(async (tx) => {
    const result = await tx.booking.update({ where: { id }, data: { status } });
    if (status === 'CANCELLED' || status === 'OWNER_REJECTED') {
      await tx.availabilityBlock.deleteMany({
        where: {
          vehicleId: booking.vehicleId,
          reason: { contains: booking.code },
        },
      });
    }
    return result;
  });

  // Notificaciones por correo
  if (isOwnerCancellation) {
    sendBookingCancelledByOwnerEmail(booking.traveler.email, booking.traveler.firstName, {
      code: booking.code,
      vehicle: booking.vehicle.title,
      reason: cancelReason,
      bookingId: booking.id,
    }).catch((err) => console.error('Error sending owner cancellation email:', err));
  } else {
    const recipient = isTraveler ? booking.owner : booking.traveler;
    sendBookingStatusEmail(recipient.email, recipient.firstName, {
      code: booking.code,
      status,
      vehicle: booking.vehicle.title,
      reservationId: booking.id,
    }).catch((error) => console.error('Booking status email error:', error));
  }

  return NextResponse.json({ success: true, booking: updated });
 } catch (error) {
   if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
   console.error('Booking update error:', error);
   return NextResponse.json({ error: 'No se pudo actualizar la reserva' }, { status: 500 });
 }
}
