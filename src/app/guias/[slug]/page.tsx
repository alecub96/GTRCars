import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import SocialShareButtons from '@/components/SocialShareButtons';
import { BLOG_ARTICLES, getBlogArticle } from '@/lib/blog';
import { Zap, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

export function generateStaticParams() {
  return BLOG_ARTICLES.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getBlogArticle(slug);
  if (!article) return {};
  return {
    title: `${article.title} | vaneando.`,
    description: article.metaDescription,
    keywords: article.keywords,
    alternates: { canonical: `https://vaneando.com/guias/${article.slug}` },
    openGraph: { title: article.title, description: article.metaDescription, type: 'article', images: [article.image] },
  };
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getBlogArticle(slug);
  if (!article) notFound();

  const related = BLOG_ARTICLES.filter((item) => item.category === article.category && item.slug !== article.slug).slice(0, 3);

  const jsonLdArticle = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.metaDescription,
    image: `https://vaneando.com${article.image}`,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: { '@type': 'Organization', name: 'vaneando.', url: 'https://vaneando.com' },
    publisher: { '@type': 'Organization', name: 'vaneando.', logo: { '@type': 'ImageObject', url: 'https://vaneando.com/vaneando-lockup.svg' } },
    mainEntityOfPage: `https://vaneando.com/guias/${article.slug}`,
    keywords: article.keywords.join(', '),
  };

  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://vaneando.com' },
      { '@type': 'ListItem', position: 2, name: 'Blog & Guías', item: 'https://vaneando.com/guias' },
      { '@type': 'ListItem', position: 3, name: article.title, item: `https://vaneando.com/guias/${article.slug}` },
    ],
  };

  const jsonLdFaq = article.faqs && article.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: article.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  } : null;

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#13322E]">
      <Navbar />
      <main>
        <article className="max-w-4xl mx-auto px-4 py-12">
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
          {jsonLdFaq && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />}

          {/* BREADCRUMB UI */}
          <nav className="flex items-center justify-between text-xs font-bold mb-6 text-[#6B726E]">
            <div className="flex items-center gap-2">
              <Link href="/" className="hover:text-[#16B8AA]">Inicio</Link>
              <span>/</span>
              <Link href="/guias" className="hover:text-[#16B8AA]">Blog & Guías</Link>
              <span>/</span>
              <span className="text-[#13322E] truncate max-w-[200px] sm:max-w-xs">{article.title}</span>
            </div>

            <span className="bg-[#16B8AA]/10 text-[#16B8AA] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
              {article.category}
            </span>
          </nav>

          <header className="mt-4 mb-10">
            <div className="flex items-center gap-3 text-xs font-medium text-[#6B726E] mb-3">
              <span>Escrito por el Equipo Oficial de vaneando.</span>
              <span>•</span>
              <span>{article.publishedAt}</span>
              <span>•</span>
              <span className="text-[#D97706] font-bold">Tiempo de lectura: {article.readingTime}</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight mt-3 mb-6 text-[#13322E]">
              {article.title}
            </h1>
            <p className="text-xl text-[#4A5568] leading-relaxed font-serif italic border-l-4 border-[#16B8AA] pl-4 py-1 mb-6">
              {article.excerpt}
            </p>

            <SocialShareButtons title={article.title} />
          </header>

          <div className="relative mb-8 rounded-3xl overflow-hidden shadow-lg border border-[#E9E1D2]">
            <img src={article.image} alt={article.title} className="w-full h-[26rem] sm:h-[32rem] object-cover" />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 text-white text-xs">
              Información editorial y rutas para planificar tu viaje por Canarias.
            </div>
          </div>

          {/* CAJA TL;DR / PUNTOS CLAVE (OPTIMIZACIÓN GEO / AI SEARCH / FEATURED SNIPPETS) */}
          <div className="my-8 p-6 sm:p-7 bg-gradient-to-br from-[#13322E] to-[#1d4640] text-white rounded-3xl shadow-md space-y-4">
            <div className="flex items-center space-x-2 text-[#F2CC8F]">
              <Zap className="w-5 h-5 fill-[#F2CC8F]" />
              <span className="text-xs font-black uppercase tracking-widest">En Resumen (Key Takeaways)</span>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm text-white/90">
              {article.sections.slice(0, 3).map((sec, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#16B8AA] shrink-0 mt-0.5" />
                  <span><strong>{sec.heading}:</strong> {sec.paragraphs[0]?.slice(0, 120)}...</span>
                </li>
              ))}
            </ul>
          </div>

          {/* TABLA DE CONTENIDOS */}
          <div className="my-8 p-6 bg-white border border-[#E9E1D2] rounded-3xl shadow-sm">
            <h3 className="font-serif text-lg font-bold text-[#13322E] mb-3">Contenido de esta guía práctica</h3>
            <ul className="space-y-2.5 text-xs sm:text-sm font-semibold text-[#16B8AA]">
              {article.sections.map((section, idx) => (
                <li key={section.heading}>
                  <a href={`#seccion-${idx}`} className="hover:underline flex items-center gap-2">
                    <span className="font-bold text-[#D97706]">{idx + 1}.</span> {section.heading}
                  </a>
                </li>
              ))}
              {article.faqs && article.faqs.length > 0 && (
                <li>
                  <a href="#preguntas-frecuentes" className="hover:underline flex items-center gap-2">
                    <span className="font-bold text-[#D97706]">?</span> Preguntas Frecuentes Resueltas
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* SECCIONES ENRIQUECIDAS */}
          <div className="space-y-12">
            {article.sections.map((section, idx) => (
              <React.Fragment key={section.heading}>
                <section id={`seccion-${idx}`} className="scroll-mt-24">
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#13322E] mb-5 border-b border-[#E9E1D2] pb-3">
                    {idx + 1}. {section.heading}
                  </h2>
                  <div className="space-y-5 text-base sm:text-lg text-[#334155] leading-relaxed">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                  {section.bullets && (
                    <div className="mt-6 bg-[#FAF7F0] border border-[#E9E1D2] rounded-3xl p-6">
                      <h4 className="font-bold text-xs uppercase tracking-widest text-[#D97706] mb-4">Puntos Clave y Recomendaciones</h4>
                      <ul className="grid sm:grid-cols-2 gap-3">
                        {section.bullets.map((item) => (
                          <li key={item} className="bg-white border border-[#E9E1D2] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#13322E] font-bold flex items-start gap-2 shadow-xs">
                            <span className="h-2 w-2 shrink-0 rounded-full bg-[#16B8AA]" aria-hidden="true" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </section>

                {/* CTA TRAS LA PRIMERA SECCIÓN */}
                {idx === 0 && (
                  <div className="my-8 p-6 sm:p-8 bg-white rounded-3xl border-2 border-[#16B8AA]/30 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="space-y-1 text-center sm:text-left">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#16B8AA]">
                        Disponibilidad en Tiempo Real
                      </span>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#13322E]">
                        ¿Planeando tu viaje en camper por Canarias?
                      </h3>
                      <p className="text-xs text-[#6B726E]">
                        Compara campers, autocaravanas y 4x4 verificadas entre particulares sin comisiones sorpresa.
                      </p>
                    </div>
                    <Link
                      href="/buscar"
                      className="shrink-0 inline-flex items-center space-x-2 rounded-full bg-[#16B8AA] hover:bg-[#0F766E] text-white px-7 py-3.5 text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      <span>Ver Campers</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* FAQS INTERACTIVAS SI EXISTEN */}
          {article.faqs && article.faqs.length > 0 && (
            <section id="preguntas-frecuentes" className="mt-16 scroll-mt-24">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#13322E] mb-6 border-b border-[#E9E1D2] pb-3">
                Preguntas Frecuentes Resueltas por Expertos Locales
              </h2>
              <div className="space-y-4">
                {article.faqs.map((faq, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-[#E9E1D2] p-6 shadow-sm">
                    <h3 className="font-serif text-lg font-bold text-[#13322E] mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-sm text-[#6B726E] font-medium leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CALL TO ACTION DENTRO DEL ARTÍCULO */}
          <div className="my-16 bg-[#13322E] text-white p-8 sm:p-12 rounded-3xl text-center space-y-4 shadow-xl">
            <span className="text-xs uppercase tracking-widest text-[#F2CC8F] font-black">¿Listo para vivir la experiencia sobre ruedas?</span>
            <h3 className="font-serif text-2xl sm:text-4xl font-bold">Encuentra la camper perfecta en las 8 Islas Canarias</h3>
            <p className="text-sm text-white/80 max-w-xl mx-auto font-medium leading-relaxed">
              Alquila directamente a propietarios locales verificados, con contratos privados entre particulares, atención cercana y hasta un 60% de ahorro frente a un hotel tradicional.
            </p>
            <div className="pt-4">
              <Link href="/buscar" className="inline-block bg-[#16B8AA] hover:bg-[#0F766E] text-white font-black text-xs uppercase tracking-widest px-8 py-4 rounded-2xl transition-all shadow-lg hover:scale-105">
                Explorar Campers Disponibles Ahora →
              </Link>
            </div>
          </div>
        </article>

        <aside className="bg-white border-t border-[#E9E1D2] py-14">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="font-serif text-3xl font-bold mb-7 text-[#13322E]">Sigue preparando tu viaje por Canarias</h2>
            <div className="grid md:grid-cols-3 gap-5">
              {related.map((item) => (
                <Link key={item.slug} href={`/guias/${item.slug}`} className="p-5 rounded-2xl bg-[#F7F6F2] border border-[#E9E1D2] hover:border-[#16B8AA] transition-all group">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#D97706] block mb-2">{item.category}</span>
                  <h4 className="font-serif font-bold text-[#13322E] group-hover:text-[#16B8AA] transition-colors leading-snug">{item.title}</h4>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
