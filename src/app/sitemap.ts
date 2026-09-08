import { MetadataRoute } from 'next';
import { CANARY_ISLANDS } from '@/lib/pricing';
import { BLOG_ARTICLES } from '@/lib/blog';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://vaneando.com';
  const staticLastModified = new Date('2026-08-26T00:00:00.000Z');

  const islandUrls = CANARY_ISLANDS.map((isla) => ({
    url: `${baseUrl}/alquiler-camper/${isla.id}`,
    lastModified: staticLastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));
  const blogUrls = BLOG_ARTICLES.map((article) => ({ url: `${baseUrl}/guias/${article.slug}`, lastModified: new Date(article.publishedAt), changeFrequency: 'monthly' as const, priority: 0.7 }));
  let camperUrls: MetadataRoute.Sitemap = [];
  try {
    const campers = await (await import('@/lib/prisma')).prisma.vehicle.findMany({ where: { status: 'ACTIVE' }, select: { slug: true, updatedAt: true } });
    camperUrls = campers.map((camper) => ({ url: `${baseUrl}/camper/${camper.slug}`, lastModified: camper.updatedAt, changeFrequency: 'weekly', priority: 0.8 }));
  } catch {}

  return [
    {
      url: baseUrl,
      lastModified: staticLastModified,
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/buscar`,
      lastModified: staticLastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...islandUrls,
    { url: `${baseUrl}/alquilar-mi-camper`, lastModified: staticLastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/guias`, lastModified: staticLastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/colaboradores`, lastModified: staticLastModified, changeFrequency: 'monthly', priority: 0.6 },
    ...blogUrls,
    ...camperUrls,
  ];
}
