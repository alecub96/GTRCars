import type { BlogArticle, BlogSection } from './blog';

type ArticleSeed = {
  island: string;
  audience: 'Viajeros' | 'Propietarios';
  kind: string;
  focus: string;
  slugPart: string;
};

const islands = [
  { name: 'Gran Canaria', slug: 'gran-canaria', image: '/Islas/gran%20canaria.png' },
  { name: 'Fuerteventura', slug: 'fuerteventura', image: '/Islas/fuerteventura.png' },
  { name: 'Lanzarote', slug: 'lanzarote', image: '/Islas/lanzarote.png' },
  { name: 'Tenerife', slug: 'tenerife', image: '/Islas/tenerife.png' },
];

const travelerTopics = [
  ['alquiler camper', 'guía completa para alquilar una camper', 'alquiler-camper'],
  ['precios de alquiler camper', 'precios y presupuesto real', 'precio-alquiler-camper'],
  ['alquiler camper barato', 'cómo ahorrar sin elegir a ciegas', 'alquiler-camper-barato'],
  ['camper para parejas', 'cómo elegir una camper para dos personas', 'camper-parejas'],
  ['camper para familias', 'cómo organizar un viaje familiar', 'camper-familias'],
  ['camper con mascota', 'consejos para viajar con mascota', 'camper-mascota'],
  ['camper para principiantes', 'manual para tu primer alquiler', 'camper-principiantes'],
  ['camper desde el aeropuerto', 'recogida, horarios y primeros pasos', 'camper-aeropuerto'],
  ['ruta camper de 3 días', 'itinerario de tres días', 'ruta-camper-3-dias'],
  ['ruta camper de 5 días', 'itinerario de cinco días', 'ruta-camper-5-dias'],
  ['ruta camper de 7 días', 'itinerario de siete días', 'ruta-camper-7-dias'],
  ['camper en invierno', 'viajar en temporada de invierno', 'camper-invierno'],
  ['camper en verano', 'organizar el viaje de verano', 'camper-verano'],
  ['camper y senderismo', 'rutas de senderismo desde una camper', 'camper-senderismo'],
  ['camper y surf', 'viaje camper para practicar surf', 'camper-surf'],
];

const ownerTopics = [
  ['rentabilidad de una camper', 'si alquilar una camper puede ser rentable', 'rentabilidad-camper'],
  ['comprar una camper para alquilar', 'cómo estudiar la compra de un vehículo', 'comprar-camper-alquilar'],
  ['camper usada para alquilar', 'ventajas y riesgos de una unidad usada', 'camper-usada-alquilar'],
  ['autocaravana como inversión', 'números de una autocaravana de alquiler', 'autocaravana-inversion'],
  ['furgoneta camper como negocio', 'cómo plantear el negocio desde cero', 'furgoneta-camper-negocio'],
  ['precio de alquiler camper', 'cómo fijar una tarifa sostenible', 'precio-camper-propietario'],
  ['ocupación de una camper', 'cómo calcular y mejorar la ocupación', 'ocupacion-camper'],
  ['gastos de una camper de alquiler', 'costes que debes presupuestar', 'gastos-camper-alquiler'],
  ['financiar una camper', 'cómo comparar financiación e inversión', 'financiar-camper'],
  ['varias campers en alquiler', 'cómo pasar de una unidad a una pequeña flota', 'flota-campers'],
];

const natureTopics = [
  ['camper y playas', 'playas y costa con una camper', 'camper-playas'],
  ['camper y miradores', 'miradores y carreteras panorámicas', 'camper-miradores'],
  ['camper y volcanes', 'paisajes volcánicos y visitas responsables', 'camper-volcanes'],
  ['camper y observación de estrellas', 'cielo nocturno y planificación', 'camper-estrellas'],
  ['camper y gastronomía', 'mercados, producto local y paradas', 'camper-gastronomia'],
  ['camper y fotografía', 'lugares y horarios para fotografiar', 'camper-fotografia'],
  ['camping y camper', 'cómo planificar campings y servicios', 'camping-camper'],
  ['senderismo desde una camper', 'cómo combinar conducción y montaña', 'senderismo-camper'],
  ['turismo responsable en camper', 'cómo cuidar el territorio', 'turismo-responsable-camper'],
  ['camper y actividades al aire libre', 'organizar una escapada activa', 'actividades-camper'],
];

