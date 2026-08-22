/* Auditoría de accesibilidad, teclado, enlaces y formulario. */
import { chromium } from 'playwright-core'

const URL = process.argv[2] ?? 'http://localhost:4173/'
const navegador = await chromium.launch({ channel: 'chrome' })
const fallos = []
const avisos = []
const ok = (m) => console.log(`  ✓ ${m}`)
const mal = (m) => {
  fallos.push(m)
  console.log(`  ✗ ${m}`)
}

/* ------------------------------------------------------------ escritorio */
{
  const ctx = await navegador.newContext({ viewport: { width: 1440, height: 900 }, locale: 'es-MX' })
  const pagina = await ctx.newPage()
  await pagina.goto(URL, { waitUntil: 'load' })
  await pagina.waitForTimeout(800)

  console.log('\n— ESTRUCTURA —')
  const est = await pagina.evaluate(() => {
    const enc = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => ({
      n: Number(h.tagName[1]),
      t: h.textContent.trim().slice(0, 40),
    }))
    return {
      enc,
      h1: enc.filter((e) => e.n === 1).length,
      lang: document.documentElement.lang,
      landmarks: {
        header: document.querySelectorAll('header').length,
        main: document.querySelectorAll('main').length,
        footer: document.querySelectorAll('footer').length,
        nav: document.querySelectorAll('nav').length,
      },
      sinAlt: [...document.images].filter((i) => i.alt === null || i.alt === undefined).length,
      altVacio: [...document.images].filter((i) => i.alt === '').length,
      imgSinDim: [...document.images].filter((i) => !i.getAttribute('width') || !i.getAttribute('height')).length,
      lcp: [...document.images].filter((i) => i.getAttribute('fetchpriority') === 'high').map((i) => i.src.split('/').pop()),
      lazy: [...document.images].filter((i) => i.loading === 'lazy').length,
      botonesSinNombre: [...document.querySelectorAll('button,a')].filter(
        (e) => !e.textContent.trim() && !e.getAttribute('aria-label') && !e.querySelector('[class*=sr-only]'),
      ).length,
      iframeSinTitulo: [...document.querySelectorAll('iframe')].filter((f) => !f.title).length,
    }
  })

  est.h1 === 1 ? ok(`un único <h1>`) : mal(`hay ${est.h1} elementos <h1>`)
  est.lang.startsWith('es') ? ok(`lang="${est.lang}"`) : mal(`lang incorrecto: ${est.lang}`)
  let salto = null
  for (let i = 1; i < est.enc.length; i++) {
    if (est.enc[i].n - est.enc[i - 1].n > 1) salto = `${est.enc[i - 1].n}→${est.enc[i].n} en "${est.enc[i].t}"`
  }
  salto ? mal(`salto de nivel de encabezado: ${salto}`) : ok('jerarquía de encabezados sin saltos')
  const l = est.landmarks
  l.header && l.main && l.footer && l.nav >= 2
    ? ok(`landmarks: header/main/footer + ${l.nav} nav`)
    : mal(`landmarks incompletos: ${JSON.stringify(l)}`)
  est.sinAlt === 0 ? ok(`imágenes con atributo alt (${est.altVacio} decorativas)`) : mal(`${est.sinAlt} imágenes sin alt`)
  est.imgSinDim === 0 ? ok('todas las imágenes declaran width/height (sin CLS)') : mal(`${est.imgSinDim} imágenes sin width/height`)
  est.lcp.length === 1 ? ok(`fetchpriority="high" sólo en el LCP (${est.lcp[0]})`) : mal(`fetchpriority high en ${est.lcp.length} imágenes`)
  ok(`${est.lazy} imágenes con loading="lazy"`)
  est.botonesSinNombre === 0 ? ok('todo control interactivo tiene nombre accesible') : mal(`${est.botonesSinNombre} controles sin nombre`)
  est.iframeSinTitulo === 0 ? ok('el iframe del mapa tiene title') : mal('iframe sin title')

  console.log('\n— ENLACES —')
  const enlaces = await pagina.evaluate(() => {
    const h = [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href'))
    const anclas = h.filter((x) => x.startsWith('#'))
    return {
      tel: h.filter((x) => x.startsWith('tel:')).length,
      mail: h.filter((x) => x.startsWith('mailto:')).length,
      wa: h.filter((x) => x.includes('wa.me')).length,
      mapa: h.filter((x) => x.includes('google.com/maps')).length,
      anclasRotas: [...new Set(anclas)].filter((x) => x !== '#' && !document.querySelector(x)),
      blankSinNoopener: [...document.querySelectorAll('a[target=_blank]')].filter(
        (a) => !a.rel.includes('noopener'),
      ).length,
    }
  })
  enlaces.anclasRotas.length === 0
    ? ok('todas las anclas del menú apuntan a una sección existente')
    : mal(`anclas rotas: ${enlaces.anclasRotas.join(', ')}`)
  ok(`tel: ${enlaces.tel} · mailto: ${enlaces.mail} · wa.me: ${enlaces.wa} · mapa: ${enlaces.mapa}`)
  enlaces.blankSinNoopener === 0 ? ok('todo target=_blank lleva rel=noopener') : mal(`${enlaces.blankSinNoopener} enlaces _blank sin noopener`)

  console.log('\n— CONTRASTE (WCAG AA) —')
  const contraste = await pagina.evaluate(() => {
    // Chrome serializa color-mix() como oklab(); en vez de parsear cada
    // sintaxis, se pinta el color en un canvas y se lee el RGBA resultante.
    const lienzo = document.createElement('canvas')
    lienzo.width = lienzo.height = 1
    const cx = lienzo.getContext('2d', { willReadFrequently: true })
    const cache = new Map()
    const aRgba = (color) => {
      if (cache.has(color)) return cache.get(color)
      cx.clearRect(0, 0, 1, 1)
      cx.fillStyle = color
      cx.fillRect(0, 0, 1, 1)
      const [r, g, b, a] = cx.getImageData(0, 0, 1, 1).data
      const v = { r, g, b, a: a / 255 }
      cache.set(color, v)
      return v
    }
    const lum = ({ r, g, b }) => {
      const f = (v) => {
        v /= 255
        return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
      }
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
    }
    // Compone el color de texto (con su alfa) sobre el fondo efectivo
    const sobre = (frente, fondo) => ({
      r: frente.r * frente.a + fondo.r * (1 - frente.a),
      g: frente.g * frente.a + fondo.g * (1 - frente.a),
      b: frente.b * frente.a + fondo.b * (1 - frente.a),
      a: 1,
    })
    const fondoReal = (el) => {
      let n = el
      let acumulado = { r: 255, g: 255, b: 255, a: 1 }
      const capas = []
      while (n && n !== document.documentElement) {
        const c = aRgba(getComputedStyle(n).backgroundColor)
        if (c.a > 0) capas.unshift(c)
        n = n.parentElement
      }
      for (const c of capas) acumulado = sobre(c, acumulado)
      return acumulado
    }
    const ratio = (a, b) => {
      const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p)
      return (x + 0.05) / (y + 0.05)
    }
    const malos = []
    for (const el of document.querySelectorAll('p,h1,h2,h3,h4,a,span,dd,dt,li,th,td,label,button')) {
      if (!el.textContent.trim() || el.children.length) continue
      const cs = getComputedStyle(el)
      if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) < 0.5) continue
      const r0 = el.getBoundingClientRect()
      if (r0.width <= 2 || r0.height <= 2) continue // sr-only y similares
      const px = parseFloat(cs.fontSize)
      const grande = px >= 24 || (px >= 18.66 && Number(cs.fontWeight) >= 700)
      const fondo = fondoReal(el)
      const texto = sobre(aRgba(cs.color), fondo)
      const r = ratio(texto, fondo)
      const min = grande ? 3 : 4.5
      if (r < min) {
        malos.push({
          t: el.textContent.trim().slice(0, 32),
          r: r.toFixed(2),
          min,
          px: px.toFixed(0),
          cls: String(el.className).slice(0, 48),
        })
      }
    }
    return malos
  })
  if (contraste.length === 0) ok('todo el texto pasa el mínimo AA')
  else for (const c of contraste) mal(`contraste ${c.r}:1 (mín ${c.min}) — "${c.t}" ${c.px}px [${c.cls}]`)

  console.log('\n— TECLADO —')
  const orden = []
  for (let i = 0; i < 14; i++) {
    await pagina.keyboard.press('Tab')
    orden.push(
      await pagina.evaluate(() => {
        const a = document.activeElement
        return `${a.tagName.toLowerCase()}:${(a.getAttribute('aria-label') || a.textContent.trim()).slice(0, 26)}`
      }),
    )
  }
  orden[0].includes('Saltar al contenido')
    ? ok('el primer tab llega al enlace «Saltar al contenido»')
    : mal(`el primer tab va a: ${orden[0]}`)
  ok(`orden de tabulación: ${orden.slice(0, 8).join(' → ')}`)

  const anillo = await pagina.evaluate(() => {
    const a = document.activeElement
    const cs = getComputedStyle(a)
    return { w: cs.outlineWidth, c: cs.outlineColor, s: cs.outlineStyle }
  })
  parseFloat(anillo.w) >= 2 && anillo.s !== 'none'
    ? ok(`foco visible: outline ${anillo.w} ${anillo.s} ${anillo.c}`)
    : mal(`foco poco visible: ${JSON.stringify(anillo)}`)

  await ctx.close()
}

