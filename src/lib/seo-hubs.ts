export interface CitySeoHub {
  slug: string;
  city: string;
  region: string;
  countryCode: string;
  airportCode: string;
  airportName: string;
  lat: number;
  lng: number;
  heroSubtitle: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  vipZones: string[];
  drivingRoutes: { name: string; desc: string }[];
  faqs: { q: string; a: string }[];
}

export interface BrandSeoHub {
  slug: string;
  brandKey: string;
  name: string;
  country: string;
  heroImage: string;
  flagshipModels: string;
  maxHp: number;
  accel: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  heritageText: string;
  engineeringHighlights: string[];
  faqs: { q: string; a: string }[];
}

export const CITY_SEO_HUBS: CitySeoHub[] = [
  {
    slug: 'madrid',
    city: 'Madrid',
    region: 'Comunidad de Madrid',
    countryCode: 'ES',
    airportCode: 'MAD',
    airportName: 'Aeropuerto Adolfo Suárez Madrid-Barajas (T4 & Terminal Ejecutiva)',
    lat: 40.4168,
    lng: -3.7038,
    heroSubtitle: 'Barrio de Salamanca · La Moraleja · Pozuelo · Barajas T4 Ejecutiva',
    metaTitle: 'Alquiler de Superdeportivos en Madrid | Ferrari, Porsche y Lamborghini — GTR Cars',
    metaDescription:
      'Alquila un Ferrari SF90, Lamborghini Revuelto, Porsche 911 GT3 RS o McLaren en Madrid desde 520€/día. Entrega VIP en Aeropuerto Barajas T4, Barrio de Salamanca y La Moraleja con contrato eIDAS.',
    keywords: [
      'alquiler superdeportivos madrid',
      'alquilar ferrari madrid',
      'alquilar porsche madrid',
      'alquiler lamborghini madrid',
      'alquiler coches de lujo madrid',
      'supercar rental madrid airport',
    ],
    vipZones: [
      'Aeropuerto Madrid-Barajas T4 & Aviación Ejecutiva',
      'Barrio de Salamanca · Calle Serrano & Paseo de la Castellana',
      'La Moraleja, La Finca (Pozuelo) y Puerta de Hierro',
      'Hoteles Four Seasons Madrid, Rosewood Villa Magna y Mandarin Oriental Ritz',
    ],
    drivingRoutes: [
      {
        name: 'Puerto de Navacerrada y Cotos (M-601 / M-604)',
        desc: 'Ascensión alpina por la Sierra de Guadarrama entre pinares centenarios y asfalto técnico a 1.858 metros de altitud.',
      },
      {
        name: 'Cruz Verde y Robledo de Chavela (M-505)',
        desc: 'El punto de encuentro clásico de los entusiastas del motor en Madrid con curvas enlazadas de visibilidad perfecta.',
      },
    ],
    faqs: [
      {
        q: '¿Entregáis el superdeportivo en el Aeropuerto de Madrid-Barajas (MAD)?',
        a: 'Sí, nuestro equipo Concierge realiza entregas personalizadas 24/7 en la Terminal T4, T1-T2-T3 y en la Terminal de Aviación Ejecutiva de Madrid-Barajas, así como en hoteles y domicilios de toda la Comunidad de Madrid.',
      },
      {
        q: '¿Puedo circular por Madrid Central (ZBE) con los superdeportivos de GTR Cars?',
        a: 'Sí. Unidades híbridas enchufables como el Ferrari SF90 Stradale, Ferrari 296 GTB y Lamborghini Revuelto cuentan con distintivo ambiental CERO/ECO, y el resto de nuestra flota moderna tiene acceso garantizado a parkings y hoteles del centro.',
      },
    ],
  },
  {
    slug: 'marbella',
    city: 'Marbella',
    region: 'Costa del Sol · Andalucía',
    countryCode: 'ES',
    airportCode: 'AGP',
    airportName: 'Aeropuerto de Málaga-Costa del Sol (AGP & Terminal Privada FBO)',
    lat: 36.5101,
    lng: -4.8824,
    heroSubtitle: 'Puerto Banús · Milla de Oro · La Zagaleta · Aeropuerto Málaga AGP',
    metaTitle: 'Alquiler de Superdeportivos en Marbella y Puerto Banús | GTR Cars',
    metaDescription:
      'Alquiler de superdeportivos en Marbella y Puerto Banús: Lamborghini Revuelto, Ferrari SF90, McLaren Spider y Porsche 911 GT3. Entrega VIP 24h en villas, hoteles 5* GL y Aeropuerto de Málaga (AGP).',
    keywords: [
      'alquiler superdeportivos marbella',
      'alquilar ferrari marbella',
      'alquiler lamborghini puerto banus',
      'alquiler coches de lujo marbella',
      'supercar rental marbella puerto banus',
    ],
    vipZones: [
      'Muelle de Honor y Marina de Puerto Banús',
      'Milla de Oro: Marbella Club Hotel & Puente Romano Beach Resort',
      'Urbanizaciones Privadas: La Zagaleta, Sierra Blanca y Los Monteros',
      'Aeropuerto de Málaga-Costa del Sol (AGP) — Terminal Comercial y FBO Privado',
    ],
    drivingRoutes: [
      {
        name: 'Carretera de Ronda (A-397)',
        desc: 'Uno de los mejores tramos de montaña de Europa: 45 km de curvas rápidas ascendiendo desde San Pedro de Alcántara hasta el Tajo de Ronda.',
      },
      {
        name: 'Ruta Costera Estepona — Sotogrande',
        desc: 'Recorrido panorámico junto al Mediterráneo con vistas a Gibraltar y parada en los clubes de polo y marinas de Sotogrande.',
      },
    ],
    faqs: [
      {
        q: '¿Recogéis y entregáis en el Aeropuerto de Málaga (AGP) para clientes de Marbella?',
        a: 'Sí, coordinamos la entrega a pie de terminal en el Aeropuerto de Málaga (AGP) para que inicies tu viaje hacia Marbella o Puerto Banús al volante de tu superdeportivo sin esperas.',
      },
      {
        q: '¿Qué modelos descapotables tenéis disponibles en Marbella?',
        a: 'Disponemos de McLaren 750S Spider, McLaren 765LT Spider, Porsche 911 Cabriolet y unidades Targa/Spider ideales para el clima soleado de la Costa del Sol.',
      },
    ],
  },
  {
    slug: 'barcelona',
    city: 'Barcelona',
    region: 'Cataluña',
    countryCode: 'ES',
    airportCode: 'BCN',
    airportName: 'Aeropuerto Josep Tarradellas Barcelona-El Prat (T1 & Terminal Corporativa)',
    lat: 41.3874,
    lng: 2.1686,
    heroSubtitle: 'Paseo de Gracia · Pedralbes · Port Vell · Costa Brava · El Prat BCN',
    metaTitle: 'Alquiler de Superdeportivos en Barcelona | Ferrari, Lamborghini y Porsche — GTR Cars',
    metaDescription:
      'Alquila un superdeportivo en Barcelona con GTR Cars: Ferrari 296 GTB, Porsche 911 GT3, Lamborghini y McLaren. Entrega VIP en Aeropuerto El Prat (BCN), Paseo de Gracia, Marina Port Vell y Sitges.',
    keywords: [
      'alquiler superdeportivos barcelona',
      'alquilar ferrari barcelona',
      'alquilar porsche barcelona',
      'alquiler lamborghini barcelona',
      'alquiler coches de lujo barcelona',
      'supercar rental barcelona airport',
    ],
    vipZones: [
      'Paseo de Gracia, Diagonal y Pedralbes (Mandarin Oriental, Hotel Arts, W Barcelona)',
      'Marina Port Vell & OneOcean Club Barcelona',
      'Aeropuerto de Barcelona-El Prat (BCN) T1 y Terminal de Aviación Corporativa',
      'Sitges, Gavà Mar y villas privadas de la Costa Brava (Begur, S’Agaró)',
    ],
    drivingRoutes: [
      {
        name: 'Carretera de las Costas del Garraf (C-31) hacia Sitges',
        desc: 'Trazado esculpido sobre los acantilados del Mediterráneo a solo 25 minutos del centro de Barcelona.',
      },
      {
        name: 'Las 365 Curvas de Tossa de Mar a Sant Feliu de Guíxols (GI-682)',
        desc: 'Una de las carreteras costeras más espectaculares del mundo en pleno corazón de la Costa Brava.',
      },
    ],
    faqs: [
      {
        q: '¿Puedo recibir mi deportivo en el Aeropuerto de Barcelona-El Prat (BCN) o en Port Vell?',
        a: 'Por supuesto. Nuestro equipo entrega la unidad en menos de 15 minutos tras tu aterrizaje en la T1 o terminal ejecutiva de El Prat, o directamente frente a tu amarre en Marina Port Vell.',
      },
      {
        q: '¿Se puede alquilar por un solo día o fin de semana en Barcelona?',
        a: 'Sí, ofrecemos alquileres desde 1 día completo, escapadas de fin de semana hacia la Costa Brava o el Priorat, y tarifas especiales por semana.',
      },
    ],
  },
  {
    slug: 'mallorca',
    city: 'Mallorca',
    region: 'Islas Baleares',
    countryCode: 'ES',
    airportCode: 'PMI',
    airportName: 'Aeropuerto de Palma de Mallorca — Son Sant Joan (PMI)',
    lat: 39.5696,
    lng: 2.6502,
    heroSubtitle: 'Puerto Portals · Port Adriano · Son Vida · Aeropuerto Palma PMI',
    metaTitle: 'Alquiler de Superdeportivos en Mallorca | Porsche, Ferrari y Lamborghini — GTR Cars',
    metaDescription:
      'Alquiler de superdeportivos en Mallorca: recorre la Serra de Tramuntana y Formentor en un Porsche 911 GT3, Ferrari o McLaren. Entrega VIP en Aeropuerto de Palma (PMI), Puerto Portals y Port Adriano.',
    keywords: [
      'alquiler superdeportivos mallorca',
      'alquilar porsche mallorca',
      'alquilar ferrari mallorca',
      'alquiler coches de lujo palma de mallorca',
      'supercar rental mallorca',
    ],
    vipZones: [
      'Puerto Portals, Port Adriano y Club de Mar Palma',
      'Aeropuerto de Palma de Mallorca (PMI) y Terminal Privada Mallorcair',
      'Son Vida, Deià (Belmond La Residencia), Cap Rocat y Puerto de Andratx',
    ],
    drivingRoutes: [
      {
        name: 'Travesía Integral Serra de Tramuntana (MA-10)',
        desc: 'Desde Andratx hasta Pollença pasando por Valldemossa, Deià y el embalse de Cúber.',
      },
      {
        name: 'Faro de Cap de Formentor y Descenso a Sa Calobra',
        desc: 'Horquillas legendarias como el Nus de sa Corbata con vistas infinitas al mar Balear.',
      },
    ],
    faqs: [
      {
        q: '¿Realizáis entregas en Puerto Portals y Port Adriano en Mallorca?',
        a: 'Sí, entregamos el vehículo directamente en el pantalán de tu embarcación en Puerto Portals, Port Adriano, Port d’Andratx o en el Aeropuerto de Palma (PMI).',
      },
    ],
  },
  {
    slug: 'ibiza',
    city: 'Ibiza',
    region: 'Islas Baleares',
    countryCode: 'ES',
    airportCode: 'IBZ',
    airportName: 'Aeropuerto de Ibiza (IBZ & Terminal Ejecutiva)',
    lat: 38.9067,
    lng: 1.4206,
    heroSubtitle: 'Marina Botafoch · Es Cubells · Santa Eulària · Aeropuerto Ibiza IBZ',
    metaTitle: 'Alquiler de Superdeportivos en Ibiza | Ferrari, Lamborghini y Porsche — GTR Cars',
    metaDescription:
      'Alquila un Ferrari Spider, Lamborghini, McLaren o Porsche 911 en Ibiza con entrega VIP 24h en Marina Botafoch, Aeropuerto de Ibiza (IBZ), hoteles 5* y villas privadas.',
    keywords: [
      'alquiler superdeportivos ibiza',
      'alquiler coches de lujo ibiza',
      'alquilar ferrari ibiza',
      'alquilar lamborghini ibiza',
      'supercar rental ibiza',
    ],
    vipZones: [
      'Marina Botafoch, Marina Ibiza y Club Náutico',
      'Aeropuerto de Ibiza (IBZ) — Terminal Comercial y Aviación Privada',
      'Villas en Es Cubells, Roca Llisa, Cap Martinet y San José',
    ],
    drivingRoutes: [
      {
        name: 'Ruta Costera Sur hacia Cala d’Hort y Es Vedrà',
        desc: 'Atardecer inolvidable recorriendo las carreteras panorámicas del suroeste de la isla.',
      },
      {
        name: 'Norte de Ibiza: Sant Joan de Labritja y Cala Xuclar',
        desc: 'Tramos revirados rodeados de pinares mediterráneos y calas de aguas cristalinas.',
      },
    ],
    faqs: [
      {
        q: '¿Entregáis vehículos en villas privadas y barcos en Marina Botafoch?',
        a: 'Sí, nuestro servicio Concierge en Ibiza realiza la entrega y recogida en cualquier villa privada de la isla, hotel 5* o amarre en Marina Botafoch.',
      },
    ],
  },
  {
    slug: 'gran-canaria',
    city: 'Gran Canaria',
    region: 'Islas Canarias',
    countryCode: 'ES',
    airportCode: 'LPA',
    airportName: 'Aeropuerto de Gran Canaria (LPA)',
    lat: 27.9319,
    lng: -15.3866,
    heroSubtitle: 'Meloneras · Maspalomas · Pasito Blanco · Las Palmas · Aeropuerto LPA',
    metaTitle: 'Alquiler de Superdeportivos en Gran Canaria | Porsche, Ferrari y Lamborghini — GTR Cars',
    metaDescription:
      'Alquiler de deportivos y superdeportivos en Gran Canaria desde 520€/día: Porsche 911 GT3 RS, Ferrari 296 GTB y Lamborghini. Entrega VIP en Aeropuerto LPA, Meloneras y Maspalomas.',
    keywords: [
      'alquiler superdeportivos gran canaria',
      'alquiler deportivos gran canaria',
      'alquilar porsche gran canaria',
      'alquilar ferrari gran canaria',
      'sports car rental gran canaria',
    ],
    vipZones: [
      'Meloneras & Maspalomas (Lopesan Costa Meloneras, Seaside Grand Hotel Residencia)',
      'Marina Pasito Blanco, Puerto de Mogán y Salobre Golf Resort',
      'Aeropuerto de Gran Canaria (LPA) y Las Palmas (Hotel Santa Catalina)',
    ],
    drivingRoutes: [
      {
        name: 'Ascensión a Cruz de Tejeda y Pico de las Nieves (GC-15 / GC-130)',
        desc: 'De 0 a 1.949 metros de altitud entre calderas volcánicas con vistas al Roque Nublo y al Teide.',
      },
      {
        name: 'Autopista Costera del Sur hacia Mogán (GC-1 / GC-500)',
        desc: 'Clima soleado los 365 días del año bordeando los acantilados del sur de la isla.',
      },
    ],
    faqs: [
      {
        q: '¿Se puede recoger el superdeportivo directamente en el Aeropuerto de Gran Canaria (LPA)?',
        a: 'Sí, realizamos entregas VIP en el Aeropuerto de Gran Canaria (LPA) y en todos los hoteles 5 estrellas y villas de Meloneras, Maspalomas y Mogán.',
      },
    ],
  },
  {
    slug: 'tenerife',
    city: 'Tenerife',
    region: 'Islas Canarias',
    countryCode: 'ES',
    airportCode: 'TFS',
    airportName: 'Aeropuerto de Tenerife Sur — Reina Sofía (TFS) & Tenerife Norte (TFN)',
    lat: 28.0445,
    lng: -16.5725,
    heroSubtitle: 'Costa Adeje · Playa de las Américas · Abama · El Teide · Aeropuerto TFS',
    metaTitle: 'Alquiler de Superdeportivos en Tenerife | Ferrari, Lamborghini y Porsche — GTR Cars',
    metaDescription:
      'Alquila un Lamborghini Huracán STO, Ferrari o Porsche 911 en Tenerife. Sube al Parque Nacional del Teide con entrega VIP en Costa Adeje, Abama y Aeropuerto Tenerife Sur (TFS).',
    keywords: [
      'alquiler superdeportivos tenerife',
      'alquiler deportivos tenerife sur',
      'alquilar ferrari tenerife',
      'alquilar lamborghini tenerife',
      'supercar rental tenerife costa adeje',
    ],
    vipZones: [
      'Costa Adeje, La Caleta y Duque (Royal Hideaway Corales, Bahía del Duque)',
      'The Ritz-Carlton Abama y villas de Golf Costa Adeje',
      'Aeropuerto de Tenerife Sur (TFS) y Tenerife Norte (TFN)',
    ],
    drivingRoutes: [
      {
        name: 'Dorsal del Teide por Vilaflor y Boca Tauce (TF-21)',
        desc: 'Carretera de alta montaña a más de 2.200 metros sobre un paisaje volcánico único en el planeta.',
      },
      {
        name: 'Macizo de Anaga y Mirador de Las Teresitas (TF-12)',
        desc: 'Curvas técnicas entre bosques de laurisilva y miradores vertiginosos sobre el Atlántico.',
      },
    ],
    faqs: [
      {
        q: '¿Está permitido subir al Parque Nacional del Teide con los superdeportivos de GTR Cars?',
        a: 'Sí, todas las carreteras asfaltadas del Parque Nacional del Teide (TF-21, TF-24 y TF-38) están completamente habilitadas e incluidas dentro de nuestro seguro.',
      },
    ],
  },
  {
    slug: 'londres',
    city: 'Londres',
    region: 'Reino Unido (UK)',
    countryCode: 'GB',
    airportCode: 'LHR',
    airportName: 'London Heathrow Airport (LHR) & Farnborough Private Aviation',
    lat: 51.5074,
    lng: -0.1278,
    heroSubtitle: 'Mayfair · Knightsbridge · Belgravia · Chelsea · Heathrow LHR',
    metaTitle: 'Alquiler de Superdeportivos en Londres (Mayfair & Heathrow) | GTR Cars',
    metaDescription:
      'Supercar rental en Londres con GTR Cars: Aston Martin DBS, McLaren 765LT, Ferrari y Rolls-Royce con entrega VIP en Mayfair, Knightsbridge, Chelsea y Aeropuerto Heathrow (LHR).',
    keywords: [
      'alquiler superdeportivos londres',
      'supercar rental london',
      'supercar hire mayfair london',
      'rent ferrari london',
      'rent mclaren london',
    ],
    vipZones: [
      'Mayfair, Knightsbridge (Harrods), Belgravia y Sloane Street',
      'London Heathrow Airport (LHR), Farnborough Airport y Battersea Heliport',
      'Hoteles Claridge’s, The Dorchester, The Ritz London y Bulgari Hotel',
    ],
    drivingRoutes: [
      {
        name: 'Surrey Hills & Box Hill Zig Zag Road',
        desc: 'La escapada automovilística predilecta al sur de Londres con paradas en clubes privados de motor.',
      },
      {
        name: 'Ruta hacia Goodwood Estate y The Cotswolds',
        desc: 'Carreteras secundarias británicas rumbo a la cuna histórica del automovilismo inglés.',
      },
    ],
    faqs: [
      {
        q: '¿Puedo conducir en Londres con carnet español o europeo?',
        a: 'Sí, cualquier permiso de conducir vigente de España, la Unión Europea, Reino Unido o permiso internacional es válido para alquilar nuestra flota en Londres.',
      },
    ],
  },
];

