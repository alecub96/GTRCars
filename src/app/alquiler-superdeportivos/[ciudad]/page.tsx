import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SupercarGrid from '@/components/SupercarGrid';
import { CITY_SEO_HUBS, BRAND_SEO_HUBS } from '@/lib/seo-hubs';
import { MapPin, Plane, ShieldCheck, Compass, ChevronRight, FileSignature } from 'lucide-react';

interface CityHubPageProps {
  params: Promise<{ ciudad: string }>;
}

export async function generateStaticParams() {
  return CITY_SEO_HUBS.map((hub) => ({ ciudad: hub.slug }));
}

export async function generateMetadata({ params }: CityHubPageProps): Promise<Metadata> {
  const { ciudad } = await params;
  const hub = CITY_SEO_HUBS.find((c) => c.slug === ciudad.toLowerCase());
  if (!hub) return {};

  const canonicalUrl = `https://gtrcars.es/alquiler-superdeportivos/${hub.slug}`;

  return {
    title: hub.metaTitle,
    description: hub.metaDescription,
    keywords: hub.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: hub.metaTitle,
      description: hub.metaDescription,
      url: canonicalUrl,
      siteName: 'GTR Cars',
      locale: 'es_ES',
      type: 'website',
      images: [
        {
          url: 'https://gtrcars.es/supercars/brands/porsche.png',
          width: 1200,
          height: 630,
          alt: `Alquiler de Superdeportivos en ${hub.city} — GTR Cars`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: hub.metaTitle,
      description: hub.metaDescription,
      images: ['https://gtrcars.es/supercars/brands/porsche.png'],
    },
  };
}

export default async function CityHubPage({ params }: CityHubPageProps) {
  const { ciudad } = await params;
  const hub = CITY_SEO_HUBS.find((c) => c.slug === ciudad.toLowerCase());

  if (!hub) {
    notFound();
  }

  const jsonLdLocalAutoRental = {
    '@context': 'https://schema.org',
    '@type': 'AutoRental',
    '@id': `https://gtrcars.es/alquiler-superdeportivos/${hub.slug}#localbusiness`,
    name: `GTR Cars — Alquiler de Superdeportivos en ${hub.city}`,
    description: hub.metaDescription,
    url: `https://gtrcars.es/alquiler-superdeportivos/${hub.slug}`,
    image: 'https://gtrcars.es/supercars/brands/porsche.png',
    logo: 'https://gtrcars.es/brand/logo-primary.png',
    priceRange: '€€€€',
    currenciesAccepted: 'EUR',
    paymentAccepted: 'Credit Card, Bank Transfer',
    address: {
      '@type': 'PostalAddress',
      addressLocality: hub.city,
      addressRegion: hub.region,
      addressCountry: hub.countryCode,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: hub.lat,
      longitude: hub.lng,
    },
    areaServed: {
      '@type': 'City',
      name: hub.city,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '00:00',
        closes: '23:59',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '94',
      bestRating: '5',
      worstRating: '1',
    },
  };

  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'GTR Cars', item: 'https://gtrcars.es' },
      { '@type': 'ListItem', position: 2, name: 'Destinos VIP', item: 'https://gtrcars.es/buscar' },
      {
        '@type': 'ListItem',
        position: 3,
        name: `Alquiler de Superdeportivos en ${hub.city}`,
        item: `https://gtrcars.es/alquiler-superdeportivos/${hub.slug}`,
      },
    ],
  };

  const jsonLdFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: hub.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased selection:bg-black selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdLocalAutoRental) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />

      <Navbar />

      {/* HERO DE CIUDAD */}
      <section className="bg-gray-50 border-b border-gray-200 py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-gray-500"
          >
            <Link href="/" className="hover:text-black transition-colors">
              GTR Cars
            </Link>
            <span>/</span>
            <Link href="/buscar" className="hover:text-black transition-colors">
              Destinos VIP
            </Link>
            <span>/</span>
            <span className="text-black font-bold">{hub.city}</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-gray-200 text-[10px] font-mono font-bold uppercase tracking-widest text-black shadow-2xs">
            <Plane className="w-3.5 h-3.5 text-[#E10600]" />
            <span>
              ENTREGA VIP 24/7 // {hub.airportCode} · {hub.region}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-black leading-none max-w-4xl">
            Alquiler de Superdeportivos en {hub.city}
          </h1>

          <p className="text-xs sm:text-sm font-mono uppercase tracking-wider text-gray-500 font-bold">
            {hub.heroSubtitle}
          </p>

          <p className="text-sm sm:text-base text-gray-600 max-w-3xl leading-relaxed">
            {hub.metaDescription}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href={`/buscar?city=${encodeURIComponent(hub.city)}`}
              className="px-6 py-3.5 rounded-full bg-black text-white text-xs font-mono font-bold uppercase tracking-widest hover:bg-gray-800 transition-all"
            >
              Filtrar Disponibilidad en {hub.city} →
            </Link>
            <Link
              href="/contrato"
              className="px-6 py-3.5 rounded-full bg-white border border-gray-300 text-black text-xs font-mono font-bold uppercase tracking-widest hover:border-black transition-all inline-flex items-center gap-2"
            >
              <FileSignature className="w-4 h-4" />
              <span>Ver Contrato Digital eIDAS</span>
            </Link>
          </div>
        </div>
      </section>

      {/* CATÁLOGO DE UNIDADES EN ESTA CIUDAD + FLOTA NACIONAL */}
      <SupercarGrid filters={{ city: hub.city }} />

      {/* PUNTOS DE ENTREGA VIP Y RUTAS RECOMENDADAS EN LA CIUDAD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 border-t border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* ZONAS VIP DE ENTREGA */}
          <div className="p-8 rounded-3xl bg-gray-50 border border-gray-200 space-y-5">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#E10600]">
              <MapPin className="w-4 h-4" />
              <span>Servicio Concierge Puerta a Puerta</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black">
              Puntos de Entrega VIP en {hub.city} ({hub.airportCode})
            </h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              Nuestro equipo técnico traslada tu superdeportivo en camión cerrado o entrega directa en <strong>{hub.airportName}</strong>, hoteles 5 estrellas Gran Lujo y residencias privadas:
            </p>
            <ul className="space-y-3 pt-2">
              {hub.vipZones.map((zone, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs font-medium text-gray-800">
                  <ShieldCheck className="w-4 h-4 text-black shrink-0 mt-0.5" />
                  <span>{zone}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* RUTAS DE CONDUCCIÓN EN LA CIUDAD */}
          <div className="p-8 rounded-3xl bg-gray-50 border border-gray-200 space-y-5">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-black">
              <Compass className="w-4 h-4" />
              <span>Rutas Seleccionadas por GTR Vault</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black">
              Mejores Rutas para Conducir un Deportivo en {hub.city}
            </h2>
            <div className="space-y-4 pt-2">
              {hub.drivingRoutes.map((route, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white border border-gray-200 space-y-1.5">
                  <h3 className="text-xs font-black uppercase tracking-wider text-black">
                    0{idx + 1} // {route.name}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{route.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PREGUNTAS FRECUENTES DE LA CIUDAD */}
        <div className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black">
            Preguntas Frecuentes sobre Alquiler de Superdeportivos en {hub.city}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {hub.faqs.map((faq, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                <h3 className="text-sm font-black uppercase text-black">{faq.q}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* INTERLINKING A MARCAS Y OTROS DESTINOS */}
        <div className="pt-8 border-t border-gray-200 space-y-8">
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-gray-500">
              Marcas Disponibles para Entrega en {hub.city}
            </h3>
            <div className="flex flex-wrap gap-2">
              {BRAND_SEO_HUBS.map((b) => (
                <Link
                  key={b.slug}
                  href={`/marca/${b.slug}`}
                  className="px-3.5 py-2 rounded-xl border border-gray-200 hover:border-black text-xs font-mono font-bold uppercase text-black transition-all"
                >
                  Alquilar {b.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-gray-500">
              Otros Destinos VIP GTR Cars
            </h3>
            <div className="flex flex-wrap gap-2">
              {CITY_SEO_HUBS.filter((c) => c.slug !== hub.slug).map((c) => (
                <Link
                  key={c.slug}
                  href={`/alquiler-superdeportivos/${c.slug}`}
                  className="px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 hover:border-black text-xs font-mono font-bold uppercase text-gray-800 hover:text-black transition-all inline-flex items-center gap-1"
                >
                  <span>Superdeportivos {c.city}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
