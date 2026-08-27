# Informe final Social SEO

## Bloque A — implementado en web

Configuración central de perfiles, `sameAs`, enlaces sociales rastreables, compartir fichas, OG de fichas, convención UTM, mapas social→web, kit de propietarios, taxonomía de eventos y documentación de UGC. El buscador conserva sus filtros y las fichas usan foto, isla, precio y URL reales.

## Verificación

- Auditoría de contenido: 30/30 guías pasan.
- TypeScript: correcto.
- Build Webpack: completado; durante generación se observaron avisos de pool Prisma en portada, sin fallo de compilación.
- JSON-LD, canonical, sitemap, robots y ALT: revisados en código.
- Enlaces sociales: solo se usan URLs presentes en el repositorio; perfiles no confirmados quedan bloqueados.
- Performance CWV: requiere Lighthouse/CrUX en producción para medir antes/después; no se inventan valores.

## Bloque B — OWNER ACTION REQUIRED

La creación/publicación de contenido en Instagram, TikTok, YouTube, Pinterest, Facebook, LinkedIn, Google Business y Search Console requiere acceso externo del propietario. Está detallado en `OWNER_EXTERNAL_ACTIONS.md` y no se marca como completado.

## Rollback

Revertir los cambios de `src/lib/social-links.ts`, `src/lib/analytics.ts`, `src/app/layout.tsx`, `src/components/HomeClientHero.tsx` y `src/components/SocialShareButtons.tsx`; la documentación es independiente. No requiere tocar reservas ni disponibilidad.
