# Auditoría backend y frontend

## Alcance

Se revisan rutas públicas, enlaces internos estáticos, llamadas a APIs, metadatos, schema, OG, ALT, formularios de búsqueda y componentes de compartir. Las rutas que requieren sesión o datos reales deben probarse con una cuenta autorizada; no se fuerzan reservas, pagos ni cambios de datos.

## Pruebas ejecutables

- `node scripts/audit-web-integrity.mjs`: rutas, enlaces y APIs referenciadas.
- `node scripts/audit-integrity.mjs`: invariantes de seguridad, demo, disponibilidad, filtros y privacidad.
- `node scripts/audit-blog-quality.mjs`: 30 guías y estructura SEO.
- `npx tsc --noEmit`: TypeScript.
- `npx next build --webpack`: compilación y generación de rutas.

## Checklist manual

| Superficie | Resultado |
|---|---|
| `/` | Verificar navegación, CTA, footer y consola |
| `/buscar` | Verificar isla, tipo, viajeros, precios, orden, mapa y lista |
| `/camper/{slug}` | Verificar OG, galería, disponibilidad, contacto y compartir |
| `/seguridad`, `/guias`, `/publicar-camper` | Verificar enlaces y formularios |
| 375/390/430/768/1024/1440 px | Revisar overflow, botones y navegación |
| Backend APIs | Verificar 401/403/422/404/500 esperados y no exponer PII |
| EN | No declarar DONE: no existe arquitectura EN verificada |

## Hallazgos y límites

La prueba de producción realizada sobre `/buscar?island=Tenerife` devolvió únicamente vehículos de Tenerife y no registró errores de consola. CWV before/after requiere Lighthouse o CrUX en producción; no se inventan métricas. Google Business, Search Console y publicación en redes son acciones externas.
