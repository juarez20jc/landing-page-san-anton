import { useEffect, useRef, useState } from 'react'
import { clinica, cifras, portadas, enlaceWhatsapp } from '../data/clinica.js'
import { useAbiertoAhora } from '../hooks/useAbiertoAhora.js'
import { Boton, Foto, Estrellas } from './ui/Primitivas.jsx'
import { IconoWhatsapp, IconoFlecha, IconoFlechaIzq } from './icons/Iconos.jsx'

/* Seis segundos: lo que se tarda en leer un titular y su bajada sin agobio.
   Las tarjetas de producto van a dos porque son un vistazo; una portada no. */
const INTERVALO = 6000
const SIN_MOVIMIENTO = '(prefers-reduced-motion: reduce)'

/* En celular la portada lleva el compás de las cifras, que giran con ella:
   cuatro segundos quieta y uno de cambio. El deslizamiento dura lo mismo que
   el giro de las paletas (duration-1000 en la pista), así que portada y
   cifra salen y llegan a la vez. */
const CELULAR = '(max-width: 639.98px)'
const CIFRA_QUIETA = 4000
const CIFRA_GIRO = 1000

export default function Hero() {
  const { abierto, mensaje } = useAbiertoAhora()
  const [i, setI] = useState(0)
  const [detenido, setDetenido] = useState(false)
  const reloj = useRef(null)

  const total = portadas.length
  const actual = portadas[i]

  // Avance solo. Se reinicia con cada cambio manual, para que pulsar una
  // flecha no deje medio segundo de portada antes del siguiente salto.
  useEffect(() => {
    if (detenido || total < 2) return
    if (window.matchMedia(SIN_MOVIMIENTO).matches) return
    const espera = window.matchMedia(CELULAR).matches ? CIFRA_QUIETA + CIFRA_GIRO : INTERVALO
    reloj.current = setTimeout(() => setI((n) => (n + 1) % total), espera)
    return () => clearTimeout(reloj.current)
  }, [i, detenido, total])

  const irA = (n) => setI(((n % total) + total) % total)

  const redondo =
    'flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white/10'

  return (
    <section
      id="inicio"
      aria-roledescription="carrusel"
      aria-label="Portadas de San Antón"
      className="relative overflow-hidden text-white transition-colors duration-700"
      style={{ backgroundColor: actual.fondo }}
    >
      {/* Textura de huellas + halo cálido. Ambos decorativos, muy sutiles. */}
      <div aria-hidden="true" className="textura-huellas absolute inset-0" />
      <div
        aria-hidden="true"
        className="absolute -right-40 -top-56 h-[38rem] w-[38rem] rounded-full bg-ambar/12 blur-3xl"
      />

      <div className="relative">
        {/* ------------------------------------------------- las portadas */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-1000 ease-[cubic-bezier(.2,.8,.3,1)] motion-reduce:transition-none sm:duration-700"
            style={{ transform: `translateX(-${i * 100}%)` }}
          >
            {portadas.map((p, n) => (
              <div
                key={p.id}
                className="flex w-full shrink-0 items-center transition-colors duration-700"
                style={{ backgroundColor: p.fondo }}
                aria-hidden={n === i ? undefined : true}
                inert={n === i ? undefined : true}
              >
                <div className="contenedor">
                  {/* Desde tablet, foto y texto comparten franja: apilados
                      dejaban la foto sola en medio con aire a los lados. */}
                  <div className="grid items-center gap-12 pb-8 pt-14 md:grid-cols-[1.1fr_0.9fr] md:gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pb-12 lg:pt-24">
                    {/* ---------------------------------------- texto */}
                    <div>
                      <p className="etiqueta-dato flex flex-wrap items-center gap-x-3 gap-y-2 text-ambar">
                        <span className="rounded-full bg-ambar/15 px-3 py-1.5">{p.etiqueta}</span>
                        <span className="text-menta/70">{p.lugar}</span>
                      </p>

                      {/* Sólo la portada a la vista lleva el <h1>: tres
                          encabezados de nivel uno en la misma página
                          confunden a buscadores y lectores de pantalla. */}
                      {n === i ? (
                        <h1 className="mt-5 text-despliegue text-white">{p.titulo}</h1>
                      ) : (
                        <p className="mt-5 text-despliegue text-white">{p.titulo}</p>
                      )}

                      <p className="mt-7 max-w-xl text-subtitulo leading-relaxed text-menta md:text-lg lg:text-subtitulo">
                        {p.texto}
                      </p>

                      <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                        <Boton href="#cita" className="w-full sm:w-auto" tabIndex={n === i ? 0 : -1}>
                          Reservar cita
                        </Boton>
                        <Boton
                          variante="claro"
                          href={enlaceWhatsapp(
                            `Hola ${clinica.nombre}, quiero agendar una cita para mi mascota.`,
                          )}
                          target="_blank"
                          rel="noopener"
                          className="w-full sm:w-auto"
                          tabIndex={n === i ? 0 : -1}
                        >
                          <IconoWhatsapp className="h-5 w-5" />
                          Escribir por WhatsApp
                        </Boton>
                      </div>

                      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                        <p className="flex items-center gap-2.5">
                          <Estrellas />
                          <span className="text-sm text-menta">
                            <strong className="font-semibold text-white">4.9</strong> de 380 reseñas
                          </span>
                        </p>
                        <p className="flex items-center gap-2 text-sm text-menta">
                          <span
                            aria-hidden="true"
                            className={`h-2 w-2 rounded-full ${abierto ? 'bg-emerald-400' : 'bg-ambar'}`}
                          />
                          {mensaje}
                        </p>
                      </div>
                    </div>

                    {/* ----------------------------------------- ficha */}
                    <div className="relative mx-auto w-full max-w-md md:max-w-none">
                      <div className="ficha ficha-pestana bg-eucalipto/40 p-2.5">
                        <Foto
                          src={p.foto}
                          alt={p.alt}
                          width={512}
                          height={640}
                          prioridad={n === 0}
                          sizes="(min-width: 1024px) 42vw, (min-width: 768px) 40vw, (min-width: 640px) 26rem, 90vw"
                          className="aspect-[4/5] w-full rounded-[0.85rem] object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --------------------------------------------------- controles */}
        <div className="contenedor">
          <div className="flex items-center gap-4 pb-5">
            <ul className="flex items-center gap-2">
              {portadas.map((p, n) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => irA(n)}
                    aria-label={`Ir a la portada ${n + 1} de ${total}`}
                    aria-current={n === i ? 'true' : undefined}
                    className="flex h-11 w-7 items-center justify-center"
                  >
                    <span
                      aria-hidden="true"
                      className={`block h-2 rounded-full transition-all duration-300 ${
                        n === i ? 'w-7 bg-ambar' : 'w-2 bg-white/30'
                      }`}
                    />
                  </button>
                </li>
              ))}
            </ul>

            <p aria-live="polite" className="etiqueta-dato text-menta/70">
              Portada {i + 1} de {total}
            </p>

            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDetenido((d) => !d)}
                aria-label={
                  detenido ? 'Reanudar el cambio de portada' : 'Pausar el cambio de portada'
                }
                className={redondo}
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
              <button
                type="button"
                onClick={() => irA(i - 1)}
                aria-label="Portada anterior"
                className={redondo}
              >
                <IconoFlechaIzq className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => irA(i + 1)}
                aria-label="Portada siguiente"
                className={redondo}
              >
                <IconoFlecha className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* ----------------------------------------------------- cifras */}
          <Cifras fondo={actual.fondo} indice={i % cifras.length} />
          <div className="h-14 lg:h-16" />
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------- Cifras --- */

/* En celular las tres cifras apiladas se comían la pantalla, así que salen
   de una en una, como las paletas de un reloj de mesa. No llevan reloj
   propio: `indice` es el de la portada, de modo que giran cuando ella se
   desliza, también con las flechas, y se detienen con su pausa. Desde
   640 px, o si se pidió menos movimiento, vuelve la rejilla de siempre. */
const CON_PALETAS = `${CELULAR} and (prefers-reduced-motion: no-preference)`

function Cifras({ fondo, indice }) {
  const [activo, setActivo] = useState(() => window.matchMedia(CON_PALETAS).matches)
  // La que se va. Mientras no coincida con `indice` hay paletas en el aire.
  const [previa, setPrevia] = useState(indice)

  useEffect(() => {
    const mq = window.matchMedia(CON_PALETAS)
    const alCambiar = () => setActivo(mq.matches)
    mq.addEventListener('change', alCambiar)
    return () => mq.removeEventListener('change', alCambiar)
  }, [])

  if (!activo) {
    return (
      <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/12 bg-white/12 sm:grid-cols-3">
        {cifras.map((c) => (
          <div
            key={c.etiqueta}
            className="px-5 py-6 text-center transition-colors duration-700 sm:text-left"
            style={{ backgroundColor: fondo }}
          >
            <dt className="sr-only">{c.etiqueta}</dt>
            <dd>
              <Valor c={c} />
              <span className="mt-1 block text-sm text-menta/85">{c.etiqueta}</span>
            </dd>
          </div>
        ))}
      </dl>
    )
  }

  const girando = previa !== indice

  return (
    <>
      {/* El lector de pantalla recibe las tres de una vez: el giro es sólo
          para la vista y anunciar cada cambio sería ruido. */}
      <dl className="sr-only">
        {cifras.map((c) => (
          <div key={c.etiqueta}>
            <dt>{c.etiqueta}</dt>
            <dd>
              {c.valor}
              {c.sufijo}
            </dd>
          </div>
        ))}
      </dl>

      <div
        aria-hidden="true"
        className="paleta"
        style={{ '--fondo': fondo, '--giro': `${CIFRA_GIRO}ms` }}
      >
        {/* Detrás: arriba ya espera la nueva y abajo sigue la vieja. */}
        <Hoja n={indice} mitad="arriba" className={girando ? 'hoja-asoma' : ''} />
        <Hoja n={girando ? previa : indice} mitad="abajo" />

        {/* Delante: la mitad de arriba de la vieja cae y, al llegar abajo,
            la mitad de abajo de la nueva la tapa. */}
        {girando && (
          <>
            <Hoja key={`cae-${indice}`} n={previa} mitad="arriba" className="hoja-cae" />
            <Hoja
              key={`llega-${indice}`}
              n={indice}
              mitad="abajo"
              className="hoja-llega"
              onAnimationEnd={() => setPrevia(indice)}
            />
          </>
        )}
      </div>
    </>
  )
}

function Hoja({ n, mitad, className = '', ...props }) {
  const c = cifras[n]
  return (
    <div className={`hoja hoja-${mitad} ${className}`} {...props}>
      {mitad === 'arriba' ? (
        <>
          <span className="etiqueta-dato absolute left-4 top-3 text-menta/45">
            {n + 1}/{cifras.length}
          </span>
          <Valor c={c} className="leading-none" />
        </>
      ) : (
        <span className="text-sm text-menta/85">{c.etiqueta}</span>
      )}
    </div>
  )
}

function Valor({ c, className = '' }) {
  return (
    <span className={`font-display text-4xl font-bold text-ambar ${className}`}>
      {c.valor}
      <span className="text-2xl">{c.sufijo}</span>
    </span>
  )
}
