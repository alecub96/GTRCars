export interface DemoCamperItem {
  id: string;
  slug: string;
  title: string;
  brand: string;
  model: string;
  vehicleType: string;
  year: number;
  island: string;
  municipality: string;
  addressApprox: string;
  latitude: number;
  longitude: number;
  passengers: number;
  beds: number;
  doors: number;
  transmission: string;
  fuelType: string;
  fuelConsumption: string;
  basePricePerDay: number;
  includedKmPerDay: number;
  extraKmPrice: number;
  securityDeposit: number;
  cleaningFee: number;
  minDays: number;
  maxDays: number;
  bookingType: string;
  cancellationPolicy: string;
  description: string;
  rules: string;
  status: 'ACTIVE';
  isVip?: boolean;
  isFeatured?: boolean;
  isDemoVehicle: true;
  owner: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string;
    verification: string;
    phone: string;
    email: string;
  };
  photos: { id: string; url: string; orderIndex: number }[];
  features: { id: string; name: string }[];
  reviews: { id: string; rating: number; comment: string; author: { firstName: string; avatarUrl?: string } }[];
}

export const REALISTIC_CANARIAN_CAMPERS: DemoCamperItem[] = [
  // ANUNCIO 1: FOTOS DE LA CARPETA public/Anuncios/1/ -> VOLKSWAGEN T2 BULLI VINTAGE CON TECHO ELEVABLE
  {
    id: 'anuncio-real-1',
    slug: 'volkswagen-transporter-t6-custom-camper-gran-canaria',
    title: 'Volkswagen T2 Bulli Clásica Vintage con Techo Elevable',
    brand: 'Volkswagen',
    model: 'T2 Bulli Camper Clásica',
    vehicleType: 'TURISMO_CAMPERIZADO',
    year: 1982,
    island: 'Gran Canaria',
    municipality: 'Las Palmas de Gran Canaria',
    addressApprox: 'Guanarteme / Paseo de Las Canteras',
    latitude: 28.1340,
    longitude: -15.4410,
    passengers: 4,
    beds: 4,
    doors: 4,
    transmission: 'MANUAL',
    fuelType: 'GASOLINA',
    fuelConsumption: '9.5 L/100km',
    basePricePerDay: 75,
    includedKmPerDay: 150,
    extraKmPrice: 0.25,
    securityDeposit: 600,
    cleaningFee: 35,
    minDays: 2,
    maxDays: 30,
    bookingType: 'REQUEST_TO_BOOK',
    cancellationPolicy: 'MODERATE',
    status: 'ACTIVE',
    isDemoVehicle: true,
    isFeatured: true,
    description: 'Auténtica furgoneta clásica Volkswagen T2 Bulli vintage restaurada con mimo. Cuenta con techo elevable con lona panorámica y cama superior, acogedor interior de madera artesanal con sofá-cama doble inferior, mesa abatible, cocina de camping con menaje completo, iluminación LED cálida y kit de mesa y sillas de exterior. Una experiencia retro inolvidable para recorrer Gran Canaria con calma disfrutando de cada atardecer frente al mar.',
    rules: 'No fumar en el interior del vehículo. Mascotas bienvenidas previa consulta. Se entrega y devuelve con depósito lleno de combustible.',
    owner: {
      id: 'owner-yeray-1',
      firstName: 'Yeray',
      lastName: 'Santana Marrero',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      verification: 'VERIFIED',
      phone: '+34 628 314 902',
      email: 'yeray.santana@vaneando.canarias',
    },
    photos: [
      { id: 'p1-1', url: '/Anuncios/1/foto-1.webp', orderIndex: 0 },
      { id: 'p1-2', url: '/Anuncios/1/foto-2.png', orderIndex: 1 },
      { id: 'p1-3', url: '/Anuncios/1/foto-3.png', orderIndex: 2 },
      { id: 'p1-4', url: '/Anuncios/1/foto-4.png', orderIndex: 3 },
      { id: 'p1-5', url: '/Anuncios/1/foto-5.png', orderIndex: 4 },
      { id: 'p1-6', url: '/Anuncios/1/foto-6.png', orderIndex: 5 },
    ],
    features: [
      { id: 'f1-1', name: 'Techo elevable con cama panorámica' },
      { id: 'f1-2', name: 'Interior de madera retro restaurado' },
      { id: 'f1-3', name: 'Sofá-cama convertible de matrimonio' },
      { id: 'f1-4', name: 'Cocina camping gas y menaje completo' },
      { id: 'f1-5', name: 'Ducha exterior portátil' },
      { id: 'f1-6', name: 'Mesa y sillas de madera de camping' },
      { id: 'f1-7', name: 'Aislamiento térmico Kaiflex' },
      { id: 'f1-8', name: 'Tomas USB y conexión a 12V' },
    ],
    reviews: [
      {
        id: 'r1-1',
        rating: 5,
        comment: '¡Una maravilla de furgoneta clásica! Yeray nos explicó todo con muchísima amabilidad en la entrega. Conducir una auténtica T2 Bulli viendo el atardecer en Agaete no tiene precio.',
        author: { firstName: 'Carlos Hernández', avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120' },
      },
      {
        id: 'r1-2',
        rating: 5,
        comment: 'Súper cuidada, limpia y llena de encanto vintage. Se duerme de maravilla con el techo abierto escuchando el mar.',
        author: { firstName: 'Elena Vega', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120' },
      },
    ],
  },

  // ANUNCIO 2: FOTOS DE LA CARPETA public/Anuncios/2/ -> DACIA DOKKER STEPWAY CAMPERIZADA
  {
    id: 'anuncio-real-2',
    slug: 'fiat-ducato-maxi-gran-volumen-l3h2-tenerife',
    title: 'Dacia Dokker Stepway Camperizada con Mueble Camper y Cama Doble',
    brand: 'Dacia',
    model: 'Dokker Stepway Camperizada',
    vehicleType: 'TURISMO_CAMPERIZADO',
    year: 2021,
    island: 'Tenerife',
    municipality: 'San Cristóbal de La Laguna',
    addressApprox: 'Zona Los Majuelos / Aeropuerto Tenerife Norte',
    latitude: 28.4870,
    longitude: -16.3150,
    passengers: 2,
    beds: 2,
    doors: 5,
    transmission: 'MANUAL',
    fuelType: 'DIESEL',
    fuelConsumption: '5.6 L/100km',
    basePricePerDay: 95,
    includedKmPerDay: 150,
    extraKmPrice: 0.25,
    securityDeposit: 600,
    cleaningFee: 30,
    minDays: 2,
    maxDays: 30,
    bookingType: 'REQUEST_TO_BOOK',
    cancellationPolicy: 'MODERATE',
    status: 'ACTIVE',
    isDemoVehicle: true,
    isFeatured: true,
    description: 'Minicamper muy ágil, compacta y de mínimo consumo diésel. Equipada con mueble camper artesanal en madera con cajones y compartimentos extraíbles, cama confortable de 190x135cm, aislantes térmicos oscurecedores a medida, hornillo camping gas con menaje, ducha exterior portátil y kit de mesa y sillas de camping. Ideal para recorrer las calas secretas de Tenerife y pernoctar con total discreción y facilidad de aparcamiento.',
    rules: 'Prohibido fumar en el interior. No apta para pistas de tierra extremas. Devolver limpia y con el depósito de gasoil lleno.',
    owner: {
      id: 'owner-ayoze-2',
      firstName: 'Ayoze',
      lastName: 'Hernández González',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      verification: 'VERIFIED',
      phone: '+34 619 882 104',
      email: 'ayoze.tenerife@vaneando.canarias',
    },
    photos: [
      { id: 'p2-1', url: '/Anuncios/2/foto-1.png', orderIndex: 0 },
      { id: 'p2-2', url: '/Anuncios/2/foto-2.png', orderIndex: 1 },
      { id: 'p2-3', url: '/Anuncios/2/foto-3.png', orderIndex: 2 },
      { id: 'p2-4', url: '/Anuncios/2/foto-4.png', orderIndex: 3 },
      { id: 'p2-5', url: '/Anuncios/2/foto-5.png', orderIndex: 4 },
    ],
    features: [
      { id: 'f2-1', name: 'Mueble camper extraíble en madera artesanal' },
      { id: 'f2-2', name: 'Cama doble plegable 190x135cm con colchón viscoelástico' },
      { id: 'f2-3', name: 'Kit de mesa plegable y sillas de camping para exterior' },
      { id: 'f2-4', name: 'Oscurecedores térmicos a medida en todas las lunas' },
      { id: 'f2-5', name: 'Hornillo de gas portátil con cartuchos y vajilla' },
      { id: 'f2-6', name: 'Ducha exterior portátil a 12V con depósito' },
      { id: 'f2-7', name: 'Consumo súper reducido de combustible (5.6 L/100km)' },
      { id: 'f2-8', name: 'Barras de techo y conexiones USB de carga rápida' },
    ],
    reviews: [
      {
        id: 'r2-1',
        rating: 5,
        comment: 'La mejor opción para recorrer Tenerife. Al ser compacta entras y aparcas en cualquier rincón y se duerme comodísimo con el colchón. Ayoze es un anfitrión de diez.',
        author: { firstName: 'Lucía Morales', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120' },
      },
      {
        id: 'r2-2',
        rating: 5,
        comment: 'Súper práctica, gasta poquísimo combustible y el mueble con cajones es comodísimo para cocinar fuera frente al mar.',
        author: { firstName: 'Marcos Benítez', avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120' },
      },
    ],
  },

  // ANUNCIO 3: FOTOS DE LA CARPETA public/Anuncios/3/ -> AUTOCARAVANA RIMOR SEAL PERFILADA (CHASIS RENAULT MASTER)
  {
    id: 'anuncio-real-3',
    slug: 'toyota-proace-nomad-camper-fuerteventura',
    title: 'Autocaravana Rimor Seal Perfilada con Cama en Isla y Salón Comedor',
    brand: 'Rimor',
    model: 'Seal Perfilada (Chasis Renault Master)',
    vehicleType: 'AUTOCARAVANA_PERFILADA',
    year: 2022,
    island: 'Fuerteventura',
    municipality: 'La Oliva',
    addressApprox: 'Corralejo / Dunas de Corralejo',
    latitude: 28.7300,
    longitude: -13.8680,
    passengers: 4,
    beds: 4,
    doors: 3,
    transmission: 'MANUAL',
    fuelType: 'DIESEL',
    fuelConsumption: '9.8 L/100km',
    basePricePerDay: 110,
    includedKmPerDay: 150,
    extraKmPrice: 0.25,
    securityDeposit: 800,
    cleaningFee: 45,
    minDays: 3,
    maxDays: 30,
    bookingType: 'REQUEST_TO_BOOK',
    cancellationPolicy: 'MODERATE',
    status: 'ACTIVE',
    isDemoVehicle: true,
    isFeatured: true,
    description: 'Espectacular autocaravana perfilada Rimor Seal sobre chasis Renault Master con todos los lujos y comodidades. Dispone de gran cama de matrimonio fija en isla trasera, espacioso salón comedor con asientos giratorios de cabina y mesa para 4 personas, TV plana, cocina completa con frigorífico grande y congelador, baño completo con ducha, toldo exterior Fiamma desplegable con mesa de picnic y portabicicletas trasero. La forma definitiva de disfrutar Fuerteventura con el máximo confort.',
    rules: 'Cuidar el interior y vaciar depósitos de aguas grises y WC antes de la devolución. Prohibido fumar en el habitáculo. Devolver con depósito de diésel lleno.',
    owner: {
      id: 'owner-guacimara-3',
      firstName: 'Guacimara',
      lastName: 'Betancor Rodríguez',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
      verification: 'VERIFIED',
      phone: '+34 633 912 770',
      email: 'guacimara.fuerteventura@vaneando.canarias',
    },
    photos: [
      { id: 'p3-1', url: '/Anuncios/3/foto-1.png', orderIndex: 0 },
      { id: 'p3-2', url: '/Anuncios/3/foto-2.png', orderIndex: 1 },
      { id: 'p3-3', url: '/Anuncios/3/foto-3.png', orderIndex: 2 },
    ],
    features: [
      { id: 'f3-1', name: 'Cama de matrimonio fija en isla trasera' },
      { id: 'f3-2', name: 'Salón comedor espacioso con mesa y asientos giratorios' },
      { id: 'f3-3', name: 'Baño completo con cabina de ducha y WC químico' },
      { id: 'f3-4', name: 'Cocina completa con 3 fuegos y menaje' },
      { id: 'f3-5', name: 'Frigorífico grande de 140L con congelador' },
      { id: 'f3-6', name: 'Toldo exterior Fiamma y kit de mesa con sillas' },
      { id: 'f3-7', name: 'Televisión plana y calefacción estacionaria' },
      { id: 'f3-8', name: 'Portabicicletas trasero para 2 bicis' },
    ],
    reviews: [
      {
        id: 'r3-1',
        rating: 5,
        comment: 'Inmejorable experiencia en Fuerteventura. La autocaravana es un palacio sobre ruedas: la cama en isla es comodísima y desayunar bajo el toldo mirando las dunas de Corralejo fue un sueño.',
        author: { firstName: 'Pablo Quintana', avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120' },
      },
      {
        id: 'r3-2',
        rating: 5,
        comment: 'Espaciosa, impecablemente limpia y con todo funcionando a la perfección. Guaci nos atendió de maravilla en todo momento.',
        author: { firstName: 'Sara Domínguez', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120' },
      },
    ],
  },
];
