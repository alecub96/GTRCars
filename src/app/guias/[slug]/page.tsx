import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { BLOG_ARTICLES, getBlogArticle } from '@/lib/blog';

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
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'BlogPosting', headline: article.title,
    description: article.metaDescription, image: `https://vaneando.com${article.image}`,
    datePublished: article.publishedAt, author: { '@type': 'Organization', name: 'vaneando.' },
    publisher: { '@type': 'Organization', name: 'vaneando.' },
    mainEntityOfPage: `https://vaneando.com/guias/${article.slug}`,
  };
  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#13322E]">
      <Navbar />
      <main>
        <article className="max-w-4xl mx-auto px-4 py-12">
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
          
          <div className="flex items-center justify-between">
            <Link href="/guias" className="text-sm font-bold text-[#0F766E] hover:underline flex items-center gap-1">
              ← Volver al blog de vaneando.
            </Link>

            <span className="bg-[#E6F4F1] text-[#0F766E] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {article.category}
            </span>
          </div>

          <header className="mt-8 mb-10">
            <div className="flex items-center gap-3 text-xs font-medium text-[#6B726E] mb-3">
              <span>Publicado por El Equipo de vaneando.</span>
              <span>•</span>
              <span>{article.publishedAt}</span>
              <span>•</span>
              <span className="text-[#D97706] font-bold">Tiempo de lectura: {article.readingTime}</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight mt-3 mb-6 text-[#13322E]">
              {article.title}
            </h1>
            <p className="text-xl text-[#4A5568] leading-relaxed font-serif italic border-l-4 border-[#0F766E] pl-4 py-1">
              {article.excerpt}
            </p>
          </header>

          <div className="relative mb-12 rounded-3xl overflow-hidden shadow-lg">
            <img src={article.image} alt={article.title} className="w-full h-[26rem] sm:h-[32rem] object-cover" />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white text-xs">
              Fotografía e itinerarios oficiales verificados para recorrer Canarias en camper.
            </div>
          </div>

          {/* TABLA DE CONTENIDOS Y ALERTA DE LECTOR */}
          <div className="my-8 p-6 bg-white border border-[#E9E1D2] rounded-2xl shadow-sm">
            <h3 className="font-serif text-lg font-bold text-[#13322E] mb-3">Contenido de esta guía práctica</h3>
            <ul className="space-y-2 text-sm text-[#0F766E]">
              {article.sections.map((section, idx) => (
                <li key={section.heading}>
                  <a href={`#seccion-${idx}`} className="hover:underline flex items-center gap-2">
                    <span className="font-bold text-[#D97706]">{idx + 1}.</span> {section.heading}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* SECCIONES ENRIQUECIDAS */}
          <div className="space-y-12">
            {article.sections.map((section, idx) => (
              <section key={section.heading} id={`seccion-${idx}`} className="scroll-mt-24">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#13322E] mb-5 border-b border-[#E9E1D2] pb-3">
                  {idx + 1}. {section.heading}
                </h2>
                <div className="space-y-5 text-base sm:text-lg text-[#334155] leading-relaxed">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                {section.bullets && (
                  <div className="mt-6 bg-[#FAF7F0] border border-[#E9E1D2] rounded-2xl p-6">
                    <h4 className="font-bold text-xs uppercase tracking-widest text-[#D97706] mb-4">Puntos Clave y Recomendaciones</h4>
                    <ul className="grid sm:grid-cols-2 gap-3">
                      {section.bullets.map((item) => (
                        <li key={item} className="bg-white border border-[#E9E1D2] rounded-xl px-4 py-3 text-sm text-[#13322E] font-medium flex items-start gap-2 shadow-xs">
                          <span className="text-[#0F766E] font-bold text-base">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* CALL TO ACTION DENTRO DEL ARTÍCULO */}
          <div className="my-16 bg-[#13322E] text-white p-8 sm:p-10 rounded-3xl text-center space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#E07A5F] font-bold">¿Listo para vivir la experiencia sobre ruedas?</span>
            <h3 className="font-serif text-2xl sm:text-4xl font-bold">Encuentra la camper perfecta en las 8 Islas Canarias</h3>
            <p className="text-sm text-white/80 max-w-xl mx-auto font-light">
              Alquila directamente a propietarios locales verificados, con seguro integral y atención cercana en cada rincón del archipiélago.
            </p>
            <div className="pt-2">
              <Link href="/buscar" className="inline-block bg-[#0F766E] hover:bg-[#0D645E] text-white font-bold text-sm px-8 py-4 rounded-xl transition-all shadow-md">
                Explorar Campers Disponibles →
              </Link>
            </div>
          </div>
        </article>

        <aside className="bg-white border-t border-[#E9E1D2] py-14">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="font-serif text-3xl font-bold mb-7 text-[#13322E]">Sigue preparando tu viaje por Canarias</h2>
            <div className="grid md:grid-cols-3 gap-5">
              {related.map((item) => (
                <Link key={item.slug} href={`/guias/${item.slug}`} className="p-5 rounded-2xl bg-[#F7F6F2] border border-[#E9E1D2] hover:border-[#0F766E] transition-all group">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#D97706] block mb-2">{item.category}</span>
                  <h4 className="font-serif font-bold text-[#13322E] group-hover:text-[#0F766E] transition-colors leading-snug">{item.title}</h4>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
