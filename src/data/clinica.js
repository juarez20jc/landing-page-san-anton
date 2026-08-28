/* =========================================================================
   San Antón — DATOS DE LA CLÍNICA
   -------------------------------------------------------------------------
   ESTE ES EL ÚNICO ARCHIVO QUE NECESITAS EDITAR para poner los datos reales.
   Todos los valores de abajo son PLACEHOLDERS realistas. Cámbialos y la
   página entera (hero, horarios, mapa, WhatsApp, footer, SEO y JSON-LD) se
   actualiza sola. No hace falta tocar ningún componente.
   ========================================================================= */

export const clinica = {
  nombre: 'San Antón',
  claim: 'Clínica Veterinaria',
  fundacion: 2011,

  // Dominio final del sitio. Se usa para el canonical, Open Graph,
  // sitemap.xml y los datos estructurados de Google.
  sitio: 'https://juarez20jc.github.io/landing-page-san-anton',

  // --- CONTACTO -----------------------------------------------------------
  // telefono.visible  -> lo que se muestra en pantalla
  // telefono.tel      -> formato internacional para el enlace tel:
  telefono: { visible: '+51 919 550 076', tel: '+51919550076' },

  // whatsapp -> SOLO dígitos, con código de país. Perú móvil: 51 + 9 dígitos
  whatsapp: '51919550076',

  email: 'gianfranco.caramutti@hotmail.com',

  direccion: {
    calle: 'Av. Alfredo Mendiola 1400',
    zona: 'Plaza Norte', // la referencia que la gente reconoce
    distrito: 'Independencia',
    ciudad: 'Lima',
    cp: '15311',
    pais: 'PE',
    referencia: 'Estacionamiento gratuito para clientes.',
  },

  // Coordenadas para el mapa y el JSON-LD de SEO local
  geo: { lat: -12.00628, lng: -77.05877 },

  // Todavía no hay perfiles en redes: los tres iconos se ven, pero llevan a
  // WhatsApp. Cuando existan, pon aquí la URL de cada uno y volverán a
  // enlazar a la red (y a aparecer en los datos estructurados de Google).
  redes: {
    facebook: null,
    instagram: null,
    tiktok: null,
  },

  // --- HORARIOS -----------------------------------------------------------
  // dias: índices de JS Date.getDay() -> 0 domingo ... 6 sábado
  // abre / cierra en formato 24 h "HH:MM"
  horarios: [
    { etiqueta: 'Lunes a viernes', dias: [1, 2, 3, 4, 5], abre: '08:00', cierra: '20:00' },
    { etiqueta: 'Sábado', dias: [6], abre: '09:00', cierra: '18:00' },
    { etiqueta: 'Domingo', dias: [0], abre: '10:00', cierra: '14:00' },
  ],
  urgencias: {
    titulo: 'Urgencias 24/7',
    texto: 'Fuera de horario siempre hay un veterinario de guardia. Llama antes de venir y te esperamos preparados.',
  },
}

// --- SERVICIOS ------------------------------------------------------------
// icono: debe coincidir con una clave de src/components/icons/IconoServicio.jsx
export const servicios = [
  {
    icono: 'consulta',
    titulo: 'Consulta general',
    texto: 'Revisión completa, diagnóstico y plan de tratamiento. Cuarenta minutos sin prisas para resolver todas tus dudas.',
    detalle: 'Desde S/99',
  },
  {
    icono: 'vacuna',
    titulo: 'Vacunación y desparasitación',
    texto: 'Esquema completo para cachorros y refuerzos anuales, con recordatorio automático por WhatsApp.',
    detalle: 'Cartilla digital incluida',
  },
  {
    icono: 'cirugia',
    titulo: 'Cirugía y esterilización',
    texto: 'Quirófano propio con monitorización continua, anestesia inhalada y hospitalización posoperatoria.',
    detalle: 'Alta el mismo día',
  },
  {
    icono: 'urgencias',
    titulo: 'Urgencias 24 horas',
    texto: 'Atención inmediata los 365 días del año. Estabilizamos, diagnosticamos y te explicamos cada paso.',
    detalle: 'Sin cita previa',
    destacado: true,
  },
  {
    icono: 'estetica',
    titulo: 'Estética canina y felina',
    texto: 'Baño medicado, corte por raza y cuidado dental. Manejo libre de estrés, sin jaulas de secado.',
    detalle: 'Perros y gatos',
  },
  {
    icono: 'laboratorio',
    titulo: 'Laboratorio e imagen',
    texto: 'Análisis clínicos, rayos X digitales y ultrasonido en sitio. Resultados el mismo día.',
    detalle: 'Resultados en 2 h',
  },
]

