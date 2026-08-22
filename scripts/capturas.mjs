/* Capturas de verificación responsive. Uso: node scripts/capturas.mjs [url] */
import { chromium } from 'playwright-core'
import { mkdir } from 'node:fs/promises'

const URL = process.argv[2] ?? 'http://localhost:4173/'
const SALIDA = 'scripts/.capturas'

const VIEWPORTS = [
  { nombre: 'movil-390', width: 390, height: 844, dsf: 2 },
  { nombre: 'movil-360', width: 360, height: 780, dsf: 2 },
  { nombre: 'tablet-820', width: 820, height: 1180, dsf: 2 },
  { nombre: 'escritorio-1440', width: 1440, height: 900, dsf: 1 },
  { nombre: 'escritorio-1920', width: 1920, height: 1080, dsf: 1 },
]

await mkdir(SALIDA, { recursive: true })
const navegador = await chromium.launch({ channel: 'chrome' })
const problemas = []

for (const vp of VIEWPORTS) {
  const ctx = await navegador.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.dsf,
    locale: 'es-MX',
    reducedMotion: 'reduce', // congela reveals para que la captura sea estable
  })
  const pagina = await ctx.newPage()

  const errores = []
  pagina.on('console', (m) => m.type() === 'error' && errores.push(m.text()))
  pagina.on('pageerror', (e) => errores.push(String(e)))

  await pagina.goto(URL, { waitUntil: 'networkidle' })
  await pagina.evaluate(() => document.fonts.ready)

  // ¿Hay scroll horizontal? Ninguna anchura debería producirlo.
  const desborde = await pagina.evaluate(() => {
    const de = document.documentElement
    const culpables = []
    if (de.scrollWidth > de.clientWidth) {
      for (const el of document.querySelectorAll('body *')) {
        const r = el.getBoundingClientRect()
        if (r.right > de.clientWidth + 1 || r.left < -1) {
          culpables.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)}`)
          if (culpables.length > 4) break
        }
      }
    }
    return { scrollWidth: de.scrollWidth, clientWidth: de.clientWidth, culpables }
  })

  if (desborde.scrollWidth > desborde.clientWidth) {
    problemas.push(
      `${vp.nombre}: scroll horizontal (${desborde.scrollWidth} > ${desborde.clientWidth}) — ${desborde.culpables.join(' | ')}`,
    )
  }
  if (errores.length) problemas.push(`${vp.nombre}: errores en consola — ${errores.join(' | ')}`)

  await pagina.screenshot({ path: `${SALIDA}/${vp.nombre}-completa.png`, fullPage: true })
  await pagina.screenshot({ path: `${SALIDA}/${vp.nombre}-pliegue.png` })

  // Menú móvil abierto
  if (vp.width < 1024) {
    await pagina.getByRole('button', { name: /abrir el menú/i }).click()
    await pagina.waitForTimeout(250)
    await pagina.screenshot({ path: `${SALIDA}/${vp.nombre}-menu.png` })
    await pagina.keyboard.press('Escape')
  }

  await ctx.close()
  console.log(`✓ ${vp.nombre}`)
}

await navegador.close()

if (problemas.length) {
  console.log('\n⚠ PROBLEMAS:')
  for (const p of problemas) console.log('  - ' + p)
  process.exitCode = 1
} else {
  console.log('\n✓ Sin scroll horizontal ni errores de consola en ningún viewport.')
}
