import {
  clinica,
  servicios,
  navegacion,
  direccionUnaLinea,
  enlaceMapa,
  enlaceWhatsapp,
} from '../data/clinica.js'
import {
  Logotipo,
  IconoFacebook,
  IconoInstagram,
  IconoTiktok,
  IconoPin,
  IconoTelefono,
  IconoCorreo,
} from './icons/Iconos.jsx'

const REDES = [
  { clave: 'facebook', nombre: 'Facebook', Icono: IconoFacebook },
  { clave: 'instagram', nombre: 'Instagram', Icono: IconoInstagram },
  { clave: 'tiktok', nombre: 'TikTok', Icono: IconoTiktok },
]

const enlaceLista =
  'inline-block py-1 text-menta/75 transition-colors hover:text-ambar focus-visible:text-ambar'

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-quirofano text-white">
      <div aria-hidden="true" className="textura-huellas absolute inset-0" />

      <div className="contenedor relative">
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:py-16">
          {/* --------------------------------------------------------- marca */}
          <div>
            <p className="flex items-center gap-2.5">
              <Logotipo className="h-10 w-10 text-white" />
              <span className="font-display text-2xl font-bold tracking-tight">
                {clinica.nombre}
              </span>
            </p>
            <p className="mt-4 max-w-xs leading-relaxed text-menta/80">
              {clinica.claim} en {clinica.direccion.zona}. Consulta,
              cirugía, laboratorio y urgencias 24 horas desde {clinica.fundacion}.
            </p>

            <ul className="mt-6 flex gap-2.5">
              {REDES.map(({ clave, nombre, Icono }) => {
                // Los perfiles todavía no existen: hasta que los haya, cada
                // icono abre WhatsApp. El nombre accesible lo dice, para no
                // prometerle una red social a quien usa lector de pantalla.
                const perfil = clinica.redes[clave]
                return (
                <li key={clave}>
                  <a
                    href={perfil ?? enlaceWhatsapp(`Hola ${clinica.nombre}, os escribo desde la web.`)}
                    target="_blank"
                    rel="noopener"
                    aria-label={
                      perfil
                        ? `${clinica.nombre} en ${nombre}`
                        : `${nombre} (próximamente): escríbenos por WhatsApp`
                    }
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/18 text-menta transition-colors hover:border-ambar hover:bg-ambar hover:text-tinta"
                  >
                    <Icono className="h-5 w-5" />
                  </a>
                </li>
                )
              })}
            </ul>
          </div>

          {/* ---------------------------------------------------- navegación */}
          <nav aria-labelledby="pie-nav">
            <h2 id="pie-nav" className="etiqueta-dato text-ambar">
              Navegación
            </h2>
            <ul className="mt-4 grid gap-2.5">
              {navegacion.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className={enlaceLista}>
                    {item.texto}
                  </a>
                </li>
              ))}
              <li>
                <a href="#cita" className={enlaceLista}>
                  Reservar cita
                </a>
              </li>
            </ul>
          </nav>

          {/* ----------------------------------------------------- servicios */}
          <nav aria-labelledby="pie-servicios">
            <h2 id="pie-servicios" className="etiqueta-dato text-ambar">
              Servicios
            </h2>
            <ul className="mt-4 grid gap-2.5">
              {servicios.map((s) => (
                <li key={s.titulo}>
                  <a href="#servicios" className={enlaceLista}>
                    {s.titulo}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* ------------------------------------------------------ contacto */}
          <div>
            <h2 className="etiqueta-dato text-ambar">Contacto</h2>
            <ul className="mt-4 grid gap-3.5">
              <li className="flex items-start gap-2.5">
                <IconoPin className="mt-0.5 h-5 w-5 shrink-0 text-menta/60" />
                <a href={enlaceMapa} target="_blank" rel="noopener" className={enlaceLista}>
                  {direccionUnaLinea}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <IconoTelefono className="mt-0.5 h-5 w-5 shrink-0 text-menta/60" />
                <a href={`tel:${clinica.telefono.tel}`} className={`font-mono ${enlaceLista}`}>
                  {clinica.telefono.visible}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <IconoCorreo className="mt-0.5 h-5 w-5 shrink-0 text-menta/60" />
                <a href={`mailto:${clinica.email}`} className={`[overflow-wrap:anywhere] ${enlaceLista}`}>
                  {clinica.email}
                </a>
              </li>
            </ul>

            <div className="mt-6 rounded-xl border border-white/15 p-4">
              <h3 className="etiqueta-dato text-ambar">Horarios</h3>
              <dl className="mt-2.5 grid gap-1.5 font-mono text-sm text-menta/80">
                {clinica.horarios.map((h) => (
                  <div key={h.etiqueta} className="flex justify-between gap-3">
                    <dt>{h.etiqueta}</dt>
                    <dd className="tabular-nums">
                      {h.abre}–{h.cierra}
                    </dd>
                  </div>
                ))}
                <div className="flex justify-between gap-3 border-t border-white/12 pt-1.5 text-ambar">
                  <dt>Urgencias</dt>
                  <dd>24 h</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------- legal */}
        <div className="flex flex-col gap-4 border-t border-white/12 pt-6 pb-24 text-sm text-menta/60 sm:flex-row sm:items-center sm:justify-between sm:pb-20">
          <p>
            © {new Date().getFullYear()} {clinica.nombre}. Todos los derechos reservados.
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            <li>
              <a href="#contacto" className={enlaceLista}>
                Aviso de privacidad
              </a>
            </li>
            <li>
              <a href="#contacto" className={enlaceLista}>
                Términos de servicio
              </a>
            </li>
            <li>
              <a href="#inicio" className={enlaceLista}>
                Volver arriba
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
