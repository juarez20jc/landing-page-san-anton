import { IconoEstrella } from '../icons/Iconos.jsx'

/* -------------------------------------------------------------- Boton --- */

const VARIANTES = {
  primario: 'boton boton-primario',
  oscuro: 'boton boton-oscuro',
  linea: 'boton boton-linea',
  claro: 'boton boton-claro',
}

/**
 * Botón único de la página. Renderiza <a> si recibe `href` y <button> si no,
 * para que un enlace siga siendo un enlace (abrible en pestaña nueva,
 * anunciado como enlace por el lector de pantalla).
 */
export function Boton({ variante = 'primario', href, className = '', children, ...props }) {
  const clases = `${VARIANTES[variante]} ${className}`
  if (href) {
    return (
      <a href={href} className={clases} {...props}>
        {children}
      </a>
    )
  }
  return (
    <button type="button" className={clases} {...props}>
      {children}
    </button>
  )
}

/* --------------------------------------------------------------- Foto --- */

/**
 * Imagen generada con IA, servida en WebP con densidades 1x y 2x.
 *
 * `width`/`height` son obligatorios: reservan el espacio y evitan que la
 * página salte al cargar (CLS). `prioridad` marca la imagen candidata a LCP
 * — sólo debe usarse en la del hero.
 */
export function Foto({ src, alt, width, height, className = '', prioridad = false, sizes }) {
  // En GitHub Pages la página vive en una subcarpeta, así que las rutas
  // absolutas de public/ necesitan la base delante.
  const ruta = `${import.meta.env.BASE_URL.replace(/\/$/, '')}${src}`
  return (
    <img
      src={`${ruta}.webp`}
      srcSet={`${ruta}.webp 1x, ${ruta}@2x.webp 2x`}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      className={className}
      decoding={prioridad ? 'sync' : 'async'}
      loading={prioridad ? 'eager' : 'lazy'}
      fetchPriority={prioridad ? 'high' : undefined}
    />
  )
}

/* ------------------------------------------------------ SeccionTitulo --- */

export function SeccionTitulo({ eyebrow, titulo, texto, claro = false, className = '' }) {
  return (
    <div className={`max-w-2xl ${className}`}>
      {eyebrow && (
        <p
          className={`etiqueta-dato mb-3 flex items-center gap-2.5 ${
            claro ? 'text-ambar' : 'text-eucalipto'
          }`}
        >
          <span
            aria-hidden="true"
            className={`inline-block h-px w-7 ${claro ? 'bg-ambar' : 'bg-eucalipto'}`}
          />
          {eyebrow}
        </p>
      )}
      <h2
        className={`text-titulo ${claro ? 'text-white' : 'text-quirofano'}`}
      >
        {titulo}
      </h2>
      {texto && (
        <p
          className={`mt-4 text-lg leading-relaxed ${
            claro ? 'text-menta' : 'text-tinta-suave'
          }`}
        >
          {texto}
        </p>
      )}
    </div>
  )
}

/* ----------------------------------------------------------- Estrellas -- */

export function Estrellas({ cantidad = 5, className = '' }) {
  return (
    <p className={`flex gap-0.5 text-ambar ${className}`}>
      <span className="sr-only">{cantidad} de 5 estrellas</span>
      {Array.from({ length: cantidad }, (_, i) => (
        <IconoEstrella key={i} className="h-4 w-4" />
      ))}
    </p>
  )
}
