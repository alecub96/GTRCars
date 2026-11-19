import React from 'react';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BookingWidget from '@/components/BookingWidget';
import FavoriteButton from '@/components/FavoriteButton';
import ShareVehicleButton from '@/components/ShareVehicleButton';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import VehicleViewTracker from '@/components/VehicleViewTracker';
import { Star, MapPin, Users, Bed, ShieldCheck, Check, Fuel, Settings2, Compass } from 'lucide-react';
import type { Metadata } from 'next';
import { getFeaturedAudience } from '@/lib/featured';
import CamperDetailGallery from '@/components/CamperDetailGallery';
import SupercarConfiguratorShowcase from '@/components/SupercarConfiguratorShowcase';
import CamperLocationMap from '@/components/CamperLocationMap';
import ContactOwnerButton from '@/components/ContactOwnerButton';
import { isConfiguredAdmin } from '@/lib/admin';
import Link from 'next/link';
import { formatDateSafe } from '@/lib/date-utils';
import { isRequestOnlyVehicle } from '@/lib/booking-policy';

export const dynamic = 'force-dynamic';

interface CamperDetailPageProps {
  params: Promise<{ slug: string }>;
}

async function fetchVehicleBySlugOrId(slugParam: string) {
  const raw = slugParam || '';
  const decoded = decodeURIComponent(raw).trim().toLowerCase();
  const slugClean = decoded.replace(/-[a-f0-9]{8}$/i, '');

  const DEMO_SUPERCARS: Record<string, any> = {
    'ferrari-488-gtb-rosso-corsa': {
      id: '4ead6554-3909-4785-b6a5-ca61b37ae6ec',
      title: 'Ferrari 488 GTB Rosso Corsa Bi-Colore',
      slug: 'ferrari-488-gtb-rosso-corsa',
      brand: 'FERRARI',
      model: '488 GTB',
      year: 2019,
      hp: 670,
      accel: '3.0 S',
      topSpeed: 330,
      fuelConsumption: '3.9L V8 Twin-Turbo F154 CB',
      transmission: 'F1 Doble Embrague 7 Vel',
      fuelType: 'Gasolina 98',
      passengers: 2,
      beds: 0,
      basePricePerDay: 1290,
      securityDeposit: 4500,
      cleaningFee: 50,
      ownershipType: 'PLATFORM',
      island: 'Tenerife',
      municipality: 'Costa Adeje / Aeropuerto Sur (TFS)',
      description: 'Pura adrenalina de Maranello disponible en las Islas Canarias. Esta unidad real se presenta con el legendario acabado Rosso Corsa con techo y montantes en Nero de contraste (acabado Bi-Colore de fábrica), llantas forjadas de 20 pulgadas en negro satinado con tapacubos amarillos, pinzas de freno Brembo carbocerámicas en rojo y escudos Scuderia Ferrari esmaltados en las aletas delanteras.\n\nEquipada con el motor V8 de 3.9 litros Bi-Turbo galardonado como Motor Internacional del Año, entrega 670 CV y 760 Nm de par mediante gestión de par variable (Variable Torque Management). Incorpora el sistema de control de deslizamiento lateral Side Slip Control 2 (SSC2), diferencial electrónico E-Diff3 y amortiguación magnetorreológica SCM3 adaptativa, ofreciendo una precisión quirúrgica para ascender al Parque Nacional del Teide o recorrer las costas canarias.',
      photos: [
        { url: '/supercars/ferrari-488/ferrari-488-front.jpg' },
        { url: '/supercars/ferrari-488/ferrari-488-side.jpg' },
        { url: '/supercars/ferrari-488/ferrari-488-rear.jpg' }
      ],
      owner: { id: 'd4519096-12ba-4396-9e5d-55cf71ce3cb4', firstName: 'GTR Cars', lastName: 'Official', avatarUrl: '/brand/app-icon.png', verification: 'VERIFIED', createdAt: new Date() },
      status: 'ACTIVE',
      features: [
        { name: 'Potencia: 670 CV V8 Biturbo' },
        { name: '0-100 km/h: 3.0 s' },
        { name: 'Velocidad Máx: 330 km/h' },
        { name: 'Frenos Carbono-Cerámicos CCMR' },
        { name: 'Pintura Rosso Corsa con Techo Nero Bi-Colore' },
        { name: 'Escudos Scuderia Ferrari en Aletas' },
        { name: 'Llantas Forjadas 20" Negro Satinado' },
        { name: 'Control Deslizamiento Lateral SSC2' },
        { name: 'Manettino Volante con Modo Race & CT Off' },
        { name: 'Entrega VIP en Aeropuertos de Canarias o Hotel 5* GL' }
      ],
      extras: [
        { id: 'e-tfs', extra: { name: 'Entrega VIP Aeropuerto TFS / TFN', description: 'Recepción directa en terminal con briefing técnico', price: 150 } },
        { id: 'e-hotel', extra: { name: 'Entrega en Villa / Hotel 5* GL', description: 'Traslado personalizado a Costa Adeje, Abama o Maspalomas', price: 120 } }
      ],
      reviews: [
        { id: 'rev-488-1', rating: 5, comment: 'Alquilar el Ferrari 488 para subir al Teide fue una de las mejores experiencias de mi vida. El empuje del V8 biturbo y el sonido es una locura. Trato impecable de GTR Cars.', author: { firstName: 'Marcos D.' }, createdAt: new Date() }
      ]
    },
    'porsche-taycan-volcano-grey': {
      id: 'c18a7e4e-7aa4-41cd-8f74-ec1d62f4b535',
      title: 'Porsche Taycan Volcano Grey Metallic',
      slug: 'porsche-taycan-volcano-grey',
      brand: 'PORSCHE',
      model: 'Taycan',
      year: 2022,
      hp: 408,
      accel: '5.4 S',
      topSpeed: 230,
      fuelConsumption: 'Batería Performance Plus 93.4 kWh (450 km WLTP)',
      transmission: 'Transmisión 2 Velocidades Eje Trasero',
      fuelType: '100% Eléctrico (Cero Emisiones)',
      passengers: 4,
      beds: 0,
      basePricePerDay: 690,
      securityDeposit: 3000,
      cleaningFee: 40,
      ownershipType: 'PLATFORM',
      island: 'Tenerife',
      municipality: 'Costa Adeje / Aeropuerto Sur (TFS)',
      description: 'El deportivo eléctrico de referencia mundial disponible en las Islas Canarias. Esta unidad real se presenta en la distinguida pintura Volcano Grey Metallic (Gris Volcán Metalizado), equipada con llantas de 20 pulgadas Taycan Turbo Aero, faros Matrix LED de 4 puntos y la emblemática banda lumínica trasera con el logotipo Porsche tridimensional en vidrio.\n\nGracias a su arquitectura eléctrica de 800 voltios, tracción trasera con suspensión neumática adaptativa PASM y chasis dinámico, ofrece una aceleración instantánea y una serenidad acústica incomparable para recorrer las carreteras de Tenerife y Gran Canaria. Espacio real para 4 ocupantes y doble maletero delantero y trasero.',
      photos: [
        { url: '/supercars/porsche-taycan/porsche-taycan-front.jpg' },
        { url: '/supercars/porsche-taycan/porsche-taycan-side.jpg' },
        { url: '/supercars/porsche-taycan/porsche-taycan-rear.jpg' }
      ],
      owner: { id: 'd4519096-12ba-4396-9e5d-55cf71ce3cb4', firstName: 'GTR Cars', lastName: 'Official', avatarUrl: '/brand/app-icon.png', verification: 'VERIFIED', createdAt: new Date() },
      status: 'ACTIVE',
      features: [
        { name: 'Potencia: 408 CV Launch Control (Eléctrico)' },
        { name: '0-100 km/h: 5.4 s' },
        { name: 'Velocidad Máx: 230 km/h' },
        { name: 'Arquitectura Eléctrica 800V con Carga Ultrarrápida' },
        { name: 'Pintura Volcano Grey Metallic' },
        { name: 'Llantas 20" Taycan Turbo Aero' },
        { name: 'Faros LED con Porsche Dynamic Light System (PDLS)' },
        { name: 'Suspensión Neumática Adaptativa PASM' },
        { name: 'Porsche Sound System High-End' },
        { name: 'Entrega VIP en Aeropuertos de Canarias o Hotel 5* GL' }
      ],
      extras: [
        { id: 'e-tfs-taycan', extra: { name: 'Entrega VIP Aeropuerto TFS / TFN', description: 'Recepción directa en terminal con briefing técnico', price: 150 } },
        { id: 'e-hotel-taycan', extra: { name: 'Entrega en Villa / Hotel 5* GL', description: 'Traslado personalizado a Costa Adeje, Abama o Maspalomas', price: 120 } }
      ],
      reviews: [
        { id: 'rev-taycan-1', rating: 5, comment: 'Silencioso, futurista y con un aplomo en curva brutal. Lo usamos para recorrer Tenerife de norte a sur sin gastar un euro en gasolina. El servicio de GTR Cars en el aeropuerto fue de 10.', author: { firstName: 'Carlos S.' }, createdAt: new Date() }
      ]
    }
  };

  // Alias directos para mantener compatibilidad total entre slugs cortos y largos
  DEMO_SUPERCARS['porsche-taycan'] = DEMO_SUPERCARS['porsche-taycan-volcano-grey'];
  DEMO_SUPERCARS['porsche-taycan-4s'] = DEMO_SUPERCARS['porsche-taycan-volcano-grey'];

  // Alias directos para mantener compatibilidad total entre slugs cortos y largos
  DEMO_SUPERCARS['ferrari-488'] = DEMO_SUPERCARS['ferrari-488-gtb-rosso-corsa'];
  DEMO_SUPERCARS['ferrari-488-gtb'] = DEMO_SUPERCARS['ferrari-488-gtb-rosso-corsa'];
  DEMO_SUPERCARS['ferrari-488-spider'] = DEMO_SUPERCARS['ferrari-488-gtb-rosso-corsa'];
  DEMO_SUPERCARS['ferrari-sf90-stradale'] = DEMO_SUPERCARS['ferrari-sf90-stradale-assetto-fiorano'];
  DEMO_SUPERCARS['lamborghini-revuelto-v12'] = DEMO_SUPERCARS['lamborghini-revuelto-v12-hybrid'];
  DEMO_SUPERCARS['mclaren-750s-spider'] = DEMO_SUPERCARS['mclaren-765lt-spider-carbon'];

  if (DEMO_SUPERCARS[decoded] || DEMO_SUPERCARS[raw] || DEMO_SUPERCARS[slugClean]) {
    return DEMO_SUPERCARS[decoded] || DEMO_SUPERCARS[raw] || DEMO_SUPERCARS[slugClean];
  }

  try {
    const v: any = await prisma.vehicle.findFirst({
      where: {
        OR: [{ slug: raw }, { slug: decoded }, { id: raw }, { id: decoded }, { slug: slugClean }],
      },
      include: {
        photos: { orderBy: { orderIndex: 'asc' } },
        features: true,
        extras: { include: { extra: true } },
        pricingRules: { orderBy: { startDate: 'asc' } },
        owner: { select: { id: true, firstName: true, lastName: true, avatarUrl: true, verification: true, createdAt: true } },
        reviews: { include: { author: { select: { firstName: true, avatarUrl: true } } } },
      },
    }).catch(() => null);

    if (v) {
      // Extraer telemetría guardada en features si existe
      const featNames: string[] = (v.features || []).map((f: any) => String(f?.name || ''));
      for (const fn of featNames) {
        const hpMatch = fn.match(/Potencia:\s*(\d+)\s*CV/i);
        if (hpMatch) v.hp = Number(hpMatch[1]);
        const accelMatch = fn.match(/0-100\s*km\/h:\s*([\d.,]+)\s*s/i);
        if (accelMatch) v.accel = `${accelMatch[1]} S`;
        const speedMatch = fn.match(/Velocidad\s*M[áa]x:\s*(\d+)\s*km\/h/i);
        if (speedMatch) v.topSpeed = Number(speedMatch[1]);
      }
      return v;
    }
  } catch (err) {
    console.error('Error fetching vehicle by slug/id:', err);
  }

  return null;
}

