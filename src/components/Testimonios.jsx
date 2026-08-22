import { testimonios } from '../data/clinica.js'
import { SeccionTitulo, Estrellas } from './ui/Primitivas.jsx'
import Carrusel from './ui/Carrusel.jsx'

export default function Testimonios() {
  return (
    <section
      id="testimonios"
      className="relative scroll-mt-24 overflow-hidden bg-quirofano py-20 text-white lg:py-28"
    >
      <div aria-hidden="true" className="textura-huellas absolute inset-0" />

      <div className="contenedor relative">
        <SeccionTitulo
          claro
          eyebrow="Lo que dicen"
          titulo="380 reseñas y un promedio de 4.9"
          texto="Estas son de las que nos gusta releer cuando el turno se pone largo."
        />

        <div className="revelar mt-12">
          <Carrusel etiqueta="Reseñas de clientes" claro clasesRejilla="grid gap-5 md:grid-cols-2">
          {testimonios.map((t) => (
              <li key={t.autor}>
              <figure className="ficha flex h-full flex-col p-6">
                <div className="flex items-start justify-between gap-4">
                  <Estrellas cantidad={t.estrellas} />
                  <p className="sello shrink-0 border-eucalipto/40 text-eucalipto">
                    {t.servicio}
                  </p>
                </div>

                <blockquote className="mt-4 flex-1 text-lg leading-relaxed text-tinta">
                  <p>«{t.texto}»</p>
                </blockquote>

                <hr className="filete-perforado my-5 border-0" />

                <figcaption>
                  <p className="font-display font-bold text-quirofano">{t.autor}</p>
                  <p className="etiqueta-dato mt-1 text-tinta-suave">{t.mascota}</p>
                </figcaption>
              </figure>
            </li>
            ))}
          </Carrusel>
        </div>
      </div>
    </section>
  )
}
