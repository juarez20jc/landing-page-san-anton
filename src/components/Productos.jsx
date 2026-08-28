import { SeccionTitulo } from './ui/Primitivas.jsx'
import TarjetaProducto from './ui/TarjetaProducto.jsx'
import Carrusel from './ui/Carrusel.jsx'

/**
 * Las dos secciones de tienda comparten todo menos los textos y el fondo:
 * liquidación de estantería y los productos que más salen.
 *
 * Aquí no hay resumen del pedido ni botón de compra: lo marcado se ve y se
 * edita en el carrito flotante, que es el único sitio donde se puede quitar
 * algo de la lista.
 *
 * El carrusel va activo también en escritorio (`siempre`), porque son doce
 * productos y en rejilla se comerían la página entera.
 */
export default function Productos({ id, eyebrow, titulo, texto, productos, fondo = '' }) {
  return (
    <section id={id} className={`scroll-mt-24 py-20 lg:py-28 ${fondo}`}>
      <div className="contenedor">
        <SeccionTitulo eyebrow={eyebrow} titulo={titulo} texto={texto} />

        <div className="mt-12">
          <Carrusel
            etiqueta={titulo}
            siempre
            clasesRejilla="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {productos.map((p) => (
              <TarjetaProducto key={p.id} producto={p} />
            ))}
          </Carrusel>
        </div>
      </div>
    </section>
  )
}
