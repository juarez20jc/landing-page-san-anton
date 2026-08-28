/* Comprueba en el navegador lo que se acaba de llevar del lienzo al código:
   carrusel de portadas, secciones de producto, carrito y los compactados de
   celular. Uso: node scripts/revisar.mjs [url] */
import fs from 'node:fs'
import { chromium } from 'playwright-core'

const URL = process.argv[2] ?? 'http://localhost:5173/'
const TOMAS = 'scripts/.revision'
fs.mkdirSync(TOMAS, { recursive: true })

const navegador = await chromium.launch({ channel: 'chrome' })
const fallos = []
const ok = (m) => console.log(`  ✓ ${m}`)
const mal = (m) => {
  fallos.push(m)
  console.log(`  ✗ ${m}`)
}

const abrir = async (w, h) => {
  const ctx = await navegador.newContext({
    viewport: { width: w, height: h },
    locale: 'es-PE',
    hasTouch: w < 1024,
    isMobile: w < 500,
  })
  const p = await ctx.newPage()
  const errores = []
  p.on('pageerror', (e) => errores.push(String(e)))
  p.on('response', (r) => r.status() >= 400 && errores.push(`${r.status()} ${r.url()}`))
  await p.goto(URL, { waitUntil: 'load' })
  await p.waitForTimeout(700)
  return { ctx, p, errores }
}

/* ------------------------------------------------------------ escritorio */
{
  console.log('\n— ESCRITORIO 1440 —')
  const { ctx, p, errores } = await abrir(1440, 950)

  // --- portadas
  const titular = () => p.locator('h1').innerText()
  const t0 = await titular()
  await p.locator('button[aria-label="Portada siguiente"]').click()
  await p.waitForTimeout(900)
  const t1 = await titular()
  t1 !== t0 ? ok(`la portada cambia: «${t0.slice(0, 22)}…» → «${t1.slice(0, 22)}…»`) : mal('la portada no cambia con la flecha')

  const puntos = await p.locator('button[aria-label^="Ir a la portada"]').count()
  puntos === 3 ? ok('3 portadas con su punto') : mal(`hay ${puntos} puntos de portada`)

  await p.locator('button[aria-label="Pausar el cambio de portada"]').click()
  const antes = await titular()
  await p.waitForTimeout(7000)
  ;(await titular()) === antes ? ok('el botón de pausa detiene el giro') : mal('siguió girando en pausa')

  // --- secciones de producto
  for (const [id, nombre] of [['#liquidacion', 'liquidación'], ['#productos', 'más vendidos']]) {
    const n = await p.locator(`${id} li button[aria-pressed]`).count()
    n === 6 ? ok(`${nombre}: 6 productos`) : mal(`${nombre}: ${n} productos`)
  }

  const conFoto = await p.locator('#liquidacion img, #productos img').count()
  conFoto === 12 ? ok('los 12 productos con foto') : mal(`hay ${conFoto} fotos de producto de 12`)

  // --- carrito
  const vacio = await p.locator('button[aria-label="Tu pedido está vacío"]').evaluate(
    (b) => getComputedStyle(b).opacity === '0' && b.hasAttribute('inert'),
  )
  vacio ? ok('el carrito está oculto y fuera del tabulador si no hay nada marcado') : mal('el carrito vacío sigue visible o enfocable')

  await p.locator('#liquidacion li button[aria-pressed]').first().click()
  await p.locator('#productos li button[aria-pressed]').first().click()
  await p.mouse.wheel(0, 400)
  await p.waitForTimeout(600)

  const burbuja = p.locator('button[aria-label*="Ver el pedido"]')
  ;(await burbuja.count()) ? ok('la burbuja del carrito aparece al marcar') : mal('no aparece la burbuja del carrito')
  const etiqueta = await burbuja.getAttribute('aria-label')
  etiqueta?.includes('2 productos') ? ok(`la burbuja cuenta bien: «${etiqueta}»`) : mal(`la burbuja dice «${etiqueta}»`)

  await burbuja.click()
  await p.waitForTimeout(400)
  const panel = p.locator('dialog[aria-label="Tu pedido"]')
  ;(await panel.isVisible()) ? ok('el panel lateral se abre') : mal('el panel no se abre')

  const filas = await panel.locator('li').count()
  filas === 2 ? ok('el panel lista los 2 productos') : mal(`el panel lista ${filas}`)

  // --- cantidades
  const totalDe = async () =>
    +(await panel.locator('p:has(> span:text("Total")) span').last().innerText()).replace(/\D/g, '')
  const totalUno = await totalDe()
  await panel.locator('button[aria-label^="Una unidad más"]').first().click()
  await panel.locator('button[aria-label^="Una unidad más"]').first().click()
  await p.waitForTimeout(300)
  const totalTres = await totalDe()
  const unidades = await panel.locator('span[aria-live="polite"]').first().innerText()
  unidades.trim().startsWith('3') ? ok('el + sube la cantidad a 3') : mal(`el contador dice «${unidades.trim()}»`)
  totalTres > totalUno ? ok(`el total sigue a la cantidad: S/ ${totalUno} → S/ ${totalTres}`) : mal(`el total no cambió: ${totalUno} → ${totalTres}`)

  const wa = await panel.locator('a[href*="wa.me"]').getAttribute('href')
  const texto = decodeURIComponent(wa.split('text=')[1] ?? '')
  const items = texto.split('\n').filter((l) => l.startsWith('- '))
  texto.includes('*Total:') && texto.includes('3 ×') && items.length === 2
    ? ok('el mensaje de WhatsApp usa lista y negrita, con cantidades y total')
    : mal(`el mensaje de WhatsApp no cuadra: ${texto.slice(0, 70)}`)

  // bajar hasta cero saca el producto del pedido
  for (let n = 0; n < 3; n++) {
    await panel.locator('button[aria-label^="Una unidad menos"], button[aria-label^="Quitar"]').first().click()
    await p.waitForTimeout(200)
  }
  ;(await panel.locator('li').count()) === 1
    ? ok('bajar a cero saca el producto del pedido')
    : mal(`tras bajar a cero quedan ${await panel.locator('li').count()} líneas`)

  // y la papelera saca el que queda
  await panel.locator('button[aria-label^="Quitar"]').last().click()
  await p.waitForTimeout(300)
  ;(await panel.locator('li').count()) === 0 ? ok('la papelera vacía la última línea') : mal('la papelera no funcionó')

  await p.keyboard.press('Escape')
  await p.waitForTimeout(300)
  ;(await panel.isVisible()) ? mal('Esc no cierra el panel') : ok('Esc cierra el panel')

  // se vuelve a marcar uno para comprobar que aguanta la recarga
  await p.locator('#productos li button[aria-pressed]').first().click()
  await p.waitForTimeout(300)

  // --- el pedido sobrevive a la recarga
  await p.reload({ waitUntil: 'load' })
  await p.waitForTimeout(700)
  const marcados = await p.locator('button[aria-pressed="true"]').count()
  marcados === 1 ? ok('el pedido sobrevive a la recarga') : mal(`tras recargar hay ${marcados} marcados`)

  await p.screenshot({ path: `${TOMAS}/escritorio.png`, fullPage: true })
  errores.length ? mal(`${errores.length} error(es): ${errores[0]}`) : ok('sin errores de JS ni 4xx')
  await ctx.close()
}

