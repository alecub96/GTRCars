# Social SEO baseline — 2026-08-27

## Estado técnico

| Área | Estado | Evidencia |
|---|---|---|
| Title/H1/canonical | Implementado por página | `src/app/layout.tsx`, metadatos de cada ruta |
| Schema | Organization, WebSite, Product, BreadcrumbList, BlogPosting/FAQPage | layouts y páginas correspondientes |
| Open Graph | Home, buscador, isla, ficha y guías | `generateMetadata`/metadata |
| Sitemap/robots | Activos | `src/app/sitemap.ts`, `src/app/robots.ts` |
| Social links | Instagram y Facebook existentes; resto bloqueado | `src/lib/social-links.ts` |
| Buscador/filtros | Implementados; fallback conserva filtros | `src/app/buscar/page.tsx` |
| Fichas/CTA/share | Implementados | `src/app/camper/[slug]`, `ShareVehicleButton` |
| Propietario/publicación | Activo | `/propietario`, `/publicar-camper` |
| EN/hreflang | No se declara arquitectura EN activa | auditoría previa; no se inventan URLs |
| Reservas/contacto | Activos | rutas `/reserva`, `/contacto`, APIs |
| CWV | Requiere medición externa con Lighthouse/CrUX | no se inventan métricas |

## Snapshots

Las capturas desktop/móvil de `/`, `/buscar`, una ficha real, `/seguridad`, `/guias` y `/publicar-camper` deben generarse en el entorno con sesión y conservarse junto al informe de QA. No se adjuntan métricas simuladas.

## Páginas protegidas

No se modificaron slugs, IDs de vehículos, disponibilidad, reservas, pagos, seguridad, categorías, landings de isla ni lógica internacional estable. Las modificaciones sociales son aditivas y reversibles.