/* ---------------------------------------------------------------- móvil */
{
  const ctx = await navegador.newContext({ viewport: { width: 390, height: 844 }, locale: 'es-MX' })
  const pagina = await ctx.newPage()
  await pagina.goto(URL, { waitUntil: 'load' })
  await pagina.waitForTimeout(600)

  console.log('\n— MENÚ MÓVIL —')
  await pagina.getByRole('button', { name: /abrir el menú/i }).click()
  await pagina.waitForTimeout(200)
  const modal = await pagina.evaluate(() => {
    const d = document.querySelector('dialog')
    return { abierto: d.open, modal: d.matches(':modal'), foco: document.activeElement.tagName }
  })
  modal.abierto && modal.modal ? ok('el menú abre como <dialog> modal (foco atrapado nativamente)') : mal('el menú no es modal')

  await pagina.keyboard.press('Escape')
  await pagina.waitForTimeout(250)
  const cerrado = await pagina.evaluate(() => !document.querySelector('dialog').open)
  cerrado ? ok('Esc cierra el menú') : mal('Esc no cierra el menú')

  console.log('\n— OBJETIVOS TÁCTILES —')
  const pequenos = await pagina.evaluate(() =>
    [...document.querySelectorAll('a,button,input,select,textarea')]
      .filter((e) => e.offsetParent !== null)
      .map((e) => ({ r: e.getBoundingClientRect(), t: (e.getAttribute('aria-label') || e.textContent.trim()).slice(0, 28) }))
      .filter((x) => x.r.height > 0 && x.r.height < 40)
      .map((x) => `${x.t} (${Math.round(x.r.height)}px)`),
  )
  pequenos.length === 0
    ? ok('ningún objetivo táctil por debajo de 40 px de alto')
    : avisos.push(`objetivos táctiles pequeños: ${pequenos.join(', ')}`)

  console.log('\n— FORMULARIO DE CITA —')
  await pagina.evaluate(() => {
    window.__abierto = null
    window.open = (u) => (window.__abierto = u)
  })
  await pagina.locator('#cita').scrollIntoViewIfNeeded()

  // Vacío: la validación nativa debe frenar el envío
  await pagina.getByRole('button', { name: /enviar y reservar/i }).click()
  await pagina.waitForTimeout(200)
  const bloqueado = await pagina.evaluate(() => window.__abierto === null)
  bloqueado ? ok('el envío vacío se bloquea con la validación nativa') : mal('el formulario vacío se envió')

  const invalido = await pagina.evaluate(() => {
    const c = document.querySelector('#nombre')
    return { userInvalid: c.matches(':user-invalid'), aria: c.getAttribute('aria-invalid') }
  })
  invalido.userInvalid ? ok(':user-invalid marca el campo tras el intento') : avisos.push(':user-invalid no se activó tras el envío vacío')

  await pagina.fill('#nombre', 'Andrea Villalobos')
  await pagina.fill('#mascota', 'Nube')
  await pagina.selectOption('#servicio', { index: 1 })
  await pagina.fill('#notas', 'Lleva dos días sin comer.')
  await pagina.getByRole('button', { name: /enviar y reservar/i }).click()
  await pagina.waitForTimeout(300)

  const url = await pagina.evaluate(() => window.__abierto)
  if (url && url.startsWith('https://wa.me/')) {
    ok('el envío abre wa.me con el mensaje redactado')
    console.log('    ' + decodeURIComponent(url).replace(/\n/g, ' / ').slice(0, 190))
  } else mal(`el envío no generó una URL de WhatsApp: ${url}`)

  const ariaTrasCorregir = await pagina.getAttribute('#nombre', 'aria-invalid')
  ariaTrasCorregir === null ? ok('aria-invalid se retira al corregir el campo') : mal(`aria-invalid sigue en "${ariaTrasCorregir}"`)

  await ctx.close()
}

