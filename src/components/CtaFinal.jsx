import { clinica, enlaceWhatsapp } from '../data/clinica.js'
import { Boton } from './ui/Primitivas.jsx'
import { IconoWhatsapp, IconoTelefono } from './icons/Iconos.jsx'

export default function CtaFinal() {
  return (
    <section aria-labelledby="cta-final" className="bg-ambar">
      <div className="contenedor py-16 lg:py-20">
        <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="etiqueta-dato text-quirofano">Último paso</p>
            <h2 id="cta-final" className="mt-3 text-titulo text-tinta">
              Aparta el hueco de hoy antes de que se lo lleve alguien más
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-tinta/80">
              Nos dices qué le pasa a tu mascota, te confirmamos la hora y te esperamos
              con su expediente abierto. Sin llamadas en espera.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch">
            <Boton variante="oscuro" href="#cita" className="w-full">
              Reservar cita
            </Boton>
            <Boton
              variante="linea"
              href={enlaceWhatsapp(
                `Hola ${clinica.nombre}, quiero reservar una cita para mi mascota.`,
              )}
              target="_blank"
              rel="noopener"
              className="w-full !border-tinta/25 !text-tinta hover:!bg-tinta/8"
            >
              <IconoWhatsapp className="h-5 w-5" />
              WhatsApp
            </Boton>
            <a
              href={`tel:${clinica.telefono.tel}`}
              className="flex items-center justify-center gap-2 py-1 font-mono text-sm font-medium text-tinta/75 underline underline-offset-4 hover:text-tinta"
            >
              <IconoTelefono className="h-4 w-4" />
              {clinica.telefono.visible}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