export const BRAND_SEO_HUBS: BrandSeoHub[] = [
  {
    slug: 'porsche',
    brandKey: 'PORSCHE',
    name: 'Porsche',
    country: 'Stuttgart, Alemania',
    heroImage: '/supercars/brands/porsche.png',
    flagshipModels: '911 GT3 RS (992) · 911 GT3 Touring · 911 Carrera Cabriolet',
    maxHp: 525,
    accel: '3.2 S',
    metaTitle: 'Alquiler de Porsche en España | 911 GT3 RS, GT3 Touring y Cabriolet — GTR Cars',
    metaDescription:
      'Alquila un Porsche 911 GT3 RS (992), 911 GT3 Touring o 911 Cabriolet en Madrid, Marbella, Barcelona, Mallorca y Canarias desde 690€/día. Reserva la unidad exacta en GTR Cars.',
    keywords: [
      'alquilar porsche',
      'alquiler porsche 911',
      'alquiler porsche gt3 rs',
      'alquilar porsche madrid',
      'alquilar porsche marbella',
      'alquilar porsche barcelona',
    ],
    heritageText:
      'Desde Zuffenhausen hasta los circuitos más exigentes del mundo, Porsche representa el estándar absoluto de precisión dinámica. En GTR Cars ponemos a tu alcance las variantes atmosféricas más cotizadas de la generación 992: el radical 911 GT3 RS con paquete Weissach y aerodinámica activa DRS, y el purista 911 GT3 Touring capaz de girar hasta las 9.000 rpm.',
    engineeringHighlights: [
      'Motor Bóxer 4.0L de 6 cilindros atmosférico hasta 9.000 rpm',
      'Transmisión PDK de doble embrague de 7 velocidades con levas de magnesio',
      'Frenos carbocerámicos PCCB y eje trasero direccional activo',
    ],
    faqs: [
      {
        q: '¿Cuánto cuesta alquilar un Porsche 911 en GTR Cars?',
        a: 'Las tarifas de nuestra gama Porsche 911 parten desde 850 €/día para el 911 GT3 Touring (992) y 950 €/día para el 911 GT3 RS Weissach Package.',
      },
      {
        q: '¿En qué ciudades puedo alquilar un Porsche con GTR Cars?',
        a: 'Realizamos entregas en Madrid, Marbella, Barcelona, Mallorca, Ibiza, Gran Canaria, Tenerife y Londres.',
      },
    ],
  },
  {
    slug: 'ferrari',
    brandKey: 'FERRARI',
    name: 'Ferrari',
    country: 'Maranello, Italia',
    heroImage: '/supercars/brands/ferrari.png',
    flagshipModels: 'SF90 Stradale Assetto Fiorano · 296 GTB · F8 Spider',
    maxHp: 1000,
    accel: '2.5 S',
    metaTitle: 'Alquiler de Ferrari en España | SF90 Stradale y 296 GTB — GTR Cars',
    metaDescription:
      'Alquila un Ferrari SF90 Stradale de 1.000 CV o un Ferrari 296 GTB en Madrid, Marbella, Barcelona, Mallorca y Canarias. Entrega VIP Concierge y contrato digital eIDAS.',
    keywords: [
      'alquilar ferrari',
      'alquiler ferrari españa',
      'alquilar ferrari sf90',
      'alquilar ferrari 296 gtb',
      'alquilar ferrari madrid',
      'alquilar ferrari marbella',
    ],
    heritageText:
      'El Cavallino Rampante de Maranello encarna la pasión de la Fórmula 1 llevada a la carretera abierta. Nuestra colección Ferrari incluye tanto el superdeportivo híbrido enchufable SF90 Stradale de 1.000 CV con tracción integral y paquete Assetto Fiorano, como la ágil berlinetta 296 GTB de 830 CV.',
    engineeringHighlights: [
      'Hasta 1.000 CV combinados (V8 Biturbo + 3 motores eléctricos RAC-e)',
      'Aceleración 0 a 100 km/h en solo 2,5 segundos y 0-200 km/h en 6,7 segundos',
      'Selector eManettino en el volante con modos eDrive, Hybrid, Performance y Qualify',
    ],
    faqs: [
      {
        q: '¿Qué precio tiene alquilar un Ferrari por un día en España?',
        a: 'Puedes alquilar un Ferrari 296 GTB desde 1.450 €/día o el hypercar Ferrari SF90 Stradale de 1.000 CV desde 1.850 €/día con seguro a todo riesgo incluido.',
      },
    ],
  },
  {
    slug: 'lamborghini',
    brandKey: 'LAMBORGHINI',
    name: 'Lamborghini',
    country: 'Sant’Agata Bolognese, Italia',
    heroImage: '/supercars/brands/lamborghini.png',
    flagshipModels: 'Revuelto V12 Hybrid · Huracán STO · Huracán EVO',
    maxHp: 1015,
    accel: '2.5 S',
    metaTitle: 'Alquiler de Lamborghini en España | Revuelto V12 y Huracán STO — GTR Cars',
    metaDescription:
      'Alquila un Lamborghini Revuelto V12 de 1.015 CV o un Huracán STO en Marbella, Madrid, Barcelona, Ibiza y Canarias. Sonido atmosférico V10/V12 y entrega VIP a domicilio.',
    keywords: [
      'alquilar lamborghini',
      'alquiler lamborghini españa',
      'alquilar lamborghini revuelto',
      'alquilar lamborghini huracan sto',
      'alquilar lamborghini marbella',
      'alquilar lamborghini madrid',
    ],
    heritageText:
      'Automobili Lamborghini es sinónimo de diseño radical en cuña y motores atmosféricos de giro estratosférico. En GTR Cars puedes ponerte a los mandos del nuevo buque insignia V12 de Sant’Agata Bolognese, el Lamborghini Revuelto de 1.015 CV con puertas de tijera, o sentir la carga aerodinámica de carreras del Huracán STO con motor V10 de 640 CV.',
    engineeringHighlights: [
      'Motores V12 de 6.5L (1.015 CV) y V10 de 5.2L atmosféricos de hasta 8.500 rpm',
      'Chasis monocasco en fibra de carbono Forged Composites y carrocería Cofango',
      'Dirección activa en las cuatro ruedas Lamborghini Dinamica Veicolo Integrata (LDVI)',
    ],
    faqs: [
      {
        q: '¿Cuánto cuesta alquilar un Lamborghini por un día?',
        a: 'El Lamborghini Huracán STO está disponible desde 1.290 €/día y el nuevo Lamborghini Revuelto V12 Hybrid de 1.015 CV desde 2.400 €/día.',
      },
    ],
  },
  {
    slug: 'mclaren',
    brandKey: 'MCLAREN',
    name: 'McLaren',
    country: 'Woking, Reino Unido',
    heroImage: '/supercars/brands/mclaren.png',
    flagshipModels: '765LT Spider Carbon · 750S Spider · Artura',
    maxHp: 765,
    accel: '2.8 S',
    metaTitle: 'Alquiler de McLaren en España | 765LT Spider y 750S — GTR Cars',
    metaDescription:
      'Alquila un McLaren 765LT Spider o 750S en Madrid, Marbella, Barcelona y Canarias. Chasis monocasco de carbono MonoCage II, puertas diédricas y 765 CV de pura ingeniería británica.',
    keywords: [
      'alquilar mclaren',
      'alquiler mclaren españa',
      'alquilar mclaren 765lt',
      'alquilar mclaren 750s',
      'alquilar mclaren marbella',
    ],
    heritageText:
      'Construidos en el McLaren Technology Centre de Woking, los superdeportivos McLaren destacan por su extrema ligereza gracias al chasis monocasco de fibra de carbono y su dirección electrohidráulica de tacto inigualable. El 765LT Spider con cuádruple salida de escape en titanio y techo retráctil es una pieza de colección limitada.',
    engineeringHighlights: [
      'Chasis monocasco de fibra de carbono MonoCage II-S con puertas diédricas',
      'Motor V8 Biturbo de 4.0L con 765 CV y 800 Nm de par motor',
      'Suspensión hidráulica interconectada Proactive Chassis Control',
    ],
    faqs: [
      {
        q: '¿Cuál es el precio de alquiler del McLaren 765LT Spider?',
        a: 'El McLaren 765LT Spider de edición limitada tiene una tarifa oficial de 1.590 €/día con seguro VIP y entrega personalizada incluidos.',
      },
    ],
  },
  {
    slug: 'aston-martin',
    brandKey: 'ASTON MARTIN',
    name: 'Aston Martin',
    country: 'Gaydon, Reino Unido',
    heroImage: '/supercars/brands/aston-martin.png',
    flagshipModels: 'DBS Superleggera V12 · Vantage F1 Edition',
    maxHp: 725,
    accel: '3.4 S',
    metaTitle: 'Alquiler de Aston Martin en España | DBS Superleggera V12 — GTR Cars',
    metaDescription:
      'Alquila un Aston Martin DBS Superleggera V12 Biturbo de 725 CV en Madrid, Marbella, Barcelona y Londres. El Super GT británico definitivo en GTR Cars.',
    keywords: [
      'alquilar aston martin',
      'alquiler aston martin dbs',
      'alquilar aston martin españa',
      'rent aston martin marbella',
    ],
    heritageText:
      'Aston Martin fusiona la sastrería artesanal británica con la brutalidad de un propulsor V12 Biturbo de 5.2 litros. El DBS Superleggera entrega 725 CV y 900 Nm de par con una carrocería de fibra de carbono esculpida en túnel de viento.',
    engineeringHighlights: [
      'Motor V12 Biturbo de 5.2 litros con 725 CV y 900 Nm de par',
      'Carrocería Superleggera en fibra de carbono y aerodinámica Aeroblade II',
      'Interior artesanal en cuero Bridge of Weir y sistema de audio Bang & Olufsen',
    ],
    faqs: [
      {
        q: '¿Cuánto cuesta alquilar el Aston Martin DBS Superleggera?',
        a: 'El Aston Martin DBS Superleggera V12 está disponible desde 980 €/día.',
      },
    ],
  },
  {
    slug: 'mercedes-amg',
    brandKey: 'MERCEDES-AMG',
    name: 'Mercedes-AMG',
    country: 'Affalterbach, Alemania',
    heroImage: '/supercars/brands/mercedes-benz.png',
    flagshipModels: 'AMG GT Black Series · AMG GT 63 S',
    maxHp: 730,
    accel: '3.2 S',
    metaTitle: 'Alquiler de Mercedes-AMG en España | AMG GT Black Series — GTR Cars',
    metaDescription:
      'Alquila el exclusivo Mercedes-AMG GT Black Series de 730 CV en España con GTR Cars. Motor V8 cigüeñal plano ensamblado a mano en Affalterbach.',
    keywords: [
      'alquilar mercedes amg',
      'alquiler mercedes amg gt black series',
      'alquilar amg gt españa',
    ],
    heritageText:
      'Bajo la filosofía "One Man, One Engine" de Affalterbach, el Mercedes-AMG GT Black Series ostenta uno de los récords más rápidos de la historia en Nürburgring Nordschleife gracias a su V8 Biturbo de cigüeñal plano y 730 CV.',
    engineeringHighlights: [
      'Motor V8 4.0L Biturbo con cigüeñal plano (Flat-Plane) y 730 CV',
      'Control de tracción AMG Traction Control ajustable en 9 niveles heredado del GT3',
      'Alerón trasero de doble plano en fibra de carbono con flap activo',
    ],
    faqs: [
      {
        q: '¿Cuál es la tarifa diaria del Mercedes-AMG GT Black Series?',
        a: 'El Mercedes-AMG GT Black Series está disponible desde 1.150 €/día.',
      },
    ],
  },
  {
    slug: 'audi',
    brandKey: 'AUDI',
    name: 'Audi Sport',
    country: 'Neckarsulm, Alemania',
    heroImage: '/supercars/brands/audi.png',
    flagshipModels: 'R8 V10 Performance Quattro · RS6 Avant Performance',
    maxHp: 620,
    accel: '3.1 S',
    metaTitle: 'Alquiler de Audi R8 V10 Performance en España | GTR Cars',
    metaDescription:
      'Alquila el último Audi R8 V10 Performance Quattro atmosférico de 620 CV en Madrid, Barcelona, Marbella y Canarias desde 790€/día con GTR Cars.',
    keywords: [
      'alquilar audi r8',
      'alquiler audi r8 v10 españa',
      'alquilar audi r8 madrid',
      'alquilar audi r8 barcelona',
    ],
    heritageText:
      'El Audi R8 V10 Performance Quattro es el canto del cisne de los motores de 10 cilindros atmosféricos de calle. Con 620 CV a 8.700 rpm y tracción integral Quattro variable, ofrece prestaciones de circuito con una nobleza de conducción extraordinaria.',
    engineeringHighlights: [
      'Motor 5.2 FSI V10 atmosférico de 620 CV compartido con plataforma de competición GT3',
      'Tracción integral permanente Quattro con reparto dinámico de par',
      'Frenos carbocerámicos y chasis Audi Space Frame en aluminio y polímero reforzado con carbono',
    ],
    faqs: [
      {
        q: '¿Cuánto cuesta alquilar el Audi R8 V10 Performance?',
        a: 'Puedes alquilar el Audi R8 V10 Performance Quattro desde 790 €/día.',
      },
    ],
  },
  {
    slug: 'bmw',
    brandKey: 'BMW',
    name: 'BMW M',
    country: 'Múnich, Alemania',
    heroImage: '/supercars/brands/bmew.png',
    flagshipModels: 'M4 Competition xDrive · M3 CS',
    maxHp: 510,
    accel: '3.5 S',
    metaTitle: 'Alquiler de BMW M4 Competition xDrive en España | GTR Cars',
    metaDescription:
      'Alquila un BMW M4 Competition xDrive de 510 CV con asientos M Carbon Bucket en Madrid, Barcelona, Marbella y Canarias desde 550€/día.',
    keywords: [
      'alquilar bmw m4',
      'alquiler bmw m4 competition',
      'alquilar bmw m3 españa',
    ],
    heritageText:
      'BMW M GmbH define el segmento de los coupés deportivos de altas prestaciones. Nuestro BMW M4 Competition xDrive combina 510 CV del motor S58 TwinPower Turbo con tracción M xDrive desconectable y asientos baquet integrales de fibra de carbono.',
    engineeringHighlights: [
      'Motor 3.0L de 6 cilindros en línea M TwinPower Turbo con 510 CV y 650 Nm',
      'Sistema de tracción M xDrive con modos 4WD, 4WD Sport y 2WD (propulsión trasera)',
      'Techo y asientos M Carbon Bucket en fibra de carbono vista',
    ],
    faqs: [
      {
        q: '¿Cuántas plazas tiene el BMW M4 Competition en alquiler?',
        a: 'Cuenta con 4 plazas reales y maletero amplio, con una tarifa desde 550 €/día.',
      },
    ],
  },
  {
    slug: 'bentley',
    brandKey: 'BENTLEY',
    name: 'Bentley',
    country: 'Crewe, Reino Unido',
    heroImage: '/supercars/brands/bentley.png',
    flagshipModels: 'Continental GT Speed W12',
    maxHp: 659,
    accel: '3.6 S',
    metaTitle: 'Alquiler de Bentley Continental GT Speed W12 en España | GTR Cars',
    metaDescription:
      'Alquila el Bentley Continental GT Speed W12 de 659 CV en Marbella, Madrid, Barcelona y Mallorca. El Gran Turismo de hiperlujo de 4 plazas en GTR Cars.',
    keywords: [
      'alquilar bentley',
      'alquiler bentley continental gt',
      'alquilar bentley marbella',
      'alquilar bentley madrid',
    ],
    heritageText:
      'Ensamblado a mano en Crewe, el Bentley Continental GT Speed es la cumbre del Gran Turismo europeo: un motor W12 biturbo de 6.0 litros y 659 CV capaz de alcanzar los 335 km/h en un habitáculo revestido en cuero acolchado diamante y maderas nobles.',
    engineeringHighlights: [
      'Motor W12 TSI de 6.0 litros con 659 CV y 900 Nm de par motor',
      'Dirección activa a las cuatro ruedas y barra estabilizadora activa de 48V Bentley Dynamic Ride',
      'Pantalla giratoria Bentley Rotating Display y 4 plazas de gran confort',
    ],
    faqs: [
      {
        q: '¿Cuál es el precio diario del Bentley Continental GT Speed?',
        a: 'El Bentley Continental GT Speed W12 está disponible desde 950 €/día.',
      },
    ],
  },
  {
    slug: 'rolls-royce',
    brandKey: 'ROLLS-ROYCE',
    name: 'Rolls-Royce',
    country: 'Goodwood, Reino Unido',
    heroImage: '/supercars/brands/rolls-royce.png',
    flagshipModels: 'Spectre · Cullinan Black Badge',
    maxHp: 585,
    accel: '4.5 S',
    metaTitle: 'Alquiler de Rolls-Royce Spectre en España y Londres | GTR Cars',
    metaDescription:
      'Alquila el nuevo Rolls-Royce Spectre en Marbella, Madrid, Ibiza y Londres. Techo estrellado Starlight, puertas Coach Doors y servicio Concierge VIP.',
    keywords: [
      'alquilar rolls royce',
      'alquiler rolls royce spectre',
      'alquilar rolls royce marbella',
      'alquilar rolls royce madrid',
    ],
    heritageText:
      'Desde Goodwood, Rolls-Royce firma con el Spectre el Ultra-Luxury Super Coupé más silencioso y majestuoso jamás fabricado. Su suspensión Planar ofrece el célebre efecto "Magic Carpet Ride" bajo un cielo estrellado Starlight Doors & Headliner con más de 4.700 puntos de fibra óptica.',
    engineeringHighlights: [
      '585 CV y 900 Nm de par instantáneo con silencio acústico absoluto',
      'Puertas de apertura inversa motorizadas Effortless Doors y techo Starlight',
      'Chasis íntegro en aluminio Architecture of Luxury con suspensión Planar',
    ],
    faqs: [
      {
        q: '¿Se puede alquilar el Rolls-Royce Spectre para bodas o eventos VIP?',
        a: 'Sí, ofrecemos alquiler con o sin chófer Concierge para eventos corporativos, bodas de lujo y estancias en Marbella, Madrid, Ibiza y Londres desde 1.950 €/día.',
      },
    ],
  },
  {
    slug: 'chevrolet',
    brandKey: 'CHEVROLET',
    name: 'Chevrolet',
    country: 'Bowling Green, EE. UU.',
    heroImage: '/supercars/brands/chevrolet.png',
    flagshipModels: 'Corvette C8 Z06 Track Pack',
    maxHp: 670,
    accel: '2.7 S',
    metaTitle: 'Alquiler de Chevrolet Corvette C8 Z06 en España | GTR Cars',
    metaDescription:
      'Alquila el Chevrolet Corvette C8 Z06 de motor central y 670 CV en España con GTR Cars. El V8 atmosférico de producción más potente de la historia.',
    keywords: [
      'alquilar corvette c8',
      'alquiler chevrolet corvette z06 españa',
      'alquilar corvette madrid',
    ],
    heritageText:
      'Con su arquitectura de motor central trasero y el propulsor LT6 5.5L V8 DOHC de cigüeñal plano capaz de girar a 8.600 rpm, el Chevrolet Corvette C8 Z06 rivaliza directamente con las mejores berlinettas europeas entregando 670 CV de potencia atmosférica pura.',
    engineeringHighlights: [
      'Motor V8 atmosférico de 5.5L con cigüeñal plano y 670 CV a 8.600 rpm',
      'Techo tipo Targa desmontable y cambio de doble embrague de 8 relaciones',
      'Aceleración de 0 a 100 km/h en 2,7 segundos',
    ],
    faqs: [
      {
        q: '¿Cuánto cuesta alquilar el Chevrolet Corvette C8 Z06?',
        a: 'Está disponible en la colección GTR Cars desde 690 €/día.',
      },
    ],
  },
  {
    slug: 'ford',
    brandKey: 'FORD',
    name: 'Ford Performance',
    country: 'Dearborn, EE. UU.',
    heroImage: '/supercars/brands/ford.png',
    flagshipModels: 'Mustang Dark Horse V8 5.0',
    maxHp: 500,
    accel: '3.7 S',
    metaTitle: 'Alquiler de Ford Mustang Dark Horse V8 en España | GTR Cars',
    metaDescription:
      'Alquila el nuevo Ford Mustang Dark Horse V8 5.0 Coyote de 500 CV en Madrid, Marbella, Barcelona y Canarias desde 520€/día en GTR Cars.',
    keywords: [
      'alquilar ford mustang',
      'alquiler mustang v8 españa',
      'alquilar mustang dark horse',
      'alquilar mustang madrid',
    ],
    heritageText:
      'El Ford Mustang Dark Horse es la expresión más enfocada a circuito de la saga Mustang V8. Equipado con la cuarta generación del motor 5.0L Coyote atmosférico con bielas forjadas heredadas del Shelby GT500, amortiguación MagneRide y frenos Brembo de 6 pistones.',
    engineeringHighlights: [
      'Motor V8 5.0L Coyote atmosférico de 500 CV con escape activo de 4 válvulas',
      'Suspensión adaptativa MagneRide y diferencial trasero autoblocante Torsen',
      '4 plazas con cuadro digital configurable estilo Motorsport',
    ],
    faqs: [
      {
        q: '¿Cuál es el superdeportivo V8 más accesible para alquilar en GTR Cars?',
        a: 'El Ford Mustang Dark Horse V8 5.0 está disponible desde 520 €/día con contrato digital eIDAS y seguro incluido.',
      },
    ],
  },
];
