'use client';

import React, { useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BLOG_ARTICLES } from '@/lib/blog-data';
import {
  Sparkles,
  Clock,
  ArrowLeft,
  Globe,
  Share2,
  CheckCircle2,
  Shield,
  Gauge,
  HelpCircle,
  Car,
} from 'lucide-react';

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [lang, setLang] = useState<'es' | 'en'>('es');
  const [copied, setCopied] = useState(false);

  const article = BLOG_ARTICLES.find((a) => a.slug === slug);
  if (!article) {
    notFound();
  }

  const content = lang === 'es' ? article.es : article.en;
  const otherArticles = BLOG_ARTICLES.filter((a) => a.slug !== slug).slice(0, 3);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  // Structured Data (JSON-LD) for Google SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: content.title,
    description: content.metaDescription,
    image: `https://gtrcars.es${article.image}`,
    datePublished: article.publishedAt,
    author: {
      '@type': 'Organization',
      name: 'GTR Cars Editorial Team',
      url: 'https://gtrcars.es',
    },
    publisher: {
      '@type': 'Organization',
      name: 'GTR Cars',
      logo: {
        '@type': 'ImageObject',
        url: 'https://gtrcars.es/favicon.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://gtrcars.es/blog/${article.slug}`,
    },
    keywords: article.keywords.join(', '),
  };

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
      {/* Schema.org BlogPosting Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* NAVEGACIÓN SUPERIOR */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === 'es' ? 'Volver a todos los artículos' : 'Back to all articles'}</span>
          </Link>

          {/* SELECTOR DE IDIOMA */}
          <div className="inline-flex items-center rounded-2xl bg-gray-50 p-1 border border-gray-200 shadow-lg">
            <button
              type="button"
              onClick={() => setLang('es')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                lang === 'es'
                  ? 'bg-black text-white hover:bg-neutral-800 shadow-md'
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              <Globe className="w-3 h-3" />
              <span>ES</span>
            </button>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                lang === 'en'
                  ? 'bg-black text-white hover:bg-neutral-800 shadow-md'
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              <Globe className="w-3 h-3" />
              <span>EN</span>
            </button>
          </div>
        </div>

        {/* CABECERA DEL ARTÍCULO */}
        <header className="space-y-6 mb-10 text-center sm:text-left">
          <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-start text-xs font-mono text-gray-500">
            <span className="px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-black uppercase font-bold text-[10px] tracking-wider">
              {article.category}
            </span>
            <span>•</span>
            <span>{article.publishedAt}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-black" />
              {article.readingTime}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            {content.title}
          </h1>

          <p className="text-sm sm:text-base text-gray-600 font-mono leading-relaxed border-l-2 border-black pl-4 italic">
            {content.excerpt}
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-[11px] font-mono text-gray-500">GTR Cars Editorial Team // Canarias</span>
            </div>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-600 transition-colors cursor-pointer border border-gray-200"
            >
              <Share2 className="w-3.5 h-3.5 text-black" />
              <span>{copied ? (lang === 'es' ? '¡Enlace copiado!' : 'Link copied!') : (lang === 'es' ? 'Compartir' : 'Share')}</span>
            </button>
          </div>
        </header>

        {/* IMAGEN HERO */}
        <div className="relative h-72 sm:h-96 w-full rounded-3xl overflow-hidden mb-12 border border-white/15 shadow-2xl">
          <img
            src={article.image}
            alt={content.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-6 z-10 flex items-center gap-2">
            <span className="text-xs font-mono text-gray-700 bg-gray-100 backdrop-blur-md px-3 py-1 rounded-full border border-gray-200">
              GTR Cars Vault Collection
            </span>
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <article className="space-y-10 text-gray-600 font-mono text-sm sm:text-base leading-relaxed">
          <div className="p-6 rounded-3xl bg-gray-50 border border-gray-200 shadow-lg">
            <p className="leading-relaxed text-white font-medium">{content.content}</p>
          </div>

          {content.sections.map((sec, idx) => (
            <section key={idx} className="space-y-4">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                <span className="text-black font-mono text-lg">{idx + 1}.</span>
                {sec.heading}
              </h2>
              <div className="p-6 rounded-2xl bg-neutral-900/40 border border-gray-100 leading-relaxed text-gray-600 space-y-3">
                <p>{sec.body}</p>
              </div>
            </section>
          ))}

          {/* FAQS SECTION */}
          {content.faqs && content.faqs.length > 0 && (
            <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gray-50 border border-gray-200 space-y-6 shadow-xl">
              <div className="flex items-center gap-2.5">
                <HelpCircle className="w-6 h-6 text-black" />
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                  {lang === 'es' ? 'Preguntas Frecuentes' : 'Frequently Asked Questions'}
                </h3>
              </div>

              <div className="space-y-4">
                {content.faqs.map((faq, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-gray-100 border border-gray-200 space-y-2">
                    <h4 className="font-bold text-white text-sm sm:text-base">{faq.question}</h4>
                    <p className="text-xs sm:text-sm text-gray-500">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BANNER CTA: ALQUILAR SUPERDEPORTIVO */}
          <div className="mt-14 p-8 rounded-3xl bg-gradient-to-br from-[#17171d] via-[#101014] to-black border border-gray-200 shadow-2xl text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-black text-[10px] font-mono tracking-widest uppercase border border-gray-200">
              <Sparkles className="w-3 h-3" />
              {lang === 'es' ? 'EXPERIENCIA DE CONDUCCIÓN VIP' : 'VIP DRIVING EXPERIENCE'}
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              {lang === 'es'
                ? '¿Listo para conducir en Gran Canaria o Tenerife?'
                : 'Ready to Command the Roads in the Canaries?'}
            </h3>

            <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto font-mono">
              {lang === 'es'
                ? 'Explora nuestra flota de Ferrari, Lamborghini, McLaren y Porsche GT3 RS con entrega VIP directa en aeropuerto o tu resort de lujo.'
                : 'Discover our fleet of Ferrari, Lamborghini, McLaren, and Porsche GT3 RS with direct airport concierge and resort delivery.'}
            </p>

            <div className="pt-2 flex flex-wrap justify-center gap-4">
              <Link
                href="/#flota"
                className="px-8 py-3.5 rounded-xl bg-black text-white hover:bg-neutral-800 font-mono font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-lg transition-all"
              >
                {lang === 'es' ? 'Ver Flota Disponible' : 'Explore Available Fleet'}
              </Link>
              <Link
                href="/publicar-camper"
                className="px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all border border-gray-200"
              >
                {lang === 'es' ? 'Unirse al Vault Propietarios' : 'Join Owner Vault'}
              </Link>
            </div>
          </div>
        </article>

        {/* ARTÍCULOS RELACIONADOS */}
        {otherArticles.length > 0 && (
          <div className="mt-16 pt-12 border-t border-gray-200 space-y-6">
            <h3 className="font-serif text-2xl font-bold text-black">
              {lang === 'es' ? 'Otros Artículos de Interés' : 'Related Articles'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherArticles.map((rel) => {
                const relData = lang === 'es' ? rel.es : rel.en;
                return (
                  <Link
                    key={rel.slug}
                    href={`/blog/${rel.slug}`}
                    className="group bg-gray-50 rounded-2xl border border-gray-200 p-4 hover:border-gray-200 transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="h-32 w-full rounded-xl overflow-hidden relative">
                      <img
                        src={rel.image}
                        alt={relData.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-mono text-black uppercase font-bold">
                        {rel.category}
                      </span>
                      <h4 className="font-serif font-bold text-xs sm:text-sm text-white group-hover:text-black transition-colors line-clamp-2">
                        {relData.title}
                      </h4>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
