import React from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { BLOG_ARTICLES } from '@/lib/blog';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog Camper Canarias: Guías, Rutas y Comparativas Hotel vs Camper | vaneando.',
  description: 'Descubre guías completas para viajar en camper, autocaravana y 4x4 por Gran Canaria y Canarias. Comparativas de precios, mapas de pernocta legal y consejos de locales.',
  alternates: { canonical: 'https://vaneando.com/guias' },
  openGraph: {
    title: 'Blog Camper Canarias: Guías de Viaje y Consejos de Pernocta',
    description: 'Aprende cómo ahorrar hasta un 60% en tu viaje por Canarias alquilando una camper entre particulares.',
    url: 'https://vaneando.com/guias',
  },
};

export const dynamic = 'force-dynamic';

export default async function GuidesPage() {
  let locations: any[] = [];

  try {
    locations = await prisma.seoLocation.findMany({
      where: { published: true },
    });
  } catch (err) {
    console.error('Error al cargar datos de guías:', err);
  }

  const jsonLdCollection = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Blog Camper Canarias: Guías y Consejos Oficiales',
    description: 'Guías completas para viajar en camper, furgoneta camperizada, autocaravana y 4x4 por las Islas Canarias.',
    url: 'https://vaneando.com/guias',
    hasPart: BLOG_ARTICLES.map((article) => ({
      '@type': 'BlogPosting',
      headline: article.title,
      url: `https://vaneando.com/guias/${article.slug}`,
      datePublished: article.publishedAt,
    })),
  };

  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://vaneando.com' },
      { '@type': 'ListItem', position: 2, name: 'Blog & Guías', item: 'https://vaneando.com/guias' },
    ],
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#13322E]">
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdCollection) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#16B8AA] bg-[#16B8AA]/10 px-4 py-1.5 rounded-full inline-block mb-3 border border-[#16B8AA]/20">
            Blog & Guías Oficiales de Canarias
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold mt-2 mb-5 leading-tight">
            Viajar en Camper por Gran Canaria y las Islas Canarias
          </h1>
          <p className="text-base sm:text-lg text-[#6B726E] font-medium leading-relaxed max-w-2xl mx-auto">
            La guía definitiva para descubrir el archipiélago sobre ruedas: mapas de pernocta legal, comparativas Hotel vs Camper, rutas de 7 días y consejos de locales para ahorrar hasta un 60%.
          </p>
        </div>

        {/* HERO SEO DESTACADO: HOTEL VS CAMPER */}
        <div className="mb-16 bg-[#13322E] text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-white/10 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <span className="text-xs font-black uppercase tracking-widest text-[#F2CC8F]">
              Artículo Destacado de Producción
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold mt-2 mb-4 leading-snug">
              Hotel vs Camper en Gran Canaria: ¿Por qué es la opción más barata y libre?
            </h2>
            <p className="text-sm sm:text-base text-white/80 font-medium leading-relaxed mb-8">
              Ahorra más de 1.000€ por semana combinando vivienda y transporte en un único vehículo. Despierta en el Roque Nublo o frente a las olas de Agaete sin depender de reservas de hotel estandarizadas.
            </p>

            <Link href="/guias/hotel-vs-camper-gran-canaria-ahorro-experiencia" className="inline-block bg-[#16B8AA] hover:bg-[#0F766E] text-white font-black text-xs uppercase tracking-widest px-8 py-4 rounded-2xl transition-all shadow-lg hover:scale-105">
              Leer Comparativa Completa →
            </Link>
          </div>
        </div>

        {/* SECCIÓN DE ENTRADAS DEL BLOG */}
        <div className="mb-16">
          <h2 className="font-serif text-3xl font-bold text-[#13322E] mb-8">Guías y Artículos Imprescindibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {BLOG_ARTICLES.map((post) => (
              <Link href={`/guias/${post.slug}`} key={post.slug} className="group bg-white rounded-3xl overflow-hidden border border-[#E9E1D2] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="h-60 overflow-hidden relative">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[#13322E] text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-sm">
                      {post.category}
                    </span>
                  </div>
                  <div className="p-6">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#16B8AA] block mb-2">
                      Lectura: {post.readingTime} · Publicado: {post.publishedAt}
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-[#13322E] mb-3 leading-tight group-hover:text-[#16B8AA] transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#6B726E] font-medium leading-relaxed mb-6">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-4 border-t border-[#E9E1D2] flex items-center justify-between text-xs text-[#6B726E]">
                  <span className="font-bold">Por el Equipo Oficial de vaneando.</span>
                  <span className="text-[11px] font-black uppercase text-[#16B8AA] group-hover:translate-x-1 transition-transform">Leer artículo →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* GUÍAS POR ISLA */}
        <div>
          <div className="mb-8">
            <h2 className="font-serif text-3xl font-bold text-[#13322E]">Guías de Alquiler por Isla</h2>
            <p className="text-xs text-[#6B726E] font-medium mt-1">
              Selecciona tu destino para descubrir vehículos locales y recomendaciones de pernocta en cada isla.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {locations.map((loc) => (
              <Link
                key={loc.id}
                href={`/alquiler-camper/${loc.slug}`}
                className="bg-white rounded-3xl p-6 border border-[#E9E1D2] shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#16B8AA] block mb-2">
                    Guía Oficial
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#13322E] group-hover:text-[#16B8AA] transition-colors mb-3">
                    {loc.name}
                  </h3>
                  <p className="text-xs text-[#6B726E] line-clamp-3 font-medium leading-relaxed mb-6">
                    {loc.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E9E1D2] flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-[#D97706]">Rutas y Pernocta</span>
                  <ChevronRight className="w-4 h-4 text-[#16B8AA] group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
