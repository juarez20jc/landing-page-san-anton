/* =========================================================================
   Fotos de los productos que todavía no tienen una de verdad
   -------------------------------------------------------------------------
   Son imágenes genéricas, sin marca ni texto, con el mismo encuadre de
   catálogo que las demás: producto centrado sobre fondo blanco. Sirven de
   relleno honesto hasta que la clínica suba la foto del artículo que vende
   de verdad — que es la que debe acabar aquí.

   Uso:  npm run imagenes-productos            (salta las que ya existen)
         npm run imagenes-productos -- --force (regenera todo)
   ========================================================================= */

import { mkdir, writeFile, access } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DESTINO = resolve(RAIZ, 'public/img')
const ANCHO = 320 // igual que las fotos de producto que ya están puestas

/* El mismo encuadre para todas: si una sale con sombra dura o en ambiente,
   la fila de tarjetas deja de leerse como un estante. */
const ESTILO = 'product photo on a plain white background, studio lighting, sharp focus'

/* Sólo quedan aquí los que el generador resuelve bien. El comedero, el kit
   de cepillado y el blister de desparasitante salían irreconocibles: para
   esos hace falta la foto real del artículo que la clínica vende. */
/* Sólo queda el que el generador resuelve bien. El comedero, el kit de
   cepillado y el blister salieron irreconocibles en tres intentos: para esos
   hace falta la foto real del artículo, y mientras tanto la tarjeta muestra
   un dibujo del producto en vez de fingir una foto. */
const PRODUCTOS = [
  {
    id: 'prod-snacks',
    prompt:
      'A pile of light brown Y-shaped dental chew treats for dogs, textured ridged surface, arranged in a small loose stack',
  },
]

const existe = (f) =>
  access(f).then(
    () => true,
    () => false,
  )

async function generar({ id, prompt }) {
  // Se pide al doble de tamaño para poder servir 1x y 2x nítidos.
  const url =
    `https://image.pollinations.ai/prompt/${encodeURIComponent(`${prompt}. ${ESTILO}`)}` +
    `?width=${ANCHO * 2}&height=${ANCHO * 2}&model=flux&nologo=true&private=true` +
    `&seed=${[...id].reduce((a, c) => a * 31 + c.charCodeAt(0), 7) % 100000}`

  for (let intento = 1; intento <= 3; intento++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(180_000) })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const buf = Buffer.from(await res.arrayBuffer())
      if (buf.byteLength < 5_000) throw new Error('respuesta demasiado pequeña')
      return buf
    } catch (err) {
      const ultimo = intento === 3
      console.warn(`   intento ${intento}/3 falló (${err.message})${ultimo ? '' : ', reintentando…'}`)
      if (ultimo) throw err
      await new Promise((r) => setTimeout(r, 4000 * intento))
    }
  }
}

const forzar = process.argv.includes('--force')
await mkdir(DESTINO, { recursive: true })

let hechas = 0
for (const p of PRODUCTOS) {
  const salida = resolve(DESTINO, `${p.id}.webp`)
  if (!forzar && (await existe(salida))) {
    console.log(`•  ${p.id} ya existe, se salta`)
    continue
  }
  process.stdout.write(`→  ${p.id} … `)
  const bruto = await generar(p)
  for (const [suf, w] of [['', ANCHO], ['@2x', ANCHO * 2]]) {
    const buf = await sharp(bruto).resize({ width: w }).webp({ quality: 80 }).toBuffer()
    await writeFile(resolve(DESTINO, `${p.id}${suf}.webp`), buf)
  }
  console.log('listo')
  hechas++
}
console.log(`\n${hechas} imagen(es) generada(s) en public/img`)
