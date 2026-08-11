export type BlogSection = { heading: string; paragraphs: string[]; bullets?: string[] };
export type BlogArticle = {
  slug: string; title: string; excerpt: string; metaDescription: string;
  category: 'Propietarios' | 'Viajeros'; image: string; publishedAt: string;
  readingTime: string; keywords: string[]; sections: BlogSection[];
};

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    slug: 'alquilar-mi-camper-en-canarias-guia-propietarios', category: 'Propietarios',
    title: 'Cómo alquilar mi camper en Canarias: guía para propietarios',
    excerpt: 'Los pasos esenciales para preparar, publicar y gestionar tu camper con confianza.',
    metaDescription: 'Aprende cómo alquilar tu camper en Canarias: preparación, anuncio, entregas, calendario y claves para conseguir buenas valoraciones.',
    image: '/Islas/gran%20canaria.png', publishedAt: '2026-08-11', readingTime: '8 min',
    keywords: ['alquilar mi camper en Canarias', 'alquiler camper particulares', 'publicar camper Canarias'],
    sections: [
      { heading: 'Prepara la camper antes de publicarla', paragraphs: ['Una experiencia excelente empieza antes de recibir la primera solicitud. Revisa mecánica, neumáticos, luces, niveles, instalación de gas y electricidad, y deja por escrito cómo funciona cada equipo.', 'Retira objetos personales, crea espacios de almacenaje útiles y prepara un inventario sencillo. La limpieza, el orden y unas instrucciones claras reducen incidencias y mejoran las valoraciones.'], bullets: ['Documentación y mantenimiento al día', 'Inventario con fotografías', 'Manual breve de uso', 'Kit básico de limpieza y emergencia'] },
      { heading: 'Crea un anuncio que genere confianza', paragraphs: ['Describe con precisión plazas para viajar y dormir, medidas, consumo orientativo, equipamiento y limitaciones. Evita promesas ambiguas: la exactitud convierte mejor que un anuncio exagerado.', 'Incluye fotografías luminosas del exterior, cama montada, cocina, baño si existe y almacenaje. Añade la isla, municipio de entrega y condiciones de recogida.'] },
      { heading: 'Organiza reservas y entregas', paragraphs: ['Mantén el calendario actualizado y bloquea las fechas de uso personal. Antes de aceptar, confirma horarios, número de viajeros y experiencia de conducción.', 'En la entrega, revisad juntos kilometraje, combustible, estado e inventario. Un proceso repetible protege a ambas partes y transmite profesionalidad.'] },
    ],
  },
  {
    slug: 'cuanto-cobrar-alquiler-camper-canarias', category: 'Propietarios',
    title: 'Cuánto cobrar por alquilar una camper en Canarias',
    excerpt: 'Método práctico para fijar un precio competitivo sin perder rentabilidad.',
    metaDescription: 'Calcula el precio de alquiler de tu camper en Canarias considerando temporada, costes, equipamiento, estancia mínima y demanda.',
    image: '/Islas/tenerife.png', publishedAt: '2026-08-10', readingTime: '7 min',
    keywords: ['precio alquiler camper Canarias', 'rentabilidad camper', 'cuánto cobrar camper'],
    sections: [
      { heading: 'Calcula tu coste real por día', paragraphs: ['Suma mantenimiento, seguro, impuestos, aparcamiento, limpieza y depreciación anual. Divide los costes fijos entre una estimación prudente de días alquilados y añade el coste variable de cada reserva.', 'El precio debe cubrir el uso adicional del vehículo y dejar margen para imprevistos; competir únicamente por ser el más barato suele deteriorar la experiencia.'] },
      { heading: 'Ajusta el precio a temporada y demanda', paragraphs: ['Canarias tiene demanda durante todo el año, pero vacaciones, puentes y eventos elevan la ocupación. Define una tarifa base y reglas transparentes para periodos de alta demanda.', 'Una estancia mínima de dos o tres noches reduce rotaciones y costes de entrega. Los descuentos semanales pueden mejorar la ocupación sin devaluar el anuncio.'] },
      { heading: 'Comunica qué incluye la tarifa', paragraphs: ['Aclara kilometraje incluido, limpieza, ropa de cama, menaje y extras. El viajero compara mejor cuando entiende el coste final desde el principio.', 'Revisa cada mes consultas, conversión y ocupación. Si recibes muchas visitas y pocas reservas, mejora primero fotografías y descripción antes de bajar el precio.'] },
    ],
  },
  {
    slug: 'fotos-anuncio-camper-que-consiguen-reservas', category: 'Propietarios',
    title: 'Fotos para anunciar una camper: guía para conseguir más reservas',
    excerpt: 'Una sesión sencilla para mostrar espacio, equipamiento y estado real del vehículo.',
    metaDescription: 'Descubre qué fotos necesita un anuncio de camper, cómo prepararlas y en qué orden publicarlas para atraer más reservas.',
    image: '/Islas/lanzarote.png', publishedAt: '2026-08-09', readingTime: '6 min',
    keywords: ['fotos anuncio camper', 'anunciar autocaravana', 'más reservas camper'],
    sections: [
      { heading: 'Prepara la escena', paragraphs: ['Limpia cristales y superficies, ordena cables y abre cortinas. Fotografía con luz natural y evita filtros que cambien los colores reales.', 'Escoge un lugar permitido, seguro y sin elementos que distraigan. La camper debe ser la protagonista.'] },
      { heading: 'La lista de fotografías imprescindible', paragraphs: ['Empieza con una imagen exterior de tres cuartos y continúa con salón, cama, cocina, cabina, baño, almacenaje y equipamiento exterior. Añade detalles que respondan dudas habituales.'], bullets: ['Exterior completo', 'Distribución de día y de noche', 'Camas preparadas', 'Cocina y frigorífico', 'Baño y ducha', 'Maletero y accesorios'] },
      { heading: 'Orden y honestidad', paragraphs: ['La primera foto debe explicar en segundos qué tipo de vehículo es. Alterna planos generales y detalles para que el viajero entienda las proporciones.', 'Muestra también cualquier desgaste relevante. La transparencia evita expectativas incorrectas y protege tus valoraciones.'] },
    ],
  },
  {
    slug: 'entrega-devolucion-camper-checklist-propietario', category: 'Propietarios',
    title: 'Entrega y devolución de una camper: checklist del propietario',
    excerpt: 'Un proceso ordenado para reducir daños, retrasos y malentendidos.',
    metaDescription: 'Checklist de entrega y devolución para propietarios de campers: documentación, inventario, fotos, combustible y explicación al viajero.',
    image: '/Islas/fuerteventura.png', publishedAt: '2026-08-08', readingTime: '7 min',
    keywords: ['checklist entrega camper', 'devolución autocaravana', 'propietario alquiler camper'],
    sections: [
      { heading: 'Antes de la llegada', paragraphs: ['Confirma lugar y hora, revisa limpieza y carga baterías y depósitos según lo acordado. Ten a mano documentación, inventario y teléfonos de asistencia.', 'Reserva tiempo suficiente: una entrega apresurada provoca errores y llamadas durante el viaje.'] },
      { heading: 'Revisión conjunta', paragraphs: ['Registra fotografías exteriores e interiores, kilometraje y combustible. Explica dimensiones, cuadro eléctrico, agua, gas, montaje de cama y vaciado responsable.', 'Pide al viajero que repita las operaciones más importantes. Esa comprobación práctica es más eficaz que una explicación larga.'] },
      { heading: 'Al devolver el vehículo', paragraphs: ['Repite las mismas fotos y compara inventario, kilometraje y niveles. Anota cualquier incidencia con calma y deja constancia en la reserva.', 'Si todo está correcto, cierra la entrega rápidamente y solicita una valoración honesta.'] },
    ],
  },
  {
    slug: 'mejorar-rentabilidad-camper-sin-bajar-precio', category: 'Propietarios',
    title: 'Cómo mejorar la rentabilidad de tu camper sin bajar el precio',
    excerpt: 'Mejoras de servicio y gestión que aumentan ocupación y valor percibido.',
    metaDescription: 'Aumenta la rentabilidad de tu camper con mejor anuncio, disponibilidad, extras útiles y una experiencia de entrega profesional.',
    image: '/Islas/la%20palma.png', publishedAt: '2026-08-07', readingTime: '7 min',
    keywords: ['rentabilidad alquiler camper', 'ganar dinero camper', 'reservas camper Canarias'],
    sections: [
      { heading: 'Mejora la conversión del anuncio', paragraphs: ['Responde rápido, mantén calendario y precio actualizados y completa todas las características. Una consulta contestada con claridad puede valer más que un descuento.', 'Revisa la portada del anuncio en móvil: título, primera foto, precio y capacidad deben entenderse de inmediato.'] },
      { heading: 'Añade valor útil', paragraphs: ['Ropa de cama, sillas, mesa, kit de cocina o entrega en puntos acordados pueden justificar una tarifa mejor. Ofrece solo extras que puedas mantener en buen estado.', 'Un manual propio con rutas, supermercados y lugares autorizados aporta una experiencia local difícil de copiar.'] },
      { heading: 'Mide beneficio, no solo ingresos', paragraphs: ['Registra ingresos, limpieza, mantenimiento y horas de gestión por reserva. Favorece estancias que reduzcan rotación y desgaste.', 'Consulta con un profesional las obligaciones fiscales y aseguradoras aplicables a tu situación. Una operación ordenada protege la rentabilidad a largo plazo.'] },
    ],
  },
  {
    slug: 'ruta-camper-gran-canaria-7-dias', category: 'Viajeros',
    title: 'Ruta en camper por Gran Canaria en 7 días',
    excerpt: 'Costa, cumbres y pueblos en una ruta circular pensada para viajar sin prisas.',
    metaDescription: 'Planifica una ruta en camper por Gran Canaria de 7 días: norte, cumbre, sur y oeste con consejos de conducción y pernocta responsable.',
    image: '/Islas/gran%20canaria.png', publishedAt: '2026-08-06', readingTime: '9 min',
    keywords: ['ruta camper Gran Canaria', 'Gran Canaria en autocaravana', 'viaje camper 7 días'],
    sections: [
      { heading: 'Días 1 y 2: capital y norte', paragraphs: ['Empieza en Las Palmas de Gran Canaria y continúa hacia Arucas, Firgas, Moya y Agaete. La ruta oficial de turismo destaca el contraste entre ciudad, costa norte y paisajes rurales.', 'Evita encadenar demasiadas paradas. Las carreteras secundarias son lentas y forman parte del viaje.'] },
      { heading: 'Días 3 y 4: cumbre', paragraphs: ['Sube hacia Tejeda y la zona central comprobando antes meteorología y accesos. El interior ofrece miradores y senderos, pero exige atención a anchura, curvas y lugares permitidos para estacionar.', 'Compra productos locales y lleva agua suficiente; utiliza áreas autorizadas para servicios y residuos.'] },
      { heading: 'Días 5 a 7: sur y oeste', paragraphs: ['Desciende hacia Maspalomas y continúa por Mogán y La Aldea. Turismo de Gran Canaria propone el suroeste como combinación de playas, pueblos y paisaje interior.', 'Consulta señalización y ordenanzas de cada municipio. Reserva tiempo para devolver la camper limpia y con los niveles acordados.'] },
    ],
  },
  {
    slug: 'ruta-camper-tenerife-8-dias', category: 'Viajeros',
    title: 'Ruta en camper por Tenerife en 8 días',
    excerpt: 'Un itinerario equilibrado por norte, Teide, Anaga y costa sur.',
    metaDescription: 'Ruta camper por Tenerife en 8 días con itinerario por La Laguna, Anaga, norte, Teide y costa sur, más consejos prácticos.',
    image: '/Islas/Tenerife.png', publishedAt: '2026-08-05', readingTime: '9 min',
    keywords: ['ruta camper Tenerife', 'Tenerife en autocaravana', 'viajar en camper Tenerife'],
    sections: [
      { heading: 'La Laguna, Anaga y el norte', paragraphs: ['Dedica los primeros días a La Laguna y los paisajes de Anaga, siguiendo accesos permitidos y evitando improvisar con vehículos grandes en carreteras estrechas.', 'Continúa hacia Puerto de la Cruz, La Orotava, Garachico e Icod. La web oficial de Tenerife propone itinerarios en coche de uno, tres y ocho días que ayudan a distribuir las etapas.'] },
      { heading: 'Teide con planificación', paragraphs: ['Consulta el estado de carreteras y la previsión antes de subir. Lleva abrigo incluso cuando haga calor en la costa y no ocupes apartaderos ni accesos de emergencia.', 'Las reservas o permisos de determinadas actividades son independientes del acceso por carretera; verifica siempre la información oficial.'] },
      { heading: 'Costa sur y regreso', paragraphs: ['Completa la vuelta por el sur con jornadas más relajadas. Ajusta la ruta a las condiciones reales, no a una lista rígida de lugares.', 'Vacía aguas únicamente en puntos habilitados y devuelve el vehículo con margen suficiente.'] },
    ],
  },
  {
    slug: 'pernoctar-camper-canarias-estacionar-acampar', category: 'Viajeros',
    title: 'Pernoctar en camper en Canarias: estacionar no es acampar',
    excerpt: 'Qué debes comprobar para dormir con respeto y evitar sanciones.',
    metaDescription: 'Diferencias entre estacionar y acampar en camper, normas de la DGT, ordenanzas municipales y buenas prácticas en Canarias.',
    image: '/Islas/la%20gomera.png', publishedAt: '2026-08-04', readingTime: '8 min',
    keywords: ['pernoctar camper Canarias', 'acampar autocaravana Canarias', 'dormir en camper legal'],
    sections: [
      { heading: 'Cuándo está estacionada una camper', paragraphs: ['La DGT explica que un vehículo está estacionado si ocupa un lugar permitido, respeta marcas y límites temporales y no despliega elementos fuera de su perímetro. Que haya personas dentro no convierte por sí solo el estacionamiento en acampada.', 'No saques toldos, mesas, sillas o estabilizadores, ni realices vertidos. Respeta siempre señales y gálibos.'] },
      { heading: 'Las ordenanzas locales también cuentan', paragraphs: ['Los ayuntamientos pueden establecer limitaciones de tiempo o zonas específicas. Comprueba la señalización al llegar y consulta fuentes municipales cuando tengas dudas.', 'Acampar corresponde a espacios habilitados. Las áreas y campings ofrecen servicios y reducen el impacto sobre residentes y entorno.'] },
      { heading: 'Buenas prácticas', paragraphs: ['Evita ruidos, no ocupes varias plazas y no bloquees vistas, accesos o caminos. Nunca viertas aguas grises o negras fuera de instalaciones autorizadas.', 'La norma puede cambiar; revisa la DGT y el ayuntamiento antes del viaje.'] },
    ],
  },
  {
    slug: 'que-llevar-viaje-camper-canarias-checklist', category: 'Viajeros',
    title: 'Qué llevar a un viaje en camper por Canarias: checklist',
    excerpt: 'Equipaje ligero, seguridad y pequeños objetos que realmente ayudan.',
    metaDescription: 'Checklist para viajar en camper por Canarias: documentación, ropa, cocina, tecnología, playa, montaña y devolución del vehículo.',
    image: '/Islas/fuerteventura.png', publishedAt: '2026-08-03', readingTime: '6 min',
    keywords: ['qué llevar camper Canarias', 'checklist viaje camper', 'equipaje autocaravana'],
    sections: [
      { heading: 'Documentación y seguridad', paragraphs: ['Lleva permiso de conducir válido, identificación, datos de la reserva y teléfonos de asistencia. Guarda una copia digital accesible.', 'Confirma qué incluye la camper para no duplicar menaje, ropa de cama o accesorios.'], bullets: ['Permiso e identificación', 'Reserva y asistencia', 'Protección solar', 'Calzado cerrado', 'Botella reutilizable'] },
      { heading: 'Ropa para varios climas', paragraphs: ['En una misma isla puedes pasar de playa a cumbre. Combina prendas ligeras con cortavientos y una capa de abrigo; evita llenar el espacio con maletas rígidas.', 'Usa bolsas blandas que puedan plegarse y mantén libres salidas y pasillos.'] },
      { heading: 'Antes de devolver', paragraphs: ['Reserva tiempo para combustible, limpieza y vaciado en puntos autorizados. Revisa armarios y toma fotografías del estado final.', 'Un equipaje simple facilita tanto la ruta como la entrega.'] },
    ],
  },
  {
    slug: 'primera-vez-alquilando-camper-canarias', category: 'Viajeros',
    title: 'Primera vez alquilando una camper en Canarias: guía esencial',
    excerpt: 'Cómo elegir vehículo, conducir, organizar la ruta y disfrutar sin estrés.',
    metaDescription: 'Guía para alquilar una camper por primera vez en Canarias: elección, conducción, agua, energía, pernocta y devolución.',
    image: '/Islas/la%20graciosa.png', publishedAt: '2026-08-02', readingTime: '8 min',
    keywords: ['alquilar camper por primera vez', 'camper Canarias principiantes', 'consejos autocaravana'],
    sections: [
      { heading: 'Elige por distribución, no solo por tamaño', paragraphs: ['Comprueba plazas homologadas, camas, baño, cocina y almacenaje. Una camper compacta puede ser más cómoda en carreteras estrechas; una grande ofrece más espacio pero exige mayor atención.', 'Lee condiciones de kilometraje, fianza, limpieza y horarios antes de reservar.'] },
      { heading: 'Aprende los sistemas en la entrega', paragraphs: ['Pide una demostración de agua, batería, gas, frigorífico, cama y vaciado. Anota altura y anchura del vehículo y comprueba el combustible acordado.', 'Conduce con anticipación: amplía distancias, vigila el viento y no entres en calles dudosas sin revisar la ruta.'] },
      { heading: 'Viaja más despacio', paragraphs: ['Planifica menos kilómetros y más tiempo por parada. Confirma cada noche un lugar permitido y una alternativa.', 'La libertad camper funciona mejor con responsabilidad: consumo moderado de agua, residuos bien gestionados y respeto por residentes y espacios naturales.'] },
    ],
  },
];

export function getBlogArticle(slug: string) {
  return BLOG_ARTICLES.find((article) => article.slug === slug);
}
