/* Pasa a public/img las imágenes que el cliente colocó en el lienzo.
   Deja cada una en WebP 1x y 2x, con el nombre que usan los componentes. */
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const ORIGEN = 'diseno'
const DESTINO = 'public/img'

/* [archivo en el lienzo, nombre final, ancho 1x] */
const IMAGENES = [
  ['portada-mt4tb52e-glbo.jpg', 'portada', 512],
  ['gemini_generated_image_nl5an0nl5an0nl5a-mtc7qyhj-lbt5.jpg', 'portada-2', 512],
  ['gemini_generated_image_xag9qexag9qexag9-mtc5de11-juvf.jpg', 'portada-3', 512],
  ['gemini_generated_image_8kah1g8kah1g8kah--mtc1autl-ou7v.jpg', 'clinica', 700],
  ['gemini_generated_image_pkgqagpkgqagpkgq-mtc501zy-xq72.jpg', 'urgencias', 640],
  ['images-mtc860fm-livu.jpg', 'prod-cama', 320],
  ['images-1--mtc85sml-as19.jpg', 'prod-transportadora', 320],
  ['imageurl_1-mtc87351-b490.webp', 'prod-rascador', 320],
  ['images-2--mtc87zww-uv7n.jpg', 'prod-tunel', 320],
  ['244219-800-auto-mtc89ksr-vud3.webp', 'prod-alimento-perro', 320],
  ['proteggo-3m-small-4-5-a-10kg-250mg-antip-mtc8a4jh-w9vn.webp', 'prod-antipulgas', 320],
  ['hc000486_m-mtc8b3hd-c5rf.jpg', 'prod-arena', 320],
  ['equilibrio-gatos-castrados-1-a-7-anos-x--mtc8bhve-19ki.jpg', 'prod-alimento-gato', 320],
]

fs.mkdirSync(DESTINO, { recursive: true })

let total = 0
for (const [origen, nombre, ancho] of IMAGENES) {
  const entrada = path.join(ORIGEN, origen)
  if (!fs.existsSync(entrada)) {
    console.log(`  ! falta ${origen}`)
    continue
  }
  for (const [suf, w] of [['', ancho], ['@2x', ancho * 2]]) {
    const salida = path.join(DESTINO, `${nombre}${suf}.webp`)
    const buf = await sharp(entrada)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer()
    fs.writeFileSync(salida, buf)
    total += buf.length
  }
  const px = (await sharp(entrada).metadata()).width
  console.log(`${nombre.padEnd(22)} ${px}px → ${ancho}/${ancho * 2}`)
}
console.log(`\n${IMAGENES.length} imágenes, ${(total / 1024 / 1024).toFixed(2)} MB en public/img`)
