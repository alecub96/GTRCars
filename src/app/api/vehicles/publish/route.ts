import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Debes iniciar sesión para publicar una camper' }, { status: 401 });
    if (user.role !== 'OWNER') return NextResponse.json({ error: 'Solo los propietarios pueden publicar campers' }, { status: 403 });
    const ownerId = user.id;

    // Si no está autenticado, usar el propietario demo de Gran Canaria para no cortar el onboarding
    if (!ownerId) return NextResponse.json({ error: 'Propietario no válido' }, { status: 401 });

    const body = await request.json();
    const {
      title,
      brand,
      model,
      year,
      island,
      municipality,
      passengers,
      beds,
      transmission,
      fuelType,
      basePricePerDay,
      includedKmPerDay,
      securityDeposit,
      cleaningFee,
      description,
      rules,
      photoUrl,
    } = body;

    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Math.floor(100 + Math.random() * 900)}`;

    const vehicle = await prisma.vehicle.create({
      data: {
        ownerId,
        title,
        slug,
        brand,
        model,
        year: Number(year),
        island,
        municipality,
        passengers: Number(passengers),
        beds: Number(beds),
        transmission: transmission || 'MANUAL',
        fuelType: fuelType || 'DIESEL',
        basePricePerDay: Number(basePricePerDay),
        includedKmPerDay: Number(includedKmPerDay),
        securityDeposit: Number(securityDeposit),
        cleaningFee: Number(cleaningFee),
        description,
        rules,
        status: 'ACTIVE',
        photos: {
          create: [{ url: photoUrl || 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=1200', orderIndex: 0 }],
        },
      },
    });

    return NextResponse.json({ success: true, vehicle });
  } catch (error) {
    console.error('API Publish Vehicle Error:', error);
    return NextResponse.json({ error: 'Error al publicar camper' }, { status: 500 });
  }
}
