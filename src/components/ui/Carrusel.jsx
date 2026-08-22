import { Children } from 'react'
import { useCarrusel } from '../../hooks/useCarrusel.js'

/**
 * En celular y tablet convierte una rejilla en un carrusel que avanza solo;
 * a partir de 1024 px devuelve la rejilla intacta.
 *
 * Es el mismo marcado en los dos casos: sólo cambia la clase del contenedor,
 * así que no hay contenido duplicado ni nada que se desincronice.
 */
export default function Carrusel({
  etiqueta,
  clasesRejilla,
  children,
  claro = false,
  intervalo = 2000,
  reanudar = 3000,
}) {
  const total = Children.count(children)
  const { pista, activo, indice, irA, detenido, alternarPausa } = useCarrusel(total, {
    intervalo,
    reanudar,
  })

  if (!activo) {
    return <ul className={clasesRejilla}>{children}</ul>
  }

  const tenue = claro ? 'bg-white/30' : 'bg-eucalipto/25'
  const fuerte = claro ? 'bg-ambar' : 'bg-quirofano'
  const textoControl = claro ? 'text-menta' : 'text-tinta-suave'
  const bordeControl = claro ? 'border-white/25' : 'border-eucalipto/25'

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

        {/* Requisito de accesibilidad: todo lo que se mueve solo necesita
            una forma de pararlo (WCAG 2.2.2). */}
        <button
          type="button"
          onClick={alternarPausa}
          aria-label={detenido ? 'Reanudar el avance automático' : 'Pausar el avance automático'}
          className={`flex h-11 w-11 items-center justify-center rounded-full border ${bordeControl} ${textoControl} transition-colors hover:bg-current/10`}
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
