import { clinica } from '../data/clinica.js'
import { SeccionTitulo, Foto } from './ui/Primitivas.jsx'
import { IconoCheck } from './icons/Iconos.jsx'

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
              width={1400}
              height={1050}
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
        </div>
      </div>
    </section>
  )
}
