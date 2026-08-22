import { useEffect, useRef, useState } from 'react'
import { clinica, servicios, enlaceWhatsapp } from '../data/clinica.js'
import { Boton } from './ui/Primitivas.jsx'
import { IconoWhatsapp } from './icons/Iconos.jsx'

const hoyISO = () => new Date().toISOString().slice(0, 10)

/**
 * Formulario de cita sin servidor.
 *
 * Al enviar compone un mensaje de WhatsApp ya redactado y abre la
 * conversación: cero backend que mantener y la petición aterriza en el
 * canal donde la clínica ya responde. La validación es la nativa del
 * navegador; :user-invalid marca el error sólo después de interactuar y
 * este componente refleja ese mismo estado en aria-invalid para que un
 * lector de pantalla reciba el aviso en el mismo momento que la vista.
 */
export default function FormularioCita() {
  const formulario = useRef(null)
  const [enviado, setEnviado] = useState(false)

  useEffect(() => {
    const nodo = formulario.current
    if (!nodo) return

    const sincronizarAria = (evento) => {
      const campo = evento.target
      if (!campo.matches?.('input, select, textarea')) return
      if (campo.matches(':user-invalid')) campo.setAttribute('aria-invalid', 'true')
      else campo.removeAttribute('aria-invalid')
    }

    // blur no burbujea: hay que escuchar en fase de captura
    nodo.addEventListener('blur', sincronizarAria, true)
    nodo.addEventListener('input', sincronizarAria)
    return () => {
      nodo.removeEventListener('blur', sincronizarAria, true)
      nodo.removeEventListener('input', sincronizarAria)
    }
  }, [])

  const enviar = (evento) => {
    evento.preventDefault()
    const datos = Object.fromEntries(new FormData(evento.currentTarget))

    const fecha = datos.fecha
      ? new Date(`${datos.fecha}T12:00:00`).toLocaleDateString('es-MX', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
        })
      : 'lo antes posible'

    const mensaje = [
      `Hola ${clinica.nombre}, quiero reservar una cita.`,
      '',
      `• Tutor: ${datos.nombre}`,
      `• Mascota: ${datos.mascota}`,
      `• Servicio: ${datos.servicio}`,
      `• Preferencia de día: ${fecha}`,
      datos.notas ? `• Notas: ${datos.notas}` : null,
    ]
      .filter(Boolean)
      .join('\n')

    window.open(enlaceWhatsapp(mensaje), '_blank', 'noopener')
    setEnviado(true)
  }

  return (
    <form ref={formulario} onSubmit={enviar} noValidate={false} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="nombre" className="mb-1.5 block text-sm font-semibold text-quirofano">
            Tu nombre <span className="text-urgencia">*</span>
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            required
            autoComplete="name"
            placeholder="Andrea Villalobos"
            className="campo peer"
            aria-errormessage="error-nombre"
          />
          <p id="error-nombre" className="error-campo">
            Escribe tu nombre para saber cómo llamarte.
          </p>
        </div>

        <div>
          <label htmlFor="mascota" className="mb-1.5 block text-sm font-semibold text-quirofano">
            Nombre de tu mascota <span className="text-urgencia">*</span>
          </label>
          <input
            id="mascota"
            name="mascota"
            type="text"
            required
            placeholder="Nube"
            className="campo"
            aria-errormessage="error-mascota"
          />
          <p id="error-mascota" className="error-campo">
            Dinos cómo se llama para preparar su expediente.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="servicio" className="mb-1.5 block text-sm font-semibold text-quirofano">
            ¿Qué necesita? <span className="text-urgencia">*</span>
          </label>
          <select id="servicio" name="servicio" required className="campo" defaultValue="">
            <option value="" disabled>
              Elige un servicio
            </option>
            {servicios.map((s) => (
              <option key={s.titulo} value={s.titulo}>
                {s.titulo}
              </option>
            ))}
            <option value="Todavía no lo sé">Todavía no lo sé</option>
          </select>
        </div>

        <div>
          <label htmlFor="fecha" className="mb-1.5 block text-sm font-semibold text-quirofano">
            Día que te viene bien
          </label>
          <input
            id="fecha"
            name="fecha"
            type="date"
            min={hoyISO()}
            className="campo"
          />
        </div>
      </div>

      <div>
        <label htmlFor="notas" className="mb-1.5 block text-sm font-semibold text-quirofano">
          Algo que debamos saber
        </label>
        <textarea
          id="notas"
          name="notas"
          rows={3}
          placeholder="Lleva dos días sin comer y se rasca la oreja izquierda."
          className="campo resize-y"
        />
      </div>

      <Boton type="submit" className="mt-1 w-full">
        <IconoWhatsapp className="h-5 w-5" />
        Enviar y reservar por WhatsApp
      </Boton>

      {/* El aviso posterior al envío se anuncia sin robar el foco */}
      <p aria-live="polite" className="min-h-6 text-center text-sm">
        {enviado ? (
          <span className="font-medium text-eucalipto">
            Abrimos WhatsApp con tu mensaje listo. Si no se abrió, escríbenos al{' '}
            <a
              href={`tel:${clinica.telefono.tel}`}
              className="underline underline-offset-4"
            >
              {clinica.telefono.visible}
            </a>
            .
          </span>
        ) : (
          <span className="text-tinta-suave">
            No se envía nada a ningún servidor: se abre WhatsApp con el mensaje ya escrito.
          </span>
        )}
      </p>
    </form>
  )
}