// --- EQUIPO ---------------------------------------------------------------
export const equipo = [
  {
    nombre: 'Dra. Mariana Robles',
    puesto: 'Directora médica',
    especialidad: 'Medicina interna de pequeñas especies',
    cedula: '7 482 913',
    anios: 14,
    foto: '/img/equipo-1',
    alt: 'La Dra. Mariana Robles, directora médica de San Antón, en la sala de consulta',
  },
  {
    nombre: 'MVZ Daniel Alcántara',
    puesto: 'Cirujano',
    especialidad: 'Cirugía de tejidos blandos y ortopedia',
    cedula: '8 105 664',
    anios: 11,
    foto: '/img/equipo-2',
    alt: 'El MVZ Daniel Alcántara, cirujano de San Antón, con bata quirúrgica',
  },
  {
    nombre: 'MVZ Paola Núñez',
    puesto: 'Especialista en felinos',
    especialidad: 'Medicina felina y manejo libre de estrés',
    cedula: '9 331 208',
    anios: 8,
    foto: '/img/equipo-3',
    alt: 'La MVZ Paola Núñez, especialista en felinos, sosteniendo un gato',
  },
  {
    nombre: 'MVZ Sergio Peralta',
    puesto: 'Guardia de urgencias',
    especialidad: 'Medicina de urgencias y cuidados intensivos',
    cedula: '8 774 520',
    anios: 10,
    foto: '/img/equipo-4',
    alt: 'El MVZ Sergio Peralta, responsable de urgencias de San Antón',
  },
]

// --- TESTIMONIOS ----------------------------------------------------------
export const testimonios = [
  {
    texto: 'Llegamos a las tres de la mañana con Nube intoxicada y nos atendieron en cinco minutos. Nos explicaron todo con calma y nos llamaron dos veces al día siguiente para ver cómo seguía.',
    autor: 'Andrea Villalobos',
    mascota: 'Nube, gata común europea',
    servicio: 'Urgencias 24 h',
    estrellas: 5,
  },
  {
    texto: 'Mi labrador le tenía pánico al veterinario. Aquí lo dejaron olfatear el consultorio, se sentaron en el piso con él y salió moviendo la cola. Nunca había visto algo así.',
    autor: 'Ricardo Mena',
    mascota: 'Tomás, labrador de 6 años',
    servicio: 'Consulta general',
    estrellas: 5,
  },
  {
    texto: 'La esterilización de Frida fue por la mañana y a las siete de la tarde ya estaba en casa comiendo. Me mandaron las indicaciones por WhatsApp con foto de la herida para comparar.',
    autor: 'Lucía Ferrer',
    mascota: 'Frida, french poodle',
    servicio: 'Cirugía',
    estrellas: 5,
  },
  {
    texto: 'Llevo cuatro años trayendo a mis dos perros. Tienen el historial completo, me avisan de las vacunas antes que yo me acuerde y jamás me han vendido un estudio que no necesitaran.',
    autor: 'Jorge Ibarra',
    mascota: 'Kuma y Lupe, huskies',
    servicio: 'Medicina preventiva',
    estrellas: 5,
  },
]