/* ---------------------------------------------------------------- móvil */
{
  console.log('\n— CELULAR 390 —')
  const { ctx, p, errores } = await abrir(390, 844)

  const desborde = await p.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  )
  desborde ? mal('la página desborda en horizontal') : ok('no desborda en horizontal')

  // motivos de la clínica, de uno en uno
  await p.locator('#clinica').scrollIntoViewIfNeeded()
  await p.waitForTimeout(500)
  const motivos = p.locator('#clinica dl dt')
  ;(await motivos.count()) === 1 ? ok('los motivos salen de uno en uno') : mal(`se ven ${await motivos.count()} motivos a la vez`)
  const m0 = await motivos.first().innerText()
  await p.waitForTimeout(2600)
  const m1 = await motivos.first().innerText()
  m1 !== m0 ? ok(`rotan solos: «${m0.slice(0, 20)}…» → «${m1.slice(0, 20)}…»`) : mal('los motivos no rotan')

  // mapa más bajo
  const relacion = await p.evaluate(() => {
    const f = document.querySelector('#contacto iframe')
    const r = f.getBoundingClientRect()
    return +(r.width / r.height).toFixed(2)
  })
  relacion > 1.9 ? ok(`el mapa va apaisado (${relacion}:1)`) : mal(`el mapa sigue alto (${relacion}:1)`)

  // el pie sin las columnas de enlaces
  const columnas = await p.locator('footer nav:visible').count()
  columnas === 0 ? ok('el pie no repite el menú en celular') : mal(`el pie muestra ${columnas} columnas de enlaces`)

  await p.screenshot({ path: `${TOMAS}/celular.png`, fullPage: true })
  errores.length ? mal(`${errores.length} error(es): ${errores[0]}`) : ok('sin errores de JS ni 4xx')
  await ctx.close()
}

/* --------------------------------------------------- movimiento reducido */
{
  console.log('\n— MOVIMIENTO REDUCIDO —')
  const ctx = await navegador.newContext({
    viewport: { width: 1440, height: 950 },
    reducedMotion: 'reduce',
  })
  const p = await ctx.newPage()
  await p.goto(URL, { waitUntil: 'load' })
  await p.waitForTimeout(600)
  const t0 = await p.locator('h1').innerText()
  await p.waitForTimeout(7500)
  ;(await p.locator('h1').innerText()) === t0
    ? ok('la portada no gira sola (se puede pasar a mano)')
    : mal('giró pese a reduced-motion')
  await ctx.close()
}

await navegador.close()
console.log('\n' + '─'.repeat(58))
if (fallos.length) {
  console.log(`${fallos.length} FALLO(S)`)
  for (const f of fallos) console.log('  ✗ ' + f)
  process.exitCode = 1
} else console.log('REVISIÓN SUPERADA — sin fallos.')
