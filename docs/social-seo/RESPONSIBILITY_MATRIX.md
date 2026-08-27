# Matriz de responsabilidades

| TASK | ANTIGRAVITY | OWNER | STATUS | EVIDENCE |
|---|---|---|---|---|
| Configuración social | Sí | Confirmar URLs | Instagram/Facebook presentes; resto BLOCKED_EXTERNAL | `src/lib/social-links.ts` |
| sameAs | Sí | Validar perfiles | Implementado solo con URLs existentes en repo | `src/app/layout.tsx` |
| Enlaces sociales | Sí | Confirmar perfiles | Implementado en footer | `HomeClientHero.tsx` |
| OG de fichas | Sí | Mantener fotos reales | Implementado | `camper/[slug]/page.tsx` |
| UTM | Sí | Usar convención | Documentado | `UTM_NAMING_CONVENTION.md` |
| Compartir ficha | Sí | Compartir manualmente | Implementado | `ShareVehicleButton` |
| Analytics | Sí | Conectar proveedor autorizado | Eventos preparados sin PII | `src/lib/analytics.ts` |
| Social kit | Sí | Aplicar copies | Documentado | `OWNER_SOCIAL_KIT.md` |
| Publicar redes | No | Sí | OWNER ACTION REQUIRED | `OWNER_EXTERNAL_ACTIONS.md` |
| Google Business | No | Sí | OWNER ACTION REQUIRED | `OWNER_EXTERNAL_ACTIONS.md` |
| Search Console | No | Sí | OWNER ACTION REQUIRED | `OWNER_EXTERNAL_ACTIONS.md` |
