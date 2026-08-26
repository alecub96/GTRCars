# Production smoke test

Fecha: 2026-08-26

| URL | HTTP | Content-Type | Resultado |
|---|---:|---|---|
| `/` | 200 | `text/html` | PASS |
| `/buscar` | 200 | `text/html` | PASS |
| `/seguridad` | 200 | `text/html` | PASS |
| `/robots.txt` | 200 | `text/plain` | PASS |
| `/sitemap.xml` | 200 | `application/xml` | PASS |

## Observaciones HTML

- `/` y `/buscar` tienen canonical en `https://vaneando.com`.
- `/buscar` sin facetas se publica con `index,follow`; sus variantes con facetas requieren una comprobación adicional después del deploy actual.
- Producción aún sirve metadata antigua en Open Graph/Twitter y copy de confianza antiguo; no corresponde al estado del repositorio local.
- El sitemap remoto no contiene los slugs demo conocidos comprobados.

## Bloqueos

No se puede comprobar desde este entorno el contenido de la base de datos remota, el estado del despliegue, el DNS del proveedor, Core Web Vitals reales, consola de navegador en dispositivos físicos ni flujos autenticados de pago/reserva.
