/* Captura cada sección por separado, ya con las imágenes diferidas cargadas. */
import { chromium } from 'playwright-core'
import { mkdir } from 'node:fs/promises'

const URL = process.argv[2] ?? 'http://localhost:4173/'
const ANCHO = Number(process.argv[3] ?? 1440)
const SALIDA = 'scripts/.capturas'

await mkdir(SALIDA, { recursive: true })
const navegador = await chromium.launch({ channel: 'chrome' })
const ctx = await navegador.newContext({
  viewport: { width: ANCHO, height: 1000 },
  locale: 'es-MX',
  reducedMotion: 'reduce',
})
const pagina = await ctx.newPage()
await pagina.goto(URL, { waitUntil: 'load' })

// Fuerza la carga de todo lo diferido recorriendo la página entera
await pagina.evaluate(async () => {
  const alto = document.body.scrollHeight
  for (let y = 0; y < alto; y += 400) {
    window.scrollTo(0, y)
    await new Promise((r) => setTimeout(r, 60))
  }
  window.scrollTo(0, 0)
})
await pagina.waitForTimeout(2500)

// ¿Se decodificó cada imagen de verdad?
const imagenes = await pagina.evaluate(() =>
  [...document.images].map((i) => ({
    src: i.currentSrc.split('/').pop(),
    ok: i.complete && i.naturalWidth > 0,
    w: i.naturalWidth,
  })),
)
console.log('IMÁGENES:')
for (const i of imagenes) console.log(`  ${i.ok ? '✓' : '✗'} ${i.src} (${i.w}px)`)

const iframes = await pagina.evaluate(() =>
  [...document.querySelectorAll('iframe')].map((f) => ({ src: f.src.slice(0, 60), alto: f.clientHeight })),
)
console.log('IFRAMES:', JSON.stringify(iframes))

const prefijo = ANCHO >= 1024 ? 'esc' : 'mov'
for (const id of ['servicios', 'clinica', 'equipo', 'testimonios', 'horarios', 'contacto']) {
  const seccion = pagina.locator(`#${id}`)
  await seccion.scrollIntoViewIfNeeded()
  await pagina.waitForTimeout(200)
  await seccion.screenshot({ path: `${SALIDA}/${prefijo}-${ANCHO}-${id}.png` })
  console.log(`✓ ${id}`)
}

// CTA final + footer
await pagina.locator('footer').scrollIntoViewIfNeeded()
await pagina.waitForTimeout(200)
await pagina.locator('section:has(#cta-final)').screenshot({ path: `${SALIDA}/${prefijo}-${ANCHO}-cta.png` })
await pagina.locator('footer').screenshot({ path: `${SALIDA}/${prefijo}-${ANCHO}-footer.png` })
console.log('✓ cta + footer')

await navegador.close()
