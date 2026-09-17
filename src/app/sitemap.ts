import { MetadataRoute } from 'next';
import { BLOG_ARTICLES } from '@/lib/blog-data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://gtrcars.vip';
  const now = new Date();

  // Artículos editoriales del Blog SEO (Madrid, Barcelona, Gran Canaria, Tenerife, Londres)
  const blogUrls = BLOG_ARTICLES.map((article) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: new Date(article.publishedAt || now),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Vehículos activos en el Garaje
  let vehicleUrls: MetadataRoute.Sitemap = [];
  try {
    const { prisma } = await import('@/lib/prisma');
    const vehicles = await prisma.vehicle.findMany({
      where: { status: 'ACTIVE' },
      select: { slug: true, updatedAt: true },
    });
    vehicleUrls = vehicles.map((v) => ({
      url: `${baseUrl}/coche/${v.slug}`,
      lastModified: v.updatedAt,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }));
  } catch {}

  // Vehículos de demostración / flota destacada si no hay BD
  const demoSlugs = [
    'porsche-911-gt3-touring',
    'ferrari-sf90-stradale',
    'lamborghini-revuelto-v12',
    'mclaren-750s-spider',
    'mercedes-amg-gt-black-series',
    'aston-martin-dbs-superleggera',
  ];

  const fallbackVehicleUrls = demoSlugs.map((slug) => ({
    url: `${baseUrl}/coche/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/buscar`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/seguridad`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/sobre-nosotros`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...blogUrls,
    ...(vehicleUrls.length > 0 ? vehicleUrls : fallbackVehicleUrls),
  ];
}
