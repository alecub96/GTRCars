import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

const DEMO_CAMPERS = [
  {
    ownerEmail: 'yeray.marrero@canarias-campers.local',
    ownerName: 'Yeray',
    ownerLastName: 'Marrero',
    ownerPhone: '+34 628 412 901',
    ownerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    title: 'Volkswagen California Ocean T6.1 DSG Automática',
    brand: 'Volkswagen',
    model: 'California Ocean T6.1',
    vehicleType: 'TURISMO_CAMPERIZADO',
    year: 2023,
    island: 'Gran Canaria',
    municipality: 'Las Palmas de Gran Canaria',
    addressApprox: 'Paseo de Las Canteras / Guanarteme',
    latitude: 28.1340,
    longitude: -15.4410,
    passengers: 4,
    beds: 4,
    doors: 4,
    transmission: 'AUTOMATIC',
    fuelType: 'DIESEL',
    fuelConsumption: '7.2 L/100km',
    basePricePerDay: 85,
    includedKmPerDay: 150,
    extraKmPrice: 0.25,
    securityDeposit: 600,
    cleaningFee: 35,
    description: 'Nuestra California Ocean está como nueva, equipada con techo elevable electrohidráulico, calefacción estática digital, cocina completa de 2 fuegos, nevera compresor de 42L, ducha exterior y toldo lateral Fiamma. Muy cómoda de conducir en las curvas de la cumbre y perfecta para pernoctar en Agaete o Tamadaba.',
    rules: 'No fumar en el interior. Mascotas consultar previamente. Devolver con el depósito de combustible y aguas limpias al mismo nivel que en la entrega.',
    photos: [
      'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=1200',
      'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200',
      'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=1200',
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200',
    ],
    features: ['Techo elevable', 'Calefacción estacionaria', 'Cocina de gas', 'Nevera 42L', 'Ducha exterior', 'Toldo lateral', 'Mesa y sillas de camping', 'Placa solar 150W'],
    reviews: [
      { author: 'Mateo R.', rating: 5, comment: 'Increíble furgoneta, impecable por dentro y Yeray nos dio las mejores recomendaciones de Gran Canaria.' },
      { author: 'Sophie L.', rating: 5, comment: 'The California Ocean was super smooth to drive and very well equipped. 100% recommended!' },
    ],
  },
  {
    ownerEmail: 'guacimara.rodriguez@canarias-campers.local',
    ownerName: 'Guacimara',
    ownerLastName: 'Rodríguez',
    ownerPhone: '+34 622 890 145',
    ownerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    title: 'Fiat Ducato Maxi Gran Volumen L3H2 con Baño y Ducha Caliente',
    brand: 'Fiat',
    model: 'Ducato Maxi L3H2',
    vehicleType: 'CAMPER_GRAN_VOLUMEN',
    year: 2022,
    island: 'Tenerife',
    municipality: 'Santa Cruz de Tenerife',
    addressApprox: 'Cerca de Dársena Pesquera / San Andrés',
    latitude: 28.4980,
    longitude: -16.2050,
    passengers: 3,
    beds: 3,
    doors: 4,
    transmission: 'MANUAL',
    fuelType: 'DIESEL',
    fuelConsumption: '8.8 L/100km',
    basePricePerDay: 98,
    includedKmPerDay: 200,
    extraKmPrice: 0.22,
    securityDeposit: 750,
    cleaningFee: 40,
    description: 'Camper gran volumen con aislamiento térmico Kaiflex de alta densidad. Dispone de cama doble fija trasera viscoelástica, salón convertible, baño completo con ducha de agua caliente a gas Truma, WC químico giratorio Dometic, placa solar de 300W e inversor de 2000W para cargar portátiles y cámaras.',
    rules: 'Prohibido encender velas dentro. Prohibido fumar. Respetar las zonas de pernocta autorizadas del Parque Nacional del Teide.',
    photos: [
      'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=1200',
      'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=1200',
      'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?w=1200',
    ],
    features: ['Ducha interior caliente', 'WC Químico', 'Cama viscoelástica', 'Placa solar 300W', 'Inversor 220V', 'Agua caliente Truma', 'Calefacción estacionaria', 'Menaje completo'],
    reviews: [
      { author: 'Javier M.', rating: 5, comment: 'La ducha con agua caliente en medio del Teide es un auténtico lujo. La furgoneta es un apartamento rodante.' },
      { author: 'Elena K.', rating: 5, comment: 'Guacimara fue súper atenta y la camper estaba súper limpia y acogedora.' },
    ],
  },
  {
    ownerEmail: 'nauzet.santana@canarias-campers.local',
    ownerName: 'Nauzet',
    ownerLastName: 'Santana',
    ownerPhone: '+34 633 112 233',
    ownerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    title: 'Mercedes-Benz Marco Polo 4Matic Tracción Total',
    brand: 'Mercedes-Benz',
    model: 'Marco Polo Clase V 4Matic',
    vehicleType: 'TURISMO_CAMPERIZADO',
    year: 2023,
    island: 'Gran Canaria',
    municipality: 'Telde',
    addressApprox: 'Entrega directa en Aeropuerto de Gran Canaria (LPA)',
    latitude: 27.9319,
    longitude: -15.3866,
    passengers: 4,
    beds: 4,
    doors: 4,
    transmission: 'AUTOMATIC',
    fuelType: 'DIESEL',
    fuelConsumption: '7.5 L/100km',
    basePricePerDay: 110,
    includedKmPerDay: 150,
    extraKmPrice: 0.30,
    securityDeposit: 800,
    cleaningFee: 40,
    description: 'La elegancia y confort de Mercedes-Benz con la tracción integral 4Matic para subir a los puntos más altos de Gran Canaria sin esfuerzo. Acabados en madera de barco, suelo estilo yate, doble cama matrimonio y climatización bizona.',
    rules: 'Entrega en el Aeropuerto de Gran Canaria sin coste adicional. Devolver limpia y repostada.',
    photos: [
      'https://images.unsplash.com/photo-1513311068348-19c8fbdc0bb6?w=1200',
      'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=1200',
      'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200',
    ],
    features: ['Tracción 4Matic 4x4', 'Techo elevable eléctrico', 'Cocina de diseño', 'Doble batería AGM', 'Control de crucero adaptativo', 'Luces LED ambiente'],
    reviews: [
      { author: 'Álvaro B.', rating: 5, comment: 'La mejor camper que he conducido. Muy silenciosa y comodísima.' },
    ],
  },
  {
    ownerEmail: 'ayoze.betancor@canarias-campers.local',
    ownerName: 'Ayoze',
    ownerLastName: 'Betancor',
    ownerPhone: '+34 611 776 544',
    ownerAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400',
    title: 'Toyota Hilux 4x4 Expedition con Tienda de Techo Rigida',
    brand: 'Toyota',
    model: 'Hilux Invincible 4x4 Overland',
    vehicleType: '4X4_CAMPERIZADO',
    year: 2022,
    island: 'Gran Canaria',
    municipality: 'San Bartolomé de Tirajana',
    addressApprox: 'Maspalomas / El Tablero',
    latitude: 27.7606,
    longitude: -15.5860,
    passengers: 2,
    beds: 2,
    doors: 4,
    transmission: 'MANUAL',
    fuelType: 'DIESEL',
    fuelConsumption: '8.4 L/100km',
    basePricePerDay: 90,
    includedKmPerDay: 200,
    extraKmPrice: 0.25,
    securityDeposit: 700,
    cleaningFee: 30,
    description: 'Para los verdaderos amantes de la aventura y el off-road controlado. Toyota Hilux con tienda de techo James Baroud de apertura hidráulica en 10 segundos, módulo cocina extraíble de maletero, depósito de agua de 60L con ducha y compresor de aire ARB.',
    rules: 'Solo circular por pistas y carreteras autorizadas. Respetar siempre el medioambiente y parques naturales.',
    photos: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200',
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200',
      'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?w=1200',
    ],
    features: ['Tracción 4x4 con reductora', 'Tienda de techo rígida', 'Módulo de cocina en maletero', 'Ducha exterior 60L', 'Nevera de compresor 35L', 'Kit rescate y pala'],
    reviews: [
      { author: 'David S.', rating: 5, comment: 'Dormir sobre el techo en lo alto de Gran Canaria con el cielo estrellado fue una experiencia brutal.' },
    ],
  },
  {
    ownerEmail: 'idaira.ramos@canarias-campers.local',
    ownerName: 'Idaira',
    ownerLastName: 'Ramos',
    ownerPhone: '+34 644 321 987',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    title: 'Citroën Jumper Nomad Living L2H2 Camperizada con Amor',
    brand: 'Citroën',
    model: 'Jumper Nomad Living',
    vehicleType: 'CAMPER_GRAN_VOLUMEN',
    year: 2021,
    island: 'Tenerife',
    municipality: 'San Cristóbal de La Laguna',
    addressApprox: 'Cerca del Aeropuerto Tenerife Norte (TFN)',
    latitude: 28.4874,
    longitude: -16.3159,
    passengers: 2,
    beds: 2,
    doors: 4,
    transmission: 'MANUAL',
    fuelType: 'DIESEL',
    fuelConsumption: '8.2 L/100km',
    basePricePerDay: 78,
    includedKmPerDay: 150,
    extraKmPrice: 0.20,
    securityDeposit: 500,
    cleaningFee: 30,
    description: 'Camperización artesanal en madera de pino canario y estilo rústico acogedor. Cama fija super cómoda de 135x190cm, claraboya panorámica para ver las estrellas, proyector de cine portátil incluido y batería de litio que nunca te deja sin luz.',
    rules: 'Cuidar la madera como si fuera tu casa. No utilizar zapatos de calle en la zona de tarima interior.',
    photos: [
      'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=1200',
      'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=1200',
    ],
    features: ['Cama matrimonio 135x190', 'Claraboya panorámica', 'Batería de Litio LiFePO4', 'Cocina 2 fuegos', 'Proyector de cine', 'Menaje rústico'],
    reviews: [
      { author: 'Carla y Dani', rating: 5, comment: 'La furgo más bonita que hemos visto. Súper romántica y cómoda para recorrer Tenerife.' },
    ],
  },
  {
    ownerEmail: 'rayco.cabrera@canarias-campers.local',
    ownerName: 'Rayco',
    ownerLastName: 'Cabrera',
    ownerPhone: '+34 655 889 900',
    ownerAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    title: 'Autocaravana Benimar Sport 346 Familiar 6 Plazas',
    brand: 'Benimar',
    model: 'Sport 346 Capuchina',
    vehicleType: 'AUTOCARAVANA',
    year: 2022,
    island: 'Tenerife',
    municipality: 'Adeje',
    addressApprox: 'Costa Adeje / Playa Paraíso',
    latitude: 28.1200,
    longitude: -16.7300,
    passengers: 6,
    beds: 6,
    doors: 3,
    transmission: 'MANUAL',
    fuelType: 'DIESEL',
    fuelConsumption: '10.5 L/100km',
    basePricePerDay: 135,
    includedKmPerDay: 180,
    extraKmPrice: 0.25,
    securityDeposit: 900,
    cleaningFee: 50,
    description: 'La opción reina para familias numerosas o grupos de amigos. Cuenta con doble comedor, 6 plazas homologadas para viajar y dormir, garaje gigante para tablas de surf o bicicletas, gran frigorífico automático de 140L y baño completo con cabina de ducha separada.',
    rules: 'Obligatorio carné B con al menos 2 años de antigüedad. No se permite fumar en el interior.',
    photos: [
      'https://images.unsplash.com/photo-1513311068348-19c8fbdc0bb6?w=1200',
      'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=1200',
    ],
    features: ['6 plazas viajar y dormir', 'Garaje XXL', 'Frigorífico 140L con congelador', 'Cabina de ducha separada', 'Portabicicletas para 4', 'Toldo Fiamma 4m'],
    reviews: [
      { author: 'Familia Gómez', rating: 5, comment: 'Viajamos con nuestros 3 hijos y estuvimos de maravilla. Espaciosa y muy fácil de manejar.' },
    ],
  },
  {
    ownerEmail: 'yaiza.hernandez@canarias-campers.local',
    ownerName: 'Yaiza',
    ownerLastName: 'Hernández',
    ownerPhone: '+34 612 345 678',
    ownerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
    title: 'Ford Transit Custom Nugget Plus Techo Alto Fijo',
    brand: 'Ford',
    model: 'Transit Custom Nugget Plus Westfalia',
    vehicleType: 'CAMPER_GRAN_VOLUMEN',
    year: 2023,
    island: 'Fuerteventura',
    municipality: 'La Oliva',
    addressApprox: 'Corralejo / Dunas de Fuerteventura',
    latitude: 28.7300,
    longitude: -13.8700,
    passengers: 4,
    beds: 4,
    doors: 4,
    transmission: 'MANUAL',
    fuelType: 'DIESEL',
    fuelConsumption: '7.8 L/100km',
    basePricePerDay: 82,
    includedKmPerDay: 150,
    extraKmPrice: 0.20,
    securityDeposit: 600,
    cleaningFee: 35,
    description: 'La distribución Westfalia de doble espacio con cocina en la parte trasera y WC integrado. Techo alto rígido que permite estar de pie en todo momento sin ruidos de viento. Ideal para los vientos alisios de Fuerteventura y amantes del surf y kite en El Cotillo.',
    rules: 'No transitar por pistas de arena suelta no compactada. Prohibido fumar.',
    photos: [
      'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=1200',
      'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=1200',
    ],
    features: ['Techo alto rígido', 'WC químico integrado', 'Cocina en L trasera', 'Nevera 40L', 'Mesa de interior y exterior', 'Baca porta-surf'],
    reviews: [
      { author: 'Lucas W.', rating: 5, comment: 'Perfect camper for our surf trip in Fuerteventura! Clean, reliable and Yaiza is super friendly.' },
    ],
  },
  {
    ownerEmail: 'jonay.morales@canarias-campers.local',
    ownerName: 'Jonay',
    ownerLastName: 'Morales',
    ownerPhone: '+34 688 991 223',
    ownerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    title: 'Renault Trafic Horizon Edition Especial Famara',
    brand: 'Renault',
    model: 'Trafic Horizon Edition',
    vehicleType: 'TURISMO_CAMPERIZADO',
    year: 2022,
    island: 'Lanzarote',
    municipality: 'Teguise',
    addressApprox: 'Caleta de Famara / La Villa de Teguise',
    latitude: 29.1120,
    longitude: -13.5650,
    passengers: 3,
    beds: 2,
    doors: 4,
    transmission: 'MANUAL',
    fuelType: 'DIESEL',
    fuelConsumption: '6.9 L/100km',
    basePricePerDay: 68,
    includedKmPerDay: 150,
    extraKmPrice: 0.20,
    securityDeposit: 500,
    cleaningFee: 25,
    description: 'Consumo súper bajo y tamaño perfecto para aparcar en cualquier rincón de Lanzarote sin llamar la atención. Asientos giratorios, cama desplegable sobre estructura de aluminio ultraligera, cocina de cartucho portátil para cocinar frente al mar en Famara y ducha exterior.',
    rules: 'No conducir bajo los efectos del alcohol. Devolver limpia y sin arena.',
    photos: [
      'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200',
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200',
    ],
    features: ['Bajo consumo 6.9L', 'Cama 125x195', 'Asientos giratorios', 'Cocina portátil exterior', 'Ducha 12V', 'Oscurecedores térmicos 9 capas'],
    reviews: [
      { author: 'Lucía P.', rating: 5, comment: 'Una pasada de furgoneta, facilísima de conducir y Jonay nos explicó todo al detalle.' },
    ],
  },
  {
    ownerEmail: 'airam.darias@canarias-campers.local',
    ownerName: 'Airam',
    ownerLastName: 'Darias',
    ownerPhone: '+34 677 334 556',
    ownerAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400',
    title: 'Peugeot Boxer Wild Camp L2H2 La Isla Bonita',
    brand: 'Peugeot',
    model: 'Boxer Wild Camp 2.2 BlueHDi',
    vehicleType: 'CAMPER_GRAN_VOLUMEN',
    year: 2021,
    island: 'La Palma',
    municipality: 'Los Llanos de Aridane',
    addressApprox: 'Los Llanos / Puerto de Tazacorte',
    latitude: 28.6580,
    longitude: -17.9180,
    passengers: 2,
    beds: 2,
    doors: 4,
    transmission: 'MANUAL',
    fuelType: 'DIESEL',
    fuelConsumption: '8.1 L/100km',
    basePricePerDay: 75,
    includedKmPerDay: 150,
    extraKmPrice: 0.20,
    securityDeposit: 500,
    cleaningFee: 30,
    description: 'Preparada específicamente para las carreteras empinadas de La Palma con motor potente de 140CV. Ducha interior, WC químico portátil, cocina con fregadero grande de acero inoxidable y depósito de agua de 100L para 4 días de autonomía total.',
    rules: 'No tirar toallitas ni residuos en el WC químico. Respetar la naturaleza de la isla.',
    photos: [
      'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=1200',
      'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?w=1200',
    ],
    features: ['Motor 140CV potente', 'Depósito agua 100L', 'Ducha interior', 'Placa solar 200W', 'Calefacción Webasto', 'Mesa plegable exterior'],
    reviews: [
      { author: 'Mario B.', rating: 5, comment: 'La furgoneta sube las cuestas de La Palma sin despeinarse. Inolvidable viaje por los volcanes.' },
    ],
  },
  {
    ownerEmail: 'cathaysa.melian@canarias-campers.local',
    ownerName: 'Cathaysa',
    ownerLastName: 'Melián',
    ownerPhone: '+34 699 001 122',
    ownerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    title: 'Jeep Wrangler Unlimited 4x4 Camper Overland Edition',
    brand: 'Jeep',
    model: 'Wrangler Unlimited Rubicon',
    vehicleType: '4X4_CAMPERIZADO',
    year: 2023,
    island: 'La Gomera',
    municipality: 'San Sebastián de La Gomera',
    addressApprox: 'Cerca del Puerto de San Sebastián (Ferry Fred Olsen)',
    latitude: 28.0910,
    longitude: -17.1130,
    passengers: 4,
    beds: 2,
    doors: 4,
    transmission: 'AUTOMATIC',
    fuelType: 'GASOLINE',
    fuelConsumption: '9.5 L/100km',
    basePricePerDay: 115,
    includedKmPerDay: 150,
    extraKmPrice: 0.35,
    securityDeposit: 800,
    cleaningFee: 40,
    description: 'El mítico 4x4 americano adaptado con tienda de techo de apertura rápida y toldo de 270 grados tipo murciélago. Perfecto para desembarcar del ferry en La Gomera y recorrer el bosque milenario de Garajonay con total libertad y estilo.',
    rules: 'Uso responsable del 4x4. No hacer trompos ni conducción temeraria. Prohibido fumar.',
    photos: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200',
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200',
    ],
    features: ['Tracción Rubicon 4x4', 'Toldo 270 grados', 'Tienda de techo', 'Nevera Dometic', 'Kit de cocina camping', 'Faros LED adicionales'],
    reviews: [
      { author: 'Néstor C.', rating: 5, comment: 'Un Jeep impresionante. Cathaysa nos esperó en la misma salida del barco. De 10.' },
    ],
  },
];

