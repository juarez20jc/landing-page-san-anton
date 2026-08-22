import { useCallback, useEffect, useRef, useState } from 'react'

// Sólo por debajo de lg: celulares y tablets. Desde 1024 px vuelve la rejilla.
const SOLO_TACTIL = '(max-width: 1023.98px)'
const SIN_MOVIMIENTO = '(prefers-reduced-motion: reduce)'

const consultar = (q) =>
  typeof window !== 'undefined' && window.matchMedia(q).matches

/**
 * Carrusel con desplazamiento nativo.
 *
 * El arrastre táctil, la inercia y el ajuste a cada tarjeta los pone el
 * navegador con scroll-snap; aquí sólo va lo que el navegador no hace:
 * avanzar solo cada `intervalo`, parar en cuanto alguien toca, y volver a
 * arrancar `reanudar` ms después del último gesto. Al pasar de la última
 * tarjeta vuelve a la primera.
 */
export function useCarrusel(total, { intervalo = 2000, reanudar = 3000 } = {}) {
  const pista = useRef(null)
  const relojGesto = useRef(null)

  const [activo, setActivo] = useState(() => consultar(SOLO_TACTIL))
  const [indice, setIndice] = useState(0)
  const [detenido, setDetenido] = useState(false) // pausa explícita del botón
  const [esperando, setEsperando] = useState(false) // ventana tras un gesto
  const [aLaVista, setALaVista] = useState(true)

  // ¿Estamos en un ancho de celular o tablet?
  useEffect(() => {
    const mq = window.matchMedia(SOLO_TACTIL)
    const alCambiar = () => setActivo(mq.matches)
    alCambiar()
    mq.addEventListener('change', alCambiar)
    return () => mq.removeEventListener('change', alCambiar)
  }, [])

  const sangria = (p) => parseFloat(getComputedStyle(p).paddingInlineStart) || 0

  const irA = useCallback((i, suave = true) => {
    const p = pista.current
    const hijo = p?.children[i]
    if (!p || !hijo) return
    p.scrollTo({ left: hijo.offsetLeft - sangria(p), behavior: suave ? 'smooth' : 'auto' })
    setIndice(i)
  }, [])

  // Cualquier gesto detiene el avance y programa la vuelta
  const marcarGesto = useCallback(() => {
    setEsperando(true)
    clearTimeout(relojGesto.current)
    relojGesto.current = setTimeout(() => setEsperando(false), reanudar)
  }, [reanudar])

  useEffect(() => () => clearTimeout(relojGesto.current), [])

  // Gestos + sincronización del índice con la posición real
  useEffect(() => {
    const p = pista.current
    if (!p || !activo) return

    const gestos = ['pointerdown', 'touchstart', 'wheel', 'keydown']
    for (const g of gestos) p.addEventListener(g, marcarGesto, { passive: true })

    let reloj
    const alDesplazar = () => {
      clearTimeout(reloj)
      // Se espera a que el desplazamiento se asiente para leer la tarjeta
      reloj = setTimeout(() => {
        const tope = p.scrollWidth - p.clientWidth
        // Si el scroll ya topa a la derecha estamos en la última, aunque su
        // borde no haya podido llegar al inicio de la pista.
        if (p.scrollLeft >= tope - 4) {
          setIndice(p.children.length - 1)
          return
        }
        const x = p.scrollLeft + sangria(p)
        let cerca = 0
        let minima = Infinity
        for (let i = 0; i < p.children.length; i++) {
          const d = Math.abs(p.children[i].offsetLeft - x)
          if (d < minima) {
            minima = d
            cerca = i
          }
        }
        setIndice(cerca)
      }, 120)
    }
    p.addEventListener('scroll', alDesplazar, { passive: true })

    return () => {
      for (const g of gestos) p.removeEventListener(g, marcarGesto)
      p.removeEventListener('scroll', alDesplazar)
      clearTimeout(reloj)
    }
  }, [activo, marcarGesto])

  // Fuera de pantalla no tiene sentido que siga girando
  useEffect(() => {
    const p = pista.current
    if (!p) return
    const io = new IntersectionObserver(([e]) => setALaVista(e.isIntersecting), {
      threshold: 0.15,
    })
    io.observe(p)
    return () => io.disconnect()
  }, [])

  // El avance automático
  useEffect(() => {
    if (!activo || detenido || esperando || !aLaVista || total < 2) return
    // Quien pide menos movimiento no recibe un carrusel que se mueve solo;
    // puede seguir deslizándolo con el dedo.
    if (consultar(SIN_MOVIMIENTO)) return

    const id = setInterval(() => {
      const p = pista.current
      if (!p) return
      setIndice((i) => {
        const tope = p.scrollWidth - p.clientWidth
        // Si ya no queda sitio a la derecha, la siguiente es la primera.
        const siguiente = p.scrollLeft >= tope - 4 ? 0 : (i + 1) % total
        const hijo = p.children[siguiente]
        if (hijo) {
          const destino = Math.min(hijo.offsetLeft - sangria(p), tope)
          p.scrollTo({ left: destino, behavior: 'smooth' })
        }
        return siguiente
      })
    }, intervalo)

    return () => clearInterval(id)
  }, [activo, detenido, esperando, aLaVista, total, intervalo])

  return {
    pista,
    activo,
    indice,
    irA,
    detenido,
    alternarPausa: () => setDetenido((d) => !d),
  }
}
