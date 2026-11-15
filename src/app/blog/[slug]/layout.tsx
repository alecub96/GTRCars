import React from 'react';
import type { Metadata } from 'next';
import { BLOG_ARTICLES } from '@/lib/blog-data';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = BLOG_ARTICLES.find((a) => a.slug === slug);
  if (!article) return {};

  const url = `https://gtrcars.es/blog/${article.slug}`;
  const imageUrl = article.image.startsWith('http')
    ? article.image
    : `https://gtrcars.es${article.image}`;

  return {
    title: article.es.title,
    description: article.es.metaDescription,
    keywords: article.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title: `${article.es.title} | GTR Cars`,
      description: article.es.metaDescription,
      url,
      publishedTime: article.publishedAt,
      authors: ['GTR Cars Editorial Team'],
      images: [{ url: imageUrl, alt: article.es.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.es.title,
      description: article.es.metaDescription,
      images: [imageUrl],
    },
  };
}

export default function BlogArticleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
