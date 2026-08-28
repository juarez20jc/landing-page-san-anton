import { useEffect, useRef } from 'react'
import { clinica, enlaceWhatsapp, precioFinal, soles } from '../data/clinica.js'
import { usePedido } from '../hooks/usePedido.jsx'
import { Foto } from './ui/Primitivas.jsx'
import {
  IconoCarrito,
  IconoCerrar,
  IconoMas,
  IconoMenos,
  IconoPapelera,
  IconoWhatsapp,
} from './icons/Iconos.jsx'

/* Por encima de unos 1000 caracteres WhatsApp recorta el texto prellenado en
   la caja antes de que se pueda enviar, así que el mensaje se queda corto a
   propósito. Con doce artículos no se llega, pero el tope evita sorpresas. */
const TOPE_MENSAJE = 900

/**
 * El mensaje que se abre en WhatsApp con el pedido.
 *
 * Va con el marcado propio de WhatsApp: guion al principio de línea para que
 * lo pinte como lista, y asteriscos para la negrita del total. Nada de
 * viñetas «•» ni tablas: en el móvil de quien recibe se ven como texto suelto.
 */
const mensajePedido = (lineas, total) => {
  const linea = (p) => `- ${p.cantidad} × ${p.nombre} — ${soles(precioFinal(p) * p.cantidad)}`

  const armar = (items, resto) =>
    [
      `Hola ${clinica.nombre}, quiero hacer este pedido:`,
      '',
      ...items,
      ...(resto ? [`- …y ${resto} producto${resto === 1 ? '' : 's'} más`] : []),
      '',
      `*Total: ${soles(total)}*`,
    ].join('\n')

  let texto = armar(lineas.map(linea), 0)

  // Si aun así se pasa, se recortan líneas por el final antes que dejar que
  // WhatsApp corte el mensaje por donde le apetezca.
  for (let n = lineas.length - 1; n > 0 && texto.length > TOPE_MENSAJE; n--) {
    texto = armar(lineas.slice(0, n).map(linea), lineas.length - n)
  }
  return texto
}

/**
 * Carrito flotante: la burbuja con el contador, encima del botón de
 * WhatsApp, y el panel lateral donde se revisa y se quita lo que sobra.
 *
 * El panel es un <dialog> nativo, así que el atrapado de foco, el cierre con
 * Esc y el fondo inerte vienen de serie.
 */
