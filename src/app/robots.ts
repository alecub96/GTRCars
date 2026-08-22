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
        '/publicar-camper/',
        '/reserva/',
        '/mensajes/',
        '/soporte/',
        '/verificacion/',
        '/checkin/',
        '/checkout/',
        '/page/',
        '/*/page/',
      ],
    },
    sitemap: 'https://vaneando.com/sitemap.xml',
    host: 'https://vaneando.com',
  };
}
