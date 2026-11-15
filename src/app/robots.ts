import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/buscar',
        '/alquiler-superdeportivos/',
        '/marca/',
        '/coche/',
        '/blog/',
        '/publicar-coche',
        '/contrato',
        '/seguridad',
        '/sobre-nosotros',
        '/contacto',
      ],
      disallow: [
        '/api/',
        '/admin/',
        '/cuenta/',
        '/perfil/',
        '/propietario/',
        '/camper/',
        '/publicar-camper/',
        '/alquilar-mi-camper/',
        '/alquiler-camper/',
        '/guias/',
        '/historias/',
        '/colaboradores/',
        '/mapa/',
        '/reserva/',
        '/mensajes/',
        '/soporte/',
        '/verificacion/',
        '/checkin/',
        '/checkout/',
        '/previsualizaciones/',
      ],
    },
    sitemap: 'https://gtrcars.es/sitemap.xml',
    host: 'https://gtrcars.es',
  };
}
