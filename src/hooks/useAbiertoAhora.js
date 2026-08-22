import { useEffect, useState } from 'react'
import { clinica } from '../data/clinica.js'

const aMinutos = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

/** Devuelve el tramo de horario que aplica a un día concreto, o null. */
export const tramoDelDia = (dia) =>
  clinica.horarios.find((h) => h.dias.includes(dia)) ?? null

function calcular(ahora) {
  const dia = ahora.getDay()
  const minutos = ahora.getHours() * 60 + ahora.getMinutes()
  const tramo = tramoDelDia(dia)

  if (!tramo) return { abierto: false, tramo: null, mensaje: 'Hoy cerrado' }

  const abre = aMinutos(tramo.abre)
  const cierra = aMinutos(tramo.cierra)
  const abierto = minutos >= abre && minutos < cierra

  if (abierto) {
    const faltan = cierra - minutos
    return {
      abierto: true,
      tramo,
      mensaje:
        faltan <= 60
          ? `Cierra en ${faltan} min`
          : `Abierto hasta las ${tramo.cierra} h`,
    }
  }

  return {
    abierto: false,
    tramo,
    mensaje: minutos < abre ? `Abre hoy a las ${tramo.abre} h` : 'Cerrado por hoy',
  }
}

/**
 * Estado de apertura en vivo, calculado con la hora local de quien visita.
 * Se recalcula cada minuto para que el distintivo nunca quede desfasado.
 */
export function useAbiertoAhora() {
  const [estado, setEstado] = useState(() => calcular(new Date()))

  useEffect(() => {
    const id = setInterval(() => setEstado(calcular(new Date())), 60_000)
    return () => clearInterval(id)
  }, [])

  return estado
}
