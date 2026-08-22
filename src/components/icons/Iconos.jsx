/* =========================================================================
   Iconografía a medida
   -------------------------------------------------------------------------
   Los seis iconos de servicio están dibujados a mano a partir del
   instrumental que un veterinario usa de verdad — estetoscopio, jeringa,
   bisturí, reloj de guardia, cepillo, tubo de ensayo — con un trazo común
   de 1.6 para que se lean como un solo juego.
   ========================================================================= */

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
}

/* --------------------------------------------------------- servicios --- */

const Estetoscopio = (p) => (
  <svg {...base} {...p}>
    <path d="M6.5 3.6V8a5.5 5.5 0 0 0 11 0V3.6" />
    <circle cx="6.5" cy="2.8" r="1.3" />
    <circle cx="17.5" cy="2.8" r="1.3" />
    <path d="M12 13.5v2.3a3.7 3.7 0 0 0 3.7 3.7h.6" />
    <circle cx="18.7" cy="19.5" r="2.3" />
  </svg>
)

const Jeringa = (p) => (
  <svg {...base} {...p}>
    <rect x="9" y="6.4" width="6" height="10.8" rx="1.1" />
    <path d="M12 2.4v4M9.7 2.4h4.6M7.8 6.4h8.4" />
    <path d="M10.3 9.2h1.6M10.3 11.6h1.6M10.3 14h1.6" />
    <path d="M12 17.2v4.4" />
  </svg>
)

const Bisturi = (p) => (
  <svg {...base} {...p}>
    <path d="M21 3a1.9 1.9 0 0 1 0 2.7l-8.3 8.3-2.7-2.7L18.3 3A1.9 1.9 0 0 1 21 3z" />
    <path d="m10 11.3-5.9 5.9a1.6 1.6 0 0 0 0 2.2l.5.5a1.6 1.6 0 0 0 2.2 0l5.9-5.9" />
    <path d="M3.4 5.1c2.2 1.7 4.4 1.7 6.6 0" strokeDasharray="1.6 2.2" />
  </svg>
)

const RelojGuardia = (p) => (
  <svg {...base} {...p}>
    <circle cx="10.8" cy="13.4" r="7.8" />
    <path d="M10.8 8.6v4.8l3.4 2" />
    <path d="M19.4 2.2v5.2M16.8 4.8H22" />
  </svg>
)

const Cepillo = (p) => (
  <svg {...base} {...p}>
    <rect x="2.8" y="4.6" width="12.6" height="6" rx="3" />
    <path d="M6 10.6v3M9 10.6v3.6M12.2 10.6v3" />
    <path d="M15.4 7.6h2.4A2.9 2.9 0 0 1 20.7 10.5v2.6" />
    <path d="M20.7 15.1c1 1.4 1.5 2.3 1.5 3.1a1.5 1.5 0 0 1-3 0c0-.8.5-1.7 1.5-3.1z" />
  </svg>
)

const TuboEnsayo = (p) => (
  <svg {...base} {...p}>
    <path d="M8.6 2.6h6.8" />
    <path d="M9.9 2.6v14a2.6 2.6 0 0 0 5.2 0v-14" />
    <path d="M9.9 11.4h5.2" />
    <circle cx="11.7" cy="14" r="0.75" />
    <circle cx="13.6" cy="16.2" r="0.55" />
  </svg>
)

/** Mapa que consume Servicios.jsx a partir del campo `icono` de los datos. */
export const iconosServicio = {
  consulta: Estetoscopio,
  vacuna: Jeringa,
  cirugia: Bisturi,
  urgencias: RelojGuardia,
  estetica: Cepillo,
  laboratorio: TuboEnsayo,
}

/* ---------------------------------------------------------- interfaz --- */

export const IconoTelefono = (p) => (
  <svg {...base} {...p}>
    <path d="M6.3 3h3l1.5 3.8-1.9 1.4a12 12 0 0 0 5.9 5.9l1.4-1.9L20 13.7v3a2 2 0 0 1-2.2 2A16.6 16.6 0 0 1 4.3 5.2 2 2 0 0 1 6.3 3z" />
  </svg>
)

export const IconoReloj = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 6.8V12l3.6 2.2" />
  </svg>
)

