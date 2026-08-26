# Cambios de auditoría — 2026-08-26

## Implementado

- Baseline técnico y matriz inicial de URLs.
- Eliminación del catálogo demo del buscador público, fichas y sitemap.
- Fichas limitadas a vehículos `ACTIVE` y resolución exacta por `slug`/`id`.
- Canonical único para `/buscar`; consultas con facetas, fechas o sorting quedan `noindex,follow`.
- Utilidades compartidas para fechas ISO de entrada y formato seguro sin `Invalid Date`.
- Corrección de la nomenclatura de icono de `AUTOCARAVANA`.
- Retirada de claims no demostrados del metadata raíz y emails de producto.
- Robots mantiene rastreables las URLs con `noindex`, de acuerdo con la estrategia de facetas.

## Pendiente de validación externa

- DNS y redirección www/non-www.
- HTTP status y canonicals en producción.
- Core Web Vitals reales de usuarios.
- Inventario real, reservas, coberturas y textos legales vigentes.
- Traducción EN localizada y hreflang; alemán como fase posterior.
