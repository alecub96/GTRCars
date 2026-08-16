import React from 'react';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import BookingWidget from '@/components/BookingWidget';
import FavoriteButton from '@/components/FavoriteButton';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import VehicleViewTracker from '@/components/VehicleViewTracker';
import { Star, MapPin, Users, Bed, ShieldCheck, Check, Fuel, Settings2, Compass } from 'lucide-react';
import type { Metadata } from 'next';
import { getFeaturedAudience } from '@/lib/featured';
import CamperLocationMap from '@/components/CamperLocationMap';
import { isConfiguredAdmin } from '@/lib/admin';
import { REALISTIC_CANARIAN_CAMPERS } from '@/lib/demo-campers-data';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface CamperDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CamperDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  let vehicle: any = await prisma.vehicle.findFirst({
    where: {
      OR: [{ slug }, { id: slug }],
    },
    select: { title: true, description: true, island: true, municipality: true, status: true, basePricePerDay: true, photos: { take: 1, orderBy: { orderIndex: 'asc' } } },
  }).catch(() => null);

  if (!vehicle) {
    vehicle = REALISTIC_CANARIAN_CAMPERS.find((c) => c.slug === slug || c.id === slug);
  }
  if (!vehicle) return {};
  const description = `Alquila ${vehicle.title} en ${vehicle.municipality}, ${vehicle.island} desde ${vehicle.basePricePerDay}€/día. Directo entre particulares con contrato digital e identidad verificada.`;
  return {
    title: `${vehicle.title} en ${vehicle.island} desde ${vehicle.basePricePerDay}€/día | vaneando.`,
    description,
    alternates: { canonical: `https://vaneando.com/camper/${slug}` },
    robots: vehicle.status === 'ACTIVE' ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: {
      title: `${vehicle.title} en ${vehicle.island}`,
      description,
      url: `https://vaneando.com/camper/${slug}`,
      images: [vehicle.photos?.[0]?.url || 'https://vaneando.com/vaneando-lockup.svg'],
    },
  };
}

