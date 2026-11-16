import { MetadataRoute } from 'next';
import { BLOG_ARTICLES } from '@/lib/blog-data';
import { CITY_SEO_HUBS, BRAND_SEO_HUBS } from '@/lib/seo-hubs';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://gtrcars.es';
  const now = new Date();

  // 1. Hubs SEO Programáticos por Ciudad VIP (/alquiler-superdeportivos/[ciudad])
  const cityHubUrls: MetadataRoute.Sitemap = CITY_SEO_HUBS.map((city) => ({
    url: `${baseUrl}/alquiler-superdeportivos/${city.slug}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.95,
  }));

  // 2. Hubs SEO Programáticos por Marca Oficial (/marca/[marca])
  const brandHubUrls: MetadataRoute.Sitemap = BRAND_SEO_HUBS.map((brand) => ({
    url: `${baseUrl}/marca/${brand.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.92,
  }));

  // 3. Artículos editoriales del Blog SEO (Madrid, Marbella, Barcelona, Mallorca, Gran Canaria, Tenerife, Londres)
  const blogUrls: MetadataRoute.Sitemap = BLOG_ARTICLES.map((article) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: new Date(article.publishedAt || now),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  // 4. Vehículos activos en Base de Datos
  let vehicleUrls: MetadataRoute.Sitemap = [];
  try {
    const { prisma } = await import('@/lib/prisma');
    const vehicles: any[] = await Promise.race([
      prisma.vehicle.findMany({
        where: { status: 'ACTIVE' },
        select: { slug: true, updatedAt: true },
      }),
      new Promise<any[]>((resolve) => setTimeout(() => resolve([]), 3000)),
    ]);
    vehicleUrls = vehicles.map((v) => ({
      url: `${baseUrl}/coche/${v.slug}`,
      lastModified: v.updatedAt,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }));
  } catch {}

  // 5. Catálogo completo de unidades GTR Cars (/coche/[slug])
  const catalogSlugs = [
    'ferrari-488-gtb-rosso-corsa',
    'porsche-taycan-volcano-grey',
    'porsche-911-gt3-touring',
    'porsche-911-gt3-rs-weissach-992',
    'ferrari-sf90-stradale-assetto-fiorano',
    'ferrari-296-gtb-assetto',
    'lamborghini-revuelto-v12-hybrid',
    'lamborghini-huracan-sto-2024',
    'mclaren-765lt-spider-carbon',
    'mclaren-750s-spider',
    'mercedes-amg-gt-black-series',
    'aston-martin-dbs-superleggera',
    'audi-r8-v10-performance-quattro',
    'bmw-m4-competition-xdrive',
    'bentley-continental-gt-speed',
    'rolls-royce-spectre',
    'chevrolet-corvette-c8-z06',
    'dodge-challenger-srt-hellcat-redeye',
    'ford-mustang-dark-horse-v8',
  ];

  const fallbackVehicleUrls = catalogSlugs.map((slug) => ({
    url: `${baseUrl}/coche/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const seenVehicleUrls = new Set(vehicleUrls.map((v) => v.url));
  const combinedVehicleUrls = [
    ...vehicleUrls,
    ...fallbackVehicleUrls.filter((fv) => !seenVehicleUrls.has(fv.url)),
  ];

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
    ...cityHubUrls,
    ...brandHubUrls,
    ...combinedVehicleUrls,
    {
      url: `${baseUrl}/publicar-coche`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contrato`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.85,
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
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sobre-nosotros`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    ...blogUrls,
  ];
}
