/* Comprueba el carrusel: avance solo, vuelta al inicio, pausa al tocar y
   reanudación, y que en escritorio siga siendo una rejilla. */
import { chromium } from 'playwright-core'

const URL = process.argv[2] ?? 'http://localhost:4173/'
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
    locale: 'es-MX',
    hasTouch: w < 1024,
    isMobile: w < 500,
  })
  const p = await ctx.newPage()
  await p.goto(URL, { waitUntil: 'load' })
  await p.waitForTimeout(700)
  return { ctx, p }
}

const posicion = (p, i) =>
  p.evaluate((i) => {
    const t = document.querySelectorAll('.pista-carrusel')[i]
    return t ? Math.round(t.scrollLeft) : null
  }, i)

/* ------------------------------------------------- escritorio: rejilla */
{
  console.log('\n— ESCRITORIO 1440 —')
  const { ctx, p } = await abrir(1440, 900)
  const pistas = await p.locator('.pista-carrusel').count()
  pistas === 0 ? ok('no hay carrusel: sigue la rejilla') : mal(`hay ${pistas} carruseles en escritorio`)

  const cols = await p.evaluate(() => {
    const ul = [...document.querySelectorAll('#servicios ul')].find((u) => u.children.length === 6)
    return ul ? getComputedStyle(ul).gridTemplateColumns.split(' ').length : 0
  })
  cols === 3 ? ok('los 6 servicios en 3 columnas') : mal(`la rejilla de servicios tiene ${cols} columnas`)

  const puntos = await p.locator('button[aria-label^="Ir a la tarjeta"]').count()
  puntos === 0 ? ok('sin controles de carrusel') : mal(`${puntos} controles visibles en escritorio`)
  await ctx.close()
}

/* -------------------------------------------- celular y tablet: carrusel */
for (const [w, h, nombre] of [
  [390, 844, 'CELULAR 390'],
  [820, 1180, 'TABLET 820'],
]) {
  console.log(`\n— ${nombre} —`)
  const { ctx, p } = await abrir(w, h)

  const pistas = await p.locator('.pista-carrusel').count()
  pistas === 2 ? ok('carrusel en servicios y en reseñas') : mal(`se esperaban 2 carruseles, hay ${pistas}`)
  if (pistas < 1) {
    await ctx.close()
    continue
  }

  // Sin scroll horizontal de la página entera
  const desborde = await p.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  )
  desborde ? mal('la página entera desborda en horizontal') : ok('la página no desborda en horizontal')

  await p.locator('#servicios').scrollIntoViewIfNeeded()
  await p.waitForTimeout(400)

  // --- avanza solo cada 2 s
  const a0 = await posicion(p, 0)
  await p.waitForTimeout(2400)
  const a1 = await posicion(p, 0)
  await p.waitForTimeout(2200)
  const a2 = await posicion(p, 0)
  a1 > a0 && a2 > a1
    ? ok(`avanza solo: ${a0} → ${a1} → ${a2} px`)
    : mal(`no avanza como se espera: ${a0} → ${a1} → ${a2}`)

  // --- se para al tocar y vuelve tras 3 s
  const caja = await p.locator('.pista-carrusel').first().boundingBox()
  await p.mouse.move(caja.x + caja.width / 2, caja.y + caja.height / 2)
  await p.mouse.down()
  await p.mouse.up()
  const b0 = await posicion(p, 0)
  await p.waitForTimeout(2200) // dentro de la ventana de 3 s: no debe moverse
  const b1 = await posicion(p, 0)
  b1 === b0 ? ok(`se detiene al tocar (${b0} px sin cambio en 2,2 s)`) : mal(`siguió avanzando tras el toque: ${b0} → ${b1}`)

  await p.waitForTimeout(3200) // pasados los 3 s debe haber vuelto a avanzar
  const b2 = await posicion(p, 0)
  b2 !== b1 ? ok(`reanuda tras 3 s (${b1} → ${b2} px)`) : mal('no reanudó el avance tras la espera')

  // --- al llegar al final vuelve a la primera
  await p.evaluate(() => {
    const t = document.querySelector('.pista-carrusel')
    const ultimo = t.children[t.children.length - 1]
    t.scrollTo({ left: ultimo.offsetLeft, behavior: 'instant' })
  })
  await p.waitForTimeout(3600)
  const vuelta = await posicion(p, 0)
  vuelta < 40 ? ok(`desde la última vuelve a la primera (${vuelta} px)`) : mal(`no volvió al inicio: quedó en ${vuelta} px`)

  // --- controles
  const puntos = await p.locator('#servicios button[aria-label^="Ir a la tarjeta"]').count()
  puntos === 6 ? ok('6 puntos, uno por servicio') : mal(`hay ${puntos} puntos para 6 servicios`)

  const pausa = p.locator('#servicios button[aria-label*="Pausar"]').first()
  if (await pausa.count()) {
    await pausa.click()
    await p.waitForTimeout(900) // deja terminar el desplazamiento en curso
    const c0 = await posicion(p, 0)
    await p.waitForTimeout(4200)
    const c1 = await posicion(p, 0)
    c1 === c0 ? ok('el botón de pausa detiene el avance de verdad') : mal(`en pausa siguió moviéndose: ${c0} → ${c1}`)
  } else mal('falta el botón de pausa')

  // --- reseñas
  const r0 = await posicion(p, 1)
  await p.locator('#testimonios').scrollIntoViewIfNeeded()
  await p.waitForTimeout(2600)
  const r1 = await posicion(p, 1)
  r1 > r0 ? ok(`las reseñas también avanzan solas (${r0} → ${r1} px)`) : mal(`las reseñas no avanzan: ${r0} → ${r1}`)

  await ctx.close()
}

/* ------------------------------------------------- movimiento reducido */
{
  console.log('\n— MOVIMIENTO REDUCIDO (celular) —')
  const ctx = await navegador.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    reducedMotion: 'reduce',
  })
  const p = await ctx.newPage()
  await p.goto(URL, { waitUntil: 'load' })
  await p.waitForTimeout(600)
  await p.locator('#servicios').scrollIntoViewIfNeeded()
  await p.waitForTimeout(400)
  const d0 = await posicion(p, 0)
  await p.waitForTimeout(4500)
  const d1 = await posicion(p, 0)
  d1 === d0 ? ok('no se mueve solo (se puede seguir deslizando a mano)') : mal(`se movió pese a reduced-motion: ${d0} → ${d1}`)
  await ctx.close()
}

await navegador.close()
console.log('\n' + '─'.repeat(56))
if (fallos.length) {
  console.log(`${fallos.length} FALLO(S)`)
  for (const f of fallos) console.log('  ✗ ' + f)
  process.exitCode = 1
} else console.log('CARRUSEL OK — sin fallos.')