// --- CIFRAS DE CONFIANZA --------------------------------------------------
export const cifras = [
  { valor: '14', sufijo: ' años', etiqueta: 'cuidando mascotas del barrio' },
  { valor: '12', sufijo: ' mil', etiqueta: 'pacientes en el historial' },
  { valor: '4.9', sufijo: '/5', etiqueta: 'promedio de 380 reseñas' },
]

// --- NAVEGACIÓN -----------------------------------------------------------
export const navegacion = [
  { href: '#servicios', texto: 'Servicios' },
  { href: '#clinica', texto: 'La clínica' },
  { href: '#testimonios', texto: 'Reseñas' },
  { href: '#horarios', texto: 'Horarios' },
  { href: '#contacto', texto: 'Contacto' },
]

/* --- DERIVADOS (no hace falta editarlos) -------------------------------- */

export const direccionUnaLinea = [
  clinica.direccion.calle,
  `${clinica.direccion.distrito} ${clinica.direccion.cp}`,
].join(', ')

/** Texto completo para el mapa y para «cómo llegar». */
export const direccionCompleta = `${direccionUnaLinea}, ${clinica.direccion.ciudad}, Perú`

export const enlaceWhatsapp = (mensaje) =>
  `https://wa.me/${clinica.whatsapp}?text=${encodeURIComponent(mensaje)}`

export const enlaceMapa = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccionCompleta)}`

/* El mapa incrustado va por coordenadas: con una búsqueda por texto Google
   devuelve una ficha pequeña en vez de rellenar el marco. El enlace de
   «cómo llegar» sí usa la dirección escrita, que es lo útil al tocarlo. */
export const enlaceMapaEmbed = `https://www.google.com/maps?q=${clinica.geo.lat},${clinica.geo.lng}&z=17&output=embed`

/* --- PORTADAS DEL HERO ---------------------------------------------------
   El hero rota entre estas tres. Los botones, las estrellas y las cifras no
   cambian: sólo el fondo, la foto y el texto. Para añadir una cuarta basta
   con meterla aquí. `foto` es el nombre en public/img sin extensión. */
export const portadas = [
  {
    id: 'general',
    fondo: '#0d3b3a',
    etiqueta: 'Urgencias 24/7',
    lugar: `${clinica.direccion.zona} · ${clinica.direccion.ciudad}`,
    titulo: 'Cuidamos al que te acompaña todos los días',
    texto: `Consulta, vacunación, cirugía, estética y laboratorio en ${clinica.direccion.zona}, con urgencias las 24 horas. Catorce años y doce mil pacientes después, seguimos atendiendo sin prisas.`,
    foto: '/img/portada',
    alt: 'Una veterinaria de San Antón, sonriente y en uniforme azul, junto a un cachorro de golden retriever sobre la mesa de exploración',
  },
  {
    id: 'urgencias',
    fondo: '#122220',
    etiqueta: 'Guardia activa',
    lugar: 'Las 24 horas, todo el año',
    titulo: 'Aquí siempre hay alguien despierto',
    texto: 'Urgencias de verdad: quirófano, laboratorio y hospitalización en el mismo sitio. No te mandamos a otra clínica a mitad de la noche.',
    foto: '/img/portada-2',
    alt: 'La fachada iluminada de la Clínica Veterinaria San Antón al anochecer',
  },
  {
    id: 'consulta',
    fondo: '#122220',
    etiqueta: 'Consulta sin prisas',
    lugar: 'Treinta minutos por cita',
    titulo: '30 minutos dedicados exclusivamente a tu mascota',
    texto: 'Evaluamos a tu mascota sin prisas. Saldrás con un diagnóstico claro, los pasos a seguir y total transparencia en los costos.',
    foto: '/img/portada-3',
    alt: 'La entrada de San Antón de día, con una clienta y su perro cruzando hacia la puerta',
  },
]

