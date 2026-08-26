# Matriz de aceptación

| Requisito | Estado local |
|---|---|
| No inventar inventario público | Cumplido: fixtures fuera de search, detalle y sitemap |
| Isla no mezcla resultados | Cumplido en query DB exacta y sin fallback demo |
| Vehículo inactivo no indexable | Cumplido: query de detalle exige `ACTIVE` |
| Facetas arbitrarias no indexables | Cumplido: `noindex,follow` y canonical `/buscar` |
| Fechas inválidas no llegan a búsqueda | Cumplido: `parseDateOnly` |
| Historias ficticias no visibles | Cumplido: estado vacío verificable |
| Claims de liderazgo/oficialidad | Retirados de las superficies principales; revisión editorial pendiente en artículos históricos |
| Seguro/fianza | Copy conservador en seguridad; requiere validación legal del contrato vigente |
| Reviews | API exige reserva completada y usuario participante |
| Slugs | Resolución exacta; alias 301 requiere histórico de producción |
| Internacionalización | No se declaran idiomas inexistentes; EN/DE quedan planificados |
| CWV/DNS/HTTP | Requiere staging o producción |