const comparisonTopics = [
  ['camper frente a hotel', 'camper frente a hotel', 'camper-vs-hotel'],
  ['camper frente a coche de alquiler', 'camper frente a coche y alojamiento', 'camper-vs-coche-alquiler'],
  ['camper compacta frente a autocaravana', 'camper compacta frente a autocaravana', 'camper-vs-autocaravana'],
  ['Yescapa y plataformas locales', 'plataformas internacionales frente a una opción local', 'yescapa-vs-plataforma-local'],
  ['alquiler profesional frente a particular', 'flota profesional frente a propietario particular', 'empresa-vs-particular-camper'],
];

const seeds: ArticleSeed[] = [];
for (const island of islands) {
  travelerTopics.forEach(([kind, focus, slugPart]) => seeds.push({ island: island.name, audience: 'Viajeros', kind, focus, slugPart: `${slugPart}-${island.slug}` }));
  ownerTopics.forEach(([kind, focus, slugPart]) => seeds.push({ island: island.name, audience: 'Propietarios', kind, focus, slugPart: `${slugPart}-${island.slug}` }));
  natureTopics.forEach(([kind, focus, slugPart]) => seeds.push({ island: island.name, audience: 'Viajeros', kind, focus, slugPart: `${slugPart}-${island.slug}` }));
  comparisonTopics.forEach(([kind, focus, slugPart]) => seeds.push({ island: island.name, audience: 'Viajeros', kind, focus, slugPart: `${slugPart}-${island.slug}` }));
}

const extraSeeds: ArticleSeed[] = [
  { island: 'Canarias', audience: 'Propietarios', kind: 'negocio de alquiler camper', focus: 'modelo de negocio para empezar con una camper', slugPart: 'negocio-alquiler-camper-canarias' },
  { island: 'Canarias', audience: 'Propietarios', kind: 'inversión en campers', focus: 'comparativa entre comprar una camper y comprar un piso para alquilar', slugPart: 'camper-vs-piso-inversion' },
  { island: 'Canarias', audience: 'Propietarios', kind: 'plan financiero camper', focus: 'cómo preparar un plan financiero prudente', slugPart: 'plan-financiero-camper' },
  { island: 'Canarias', audience: 'Propietarios', kind: 'gestionar una camper a distancia', focus: 'cómo coordinar reservas y entregas viviendo en otra isla', slugPart: 'gestionar-camper-distancia' },
  { island: 'Canarias', audience: 'Propietarios', kind: 'seguro para camper de alquiler', focus: 'qué preguntas hacer sobre seguro y asistencia', slugPart: 'seguro-camper-alquiler-propietario' },
  { island: 'Canarias', audience: 'Propietarios', kind: 'rentabilidad de una autocaravana', focus: 'cómo calcular la rentabilidad de una autocaravana', slugPart: 'rentabilidad-autocaravana-canarias' },
  { island: 'Canarias', audience: 'Viajeros', kind: 'islas Canarias en camper', focus: 'cómo elegir isla, fechas y tipo de vehículo', slugPart: 'islas-canarias-en-camper' },
  { island: 'Canarias', audience: 'Viajeros', kind: 'viaje camper entre islas', focus: 'cómo valorar un viaje con ferry', slugPart: 'viaje-camper-entre-islas' },
  { island: 'Canarias', audience: 'Viajeros', kind: 'equipaje camper', focus: 'lista de equipaje para un viaje por Canarias', slugPart: 'equipaje-camper-canarias' },
  { island: 'Canarias', audience: 'Viajeros', kind: 'primer viaje en camper', focus: 'guía de preparación desde la reserva hasta la devolución', slugPart: 'primer-viaje-camper-canarias' },
];
seeds.push(...extraSeeds);

