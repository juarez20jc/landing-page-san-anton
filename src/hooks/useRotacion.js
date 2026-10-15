import { useEffect, useRef, useState } from 'react'

const SOLO_TACTIL = '(max-width: 1023.98px)'
const SIN_MOVIMIENTO = '(prefers-reduced-motion: reduce)'

/**
 * Muestra los elementos de uno en uno, cambiando cada `intervalo`, y al
 * llegar al final vuelve al primero.
 *
 * No es un carrusel: aquí no hay nada que arrastrar ni que desplazar, sólo
 * un elemento visible cada vez. Se usa para los cuatro motivos de la clínica
 * en celular, donde apilados se comían media pantalla, y para las cifras del
 * hero en celular.
 *
 * Fuera de `consulta` (por defecto, a partir de 1024 px) se apaga (`activo`
 * en false) y quien lo use debe pintar la rejilla completa. `pausado` deja
 * que otro control, como la pausa del hero, lo congele desde fuera.
 */
export function useRotacion(total, { intervalo = 2000, consulta = SOLO_TACTIL, pausado = false } = {}) {
  const [activo, setActivo] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(consulta).matches,
  )
  const [indice, setIndice] = useState(0)
  const [detenido, setDetenido] = useState(false)
  const contenedor = useRef(null)
  const [aLaVista, setALaVista] = useState(true)

  useEffect(() => {
    const mq = window.matchMedia(consulta)
    const alCambiar = () => setActivo(mq.matches)
    alCambiar()
    mq.addEventListener('change', alCambiar)
    return () => mq.removeEventListener('change', alCambiar)
  }, [consulta])

  // Fuera de pantalla no tiene sentido que siga girando.
  useEffect(() => {
    const nodo = contenedor.current
    if (!nodo) return
    const io = new IntersectionObserver(([e]) => setALaVista(e.isIntersecting), { threshold: 0.4 })
    io.observe(nodo)
    return () => io.disconnect()
  }, [activo])

  useEffect(() => {
    if (!activo || detenido || pausado || !aLaVista || total < 2) return
    if (window.matchMedia(SIN_MOVIMIENTO).matches) return
    const id = setInterval(() => setIndice((i) => (i + 1) % total), intervalo)
    return () => clearInterval(id)
  }, [activo, detenido, pausado, aLaVista, total, intervalo])

  return {
    contenedor,
    activo,
    indice,
    irA: setIndice,
    detenido,
    alternarPausa: () => setDetenido((d) => !d),
  }
}