async function main() {
  console.log('🚐 Sembrando 10 campers de demostración hiperrealistas con propietarios canarios...');
  const passwordHash = await bcrypt.hash('PasswordVaneando2026!', 10);

  for (const camperData of DEMO_CAMPERS) {
    // 1. Crear o recuperar propietario canario
    let owner = await prisma.user.findUnique({
      where: { email: camperData.ownerEmail },
    });

    if (!owner) {
      owner = await prisma.user.create({
        data: {
          email: camperData.ownerEmail,
          passwordHash,
          firstName: camperData.ownerName,
          lastName: camperData.ownerLastName,
          phone: camperData.ownerPhone,
          role: 'OWNER',
          verification: 'VERIFIED',
          avatarUrl: camperData.ownerAvatar,
        },
      });
      console.log(`👤 Propietario creado: ${owner.firstName} ${owner.lastName} (${owner.email})`);
    }

    const slugBase = camperData.title
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const slug = `${slugBase}-${camperData.island.toLowerCase().replace(/\s+/g, '-')}`;

    // 2. Comprobar si el vehículo ya existe
    let vehicle = await prisma.vehicle.findUnique({
      where: { slug },
    });

    if (!vehicle) {
      vehicle = await prisma.vehicle.create({
        data: {
          ownerId: owner.id,
          title: camperData.title,
          slug,
          brand: camperData.brand,
          model: camperData.model,
          vehicleType: camperData.vehicleType as any,
          year: camperData.year,
          island: camperData.island,
          municipality: camperData.municipality,
          addressApprox: camperData.addressApprox,
          latitude: camperData.latitude,
          longitude: camperData.longitude,
          passengers: camperData.passengers,
          beds: camperData.beds,
          doors: camperData.doors,
          transmission: camperData.transmission as any,
          fuelType: camperData.fuelType as any,
          fuelConsumption: camperData.fuelConsumption,
          basePricePerDay: camperData.basePricePerDay,
          includedKmPerDay: camperData.includedKmPerDay,
          extraKmPrice: camperData.extraKmPrice,
          securityDeposit: camperData.securityDeposit,
          cleaningFee: camperData.cleaningFee,
          minDays: 2,
          maxDays: 30,
          bookingType: 'REQUEST_TO_BOOK',
          cancellationPolicy: 'MODERATE',
          description: camperData.description,
          rules: camperData.rules,
          status: 'ACTIVE', // Activo para que se vea en el catálogo y mapa
          isVip: false,
        },
      });
      console.log(`🚐 Camper creada: ${vehicle.title} en ${vehicle.island} (${vehicle.slug})`);

      // 3. Crear fotos
      for (let i = 0; i < camperData.photos.length; i++) {
        await prisma.vehiclePhoto.create({
          data: {
            vehicleId: vehicle.id,
            url: camperData.photos[i],
            orderIndex: i,
          },
        });
      }

      // 4. Crear características
      for (const feat of camperData.features) {
        await prisma.vehicleFeature.create({
          data: {
            vehicleId: vehicle.id,
            name: feat,
          },
        });
      }

      // 5. Crear reseñas
      for (const rev of camperData.reviews) {
        // Buscar o crear autor viajero ficticio
        const reviewerEmail = `${rev.author.toLowerCase().replace(/[^a-z0-9]/g, '')}@viajeros-vaneando.local`;
        let reviewer = await prisma.user.findUnique({ where: { email: reviewerEmail } });
        if (!reviewer) {
          reviewer = await prisma.user.create({
            data: {
              email: reviewerEmail,
              passwordHash,
              firstName: rev.author.split(' ')[0],
              lastName: rev.author.split(' ')[1] || '',
              role: 'TRAVELER',
              verification: 'VERIFIED',
            },
          });
        }

        await prisma.review.create({
          data: {
            vehicleId: vehicle.id,
            authorId: reviewer.id,
            rating: rev.rating,
            comment: rev.comment,
          },
        });
      }

      // 6. BLOQUEO TOTAL DE FECHAS (2025-2030) PARA QUE NUNCA SE PUEDA ALQUILAR
      await prisma.availabilityBlock.create({
        data: {
          vehicleId: vehicle.id,
          startDate: new Date('2025-01-01T00:00:00.000Z'),
          endDate: new Date('2030-12-31T23:59:59.000Z'),
          reason: 'RESERVADA_TEMPORADA_COMPLETA',
        },
      });
      console.log(`🔒 Calendario bloqueado totalmente para ${vehicle.title} (No alquilable)`);
    }
  }

  console.log('✅ ¡Las 10 campers hiperrealistas han sido sembradas exitosamente!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
