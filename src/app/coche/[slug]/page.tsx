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
      photos: [{ url: '/supercars/lambo-revuelto.png' }, { url: '/supercars/huracan-sto.jpg' }],
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
        </div>
      </main>
    </div>
  );
}
