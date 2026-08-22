import { equipo } from '../data/clinica.js'
import { SeccionTitulo, Foto } from './ui/Primitivas.jsx'

export default function Equipo() {
  return (
    <section id="equipo" className="scroll-mt-24 py-20 lg:py-28">
      <div className="contenedor">
        <SeccionTitulo
          eyebrow="Quién te atiende"
          titulo="Las mismas caras cada vez que vienes"
          texto="No rotamos veterinarios entre sucursales. Tu mascota ve siempre al mismo médico, que conoce su historial de memoria."
        />

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {equipo.map((persona) => (
            <li key={persona.nombre} className="revelar">
              <article className="ficha ficha-pestana h-full">
                <Foto
                  src={persona.foto}
                  alt={persona.alt}
                  width={800}
                  height={800}
                  sizes="(min-width: 1024px) 20vw, (min-width: 640px) 44vw, 88vw"
                  className="aspect-square w-full rounded-t-[1.15rem] object-cover"
                />

                <div className="p-5">
                  <p className="etiqueta-dato text-ambar-hondo">{persona.puesto}</p>
                  <h3 className="mt-1.5 text-lg text-quirofano">{persona.nombre}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-tinta-suave">
                    {persona.especialidad}
                  </p>

                  <hr className="filete-perforado my-4 border-0" />

                  <dl className="grid grid-cols-2 gap-3 font-mono text-xs text-tinta-suave">
                    <div>
                      <dt className="etiqueta-dato text-eucalipto">Cédula</dt>
                      <dd className="mt-0.5 tabular-nums">{persona.cedula}</dd>
                    </div>
                    <div>
                      <dt className="etiqueta-dato text-eucalipto">Ejercicio</dt>
                      <dd className="mt-0.5 tabular-nums">{persona.anios} años</dd>
                    </div>
                  </dl>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
