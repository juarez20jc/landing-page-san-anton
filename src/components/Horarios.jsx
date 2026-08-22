import { clinica, enlaceWhatsapp } from '../data/clinica.js'
import { useAbiertoAhora, tramoDelDia } from '../hooks/useAbiertoAhora.js'
import { SeccionTitulo, Boton, Foto } from './ui/Primitivas.jsx'
import { IconoReloj, IconoTelefono } from './icons/Iconos.jsx'

export default function Horarios() {
  const { abierto, mensaje } = useAbiertoAhora()
  const tramoHoy = tramoDelDia(new Date().getDay())

  return (
    <section id="horarios" className="scroll-mt-24 bg-menta/50 py-20 lg:py-28">
      <div className="contenedor grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
        {/* ------------------------------------------------------ horarios */}
        <div>
          <SeccionTitulo eyebrow="Cuándo venir" titulo="Horarios de atención" />

          <div className="ficha mt-8 p-6 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="flex items-center gap-2.5 font-display text-lg font-bold text-quirofano">
                <IconoReloj className="h-5 w-5 text-eucalipto" />
                Consulta con cita
              </p>
              <p
                className={`sello ${
                  abierto ? 'border-emerald-600 text-emerald-700' : 'border-ambar-hondo text-ambar-hondo'
                }`}
                // El estado se calcula con la hora local de quien visita
                aria-live="polite"
              >
                {abierto ? 'Abierto ahora' : 'Cerrado ahora'}
              </p>
            </div>

            <hr className="filete-perforado my-5 border-0" />

            <table className="w-full text-left">
              <caption className="sr-only">
                Horarios de consulta de {clinica.nombre} por día de la semana
              </caption>
              <tbody className="font-mono text-sm">
                {clinica.horarios.map((h) => {
                  const esHoy = h === tramoHoy
                  return (
                    <tr
                      key={h.etiqueta}
                      className={`border-b border-eucalipto/10 last:border-0 ${
                        esHoy ? 'text-quirofano' : 'text-tinta-suave'
                      }`}
                    >
                      <th
                        scope="row"
                        className="py-3 pr-4 font-medium"
                      >
                        <span className="flex items-center gap-2">
                          {esHoy && (
                            <span
                              aria-hidden="true"
                              className="h-1.5 w-1.5 rounded-full bg-ambar"
                            />
                          )}
                          {h.etiqueta}
                          {esHoy && <span className="sr-only">(hoy)</span>}
                        </span>
                      </th>
                      <td className="py-3 text-right tabular-nums">
                        {h.abre} – {h.cierra} h
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            <p className="mt-5 rounded-xl bg-menta px-4 py-3 text-sm text-eucalipto">
              {mensaje}. Los días festivos atendemos con horario de domingo.
            </p>
          </div>
        </div>

        {/* ----------------------------------------------------- urgencias */}
        <div className="revelar relative overflow-hidden rounded-ficha bg-quirofano text-white">
          <Foto
            src="/img/urgencias"
            alt="Un veterinario de guardia revisa a un perro pequeño en la sala de urgencias durante la noche"
            width={1600}
            height={900}
            sizes="(min-width: 1024px) 50vw, 92vw"
            className="absolute inset-0 h-full w-full object-cover opacity-75"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-quirofano via-quirofano/78 to-quirofano/15"
          />

          <div className="relative flex h-full flex-col justify-end p-7 sm:p-9">
            <p className="sello self-start border-urgencia bg-urgencia text-white">
              Guardia activa
            </p>

            <h3 className="mt-5 text-titulo text-white">{clinica.urgencias.titulo}</h3>
            <p className="mt-3 max-w-md leading-relaxed text-menta">
              {clinica.urgencias.texto}
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Boton
                href={`tel:${clinica.telefono.tel}`}
                className="w-full sm:w-auto"
                aria-label={`Llamar a urgencias al ${clinica.telefono.visible}`}
              >
                <IconoTelefono className="h-5 w-5" />
                {clinica.telefono.visible}
              </Boton>
              <Boton
                variante="claro"
                href={enlaceWhatsapp(
                  `URGENCIA — Hola ${clinica.nombre}, mi mascota necesita atención ahora mismo.`,
                )}
                target="_blank"
                rel="noopener"
                className="w-full sm:w-auto"
              >
                Avisar por WhatsApp
              </Boton>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