const paragraphs = (seed: ArticleSeed, section: string, index: number) => [
  `En ${seed.island}, ${seed.focus} requiere mirar más allá de una tarifa o de una fotografía. Esta guía está pensada para ${seed.audience === 'Viajeros' ? 'quien quiere viajar con información suficiente' : 'quien estudia ofrecer un vehículo en alquiler'} y convierte la intención de búsqueda “${seed.kind}” en decisiones concretas. El relieve, el viento, la meteorología, los accesos y la temporada cambian de una zona a otra, por lo que una recomendación válida debe explicar también sus límites.`,
  `Empieza por definir fechas, número de personas, presupuesto, experiencia y objetivo principal. Después separa lo que está confirmado de lo que debe preguntarse: plazas homologadas, distribución de camas, dimensiones, equipamiento, entrega, kilometraje, limpieza, fianza, seguro y asistencia. En ${seed.island}, la distancia en el mapa no siempre representa el tiempo real de conducción; deja margen para descansar, hacer compras y cambiar de plan si las condiciones empeoran.`,
  `Un ejemplo práctico para el apartado ${index + 1}, “${section}”, es comparar tres opciones equivalentes y anotar qué incluye cada una. La opción más barata puede exigir más desplazamiento o cobrar equipamiento aparte, mientras que una tarifa superior puede ahorrar tiempo y explicar mejor el servicio. La decisión correcta es la que puedes entender, pagar y utilizar sin depender de suposiciones.`,
  `Antes de confirmar, formula preguntas concretas en la mensajería de Vaneando y conserva las respuestas. Durante la entrega, fotografía el estado, revisa el inventario y prueba los sistemas que vayas a utilizar. Durante la ruta, respeta las normas de estacionamiento, las zonas protegidas y los lugares autorizados para servicios. A la devolución, comunica cualquier incidencia y cierra la revisión con el mismo cuidado con el que empezó.`,
];

function makeArticle(seed: ArticleSeed): BlogArticle {
  const island = islands.find((item) => item.name === seed.island);
  const title = `${seed.focus} en ${seed.island}: guía completa 2026`;
  const headings = [
    `Qué significa ${seed.kind} en ${seed.island}`,
    'Qué debes decidir antes de empezar',
    'Presupuesto, costes y condiciones',
    'Cómo elegir el vehículo o la estrategia adecuada',
    'Fechas, temporada y disponibilidad',
    'Entrega, documentación y revisión inicial',
    'Ruta, logística y tiempos realistas',
    'Seguridad, clima y conducción',
    'Pernocta, servicios y respeto del territorio',
    'Errores frecuentes y cómo evitarlos',
    'Checklist antes de confirmar',
    'Conclusión y próximos pasos',
  ];
  const sections: BlogSection[] = headings.map((heading, sectionIndex) => ({ heading, paragraphs: paragraphs(seed, heading, sectionIndex) }));
  const feeNote = seed.audience === 'Propietarios'
    ? 'Los cálculos de rentabilidad son orientativos: deben incluir mantenimiento, seguro, impuestos, limpieza, depreciación, financiación, días vacíos e incidencias.'
    : 'El precio final depende del anuncio y de las fechas: revisa tarifa, limpieza, extras, kilometraje, fianza, seguro, entrega y cancelación antes de reservar.';
  sections[2].paragraphs.push(feeNote);
  return {
    slug: seed.slugPart,
    category: seed.audience,
    title,
    excerpt: `${seed.focus} con criterios prácticos, costes, planificación y consejos locales para ${seed.island}.`,
    metaDescription: `${title}. Información práctica sobre precios, planificación, seguridad, rutas y condiciones para tomar una decisión informada.`,
    image: island?.image || '/Islas/gran%20canaria.png',
    publishedAt: '2026-09-03',
    readingTime: '25 min',
    keywords: [`${seed.kind} ${seed.island}`, `${seed.focus} ${seed.island}`, `${seed.kind} Canarias`],
    sections,
    faqs: [
      { question: `¿Es buena idea ${seed.kind} en ${seed.island}?`, answer: `Puede serlo si el vehículo, el presupuesto y las condiciones encajan con tu objetivo. Compara anuncios equivalentes y confirma los detalles antes de decidir.` },
      { question: '¿Qué debo revisar antes de confirmar?', answer: 'Fechas, plazas, equipamiento, precio total, limpieza, kilometraje, fianza, seguro, entrega, devolución y cancelación.' },
      { question: '¿Dónde puedo resolver mis dudas?', answer: 'Utiliza la mensajería de Vaneando y deja por escrito cualquier condición importante antes de enviar o aceptar una solicitud.' },
    ],
  };
}

export const SEO_EXPANSION_ARTICLES = seeds.map(makeArticle);
