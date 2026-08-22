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
    detalle: 'Desde $450',
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
