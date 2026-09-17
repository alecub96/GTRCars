import React from 'react';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
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
    'lamborghini-revuelto-v12-hybrid': {
      id: '1',
      title: 'Lamborghini Revuelto V12 Hybrid',
      slug: 'lamborghini-revuelto-v12-hybrid',
      brand: 'LAMBORGHINI',
      model: 'REVUELTO',
      year: 2025,
      hp: 1015,
      accel: '2.5 S',
      topSpeed: 350,
      fuelConsumption: '6.5L V12 + 3 Motores Eléctricos',
      transmission: '8 Vel Doble Embrague',
      fuelType: 'Híbrido Enchufable',
      passengers: 2,
      beds: 0,
      basePricePerDay: 3200,
      securityDeposit: 9000,
      island: 'Madrid',
      municipality: 'La Moraleja',
      description: 'El primer HPEV (High Performance Electrified Vehicle) de Lamborghini. 1015 CV de potencia combinada entre su motor V12 atmosférico de 6.5 litros y tres motores de flujo axial. Monocasco de fibra de carbono "monofuselage" y chasis activo.',
      photos: [{ url: '/supercars/lambo-revuelto.jpg' }, { url: '/supercars/huracan-sto.jpg' }],
      owner: { id: 'o-1', firstName: 'Carlos', lastName: 'M.', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80', verification: 'VERIFIED', createdAt: new Date() },
      status: 'ACTIVE',
      features: [{ name: 'Frenos Carbono-Cerámicos CCB Plus' }, { name: 'Launch Control e-AWD' }, { name: 'Escape Deportivo Inconel' }, { name: 'Interior Alcántara & Carbono' }],
      extras: [{ id: 'e-1', extra: { name: 'Entrega en Helipuerto / Villa', description: 'Transporte cerrado en plataforma protegida', price: 250 } }],
      reviews: [{ id: 'r-1', rating: 5, comment: 'Una auténtica bestia. La entrega de Carlos fue impecable con todas las instrucciones de los modos Corsa y Città.', author: { firstName: 'Alejandro' }, createdAt: new Date() }]
    },
    'ferrari-sf90-stradale-assetto-fiorano': {
      id: '2',
      title: 'Ferrari SF90 Stradale Assetto Fiorano',
      slug: 'ferrari-sf90-stradale-assetto-fiorano',
      brand: 'FERRARI',
      model: 'SF90 STRADALE',
      year: 2024,
      hp: 1000,
      accel: '2.5 S',
      topSpeed: 340,
      fuelConsumption: '4.0L V8 Twin-Turbo PHEV',
      transmission: 'F1 Doble Embrague 8 Vel',
      fuelType: 'Híbrido',
      passengers: 2,
      beds: 0,
      basePricePerDay: 2900,
      securityDeposit: 8000,
      island: 'Barcelona',
      municipality: 'Pedralbes',
      description: 'La cumbre de Maranello: 1000 CV con tracción total e-4WD y paquete aligerado Assetto Fiorano con amortiguadores Multimatic de competición derivados de GT y alerón de fibra de carbono de alta carga.',
      photos: [{ url: '/supercars/ferrari-sf90.jpg' }, { url: '/supercars/ferrari-296.jpg' }],
      owner: { id: 'o-2', firstName: 'Javier', lastName: 'V.', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80', verification: 'VERIFIED', createdAt: new Date() },
      status: 'ACTIVE',
      features: [{ name: 'Paquete Assetto Fiorano' }, { name: 'Amortiguadores Multimatic GT' }, { name: 'Llantas de Carbono MSO' }],
      extras: [{ id: 'e-2', extra: { name: 'Pase a Paddock Circuito', description: 'Acceso reservado a boxes', price: 300 } }],
      reviews: []
    },
    'porsche-911-gt3-rs-weissach': {
      id: '3',
      title: 'Porsche 911 GT3 RS Weissach',
      slug: 'porsche-911-gt3-rs-weissach',
      brand: 'PORSCHE',
      model: '911 GT3 RS',
      year: 2024,
      hp: 525,
      accel: '3.2 S',
      topSpeed: 296,
      fuelConsumption: '4.0L Boxer 6 Atmosférico 9000 RPM',
      transmission: 'PDK 7 Velocidades',
      fuelType: 'Gasolina',
      passengers: 2,
      beds: 0,
      basePricePerDay: 1850,
      securityDeposit: 5000,
      island: 'Madrid',
      municipality: 'Jarama',
      description: 'Aerodinámica extrema con DRS hidráulico activo, radiador central de competición y motor atmosférico de 4 litros que aúlla hasta las 9.000 rpm.',
      photos: [{ url: '/supercars/porsche-gt3rs.jpg' }],
      owner: { id: 'o-3', firstName: 'Marcos', lastName: 'R.', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80', verification: 'VERIFIED', createdAt: new Date() },
      status: 'ACTIVE',
      features: [{ name: 'Paquete Weissach Carbono' }, { name: 'Sistema DRS Activo' }, { name: 'Jaula Antivuelco Titanio' }],
      extras: [],
      reviews: []
    },
    'mclaren-765lt-spider-carbon': {
      id: '4',
      title: 'McLaren 765LT Spider MSO',
      slug: 'mclaren-765lt-spider-carbon',
      brand: 'MCLAREN',
      model: '765LT SPIDER',
      year: 2024,
      hp: 765,
      accel: '2.8 S',
      topSpeed: 330,
      fuelConsumption: '4.0L V8 Twin-Turbo',
      transmission: 'SSG 7 Velocidades',
      fuelType: 'Gasolina',
      passengers: 2,
      beds: 0,
      basePricePerDay: 2400,
      securityDeposit: 7500,
      island: 'Tenerife',
      municipality: 'Costa Adeje',
      description: 'Longtail descapotable: fibra de carbono al descubierto, 4 salidas de escape de titanio con sonido ensordecedor y aceleración pura.',
      photos: [{ url: '/supercars/mclaren-765lt.jpg' }],
      owner: { id: 'o-4', firstName: 'Alejandro', lastName: 'G.', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80', verification: 'VERIFIED', createdAt: new Date() },
      status: 'ACTIVE',
      features: [{ name: 'Cuádruple Escape Titanio' }, { name: 'Carbon Fiber Body Pack' }, { name: 'Frenos Senna MSO' }],
      extras: [],
      reviews: []
    },
    'lamborghini-huracan-sto': {
      id: '5',
      title: 'Lamborghini Huracán STO Squadra Corse',
      slug: 'lamborghini-huracan-sto',
      brand: 'LAMBORGHINI',
      model: 'HURACÁN STO',
      year: 2024,
      hp: 640,
      accel: '3.0 S',
      topSpeed: 310,
      fuelConsumption: '5.2L V10 Atmosférico',
      transmission: 'LDF 7 Velocidades',
      fuelType: 'Gasolina',
      passengers: 2,
      beds: 0,
      basePricePerDay: 1950,
      securityDeposit: 6000,
      island: 'Madrid',
      municipality: 'Pozuelo',
      description: 'Super Trofeo Omologata: un coche de carreras homologado para la calle con el motor V10 atmosférico más rabioso y "cofango" delantero de fibra de carbono de una sola pieza.',
      photos: [{ url: '/supercars/huracan-sto.jpg' }],
      owner: { id: 'o-5', firstName: 'Raúl', lastName: 'S.', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', verification: 'VERIFIED', createdAt: new Date() },
      status: 'ACTIVE',
      features: [{ name: 'Cofango Carbono STO' }, { name: 'Alerón Ajustable Squadra Corse' }, { name: 'Telemetría Integrada' }],
      extras: [],
      reviews: []
    },
    'ferrari-296-gtb-assetto': {
      id: '6',
      title: 'Ferrari 296 GTB V6 Hybrid',
      slug: 'ferrari-296-gtb-assetto',
      brand: 'FERRARI',
      model: '296 GTB',
      year: 2024,
      hp: 830,
      accel: '2.9 S',
      topSpeed: 330,
      fuelConsumption: '3.0L V6 Turbo Híbrido 830 CV',
      transmission: 'F1 8 Velocidades',
      fuelType: 'Híbrido',
      passengers: 2,
      beds: 0,
      basePricePerDay: 2100,
      securityDeposit: 6500,
      island: 'Barcelona',
      municipality: 'Diagonal Mar',
      description: 'El "pequeño V12": sonido inolvidable con 830 CV de empuje instantáneo y agilidad de referencia en curvas gracias a su corta distancia entre ejes.',
      photos: [{ url: '/supercars/ferrari-296.jpg' }],
      owner: { id: 'o-6', firstName: 'Mateo', lastName: 'C.', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80', verification: 'VERIFIED', createdAt: new Date() },
      status: 'ACTIVE',
      features: [{ name: 'Sonido "Piccolo V12"' }, { name: 'E-Manettino Touch' }, { name: 'Frenos Carbono Brembo' }],
      extras: [],
      reviews: []
    },
    'aston-martin-dbs-superleggera': {
      id: '7',
      title: 'Aston Martin DBS Superleggera V12',
      slug: 'aston-martin-dbs-superleggera',
      brand: 'ASTON MARTIN',
      model: 'DBS SUPERLEGGERA',
      year: 2023,
      hp: 725,
      accel: '3.4 S',
      topSpeed: 340,
      fuelConsumption: '5.2L V12 Twin-Turbo 900 Nm',
      transmission: 'ZF 8 Velocidades',
      fuelType: 'Gasolina',
      passengers: 2,
      beds: 0,
      basePricePerDay: 1650,
      securityDeposit: 5000,
      island: 'Marbella',
      municipality: 'Puerto Banús',
      description: 'El Gran Turismo definitivo de Gaydon. Carrocería esculpida en fibra de carbono, motor V12 Biturbo con 900 Nm de par demoledor y confort de súper lujo.',
      photos: [{ url: '/supercars/aston-dbs.jpg' }],
      owner: { id: 'o-7', firstName: 'Ignacio', lastName: 'D.', avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80', verification: 'VERIFIED', createdAt: new Date() },
      status: 'ACTIVE',
      features: [{ name: 'Motor V12 Twin-Turbo 900Nm' }, { name: 'Interior Cuero Bridge of Weir' }, { name: 'Aeroblade II Carbono' }],
      extras: [],
      reviews: []
    },
    'mercedes-amg-gt-black-series': {
      id: '8',
      title: 'Mercedes-AMG GT Black Series',
      slug: 'mercedes-amg-gt-black-series',
      brand: 'MERCEDES-AMG',
      model: 'AMG GT BLACK SERIES',
      year: 2023,
      hp: 730,
      accel: '3.2 S',
      topSpeed: 325,
      fuelConsumption: '4.0L V8 Biturbo Flat-Plane',
      transmission: 'AMG SPEEDSHIFT DCT 7G',
      fuelType: 'Gasolina',
      passengers: 2,
      beds: 0,
      basePricePerDay: 2600,
      securityDeposit: 8000,
      island: 'Gran Canaria',
      municipality: 'Maspalomas',
      description: 'El récord de Nürburgring Nordschleife. Motor V8 con cigüeñal plano flat-plane, alerón biplano de carbono de ajuste manual y tracción ajustable de 9 niveles.',
      photos: [{ url: '/supercars/amg-black-series.jpg' }],
      owner: { id: 'o-8', firstName: 'David', lastName: 'M.', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', verification: 'VERIFIED', createdAt: new Date() },
      status: 'ACTIVE',
      features: [{ name: 'Cigüeñal Plano Flat-Plane' }, { name: 'AMG Traction Control 9 Modos' }, { name: 'Aerodinámica de Carbono Activa' }],
      extras: [],
      reviews: []
    }
  };

  if (DEMO_SUPERCARS[decoded] || DEMO_SUPERCARS[raw] || DEMO_SUPERCARS[slugClean]) {
    return DEMO_SUPERCARS[decoded] || DEMO_SUPERCARS[raw] || DEMO_SUPERCARS[slugClean];
  }

  try {
    const v: any = await prisma.vehicle.findFirst({
      where: {
        status: 'ACTIVE',
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

    if (v) return v;
  } catch (err) {
    console.error('Error fetching vehicle by slug/id:', err);
  }

  return null;
}

export async function generateMetadata({ params }: CamperDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await fetchVehicleBySlugOrId(slug);
  if (!vehicle) return {};
  const description = `Alquila ${vehicle.title} en ${vehicle.municipality || 'Canarias'}, ${vehicle.island} desde ${vehicle.basePricePerDay}€/día. Directo entre particulares con contrato digital e identidad verificada.`;
  const rawPhoto = vehicle.photos?.[0]?.url;
  const photoUrl = rawPhoto
    ? (rawPhoto.startsWith('http') ? rawPhoto : `https://vaneando.com${rawPhoto.startsWith('/') ? rawPhoto : `/${rawPhoto}`}`)
    : 'https://vaneando.com/og-image.png';

  return {
    title: `${vehicle.title} en ${vehicle.island} desde ${vehicle.basePricePerDay}€/día | vaneando.`,
    description,
    alternates: { canonical: `https://vaneando.com/camper/${vehicle.slug || slug}` },
    robots: vehicle.status === 'ACTIVE' ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: {
      title: `${vehicle.title} en ${vehicle.island} desde ${vehicle.basePricePerDay}€/día`,
      description,
      url: `https://vaneando.com/camper/${vehicle.slug || slug}`,
      images: [
        {
          url: photoUrl,
          alt: vehicle.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${vehicle.title} en ${vehicle.island} desde ${vehicle.basePricePerDay}€/día`,
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

  const jsonLdVehicleProduct = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: vehicle.title,
    description: vehicle.description,
    image: (vehicle.photos || []).map((photo: any) => photo.url),
    brand: { '@type': 'Brand', name: vehicle.brand || 'GTCars' },
    category: vehicle.vehicleType || 'Supercar',
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: vehicle.basePricePerDay,
      availability: 'https://schema.org/InStock',
      url: `https://gtcars.vip/camper/${vehicle.slug}`,
      itemCondition: 'https://schema.org/UsedCondition',
      seller: {
        '@type': 'Person',
        name: `${vehicle.owner?.firstName || 'Propietario'} ${vehicle.owner?.lastName || 'GT Cars'}`,
      },
    },
    ...(vehicle.reviews?.length ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: avgRating,
        reviewCount: vehicle.reviews.length,
      },
    } : {}),
  };

  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Vault', item: 'https://gtcars.vip' },
      { '@type': 'ListItem', position: 2, name: vehicle.island, item: `https://gtcars.vip/buscar?island=${encodeURIComponent(vehicle.island)}` },
      { '@type': 'ListItem', position: 3, name: vehicle.title, item: `https://gtcars.vip/camper/${vehicle.slug}` },
    ],
  };

  return (
    <div className="min-h-screen bg-[#070707] text-[#F5F5F5] selection:bg-[#D4AF37] selection:text-black font-sans">
      {vehicle.status !== 'ACTIVE' && (
        <div className="bg-[#D97706] text-white text-xs font-mono font-bold py-2.5 px-4 text-center sticky top-0 z-50 shadow-md flex items-center justify-center space-x-2">
          <ShieldCheck className="w-4 h-4" />
          <span>
            MODO VISTA PREVIA ({vehicle.status === 'PENDING_REVIEW' ? 'Pendiente de moderación' : vehicle.status === 'DRAFT' ? 'Borrador' : 'Rechazado'}) — Solo visible para ti y la administración.
          </span>
        </div>
      )}
      <VehicleViewTracker vehicleId={vehicle.id} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdVehicleProduct) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <Navbar />

      <main className="w-full">
        {/* SUPERCAR CONFIGURATOR SHOWCASE (Lamborghini HUD Telemetry on top of background photo) */}
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
          {/* TITULO Y CABECERA */}
          <div className="mb-10 relative flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6 font-mono">
            <div>
              <div className="flex items-center space-x-2 text-xs text-[#D4AF37] font-mono mb-2 uppercase tracking-widest">
                <span>{vehicle.brand || 'SUPERCAR'}</span>
                <span>//</span>
                <span>{vehicle.island} {vehicle.municipality ? `— ${vehicle.municipality}` : ''}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black uppercase text-white tracking-tight">
                {vehicle.title}
              </h2>
              <div className="flex items-center space-x-4 mt-3 text-xs text-white/50 font-mono">
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  DISPONIBILIDAD INMEDIATA
                </span>
                <span>•</span>
                {vehicle.owner?.verification === 'VERIFIED' && <div className="flex items-center space-x-1 text-[#D4AF37]"><ShieldCheck className="w-4 h-4" /><span>Propietario Verificado VIP</span></div>}
              </div>
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
            <div className="grid grid-cols-4 gap-4 p-6 bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/10 text-center font-mono">
              <div>
                <Users className="w-5 h-5 mx-auto text-[#D4AF37] mb-1.5" />
                <span className="block text-[10px] uppercase tracking-widest text-white/40">Plazas</span>
                <span className="text-base font-bold text-white">{vehicle.passengers} Plazas</span>
              </div>
              <div>
                <Bed className="w-5 h-5 mx-auto text-[#D4AF37] mb-1.5" />
                <span className="block text-[10px] uppercase tracking-widest text-white/40">Configuración</span>
                <span className="text-base font-bold text-white">{vehicle.beds || 2} Asientos</span>
              </div>
              <div>
                <Settings2 className="w-5 h-5 mx-auto text-[#D4AF37] mb-1.5" />
                <span className="block text-[10px] uppercase tracking-widest text-white/40">Transmisión</span>
                <span className="text-base font-bold text-white">{vehicle.transmission || 'Automático'}</span>
              </div>
              <div>
                <Fuel className="w-5 h-5 mx-auto text-[#D4AF37] mb-1.5" />
                <span className="block text-[10px] uppercase tracking-widest text-white/40">Propulsión</span>
                <span className="text-base font-bold text-white">{vehicle.fuelType || 'Gasolina'}</span>
              </div>
            </div>

            {/* DESCRIPCIÓN */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold uppercase tracking-wider text-white border-b border-white/10 pb-3 font-mono flex items-center space-x-2">
                <span className="text-[#D4AF37]">01 //</span>
                <span>Sobre esta unidad</span>
              </h3>
              <p className="text-sm text-white/70 leading-relaxed font-light whitespace-pre-line">
                {vehicle.description}
              </p>
            </div>

            {/* ESPECIFICACIONES Y EQUIPAMIENTO */}
            {vehicle.features && vehicle.features.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold uppercase tracking-wider text-white border-b border-white/10 pb-3 font-mono flex items-center space-x-2">
                  <span className="text-[#D4AF37]">02 //</span>
                  <span>Equipamiento & Telemetría</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {vehicle.features.map((feat: any, idx: number) => {
                    const featName = typeof feat === 'string' ? feat : feat?.name || '';
                    if (!featName) return null;
                    return (
                      <div key={feat?.id || featName || idx} className="flex items-center space-x-2.5 text-xs font-mono text-white/90 bg-white/[0.02] p-3 rounded-xl border border-white/10">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#D4AF37]" aria-hidden="true" />
                        <span className="truncate">{featName}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SERVICIOS EXTRAS */}
            {vehicle.extras && vehicle.extras.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold uppercase tracking-wider text-white border-b border-white/10 pb-3 font-mono flex items-center space-x-2">
                  <span className="text-[#D4AF37]">03 //</span>
                  <span>Servicios Concierge Opcionales</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {vehicle.extras.map((ve: any, idx: number) => {
                    const extraName = ve.extra?.name || ve.name || 'Extra';
                    const extraDesc = ve.extra?.description || ve.description || '';
                    const extraPrice = Number(ve.price ?? ve.extra?.price ?? 0);
                    return (
                      <div key={ve.id || extraName || idx} className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl border border-white/10 font-mono">
                        <div>
                          <h4 className="text-xs font-bold text-white">{extraName}</h4>
                          {extraDesc && (
                            <p className="text-[10px] text-white/50 mt-0.5">{extraDesc}</p>
                          )}
                        </div>
                        <span className="text-xs font-bold text-[#D4AF37] shrink-0 ml-2">
                          +{extraPrice}€
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SECCIÓN SOBRE EL PROPIETARIO */}
            <div className="p-6 bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/10 space-y-4 font-mono">
              <div className="flex items-center space-x-4">
                <img
                  src={vehicle.owner?.avatarUrl || '/default-avatar.svg'}
                  alt={vehicle.owner?.firstName || 'Propietario'}
                  className="w-16 h-16 rounded-full object-cover border border-[#D4AF37]/50 shadow-md"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[#D4AF37]">Propietario Verificado</span>
                  <h4 className="text-lg font-bold text-white truncate">{vehicle.owner?.firstName || 'Propietario'} {vehicle.owner?.lastName || ''}</h4>
                  <p className="text-xs text-white/50 mt-0.5">En la red GTCars desde {vehicle.owner?.createdAt ? new Date(vehicle.owner.createdAt).getFullYear() : '2024'}{vehicle.owner?.verification === 'VERIFIED' ? ' · Identidad & Licencia Verificada' : ''}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10">
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

            {/* RESEÑAS */}
            <div className="space-y-6 pt-4 font-mono">
              <h3 className="text-xl font-bold uppercase tracking-wider text-white border-b border-white/10 pb-3 flex items-center space-x-2">
                <span className="text-[#D4AF37]">04 //</span>
                <span>Experiencias de Conductores ({vehicle.reviews?.length || 0})</span>
              </h3>
              {vehicle.reviews?.length > 0 ? (
                <div className="space-y-4">
                  {vehicle.reviews.map((rev: any) => (
                    <div key={rev.id} className="p-6 bg-white/[0.02] rounded-2xl border border-white/10 font-sans">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <img
                            src={rev.author?.avatarUrl || '/default-avatar.svg'}
                            alt={rev.author?.firstName || 'Conductor'}
                            className="w-10 h-10 rounded-full object-cover border border-white/20"
                          />
                          <div>
                            <span className="font-bold text-sm text-white block">{rev.author?.firstName}</span>
                            {formatDateSafe(rev.createdAt) && <span className="text-[10px] text-white/40 font-mono">{formatDateSafe(rev.createdAt)}</span>}
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 font-mono">
                          <Star className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                          <span className="text-sm font-bold text-[#D4AF37]">{rev.rating}.0</span>
                        </div>
                      </div>
                      <p className="text-xs text-white/70 leading-relaxed font-light">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 bg-white/[0.02] rounded-2xl border border-white/10 text-center space-y-2">
                  <span className="inline-block px-3 py-1 bg-white/5 text-[#D4AF37] text-xs font-mono font-bold rounded-full border border-white/10">
                    NUEVA UNIDAD EN VAULT
                  </span>
                  <p className="text-xs text-white/50 max-w-md mx-auto">
                    Este superdeportivo es nuevo en la colección GT Cars. Sé el primer piloto verificado en conducirlo y registrar su telemetría.
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* WIDGET STICKY DE RESERVA */}
          <div id="reserva-widget" className="scroll-mt-6">
            {vehicle.isDemoVehicle ? (
              <div className="sticky top-28 rounded-3xl border border-white/10 bg-[#0f0f12]/90 backdrop-blur-xl p-6 shadow-2xl space-y-4 font-mono">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[10px] text-white/50 uppercase tracking-widest block">Tarifa Oficial</span>
                    <h3 className="text-3xl font-black text-white">{vehicle.basePricePerDay} € <span className="text-xs text-white/40 font-normal">/ día</span></h3>
                  </div>
                  <span className="rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] px-3 py-1 text-[10px] font-black uppercase tracking-wider">
                    RESERVADO
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-bold text-white">
                    <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                    <span>Disponibilidad por Solicitud</span>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Esta unidad se encuentra actualmente en ruta o reservada. Puedes explorar el resto de unidades disponibles en el Vault.
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <Link
                    href={`/buscar?island=${encodeURIComponent(vehicle.island)}`}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38B21] text-black font-black text-xs uppercase tracking-widest text-center block hover:brightness-110 transition-all shadow-[0_0_20px_rgba(212,175,55,0.25)]"
                  >
                    EXPLORAR OTROS SUPERDEPORTIVOS →
                  </Link>
                </div>
              </div>
            ) : (currentUser?.role === 'OWNER' || currentUser?.role === 'ADMIN') ? (
              <div className="sticky top-28 rounded-3xl border border-white/10 bg-[#0f0f12]/90 backdrop-blur-xl p-6 shadow-2xl font-mono space-y-4">
                <ShieldCheck className="h-8 w-8 text-[#D4AF37]" />
                <h3 className="text-lg font-bold text-white">VISTA DE PROPIETARIO</h3>
                <p className="text-xs text-white/60">Estás autenticado en modo {currentUser?.role === 'ADMIN' ? 'administrador' : 'propietario'}.</p>
                {vehicle.owner?.id === currentUser?.id && <a href="/propietario" className="block rounded-xl bg-white/10 hover:bg-white/20 px-5 py-3 text-center text-xs font-bold uppercase tracking-wider text-white border border-white/10 transition-all">Gestionar en Vault</a>}
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
                  <div className="p-4 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/10 text-center font-mono">
                    <p className="text-xs text-white/60 mb-2.5">
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
        </div>
      </main>
    </div>
  );
}
