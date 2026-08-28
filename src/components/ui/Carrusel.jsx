import { Children } from 'react'
import { useCarrusel } from '../../hooks/useCarrusel.js'
import { IconoFlecha, IconoFlechaIzq } from '../icons/Iconos.jsx'

/**
 * Carrusel de tarjetas.
 *
 * Por defecto sólo se activa en celular y tablet: a partir de 1024 px
 * devuelve la rejilla intacta. Con `siempre` funciona también en escritorio
 * —es lo que hacen las dos secciones de tienda—, y entonces aparecen además
 * las flechas, que en pantalla táctil sobran porque se arrastra con el dedo.
 *
 * Es el mismo marcado en los dos casos: sólo cambia la clase del contenedor,
 * así que no hay contenido duplicado ni nada que se desincronice.
 */
export default function Carrusel({
  etiqueta,
  clasesRejilla,
  children,
  claro = false,
  siempre = false,
  intervalo = 2000,
  reanudar = 2000,
}) {
  const total = Children.count(children)
  const { pista, activo, indice, irA, anterior, siguiente, detenido, alternarPausa } =
    useCarrusel(total, { intervalo, reanudar, siempre })

  if (!activo) {
    return <ul className={clasesRejilla}>{children}</ul>
  }

  const tenue = claro ? 'bg-white/30' : 'bg-eucalipto/25'
  const fuerte = claro ? 'bg-ambar' : 'bg-quirofano'
  const textoControl = claro ? 'text-menta' : 'text-tinta-suave'
  const bordeControl = claro ? 'border-white/25' : 'border-eucalipto/25'

  const redondo = `flex h-11 w-11 items-center justify-center rounded-full border ${bordeControl} ${textoControl} transition-colors hover:bg-current/10`

  return (
    <div role="group" aria-roledescription="carrusel" aria-label={etiqueta}>
      <ul
        ref={pista}
        className="pista-carrusel"
        tabIndex={0}
        aria-label={`${etiqueta}: desliza para ver las ${total} tarjetas`}
      >
        {children}
      </ul>

      <div className="mt-6 flex items-center justify-center gap-4">
        {siempre && (
          <button
            type="button"
            onClick={anterior}
            aria-label="Tarjeta anterior"
            className={`${redondo} hidden lg:flex`}
          >
            <IconoFlechaIzq className="h-5 w-5" />
          </button>
        )}

        <ul className="flex items-center gap-2">
          {Array.from({ length: total }, (_, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => irA(i)}
                aria-label={`Ir a la tarjeta ${i + 1} de ${total}`}
                aria-current={i === indice ? 'true' : undefined}
                className="flex h-11 w-6 items-center justify-center"
              >
                <span
                  aria-hidden="true"
                  className={`block h-2 rounded-full transition-all duration-300 ${
                    i === indice ? `w-6 ${fuerte}` : `w-2 ${tenue}`
                  }`}
                />
              </button>
            </li>
          ))}
        </ul>

        {siempre && (
          <button
            type="button"
            onClick={siguiente}
            aria-label="Tarjeta siguiente"
            className={`${redondo} hidden lg:flex`}
          >
            <IconoFlecha className="h-5 w-5" />
          </button>
        )}

        {/* Requisito de accesibilidad: todo lo que se mueve solo necesita
            una forma de pararlo (WCAG 2.2.2). */}
        <button
          type="button"
          onClick={alternarPausa}
          aria-label={detenido ? 'Reanudar el avance automático' : 'Pausar el avance automático'}
          className={redondo}
        >
          {detenido ? (
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
              <path d="M8 5.5v13l11-6.5z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
              <path d="M8 5h3v14H8zM13 5h3v14h-3z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}
