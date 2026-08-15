import { MetadataRoute } from 'next';
import { CANARY_ISLANDS } from '@/lib/pricing';
import { BLOG_ARTICLES } from '@/lib/blog';
import { REALISTIC_CANARIAN_CAMPERS } from '@/lib/demo-campers-data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://vaneando.com';

  const islandUrls = CANARY_ISLANDS.map((isla) => ({
    url: `${baseUrl}/alquiler-camper/${isla.id}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));
  const blogUrls = BLOG_ARTICLES.map((article) => ({ url: `${baseUrl}/guias/${article.slug}`, lastModified: new Date(article.publishedAt), changeFrequency: 'monthly' as const, priority: 0.7 }));
  let camperUrls: MetadataRoute.Sitemap = [];
  try {
    const campers = await (await import('@/lib/prisma')).prisma.vehicle.findMany({ where: { status: 'ACTIVE' }, select: { slug: true, updatedAt: true } });
    camperUrls = campers.map((camper) => ({ url: `${baseUrl}/camper/${camper.slug}`, lastModified: camper.updatedAt, changeFrequency: 'weekly', priority: 0.8 }));
  } catch {}

  // Enriquecer con los 10 anuncios realistas
  const existingSlugs = new Set(camperUrls.map((c) => c.url.replace(`${baseUrl}/camper/`, '')));
  for (const demo of REALISTIC_CANARIAN_CAMPERS) {
    if (!existingSlugs.has(demo.slug)) {
      camperUrls.push({
        url: `${baseUrl}/camper/${demo.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/buscar`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.9,
    },
    ...islandUrls,
    { url: `${baseUrl}/guias`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    ...blogUrls,
    ...camperUrls,
  ];
}
