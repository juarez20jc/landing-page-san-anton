import { useDesplazado } from './hooks/useDesplazado.js'
import { ProveedorPedido } from './hooks/usePedido.jsx'
import { liquidacion, masVendidos } from './data/clinica.js'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Servicios from './components/Servicios.jsx'
import Productos from './components/Productos.jsx'
import SobreClinica from './components/SobreClinica.jsx'
import Testimonios from './components/Testimonios.jsx'
import Horarios from './components/Horarios.jsx'
import Ubicacion from './components/Ubicacion.jsx'
import Footer from './components/Footer.jsx'
import BotonWhatsApp from './components/BotonWhatsApp.jsx'
import Carrito from './components/Carrito.jsx'

export default function App() {
  // Un centinela de altura cero en lo más alto del documento: en cuanto sale
  // de pantalla sabemos que la persona ya hizo scroll.
  const { centinela, desplazado } = useDesplazado()

  return (
    <ProveedorPedido>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-quirofano focus:px-5 focus:py-3 focus:font-semibold focus:text-white"
      >
        Saltar al contenido
      </a>

      <div ref={centinela} aria-hidden="true" className="h-px" />

      <Header compacto={desplazado} />

      <main id="contenido">
        <Hero />
        <Servicios />

        <Productos
          id="liquidacion"
          eyebrow="Liquidación de estantería"
          titulo="Estamos haciendo sitio en el estante"
          texto="Camas, transportadoras, rascadores y accesorios que llevan meses esperando comprador. Marca los que te interesen y te los apartamos."
          productos={liquidacion}
        />

        <SobreClinica />
        <Testimonios />
        <Horarios />
        <Ubicacion />

        <Productos
          id="productos"
          eyebrow="Los más vendidos"
          titulo="Productos estrellas del mes"
          texto="Encuentra los productos esenciales para tu mascota con descuentos exclusivos de nuestra clínica. Compra sin monto mínimo, selecciona tus artículos y los dejaremos listos para tu recojo."
          productos={masVendidos}
          fondo="bg-menta/50"
        />
      </main>

      <Footer />

      {/* El carrito va encima del botón de WhatsApp y sólo asoma cuando hay
          algo marcado; el panel se abre desde ahí. */}
      <Carrito visible={desplazado} />
      <BotonWhatsApp visible={desplazado} />
    </ProveedorPedido>
  )
}
