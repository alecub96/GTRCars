import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SupercarGrid from '@/components/SupercarGrid';
import { BRAND_SEO_HUBS, CITY_SEO_HUBS } from '@/lib/seo-hubs';
import { Gauge, Zap, ShieldCheck, ChevronRight } from 'lucide-react';

interface BrandHubPageProps {
  params: Promise<{ marca: string }>;
}

export async function generateStaticParams() {
  return BRAND_SEO_HUBS.map((hub) => ({ marca: hub.slug }));
}

export async function generateMetadata({ params }: BrandHubPageProps): Promise<Metadata> {
  const { marca } = await params;
  const hub = BRAND_SEO_HUBS.find((b) => b.slug === marca.toLowerCase());
  if (!hub) return {};

  const canonicalUrl = `https://gtrcars.es/marca/${hub.slug}`;
  const imageUrl = `https://gtrcars.es${hub.heroImage}`;

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
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `Alquiler de ${hub.name} en España — GTR Cars`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: hub.metaTitle,
      description: hub.metaDescription,
      images: [imageUrl],
    },
  };
}

export default async function BrandHubPage({ params }: BrandHubPageProps) {
  const { marca } = await params;
  const hub = BRAND_SEO_HUBS.find((b) => b.slug === marca.toLowerCase());

  if (!hub) {
    notFound();
  }

  const jsonLdBrandCollection = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: hub.metaTitle,
    description: hub.metaDescription,
    url: `https://gtrcars.es/marca/${hub.slug}`,
    about: {
      '@type': 'Brand',
      name: hub.name,
      logo: `https://gtrcars.es${hub.heroImage}`,
      description: hub.heritageText,
    },
  };

  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'GTR Cars', item: 'https://gtrcars.es' },
      { '@type': 'ListItem', position: 2, name: 'Marcas Oficiales', item: 'https://gtrcars.es/buscar' },
      {
        '@type': 'ListItem',
        position: 3,
        name: `Alquiler de ${hub.name}`,
        item: `https://gtrcars.es/marca/${hub.slug}`,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBrandCollection) }}
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

      {/* HERO DE MARCA ESTILO SHOWROOM */}
      <section className="bg-gray-50 border-b border-gray-200 py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-gray-500"
            >
              <Link href="/" className="hover:text-black transition-colors">
                GTR Cars
              </Link>
              <span>/</span>
              <Link href="/buscar" className="hover:text-black transition-colors">
                Marcas
              </Link>
              <span>/</span>
              <span className="text-black font-bold">{hub.name}</span>
            </nav>

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-gray-200 text-[10px] font-mono font-bold uppercase tracking-widest text-black">
              <span>COLECCIÓN OFICIAL // {hub.country}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black leading-none">
              Alquiler de {hub.name} en España
            </h1>

            <p className="text-xs font-mono uppercase tracking-wider text-[#E10600] font-bold">
              {hub.flagshipModels}
            </p>

            <p className="text-sm text-gray-600 leading-relaxed">{hub.heritageText}</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 font-mono">
              <div className="p-4 rounded-2xl bg-white border border-gray-200">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-gray-500">
                  <Gauge className="w-3.5 h-3.5 text-black" />
                  <span>Potencia Máx.</span>
                </div>
                <p className="text-xl font-black text-black mt-1">{hub.maxHp} CV</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-gray-200">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-gray-500">
                  <Zap className="w-3.5 h-3.5 text-[#E10600]" />
                  <span>0-100 km/h</span>
                </div>
                <p className="text-xl font-black text-black mt-1">{hub.accel}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-gray-200 col-span-2 sm:col-span-1">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-gray-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-black" />
                  <span>Garantía</span>
                </div>
                <p className="text-sm font-black text-black mt-1.5 uppercase">Contrato eIDAS</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="relative w-full aspect-16/10">
              <Image
                src={hub.heroImage}
                alt={`Alquiler de ${hub.name} — ${hub.flagshipModels}`}
                fill
                className="object-contain drop-shadow-2xl"
                priority
                unoptimized
              />
            </div>
          </div>
        </div>
      </section>

      {/* UNIDADES FILTRADAS POR ESTA MARCA */}
      <SupercarGrid selectedBrand={hub.brandKey} />

      {/* INGENIERÍA, FAQS E INTERLINKING */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-14 border-t border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="p-8 rounded-3xl bg-gray-50 border border-gray-200 space-y-4">
            <h2 className="text-xl font-black uppercase tracking-tight text-black">
              Especificaciones de Ingeniería — {hub.name}
            </h2>
            <ul className="space-y-3">
              {hub.engineeringHighlights.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs font-medium text-gray-700">
                  <ShieldCheck className="w-4 h-4 text-black shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-black uppercase tracking-tight text-black">
              Preguntas Frecuentes sobre Alquilar un {hub.name}
            </h2>
            <div className="space-y-3">
              {hub.faqs.map((faq, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-1.5">
                  <h3 className="text-xs sm:text-sm font-black uppercase text-black">{faq.q}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* INTERLINKING A CIUDADES Y OTRAS MARCAS */}
        <div className="pt-8 border-t border-gray-200 space-y-8">
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-gray-500">
              Ciudades con Entrega Concierge de {hub.name}
            </h3>
            <div className="flex flex-wrap gap-2">
              {CITY_SEO_HUBS.map((c) => (
                <Link
                  key={c.slug}
                  href={`/alquiler-superdeportivos/${c.slug}`}
                  className="px-3.5 py-2 rounded-xl border border-gray-200 hover:border-black text-xs font-mono font-bold uppercase text-black transition-all"
                >
                  Alquilar {hub.name} en {c.city}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-gray-500">
              Explorar Otras Marcas del Garaje GTR Cars
            </h3>
            <div className="flex flex-wrap gap-2">
              {BRAND_SEO_HUBS.filter((b) => b.slug !== hub.slug).map((b) => (
                <Link
                  key={b.slug}
                  href={`/marca/${b.slug}`}
                  className="px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 hover:border-black text-xs font-mono font-bold uppercase text-gray-800 hover:text-black transition-all inline-flex items-center gap-1"
                >
                  <span>Alquilar {b.name}</span>
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