/* --- PRODUCTOS -----------------------------------------------------------
   PRECIOS Y NOMBRES DE EJEMPLO: cámbialos por los de verdad.

   Sólo se apunta el precio DE LISTA y el descuento; el precio final lo
   calcula `conPrecio()` más abajo, para que la etiqueta del descuento y lo
   que paga el cliente no puedan contradecirse.

   foto: nombre en public/img sin extensión, o null si todavía no hay. */
export const liquidacion = [
  {
    id: 'cama',
    nombre: 'Cama ortopédica para perro grande',
    texto: 'Espuma con memoria y funda lavable a máquina. Talla L.',
    lista: 189,
    descuento: 70,
    foto: '/img/prod-cama',
  },
  {
    id: 'transportadora',
    nombre: 'Transportadora rígida talla M',
    texto: 'Homologada para viaje. Hasta 12 kg, con puerta metálica.',
    lista: 145,
    descuento: 60,
    foto: '/img/prod-transportadora',
  },
  {
    id: 'rascador',
    nombre: 'Rascador de tres niveles',
    texto: 'Sisal natural y plataforma alta. 1,10 m.',
    lista: 210,
    descuento: 76,
    foto: '/img/prod-rascador',
  },
  {
    id: 'tunel',
    nombre: 'Túnel de juego para gato',
    texto: 'Plegable, con abertura lateral y juguete colgante.',
    lista: 79,
    descuento: 90,
    foto: '/img/prod-tunel',
  },
  {
    id: 'comedero',
    nombre: 'Comedero elevado de acero',
    texto: 'Doble cuenco, altura regulable. Para razas medianas.',
    lista: 95,
    descuento: 30,
    foto: null,
  },
  {
    id: 'cepillado',
    nombre: 'Kit de cepillado y corte de uñas',
    texto: 'Cepillo deslanador, cortaúñas y lima. Perro o gato.',
    lista: 68,
    descuento: 30,
    foto: null,
  },
]

export const masVendidos = [
  {
    id: 'alimento-perro',
    nombre: 'Alimento seco perro adulto · 15 kg',
    texto: 'La bolsa que más sale. Razas medianas y grandes.',
    lista: 179,
    descuento: 10,
    foto: '/img/prod-alimento-perro',
  },
  {
    id: 'antipulgas',
    nombre: 'Antipulgas en pipeta · 3 meses',
    texto: 'Una pipeta al mes. Perro de 10 a 25 kg.',
    lista: 96,
    descuento: 8,
    foto: '/img/prod-antipulgas',
  },
  {
    id: 'arena',
    nombre: 'Arena aglomerante · 10 kg',
    texto: 'Sin perfume. La que usamos en la clínica.',
    lista: 42,
    descuento: 12,
    foto: '/img/prod-arena',
  },
  {
    id: 'alimento-gato',
    nombre: 'Alimento gato esterilizado · 7,5 kg',
    texto: 'Control de peso y cuidado urinario.',
    lista: 148,
    descuento: 10,
    foto: '/img/prod-alimento-gato',
  },
  {
    id: 'desparasitante',
    nombre: 'Desparasitante oral · 4 tabletas',
    texto: 'Interno, de amplio espectro. Perro y gato.',
    lista: 58,
    descuento: 5,
    foto: null,
  },
  {
    id: 'snacks',
    nombre: 'Snacks dentales · paquete grande',
    texto: 'Uno al día. Ayuda con el sarro.',
    lista: 39,
    descuento: 12,
    foto: null,
  },
]

/** Precio final, redondeado al sol. La etiqueta sale del mismo dato. */
export const precioFinal = (p) => Math.round(p.lista * (1 - p.descuento / 100))

/** Soles con el separador que se usa en Perú. */
export const soles = (n) => `S/ ${n.toLocaleString('es-PE')}`

/** Todos los productos, para que el carrito pueda buscar por id. */
export const catalogo = [...liquidacion, ...masVendidos]
