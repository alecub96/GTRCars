import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';
import { REALISTIC_CANARIAN_CAMPERS } from '../src/lib/demo-campers-data';

async function main() {
  console.log('🌱 Inicializando los 3 anuncios realistas canarios con fotos de public/anuncios/ ...');

  const passwordHash = await bcrypt.hash('VaneandoDemo2026!', 10);

  for (const camper of REALISTIC_CANARIAN_CAMPERS) {
    // 1. Buscar o crear propietario local
    let owner = await prisma.user.findUnique({
      where: { email: camper.owner.email },
    });

    if (!owner) {
      owner = await prisma.user.create({
        data: {
          email: camper.owner.email,
          passwordHash,
          firstName: camper.owner.firstName,
          lastName: camper.owner.lastName,
          phone: camper.owner.phone,
          avatarUrl: camper.owner.avatarUrl,
          role: 'OWNER',
          verification: 'VERIFIED',
        },
      });
      console.log(`👤 Propietario local creado: ${owner.firstName} ${owner.lastName} (${owner.email})`);
    }

    // 2. Buscar o crear vehículo
    let vehicle = await prisma.vehicle.findFirst({
      where: {
        OR: [
          { slug: camper.slug },
          { title: camper.title },
        ],
      },
    });

    if (!vehicle) {
      vehicle = await prisma.vehicle.create({
        data: {
          ownerId: owner.id,
          title: camper.title,
          slug: camper.slug,
          brand: camper.brand,
          model: camper.model,
          vehicleType: camper.vehicleType as any,
          year: camper.year,
          island: camper.island,
          municipality: camper.municipality,
          addressApprox: camper.addressApprox,
          latitude: camper.latitude,
          longitude: camper.longitude,
          passengers: camper.passengers,
          beds: camper.beds,
          doors: camper.doors,
          transmission: camper.transmission as any,
          fuelType: camper.fuelType as any,
          fuelConsumption: camper.fuelConsumption,
          basePricePerDay: camper.basePricePerDay,
          includedKmPerDay: camper.includedKmPerDay,
          extraKmPrice: camper.extraKmPrice,
          securityDeposit: camper.securityDeposit,
          cleaningFee: camper.cleaningFee,
          minDays: camper.minDays,
          maxDays: camper.maxDays,
          bookingType: 'REQUEST_TO_BOOK',
          cancellationPolicy: 'MODERATE',
          description: camper.description,
          rules: camper.rules,
          status: 'ACTIVE',
          isVip: false,
        },
      });
      console.log(`🚐 Camper creada: ${vehicle.title} (${vehicle.slug})`);

      // 3. Crear fotos
      for (let i = 0; i < camper.photos.length; i++) {
        await prisma.vehiclePhoto.create({
          data: {
            vehicleId: vehicle.id,
            url: camper.photos[i].url,
            orderIndex: camper.photos[i].orderIndex,
          },
        });
      }

      // 4. Crear equipamiento
      for (const feat of camper.features) {
        await prisma.vehicleFeature.create({
          data: {
            vehicleId: vehicle.id,
            name: feat.name,
          },
        });
      }

      // 5. Crear reseñas auténticas
      for (const rev of camper.reviews) {
        const reviewerEmail = `${rev.author.firstName.toLowerCase().replace(/[^a-z0-9]/g, '')}@viajeros-vaneando.canarias`;
        let reviewer = await prisma.user.findUnique({ where: { email: reviewerEmail } });
        if (!reviewer) {
          reviewer = await prisma.user.create({
            data: {
              email: reviewerEmail,
              passwordHash,
              firstName: rev.author.firstName.split(' ')[0],
              lastName: rev.author.firstName.split(' ')[1] || 'García',
              role: 'TRAVELER',
              verification: 'VERIFIED',
            },
          });
        }

        const mockBooking = await prisma.booking.create({
          data: {
            code: `VAN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
            vehicleId: vehicle.id,
            travelerId: reviewer.id,
            ownerId: owner.id,
            pickupDate: new Date('2024-05-10T10:00:00.000Z'),
            returnDate: new Date('2024-05-15T18:00:00.000Z'),
            totalDays: 5,
            basePrice: camper.basePricePerDay * 5,
            totalAmount: camper.basePricePerDay * 5 + 30,
            pricingSnapshot: JSON.stringify({ basePrice: camper.basePricePerDay }),
            status: 'COMPLETED',
          },
        });

        await prisma.review.create({
          data: {
            bookingId: mockBooking.id,
            vehicleId: vehicle.id,
            authorId: reviewer.id,
            subjectId: owner.id,
            subjectRole: 'OWNER',
            rating: rev.rating,
            comment: rev.comment,
          },
        });
      }

      // 6. Bloqueo total de calendario (2025-2030)
      await prisma.availabilityBlock.create({
        data: {
          vehicleId: vehicle.id,
          startDate: new Date('2025-01-01T00:00:00.000Z'),
          endDate: new Date('2030-12-31T23:59:59.000Z'),
          reason: 'RESERVADA_TEMPORADA_COMPLETA',
        },
      });
      console.log(`🔒 Calendario bloqueado totalmente para ${vehicle.title}`);
    }
  }

  console.log('✅ Seed completado con éxito.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
