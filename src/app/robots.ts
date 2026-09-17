import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/cuenta/',
        '/perfil/',
        '/propietario/',
        '/publicar-coche/',
        '/publicar-camper/',
        '/reserva/',
        '/mensajes/',
        '/soporte/',
        '/verificacion/',
        '/checkin/',
        '/checkout/',
      ],
    },
    sitemap: 'https://gtrcars.es/sitemap.xml',
    host: 'https://gtrcars.es',
  };
}
