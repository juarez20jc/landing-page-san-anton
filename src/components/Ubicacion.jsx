import {
  clinica,
  direccionUnaLinea,
  enlaceMapa,
  enlaceMapaEmbed,
} from '../data/clinica.js'
import { SeccionTitulo } from './ui/Primitivas.jsx'
import FormularioCita from './FormularioCita.jsx'
import { IconoPin, IconoTelefono, IconoCorreo, IconoFlecha } from './icons/Iconos.jsx'

const DATOS = [
  {
    Icono: IconoPin,
    etiqueta: 'Dirección',
    valor: direccionUnaLinea,
    pie: clinica.direccion.referencia,
    href: enlaceMapa,
    externo: true,
  },
  {
    Icono: IconoTelefono,
    etiqueta: 'Teléfono',
    valor: clinica.telefono.visible,
    pie: 'Contestamos también fuera de horario para urgencias.',
    href: `tel:${clinica.telefono.tel}`,
  },
  {
    Icono: IconoCorreo,
    etiqueta: 'Correo',
    valor: clinica.email,
    pie: 'Para historiales, facturas y convenios.',
    href: `mailto:${clinica.email}`,
  },
]

export default function Ubicacion() {
  return (
    <section id="contacto" className="scroll-mt-24 py-20 lg:py-28">
      <div className="contenedor">
        <SeccionTitulo
          eyebrow="Dónde estamos"
          titulo="Ubicación y contacto"
          texto={`Estamos en ${clinica.direccion.zona}, con acceso a pie de calle y sin escalones para las camillas.`}
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          {/* ------------------------------------------------ mapa + datos */}
          <div className="grid min-w-0 content-start gap-6">
            <div className="ficha overflow-hidden p-2.5">
              <iframe
                src={enlaceMapaEmbed}
                title={`Mapa con la ubicación de ${clinica.nombre} en ${direccionUnaLinea}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="aspect-[21/10] w-full rounded-[0.85rem] border-0 bg-menta lg:aspect-[4/3]"
              />
            </div>

            <ul className="grid gap-2 lg:gap-3">
              {DATOS.map(({ Icono, etiqueta, valor, pie, href, externo }) => (
                <li key={etiqueta}>
                  <a
                    href={href}
                    {...(externo ? { target: '_blank', rel: 'noopener' } : {})}
                    className="group flex items-start gap-3.5 rounded-ficha border border-eucalipto/15 bg-white p-3.5 lg:gap-4 lg:p-4 transition-colors hover:border-eucalipto/40 hover:bg-menta/40"
                  >
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-menta text-quirofano transition-colors group-hover:bg-quirofano group-hover:text-ambar">
                      <Icono className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="etiqueta-dato block text-eucalipto">{etiqueta}</span>
                      <span className="mt-1 block font-semibold text-quirofano [overflow-wrap:anywhere]">{valor}</span>
                      <span className="mt-0.5 hidden text-sm text-tinta-suave lg:block">{pie}</span>
                    </span>
                    <IconoFlecha className="mt-2 h-5 w-5 shrink-0 text-eucalipto/50 transition-transform group-hover:translate-x-1" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ------------------------------------------------------- cita */}
          <div id="cita" className="self-start scroll-mt-24">
            <div className="ficha ficha-pestana p-6 sm:p-8">
              <p className="etiqueta-dato text-ambar-hondo">Reserva de cita</p>
              <h3 className="mt-2 text-2xl text-quirofano">
                Cuéntanos qué pasa y te confirmamos el horario
              </h3>
              <p className="mt-2.5 text-tinta-suave">
                Respondemos en menos de diez minutos dentro del horario de consulta.
              </p>

              <hr className="filete-perforado my-6 border-0" />

              <FormularioCita />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
