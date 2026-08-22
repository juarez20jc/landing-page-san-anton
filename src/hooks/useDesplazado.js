import { useEffect, useRef, useState } from 'react'

/**
 * Detecta si la página ya se desplazó más allá de un centinela invisible.
 *
 * Se usa para dos cosas: compactar el header cuando queda fijo arriba y
 * mostrar el botón flotante de WhatsApp sólo después del primer scroll.
 *
 * Se resuelve con IntersectionObserver en lugar de un listener de scroll
 * porque no bloquea el hilo principal en cada frame. Las scroll-state
 * queries de CSS harían esto de forma nativa, pero hoy sólo funcionan en
 * Chrome y este estado sí tiene que funcionar en todos los navegadores.
 */
export function useDesplazado() {
  const centinela = useRef(null)
  const [desplazado, setDesplazado] = useState(false)

  useEffect(() => {
    const nodo = centinela.current
    if (!nodo) return

    const observador = new IntersectionObserver(
      ([entrada]) => setDesplazado(!entrada.isIntersecting),
      { threshold: 0 },
    )
    observador.observe(nodo)
    return () => observador.disconnect()
  }, [])

  return { centinela, desplazado }
}
