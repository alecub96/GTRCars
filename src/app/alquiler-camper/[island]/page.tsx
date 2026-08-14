import React from 'react';
import Navbar from '@/components/Navbar';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import type { Metadata } from 'next';
import VehicleViewTracker from '@/components/VehicleViewTracker';
import { CANARY_ISLANDS } from '@/lib/pricing';

export async function generateMetadata({ params }: SeoIslandPageProps): Promise<Metadata> {
  const { island } = await params;
  const name = CANARY_ISLANDS.find((candidate) => candidate.id === island)?.name || island.split('-').map((part) => part[0]?.toUpperCase() + part.slice(1)).join(' ');
  return {
    title: `Alquiler de campers en ${name} barato entre particulares | vaneando.`,
    description: `Alquila furgonetas camperizadas, autocaravanas, caravanas y 4x4 en ${name} directamente a propietarios particulares verificados. Ahorra hasta un 60% frente a un hotel.`,
    alternates: { canonical: `https://vaneando.com/alquiler-camper/${island}` },
    openGraph: {
      title: `Alquiler de campers en ${name} barato entre particulares`,
      description: `Explora ${name} en camper con propietarios locales verificados. Transparencia total, seguro y fianza protegida.`,
      url: `https://vaneando.com/alquiler-camper/${island}`,
      images: [`https://vaneando.com/Islas/${name.toLowerCase()}.png`],
    },
  };
}

interface SeoIslandPageProps {
  params: Promise<{ island: string }>;
}