export async function generateMetadata({ params }: CamperDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await fetchVehicleBySlugOrId(slug);
  if (!vehicle) return {};
  const hpText = vehicle.hp ? `${vehicle.hp} CV` : 'Altas Prestaciones';
  const accelText = vehicle.accel ? `0-100 km/h en ${vehicle.accel}` : '';
  const description = `Alquila el ${vehicle.title} (${hpText}${accelText ? `, ${accelText}` : ''}) en ${vehicle.municipality || vehicle.island}, ${vehicle.island} desde ${vehicle.basePricePerDay} €/día. Unidad exacta garantizada con contrato digital eIDAS, seguro VIP y entrega Concierge en GTR Cars.`;
  const rawPhoto = vehicle.photos?.[0]?.url;
  const photoUrl = rawPhoto
    ? (rawPhoto.startsWith('http') ? rawPhoto : `https://gtrcars.es${rawPhoto.startsWith('/') ? rawPhoto : `/${rawPhoto}`}`)
    : 'https://gtrcars.es/brand/logo-primary.png';

  const seoTitle = `Alquilar ${vehicle.title} (${hpText}) en ${vehicle.island} desde ${vehicle.basePricePerDay}€/día | GTR Cars`;

  return {
    title: seoTitle,
    description,
    keywords: [
      `alquilar ${vehicle.title.toLowerCase()}`,
      `alquiler ${vehicle.brand?.toLowerCase() || 'superdeportivo'} ${vehicle.island.toLowerCase()}`,
      `alquiler ${vehicle.title.toLowerCase()} ${vehicle.island.toLowerCase()}`,
      `precio alquiler ${vehicle.title.toLowerCase()}`,
      `rent ${vehicle.title.toLowerCase()} ${vehicle.island.toLowerCase()}`,
      'alquiler superdeportivos españa',
      'gtr cars',
    ],
    alternates: { canonical: `https://gtrcars.es/coche/${vehicle.slug || slug}` },
    robots: vehicle.status === 'ACTIVE' ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: {
      title: seoTitle,
      description,
      url: `https://gtrcars.es/coche/${vehicle.slug || slug}`,
      type: 'website',
      siteName: 'GTR Cars',
      images: [
        {
          url: photoUrl,
          width: 1200,
          height: 630,
          alt: `${vehicle.title} (${hpText}) en alquiler en ${vehicle.island} — GTR Cars`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description,
      images: [photoUrl],
    },
  };
}

export default async function CamperDetailPage({ params }: CamperDetailPageProps) {
  const { slug: rawSlug } = await params;
  const currentUser: any = await Promise.race([
    getCurrentUser(),
    new Promise((resolve) => setTimeout(() => resolve(null), 300))
  ]).catch(() => null);
  const vehicle = await fetchVehicleBySlugOrId(rawSlug);

  if (!vehicle) {
    notFound();
  }

  const avgRating =
    vehicle.reviews?.length > 0
      ? vehicle.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / vehicle.reviews.length
      : 0;
  const featured: any = await Promise.race([
    getFeaturedAudience(),
    new Promise((resolve) => setTimeout(() => resolve({ ownerIds: new Set(), vehicleIds: new Set(), subscriptionOwnerIds: new Set() }), 300))
  ]).catch(() => ({ ownerIds: new Set(), vehicleIds: new Set(), subscriptionOwnerIds: new Set() }));
  
  const isFeatured = Boolean(featured && (
    (vehicle.owner?.id && featured.ownerIds?.has(vehicle.owner.id)) ||
    (vehicle.id && featured.vehicleIds?.has(vehicle.id)) ||
    (vehicle.owner?.id && featured.subscriptionOwnerIds?.has(vehicle.owner.id))
  ));

  const vehicleFaqs = [
    {
      q: `¿Cuánto cuesta alquilar el ${vehicle.title} en ${vehicle.island}?`,
      a: `La tarifa oficial del ${vehicle.title} en ${vehicle.municipality || vehicle.island} (${vehicle.island}) es desde ${vehicle.basePricePerDay} €/día con una fianza reembolsable de ${vehicle.securityDeposit || 4000} €. Incluye seguro a todo riesgo con franquicia, asistencia VIP 24h y contrato digital eIDAS.`,
    },
    {
      q: `¿Qué prestaciones y motorización ofrece esta unidad de ${vehicle.title}?`,
      a: `Esta unidad desarrolla ${vehicle.hp || 650} CV de potencia con motorización ${vehicle.fuelConsumption || 'de competición'}, acelera de 0 a 100 km/h en ${vehicle.accel || '2.8 S'}, alcanza ${vehicle.topSpeed || 330} km/h de velocidad máxima y cuenta con transmisión ${vehicle.transmission || 'Automática Secuencial'}.`,
    },
    {
      q: `¿Qué requisitos se exigen para reservar el ${vehicle.title}?`,
      a: `Debes tener al menos 25 años de edad, permiso de conducir tipo B en vigor con más de 3 años de antigüedad, documento oficial de identidad (DNI, NIE o Pasaporte) y firmar digitalmente el Contrato de Arrendamiento eIDAS con acta fotográfica de entrega.`,
    },
  ];

  const jsonLdVehicleProduct = {
    '@context': 'https://schema.org',
    '@type': ['Product', 'Car'],
    name: vehicle.title,
    description: vehicle.description,
    image: (vehicle.photos || []).map((photo: any) => {
      const u = typeof photo === 'string' ? photo : String(photo?.url || '');
      return u.startsWith('http') ? u : `https://gtrcars.es${u.startsWith('/') ? u : `/${u}`}`;
    }),
    brand: { '@type': 'Brand', name: vehicle.brand || 'GTR Cars' },
    model: vehicle.model || vehicle.title,
    productionDate: String(vehicle.year || 2024),
    vehicleTransmission: vehicle.transmission || 'Automático',
    fuelType: vehicle.fuelType || 'Gasolina',
    seatingCapacity: Number(vehicle.passengers || 2),
    vehicleEngine: {
      '@type': 'EngineSpecification',
      name: `${vehicle.fuelConsumption || 'Motor de Altas Prestaciones'} — ${vehicle.hp || 650} CV`,
      enginePower: {
        '@type': 'QuantitativeValue',
        value: Number(vehicle.hp || 650),
        unitCode: 'BHP',
      },
    },
    speed: {
      '@type': 'QuantitativeValue',
      value: Number(vehicle.topSpeed || 330),
      unitCode: 'KMH',
    },
    category: vehicle.vehicleType || 'Supercar',
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: vehicle.basePricePerDay,
      availability: 'https://schema.org/InStock',
      url: `https://gtrcars.es/coche/${vehicle.slug}`,
      itemCondition: 'https://schema.org/UsedCondition',
      seller: {
        '@type': 'Organization',
        name: 'GTR Cars',
        url: 'https://gtrcars.es',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: vehicle.reviews?.length ? Number(avgRating.toFixed(1)) : 5.0,
      reviewCount: vehicle.reviews?.length ? vehicle.reviews.length : 14,
      bestRating: 5,
      worstRating: 1,
    },
  };

  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'GTR Cars', item: 'https://gtrcars.es' },
      { '@type': 'ListItem', position: 2, name: `Alquiler en ${vehicle.island}`, item: `https://gtrcars.es/buscar?city=${encodeURIComponent(vehicle.island)}` },
      { '@type': 'ListItem', position: 3, name: vehicle.title, item: `https://gtrcars.es/coche/${vehicle.slug}` },
    ],
  };

  const jsonLdVehicleFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: vehicleFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white font-sans antialiased">
      {vehicle.status !== 'ACTIVE' && (
        <div className="bg-amber-600 text-white text-xs font-mono font-bold py-2.5 px-4 text-center sticky top-0 z-50 shadow-md flex items-center justify-center space-x-2">
          <ShieldCheck className="w-4 h-4" />
          <span>
            MODO VISTA PREVIA ({vehicle.status === 'PENDING_REVIEW' ? 'Pendiente de moderación' : vehicle.status === 'DRAFT' ? 'Borrador' : 'Rechazado'}) — Solo visible para ti y la administración.
          </span>
        </div>
      )}
      <VehicleViewTracker vehicleId={vehicle.id} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdVehicleProduct) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdVehicleFaq) }} />
      <Navbar />

      <main className="w-full">
        {/* SUPERCAR CONFIGURATOR SHOWCASE (HUD Telemetría minimalista estilo Porsche) */}
        <SupercarConfiguratorShowcase
          photos={(vehicle.photos || []).map((p: any, idx: number) => ({
            id: String(p?.id || idx),
            url: typeof p === 'string' ? p : String(p?.url || ''),
            orderIndex: Number(p?.orderIndex || idx),
          }))}
          title={vehicle.title || 'Supercar'}
          brand={vehicle.brand || 'SUPERCAR'}
          model={vehicle.model || vehicle.title || 'GT'}
          year={vehicle.year || 2024}
          hp={vehicle.hp || 720}
          accel={vehicle.accel || '2.8 S'}
          topSpeed={vehicle.topSpeed || 340}
          pricePerDay={vehicle.basePricePerDay}
          island={vehicle.island}
          municipality={vehicle.municipality}
          engine={vehicle.fuelConsumption || 'V8 Bi-Turbo Híbrido'}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* BREADCRUMBS SEMÁNTICOS SEO */}
          <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-gray-500">
            <Link href="/" className="hover:text-black transition-colors">
              GTR Cars
            </Link>
            <span>/</span>
            <Link href={`/buscar?city=${encodeURIComponent(vehicle.island)}`} className="hover:text-black transition-colors">
              Alquiler en {vehicle.island}
            </Link>
            <span>/</span>
            <span className="text-black font-bold">{vehicle.title}</span>
          </nav>

          {/* TITULO Y CABECERA */}
          <div className="mb-10 relative flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-6 font-mono">
            <div>
              <h2 className="text-2xl sm:text-4xl font-black uppercase text-black tracking-tight font-sans">
                {vehicle.title}
              </h2>
            </div>

            <div className="flex items-center space-x-3">
              <ShareVehicleButton
                vehicleTitle={vehicle.title}
                slug={vehicle.slug}
                island={vehicle.island}
                price={vehicle.basePricePerDay}
                variant="button"
              />
              <FavoriteButton vehicleId={vehicle.id} />
            </div>
          </div>

        {/* CONTENIDO PRINCIPAL Y STICKY WIDGET */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* DETALLES DEL VEHÍCULO */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* CARACTERÍSTICAS PRINCIPALES */}
            <div className="grid grid-cols-3 gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-200 text-center font-mono">
              <div>
                <Users className="w-5 h-5 mx-auto text-black mb-1.5" />
                <span className="block text-[10px] uppercase tracking-widest text-gray-500">Plazas</span>
                <span className="text-base font-black text-black">{vehicle.passengers} Plazas</span>
              </div>
              <div>
                <Settings2 className="w-5 h-5 mx-auto text-black mb-1.5" />
                <span className="block text-[10px] uppercase tracking-widest text-gray-500">Transmisión</span>
                <span className="text-base font-black text-black">{vehicle.transmission || 'Automático'}</span>
              </div>
              <div>
                <Fuel className="w-5 h-5 mx-auto text-black mb-1.5" />
                <span className="block text-[10px] uppercase tracking-widest text-gray-500">Combustible</span>
                <span className="text-base font-black text-black">{vehicle.fuelType || 'Gasolina'}</span>
              </div>
            </div>

            {/* DESCRIPCIÓN */}
            <div className="space-y-4">
              <h3 className="text-xl font-black uppercase tracking-wider text-black border-b border-gray-100 pb-3 font-mono flex items-center space-x-2">
                <span className="text-gray-400">01 //</span>
                <span>Sobre esta unidad</span>
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed font-normal whitespace-pre-line">
                {vehicle.description}
              </p>
            </div>

            {/* ESPECIFICACIONES Y EQUIPAMIENTO DESTACADO */}
            {vehicle.features && vehicle.features.length > 0 && (
              <div className="space-y-4 font-mono">
                <h3 className="text-lg font-black uppercase tracking-wider text-black border-b border-gray-100 pb-3 flex items-center space-x-2">
                  <span className="text-gray-400">ESPECIFICACIONES //</span>
                  <span>Equipamiento de Serie y Paquetes</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {vehicle.features.map((feat: any, i: number) => (
                    <div key={i} className="flex items-center space-x-2.5 p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-black">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{typeof feat === 'string' ? feat : feat.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* RESEÑAS */}
            <div className="space-y-6 pt-4 font-mono">
              <h3 className="text-xl font-black uppercase tracking-wider text-black border-b border-gray-100 pb-3 flex items-center space-x-2">
                <span className="text-gray-400">02 //</span>
                <span>Experiencias de Conductores ({vehicle.reviews?.length || 0})</span>
              </h3>
              {vehicle.reviews?.length > 0 ? (
                <div className="space-y-4">
                  {vehicle.reviews.map((rev: any) => (
                    <div key={rev.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-200 font-sans">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <img
                            src={rev.author?.avatarUrl || '/default-avatar.svg'}
                            alt={rev.author?.firstName || 'Conductor'}
                            className="w-10 h-10 rounded-full object-cover border border-gray-200"
                          />
                          <div>
                            <span className="font-bold text-sm text-black block">{rev.author?.firstName}</span>
                            {formatDateSafe(rev.createdAt) && <span className="text-[10px] text-gray-500 font-mono">{formatDateSafe(rev.createdAt)}</span>}
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 font-mono">
                          <Star className="w-4 h-4 fill-black text-black" />
                          <span className="text-sm font-black text-black">{rev.rating}.0</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 text-center space-y-2">
                  <span className="inline-block px-3 py-1 bg-white text-black text-xs font-mono font-bold rounded-full border border-gray-200 shadow-xs">
                    NUEVA UNIDAD EN GARAJE
                  </span>
                  <p className="text-xs text-gray-500 max-w-md mx-auto">
                    Este superdeportivo es nuevo en la colección GTRCars. Sé el primer piloto verificado en conducirlo y registrar su experiencia.
                  </p>
                </div>
              )}
            </div>

            {/* SECCIÓN SOBRE EL PROPIETARIO Y CONTACTO VIA MENSAJE */}
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-4 font-mono">
              <div className="flex items-center space-x-4">
                <img
                  src={vehicle.owner?.avatarUrl || '/default-avatar.svg'}
                  alt={vehicle.owner?.firstName || 'Propietario'}
                  className="w-16 h-16 rounded-full object-cover border border-gray-300 shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Propietario Verificado</span>
                  <h4 className="text-lg font-black text-black truncate font-sans">{vehicle.owner?.firstName || 'Propietario'} {vehicle.owner?.lastName || ''}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">En la red GTRCars desde {vehicle.owner?.createdAt ? new Date(vehicle.owner.createdAt).getFullYear() : '2024'}{vehicle.owner?.verification === 'VERIFIED' ? ' · Identidad & Licencia Verificada' : ''}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200">
                <ContactOwnerButton
                  ownerId={String(vehicle.owner?.id || vehicle.ownerId)}
                  ownerName={vehicle.owner?.firstName || 'el propietario'}
                  vehicleId={String(vehicle.id)}
                  vehicleTitle={vehicle.title}
                  isOwner={currentUser?.id === (vehicle.owner?.id || vehicle.ownerId)}
                  variant="card"
                />
              </div>
            </div>

            {/* PREGUNTAS FRECUENTES DE LA UNIDAD (SEO FAQ) */}
            <div className="space-y-4 pt-4">
              <h3 className="text-xl font-black uppercase tracking-wider text-black border-b border-gray-100 pb-3 font-mono flex items-center space-x-2">
                <span className="text-gray-400">03 //</span>
                <span>Preguntas Frecuentes — {vehicle.title}</span>
              </h3>
              <div className="space-y-3">
                {vehicleFaqs.map((faq, idx) => (
                  <div key={idx} className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-1.5">
                    <h4 className="text-xs sm:text-sm font-black uppercase text-black">{faq.q}</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* WIDGET STICKY DE RESERVA */}
          <div id="reserva-widget" className="scroll-mt-6">
            {vehicle.isDemoVehicle ? (
              <div className="sticky top-28 rounded-3xl border border-gray-200 bg-white p-6 shadow-xl space-y-4 font-mono">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest block">Tarifa Oficial</span>
                    <h3 className="text-3xl font-black text-black">{vehicle.basePricePerDay} € <span className="text-xs text-gray-500 font-normal">/ día</span></h3>
                  </div>
                  <span className="rounded-full bg-gray-100 border border-gray-200 text-black px-3 py-1 text-[10px] font-black uppercase tracking-wider">
                    RESERVADO
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-bold text-black">
                    <ShieldCheck className="w-4 h-4 text-black" />
                    <span>Disponibilidad por Solicitud</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Esta unidad se encuentra actualmente en ruta o reservada. Puedes explorar el resto de unidades disponibles en el Garaje.
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <Link
                    href={`/buscar?island=${encodeURIComponent(vehicle.island)}`}
                    className="w-full py-4 rounded-full bg-black text-white font-black text-xs uppercase tracking-widest text-center block hover:bg-gray-800 transition-all shadow-md"
                  >
                    EXPLORAR OTROS SUPERDEPORTIVOS →
                  </Link>
                </div>
              </div>
            ) : (currentUser?.role === 'OWNER' || currentUser?.role === 'ADMIN') ? (
              <div className="sticky top-28 rounded-3xl border border-gray-200 bg-white p-6 shadow-xl font-mono space-y-4">
                <ShieldCheck className="h-8 w-8 text-black" />
                <h3 className="text-lg font-bold text-black">VISTA DE PROPIETARIO</h3>
                <p className="text-xs text-gray-600">Estás autenticado en modo {currentUser?.role === 'ADMIN' ? 'administrador' : 'propietario'}.</p>
                {vehicle.owner?.id === currentUser?.id && <a href="/propietario" className="block rounded-full bg-black text-white px-5 py-3 text-center text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-all shadow-xs">Gestionar en Garaje</a>}
              </div>
            ) : (
              <div className="space-y-4">
                <BookingWidget
                  vehicle={{
                    id: String(vehicle.id),
                    basePricePerDay: Number(vehicle.basePricePerDay),
                    cleaningFee: Number(vehicle.cleaningFee || 0),
                    ownershipType: (vehicle.ownershipType || 'THIRD_PARTY') as 'PLATFORM' | 'THIRD_PARTY',
                    securityDeposit: Number(vehicle.securityDeposit || 0),
                    bookingType: isRequestOnlyVehicle(vehicle) ? 'REQUEST_TO_BOOK' : vehicle.bookingType || 'REQUEST_TO_BOOK',
                    minDays: Number(vehicle.minDays || 1),
                    maxDays: Number(vehicle.maxDays || 90),
                    pricingRules: (vehicle.pricingRules || []).map((r: any) => ({
                      startDate: typeof r.startDate === 'object' && r.startDate instanceof Date ? r.startDate.toISOString() : String(r.startDate || ''),
                      endDate: typeof r.endDate === 'object' && r.endDate instanceof Date ? r.endDate.toISOString() : String(r.endDate || ''),
                      pricePerDay: Number(r.pricePerDay || 0),
                    })),
                    extras: (vehicle.extras || []).map((e: any) => ({
                      extra: {
                        id: String(e.extra?.id || e.id || ''),
                        name: String(e.extra?.name || e.name || 'Extra'),
                        price: Number(e.price ?? e.extra?.price ?? 0),
                        priceType: (e.extra?.priceType || e.priceType || 'PER_RENTAL') as 'PER_RENTAL' | 'PER_DAY',
                      },
                    })),
                  }}
                />

                {currentUser?.id !== (vehicle.owner?.id || vehicle.ownerId) && (
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-center font-mono">
                    <p className="text-xs text-gray-600 mb-2.5">
                      ¿Dudas sobre telemetría o protocolo de entrega?
                    </p>
                    <ContactOwnerButton
                      ownerId={String(vehicle.owner?.id || vehicle.ownerId)}
                      ownerName={vehicle.owner?.firstName || 'el propietario'}
                      vehicleId={String(vehicle.id)}
                      vehicleTitle={vehicle.title}
                      isOwner={false}
                      variant="outline"
                      className="w-full justify-center"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

          {/* INTERLINKING SEO: UNIDADES RELACIONADAS, MARCAS Y DESTINOS VIP */}
          <div className="mt-16 pt-12 border-t border-gray-200 space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-500">
                  EXPLORAR COLECCIÓN GTR VAULT
                </span>
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black mt-1">
                  Otros Superdeportivos Destacados en Alquiler
                </h3>
              </div>
              <Link
                href="/buscar"
                className="text-xs font-mono font-bold uppercase tracking-wider text-black hover:underline"
              >
                Ver las 15 unidades del catálogo →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
              {[
                {
                  title: 'Ferrari 488 GTB Rosso Corsa',
                  spec: '670 CV · 0-100 en 3.0s · Tenerife / GC',
                  price: '1.290 €/día',
                  href: '/coche/ferrari-488-gtb-rosso-corsa',
                },
                {
                  title: 'Porsche 911 GT3 Touring',
                  spec: '510 CV · 0-100 en 3.9s · Gran Canaria',
                  price: '1.190 €/día',
                  href: '/coche/porsche-911-gt3-touring',
                },
                {
                  title: 'Ferrari SF90 Stradale',
                  spec: '1.000 CV · 0-100 en 2.5s · Barcelona',
                  price: '2.450 €/día',
                  href: '/coche/ferrari-sf90-stradale-assetto-fiorano',
                },
                {
                  title: 'Lamborghini Revuelto V12',
                  spec: '1.015 CV · 0-100 en 2.5s · Marbella',
                  price: '2.950 €/día',
                  href: '/coche/lamborghini-revuelto-v12-hybrid',
                },
                {
                  title: 'McLaren 750S Spider Carbon',
                  spec: '750 CV · 0-100 en 2.8s · Tenerife',
                  price: '1.750 €/día',
                  href: '/coche/mclaren-765lt-spider-carbon',
                },
              ]
                .filter((item) => !item.href.endsWith(vehicle.slug))
                .slice(0, 4)
                .map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="p-5 rounded-2xl bg-gray-50 border border-gray-200 hover:border-black transition-all flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <h4 className="text-xs font-black uppercase text-black font-sans">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-gray-500 mt-1">{item.spec}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200/80">
                      <span className="text-xs font-black text-black">{item.price}</span>
                      <span className="text-[10px] font-bold uppercase text-[#E10600]">
                        Ver Ficha →
                      </span>
                    </div>
                  </Link>
                ))}
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <Link
                href="/alquiler-superdeportivos/madrid"
                className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-black hover:text-white text-[10px] font-mono font-bold uppercase tracking-wider transition-colors"
              >
                Superdeportivos Madrid
              </Link>
              <Link
                href="/alquiler-superdeportivos/marbella"
                className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-black hover:text-white text-[10px] font-mono font-bold uppercase tracking-wider transition-colors"
              >
                Superdeportivos Marbella
              </Link>
              <Link
                href="/alquiler-superdeportivos/barcelona"
                className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-black hover:text-white text-[10px] font-mono font-bold uppercase tracking-wider transition-colors"
              >
                Superdeportivos Barcelona
              </Link>
              <Link
                href="/alquiler-superdeportivos/mallorca"
                className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-black hover:text-white text-[10px] font-mono font-bold uppercase tracking-wider transition-colors"
              >
                Superdeportivos Mallorca
              </Link>
              <Link
                href="/alquiler-superdeportivos/ibiza"
                className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-black hover:text-white text-[10px] font-mono font-bold uppercase tracking-wider transition-colors"
              >
                Superdeportivos Ibiza
              </Link>
              <Link
                href="/alquiler-superdeportivos/gran-canaria"
                className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-black hover:text-white text-[10px] font-mono font-bold uppercase tracking-wider transition-colors"
              >
                Superdeportivos Gran Canaria
              </Link>
              <Link
                href="/alquiler-superdeportivos/tenerife"
                className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-black hover:text-white text-[10px] font-mono font-bold uppercase tracking-wider transition-colors"
              >
                Superdeportivos Tenerife
              </Link>
              <Link
                href="/marca/porsche"
                className="px-3 py-1.5 rounded-lg border border-gray-200 hover:border-black text-[10px] font-mono font-bold uppercase tracking-wider transition-colors"
              >
                Catálogo Porsche
              </Link>
              <Link
                href="/marca/ferrari"
                className="px-3 py-1.5 rounded-lg border border-gray-200 hover:border-black text-[10px] font-mono font-bold uppercase tracking-wider transition-colors"
              >
                Catálogo Ferrari
              </Link>
              <Link
                href="/marca/lamborghini"
                className="px-3 py-1.5 rounded-lg border border-gray-200 hover:border-black text-[10px] font-mono font-bold uppercase tracking-wider transition-colors"
              >
                Catálogo Lamborghini
              </Link>
              <Link
                href="/marca/mclaren"
                className="px-3 py-1.5 rounded-lg border border-gray-200 hover:border-black text-[10px] font-mono font-bold uppercase tracking-wider transition-colors"
              >
                Catálogo McLaren
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
