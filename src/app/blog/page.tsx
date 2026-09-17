'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BLOG_ARTICLES } from '@/lib/blog-data';
import { Sparkles, Compass, Clock, ArrowRight, Globe, Search, Tag } from 'lucide-react';

export default function BlogListPage() {
  const [lang, setLang] = useState<'es' | 'en'>('es');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['ALL', 'Supercars', 'Rutas', 'Guías', 'Experiencias', 'Propietarios'];

  const filteredArticles = BLOG_ARTICLES.filter((article) => {
    const matchesCategory = selectedCategory === 'ALL' || article.category === selectedCategory;
    const content = lang === 'es' ? article.es : article.en;
    const matchesSearch =
      searchQuery.trim() === '' ||
      content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#070707] text-white selection:bg-[#D4AF37] selection:text-black">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* CABECERA PRINCIPAL */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-mono tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            {lang === 'es' ? 'GTR CARS // BLOG & RUTAS VIP' : 'GTR CARS // VIP BLOG & DRIVING ROUTES'}
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
            {lang === 'es'
              ? 'Guía de Superdeportivos y Rutas en Canarias'
              : 'Supercar Journal & Canary Island Driving Routes'}
          </h1>

          <p className="text-sm sm:text-base text-neutral-400 font-mono">
            {lang === 'es'
              ? 'Descubre las mejores rutas de montaña, consejos de pilotaje, guías de alquiler de Ferrari, Lamborghini y Porsche, y novedades del Vault en Gran Canaria y Tenerife.'
              : 'Explore the finest mountain passes, driving guides, Ferrari, Lamborghini, and Porsche rental insights across Gran Canaria and Tenerife.'}
          </p>

          {/* SELECTOR DE IDIOMA */}
          <div className="pt-2 flex items-center justify-center gap-2">
            <div className="inline-flex items-center rounded-2xl bg-[#0f0f12] p-1 border border-white/10 shadow-lg">
              <button
                type="button"
                onClick={() => setLang('es')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  lang === 'es'
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#B38B21] text-black shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Español</span>
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  lang === 'en'
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#B38B21] text-black shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>English</span>
              </button>
            </div>
          </div>
        </div>

        {/* FILTROS Y BUSCADOR */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-white/10">
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-mono font-bold transition-all border cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-sm font-black'
                    : 'bg-[#0f0f12] text-neutral-400 border-white/10 hover:border-white/30 hover:text-white'
                }`}
              >
                {cat === 'ALL' ? (lang === 'es' ? 'Todos los Artículos' : 'All Articles') : cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'es' ? 'Buscar rutas, Ferrari, Porsche...' : 'Search routes, Ferrari, Porsche...'}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0f0f12] border border-white/10 text-xs font-mono text-white placeholder:text-neutral-500 focus:border-[#D4AF37] outline-none"
            />
          </div>
        </div>

        {/* GRID DE ARTÍCULOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => {
            const data = lang === 'es' ? article.es : article.en;
            return (
              <article
                key={article.slug}
                className="group flex flex-col bg-[#0f0f12] rounded-3xl border border-white/10 overflow-hidden hover:border-[#D4AF37]/50 transition-all duration-300 shadow-xl hover:shadow-[0_0_30px_rgba(212,175,55,0.15)]"
              >
                <Link href={`/blog/${article.slug}`} className="relative h-56 w-full overflow-hidden block">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f12] via-transparent to-transparent z-10" />
                  <img
                    src={article.image}
                    alt={data.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 z-20 flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-mono uppercase font-bold tracking-wider">
                      {article.category}
                    </span>
                  </div>
                </Link>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-3 text-[11px] font-mono text-neutral-500">
                      <span>{article.publishedAt}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#D4AF37]" />
                        {article.readingTime}
                      </span>
                    </div>

                    <h2 className="font-serif text-lg sm:text-xl font-bold text-white group-hover:text-[#D4AF37] transition-colors leading-snug line-clamp-2">
                      <Link href={`/blog/${article.slug}`}>{data.title}</Link>
                    </h2>

                    <p className="text-xs text-neutral-400 font-mono line-clamp-3 leading-relaxed">
                      {data.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {article.keywords.slice(0, 2).map((kw) => (
                        <span key={kw} className="text-[9px] font-mono text-neutral-500 bg-white/5 px-2 py-0.5 rounded-md">
                          #{kw.split(' ')[0]}
                        </span>
                      ))}
                    </div>

                    <Link
                      href={`/blog/${article.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#D4AF37] group-hover:translate-x-1 transition-transform"
                    >
                      <span>{lang === 'es' ? 'Leer artículo' : 'Read article'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
