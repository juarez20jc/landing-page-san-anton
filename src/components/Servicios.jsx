import { servicios, clinica, enlaceWhatsapp } from '../data/clinica.js'
import { iconosServicio } from './icons/Iconos.jsx'
import { SeccionTitulo, Boton } from './ui/Primitivas.jsx'
import Carrusel from './ui/Carrusel.jsx'
import { IconoFlecha } from './icons/Iconos.jsx'

export default function Servicios() {
  return (
    <section id="servicios" className="scroll-mt-24 py-20 lg:py-28">
      <div className="contenedor">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SeccionTitulo
            eyebrow="Qué hacemos"
            titulo="Todo lo que tu mascota necesita, bajo el mismo techo"
            texto="Sin derivaciones a otra clínica ni esperas de tres días por un análisis. El quirófano, el laboratorio y los rayos X están en el mismo consultorio donde te atendemos."
          />
          <Boton variante="linea" href="#cita" className="shrink-0 self-start lg:self-auto">
            Reservar cita
            <IconoFlecha className="h-5 w-5" />
          </Boton>
        </div>

        <div className="revelar mt-12">
          <Carrusel etiqueta={`Servicios de ${clinica.nombre}`} clasesRejilla="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {servicios.map((servicio) => {
            const Icono = iconosServicio[servicio.icono]
            const esUrgencias = servicio.destacado

            return (
                <li key={servicio.titulo}>
                <article
                  className={`group flex h-full flex-col rounded-ficha border p-6 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 ${
                    esUrgencias
                      ? 'border-urgencia/25 bg-urgencia/6 hover:border-urgencia/50 hover:shadow-[0_18px_40px_-28px_rgb(193_69_60/0.9)]'
                      : 'border-eucalipto/15 bg-white hover:border-eucalipto/40 hover:shadow-[0_18px_40px_-28px_rgb(13_59_58/0.7)]'
                  }`}
                >
                  <span
                    className={`flex h-13 w-13 items-center justify-center rounded-2xl transition-colors ${
                      esUrgencias
                        ? 'bg-urgencia/12 text-urgencia'
                        : 'bg-menta text-quirofano group-hover:bg-quirofano group-hover:text-ambar'
                    }`}
                  >
                    <Icono className="h-7 w-7" />
                  </span>

                  <h3 className="mt-5 text-xl text-quirofano">{servicio.titulo}</h3>
                  <p className="mt-2.5 flex-1 leading-relaxed text-tinta-suave">
                    {servicio.texto}
                  </p>

                  <p
                    className={`etiqueta-dato mt-5 border-t pt-4 ${
                      esUrgencias
                        ? 'border-urgencia/20 text-urgencia'
                        : 'border-eucalipto/12 text-eucalipto'
                    }`}
                  >
                    {servicio.detalle}
                  </p>
                </article>
              </li>
            )
            })}
          </Carrusel>
        </div>

        <p className="mt-8 text-center text-tinta-suave">
          ¿No sabes qué necesita tu mascota?{' '}
          <a
            href={enlaceWhatsapp(
              `Hola ${clinica.nombre}, no estoy seguro de qué servicio necesita mi mascota. ¿Me orientan?`,
            )}
            target="_blank"
            rel="noopener"
            className="font-semibold text-quirofano underline decoration-ambar decoration-2 underline-offset-4 hover:text-eucalipto"
          >
            Cuéntanos por WhatsApp
          </a>{' '}
          y te decimos.
        </p>
      </div>
    </section>
  )
}
