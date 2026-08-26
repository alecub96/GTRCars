# Informe de regresión

## Regresiones comprobadas

| Área | Resultado | Evidencia |
|---|---|---|
| TypeScript | PASS | `npx tsc --noEmit` |
| Prisma schema | PASS | `npx prisma validate` |
| Integridad anti-demo en código | PASS | `npm run audit:integrity` |
| Build | PASS con advertencia | `npm run build`; timeout de pool MariaDB durante generación |
| Producción `/`, `/buscar`, `/seguridad` | PASS HTTP | smoke curl 200 |
| Producción metadata | BLOCKED_EXTERNAL | HTML remoto inspeccionado conserva copy/meta antiguos; falta desplegar el commit actual |
| Producción DB demo | BLOCKED_EXTERNAL | requiere acceso de lectura a MariaDB remota |
| Lint | BLOCKED_EXTERNAL | ejecución completa necesita aislar errores preexistentes y confirmar CI |

## Riesgos pendientes

- El auto-saneamiento de fixtures se ejecuta al cargar ciertas rutas, pero debe comprobarse contra la base remota.
- El despliegue remoto no está sincronizado con el commit local más reciente.
- No hay pruebas E2E de navegador automatizadas en el repositorio.
