import { MetadataRoute } from 'next';
import { CANARY_ISLANDS } from '@/lib/pricing';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://nomadcanarias.com';

  const islandUrls = CANARY_ISLANDS.map((isla) => ({
    url: `${baseUrl}/alquiler-camper/${isla.id}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

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
  ];
}
