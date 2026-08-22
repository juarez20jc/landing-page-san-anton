import { useEffect, useRef, useState } from 'react'
import { clinica, navegacion, enlaceWhatsapp } from '../data/clinica.js'
import { useAbiertoAhora } from '../hooks/useAbiertoAhora.js'
import { Logotipo, IconoMenu, IconoCerrar, IconoTelefono } from './icons/Iconos.jsx'
import { Boton } from './ui/Primitivas.jsx'

function Marca({ className = '' }) {
  return (
    <a
      href="#inicio"
      className={`flex items-center gap-2.5 ${className}`}
      aria-label={`${clinica.nombre}, ir al inicio`}
    >
      <Logotipo className="h-9 w-9 shrink-0 text-quirofano" />
      <span className="font-display text-xl font-bold tracking-tight text-quirofano">
        {clinica.nombre}
      </span>
    </a>
  )
}

export default function Header({ compacto }) {
  const [abierto, setAbierto] = useState(false)
  const dialogo = useRef(null)
  const { abierto: enHorario, mensaje } = useAbiertoAhora()

  // <dialog> nativo: aporta gratis el atrapado de foco, el cierre con Esc y
  // el marcado inerte del resto de la página. No hace falta reimplementarlo.
  useEffect(() => {
    const nodo = dialogo.current
    if (!nodo) return
    if (abierto && !nodo.open) nodo.showModal()
    if (!abierto && nodo.open) nodo.close()
  }, [abierto])

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-[background-color,box-shadow,border-color] duration-300 ${
        compacto
          ? 'border-eucalipto/15 bg-gasa/90 shadow-[0_6px_24px_-20px_rgb(13_59_58/0.6)] backdrop-blur-md'
          : 'border-transparent bg-gasa'
      }`}
    >
      <div className="contenedor flex h-[4.5rem] items-center justify-between gap-4">
        <Marca />

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navegacion.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="rounded-full px-3.5 py-2 text-[0.95rem] font-medium text-tinta-suave transition-colors hover:bg-menta hover:text-quirofano"
                >
                  {item.texto}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {/* Estado de apertura en vivo: prueba de que la clínica está operando */}
          <p className="hidden items-center gap-2 rounded-full border border-eucalipto/20 py-1.5 pl-3 pr-3.5 xl:flex">
            <span
              aria-hidden="true"
              className={`h-2 w-2 rounded-full ${
                enHorario ? 'bg-emerald-500' : 'bg-ambar'
              }`}
            />
            <span className="etiqueta-dato text-tinta-suave">{mensaje}</span>
          </p>

          <a
            href={`tel:${clinica.telefono.tel}`}
            className="hidden h-11 w-11 items-center justify-center rounded-full border-2 border-quirofano/20 text-quirofano transition-colors hover:bg-menta sm:flex lg:hidden xl:flex"
            aria-label={`Llamar al ${clinica.telefono.visible}`}
          >
            <IconoTelefono className="h-5 w-5" />
          </a>

          <Boton href="#cita" className="hidden !min-h-11 !px-5 !text-[0.95rem] sm:inline-flex">
            Reservar cita
          </Boton>

          <button
            type="button"
            onClick={() => setAbierto(true)}
            className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-quirofano/20 text-quirofano transition-colors hover:bg-menta lg:hidden"
            aria-label="Abrir el menú de navegación"
          >
            <IconoMenu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* --- Menú móvil ---------------------------------------------------- */}
      <dialog
        ref={dialogo}
        onClose={() => setAbierto(false)}
        // Cierra al tocar fuera del panel (soporte nativo donde exista)
        closedby="any"
        className="m-0 ml-auto h-dvh max-h-none w-[min(22rem,88vw)] max-w-none bg-gasa p-0 text-tinta backdrop:bg-quirofano/55 backdrop:backdrop-blur-sm"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-eucalipto/15 px-5 py-4">
            <Marca />
            <button
              type="button"
              onClick={() => setAbierto(false)}
              className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-quirofano/20 text-quirofano"
              aria-label="Cerrar el menú"
            >
              <IconoCerrar className="h-6 w-6" />
            </button>
          </div>

          <nav aria-label="Navegación móvil" className="flex-1 overflow-y-auto px-5 py-4">
            <ul className="flex flex-col">
              {navegacion.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => setAbierto(false)}
                    className="block border-b border-eucalipto/10 py-3.5 font-display text-lg font-semibold text-quirofano"
                  >
                    {item.texto}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="grid gap-2.5 border-t border-eucalipto/15 px-5 py-5">
            <p className="etiqueta-dato text-tinta-suave">{mensaje}</p>
            <Boton href="#cita" onClick={() => setAbierto(false)}>
              Reservar cita
            </Boton>
            <Boton
              variante="linea"
              href={enlaceWhatsapp(
                `Hola ${clinica.nombre}, quiero información para agendar una cita.`,
              )}
              target="_blank"
              rel="noopener"
              onClick={() => setAbierto(false)}
            >
              Escribir por WhatsApp
            </Boton>
            <a
              href={`tel:${clinica.telefono.tel}`}
              className="mt-1 text-center font-mono text-sm text-tinta-suave underline underline-offset-4"
            >
              {clinica.telefono.visible}
            </a>
          </div>
        </div>
      </dialog>
    </header>
  )
}
