import React from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function GuidesPage() {
  let blogPosts: any[] = [];
  let locations: any[] = [];

  try {
    blogPosts = await prisma.blogPost.findMany({
      where: { published: true },
      include: { author: { select: { firstName: true } } },
      orderBy: { createdAt: 'desc' },
    });

    locations = await prisma.seoLocation.findMany({
      where: { published: true },
    });
  } catch (err) {
    console.error('Error al cargar datos de guías:', err);
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#0F172A]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#D97706]">
            Blog & Guías Oficiales
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold mt-2 mb-4">
            Viajar en Camper por las Islas Canarias
          </h1>
          <p className="text-base text-[#64748B] font-medium leading-relaxed">
            Consejos de pernocta, áreas homologadas, normativa de acampada y las mejores rutas en las 8 islas.
          </p>
        </div>

        {/* SECCIÓN DE ENTRADAS DEL BLOG */}
        <div className="mb-16">
          <h2 className="font-serif text-2xl font-bold text-[#0F172A] mb-8">Artículos y Consejos Destacados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-3xl overflow-hidden border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all">
                {post.featuredImage && (
                  <div className="h-56 overflow-hidden">
                    <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-6">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#14B8A6] block mb-2">
                    {post.category}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#0F172A] mb-3 leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-xs text-[#64748B] font-medium leading-relaxed mb-6">
                    {post.excerpt}
                  </p>
                  <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
                    <span>Por {post.author.firstName}</span>
                    <span className="text-[11px] font-black uppercase text-[#14B8A6]">Leer artículo completo →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GUÍAS POR ISLA */}
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#0F172A] mb-8">Guías de Alquiler por Isla</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {locations.map((loc) => (
              <Link
                key={loc.id}
                href={`/alquiler-camper/${loc.slug}`}
                className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#14B8A6] block mb-2">
                    Guía Oficial
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#0F172A] group-hover:text-[#14B8A6] transition-colors mb-3">
                    {loc.name}
                  </h3>
                  <p className="text-xs text-[#64748B] line-clamp-3 font-medium leading-relaxed mb-6">
                    {loc.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-[#D97706]">Rutas y Pernocta</span>
                  <ChevronRight className="w-4 h-4 text-[#14B8A6] group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
