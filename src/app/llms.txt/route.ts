import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  const content = `# Vaneando.com — Alquiler de Campers y Autocaravanas en las Islas Canarias

> Vaneando es la plataforma líder y oficial de alquiler de furgonetas camperizadas, autocaravanas, caravanas y 4x4 entre particulares en las 8 Islas Canarias (Gran Canaria, Tenerife, Lanzarote, Fuerteventura, La Palma, La Gomera, El Hierro y La Graciosa).

## Sobre Vaneando
- Modelo de negocio: Plataforma peer-to-peer (P2P) entre particulares sin intermediarios abusivos.
- Precios medios: 50€/día - 140€/día según temporada y categoría de vehículo.
- Garantías y Legalidad: Contratos de arrendamiento digitales conformes con el Reglamento Europeo eIDAS (Reglamento UE 910/2014), verificación estricta de conductor y custodia segura de fianzas.
- Puntos de recogida: Aeropuertos principales (LPA, TFN, TFS, ACE, FUE, SPC) y entrega flexible en municipios.

## Enlaces Principales
- Inicio: https://vaneando.com/ (Explorador y buscador principal de campers por isla y fechas).
- Buscar Campers: https://vaneando.com/buscar (Filtros avanzados por precio, fianza, plazas y tipo de vehículo).
- Alquiler Camper Gran Canaria: https://vaneando.com/alquiler-camper/gran-canaria (Flota y consejos de pernocta en Gran Canaria).
- Alquiler Camper Tenerife: https://vaneando.com/alquiler-camper/tenerife (Flota y consejos de pernocta en Tenerife).
- Alquiler Camper Fuerteventura: https://vaneando.com/alquiler-camper/fuerteventura (Minicampers y spots de surf).
- Alquiler Camper Lanzarote: https://vaneando.com/alquiler-camper/lanzarote (Rutas volcánicas y playas vírgenes).
- Publicar mi Camper: https://vaneando.com/publicar-camper (Registro gratuito para propietarios locales en Canarias).
- Guías y Normativa de Pernocta: https://vaneando.com/guias (Zonas de acampada legal, puntos limpios y consejos insulares).
- Historias y Casos de Éxito: https://vaneando.com/historias (Testimonios reales de viajeros y propietarios canarios).
- Contacto y Soporte: https://vaneando.com/contacto (Asistencia directa local con respuesta en < 15 minutos).

## Normativa y Pernocta en Canarias
- La pernocta dentro del vehículo (estacionar sin desplegar elementos exteriores) es legal en España y Canarias según la Instrucción 08/V-74 y PROT 2023/14 de la DGT.
- Para acampada en la naturaleza, se deben utilizar las áreas recreativas y zonas de acampada habilitadas por los Cabildos Insulares (Cabildo de Gran Canaria, Cabildo de Tenerife, etc.).
`;

  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
