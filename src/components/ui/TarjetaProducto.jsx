import { precioFinal, soles } from '../../data/clinica.js'
import { usePedido } from '../../hooks/usePedido.jsx'
import { Foto } from './Primitivas.jsx'
import {
  IconoCheck,
  IconoCepillo,
  IconoComedero,
  IconoPastillas,
} from '../icons/Iconos.jsx'

/* Mientras no llegue la foto del artículo, la tarjeta enseña un dibujo suyo.
   La clave sale de `dibujo` en src/data/clinica.js. */
const DIBUJOS = {
  comedero: <IconoComedero className="h-12 w-12" />,
  cepillo: <IconoCepillo className="h-12 w-12" />,
  pastillas: <IconoPastillas className="h-12 w-12" />,
}

/**
 * Una tarjeta de producto: foto, descuento, precio y la casilla que lo mete
 * o lo saca del pedido.
 *
 * La foto va con `object-fit: contain` a propósito: son fotos de catálogo
 * con la marca impresa y recortarlas se come justo lo que identifica el
 * producto. Cuando `foto` es null se ve el marco vacío, que es una señal
 * honesta de que falta subirla.
 */
export default function TarjetaProducto({ producto }) {
  const { tiene, alternar } = usePedido()
  const dentro = tiene(producto.id)
  const precio = precioFinal(producto)

  return (
    <li className="tarjeta-viva flex flex-col overflow-hidden rounded-ficha border border-eucalipto/15 bg-white shadow-[0_1px_2px_rgb(13_59_58/0.05),0_12px_28px_-18px_rgb(13_59_58/0.28)]">
      {/* El marco manda sobre la foto, no al revés: la imagen va posicionada
          contra los cuatro lados, así una foto vertical se ajusta dentro en
          vez de estirar la tarjeta y descuadrar la fila entera. */}
      <div
        className={`relative aspect-[3/2] overflow-hidden sm:aspect-[4/3] ${
          producto.foto
            ? 'border-b border-eucalipto/12 bg-white'
            : 'border-b border-dashed border-eucalipto/35 bg-menta/45'
        }`}
      >
        {producto.foto ? (
          <Foto
            src={producto.foto}
            alt={producto.nombre}
            width={320}
            height={240}
            sizes="(min-width: 1024px) 18rem, 74vw"
            className="absolute inset-0 h-full w-full object-contain p-3"
          />
        ) : (
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-eucalipto/45">
            {DIBUJOS[producto.dibujo] ?? null}
            <span className="etiqueta-dato text-tinta-suave">Foto pendiente</span>
          </span>
        )}

        <span className="absolute left-3 top-3 rounded-full bg-ambar px-2.5 py-1 font-mono text-[0.7rem] font-semibold text-tinta">
          −{producto.descuento}&nbsp;%
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-display text-[1.05rem] font-bold leading-tight tracking-tight text-quirofano">
          {producto.nombre}
        </h3>
        <p className="text-sm leading-relaxed text-tinta-suave">{producto.texto}</p>

        <p className="mt-auto flex items-baseline gap-2 pt-3">
          <span className="font-display text-[1.35rem] font-bold tracking-tight text-quirofano">
            {soles(precio)}
          </span>
          <span className="text-sm text-tinta-suave line-through">
            {soles(producto.lista)}
          </span>
        </p>

        <button
          type="button"
          onClick={() => alternar(producto.id)}
          aria-pressed={dentro}
          className="boton-pedido mt-3"
        >
          <span
            aria-hidden="true"
            className={`casilla flex h-[1.15rem] w-[1.15rem] shrink-0 items-center justify-center rounded-[0.3rem] border-2 ${
              dentro ? 'border-quirofano bg-quirofano text-white' : 'border-eucalipto/40'
            }`}
          >
            {dentro && <IconoCheck className="h-3 w-3" strokeWidth={3} />}
          </span>
          {dentro ? 'Añadido al pedido' : 'Añadir al pedido'}
          <span className="sr-only"> — {producto.nombre}</span>
        </button>
      </div>
    </li>
  )
}
