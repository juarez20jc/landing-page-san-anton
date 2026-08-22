import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Inyecta title, meta description, Open Graph y los datos estructurados
 * JSON-LD en index.html a partir de src/data/clinica.js.
 *
 * Así el SEO sale en el HTML estático (Google lo ve sin ejecutar JS) pero
 * los datos siguen viviendo en un único archivo editable.
 */
function seoDesdeDatos() {
  const DIAS_SCHEMA = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]

  return {
    name: 'sananton-seo',
    async transformIndexHtml(html) {
      const datos = await import(
        pathToFileURL(resolve(import.meta.dirname, 'src/data/clinica.js')).href
      )
      const { clinica, servicios, direccionUnaLinea } = datos // eslint-disable-line no-unused-vars

      const titulo = `${clinica.nombre} · Veterinaria con urgencias 24 h en ${clinica.direccion.zona}, ${clinica.direccion.ciudad}`
      const descripcion =
        `Clínica veterinaria en ${clinica.direccion.zona}, ${clinica.direccion.distrito}, ${clinica.direccion.ciudad}. ` +
        `Consulta, vacunación, cirugía, estética, laboratorio y urgencias 24/7. ` +
        `Agenda tu cita por WhatsApp al ${clinica.telefono.visible}.`
      const ogImagen = `${clinica.sitio}/og-image.jpg`

      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'VeterinaryCare',
        '@id': `${clinica.sitio}/#clinica`,
        name: clinica.nombre,
        description: descripcion,
        url: clinica.sitio,
        image: ogImagen,
        logo: `${clinica.sitio}/favicon.svg`,
        telephone: clinica.telefono.tel,
        email: clinica.email,
        priceRange: '$$',
        foundingDate: String(clinica.fundacion),
        currenciesAccepted: 'PEN',
        address: {
          '@type': 'PostalAddress',
          streetAddress: clinica.direccion.calle,
          addressLocality: clinica.direccion.distrito,
          addressRegion: clinica.direccion.ciudad,
          postalCode: clinica.direccion.cp,
          addressCountry: clinica.direccion.pais,
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: clinica.geo.lat,
          longitude: clinica.geo.lng,
        },
        hasMap: datos.enlaceMapa,
        openingHoursSpecification: clinica.horarios.map((h) => ({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: h.dias.map((d) => DIAS_SCHEMA[d]),
          opens: h.abre,
          closes: h.cierra,
        })),
        // Las urgencias sí operan de forma continua
        specialOpeningHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          name: 'Urgencias',
          dayOfWeek: DIAS_SCHEMA,
          opens: '00:00',
          closes: '23:59',
        },
        availableService: servicios.map((s) => ({
          '@type': 'MedicalProcedure',
          name: s.titulo,
          description: s.texto,
        })),
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '380',
          bestRating: '5',
        },
        // Sólo se declaran los perfiles que existen de verdad
        ...(Object.values(clinica.redes).filter(Boolean).length
          ? { sameAs: Object.values(clinica.redes).filter(Boolean) }
          : {}),
      }

      return {
        html: html
          .replace(/<title>.*?<\/title>/, `<title>${titulo}</title>`)
          .replaceAll('{{TELEFONO_TEL}}', clinica.telefono.tel)
          .replaceAll('{{TELEFONO_VISIBLE}}', clinica.telefono.visible),
        tags: [
          { tag: 'link', attrs: { rel: 'canonical', href: clinica.sitio }, injectTo: 'head' },
          { tag: 'meta', attrs: { name: 'description', content: descripcion }, injectTo: 'head' },
          { tag: 'meta', attrs: { name: 'author', content: clinica.nombre }, injectTo: 'head' },
          { tag: 'meta', attrs: { name: 'geo.region', content: 'PE-LIM' }, injectTo: 'head' },
          { tag: 'meta', attrs: { name: 'geo.position', content: `${clinica.geo.lat};${clinica.geo.lng}` }, injectTo: 'head' },

          { tag: 'meta', attrs: { property: 'og:type', content: 'website' }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:site_name', content: clinica.nombre }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:locale', content: 'es_PE' }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:title', content: titulo }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:description', content: descripcion }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:url', content: clinica.sitio }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:image', content: ogImagen }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:image:height', content: '630' }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:image:alt', content: `Veterinaria atendiendo a un perro en ${clinica.nombre}` }, injectTo: 'head' },

          { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' }, injectTo: 'head' },
          { tag: 'meta', attrs: { name: 'twitter:title', content: titulo }, injectTo: 'head' },
          { tag: 'meta', attrs: { name: 'twitter:description', content: descripcion }, injectTo: 'head' },
          { tag: 'meta', attrs: { name: 'twitter:image', content: ogImagen }, injectTo: 'head' },

          {
            tag: 'script',
            attrs: { type: 'application/ld+json' },
            children: JSON.stringify(jsonLd),
            injectTo: 'head',
          },
        ],
      }
    },
  }
}

export default defineConfig(({ command }) => ({
  // En GitHub Pages el sitio cuelga de una subcarpeta; en local, de la raíz.
  base: command === 'build' ? '/landing-page-san-anton/' : '/',
  plugins: [react(), tailwindcss(), seoDesdeDatos()],
  build: {
    target: 'es2022',
    cssMinify: 'lightningcss',
  },
}))
