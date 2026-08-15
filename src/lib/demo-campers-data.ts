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
  // ANUNCIO 1: BASADO EN LA CARPETA public/anuncios/1/
  {
    id: 'anuncio-real-1',
    slug: 'volkswagen-transporter-t6-custom-camper-gran-canaria',
    title: 'Volkswagen T6 Custom Edition con Techo Elevable y Ducha',
    brand: 'Volkswagen',
    model: 'Transporter T6 Camperizada',
    vehicleType: 'TURISMO_CAMPERIZADO',
    year: 2023,
    island: 'Gran Canaria',
    municipality: 'Las Palmas de Gran Canaria',
    addressApprox: 'Guanarteme / Paseo de Las Canteras',
    latitude: 28.1340,
    longitude: -15.4410,
    passengers: 4,
    beds: 4,
    doors: 4,
    transmission: 'MANUAL',
    fuelType: 'DIESEL',
    fuelConsumption: '7.0 L/100km',
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
    description: 'Camper recién camperizada con acabados en madera de abedul de primera calidad. Cuenta con techo elevable con cama panorámica, segunda batería AGM con placa solar de 160W, nevera de compresor de 45L, fregadero con depósito de 50L de aguas limpias y ducha exterior. Ideal para recorrer la cumbre de Gran Canaria (Tejeda, Tamadaba) y despertar a pie de playa en Agaete o Maspalomas.',
    rules: 'No fumar en el interior del vehículo. Mascotas bienvenidas previa consulta. Se entrega y devuelve con depósito lleno de gasoil.',
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
      { id: 'p1-1', url: '/anuncios/1/foto-1.png', orderIndex: 0 },
      { id: 'p1-2', url: '/anuncios/1/foto-2.png', orderIndex: 1 },
      { id: 'p1-3', url: '/anuncios/1/foto-3.png', orderIndex: 2 },
      { id: 'p1-4', url: '/anuncios/1/foto-4.png', orderIndex: 3 },
      { id: 'p1-5', url: '/anuncios/1/foto-5.png', orderIndex: 4 },
      { id: 'p1-6', url: '/anuncios/1/foto-6.webp', orderIndex: 5 },
    ],
    features: [
      { id: 'f1-1', name: 'Techo elevable con cama doble' },
      { id: 'f1-2', name: 'Panel solar 160W y batería auxiliar' },
      { id: 'f1-3', name: 'Nevera compresor 45L con congelador' },
      { id: 'f1-4', name: 'Cocina portátil y menaje completo' },
      { id: 'f1-5', name: 'Ducha exterior con depósito de 50L' },
      { id: 'f1-6', name: 'Mesa y 2 sillas de camping exteriores' },
      { id: 'f1-7', name: 'Aislamiento térmico Kaiflex 20mm' },
      { id: 'f1-8', name: 'Tomas USB y conversor 220V' },
    ],
    reviews: [
      {
        id: 'r1-1',
        rating: 5,
        comment: '¡Una maravilla de furgoneta! Yeray nos explicó todo con muchísima amabilidad en la entrega en el aeropuerto. La camper gasta muy poco y pudimos dormir en Tamadaba con unas vistas de ensueño.',
        author: { firstName: 'Carlos Hernández', avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120' },
      },
      {
        id: 'r1-2',
        rating: 5,
        comment: 'Súper limpia, muy bien cuidada y súper cómoda para conducir por las carreteras de montaña. Repetiremos seguro.',
        author: { firstName: 'Elena Vega', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120' },
      },
    ],
  },

  // ANUNCIO 2: BASADO EN LA CARPETA public/anuncios/2/
  {
    id: 'anuncio-real-2',
    slug: 'fiat-ducato-maxi-gran-volumen-l3h2-tenerife',
    title: 'Fiat Ducato Gran Volumen L3H2 con Baño y Agua Caliente',
    brand: 'Fiat',
    model: 'Ducato Maxi L3H2 Camper',
    vehicleType: 'CAMPER_GRAN_VOLUMEN',
    year: 2022,
    island: 'Tenerife',
    municipality: 'San Cristóbal de La Laguna',
    addressApprox: 'Zona Los Majuelos / Aeropuerto Tenerife Norte',
    latitude: 28.4870,
    longitude: -16.3150,
    passengers: 3,
    beds: 3,
    doors: 5,
    transmission: 'MANUAL',
    fuelType: 'DIESEL',
    fuelConsumption: '8.4 L/100km',
    basePricePerDay: 95,
    includedKmPerDay: 150,
    extraKmPrice: 0.25,
    securityDeposit: 800,
    cleaningFee: 40,
    minDays: 3,
    maxDays: 30,
    bookingType: 'REQUEST_TO_BOOK',
    cancellationPolicy: 'MODERATE',
    status: 'ACTIVE',
    isDemoVehicle: true,
    isFeatured: true,
    description: 'Auténtica casa sobre ruedas con baño completo interior (ducha con agua caliente boiler Truma y WC químico Potti). Altura completa para estar de pie cómodamente (H2), cama de matrimonio fija trasera de 190x140cm, cocina de 2 fuegos con extractor, gran autonomía eléctrica con 300W de paneles solares y depósito de 100L de aguas limpias. Perfecta para amantes del surf en El Médano y pernoctar cerca del Parque Nacional del Teide.',
    rules: 'Prohibido fumar en el interior. No apta para pistas de tierra extremas. Se solicita vaciar aguas grises y WC antes de la devolución.',
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
      { id: 'p2-1', url: '/anuncios/2/foto-1.png', orderIndex: 0 },
      { id: 'p2-2', url: '/anuncios/2/foto-2.png', orderIndex: 1 },
      { id: 'p2-3', url: '/anuncios/2/foto-3.png', orderIndex: 2 },
      { id: 'p2-4', url: '/anuncios/2/foto-4.png', orderIndex: 3 },
      { id: 'p2-5', url: '/anuncios/2/foto-5.png', orderIndex: 4 },
    ],
    features: [
      { id: 'f2-1', name: 'Baño interior completo con ducha de agua caliente' },
      { id: 'f2-2', name: 'WC químico Potti incluido' },
      { id: 'f2-3', name: 'Calefacción estacionaria diésel y boiler Truma' },
      { id: 'f2-4', name: 'Placas solares 300W e inversor 2000W' },
      { id: 'f2-5', name: 'Depósito de 100L limpias / 80L grises' },
      { id: 'f2-6', name: 'Nevera grande de compresor 85L' },
      { id: 'f2-7', name: 'Cama doble trasera fija de viscoelástica' },
      { id: 'f2-8', name: 'Toldo exterior Fiamma F45' },
    ],
    reviews: [
      {
        id: 'r2-1',
        rating: 5,
        comment: 'La mejor experiencia en Tenerife sin duda. Tener ducha caliente después de surfear en El Médano y dormir calentitos al pie del Teide no tiene precio. Ayoze es un anfitrión de diez.',
        author: { firstName: 'Lucía Morales', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120' },
      },
      {
        id: 'r2-2',
        rating: 5,
        comment: 'Espaciosa, súper equipada y con muchísima autonomía eléctrica. No tuvimos que pisar un camping en 6 días.',
        author: { firstName: 'Marcos Benítez', avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120' },
      },
    ],
  },

  // ANUNCIO 3: BASADO EN LA CARPETA public/anuncios/3/
  {
    id: 'anuncio-real-3',
    slug: 'toyota-proace-nomad-camper-fuerteventura',
    title: 'Toyota Proace Nomad Edition Compacta y Ágil',
    brand: 'Toyota',
    model: 'Proace Verso Camper',
    vehicleType: 'TURISMO_CAMPERIZADO',
    year: 2023,
    island: 'Fuerteventura',
    municipality: 'La Oliva',
    addressApprox: 'Corralejo / Dunas de Corralejo',
    latitude: 28.7300,
    longitude: -13.8680,
    passengers: 2,
    beds: 2,
    doors: 4,
    transmission: 'MANUAL',
    fuelType: 'DIESEL',
    fuelConsumption: '6.5 L/100km',
    basePricePerDay: 68,
    includedKmPerDay: 150,
    extraKmPrice: 0.25,
    securityDeposit: 500,
    cleaningFee: 30,
    minDays: 2,
    maxDays: 30,
    bookingType: 'REQUEST_TO_BOOK',
    cancellationPolicy: 'FLEXIBLE',
    status: 'ACTIVE',
    isDemoVehicle: true,
    isFeatured: true,
    description: 'La compañera perfecta para descubrir las playas secretas y las pistas costeras de Fuerteventura (Cotillo, Majanicho, Cofete). Muy fácil de aparcar en cualquier sitio, gasta poquísimo combustible y cuenta con cama desplegable sobre estructura reforzada, oscurecedores térmicos 9 capas a medida, kit de cocina exterior, ducha portátil a 12V y mesa con sillas.',
    rules: 'Cuidar el interior y sacudir la arena de la playa antes de entrar. Prohibido fumar. Devolver limpia y con el depósito lleno.',
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
      { id: 'p3-1', url: '/anuncios/3/foto-1.png', orderIndex: 0 },
      { id: 'p3-2', url: '/anuncios/3/foto-2.png', orderIndex: 1 },
      { id: 'p3-3', url: '/anuncios/3/foto-3.png', orderIndex: 2 },
    ],
    features: [
      { id: 'f3-1', name: 'Cama camper confortable 190x135cm' },
      { id: 'f3-2', name: 'Oscurecedores térmicos 9 capas en todas las ventanas' },
      { id: 'f3-3', name: 'Nevera portátil termoeléctrica y conexión 12V/USB' },
      { id: 'f3-4', name: 'Hornillo camping gas con cartuchos y vajilla' },
      { id: 'f3-5', name: 'Ducha portátil a presión con depósito de 25L' },
      { id: 'f3-6', name: 'Mesa plegable y 2 sillas para comer al atardecer' },
      { id: 'f3-7', name: 'Consumo mínimo de diésel (6.5 L/100km)' },
    ],
    reviews: [
      {
        id: 'r3-1',
        rating: 5,
        comment: 'Inmejorable para recorrer Fuerteventura. Al ser compacta entras en cualquier rincón sin llamar la atención y se duerme genial escuchando las olas en El Cotillo. Guaci es un amor.',
        author: { firstName: 'Pablo Quintana', avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120' },
      },
      {
        id: 'r3-2',
        rating: 5,
        comment: 'Todo impecable y súper cómodo. La comunicación con la propietaria fue fluida y nos recomendó los mejores sitios para pernoctar.',
        author: { firstName: 'Sara Domínguez', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120' },
      },
    ],
  },
];
