import { clinica, cifras, enlaceWhatsapp } from '../data/clinica.js'
import { useAbiertoAhora } from '../hooks/useAbiertoAhora.js'
import { Boton, Foto, Estrellas } from './ui/Primitivas.jsx'
import { IconoWhatsapp } from './icons/Iconos.jsx'

export default function Hero() {
  const { abierto, mensaje } = useAbiertoAhora()

  return (
    <section id="inicio" className="relative overflow-hidden bg-quirofano text-white">
      {/* Textura de huellas + halo cálido. Ambos decorativos, muy sutiles. */}
      <div aria-hidden="true" className="textura-huellas absolute inset-0" />
      <div
        aria-hidden="true"
        className="absolute -right-40 -top-56 h-[38rem] w-[38rem] rounded-full bg-ambar/12 blur-3xl"
      />

      <div className="contenedor relative">
        <div className="grid items-center gap-12 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-24">
          {/* ------------------------------------------------------ texto */}
          <div>
            <p className="entrada etiqueta-dato flex flex-wrap items-center gap-x-3 gap-y-2 text-ambar">
              <span className="rounded-full bg-ambar/15 px-3 py-1.5">Urgencias 24/7</span>
              <span className="text-menta/70">
                {clinica.direccion.zona} · {clinica.direccion.ciudad}
              </span>
            </p>

            <h1
              className="entrada mt-5 text-despliegue text-white"
              style={{ '--i': 1 }}
            >
              Cuidamos al que te acompaña todos los días
            </h1>

            <p
              className="entrada mt-7 max-w-xl text-subtitulo leading-relaxed text-menta"
              style={{ '--i': 2 }}
            >
              Consulta, vacunación, cirugía, estética y laboratorio en{' '}
              {clinica.direccion.zona}, con urgencias las 24 horas.
              Catorce años y doce mil pacientes después, seguimos atendiendo sin prisas.
            </p>

            <div className="entrada mt-9 flex flex-col gap-3 sm:flex-row" style={{ '--i': 3 }}>
              <Boton href="#cita" className="w-full sm:w-auto">
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
              >
                <IconoWhatsapp className="h-5 w-5" />
                Escribir por WhatsApp
              </Boton>
            </div>

            <div
              className="entrada mt-8 flex flex-wrap items-center gap-x-6 gap-y-3"
              style={{ '--i': 4 }}
            >
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

          {/* ------------------------------------------------------- ficha */}
          <div className="entrada relative mx-auto w-full max-w-md lg:max-w-none" style={{ '--i': 2 }}>
            <div className="ficha ficha-pestana bg-eucalipto/40 p-2.5">
              <Foto
                src="/img/portada"
                alt="Una veterinaria de San Antón, sonriente y en uniforme azul, junto a un cachorro de golden retriever sobre la mesa de exploración"
                width={512}
                height={640}
                prioridad
                sizes="(min-width: 1024px) 42vw, (min-width: 640px) 26rem, 90vw"
                className="aspect-[4/5] w-full rounded-[0.85rem] object-cover"
              />
            </div>

          </div>
        </div>

        {/* --------------------------------------------------------- cifras */}
        <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/12 bg-white/12 sm:grid-cols-3">
          {cifras.map((c) => (
            <div key={c.etiqueta} className="bg-quirofano px-5 py-6 text-center sm:text-left">
              <dt className="sr-only">{c.etiqueta}</dt>
              <dd>
                <span className="font-display text-4xl font-bold text-ambar">
                  {c.valor}
                  <span className="text-2xl">{c.sufijo}</span>
                </span>
                <span className="mt-1 block text-sm text-menta/85">{c.etiqueta}</span>
              </dd>
            </div>
          ))}
        </dl>
        <div className="h-14 lg:h-16" />
      </div>
    </section>
  )
}
