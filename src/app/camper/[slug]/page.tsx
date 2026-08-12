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

interface CamperDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CamperDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await prisma.vehicle.findUnique({ where: { slug }, select: { title: true, description: true, island: true, municipality: true, status: true, photos: { take: 1, orderBy: { orderIndex: 'asc' } } } }).catch(() => null);
  if (!vehicle) return {};
  const description = `${vehicle.description.slice(0, 125)} Alquiler en ${vehicle.municipality}, ${vehicle.island}.`;
  return { title: `${vehicle.title} en ${vehicle.island}`, description, alternates: { canonical: `/camper/${slug}` }, robots: vehicle.status === 'ACTIVE' ? { index: true, follow: true } : { index: false, follow: false }, openGraph: { title: vehicle.title, description, url: `/camper/${slug}`, images: vehicle.photos[0]?.url ? [vehicle.photos[0].url] : [] } };
}

export default async function CamperDetailPage({ params }: CamperDetailPageProps) {
  const { slug } = await params;
  const currentUser = await getCurrentUser().catch(() => null);

  const vehicle = await prisma.vehicle.findUnique({
    where: { slug },
    include: {
      photos: { orderBy: { orderIndex: 'asc' } },
      features: true,
      extras: { include: { extra: true } },
      pricingRules: { orderBy: { startDate: 'asc' } },
      owner: { select: { id: true, firstName: true, lastName: true, avatarUrl: true, verification: true, createdAt: true } },
      reviews: { include: { author: { select: { firstName: true, avatarUrl: true } } } },
    },
  }).catch(() => null);

  if (!vehicle || (vehicle.status !== 'ACTIVE' && currentUser?.role !== 'ADMIN' && currentUser?.id !== vehicle.owner.id)) {
    notFound();
  }

  const avgRating =
    vehicle.reviews.length > 0
      ? vehicle.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / vehicle.reviews.length
      : 0;
  const featured = await getFeaturedAudience().catch(() => null);
  const isFeatured = Boolean(featured && (
    featured.ownerIds.has(vehicle.owner.id) ||
    featured.vehicleIds.has(vehicle.id) ||
    featured.subscriptionOwnerIds.has(vehicle.owner.id)
  ));
  const jsonLd = { '@context': 'https://schema.org', '@type': 'Product', name: vehicle.title, description: vehicle.description, image: vehicle.photos.map((photo) => photo.url), brand: { '@type': 'Brand', name: vehicle.brand }, offers: { '@type': 'Offer', priceCurrency: 'EUR', price: vehicle.basePricePerDay, availability: 'https://schema.org/InStock', url: `https://vaneando.com/camper/${vehicle.slug}` }, aggregateRating: vehicle.reviews.length ? { '@type': 'AggregateRating', ratingValue: avgRating, reviewCount: vehicle.reviews.length } : undefined };

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#1C2826]">
      <VehicleViewTracker vehicleId={vehicle.id} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
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
              <span>{vehicle.reviews.length ? `${avgRating.toFixed(1)} (${vehicle.reviews.length} opiniones)` : 'Nuevo · sin opiniones'}</span>
            </div>
            <span>•</span>
            {vehicle.owner.verification === 'VERIFIED' && <div className="flex items-center space-x-1 text-[#E07A5F]"><ShieldCheck className="w-4 h-4" /><span>Propietario verificado</span></div>}
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

            {/* PROPIETARIO */}
            <div className="p-6 bg-[#F3EFEA] rounded-3xl border border-[#E9E1D2] flex items-center space-x-4">
              <img
                src={vehicle.owner.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'}
                alt={vehicle.owner.firstName}
                className="w-16 h-16 rounded-full object-cover border-2 border-white"
              />
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-[#E07A5F]">Propietario</span>
                <h4 className="font-serif text-xl font-medium">{vehicle.owner.firstName} {vehicle.owner.lastName}</h4>
                <p className="text-xs text-[#6B726E] mt-0.5">En vaneando. desde {new Date(vehicle.owner.createdAt).getFullYear()}{vehicle.owner.verification === 'VERIFIED' ? ' · identidad verificada' : ''}{isFeatured ? ' · Usuario destacado' : ''}</p>
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
            {currentUser?.role === 'OWNER' || currentUser?.role === 'ADMIN' ? (
              <div className="sticky top-28 rounded-3xl border border-[#E9E1D2] bg-white p-6 shadow-xl">
                <ShieldCheck className="mb-3 h-8 w-8 text-[#16B8AA]" />
                <h3 className="font-serif text-xl font-bold">Vista del anuncio</h3>
                <p className="mt-2 text-sm text-[#6B726E]">Estás en modo {currentUser.role === 'ADMIN' ? 'administrador' : 'propietario'}. Las solicitudes de fechas solo están disponibles en modo viajero.</p>
                {vehicle.owner.id === currentUser.id && <a href="/propietario" className="mt-5 block rounded-full bg-[#13322E] px-5 py-3 text-center text-xs font-bold uppercase tracking-wider text-white">Volver a gestionar mi anuncio</a>}
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
