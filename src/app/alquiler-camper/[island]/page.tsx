import React from 'react';
import Navbar from '@/components/Navbar';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, ChevronRight, Star, Compass } from 'lucide-react';
import type { Metadata } from 'next';
import VehicleViewTracker from '@/components/VehicleViewTracker';

export async function generateMetadata({ params }: SeoIslandPageProps): Promise<Metadata> {
  const { island } = await params;
  const name = island.split('-').map((part) => part[0]?.toUpperCase() + part.slice(1)).join(' ');
  return { title: `Alquiler de campers en ${name}`, description: `Encuentra campers de propietarios locales para recorrer ${name}. Compara precios, disponibilidad y equipamiento en vaneando.`, alternates: { canonical: `/alquiler-camper/${island}` }, openGraph: { title: `Alquiler de campers en ${name}`, description: `Descubre ${name} en camper con propietarios locales.`, url: `/alquiler-camper/${island}` } };
}

interface SeoIslandPageProps {
  params: Promise<{ island: string }>;
}

export default async function SeoIslandPage({ params }: SeoIslandPageProps) {
  const { island } = await params;

  const locationData = await prisma.seoLocation.findUnique({
    where: { slug: island },
  });

  const vehicles = await prisma.vehicle.findMany({
    where: {
      status: 'ACTIVE',
      island: locationData?.island || island,
    },
    include: {
      photos: { orderBy: { orderIndex: 'asc' } },
      reviews: { select: { rating: true } },
    },
  });

  const faqs = locationData?.faq ? JSON.parse(locationData.faq) : [];
  const jsonLd = { '@context': 'https://schema.org', '@type': 'ItemList', name: `Campers en ${locationData?.name || island}`, numberOfItems: vehicles.length, itemListElement: vehicles.map((vehicle, index) => ({ '@type': 'ListItem', position: index + 1, url: `https://vaneando.com/camper/${vehicle.slug}`, name: vehicle.title })) };

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#1C2826]">
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* HERO SEO ISLA */}
      <section className="relative py-20 bg-[#1C2826] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#E07A5F]">
            Guía de Alquiler de Campers
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-light mt-2 mb-6">
            Alquiler de Campers en {locationData?.name || island}
          </h1>
          <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto font-light leading-relaxed">
            {locationData?.description || `Descubre los mejores rincones y rutas camper de ${island} con máxima libertad.`}
          </p>
        </div>
      </section>

      {/* CAMPERS EN ESTA ISLA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="font-serif text-3xl font-normal mb-8">
          Campers disponibles en {locationData?.name || island} ({vehicles.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {vehicles.map((v: any) => (
            <Link
              key={v.id}
              href={`/camper/${v.slug}`}
              className="group bg-white rounded-3xl overflow-hidden border border-[#E9E1D2] shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <VehicleViewTracker vehicleId={v.id} event="IMPRESSION" />
              <div className="relative h-60">
                <img
                  src={v.photos[0]?.url || 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800'}
                  alt={v.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="font-serif text-xl font-medium mb-2 group-hover:text-[#E07A5F] transition-colors">{v.title}</h3>
                <p className="text-xs text-[#6B726E] mb-4">{v.municipality} • {v.passengers} personas</p>
                <div className="pt-4 border-t border-[#E9E1D2] flex justify-between items-center">
                  <span className="font-serif text-xl font-semibold">{v.basePricePerDay}€ <span className="text-xs font-sans text-[#6B726E]">/día</span></span>
                  <span className="text-xs font-semibold text-[#1C2826] uppercase">Ver Camper →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQS SEO */}
      {faqs.length > 0 && (
        <section className="bg-[#F3EFEA] py-16 border-t border-[#E9E1D2]">
          <div className="max-w-4xl mx-auto px-4 space-y-6">
            <h3 className="font-serif text-2xl text-center mb-8">Preguntas Frecuentes en {locationData?.name || island}</h3>
            {faqs.map((faq: any, i: number) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-[#E9E1D2]">
                <h4 className="font-serif text-lg font-medium text-[#1C2826] mb-2">{faq.q}</h4>
                <p className="text-xs text-[#6B726E] leading-relaxed font-light">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
