# Informe de implementación web

| Task | Status | Files | Before | After | Test | Risk | Rollback |
|---|---|---|---|---|---|---|---|
| Centralizar perfiles | Done | `src/lib/social-links.ts` | URLs dispersas | Configuración única y perfiles no confirmados bloqueados | TypeScript/build | Bajo | revertir archivo |
| sameAs | Done | `src/app/layout.tsx` | array inline | deriva de configuración central | build | Bajo | revertir cambio |
| Enlaces rastreables | Done | `HomeClientHero.tsx` | no había enlaces de perfil | footer con href, aria-label y rel seguro | build | Bajo | quitar bloque |
| Compartir | Done | `SocialShareButtons.tsx` | compartir existente sin eventos | eventos preparados | TypeScript | Bajo | revertir import |
| UTM y mapas | Done | docs/social-seo | inexistentes | convenciones y destinos | revisión documental | Bajo | eliminar docs |
| SEO de fichas | Verified | `camper/[slug]/page.tsx` | OG dinámico | foto, precio, isla, URL y canonical reales | revisión de código | Medio | no tocar |
| Buscador | Verified | `buscar/page.tsx` | fallback ignoraba filtros | fallback conserva filtros | TypeScript/build | Medio | commit previo |

No se tocaron reservas, pagos, disponibilidad, IDs, slugs, landings de isla ni seguridad.
