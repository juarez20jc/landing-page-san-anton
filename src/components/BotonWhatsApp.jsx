import { clinica, enlaceWhatsapp } from '../data/clinica.js'
import { IconoWhatsapp } from './icons/Iconos.jsx'

/**
 * Acceso directo a WhatsApp, siempre a mano.
 *
 * Aparece sólo después del primer scroll para no tapar el CTA del hero, y
 * se ancla con inset lógico + safe-area para respetar la barra de gestos de
 * los móviles.
 */
export default function BotonWhatsApp({ visible }) {
  return (
    <a
      href={enlaceWhatsapp(
        `Hola ${clinica.nombre}, quiero hacer una consulta sobre mi mascota.`,
      )}
      target="_blank"
      rel="noopener"
      aria-label={`Escribir a ${clinica.nombre} por WhatsApp`}
      className={`fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-5 z-40 flex h-14 items-center gap-3 rounded-full bg-[#25d366] pl-4 pr-4 text-tinta shadow-[0_12px_30px_-10px_rgb(37_211_102/0.75)] transition-[opacity,transform,padding] duration-300 hover:bg-[#1fbe5b] sm:pr-5 ${
        visible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <IconoWhatsapp className="h-7 w-7 shrink-0" />
      <span className="hidden font-semibold sm:inline">WhatsApp</span>
    </a>
  )
}
