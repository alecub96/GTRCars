const bcrypt = require('bcryptjs');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const { PrismaClient } = require('../src/generated/prisma/client');

async function main() {
  const adapter = new PrismaMariaDb({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '',
    database: 'gtcars',
  });

  const prisma = new PrismaClient({ adapter });

  console.log('--- Creando perfil oficial GTR Cars en base de datos ---');

  const email = 'contacto@gtrcars.es';
  const passwordPlain = 'GTRCars2026!';
  const passwordHash = await bcrypt.hash(passwordPlain, 10);

  // 1. Crear o actualizar usuario oficial
  const user = await prisma.user.upsert({
    where: { email },
    create: {
      email,
      passwordHash,
      firstName: 'GTR Cars',
      lastName: 'Official',
      phone: '+34 600 000 000',
      avatarUrl: '/brand/app-icon.png',
      role: 'ADMIN',
      verification: 'VERIFIED',
      language: 'es',
      country: 'ES',
    },
    update: {
      passwordHash,
      firstName: 'GTR Cars',
      lastName: 'Official',
      role: 'ADMIN',
      verification: 'VERIFIED',
      avatarUrl: '/brand/app-icon.png',
    },
  });

  console.log(`Usuario creado/actualizado: ${user.email} (ID: ${user.id})`);
  console.log(`Contraseña asignada: ${passwordPlain}`);

  // 2. Crear o actualizar vehículo 1: Ferrari 488 GTB
  const ferrariSlug = 'ferrari-488-gtb-rosso-corsa';
  const existingFerrari = await prisma.vehicle.findUnique({ where: { slug: ferrariSlug } });

  const ferrariData = {
    ownerId: user.id,
    title: 'Ferrari 488 GTB Rosso Corsa Bi-Colore',
    slug: ferrariSlug,
    brand: 'FERRARI',
    model: '488 GTB',
    vehicleType: 'COUPE',
    year: 2019,
    ownershipType: 'PLATFORM', // Vehículo propio de la plataforma GTR Cars
    bookingType: 'INSTANT_BOOKING',
    status: 'ACTIVE',
    island: 'Tenerife',
    municipality: 'Costa Adeje',
    addressApprox: 'Costa Adeje / Aeropuerto Sur (TFS)',
    isVip: true,
    passengers: 2,
    beds: 0,
    doors: 2,
    transmission: 'AUTOMATIC',
    fuelType: 'GASOLINE',
    fuelConsumption: '3.9L V8 Twin-Turbo F154 CB',
    basePricePerDay: 1290,
    includedKmPerDay: 150,
    extraKmPrice: 3.50,
    securityDeposit: 4500,
    cleaningFee: 50,
    minDays: 1,
    maxDays: 30,
    description: 'Pura adrenalina de Maranello en las Islas Canarias. Acabado Rosso Corsa con techo y montantes en Nero de contraste (Bi-Colore de fábrica), llantas forjadas de 20 pulgadas en negro satinado, pinzas Brembo carbocerámicas rojas y escudos Scuderia Ferrari. Motor V8 3.9L Bi-Turbo de 670 CV con SSC2 y diferencial electrónico E-Diff3.',
    rules: 'Conductor mayor de 25 años con mínimo 2 años de permiso B. Conducción responsable en carretera.',
  };

  let ferrari;
  if (existingFerrari) {
    ferrari = await prisma.vehicle.update({
      where: { id: existingFerrari.id },
      data: ferrariData,
    });
    await prisma.vehiclePhoto.deleteMany({ where: { vehicleId: ferrari.id } });
    await prisma.vehicleFeature.deleteMany({ where: { vehicleId: ferrari.id } });
  } else {
    ferrari = await prisma.vehicle.create({
      data: ferrariData,
    });
  }

  // Fotos Ferrari
  await prisma.vehiclePhoto.createMany({
    data: [
      { vehicleId: ferrari.id, url: '/supercars/ferrari-488/ferrari-488-front.jpg', orderIndex: 0 },
      { vehicleId: ferrari.id, url: '/supercars/ferrari-488/ferrari-488-side.jpg', orderIndex: 1 },
      { vehicleId: ferrari.id, url: '/supercars/ferrari-488/ferrari-488-rear.jpg', orderIndex: 2 },
    ],
  });

  // Características Ferrari
  await prisma.vehicleFeature.createMany({
    data: [
      { vehicleId: ferrari.id, name: 'Potencia: 670 CV V8 Biturbo' },
      { vehicleId: ferrari.id, name: '0-100 km/h: 3.0 s' },
      { vehicleId: ferrari.id, name: 'Velocidad Máx: 330 km/h' },
      { vehicleId: ferrari.id, name: 'Frenos Carbono-Cerámicos CCMR' },
      { vehicleId: ferrari.id, name: 'Pintura Rosso Corsa con Techo Nero Bi-Colore' },
      { vehicleId: ferrari.id, name: 'Llantas Forjadas 20" Negro Satinado' },
      { vehicleId: ferrari.id, name: 'Entrega VIP en Aeropuerto TFS/TFN o Hotel 5* GL' },
    ],
  });

  console.log(`Vehículo Ferrari guardado en BD: ${ferrari.title} (ID: ${ferrari.id})`);

  // 3. Crear o actualizar vehículo 2: Porsche Taycan
  const taycanSlug = 'porsche-taycan-volcano-grey';
  const existingTaycan = await prisma.vehicle.findUnique({ where: { slug: taycanSlug } });

  const taycanData = {
    ownerId: user.id,
    title: 'Porsche Taycan Volcano Grey Metallic',
    slug: taycanSlug,
    brand: 'PORSCHE',
    model: 'Taycan',
    vehicleType: 'SEDAN',
    year: 2022,
    ownershipType: 'PLATFORM', // Vehículo propio de la plataforma GTR Cars
    bookingType: 'INSTANT_BOOKING',
    status: 'ACTIVE',
    island: 'Tenerife',
    municipality: 'Costa Adeje',
    addressApprox: 'Costa Adeje / Aeropuerto Sur (TFS)',
    isVip: true,
    passengers: 4,
    beds: 0,
    doors: 4,
    transmission: 'AUTOMATIC',
    fuelType: 'ELECTRIC',
    fuelConsumption: 'Batería Performance Plus 93.4 kWh (450 km WLTP)',
    basePricePerDay: 690,
    includedKmPerDay: 200,
    extraKmPrice: 2.00,
    securityDeposit: 3000,
    cleaningFee: 40,
    minDays: 1,
    maxDays: 30,
    description: 'Deportivo 100% eléctrico disponible en Canarias en distinguida pintura Volcano Grey Metallic con llantas de 20 pulgadas Taycan Turbo Aero, faros Matrix LED de 4 puntos y arquitectura de 800V con carga ultrarrápida. Suspensión neumática adaptativa PASM y chasis dinámico con aceleración instantánea y cero emisiones.',
    rules: 'Conductor mayor de 25 años con mínimo 2 años de carnet. Batería devuelta al nivel de entrega o contratación de servicio de recarga VIP.',
  };

  let taycan;
  if (existingTaycan) {
    taycan = await prisma.vehicle.update({
      where: { id: existingTaycan.id },
      data: taycanData,
    });
    await prisma.vehiclePhoto.deleteMany({ where: { vehicleId: taycan.id } });
    await prisma.vehicleFeature.deleteMany({ where: { vehicleId: taycan.id } });
  } else {
    taycan = await prisma.vehicle.create({
      data: taycanData,
    });
  }

  // Fotos Taycan
  await prisma.vehiclePhoto.createMany({
    data: [
      { vehicleId: taycan.id, url: '/supercars/porsche-taycan/porsche-taycan-front.jpg', orderIndex: 0 },
      { vehicleId: taycan.id, url: '/supercars/porsche-taycan/porsche-taycan-side.jpg', orderIndex: 1 },
      { vehicleId: taycan.id, url: '/supercars/porsche-taycan/porsche-taycan-rear.jpg', orderIndex: 2 },
    ],
  });

  // Características Taycan
  await prisma.vehicleFeature.createMany({
    data: [
      { vehicleId: taycan.id, name: 'Potencia: 408 CV Launch Control (Eléctrico)' },
      { vehicleId: taycan.id, name: '0-100 km/h: 5.4 s' },
      { vehicleId: taycan.id, name: 'Velocidad Máx: 230 km/h' },
      { vehicleId: taycan.id, name: 'Arquitectura Eléctrica 800V Carga Ultrarrápida' },
      { vehicleId: taycan.id, name: 'Pintura Volcano Grey Metallic' },
      { vehicleId: taycan.id, name: 'Llantas 20" Taycan Turbo Aero' },
      { vehicleId: taycan.id, name: 'Suspensión Neumática Adaptativa PASM' },
      { vehicleId: taycan.id, name: 'Entrega VIP en Aeropuerto TFS/TFN o Hotel 5* GL' },
    ],
  });

  console.log(`Vehículo Taycan guardado en BD: ${taycan.title} (ID: ${taycan.id})`);
  console.log('--- Proceso de inserción en BD completado con éxito ---');
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error('Error al insertar en base de datos:', err);
  process.exit(1);
});
