import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

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
      photoUrl,
      features,
    } = body;

    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Math.floor(100 + Math.random() * 900)}`;

    const vehicle = await prisma.vehicle.create({
      data: {
        ownerId,
        title,
        slug,
        brand,
        model,
        vehicleType: vehicleType || 'CAMPER',
        year: Number(year),
        island,
        municipality,
        passengers: Number(passengers),
        beds: Number(beds),
        doors: Number(doors) || 4,
        transmission: transmission || 'MANUAL',
        fuelType: fuelType || 'DIESEL',
        fuelConsumption: fuelConsumption || null,
        basePricePerDay: Number(basePricePerDay),
        includedKmPerDay: Number(includedKmPerDay),
        extraKmPrice: Number(extraKmPrice) || 0,
        unlimitedMileage: Boolean(unlimitedMileage),
        securityDeposit: Number(securityDeposit),
        cleaningFee: Number(cleaningFee),
        minDays: Number(minDays) || 2,
        maxDays: Number(maxDays) || 30,
        bookingType: bookingType || 'REQUEST_TO_BOOK',
        cancellationPolicy: cancellationPolicy || 'FLEXIBLE',
        addressApprox: addressApprox || null,
        description,
        rules,
        status: 'PENDING_REVIEW',
        photos: photoUrl ? { create: [{ url: photoUrl, orderIndex: 0 }] } : undefined,
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
    return NextResponse.json({ error: 'Error al publicar camper' }, { status: 500 });
  }
}