export default async function CamperDetailPage({ params }: CamperDetailPageProps) {
  const rawParams = await params;
  const rawSlug = rawParams.slug;
  const slug = decodeURIComponent(rawSlug).trim();
  const currentUser = await getCurrentUser().catch(() => null);

  let vehicle: any = null;

  try {
    const { ensureDbSchema } = await import('@/lib/prisma-ensure-schema');
    await ensureDbSchema();

    vehicle = await prisma.vehicle.findFirst({
      where: {
        OR: [
          { slug: slug },
          { id: slug },
          { slug: rawSlug },
          { id: rawSlug },
          { slug: { contains: slug.split('-').slice(0, 3).join('-') } },
        ],
      },
      include: {
        photos: { orderBy: { orderIndex: 'asc' } },
        features: true,
        extras: { include: { extra: true } },
        pricingRules: { orderBy: { startDate: 'asc' } },
        owner: { select: { id: true, firstName: true, lastName: true, avatarUrl: true, verification: true, createdAt: true } },
        reviews: { include: { author: { select: { firstName: true, avatarUrl: true } } } },
      },
    });
  } catch (err) {
    console.error('Error fetching vehicle by slug/id:', err);
  }

  if (!vehicle) {
    const demo = REALISTIC_CANARIAN_CAMPERS.find((c) => c.slug === slug || c.id === slug || c.slug === rawSlug || c.id === rawSlug);
    if (demo) {
      vehicle = {
        ...demo,
        owner: {
          ...demo.owner,
          createdAt: new Date('2024-01-15'),
        },
        pricingRules: [],
        extras: [],
      };
    }
  }

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
          <div className="absolute right-0 top-0"><FavoriteButton vehicleId={vehicle.id} /></div>
          <div className="flex items-center space-x-2 text-xs text-[#6B726E] font-medium mb-2">
            <span>{vehicle.island}</span>
            <span>•</span>
            <span>{vehicle.municipality}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#1C2826]">
            {vehicle.title}
          </h1>
          <div className="flex items-center space-x-4 mt-3 text-xs text-[#4A4643]">
            <div className="flex items-center space-x-1 font-semibold text-[#1C2826]">
              <Star className="w-4 h-4 fill-[#E07A5F] text-[#E07A5F]" />
              <span>{vehicle.reviews?.length ? `${avgRating.toFixed(1)} (${vehicle.reviews.length} opiniones)` : 'Nuevo · sin opiniones'}</span>
            </div>
            <span>•</span>
            {vehicle.owner?.verification === 'VERIFIED' && <div className="flex items-center space-x-1 text-[#E07A5F]"><ShieldCheck className="w-4 h-4" /><span>Propietario verificado</span></div>}
            {isFeatured && <div className="flex items-center space-x-1 text-[#D97706]"><ShieldCheck className="w-4 h-4" /><span>Usuario destacado</span></div>}
          </div>
        </div>

        {/* GALERÍA DE FOTOS EDITORIAL */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12 rounded-3xl overflow-hidden h-[450px]">
          <div className="md:col-span-2 h-full">
            <img
              src={vehicle.photos[0]?.url || 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=1200'}
              alt={vehicle.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-4 h-full">
            {vehicle.photos.slice(1, 5).map((photo: any, i: number) => (
              <img
                key={photo.id}
                src={photo.url}
                alt={`${vehicle.title} vista ${i + 2}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            ))}
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL Y STICKY WIDGET */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* DETALLES DE LA CAMPER */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* CARACTERÍSTICAS PRINCIPALES */}
            <div className="grid grid-cols-4 gap-4 p-6 bg-white rounded-3xl border border-[#E9E1D2] text-center">
              <div>
                <Users className="w-6 h-6 mx-auto text-[#E07A5F] mb-1" />
                <span className="block text-xs text-[#6B726E]">Capacidad</span>
                <span className="font-serif text-lg font-semibold">{vehicle.passengers} plazas</span>
              </div>
              <div>
                <Bed className="w-6 h-6 mx-auto text-[#E07A5F] mb-1" />
                <span className="block text-xs text-[#6B726E]">Camas</span>
                <span className="font-serif text-lg font-semibold">{vehicle.beds} camas</span>
              </div>
              <div>
                <Settings2 className="w-6 h-6 mx-auto text-[#E07A5F] mb-1" />
                <span className="block text-xs text-[#6B726E]">Cambio</span>
                <span className="font-serif text-lg font-semibold">{vehicle.transmission}</span>
              </div>
              <div>
                <Fuel className="w-6 h-6 mx-auto text-[#E07A5F] mb-1" />
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

            {/* EQUIPAMIENTO */}
            <div className="space-y-4">
              <h3 className="font-serif text-2xl font-normal border-b border-[#E9E1D2] pb-3">Equipamiento Incluido</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {vehicle.features.map((f: any) => (
                  <div key={f.id} className="flex items-center space-x-2 p-3 bg-white rounded-2xl border border-[#E9E1D2]">
                    <Check className="w-4 h-4 text-[#E07A5F]" />
                    <span className="text-xs capitalize font-medium">{f.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* MAPA DE UBICACIÓN APROXIMADA Y PUNTOS CAMPER */}
            <CamperLocationMap
              island={vehicle.island}
              municipality={vehicle.municipality}
              vehicleTitle={vehicle.title}
              latitude={vehicle.latitude}
              longitude={vehicle.longitude}
              addressApprox={vehicle.addressApprox}
            />

            {/* PROPIETARIO */}
            <div className="p-6 bg-[#F3EFEA] rounded-3xl border border-[#E9E1D2] flex items-center space-x-4">
              <img
                src={vehicle.owner?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'}
                alt={vehicle.owner?.firstName || 'Propietario'}
                className="w-16 h-16 rounded-full object-cover border-2 border-white"
              />
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-[#E07A5F]">Propietario</span>
                <h4 className="font-serif text-xl font-medium">{vehicle.owner?.firstName || 'Propietario'} {vehicle.owner?.lastName || ''}</h4>
                <p className="text-xs text-[#6B726E] mt-0.5">En vaneando. desde {vehicle.owner?.createdAt ? new Date(vehicle.owner.createdAt).getFullYear() : '2024'}{vehicle.owner?.verification === 'VERIFIED' ? ' · identidad verificada' : ''}{isFeatured ? ' · Usuario destacado' : ''}</p>
              </div>
            </div>

            {/* RESEÑAS */}
            {vehicle.reviews.length > 0 && (
              <div className="space-y-6 pt-6">
                <h3 className="font-serif text-2xl font-normal border-b border-[#E9E1D2] pb-3">
                  Opiniones de Viajeros ({vehicle.reviews.length})
                </h3>
                <div className="space-y-4">
                  {vehicle.reviews.map((rev: any) => (
                    <div key={rev.id} className="p-6 bg-white rounded-3xl border border-[#E9E1D2]">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <img
                            src={rev.author.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'}
                            alt={rev.author.firstName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <span className="font-medium text-sm block">{rev.author.firstName}</span>
                            <span className="text-[10px] text-[#6B726E]">{new Date(rev.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-[#E07A5F] text-[#E07A5F]" />
                          <span className="text-sm font-semibold">{rev.rating}.0</span>
                        </div>
                      </div>
                      <p className="text-xs text-[#4A4643] leading-relaxed font-light">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
            ) : <BookingWidget
              vehicle={{
                id: vehicle.id,
                basePricePerDay: vehicle.basePricePerDay,
                cleaningFee: vehicle.cleaningFee,
                ownershipType: vehicle.ownershipType as 'PLATFORM' | 'THIRD_PARTY',
                securityDeposit: vehicle.securityDeposit,
                bookingType: vehicle.bookingType,
                minDays: vehicle.minDays,
                maxDays: vehicle.maxDays,
                pricingRules: vehicle.pricingRules,
                extras: vehicle.extras as any,
              }}
            />}
          </div>

        </div>
      </main>
    </div>
  );
}