export default function Carrito({ visible }) {
  const { lineas, unidades, total, sumar, restar, quitar, vaciar, tope, abierto, abrir, cerrar } =
    usePedido()
  const dialogo = useRef(null)
  const cuenta = lineas.length

  useEffect(() => {
    const nodo = dialogo.current
    if (!nodo) return
    if (abierto && !nodo.open) nodo.showModal()
    if (!abierto && nodo.open) nodo.close()
  }, [abierto])

  return (
    <>
      {/* --------------------------------------------------------- burbuja */}
      <button
        type="button"
        onClick={abrir}
        aria-label={
          cuenta === 0
            ? 'Tu pedido está vacío'
            : `Ver el pedido: ${unidades} ${unidades === 1 ? 'producto' : 'productos'}`
        }
        inert={visible && cuenta > 0 ? undefined : true}
        className={`fixed bottom-[max(5.75rem,calc(env(safe-area-inset-bottom)+4.5rem))] right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full border-2 border-quirofano/10 bg-white text-quirofano shadow-[0_12px_30px_-12px_rgb(13_59_58/0.55)] transition-[opacity,transform] duration-300 hover:bg-menta ${
          visible && cuenta > 0
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-4 opacity-0'
        }`}
      >
        <IconoCarrito className="h-7 w-7" />
        <span
          aria-hidden="true"
          className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-ambar px-1.5 font-mono text-xs font-bold text-tinta"
        >
          {unidades}
        </span>
      </button>

      {/* ----------------------------------------------------------- panel */}
      <dialog
        ref={dialogo}
        onClose={cerrar}
        aria-label="Tu pedido"
        closedby="any"
        className="m-0 ml-auto h-dvh max-h-none w-[min(26rem,92vw)] max-w-none bg-gasa p-0 text-tinta backdrop:bg-quirofano/55 backdrop:backdrop-blur-sm"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-4 border-b border-eucalipto/15 px-5 py-4">
            <div>
              <h2 className="font-display text-xl font-bold text-quirofano">Tu pedido</h2>
              <p className="text-sm text-tinta-suave">
                {cuenta === 0
                  ? 'Todavía no has marcado nada'
                  : `${unidades} ${unidades === 1 ? 'producto' : 'productos'}`}
              </p>
            </div>
            <button
              type="button"
              onClick={cerrar}
              aria-label="Cerrar el pedido"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-quirofano/20 text-quirofano transition-colors hover:bg-menta"
            >
              <IconoCerrar className="h-6 w-6" />
            </button>
          </div>

          {cuenta === 0 ? (
            <p className="px-5 py-10 text-center text-tinta-suave">
              Marca «Añadir al pedido» en los productos que te interesen y aparecerán aquí.
            </p>
          ) : (
            <ul className="flex-1 overflow-y-auto px-5 py-4">
              {lineas.map((p) => (
                <li
                  key={p.id}
                  className="flex items-start gap-3 border-b border-eucalipto/12 py-3.5 last:border-0"
                >
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-eucalipto/15 bg-white p-1">
                    {p.foto ? (
                      <Foto
                        src={p.foto}
                        alt=""
                        width={56}
                        height={56}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <span aria-hidden="true" className="text-lg text-eucalipto/40">
                        ·
                      </span>
                    )}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold leading-snug text-quirofano">
                      {p.nombre}
                    </span>
                    <span className="mt-0.5 block text-sm text-tinta-suave">
                      {soles(precioFinal(p))} c/u{' '}
                      <span className="text-tinta-suave line-through">{soles(p.lista)}</span>
                    </span>

                    <span className="mt-2 flex items-center justify-between gap-3">
                      {/* El menos en 1 unidad quita el producto: es lo que
                          espera quien pulsa hasta el fondo, y evita dejar
                          líneas a cero en el pedido. */}
                      <span className="flex items-center rounded-full border border-eucalipto/25">
                        <button
                          type="button"
                          onClick={() => restar(p.id)}
                          aria-label={
                            p.cantidad === 1
                              ? `Quitar ${p.nombre} del pedido`
                              : `Una unidad menos de ${p.nombre}`
                          }
                          className="flex h-11 w-11 items-center justify-center rounded-full text-quirofano transition-colors hover:bg-menta"
                        >
                          <IconoMenos className="h-4 w-4" />
                        </button>
                        <span
                          aria-live="polite"
                          className="min-w-8 text-center font-mono text-sm font-semibold text-quirofano"
                        >
                          {p.cantidad}
                          <span className="sr-only"> unidades de {p.nombre}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => sumar(p.id)}
                          disabled={p.cantidad >= tope}
                          aria-label={`Una unidad más de ${p.nombre}`}
                          className="flex h-11 w-11 items-center justify-center rounded-full text-quirofano transition-colors hover:bg-menta disabled:opacity-40"
                        >
                          <IconoMas className="h-4 w-4" />
                        </button>
                      </span>

                      <span className="font-display font-bold text-quirofano">
                        {soles(precioFinal(p) * p.cantidad)}
                      </span>
                    </span>
                  </span>

                  <button
                    type="button"
                    onClick={() => quitar(p.id)}
                    aria-label={`Quitar ${p.nombre} del pedido`}
                    className="flex h-11 w-11 shrink-0 items-center justify-center self-start rounded-full text-tinta-suave transition-colors hover:bg-urgencia/10 hover:text-urgencia"
                  >
                    <IconoPapelera className="h-5 w-5" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {cuenta > 0 && (
            <div className="border-t border-eucalipto/15 px-5 py-4">
              <p className="flex items-baseline justify-between">
                <span className="etiqueta-dato text-eucalipto">Total</span>
                <span className="font-display text-2xl font-bold text-quirofano">
                  {soles(total)}
                </span>
              </p>

              <a
                href={enlaceWhatsapp(mensajePedido(lineas, total))}
                target="_blank"
                rel="noopener"
                className="boton boton-primario mt-4 w-full"
              >
                <IconoWhatsapp className="h-5 w-5" />
                Pedir por WhatsApp
              </a>

              <p className="mt-2 text-center text-xs text-tinta-suave">
                No se cobra nada aquí: se abre WhatsApp con la lista ya escrita.
              </p>

              <button
                type="button"
                onClick={vaciar}
                className="mt-3 w-full py-2 text-sm font-medium text-tinta-suave underline underline-offset-4 transition-colors hover:text-urgencia"
              >
                Vaciar el pedido
              </button>
            </div>
          )}
        </div>
      </dialog>
    </>
  )
}
