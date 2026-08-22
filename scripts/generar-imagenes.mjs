/* =========================================================================
   Generador de imágenes con IA para PetCare
   -------------------------------------------------------------------------
   Genera las fotos del sitio con un modelo texto->imagen (pollinations.ai,
   sin API key), las DESCARGA y las guarda localmente en public/img/ como
   WebP en 1x y 2x. La página no depende de ningún servicio externo en
   runtime: sólo se usa este script, una vez, en tiempo de desarrollo.

   Uso:   npm run imagenes            (salta las que ya existen)
          npm run imagenes -- --force (regenera todo)
          npm run imagenes -- hero    (regenera sólo las que coincidan)
   ========================================================================= */

import { mkdir, writeFile, access } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DESTINO = resolve(RAIZ, 'public/img')

// Estilo compartido: todas las fotos deben parecer de la misma sesión.
const ESTILO =
  'documentary editorial photograph, modern veterinary clinic interior with deep teal green walls and warm oak wood, ' +
  'soft natural window light, shallow depth of field, warm neutral color grading, photorealistic, high detail, ' +
  'calm and trustworthy mood, no text, no letters, no watermark, no logo'

const IMAGENES = [
  {
    id: 'hero',
    ancho: 1000,
    alto: 1250,
    prompt:
      'A friendly female veterinarian in teal scrubs kneeling and gently holding a happy golden retriever, ' +
      'both looking calm, bright examination room, vertical portrait composition',
  },
  {
    id: 'clinica',
    ancho: 1400,
    alto: 1050,
    prompt:
      'Bright welcoming reception area of a modern veterinary clinic, wooden reception counter with a vase of ' +
      'green plants, comfortable upholstered waiting armchairs, large window with daylight, framed pet ' +
      'photographs on a deep teal wall, warm clean and inviting, nobody in frame',
  },
  {
    id: 'urgencias',
    ancho: 1600,
    alto: 900,
    prompt:
      'Well lit veterinary emergency room, a veterinarian in teal scrubs carefully examining a small dog on a ' +
      'stainless steel table, bright overhead surgical lamp illuminating the pair, assistant nearby, ' +
      'clear bright exposure, cinematic wide shot',
  },
  {
    id: 'equipo-1',
    ancho: 800,
    alto: 800,
    prompt:
      'Professional headshot portrait of a confident Latina woman veterinarian in her early forties, short dark hair, ' +
      'white lab coat over teal scrubs, warm friendly smile, softly blurred clinic background, square crop',
  },
  {
    id: 'equipo-2',
    ancho: 800,
    alto: 800,
    prompt:
      'Professional headshot portrait of a Latino man veterinary surgeon in his mid thirties, short beard, ' +
      'teal surgical scrubs and cap around his neck, calm confident expression, softly blurred clinic background, square crop',
  },
  {
    id: 'equipo-3',
    ancho: 800,
    alto: 800,
    prompt:
      'Professional headshot portrait of a young Latina woman veterinarian in her late twenties, long hair tied back, ' +
      'holding a calm grey tabby cat against her shoulder, warm smile, softly blurred clinic background, square crop',
  },
  {
    id: 'equipo-4',
    ancho: 800,
    alto: 800,
    prompt:
      'Professional headshot portrait of a Latino man veterinarian in his late thirties, glasses, dark teal scrubs, ' +
      'serious and reassuring expression, softly blurred night clinic background, square crop',
  },
]

const existe = (ruta) => access(ruta).then(() => true, () => false)

/** Descarga la imagen del generador con reintentos. */
async function generar({ id, prompt, ancho, alto }) {
  // Se pide al doble de tamaño para poder servir 1x y 2x nítidos.
  const url =
    `https://image.pollinations.ai/prompt/${encodeURIComponent(`${prompt}. ${ESTILO}`)}` +
    `?width=${ancho * 2}&height=${alto * 2}&model=flux&nologo=true&private=true` +
    // Seed fijo derivado del id -> el resultado es reproducible.
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

async function main() {
  const args = process.argv.slice(2)
  const forzar = args.includes('--force')
  const filtros = args.filter((a) => !a.startsWith('--'))

  await mkdir(DESTINO, { recursive: true })

  const cola = IMAGENES.filter((i) => !filtros.length || filtros.some((f) => i.id.includes(f)))
  let hechas = 0
  let fallidas = 0

  for (const img of cola) {
    const salida1x = resolve(DESTINO, `${img.id}.webp`)
    if (!forzar && (await existe(salida1x))) {
      console.log(`•  ${img.id} ya existe, se salta (usa --force para regenerar)`)
      continue
    }

    console.log(`→  generando ${img.id} (${img.ancho}×${img.alto})…`)
    try {
      const original = await generar(img)

      await sharp(original)
        .resize(img.ancho, img.alto, { fit: 'cover', position: 'attention' })
        .webp({ quality: 82 })
        .toFile(salida1x)

      await sharp(original)
        .resize(img.ancho * 2, img.alto * 2, { fit: 'cover', position: 'attention' })
        .webp({ quality: 74 })
        .toFile(resolve(DESTINO, `${img.id}@2x.webp`))

      // El hero hace doble función como imagen de Open Graph (1200×630).
      if (img.id === 'hero') {
        await sharp(original)
          .resize(1200, 630, { fit: 'cover', position: 'attention' })
          .jpeg({ quality: 82, mozjpeg: true })
          .toFile(resolve(RAIZ, 'public/og-image.jpg'))
      }

      hechas++
      console.log(`✓  ${img.id}.webp + ${img.id}@2x.webp`)
    } catch (err) {
      fallidas++
      console.error(`✗  ${img.id}: ${err.message}`)
    }
  }

  console.log(`\nListo. ${hechas} generadas, ${fallidas} fallidas.`)
  if (fallidas) {
    console.log('Las que fallaron degradan a un fondo con gradiente + SVG en la página; vuelve a correr el script para reintentar.')
    process.exitCode = 1
  }
}

await main()
