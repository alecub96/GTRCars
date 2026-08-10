import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando Seed de Datos Completo para Nomad Canarias en PostgreSQL Cloud...');

  // Limpiar base de datos
  await prisma.auditLog.deleteMany();
  await prisma.systemSetting.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.seoLocation.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.review.deleteMany();
  await prisma.incident.deleteMany();
  await prisma.checkOutPhoto.deleteMany();
  await prisma.checkOut.deleteMany();
  await prisma.checkInPhoto.deleteMany();
  await prisma.checkIn.deleteMany();
  await prisma.contract.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.bookingExtra.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.vehicleExtra.deleteMany();
  await prisma.extra.deleteMany();
  await prisma.pricingRule.deleteMany();
  await prisma.availabilityBlock.deleteMany();
  await prisma.vehicleFeature.deleteMany();
  await prisma.vehiclePhoto.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.document.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('Password123!', 10);

  // 1. Usuarios principales
  const admin = await prisma.user.create({
    data: {
      email: 'admin@canariascampers.es',
      passwordHash,
      firstName: 'Administrador',
      lastName: 'Canarias',
      role: 'ADMIN',
      verification: 'VERIFIED',
      phone: '+34 928 100 200',
    },
  });

  const owner1 = await prisma.user.create({
    data: {
      email: 'propietario.grancanaria@canariascampers.es',
      passwordHash,
      firstName: 'Carlos',
      lastName: 'Santana',
      role: 'OWNER',
      verification: 'VERIFIED',
      phone: '+34 611 223 344',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    },
  });

  const owner2 = await prisma.user.create({
    data: {
      email: 'propietario.tenerife@canariascampers.es',
      passwordHash,
      firstName: 'Elena',
      lastName: 'Dorta',
      role: 'OWNER',
      verification: 'VERIFIED',
      phone: '+34 622 334 455',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
    },
  });

  const traveler1 = await prisma.user.create({
    data: {
      email: 'viajero@canariascampers.es',
      passwordHash,
      firstName: 'Marc',
      lastName: 'García',
      role: 'TRAVELER',
      verification: 'VERIFIED',
      phone: '+34 655 443 322',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    },
  });

  // 2. Extras globales
  const extraBedding = await prisma.extra.create({
    data: {
      name: 'Kit de Ropa de Cama y Toallas Premium',
      description: 'Sábanas de algodón orgánico, edredón nórdico y toallas de playa.',
      price: 25.0,
      priceType: 'PER_RENTAL',
      icon: 'Bed',
    },
  });

  const extraSurf = await prisma.extra.create({
    data: {
      name: 'Tabla de Surf / Paddle Surf',
      description: 'Incluye funda, invento y parafina.',
      price: 15.0,
      priceType: 'PER_DAY',
      icon: 'Waves',
    },
  });

  const extraAirport = await prisma.extra.create({
    data: {
      name: 'Entrega VIP en Aeropuerto',
      description: 'Recepción directa en la terminal de llegadas.',
      price: 35.0,
      priceType: 'PER_RENTAL',
      icon: 'Plane',
    },
  });

  // 3. Campers Demo por las 8 Islas Canarias
  const campersData = [
    {
      ownerId: owner1.id,
      title: 'Volkswagen California Ocean T6.1 "Maspalomas Freedom"',
      slug: 'volkswagen-california-ocean-gran-canaria',
      brand: 'Volkswagen',
      model: 'California Ocean T6.1',
      year: 2023,
      ownershipType: 'THIRD_PARTY' as const,
      bookingType: 'INSTANT_BOOKING' as const,
      status: 'ACTIVE' as const,
      island: 'Gran Canaria',
      municipality: 'San Bartolomé de Tirajana',
      passengers: 4,
      beds: 4,
      transmission: 'AUTOMATIC' as const,
      fuelType: 'DIESEL' as const,
      basePricePerDay: 95.0,
      includedKmPerDay: 200,
      securityDeposit: 800,
      description: 'Descubre la magia de Gran Canaria a bordo de nuestra impecable VW California Ocean T6.1. Equipada con techo elevable eléctrico, cocina de dos fogones, nevera de compresor de 42L, calefacción estática y toldo lateral. Perfecta para amanecer frente a las dunas de Maspalomas o las cumbres de Tejeda.',
      rules: 'No fumar en el interior. Se admiten mascotas previa consulta. Devolución con depósito lleno.',
      photos: [
        'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=1200',
        'https://images.unsplash.com/photo-1513311968627-2aa4f0f038a4?w=1200',
        'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200'
      ],
      features: ['cocina', 'nevera', 'duchaExterior', 'techoElevable', 'toldo', 'calefaccion', 'solar', 'wifi']
    },
    {
      ownerId: owner2.id,
      title: 'Mercedes-Benz Marco Polo AMG "Teide Explorer"',
      slug: 'mercedes-marco-polo-tenerife',
      brand: 'Mercedes-Benz',
      model: 'Marco Polo V250d',
      year: 2024,
      ownershipType: 'PLATFORM' as const,
      bookingType: 'REQUEST_TO_BOOK' as const,
      status: 'ACTIVE' as const,
      island: 'Tenerife',
      municipality: 'Adeje',
      passengers: 4,
      beds: 4,
      transmission: 'AUTOMATIC' as const,
      fuelType: 'DIESEL' as const,
      basePricePerDay: 110.0,
      includedKmPerDay: 150,
      securityDeposit: 900,
      description: 'El máximo lujo sobre ruedas en Tenerife. Acabado AMG Line, asientos de cuero con calefacción, cocina integrada de diseño Yacht, suelo de madera náutica y tracción total 4MATIC ideal para subir al Teide o acceder a los rincones más salvajes de Anaga.',
      rules: 'Prohibido eventos o fiestas. Conductor mayor de 25 años con al menos 2 años de carnet.',
      photos: [
        'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200',
        'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?w=1200'
      ],
      features: ['cocina', 'nevera', 'duchaInterior', 'aguaCaliente', 'wc', 'toldo', '4x4', 'cuero']
    },
    {
      ownerId: owner1.id,
      title: 'Ford Transit Custom Camper Gran Volumen "Timanfaya Spirit"',
      slug: 'ford-transit-camper-lanzarote',
      brand: 'Ford',
      model: 'Transit Custom L2H2',
      year: 2022,
      ownershipType: 'THIRD_PARTY' as const,
      bookingType: 'INSTANT_BOOKING' as const,
      status: 'ACTIVE' as const,
      island: 'Lanzarote',
      municipality: 'Tías',
      passengers: 2,
      beds: 2,
      transmission: 'MANUAL' as const,
      fuelType: 'DIESEL' as const,
      basePricePerDay: 85.0,
      includedKmPerDay: 200,
      securityDeposit: 600,
      description: 'Camperización artesanal en madera de pino canario. Ducha interior con agua caliente, baño químico cassette, placa solar de 200W e inversor a 230V para trabajar en remoto frente a las olas de Famara.',
      rules: 'Mascotas bienvenidas. Cuidar los acabados de madera.',
      photos: [
        'https://images.unsplash.com/photo-1563720223185-11003d516935?w=1200',
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200'
      ],
      features: ['cocina', 'nevera', 'duchaInterior', 'aguaCaliente', 'wc', 'solar', 'inversor220V']
    },
    {
      ownerId: owner2.id,
      title: 'Fiat Ducato Autocaravana Capuchina "Corralejo Wave"',
      slug: 'fiat-ducato-autocaravana-fuerteventura',
      brand: 'Fiat',
      model: 'Ducato Mobilvetta',
      year: 2021,
      ownershipType: 'THIRD_PARTY' as const,
      bookingType: 'REQUEST_TO_BOOK' as const,
      status: 'ACTIVE' as const,
      island: 'Fuerteventura',
      municipality: 'La Oliva',
      passengers: 6,
      beds: 6,
      transmission: 'MANUAL' as const,
      fuelType: 'DIESEL' as const,
      basePricePerDay: 125.0,
      includedKmPerDay: 250,
      securityDeposit: 1000,
      description: 'Autocaravana espaciosa ideal para familias o grupos de surfistas. Gran garaje con capacidad para tablas de surf y material de kitesurf. Comedor convertible, amplio baño completo independiente y cocina de 3 fuegos.',
      rules: 'Devolver en las mismas condiciones de limpieza interior.',
      photos: [
        'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=1200',
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200'
      ],
      features: ['cocina', 'neveraGrande', 'duchaIndependiente', 'wc', 'garajeGrande', 'toldo', 'tv']
    },
    {
      ownerId: owner1.id,
      title: 'Citroën SpaceTourer Camper "La Caldera Nomade"',
      slug: 'citroen-spacetourer-la-palma',
      brand: 'Citroën',
      model: 'SpaceTourer Campster',
      year: 2023,
      ownershipType: 'PLATFORM' as const,
      bookingType: 'INSTANT_BOOKING' as const,
      status: 'ACTIVE' as const,
      island: 'La Palma',
      municipality: 'Los Llanos de Aridane',
      passengers: 4,
      beds: 4,
      transmission: 'MANUAL' as const,
      fuelType: 'DIESEL' as const,
      basePricePerDay: 80.0,
      includedKmPerDay: 150,
      securityDeposit: 600,
      description: 'Compacta, ágil y fácil de conducir por las sinuosas carreteras de La Palma. Techo panorámico para contemplar el cielo más limpio de Europa desde el Roque de los Muchachos.',
      rules: 'Respeta el entorno natural y acampa solo en zonas autorizadas.',
      photos: [
        'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=1200'
      ],
      features: ['techoElevable', 'cocinaPortatil', 'nevera', 'duchaExterior', 'solar']
    }
  ];

  for (const item of campersData) {
    const { photos, features, ...vData } = item;
    const vehicle = await prisma.vehicle.create({
      data: {
        ...vData,
        photos: {
          create: photos.map((url, index) => ({ url, orderIndex: index }))
        },
        features: {
          create: features.map(name => ({ name }))
        },
        extras: {
          create: [
            { extraId: extraBedding.id, price: 25.0, enabled: true },
            { extraId: extraSurf.id, price: 15.0, enabled: true },
            { extraId: extraAirport.id, price: 35.0, enabled: true }
          ]
        }
      }
    });

    console.log(`✓ Vehículo creado: ${vehicle.title} (${vehicle.island})`);
  }

  // 4. Ubicaciones SEO Canarias
  const islands = [
    { slug: 'gran-canaria', name: 'Gran Canaria', island: 'Gran Canaria', title: 'Alquiler de Campers en Gran Canaria | Precios Directos', description: 'Alquila furgonetas camper y autocaravanas en Gran Canaria. Recogida en el aeropuerto LPA o Las Palmas. Cancela gratis.' },
    { slug: 'tenerife', name: 'Tenerife', island: 'Tenerife', title: 'Alquiler de Campers en Tenerife | Desde 80€/día', description: 'Recorre Tenerife en campervan desde el Teide hasta las playas del sur. Autocaravanas equipadas y verificadas.' },
    { slug: 'lanzarote', name: 'Lanzarote', island: 'Lanzarote', title: 'Alquiler de Campers en Lanzarote | Aventura Volcánica', description: 'Descubre Lanzarote en camper con kilometraje ilimitado y entrega en aeropuerto de Arrecife.' },
    { slug: 'fuerteventura', name: 'Fuerteventura', island: 'Fuerteventura', title: 'Alquiler de Campers en Fuerteventura | Surf & Libertad', description: 'Explora las mejores playas de Fuerteventura en camper con garaje para tablas de surf.' },
    { slug: 'la-palma', name: 'La Palma', island: 'La Palma', title: 'Alquiler de Campers en La Palma | La Isla Bonita', description: 'Senderismo y acampada en camper por La Palma. Conoce la Caldera de Taburiente sobre ruedas.' },
    { slug: 'la-gomera', name: 'La Gomera', island: 'La Gomera', title: 'Alquiler de Campers en La Gomera | Naturaleza Salvaje', description: 'Descubre el Parque Nacional de Garajonay en furgoneta camperizada.' },
    { slug: 'el-hierro', name: 'El Hierro', island: 'El Hierro', title: 'Alquiler de Campers en El Hierro | Reserva de la Biosfera', description: 'La ruta más auténtica por la isla más meridional de Canarias en camper.' },
    { slug: 'la-graciosa', name: 'La Graciosa', island: 'La Graciosa', title: 'Experiencia Camper La Graciosa | Canarias Salvajes', description: 'Guía y consejos para disfrutar de La Graciosa conectando desde Lanzarote.' }
  ];

  for (const loc of islands) {
    await prisma.seoLocation.create({
      data: {
        ...loc,
        heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600',
        content: `Guía completa para alquilar una camper en ${loc.name}. Explora las mejores rutas, zonas de acampada homologadas, miradores espectaculares y playas vírgenes con total libertad.`,
        faq: JSON.stringify([
          { q: `¿Dónde puedo pernoctar con camper en ${loc.name}?`, a: `En ${loc.name} existen áreas habilitadas para pernocta y acampada controlada así como campings dotados de servicios de electricidad y vaciado de aguas.` },
          { q: '¿Qué carnet necesito para conducir una camper?', a: 'Basta con el permiso de conducir B estándar (turismo) con más de 2 años de antigüedad.' }
        ])
      }
    });
  }

  // 5. Entradas de Blog Reales
  const blogPosts = [
    {
      slug: 'guia-pernocta-campers-gran-canaria',
      title: 'Guía Definitiva de Pernocta y Acampada en Camper por Gran Canaria',
      excerpt: 'Descubre las mejores zonas autorizadas de acampada, campings y consejos para despertar en las cumbres y playas de Gran Canaria.',
      content: 'Gran Canaria ofrece una red de áreas recreativas gestionadas por el Cabildo de Gran Canaria (Presa de las Niñas, Tamadaba, Llanos de la Pez...) ideales para pernoctar con tu furgoneta camper con total legalidad y rodeado de pinos canarios.',
      featuredImage: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=1200',
      category: 'Rutas Camper',
      authorId: admin.id,
    },
    {
      slug: 'ruta-7-dias-tenerife-autocaravana',
      title: 'Ruta de 7 días en Autocaravana por Tenerife: Del Teide al Atlántico',
      excerpt: 'Un itinerario completo de 7 días por Tenerife explorando el sur soleado, el Parque Nacional del Teide y el bosque de Anaga.',
      content: 'Comenzamos la ruta en las playas de Adeje subiendo progresivamente hacia el parque nacional a más de 2.000 metros de altitud para presenciar los atardeceres más espectaculares de la Macaronesia.',
      featuredImage: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?w=1200',
      category: 'Consejos Camper',
      authorId: admin.id,
    }
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.create({ data: post });
  }

  // 6. Configuración global
  const settings = [
    { key: 'BRAND_NAME', value: 'Nomad Canarias' },
    { key: 'TRAVELER_SERVICE_FEE_PCT', value: '4.9' },
    { key: 'OWNER_PLATFORM_FEE_PCT', value: '12.0' },
    { key: 'BRAND_EMAIL', value: 'hola@nomadcanarias.com' },
    { key: 'BRAND_PHONE', value: '+34 928 990 011' }
  ];

  for (const s of settings) {
    await prisma.systemSetting.create({ data: s });
  }

  console.log('✅ Base de Datos PostgreSQL en la nube sincronizada y poblada exitosamente con campers, usuarios y entradas de blog!');
}

main()
  .catch((e) => {
    console.error('❌ Error en Seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
