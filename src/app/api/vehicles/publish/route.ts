import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { databaseUnavailableResponse, isDatabaseUnavailable } from '@/lib/api-error';

const VEHICLE_TYPES = new Set(['CAMPER', 'CAMPER_GRAN_VOLUMEN', 'TURISMO_CAMPERIZADO', 'CARAVANA', 'AUTOCARAVANA', '4X4_CAMPERIZADO', 'BARCO']);
const ISLANDS = new Set(['Gran Canaria', 'Tenerife', 'Lanzarote', 'Fuerteventura', 'La Palma', 'La Gomera', 'El Hierro', 'La Graciosa']);

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Debes iniciar sesión para publicar una camper' }, { status: 401 });
    if (user.role !== 'OWNER') return NextResponse.json({ error: 'Solo los propietarios pueden publicar campers' }, { status: 403 });
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
      title: typeof title === 'string' ? title.trim() : '', brand: typeof brand === 'string' ? brand.trim() : '', model: typeof model === 'string' ? model.trim() : '',
      municipality: typeof municipality === 'string' ? municipality.trim() : '', description: typeof description === 'string' ? description.trim() : '', rules: typeof rules === 'string' ? rules.trim() : '',
    };
    const numeric = { year: Number(year), passengers: Number(passengers), beds: Number(beds), doors: Number(doors), basePricePerDay: Number(basePricePerDay), includedKmPerDay: Number(includedKmPerDay), extraKmPrice: Number(extraKmPrice), securityDeposit: Number(securityDeposit), cleaningFee: Number(cleaningFee), minDays: Number(minDays), maxDays: Number(maxDays) };
    const currentYear = new Date().getFullYear();
    if (!clean.title || clean.title.length > 120 || clean.brand.length < 2 || clean.brand.length > 60 || clean.model.length < 1 || clean.model.length > 80 || !VEHICLE_TYPES.has(vehicleType) || !ISLANDS.has(island) || clean.municipality.length < 2 || clean.municipality.length > 100 || clean.description.length < 80 || clean.description.length > 5_000 || clean.rules.length < 10 || clean.rules.length > 3_000) {
      return NextResponse.json({ error: 'Revisa los datos, la descripción y las normas del vehículo' }, { status: 400 });
    }
    if (!Number.isInteger(numeric.year) || numeric.year < 1970 || numeric.year > currentYear + 1 || !Number.isInteger(numeric.passengers) || numeric.passengers < 1 || numeric.passengers > 12 || !Number.isInteger(numeric.beds) || numeric.beds < 1 || numeric.beds > 12 || !Number.isInteger(numeric.doors) || numeric.doors < 1 || numeric.doors > 10 || numeric.basePricePerDay < 10 || numeric.basePricePerDay > 2_000 || numeric.includedKmPerDay < 0 || numeric.includedKmPerDay > 2_000 || numeric.extraKmPrice < 0 || numeric.extraKmPrice > 20 || numeric.securityDeposit < 0 || numeric.securityDeposit > 20_000 || numeric.cleaningFee < 0 || numeric.cleaningFee > 1_000 || !Number.isInteger(numeric.minDays) || !Number.isInteger(numeric.maxDays) || numeric.minDays < 1 || numeric.maxDays < numeric.minDays || numeric.maxDays > 365) {
      return NextResponse.json({ error: 'Revisa capacidades, año, precios y duración de las reservas' }, { status: 400 });
    }
    if (!['MANUAL', 'AUTOMATIC'].includes(transmission) || !['DIESEL', 'GASOLINE', 'HYBRID', 'ELECTRIC'].includes(fuelType) || !['REQUEST_TO_BOOK', 'INSTANT_BOOKING'].includes(bookingType) || !['FLEXIBLE', 'MODERATE', 'STRICT'].includes(cancellationPolicy)) {
      return NextResponse.json({ error: 'La configuración del anuncio no es válida' }, { status: 400 });
    }

    const slugBase = clean.title.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80) || 'vehiculo';
    const slug = `${slugBase}-${crypto.randomUUID().slice(0, 8)}`;

    const vehicle = await prisma.vehicle.create({
      data: {
        ownerId,
        title: clean.title,
        slug,
        brand: clean.brand,
        model: clean.model,
        vehicleType,
        year: numeric.year,
        island,
        municipality: clean.municipality,
        passengers: numeric.passengers,
        beds: numeric.beds,
        doors: numeric.doors,
        transmission,
        fuelType,
        fuelConsumption: fuelConsumption || null,
        basePricePerDay: numeric.basePricePerDay,
        includedKmPerDay: numeric.includedKmPerDay,
        extraKmPrice: numeric.extraKmPrice,
        unlimitedMileage: Boolean(unlimitedMileage),
        securityDeposit: numeric.securityDeposit,
        cleaningFee: numeric.cleaningFee,
        minDays: numeric.minDays,
        maxDays: numeric.maxDays,
        bookingType,
        cancellationPolicy,
        addressApprox: addressApprox || null,
        description: clean.description,
        rules: clean.rules,
        status: 'PENDING_REVIEW',
        features: {
          create: Array.isArray(features)
            ? features.filter((name): name is string => typeof name === 'string' && name.trim().length > 0).map((name) => ({ name: name.trim() }))
            : [],
        },
      },
    });

    return NextResponse.json({ success: true, vehicle });
  } catch (error) {
    console.error('API Publish Vehicle Error:', error);
    if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
    return NextResponse.json({ error: 'Error al publicar camper' }, { status: 500 });
  }
}
