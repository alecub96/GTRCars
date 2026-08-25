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
import CamperLocationMap from '@/components/CamperLocationMap';
import { isConfiguredAdmin } from '@/lib/admin';
import { REALISTIC_CANARIAN_CAMPERS } from '@/lib/demo-campers-data';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface CamperDetailPageProps {
  params: Promise<{ slug: string }>;
}

async function fetchVehicleBySlugOrId(slugParam: string) {
  const raw = slugParam || '';
  const decoded = decodeURIComponent(raw).trim().toLowerCase();
  const slugClean = decoded.replace(/-[a-f0-9]{8}$/i, '');
  const titleSearch = decoded.replace(/-/g, ' ');

  try {
    const { ensureDbSchema } = await import('@/lib/prisma-ensure-schema');
    await ensureDbSchema().catch(() => {});

    // Intento 1: Prisma con todas las relaciones
    let v: any = await prisma.vehicle.findFirst({
      where: {
        OR: [
          { slug: raw },
          { slug: decoded },
          { id: raw },
          { id: decoded },
          { slug: { contains: slugClean } },
          { slug: { contains: decoded } },
          { title: { contains: titleSearch } },
        ],
      },
      include: {
        photos: { orderBy: { orderIndex: 'asc' } },
        features: true,
        extras: { include: { extra: true } },
        pricingRules: { orderBy: { startDate: 'asc' } },
        owner: { select: { id: true, firstName: true, lastName: true, avatarUrl: true, verification: true, createdAt: true, phone: true, email: true } },
        reviews: { include: { author: { select: { firstName: true, avatarUrl: true } } } },
      },
    }).catch(() => null);

    if (v) return v;

    // Intento 2: Prisma con relaciones esenciales
    v = await prisma.vehicle.findFirst({
      where: {
        OR: [
          { slug: raw },
          { slug: decoded },
          { id: raw },
          { id: decoded },
          { slug: { contains: slugClean } },
        ],
      },
      include: {
        photos: { orderBy: { orderIndex: 'asc' } },
        owner: { select: { id: true, firstName: true, lastName: true, avatarUrl: true, verification: true, createdAt: true } },
      },
    }).catch(() => null);

    if (v) {
      v.features = v.features || [];
      v.extras = v.extras || [];
      v.pricingRules = v.pricingRules || [];
      v.reviews = v.reviews || [];
      return v;
    }

    // Intento 3: Consulta raw directa a MySQL / MariaDB
    const rawRows = ((await prisma.$queryRawUnsafe(
      `SELECT * FROM Vehicle WHERE LOWER(slug) = ? OR id = ? OR slug LIKE ? OR LOWER(title) LIKE ? LIMIT 1`,
      decoded,
      raw,
      `%${slugClean}%`,
      `%${titleSearch}%`
    ).catch(() => [])) || []) as any[];

    if (rawRows && rawRows.length > 0) {
      const rawVeh = rawRows[0];
      const rawPhotos = ((await prisma.$queryRawUnsafe(
        `SELECT * FROM VehiclePhoto WHERE vehicleId = ? ORDER BY orderIndex ASC`,
        rawVeh.id
      ).catch(() => [])) || []) as any[];

      const rawOwner = ((await prisma.$queryRawUnsafe(
        `SELECT id, firstName, lastName, avatarUrl, verification, createdAt FROM User WHERE id = ? LIMIT 1`,
        rawVeh.ownerId
      ).catch(() => [])) || []) as any[];

      return {
        ...rawVeh,
        photos: rawPhotos || [],
        features: [],
        extras: [],
        pricingRules: [],
        reviews: [],
        owner: rawOwner?.[0] || { firstName: 'Propietario', lastName: 'Vaneando', createdAt: new Date() },
      };
    }
  } catch (err) {
    console.error('Error fetching vehicle by slug/id:', err);
  }

  // Intento 4: Demo / fallback local
  const demo = REALISTIC_CANARIAN_CAMPERS.find(
    (c) =>
      c.slug.toLowerCase() === decoded ||
      c.id.toLowerCase() === decoded ||
      c.slug.toLowerCase().includes(slugClean) ||
      c.title.toLowerCase().includes(titleSearch.toLowerCase())
  );
  if (demo) {
    return {
      ...demo,
      owner: {
        ...demo.owner,
        createdAt: new Date('2024-01-15'),
      },
      pricingRules: [],
      extras: [],
    };
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
    : 'https://vaneando.com/opengraph-image';

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
  const currentUser = await getCurrentUser().catch(() => null);
  const vehicle = await fetchVehicleBySlugOrId(rawSlug);

  if (!vehicle) {
    notFound();
  }

  const avgRating =
    vehicle.reviews?.length > 0
      ? vehicle.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / vehicle.reviews.length
      : 0;
  const featured = await getFeaturedAudience().catch(() => null);
  const isFeatured = Boolean(featured && (
    (vehicle.owner?.id && featured.ownerIds.has(vehicle.owner.id)) ||
    (vehicle.id && featured.vehicleIds.has(vehicle.id)) ||
    (vehicle.owner?.id && featured.subscriptionOwnerIds.has(vehicle.owner.id))
  ));

  const jsonLdVehicleProduct = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: vehicle.title,
    description: vehicle.description,
    image: (vehicle.photos || []).map((photo: any) => photo.url),
    brand: { '@type': 'Brand', name: vehicle.brand || 'vaneando.' },
    category: vehicle.vehicleType || 'Camper',
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: vehicle.basePricePerDay,
      availability: 'https://schema.org/InStock',
      url: `https://vaneando.com/camper/${vehicle.slug}`,
      itemCondition: 'https://schema.org/UsedCondition',
      seller: {
        '@type': 'Person',
        name: `${vehicle.owner?.firstName || 'Propietario'} ${vehicle.owner?.lastName || 'Vaneando'}`,
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
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://vaneando.com' },
      { '@type': 'ListItem', position: 2, name: vehicle.island, item: `https://vaneando.com/buscar?island=${encodeURIComponent(vehicle.island)}` },
      { '@type': 'ListItem', position: 3, name: vehicle.title, item: `https://vaneando.com/camper/${vehicle.slug}` },
    ],
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#1C2826]">
      {vehicle.status !== 'ACTIVE' && (
        <div className="bg-[#D97706] text-white text-xs font-bold py-2.5 px-4 text-center sticky top-0 z-50 shadow-md flex items-center justify-center space-x-2">
          <ShieldCheck className="w-4 h-4" />
          <span>
            ⚠️ Modo Vista Previa ({vehicle.status === 'PENDING_REVIEW' ? 'Pendiente de moderación' : vehicle.status === 'DRAFT' ? 'Borrador' : 'Rechazado'}) — Solo visible para ti y la administración.
          </span>
        </div>
      )}
      <VehicleViewTracker vehicleId={vehicle.id} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdVehicleProduct) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {vehicle.status !== 'ACTIVE' && (
          <div className={`mb-6 p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-bold ${
            vehicle.status === 'REJECTED'
              ? 'bg-red-50 text-red-800 border-red-200'
              : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}>
            <span>⚠️ Vista previa de anuncio ({vehicle.status === 'REJECTED' ? 'RECHAZADO' : vehicle.status === 'PENDING_REVIEW' ? 'PENDIENTE DE APROBACIÓN' : vehicle.status}). No visible en búsquedas públicas para clientes.</span>
            {vehicle.rejectionReason && (
              <span className="font-normal text-red-700">Motivo: {vehicle.rejectionReason}</span>
            )}
          </div>
        )}
        
        {/* TITULO Y CABECERA */}
        <div className="mb-6 relative">
          <div className="absolute right-0 top-0 flex items-center space-x-2">
            <ShareVehicleButton
              vehicleTitle={vehicle.title}
              slug={vehicle.slug}
              island={vehicle.island}
              price={vehicle.basePricePerDay}
              variant="button"
            />
            <FavoriteButton vehicleId={vehicle.id} />
          </div>
          <div className="flex items-center space-x-2 text-xs text-[#6B726E] font-medium mb-2">
            <span>{vehicle.island}</span>
            <span>•</span>
            <span>{vehicle.municipality}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#1C2826]">
            {vehicle.title}
          </h1>
          <div className="flex items-center space-x-4 mt-3 text-xs text-[#4A4643]">
            {vehicle.reviews?.length > 0 ? (
              <div className="flex items-center space-x-1 font-semibold text-[#1C2826]">
                <Star className="w-4 h-4 fill-[#D97706] text-[#D97706]" />
                <span>{avgRating.toFixed(1)} ({vehicle.reviews.length} {vehicle.reviews.length === 1 ? 'opinión' : 'opiniones'})</span>
              </div>
            ) : (
              <span className="bg-slate-100 text-[#6B726E] px-2.5 py-0.5 rounded-full text-xs font-bold border border-slate-200">
                Pendiente de calificar
              </span>
            )}
            <span>•</span>
            {vehicle.owner?.verification === 'VERIFIED' && <div className="flex items-center space-x-1 text-[#16B8AA]"><ShieldCheck className="w-4 h-4" /><span>Propietario verificado</span></div>}
            {isFeatured && <div className="flex items-center space-x-1 text-[#D97706]"><ShieldCheck className="w-4 h-4" /><span>Usuario destacado</span></div>}
          </div>
        </div>

        {/* GALERÍA DE FOTOS EDITORIAL Y TÁCTIL MÓVIL CON LIGHTBOX */}
        <CamperDetailGallery
          photos={(vehicle.photos || []).map((p: any, idx: number) => ({
            id: String(p?.id || idx),
            url: typeof p === 'string' ? p : String(p?.url || ''),
            orderIndex: Number(p?.orderIndex || idx),
          }))}
          title={vehicle.title || 'Camper'}
        />

        {/* CONTENIDO PRINCIPAL Y STICKY WIDGET */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* DETALLES DE LA CAMPER */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* CARACTERÍSTICAS PRINCIPALES */}
            <div className="grid grid-cols-4 gap-4 p-6 bg-white rounded-3xl border border-[#E9E1D2] text-center">
              <div>
                <Users className="w-6 h-6 mx-auto text-[#16B8AA] mb-1" />
                <span className="block text-xs text-[#6B726E]">Capacidad</span>
                <span className="font-serif text-lg font-semibold">{vehicle.passengers} plazas</span>
              </div>
              <div>
                <Bed className="w-6 h-6 mx-auto text-[#16B8AA] mb-1" />
                <span className="block text-xs text-[#6B726E]">Camas</span>
                <span className="font-serif text-lg font-semibold">{vehicle.beds} camas</span>
              </div>
              <div>
                <Settings2 className="w-6 h-6 mx-auto text-[#16B8AA] mb-1" />
                <span className="block text-xs text-[#6B726E]">Cambio</span>
                <span className="font-serif text-lg font-semibold">{vehicle.transmission}</span>
              </div>
              <div>
                <Fuel className="w-6 h-6 mx-auto text-[#16B8AA] mb-1" />
                <span className="block text-xs text-[#6B726E]">Combustible</span>
                <span className="font-serif text-lg font-semibold">{vehicle.fuelType}</span>
              </div>
            </div>

            {/* DESCRIPCIÓN */}
            <div className="space-y-4">
              <h3 className="font-serif text-2xl font-normal border-b border-[#E9E1D2] pb-3">Sobre este vehículo</h3>
              <p className="text-sm text-[#4A4643] leading-relaxed font-light whitespace-pre-line">
                {vehicle.description}
              </p>
            </div>

            {/* EQUIPAMIENTO E INSTALACIONES */}
            {vehicle.features && vehicle.features.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-serif text-2xl font-normal border-b border-[#E9E1D2] pb-3">Equipamiento e instalaciones</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {vehicle.features.map((feat: any, idx: number) => {
                    const featName = typeof feat === 'string' ? feat : feat?.name || '';
                    if (!featName) return null;
                    return (
                      <div key={feat?.id || featName || idx} className="flex items-center space-x-2 text-xs font-medium text-[#13322E] bg-white p-3 rounded-2xl border border-[#E9E1D2]">
                        <span className="text-[#16B8AA]">✓</span>
                        <span>{featName}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* EXTRAS OPCIONALES */}
            {vehicle.extras && vehicle.extras.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-serif text-2xl font-normal border-b border-[#E9E1D2] pb-3">Extras disponibles para este viaje</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {vehicle.extras.map((ve: any, idx: number) => {
                    const extraName = ve.extra?.name || ve.name || 'Extra';
                    const extraDesc = ve.extra?.description || ve.description || '';
                    const extraPrice = Number(ve.price ?? ve.extra?.price ?? 0);
                    return (
                      <div key={ve.id || extraName || idx} className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-[#E9E1D2]">
                        <div>
                          <h4 className="text-xs font-bold text-[#13322E]">{extraName}</h4>
                          {extraDesc && (
                            <p className="text-[11px] text-[#6B726E] mt-0.5">{extraDesc}</p>
                          )}
                        </div>
                        <span className="text-xs font-black text-[#16B8AA] shrink-0 ml-2">
                          +{extraPrice}€
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* MAPA DE UBICACIÓN APROXIMADA Y PUNTOS CAMPER */}
            <CamperLocationMap
              island={vehicle.island || 'Gran Canaria'}
              municipality={vehicle.municipality || 'Canarias'}
              vehicleTitle={vehicle.title || 'Camper'}
              latitude={vehicle.latitude ? Number(vehicle.latitude) : null}
              longitude={vehicle.longitude ? Number(vehicle.longitude) : null}
              addressApprox={vehicle.addressApprox || null}
            />

            {/* SECCIÓN SOBRE EL PROPIETARIO */}
            <div className="flex items-center space-x-4 p-6 bg-[#FAF7F0] rounded-3xl border border-[#E9E1D2]">
              <img
                src={vehicle.owner?.avatarUrl || '/default-avatar.svg'}
                alt={vehicle.owner?.firstName || 'Propietario'}
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-xs"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/default-avatar.svg';
                }}
              />
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-[#16B8AA]">Propietario</span>
                <h4 className="font-serif text-xl font-medium">{vehicle.owner?.firstName || 'Propietario'} {vehicle.owner?.lastName || ''}</h4>
                <p className="text-xs text-[#6B726E] mt-0.5">En vaneando. desde {vehicle.owner?.createdAt ? new Date(vehicle.owner.createdAt).getFullYear() : '2024'}{vehicle.owner?.verification === 'VERIFIED' ? ' · identidad verificada' : ''}{isFeatured ? ' · Usuario destacado' : ''}</p>
              </div>
            </div>

            {/* RESEÑAS */}
            <div className="space-y-6 pt-6">
              <h3 className="font-serif text-2xl font-normal border-b border-[#E9E1D2] pb-3">
                Opiniones de Viajeros ({vehicle.reviews?.length || 0})
              </h3>
              {vehicle.reviews?.length > 0 ? (
                <div className="space-y-4">
                  {vehicle.reviews.map((rev: any) => (
                    <div key={rev.id} className="p-6 bg-white rounded-3xl border border-[#E9E1D2]">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <img
                            src={rev.author?.avatarUrl || '/default-avatar.svg'}
                            alt={rev.author?.firstName || 'Viajero'}
                            className="w-10 h-10 rounded-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/default-avatar.svg';
                            }}
                          />
                          <div>
                            <span className="font-medium text-sm block">{rev.author?.firstName}</span>
                            <span className="text-[10px] text-[#6B726E]">{new Date(rev.createdAt).toLocaleDateString('es-ES')}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-[#D97706] text-[#D97706]" />
                          <span className="text-sm font-semibold">{rev.rating}.0</span>
                        </div>
                      </div>
                      <p className="text-xs text-[#4A4643] leading-relaxed font-light">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 bg-white rounded-3xl border border-[#E9E1D2] text-center space-y-2">
                  <span className="inline-block px-3 py-1 bg-slate-100 text-[#6B726E] text-xs font-bold rounded-full border border-slate-200">
                    Pendiente de calificar
                  </span>
                  <p className="text-xs text-[#6B726E] max-w-md mx-auto">
                    Este vehículo es nuevo en Vaneando y aún no tiene valoraciones de viajeros. Alquila esta camper y sé el primero en dejar una reseña tras tu aventura.
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* WIDGET STICKY DE RESERVA */}
          <div>
            {vehicle.isDemoVehicle ? (
              <div className="sticky top-28 rounded-3xl border border-[#E9E1D2] bg-white p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-[#E9E1D2] pb-4">
                  <div>
                    <span className="text-xs text-[#6B726E] font-medium">Tarifa</span>
                    <h3 className="font-serif text-3xl font-bold text-[#13322E]">{vehicle.basePricePerDay} € <span className="text-xs text-[#6B726E] font-normal">/ día</span></h3>
                  </div>
                  <span className="rounded-full bg-amber-100 text-amber-900 px-3 py-1 text-[10px] font-black uppercase tracking-wider">
                    🔥 Ocupación Completa
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E9E1D2] space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-bold text-[#13322E]">
                    <ShieldCheck className="w-4 h-4 text-[#16B8AA]" />
                    <span>Totalmente Reservado</span>
                  </div>
                  <p className="text-xs text-[#6B726E] leading-relaxed">
                    Este vehículo se encuentra reservado para la temporada y no admite nuevas fechas. El propietario tiene pausadas las solicitudes y mensajes por alta demanda.
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    disabled
                    className="w-full py-3.5 rounded-full bg-slate-200 text-slate-500 font-bold text-xs uppercase tracking-wider cursor-not-allowed text-center"
                  >
                    ⛔ Fechas no disponibles
                  </button>

                  <Link
                    href={`/buscar?island=${encodeURIComponent(vehicle.island)}`}
                    className="w-full py-3.5 rounded-full bg-[#16B8AA] text-white font-bold text-xs uppercase tracking-wider text-center block hover:bg-[#0F766E] transition-all shadow-md"
                  >
                    Ver otras campers en {vehicle.island} →
                  </Link>
                </div>
              </div>
            ) : currentUser?.role === 'OWNER' || currentUser?.role === 'ADMIN' ? (
              <div className="sticky top-28 rounded-3xl border border-[#E9E1D2] bg-white p-6 shadow-xl">
                <ShieldCheck className="mb-3 h-8 w-8 text-[#16B8AA]" />
                <h3 className="font-serif text-xl font-bold">Vista del anuncio</h3>
                <p className="mt-2 text-sm text-[#6B726E]">Estás en modo {currentUser.role === 'ADMIN' ? 'administrador' : 'propietario'}. Las solicitudes de fechas solo están disponibles en modo viajero.</p>
                {vehicle.owner?.id === currentUser.id && <a href="/propietario" className="mt-5 block rounded-full bg-[#13322E] px-5 py-3 text-center text-xs font-bold uppercase tracking-wider text-white">Volver a gestionar mi anuncio</a>}
              </div>
            ) : (
              <BookingWidget
                vehicle={{
                  id: String(vehicle.id),
                  basePricePerDay: Number(vehicle.basePricePerDay),
                  cleaningFee: Number(vehicle.cleaningFee || 0),
                  ownershipType: (vehicle.ownershipType || 'THIRD_PARTY') as 'PLATFORM' | 'THIRD_PARTY',
                  securityDeposit: Number(vehicle.securityDeposit || 0),
                  bookingType: vehicle.bookingType || 'REQUEST_TO_BOOK',
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
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
