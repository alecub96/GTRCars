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
  return <div className="min-h-screen bg-[#F7F6F2] text-[#13322E]"><Navbar /><main>
    <article className="max-w-4xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/guias" className="text-sm font-bold text-[#0F766E]">← Volver al blog</Link>
      <header className="mt-8 mb-10"><span className="text-xs font-black uppercase tracking-widest text-[#D97706]">{article.category} · {article.readingTime}</span>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold leading-tight mt-3 mb-5">{article.title}</h1>
        <p className="text-lg text-[#6B726E] leading-relaxed">{article.excerpt}</p>
      </header>
      <img src={article.image} alt={article.title} className="w-full h-[28rem] object-cover rounded-3xl mb-12" />
      <div className="space-y-12">{article.sections.map((section) => <section key={section.heading}>
        <h2 className="font-serif text-3xl font-bold mb-4">{section.heading}</h2>
        <div className="space-y-4 text-base sm:text-lg text-[#334155] leading-8">{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        {section.bullets && <ul className="mt-5 grid sm:grid-cols-2 gap-3">{section.bullets.map((item) => <li key={item} className="bg-white border border-[#E9E1D2] rounded-2xl px-4 py-3">✓ {item}</li>)}</ul>}
      </section>)}</div>
    </article>
    <aside className="bg-white border-t border-[#E9E1D2] py-14"><div className="max-w-4xl mx-auto px-4"><h2 className="font-serif text-3xl font-bold mb-7">Sigue preparando tu viaje</h2>
      <div className="grid md:grid-cols-3 gap-5">{related.map((item) => <Link key={item.slug} href={`/guias/${item.slug}`} className="p-5 rounded-2xl bg-[#F4EFE7] font-serif font-bold hover:text-[#0F766E]">{item.title}</Link>)}</div>
    </div></aside>
  </main></div>;
}
