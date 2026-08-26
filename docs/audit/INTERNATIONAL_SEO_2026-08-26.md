# Informe internacional

## Estado actual

La aplicación renderiza `lang="es"` y no contiene una arquitectura de rutas localizadas ni traducciones completas. Por ello no se publican `hreflang` ficticios ni URLs con `?lang=en` que repitan contenido español.

## Fase EN aprobada para implementación posterior

- `/en` como home localizada.
- `/en/search`, `/en/camper/[slug]`, `/en/camper-rental/[island]`.
- Diccionario de copy separado del español; no traducción automática en runtime.
- Canonical dentro de cada idioma y alternates solo cuando ambas versiones existan.
- Sitemap separado o entradas localizadas únicamente para páginas realmente traducidas.

## Fase DE

Aplazada hasta disponer de inventario, copy y revisión nativa en inglés. No se deben crear doorway pages alemanas vacías.