export const IconoPin = (p) => (
  <svg {...base} {...p}>
    <path d="M12 21.5s7-6.1 7-11.1a7 7 0 1 0-14 0c0 5 7 11.1 7 11.1z" />
    <circle cx="12" cy="10.2" r="2.6" />
  </svg>
)

export const IconoCorreo = (p) => (
  <svg {...base} {...p}>
    <rect x="2.8" y="4.8" width="18.4" height="14.4" rx="2.4" />
    <path d="m3.4 7 7.5 5.4a2 2 0 0 0 2.2 0L20.6 7" />
  </svg>
)

export const IconoFlecha = (p) => (
  <svg {...base} {...p}>
    <path d="M4.5 12h15M13.5 6l6 6-6 6" />
  </svg>
)

export const IconoCheck = (p) => (
  <svg {...base} {...p}>
    <path d="m4.5 12.8 4.6 4.4L19.5 6.8" />
  </svg>
)

export const IconoMenu = (p) => (
  <svg {...base} {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
)

export const IconoCerrar = (p) => (
  <svg {...base} {...p}>
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
)

export const IconoEstrella = (p) => (
  <svg {...base} fill="currentColor" stroke="none" {...p}>
    <path d="m12 2.8 2.7 5.9 6.4.7-4.8 4.3 1.3 6.3-5.6-3.2-5.6 3.2 1.3-6.3-4.8-4.3 6.4-.7z" />
  </svg>
)

export const IconoWhatsapp = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false" {...p}>
    <path d="M12.04 2A9.9 9.9 0 0 0 2.15 11.9a9.8 9.8 0 0 0 1.36 4.98L2 22l5.27-1.47a9.9 9.9 0 0 0 4.77 1.21h.01A9.9 9.9 0 0 0 21.94 11.9 9.9 9.9 0 0 0 12.04 2zm0 18.05h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.13.87.84-3.05-.2-.31a8.2 8.2 0 1 1 6.99 3.82zm4.51-6.15c-.25-.13-1.46-.72-1.69-.8-.22-.09-.39-.13-.55.12s-.63.8-.77.96-.28.19-.53.06a6.72 6.72 0 0 1-3.36-2.94c-.25-.43.25-.4.72-1.34a.45.45 0 0 0-.02-.43c-.06-.13-.55-1.34-.76-1.83s-.4-.42-.55-.43h-.47a.9.9 0 0 0-.65.3 2.75 2.75 0 0 0-.86 2.05 4.79 4.79 0 0 0 1 2.54 10.94 10.94 0 0 0 4.2 3.71c1.56.67 2.17.73 2.95.61a2.5 2.5 0 0 0 1.65-1.17 2.05 2.05 0 0 0 .14-1.16c-.06-.11-.22-.17-.47-.29z" />
  </svg>
)

export const IconoFacebook = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false" {...p}>
    <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.5-3.91 3.77-3.91 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.45 2.9h-2.33V22c4.78-.79 8.44-4.94 8.44-9.94z" />
  </svg>
)

export const IconoInstagram = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
  </svg>
)

export const IconoTiktok = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false" {...p}>
    <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.59 2.59 0 1 1 .72-5.08v-3.1a5.65 5.65 0 0 0-.72-.05A5.68 5.68 0 1 0 15.54 15.4V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.29 4.29 0 0 1-3.24-1.48z" />
  </svg>
)

/** Marca de San Antón: una huella dentro del contorno de una ficha clínica. */
export const Logotipo = ({ className = '' }) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden focusable="false">
    <rect x="1.5" y="4.5" width="29" height="25" rx="6" fill="currentColor" />
    <rect x="7" y="2.5" width="11" height="4" rx="2" fill="currentColor" />
    <g fill="var(--color-ambar)">
      <ellipse cx="16" cy="20.6" rx="4.5" ry="3.9" />
      <ellipse cx="9.9" cy="14.6" rx="2.3" ry="3" transform="rotate(-20 9.9 14.6)" />
      <ellipse cx="14.2" cy="11.6" rx="2.3" ry="3" transform="rotate(-7 14.2 11.6)" />
      <ellipse cx="18.6" cy="11.8" rx="2.3" ry="3" transform="rotate(8 18.6 11.8)" />
      <ellipse cx="22.6" cy="14.9" rx="2.1" ry="2.8" transform="rotate(22 22.6 14.9)" />
    </g>
  </svg>
)
