# Vaneando — baseline técnico y de negocio

Fecha de auditoría: 2026-08-26  
Alcance: repositorio local, sin afirmar estado de producción ni inventario real remoto.

## Resumen

Vaneando es una aplicación Next.js 16.3.0 con App Router, React 19 y TypeScript. Usa Prisma ORM 7.9.1 con proveedor MySQL/MariaDB y cliente generado en `src/generated/prisma`. El proyecto incluye `dev.db`, pero la configuración declarada y el adaptador son MariaDB; no se debe tratar el SQLite local como inventario de producción.

## Arquitectura encontrada

- Routing: App Router bajo `src/app`.
- Renderizado: páginas públicas dinámicas (`force-dynamic`) y rutas API.
- Persistencia: Prisma, MariaDB/MySQL; `prisma.config.ts` carga `DATABASE_URL`.
- Entidades principales: `User`, `Vehicle`, `VehiclePhoto`, `AvailabilityBlock`, `PricingRule`, `Booking`, `Review`, `Document`.
- Estados de vehículo: `DRAFT`, `PENDING_REVIEW`, `ACTIVE`, `PAUSED`, `REJECTED`, `ARCHIVED`.
- Seeds/fixtures: `prisma/seed.ts`, `scripts/seed-realistic-campers.ts` y `src/lib/demo-campers-data.ts`.
- SEO: metadata en layouts/páginas, `src/app/sitemap.ts`, `src/app/robots.ts`, JSON-LD en home, buscador y fichas.
- Seguridad: CSP y cabeceras en `next.config.mjs`; autenticación propia con JWT.
- Despliegue: `Dockerfile`, `server.js`, configuración compatible con servidor Node.

## Hallazgos críticos

1. `src/app/buscar/page.tsx` mezclaba `Vehicle` activos con `REALISTIC_CANARIAN_CAMPERS`, haciendo pasar fixtures como inventario público.
2. `src/app/sitemap.ts` añadía también los slugs del catálogo demo.
3. La ficha `/camper/[slug]` aceptaba coincidencias parciales de slug y título, debilitando la identidad canónica del vehículo.
4. `/buscar` canonicalizaba una variante de query (`?island=`), aunque el resto de facetas y fechas no se controlaban como páginas SEO.
5. El metadata raíz contenía claims no demostrados: `#1`, “líder”, “100% segura”, “contrato digital oficial”, “sin comisiones abusivas” y múltiples mercados no implementados.
6. Existen categorías y nomenclaturas que no están normalizadas entre el seed, el catálogo demo y `vehicle-types.ts`.
7. Hay parseos directos de fechas en varias rutas sin un único validador reutilizable.
8. El sitemap usaba `new Date()` para casi todas las páginas, generando fechas de modificación artificiales.

## Decisiones de esta fase

- Solo los vehículos `ACTIVE` almacenados en la base de datos son inventario publicable.
- Los datos demo se conservan como fixtures de desarrollo, pero no se muestran, no se incluyen en sitemap y no se usan como fallback público.
- El slug es una URL legible; el `id` sigue siendo la identidad primaria.
- Las facetas de `/buscar` son navegación de resultados y llevan `noindex,follow` salvo que se cree una landing editorial dedicada.
- No se publican afirmaciones de liderazgo, oficialidad, puntuaciones agregadas o coberturas que no estén respaldadas por datos y documentación vigentes.

## Limitaciones

No se pudo afirmar disponibilidad de producción, estado HTTP remoto, Core Web Vitals reales, configuración del DNS www/non-www ni contenido vigente de proveedores externos desde este entorno. Esos puntos quedan como QA de staging/producción.

## Próximas fases

- Inventario reproducible de rutas y metadatos.
- Normalización de fechas, islas, tipos y slugs.
- Fuente única para políticas de seguridad, fianza, seguro y comisiones.
- Landings editoriales por isla/tipo con inventario real y estado vacío honesto.
- Internacionalización real EN antes de declarar hreflang; alemán como fase posterior.
- Tests de integridad, SEO, disponibilidad y build.
