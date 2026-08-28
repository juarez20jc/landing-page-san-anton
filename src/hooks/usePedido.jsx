import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { catalogo, precioFinal } from '../data/clinica.js'

const LLAVE = 'san-anton:pedido'
const Contexto = createContext(null)

/* El carrito no habla con ningún servidor: guarda ids en el navegador y, al
   pedir, arma un mensaje de WhatsApp. Si el almacenamiento falla (ventana
   privada, cookies bloqueadas) el carrito sigue funcionando, sólo que se
   olvida al recargar. */
const leerGuardado = () => {
  try {
    const crudo = localStorage.getItem(LLAVE)
    if (!crudo) return []
    const ids = JSON.parse(crudo)
    return Array.isArray(ids) ? ids.filter((id) => catalogo.some((p) => p.id === id)) : []
  } catch {
    return []
  }
}

export function ProveedorPedido({ children }) {
  const [ids, setIds] = useState(leerGuardado)
  const [abierto, setAbierto] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(LLAVE, JSON.stringify(ids))
    } catch {
      /* sin almacenamiento: el carrito vive sólo en esta pestaña */
    }
  }, [ids])

  const alternar = useCallback((id) => {
    setIds((l) => (l.includes(id) ? l.filter((x) => x !== id) : [...l, id]))
  }, [])

  const quitar = useCallback((id) => setIds((l) => l.filter((x) => x !== id)), [])
  const vaciar = useCallback(() => setIds([]), [])

  const valor = useMemo(() => {
    // Se recorre el catálogo, no los ids, para que el orden sea siempre el
    // mismo que en la página aunque se marquen salteados.
    const lineas = catalogo.filter((p) => ids.includes(p.id))
    return {
      ids,
      lineas,
      total: lineas.reduce((suma, p) => suma + precioFinal(p), 0),
      tiene: (id) => ids.includes(id),
      alternar,
      quitar,
      vaciar,
      abierto,
      abrir: () => setAbierto(true),
      cerrar: () => setAbierto(false),
    }
  }, [ids, abierto, alternar, quitar, vaciar])

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>
}

export function usePedido() {
  const ctx = useContext(Contexto)
  if (!ctx) throw new Error('usePedido necesita estar dentro de <ProveedorPedido>')
  return ctx
}