/* --------------------------------------------------- movimiento reducido */
{
  const ctx = await navegador.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
  const pagina = await ctx.newPage()
  await pagina.goto(URL, { waitUntil: 'load' })
  await pagina.waitForTimeout(400)
  console.log('\n— MOVIMIENTO REDUCIDO —')
  const anim = await pagina.evaluate(() => {
    const largas = document.getAnimations().filter((a) => {
      const d = a.effect?.getTiming?.().duration
      return typeof d === 'number' && d > 1
    })
    return { total: document.getAnimations().length, largas: largas.length, scroll: getComputedStyle(document.documentElement).scrollBehavior }
  })
  anim.largas === 0 ? ok('no queda ninguna animación activa con prefers-reduced-motion') : mal(`${anim.largas} animaciones siguen corriendo`)
  anim.scroll === 'auto' ? ok('scroll-behavior vuelve a auto') : mal(`scroll-behavior sigue en ${anim.scroll}`)
  await ctx.close()
}

await navegador.close()

console.log('\n' + '─'.repeat(60))
if (avisos.length) {
  console.log('AVISOS:')
  for (const a of avisos) console.log('  ! ' + a)
}
if (fallos.length) {
  console.log(`\n${fallos.length} FALLO(S):`)
  for (const f of fallos) console.log('  ✗ ' + f)
  process.exitCode = 1
} else {
  console.log('AUDITORÍA SUPERADA — sin fallos.')
}
