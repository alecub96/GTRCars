import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { databaseUnavailableResponse, isDatabaseUnavailable } from '@/lib/api-error';
import { ensureDbSchema } from '@/lib/prisma-ensure-schema';

export const dynamic = 'force-dynamic';

const VEHICLE_TYPES = new Set(['CAMPER', 'CAMPER_GRAN_VOLUMEN', 'TURISMO_CAMPERIZADO', 'CARAVANA', 'AUTOCARAVANA', '4X4_CAMPERIZADO', 'BARCO']);
const ISLANDS = new Set(['Gran Canaria', 'Tenerife', 'Lanzarote', 'Fuerteventura', 'La Palma', 'La Gomera', 'El Hierro', 'La Graciosa']);

/**
 * GET: Obtener los detalles completos de una camper para visualizarla o editarla
 */
export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await ensureDbSchema();
    const { id } = await context.params;
    const currentUser = await getCurrentUser().catch(() => null);

    const vehicle = await prisma.vehicle.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        photos: { orderBy: { orderIndex: 'asc' } },
        features: true,
        pricingRules: { orderBy: { startDate: 'asc' } },
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            email: true,
            phone: true,
            verification: true,
          },
        },
      },
    });

    if (!vehicle) return NextResponse.json({ error: 'Vehículo no encontrado' }, { status: 404 });

    const canViewPrivateVehicle = Boolean(currentUser && (currentUser.role === 'ADMIN' || currentUser.id === vehicle.ownerId));
    if (vehicle.status !== 'ACTIVE' && !canViewPrivateVehicle) {
      return NextResponse.json({ error: 'Vehículo no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, vehicle });
  } catch (error) {
    if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
    console.error('Error fetching vehicle:', error);
    return NextResponse.json({ error: 'Error cargando datos del vehículo' }, { status: 500 });
  }
}

/**
 * PATCH / PUT: Actualizar los datos completos de una camper (Propietario / Admin)
 */
export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await ensureDbSchema();
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 });

    const { id } = await context.params;
    const vehicle = await prisma.vehicle.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      select: { id: true, ownerId: true, slug: true },
    });

    if (!vehicle) return NextResponse.json({ error: 'Vehículo no encontrado' }, { status: 404 });

    const isOwner = vehicle.ownerId === user.id;
    const isAdmin = user.role === 'ADMIN';
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'No tienes permiso para editar este anuncio' }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      brand,
      model,
      vehicleType,
      year,
      island,
      municipality,
      addressApprox,
      latitude,
      longitude,
      passengers,
      beds,
      doors,
      transmission,
      fuelType,
      fuelConsumption,
      basePricePerDay,
      includedKmPerDay,
      extraKmPrice,
      securityDeposit,
      cleaningFee,
      minDays,
      maxDays,
      bookingType,
      cancellationPolicy,
      description,
      rules,
      features,
      photos,
    } = body;

    const dataToUpdate: any = {};

    if (typeof title === 'string' && title.trim().length >= 5) dataToUpdate.title = title.trim();
    if (typeof brand === 'string' && brand.trim()) dataToUpdate.brand = brand.trim();
    if (typeof model === 'string' && model.trim()) dataToUpdate.model = model.trim();
    if (typeof vehicleType === 'string' && VEHICLE_TYPES.has(vehicleType)) dataToUpdate.vehicleType = vehicleType;
    if (typeof island === 'string' && ISLANDS.has(island)) dataToUpdate.island = island;
    if (typeof municipality === 'string' && municipality.trim()) dataToUpdate.municipality = municipality.trim();
    if (typeof addressApprox === 'string') dataToUpdate.addressApprox = addressApprox.trim();
    if (typeof description === 'string' && description.trim().length >= 10) dataToUpdate.description = description.trim();
    if (typeof rules === 'string') dataToUpdate.rules = rules.trim();
    if (typeof transmission === 'string') {
      const norm = transmission.toUpperCase().trim();
      if (['MANUAL', 'AUTOMATIC'].includes(norm)) dataToUpdate.transmission = norm;
    }
    if (typeof fuelType === 'string') {
      let norm = fuelType.toUpperCase().trim();
      if (norm === 'GASOLINA') norm = 'GASOLINE';
      if (['DIESEL', 'GASOLINE', 'HYBRID', 'ELECTRIC'].includes(norm)) dataToUpdate.fuelType = norm;
    }
    if (typeof fuelConsumption === 'string') dataToUpdate.fuelConsumption = fuelConsumption.trim();
    if (typeof bookingType === 'string' && ['INSTANT_BOOKING', 'REQUEST_TO_BOOK'].includes(bookingType)) dataToUpdate.bookingType = bookingType;
    if (typeof cancellationPolicy === 'string' && ['FLEXIBLE', 'MODERATE', 'STRICT'].includes(cancellationPolicy)) dataToUpdate.cancellationPolicy = cancellationPolicy;

    if (latitude !== undefined) dataToUpdate.latitude = Number(latitude) || null;
    if (longitude !== undefined) dataToUpdate.longitude = Number(longitude) || null;

    if (year !== undefined && Number(year) >= 1970 && Number(year) <= new Date().getFullYear() + 1) {
      dataToUpdate.year = Number(year);
    }
    if (passengers !== undefined && Number(passengers) >= 1) dataToUpdate.passengers = Number(passengers);
    if (beds !== undefined && Number(beds) >= 1) dataToUpdate.beds = Number(beds);
    if (doors !== undefined && Number(doors) >= 2) dataToUpdate.doors = Number(doors);

    if (basePricePerDay !== undefined && Number(basePricePerDay) >= 15) {
      dataToUpdate.basePricePerDay = Number(basePricePerDay);
    }
    if (includedKmPerDay !== undefined && Number(includedKmPerDay) >= 0) {
      dataToUpdate.includedKmPerDay = Number(includedKmPerDay);
    }
    if (extraKmPrice !== undefined && Number(extraKmPrice) >= 0) {
      dataToUpdate.extraKmPrice = Number(extraKmPrice);
    }
    if (securityDeposit !== undefined && Number(securityDeposit) >= 0) {
      dataToUpdate.securityDeposit = Number(securityDeposit);
    }
    if (cleaningFee !== undefined && Number(cleaningFee) >= 0) {
      dataToUpdate.cleaningFee = Number(cleaningFee);
    }
    if (minDays !== undefined && Number(minDays) >= 1) dataToUpdate.minDays = Number(minDays);
    if (maxDays !== undefined && Number(maxDays) >= 1) dataToUpdate.maxDays = Number(maxDays);

    const updatedVehicle = await prisma.$transaction(async (tx) => {
      const v = await tx.vehicle.update({
        where: { id: vehicle.id },
        data: dataToUpdate,
      });

      // Actualizar equipamiento/características si se proporcionan
      if (Array.isArray(features)) {
        await tx.vehicleFeature.deleteMany({ where: { vehicleId: vehicle.id } });
        for (const feat of features) {
          const name = typeof feat === 'string' ? feat.trim() : feat?.name?.trim();
          if (name) {
            await tx.vehicleFeature.create({
              data: { vehicleId: vehicle.id, name },
            });
          }
        }
      }

      // Actualizar o añadir fotos si se proporcionan
      if (Array.isArray(photos) && photos.length > 0) {
        await tx.vehiclePhoto.deleteMany({ where: { vehicleId: vehicle.id } });
        for (let i = 0; i < photos.length; i++) {
          const photoUrl = typeof photos[i] === 'string' ? photos[i] : photos[i]?.url;
          if (photoUrl) {
            await tx.vehiclePhoto.create({
              data: {
                vehicleId: vehicle.id,
                url: photoUrl,
                orderIndex: i,
              },
            });
          }
        }
      }

      return v;
    });

    return NextResponse.json({
      success: true,
      vehicle: updatedVehicle,
      message: '¡Anuncio actualizado con éxito!',
    });
  } catch (error: any) {
    if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
    console.error('Error updating vehicle:', error);
    return NextResponse.json({ error: error.message || 'No se pudo actualizar el anuncio' }, { status: 500 });
  }
}

/**
 * DELETE: Eliminar un anuncio (Propietario / Admin)
 */
export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await ensureDbSchema();
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 });

    const { id } = await context.params;
    const vehicle = await prisma.vehicle.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      select: { id: true, ownerId: true },
    });

    if (!vehicle) return NextResponse.json({ error: 'Vehículo no encontrado' }, { status: 404 });

    const isOwner = vehicle.ownerId === user.id;
    const isAdmin = user.role === 'ADMIN';
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'No tienes permiso para eliminar este anuncio' }, { status: 403 });
    }

    await prisma.vehicle.delete({ where: { id: vehicle.id } });
    return NextResponse.json({ success: true, message: 'Anuncio eliminado correctamente' });
  } catch (error) {
    if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
    console.error('Error deleting vehicle:', error);
    return NextResponse.json({ error: 'No se pudo eliminar el anuncio' }, { status: 500 });
  }
}
