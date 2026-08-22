import { useDesplazado } from './hooks/useDesplazado.js'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Servicios from './components/Servicios.jsx'
import SobreClinica from './components/SobreClinica.jsx'
import Testimonios from './components/Testimonios.jsx'
import Horarios from './components/Horarios.jsx'
import Ubicacion from './components/Ubicacion.jsx'
import CtaFinal from './components/CtaFinal.jsx'
import Footer from './components/Footer.jsx'
import BotonWhatsApp from './components/BotonWhatsApp.jsx'

export default function App() {
  // Un centinela de altura cero en lo más alto del documento: en cuanto sale
  // de pantalla sabemos que la persona ya hizo scroll.
  const { centinela, desplazado } = useDesplazado()

  return (
    <>
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
        <SobreClinica />
        <Testimonios />
        <Horarios />
        <Ubicacion />
        <CtaFinal />
      </main>

      <Footer />
      <BotonWhatsApp visible={desplazado} />
    </>
  )
}
