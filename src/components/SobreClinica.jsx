import { clinica } from '../data/clinica.js'
import { SeccionTitulo, Foto } from './ui/Primitivas.jsx'
import { IconoCheck } from './icons/Iconos.jsx'
import { useRotacion } from '../hooks/useRotacion.js'

const DIFERENCIADORES = [
  {
    titulo: 'Consultas de cuarenta minutos',
    texto: 'Agendamos menos pacientes por hora a propósito, para que nadie salga con dudas.',
  },
  {
    titulo: 'Manejo libre de estrés',
    texto: 'Salas separadas para perros y gatos, feromonas, y nada de sujeción a la fuerza.',
  },
  {
    titulo: 'Presupuesto antes de empezar',
    texto: 'Te decimos cuánto cuesta y qué incluye antes de hacer cualquier estudio.',
  },
  {
    titulo: 'Historial siempre disponible',
    texto: 'Expediente digital con vacunas, análisis y radiografías, que puedes pedir cuando quieras.',
  },
]

export default function SobreClinica() {
  return (
    <section id="clinica" className="scroll-mt-24 bg-menta/50 py-20 lg:py-28">
      <div className="contenedor grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* ------------------------------------------------------- imagen */}
        <div className="revelar relative order-1 lg:order-none">
          <div className="ficha ficha-pestana p-2.5">
            <Foto
              src="/img/clinica"
              alt="Recepción de San Antón: mostrador de madera, plantas y pared verde"
              width={700}
              height={525}
              sizes="(min-width: 1024px) 46vw, 92vw"
              className="aspect-[4/3] w-full rounded-[0.85rem] object-cover"
            />
          </div>

          <p className="sello absolute -bottom-4 right-5 border-quirofano bg-gasa text-quirofano">
            Desde {clinica.fundacion}
          </p>
        </div>

        {/* -------------------------------------------------------- texto */}
        <div>
          <SeccionTitulo
            eyebrow="La clínica"
            titulo="Atención veterinaria de confianza, cerca de ti"
            texto={`Desde el ${clinica.fundacion}, somos una clínica veterinaria dedicada al cuidado integral de perros y gatos. Contamos con un equipo profesional y espacios equipados para brindar atención médica, diagnósticos, tratamientos y procedimientos en un ambiente seguro y tranquilo.`}
          />

          <Diferenciadores />
        </div>
      </div>
    </section>
  )
}

/* --------------------------------------------------- Diferenciadores --- */

/**
 * En escritorio, los cuatro motivos en rejilla. En celular y tablet ocupaban
 * media pantalla apilados, así que sale uno cada dos segundos y al llegar al
 * último vuelve al primero. El alto va fijado para que la página no dé un
 * salto cada vez que cambia el texto.
 */
function Diferenciadores() {
  const { contenedor, activo, indice, irA, detenido, alternarPausa } = useRotacion(
    DIFERENCIADORES.length,
  )

  if (!activo) {
    return (
      <dl className="mt-10 grid gap-6 sm:grid-cols-2">
        {DIFERENCIADORES.map((d) => (
          <div key={d.titulo}>
            <dt className="flex items-start gap-2.5 font-display text-lg font-bold text-quirofano">
              <IconoCheck className="mt-1 h-5 w-5 shrink-0 text-ambar" />
              {d.titulo}
            </dt>
            <dd className="mt-1.5 pl-7.5 text-tinta-suave">{d.texto}</dd>
          </div>
        ))}
      </dl>
    )
  }

  const d = DIFERENCIADORES[indice]

  return (
    <div ref={contenedor} className="mt-10">
      <dl
        aria-live="polite"
        className="flex min-h-[8.5rem] flex-col justify-center rounded-ficha border border-eucalipto/15 bg-white p-5"
      >
        <dt className="flex items-start gap-2.5 font-display text-lg font-bold text-quirofano">
          <IconoCheck className="mt-1 h-5 w-5 shrink-0 text-ambar" />
          {d.titulo}
        </dt>
        <dd className="mt-2 pl-7.5 leading-relaxed text-tinta-suave">{d.texto}</dd>
      </dl>

      <div className="mt-4 flex items-center justify-center gap-4">
        <ul className="flex items-center gap-2">
          {DIFERENCIADORES.map((otro, i) => (
            <li key={otro.titulo}>
              <button
                type="button"
                onClick={() => irA(i)}
                aria-label={`Ver «${otro.titulo}»`}
                aria-current={i === indice ? 'true' : undefined}
                className="flex h-11 w-6 items-center justify-center"
              >
                <span
                  aria-hidden="true"
                  className={`block h-2 rounded-full transition-all duration-300 ${
                    i === indice ? 'w-6 bg-quirofano' : 'w-2 bg-eucalipto/25'
                  }`}
                />
              </button>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={alternarPausa}
          aria-label={detenido ? 'Reanudar el cambio automático' : 'Pausar el cambio automático'}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-eucalipto/25 text-tinta-suave transition-colors hover:bg-eucalipto/10"
        >
          {detenido ? (
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
              <path d="M8 5.5v13l11-6.5z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
              <path d="M8 5h3v14H8zM13 5h3v14h-3z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}
