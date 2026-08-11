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
  {
    slug: 'mejores-islas-canarias-viajar-camper', category: 'Viajeros',
    title: 'Qué isla canaria elegir para viajar en camper según tu estilo de viaje',
    excerpt: 'Una comparativa práctica de las ocho islas para elegir ritmo, paisajes, carreteras y tipo de escapada.',
    metaDescription: 'Compara Gran Canaria, Tenerife, Lanzarote, Fuerteventura, La Palma, La Gomera, El Hierro y La Graciosa para viajar en camper.',
    image: '/Islas/la%20gomera.png', publishedAt: '2026-08-01', readingTime: '12 min',
    keywords: ['mejor isla Canarias camper', 'islas Canarias autocaravana', 'viaje camper Canarias'],
    sections: [
      { heading: 'La pregunta correcta no es cuál es la mejor isla', paragraphs: ['Cada isla ofrece una experiencia diferente. La elección depende de si buscas playas largas, senderismo, pueblos, gastronomía, observación de estrellas o una ruta sencilla para tu primera camper.', 'También conviene considerar el tamaño del vehículo, los días disponibles y la temporada. Una semana permite conocer una isla con calma; intentar saltar entre varias puede convertir las vacaciones en una sucesión de desplazamientos.'] },
      { heading: 'Gran Canaria y Tenerife: variedad y servicios', paragraphs: ['Gran Canaria combina capital, costa, cumbres y pueblos en distancias relativamente manejables. Es una opción flexible para alternar días de playa con rutas de interior.', 'Tenerife ofrece una gran diversidad de paisajes, desde Anaga hasta el Teide y el litoral sur. Requiere planificar desniveles, carreteras estrechas y accesos con antelación.'] },
      { heading: 'Lanzarote y Fuerteventura: paisaje abierto y costa', paragraphs: ['Lanzarote funciona muy bien para una ruta de volcanes, pueblos y costa, siempre respetando los espacios protegidos y las normas de estacionamiento.', 'Fuerteventura destaca por sus playas, viento y grandes distancias. Conviene proteger la camper de arena, revisar el parte meteorológico y calcular bien agua y combustible.'] },
      { heading: 'Las islas verdes y La Graciosa', paragraphs: ['La Palma, La Gomera y El Hierro son ideales para senderismo, miradores y un ritmo pausado. Sus carreteras pueden ser exigentes; conduce sin prisas y evita programar demasiadas etapas.', 'La Graciosa requiere una logística diferente por su conexión marítima y sus caminos. Confirma qué vehículos pueden circular y dónde se permite pernoctar antes de embarcar.'] },
      { heading: 'Cómo tomar la decisión final', paragraphs: ['Elige una isla que encaje con tu forma de viajar y deja margen para el clima. Consulta información oficial, reserva actividades cuando sea necesario y pregunta al propietario por recomendaciones locales.', 'En vaneando puedes filtrar campers por isla, fechas y capacidad para encontrar un vehículo coherente con el itinerario que realmente quieres hacer.'] },
    ],
  },
  {
    slug: 'conducir-camper-carreteras-canarias', category: 'Viajeros',
    title: 'Conducir una camper por las carreteras de Canarias: consejos prácticos',
    excerpt: 'Altura, viento, pendientes y curvas: cómo preparar cada trayecto para conducir con seguridad.',
    metaDescription: 'Consejos para conducir una camper por Canarias: carreteras de montaña, viento, dimensiones, pendientes, navegación y seguridad.',
    image: '/Islas/Tenerife.png', publishedAt: '2026-07-31', readingTime: '10 min',
    keywords: ['conducir camper Canarias', 'carreteras autocaravana Canarias', 'consejos conducir furgoneta camper'],
    sections: [
      { heading: 'Antes de arrancar', paragraphs: ['Anota altura, anchura y longitud del vehículo y configura el navegador para evitar calles estrechas o caminos no adecuados. Comprueba espejos, presión de neumáticos, cierres y distribución de la carga.', 'Pregunta al propietario por las zonas que conviene evitar y por el comportamiento del vehículo con viento lateral. Una explicación de diez minutos puede ahorrarte una maniobra complicada.'] },
      { heading: 'Pendientes, curvas y carreteras de montaña', paragraphs: ['En descensos utiliza una marcha que ayude a retener el vehículo y reserva los frenos para correcciones. Mantén distancia y no te dejes llevar por el ritmo de los coches locales.', 'En curvas cerradas abre el giro solo cuando tengas visibilidad. Si no puedes pasar con seguridad, busca un lugar legal para detenerte y deja que el tráfico avance.'] },
      { heading: 'Viento, calor y carga', paragraphs: ['El viento puede afectar especialmente a vehículos altos y ligeros. Reduce velocidad, sujeta el volante con firmeza y evita adelantar o parar en lugares expuestos.', 'El calor aumenta el consumo de agua y energía. Ventila, protege la cabina y revisa niveles antes de salir hacia zonas remotas.'] },
      { heading: 'Planificar sin perder espontaneidad', paragraphs: ['Calcula trayectos por tiempo real, no solo por kilómetros. En Canarias, una distancia corta puede incluir desnivel, curvas y tráfico.', 'Guarda una alternativa para cada etapa y descarga mapas si vas a atravesar zonas con poca cobertura. La mejor ruta suele ser la que te permite llegar con luz y sin prisas.'] },
    ],
  },
  {
    slug: 'alquiler-camper-canarias-seguro-fianza', category: 'Viajeros',
    title: 'Seguro, fianza y asistencia al alquilar una camper en Canarias',
    excerpt: 'Qué revisar antes de pagar para entender la protección, las exclusiones y tu responsabilidad.',
    metaDescription: 'Guía sobre seguro de camper, fianza, asistencia y franquicia al alquilar una autocaravana en Canarias.',
    image: '/Islas/gran%20canaria.png', publishedAt: '2026-07-30', readingTime: '11 min',
    keywords: ['seguro alquiler camper Canarias', 'fianza autocaravana', 'asistencia camper Canarias'],
    sections: [
      { heading: 'No confundas seguro con fianza', paragraphs: ['El seguro cubre determinados riesgos según sus condiciones. La fianza es una cantidad de garantía que puede retenerse para responder por daños, limpieza extraordinaria, combustible o incumplimientos.', 'Lee ambas partes por separado y solicita aclaración antes de confirmar. El precio más bajo no siempre ofrece la protección más adecuada.'] },
      { heading: 'Preguntas que debes resolver', paragraphs: ['Comprueba quién conduce, territorios cubiertos, asistencia, franquicia, lunas, bajos, techo, neumáticos y daños interiores. Algunas pólizas excluyen usos o caminos concretos.', 'Pregunta cómo se comunica una incidencia y qué documentación se necesita. Guarda fotos y datos de contacto fuera del vehículo.'] },
      { heading: 'Cómo proteger la fianza', paragraphs: ['Haz la revisión de entrega con fotografías y comprueba que el inventario coincide. Conduce con prudencia, respeta límites y no subas a zonas que el contrato excluya.', 'Devuelve la camper limpia, con niveles acordados y en el horario pactado. Si surge un daño, comunícalo pronto; ocultarlo suele complicar la solución.'] },
      { heading: 'Una reserva transparente', paragraphs: ['En vaneando la ficha y el proceso de reserva deben mostrar fianza, precios, condiciones y pasos de pago antes de que confirmes. Si un punto no está claro, utiliza el chat de la reserva para dejar constancia.', 'La tranquilidad se construye con información concreta, no con promesas genéricas.'] },
    ],
  },
  {
    slug: 'publicar-camper-canarias-documentacion', category: 'Propietarios',
    title: 'Documentación y requisitos para publicar una camper en Canarias',
    excerpt: 'La lista que conviene preparar antes de crear el anuncio y recibir la primera solicitud.',
    metaDescription: 'Requisitos y documentación para publicar una camper en Canarias: vehículo, seguro, identidad, mantenimiento, fotos y contrato.',
    image: '/Islas/lanzarote.png', publishedAt: '2026-07-29', readingTime: '10 min',
    keywords: ['publicar camper Canarias requisitos', 'documentación alquiler autocaravana', 'alquilar camper legalmente'],
    sections: [
      { heading: 'Documentos del propietario y del vehículo', paragraphs: ['Prepara identificación, permiso de circulación, ficha técnica, información del seguro y datos de titularidad. La plataforma puede solicitar documentación adicional para verificar identidad y vehículo.', 'Mantén copias actualizadas y evita publicar matrículas completas o documentos visibles en las fotografías del anuncio.'] },
      { heading: 'Mantenimiento y seguridad', paragraphs: ['Antes de aceptar reservas revisa neumáticos, frenos, luces, cinturones, gas, batería, agua y elementos de emergencia. Un mantenimiento preventivo protege a viajeros y reduce cancelaciones.', 'Registra revisiones y reparaciones importantes. Un historial ordenado facilita responder dudas y demostrar profesionalidad.'] },
      { heading: 'Un anuncio verificable', paragraphs: ['Indica plazas homologadas, camas, dimensiones, transmisión, combustible, consumo orientativo y limitaciones. Las fotografías deben corresponder al estado real.', 'Explica lugar y horario de entrega, kilometraje, limpieza, fianza, extras y política de cancelación. La claridad filtra mejor las solicitudes y evita conflictos.'] },
      { heading: 'Fiscalidad y asesoramiento', paragraphs: ['La forma correcta de declarar los ingresos depende de tu situación, frecuencia, titularidad y normativa aplicable. Consulta a una gestoría y a tu aseguradora antes de comenzar.', 'Una plataforma ayuda a organizar reservas, cobros y comunicación, pero no sustituye asesoramiento legal, fiscal o asegurador personalizado.'] },
    ],
  },
  {
    slug: 'experiencia-viajero-camper-canarias-anuncio', category: 'Propietarios',
    title: 'Cómo crear una experiencia memorable para tus viajeros en Canarias',
    excerpt: 'Ideas concretas para pasar de entregar un vehículo a ofrecer una bienvenida local que se recuerde.',
    metaDescription: 'Mejora la experiencia de tus viajeros con una bienvenida local, manual de la camper, rutas de Canarias y comunicación profesional.',
    image: '/Islas/la%20palma.png', publishedAt: '2026-07-28', readingTime: '10 min',
    keywords: ['experiencia viajero camper', 'bienvenida alquiler camper', 'anfitrión camper Canarias'],
    sections: [
      { heading: 'La bienvenida empieza antes de la entrega', paragraphs: ['Envía instrucciones claras sobre cómo llegar, dónde aparcar y qué deben llevar. Confirma horarios y resuelve dudas sin mensajes contradictorios.', 'Un viajero que sabe qué esperar llega más relajado y aprovecha mejor la explicación inicial.'] },
      { heading: 'Un manual breve y realmente útil', paragraphs: ['Incluye fotos de los mandos, pasos para agua y electricidad, recomendaciones de conducción y teléfonos de asistencia. Evita copiar un manual genérico que no corresponda a tu modelo.', 'Añade una lista de comprobación para salida y devolución. Debe poder consultarse desde el móvil y entenderse en pocos minutos.'] },
      { heading: 'El valor de las recomendaciones locales', paragraphs: ['Comparte mercados, pequeños restaurantes, senderos y miradores que conozcas de verdad. Aclara horarios, reservas y si el acceso es adecuado para una camper.', 'No prometas lugares donde no está permitido pernoctar. Recomendar con responsabilidad protege al viajero y al territorio.'] },
      { heading: 'Comunicación durante el viaje', paragraphs: ['Define cuándo estás disponible y cómo actuar ante una avería. Responder con calma y dar instrucciones concretas vale más que contestar con mensajes largos.', 'Después de la devolución, agradece el cuidado y pide una valoración honesta. Esa conversación también forma parte de la experiencia.'] },
    ],
  },
];

export function getBlogArticle(slug: string) {
  return BLOG_ARTICLES.find((article) => article.slug === slug);
}