export default async function SeoIslandPage({ params }: SeoIslandPageProps) {
  const { island } = await params;
  const fallbackName = CANARY_ISLANDS.find((candidate) => candidate.id === island)?.name || island.split('-').map((part) => part[0]?.toUpperCase() + part.slice(1)).join(' ');
  let locationData: Awaited<ReturnType<typeof prisma.seoLocation.findUnique>> = null;
  let vehicles: Awaited<ReturnType<typeof prisma.vehicle.findMany>> = [];
  let databaseUnavailable = false;

  try {
    locationData = await prisma.seoLocation.findUnique({ where: { slug: island } });
    vehicles = await prisma.vehicle.findMany({
      where: { status: 'ACTIVE', island: locationData?.island || fallbackName },
      include: { photos: { orderBy: { orderIndex: 'asc' } }, reviews: { select: { rating: true } } },
    });
  } catch (error) {
    databaseUnavailable = true;
    console.error('Island landing data unavailable:', error);
  }

  const faqs = locationData?.faq ? JSON.parse(locationData.faq) : [
    { q: `¿Cuánto cuesta alquilar una camper en ${fallbackName}?`, a: `El precio medio en ${fallbackName} oscila entre 45€ y 90€ por día según la temporada y el tipo de vehículo (camper pequeña, gran volumen o autocaravana).` },
    { q: `¿Puedo recoger la camper en el aeropuerto de ${fallbackName}?`, a: `Sí. La mayoría de los propietarios locales en vaneando entregan el vehículo directamente en el aeropuerto o puntos clave de la isla.` },
    { q: `¿Por qué es mejor alquilar en camper que alojarse en un hotel en ${fallbackName}?`, a: `Viajar en camper elimina la necesidad de reservar hotel + coche de alquiler, ahorrando hasta un 60% del presupuesto y permitiéndote despertar en acantilados, miradores y playas naturales.` },
  ];

  const jsonLdItemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Campers y Autocaravanas en ${locationData?.name || fallbackName}`,
    numberOfItems: vehicles.length,
    itemListElement: vehicles.map((vehicle, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `https://vaneando.com/camper/${vehicle.slug}`,
      name: vehicle.title,
    })),
  };

  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://vaneando.com' },
      { '@type': 'ListItem', position: 2, name: 'Campers', item: 'https://vaneando.com/buscar' },
      { '@type': 'ListItem', position: 3, name: `Alquiler Camper ${fallbackName}`, item: `https://vaneando.com/alquiler-camper/${island}` },
    ],
  };

  const jsonLdFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq: any) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#13322E]">
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdItemList) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />

      {/* HERO SEO ISLA */}
      <section className="relative py-20 bg-[#13322E] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="text-xs font-black uppercase tracking-[0.25em] text-[#F2CC8F]">
            Guía Oficial & Alquiler entre Particulares
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold mt-2 mb-6">
            Alquiler de Campers en {locationData?.name || fallbackName}
          </h1>
          <p className="text-sm sm:text-base text-white/90 max-w-3xl mx-auto font-medium leading-relaxed">
            {locationData?.description || `Descubre ${fallbackName} con total libertad. Ahorra hasta un 60% frente a un hotel reservando campers, autocaravanas y 4x4 directamente a propietarios locales verificados.`}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-bold">
            <span className="bg-white/10 border border-white/20 px-4 py-2 rounded-full">✓ 0% Comisiones Ocultas</span>
            <span className="bg-white/10 border border-white/20 px-4 py-2 rounded-full">✓ Verificación de Licencia DNI</span>
            <span className="bg-white/10 border border-white/20 px-4 py-2 rounded-full">✓ Entrega en Aeropuerto</span>
          </div>
        </div>
      </section>

      {/* CAMPERS EN ESTA ISLA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="font-serif text-3xl font-bold text-[#13322E]">
              Campers disponibles en {locationData?.name || fallbackName} ({vehicles.length})
            </h2>
            <p className="text-xs text-[#6B726E] font-medium mt-1">
              Vehículos equipados con cocina, camas e inventario completo revisados por locales.
            </p>
          </div>
          <Link href={`/buscar?island=${encodeURIComponent(fallbackName)}`} className="inline-flex items-center text-xs font-black uppercase tracking-wider text-[#16B8AA] hover:underline">
            Ver todas en el buscador →
          </Link>
        </div>

        {databaseUnavailable && (
          <div className="mb-8 rounded-3xl border border-[#E9E1D2] bg-white p-8 text-center">
            <h3 className="font-serif text-2xl font-bold text-[#13322E]">Estamos actualizando la disponibilidad</h3>
            <p className="mt-2 text-sm text-[#6B726E] font-medium">La guía sigue disponible, pero no podemos mostrar vehículos en este momento. Inténtalo de nuevo en unos minutos.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {vehicles.map((v: any) => (
            <Link
              key={v.id}
              href={`/camper/${v.slug}`}
              className="group bg-white rounded-3xl overflow-hidden border border-[#E9E1D2] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <VehicleViewTracker vehicleId={v.id} event="IMPRESSION" />
                <div className="relative h-60">
                  <img
                    src={v.photos[0]?.url || 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800'}
                    alt={v.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[#13322E] text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-sm">
                    {v.vehicleType ? v.vehicleType.replace('_', ' ') : 'Camper'}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-xl font-bold mb-2 group-hover:text-[#16B8AA] transition-colors text-[#13322E]">{v.title}</h3>
                  <p className="text-xs text-[#6B726E] font-medium mb-4">{v.municipality} • {v.passengers} personas para dormir</p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-4 border-t border-[#E9E1D2] flex justify-between items-center">
                <span className="font-serif text-2xl font-bold text-[#13322E]">{v.basePricePerDay}€ <span className="text-xs font-sans font-medium text-[#6B726E]">/día</span></span>
                <span className="text-xs font-black uppercase tracking-wider text-[#16B8AA]">Ver Camper →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* COMPARATIVA HOTEL VS CAMPER EN ESTA ISLA */}
      <section className="bg-white py-16 border-t border-[#E9E1D2]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-[#FAF7F0] border border-[#E9E1D2] rounded-3xl p-8 sm:p-12 shadow-sm text-center">
            <span className="text-xs font-black uppercase tracking-widest text-[#D97706]">Por qué los viajeros eligen camper</span>
            <h3 className="font-serif text-3xl font-bold mt-2 mb-4 text-[#13322E]">Hotel vs Camper en {locationData?.name || fallbackName}</h3>
            <p className="text-sm text-[#6B726E] font-medium leading-relaxed max-w-2xl mx-auto mb-8">
              Alojarse en un hotel convencional en {fallbackName} implica depender de desplazamientos diarios y pagar habitualmente más de 1.800€ por semana sumando habitación, coche de alquiler y comidas fuera. En camper combinas todo en una única tarifa transparente.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 text-left">
              <div className="bg-white p-5 rounded-2xl border border-[#E9E1D2]">
                <h4 className="font-bold text-sm text-[#13322E] mb-1">Ahorro hasta el 60%</h4>
                <p className="text-xs text-[#6B726E] font-medium">Cocina a bordo y elimina el alquiler doble de coche y hotel.</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-[#E9E1D2]">
                <h4 className="font-bold text-sm text-[#13322E] mb-1">Libertad Total</h4>
                <p className="text-xs text-[#6B726E] font-medium">Cambia de ubicación cada día y despierta frente al Atlántico.</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-[#E9E1D2]">
                <h4 className="font-bold text-sm text-[#13322E] mb-1">Consejo Local</h4>
                <p className="text-xs text-[#6B726E] font-medium">Propietarios canarios verificados que te recomiendan los mejores rincones.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQS SEO */}
      {faqs.length > 0 && (
        <section className="bg-[#F7F6F2] py-16 border-t border-[#E9E1D2]">
          <div className="max-w-4xl mx-auto px-4 space-y-6">
            <h3 className="font-serif text-3xl font-bold text-center mb-8 text-[#13322E]">Preguntas Frecuentes al alquilar camper en {locationData?.name || fallbackName}</h3>
            {faqs.map((faq: any, i: number) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-[#E9E1D2] shadow-sm">
                <h4 className="font-serif text-lg font-bold text-[#13322E] mb-2">{faq.q}</h4>
                <p className="text-xs sm:text-sm text-[#6B726E] leading-relaxed font-medium">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
