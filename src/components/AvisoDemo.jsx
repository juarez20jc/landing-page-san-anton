import { clinica, avisoDemo } from '../data/clinica.js'

/**
 * Franja de sitio demostrativo. Va lo primero, antes del header fijo, para
 * que quien llegue con un enlace directo lo lea antes que cualquier cifra.
 * Con `clinica.demo` en false no se pinta.
 */
export default function AvisoDemo() {
  if (!clinica.demo) return null

  return (
    <aside aria-label="Aviso" className="bg-ambar text-tinta">
      <p className="contenedor flex flex-wrap items-baseline justify-center gap-x-3 gap-y-0.5 py-2 text-center text-sm leading-snug">
        <strong className="etiqueta-dato">Sitio demostrativo</strong>
        <span>{avisoDemo}</span>
      </p>
    </aside>
  )
}
