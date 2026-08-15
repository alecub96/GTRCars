import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { databaseUnavailableResponse, isDatabaseUnavailable } from '@/lib/api-error';

const VEHICLE_TYPES = new Set(['CAMPER', 'CAMPER_GRAN_VOLUMEN', 'TURISMO_CAMPERIZADO', 'CARAVANA', 'AUTOCARAVANA', '4X4_CAMPERIZADO', 'BARCO']);
const ISLANDS = new Set(['Gran Canaria', 'Tenerife', 'Lanzarote', 'Fuerteventura', 'La Palma', 'La Gomera', 'El Hierro', 'La Graciosa']);

import { ensureDbSchema } from '@/lib/prisma-ensure-schema';

export async function POST(request: Request) {
  try {
    await ensureDbSchema();

    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Debes iniciar sesión para publicar una camper' }, { status: 401 });

    // Si el usuario publica un anuncio pero su rol en la BD sigue en TRAVELER, se actualiza automaticamente a OWNER
    if (user.role !== 'OWNER' && user.role !== 'ADMIN') {
      await prisma.user.update({
        where: { id: user.id },
        data: { role: 'OWNER' },
      }).catch((err) => console.warn('Auto role promotion warning:', err));
    }

    const ownerId = user.id;
    if (!ownerId) return NextResponse.json({ error: 'Propietario no válido' }, { status: 401 });

    const body = await request.json();
    const {
      title,
      brand,
      model,
      vehicleType,
      year,
      island,
      municipality,
      passengers,
      beds,
      doors,
      transmission,
      fuelType,
      fuelConsumption,
      basePricePerDay,
      includedKmPerDay,
      extraKmPrice,
      unlimitedMileage,
      securityDeposit,
      cleaningFee,
      minDays,
      maxDays,
      bookingType,
      cancellationPolicy,
      addressApprox,
      description,
      rules,
      features,
    } = body;

    const clean = {
      title: typeof title === 'string' ? title.trim() : '',
      brand: typeof brand === 'string' ? brand.trim() : '',
      model: typeof model === 'string' ? model.trim() : '',
      municipality: typeof municipality === 'string' ? municipality.trim() : '',
      description: typeof description === 'string' ? description.trim() : '',
      rules: typeof rules === 'string' ? rules.trim() : '',
    };

    const numeric = {
      year: Number(year),
      passengers: Number(passengers),
      beds: Number(beds),
      doors: Number(doors),
      basePricePerDay: Number(basePricePerDay),
      includedKmPerDay: Number(includedKmPerDay),
      extraKmPrice: Number(extraKmPrice),
      securityDeposit: Number(securityDeposit),
      cleaningFee: Number(cleaningFee),
      minDays: Number(minDays),
      maxDays: Number(maxDays),
    };

    const currentYear = new Date().getFullYear();

    // VALIDACIONES ESPECÍFICAS Y CLARAS
    if (!clean.title || clean.title.length < 5) {
      return NextResponse.json({ error: 'El título del anuncio debe tener al menos 5 caracteres.' }, { status: 400 });
    }
    if (!clean.brand || clean.brand.length < 2) {
      return NextResponse.json({ error: 'Introduce la marca del vehículo (ejemplo: Volkswagen, Fiat, Mercedes).' }, { status: 400 });
    }
    if (!clean.model || clean.model.length < 1) {
      return NextResponse.json({ error: 'Introduce el modelo de la furgoneta (ejemplo: California, Ducato).' }, { status: 400 });
    }
    if (!VEHICLE_TYPES.has(vehicleType)) {
      return NextResponse.json({ error: 'Selecciona un tipo de vehículo válido.' }, { status: 400 });
    }
    if (!ISLANDS.has(island)) {
      return NextResponse.json({ error: 'Selecciona una isla de Canarias válida.' }, { status: 400 });
    }
    if (!clean.municipality || clean.municipality.length < 2) {
      return NextResponse.json({ error: 'Introduce el municipio donde se encuentra el vehículo.' }, { status: 400 });
    }
    if (!clean.description || clean.description.length < 40) {
      return NextResponse.json({
        error: `La descripción de la camper es demasiado corta (mínimo 40 caracteres, actualmente tienes ${clean.description.length}).`,
      }, { status: 400 });
    }
    if (!clean.rules || clean.rules.length < 10) {
      return NextResponse.json({
        error: `Las normas de uso son demasiado cortas (mínimo 10 caracteres, actualmente tienes ${clean.rules.length}).`,
      }, { status: 400 });
    }
    if (numeric.basePricePerDay < 10 || numeric.basePricePerDay > 2000) {
      return NextResponse.json({ error: 'El precio por día debe estar entre 10€ y 2000€.' }, { status: 400 });
    }
    if (numeric.securityDeposit < 0 || numeric.securityDeposit > 20000) {
      return NextResponse.json({ error: 'La fianza introducida no es válida.' }, { status: 400 });
    }

    const slugBase = clean.title.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80) || 'vehiculo';
    const slug = `${slugBase}-${crypto.randomUUID().slice(0, 8)}`;

    // CREACIÓN DIRECTA DEL VEHÍCULO
    const vehicle = await prisma.vehicle.create({
      data: {
        ownerId,
        title: clean.title,
        slug,
        brand: clean.brand,
        model: clean.model,
        vehicleType,
        year: numeric.year || currentYear,
        island,
        municipality: clean.municipality,
        passengers: numeric.passengers || 2,
        beds: numeric.beds || 2,
        doors: numeric.doors || 4,
        transmission: (['MANUAL', 'AUTOMATIC'].includes(transmission) ? transmission : 'MANUAL') as any,
        fuelType: (['DIESEL', 'GASOLINE', 'HYBRID', 'ELECTRIC'].includes(fuelType) ? fuelType : 'DIESEL') as any,
        fuelConsumption: fuelConsumption || null,
        basePricePerDay: numeric.basePricePerDay,
        includedKmPerDay: numeric.includedKmPerDay || 150,
        extraKmPrice: numeric.extraKmPrice || 0.25,
        unlimitedMileage: Boolean(unlimitedMileage),
        securityDeposit: numeric.securityDeposit || 500,
        cleaningFee: numeric.cleaningFee || 30,
        minDays: numeric.minDays || 2,
        maxDays: numeric.maxDays || 30,
        bookingType: (['REQUEST_TO_BOOK', 'INSTANT_BOOKING'].includes(bookingType) ? bookingType : 'REQUEST_TO_BOOK') as any,
        cancellationPolicy: cancellationPolicy || 'MODERATE',
        latitude: body.latitude ? Number(body.latitude) : null,
        longitude: body.longitude ? Number(body.longitude) : null,
        addressApprox: typeof addressApprox === 'string' && addressApprox ? addressApprox.trim() : clean.municipality,
        description: clean.description,
        rules: clean.rules,
        status: 'PENDING_REVIEW',
      },
    });

    // CREACIÓN DE EQUIPAMIENTOS SECUNDARIOS SI EXISTEN
    if (Array.isArray(features) && features.length > 0) {
      const validFeatures = features
        .filter((name): name is string => typeof name === 'string' && name.trim().length > 0)
        .map((name) => ({ vehicleId: vehicle.id, name: name.trim() }));

      if (validFeatures.length > 0) {
        await prisma.vehicleFeature.createMany({
          data: validFeatures,
        }).catch((err) => console.warn('Non-fatal feature creation warning:', err));
      }
    }

    // CREACIÓN DE REGLAS DE PRECIOS POR TEMPORADA / FECHAS
    if (Array.isArray(body.pricingRules) && body.pricingRules.length > 0) {
      const validRules = body.pricingRules
        .filter((r: any) => r && r.startDate && r.endDate && Number(r.pricePerDay) > 0)
        .map((r: any) => ({
          vehicleId: vehicle.id,
          name: typeof r.name === 'string' && r.name.trim() ? r.name.trim() : 'Tarifa especial',
          startDate: new Date(r.startDate),
          endDate: new Date(r.endDate),
          pricePerDay: Number(r.pricePerDay),
        }));

      if (validRules.length > 0) {
        await prisma.pricingRule.createMany({
          data: validRules,
        }).catch((err) => console.warn('Non-fatal pricing rule creation warning:', err));
      }
    }

    return NextResponse.json({ success: true, vehicle });
  } catch (error: any) {
    console.error('API Publish Vehicle Error:', error);
    if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
    const message = typeof error?.message === 'string' ? error.message : '';
    return NextResponse.json({
      error: `No se pudo guardar el anuncio: ${message || 'Error en la base de datos.'}`,
      debug: message,
    }, { status: 500 });
  }
}
