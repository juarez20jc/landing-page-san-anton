import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { catalogo, precioFinal } from '../data/clinica.js'

const LLAVE = 'san-anton:pedido'
const TOPE = 99 // por unidad; más que eso ya es un pedido para hablarlo por teléfono
const Contexto = createContext(null)

/* El carrito no habla con ningún servidor: guarda {id: cantidad} en el
   navegador y, al pedir, arma un mensaje de WhatsApp. Si el almacenamiento
   falla (ventana privada, cookies bloqueadas) el carrito sigue funcionando,
   sólo que se olvida al recargar. */
const leerGuardado = () => {
  try {
    const crudo = localStorage.getItem(LLAVE)
    if (!crudo) return {}
    const dato = JSON.parse(crudo)

    // Antes se guardaba una lista de ids sin cantidad: se convierte sola.
    const pares = Array.isArray(dato)
      ? dato.map((id) => [id, 1])
      : Object.entries(dato ?? {})

    return Object.fromEntries(
      pares
        .filter(([id, n]) => catalogo.some((p) => p.id === id) && Number.isFinite(+n) && +n > 0)
        .map(([id, n]) => [id, Math.min(Math.round(+n), TOPE)]),
    )
  } catch {
    return {}
  }
}

export function ProveedorPedido({ children }) {
  const [cantidades, setCantidades] = useState(leerGuardado)
  const [abierto, setAbierto] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(LLAVE, JSON.stringify(cantidades))
    } catch {
      /* sin almacenamiento: el carrito vive sólo en esta pestaña */
    }
  }, [cantidades])

  /** Suma `paso` unidades. Al llegar a cero el producto sale del pedido. */
  const ajustar = useCallback((id, paso) => {
    setCantidades((c) => {
      const n = (c[id] ?? 0) + paso
      if (n <= 0) {
        const { [id]: _fuera, ...resto } = c
        return resto
      }
      return { ...c, [id]: Math.min(n, TOPE) }
    })
  }, [])

  /** La casilla de la tarjeta: mete el producto o lo saca del todo. */
  const alternar = useCallback((id) => {
    setCantidades((c) => {
      if (c[id]) {
        const { [id]: _fuera, ...resto } = c
        return resto
      }
      return { ...c, [id]: 1 }
    })
  }, [])

  const quitar = useCallback((id) => {
    setCantidades((c) => {
      const { [id]: _fuera, ...resto } = c
      return resto
    })
  }, [])

  const vaciar = useCallback(() => setCantidades({}), [])

  const valor = useMemo(() => {
    // Se recorre el catálogo, no las claves, para que el orden del carrito
    // sea siempre el mismo que el de la página.
    const lineas = catalogo
      .filter((p) => cantidades[p.id])
      .map((p) => ({ ...p, cantidad: cantidades[p.id] }))

    return {
      lineas,
      unidades: lineas.reduce((n, p) => n + p.cantidad, 0),
      total: lineas.reduce((suma, p) => suma + precioFinal(p) * p.cantidad, 0),
      tiene: (id) => Boolean(cantidades[id]),
      cantidadDe: (id) => cantidades[id] ?? 0,
      alternar,
      sumar: (id) => ajustar(id, 1),
      restar: (id) => ajustar(id, -1),
      quitar,
      vaciar,
      tope: TOPE,
      abierto,
      abrir: () => setAbierto(true),
      cerrar: () => setAbierto(false),
    }
  }, [cantidades, abierto, ajustar, alternar, quitar, vaciar])

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>
}

export function usePedido() {
  const ctx = useContext(Contexto)
  if (!ctx) throw new Error('usePedido necesita estar dentro de <ProveedorPedido>')
  return ctx
}
