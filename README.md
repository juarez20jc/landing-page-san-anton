# San Antón — Landing page

Landing page de la **Clínica Veterinaria San Antón** (Plaza Norte, Independencia — Lima). Vite + React 19 + Tailwind 4, sin backend.

**En línea:** <https://juarez20jc.github.io/landing-page-san-anton/>

## Empezar

```bash
npm install
npm run dev        # http://localhost:5173
```

```bash
npm run build      # genera dist/
npm run preview    # sirve dist/ en http://localhost:4173
```

## Despliegue

Cada `git push` a `main` publica solo: el workflow de
`.github/workflows/deploy.yml` construye el sitio y lo sube a GitHub Pages.
No hay que hacer nada más.

El sitio cuelga de una subcarpeta (`/landing-page-san-anton/`), así que
`vite.config.js` fija `base` en el build. Si algún día lo mueves a un
dominio propio, cambia ese `base` a `'/'` y el campo `sitio` de
`src/data/clinica.js`.

Para publicarlo en otro sitio, el `dist/` que genera `npm run build` es
estático y funciona en cualquier hosting (Netlify, Vercel, Hostinger…).

---

## ⚠️ Lo primero que debes editar

Todos los datos de la clínica están en **un solo archivo**:

```
src/data/clinica.js
```

Ahí cambias nombre, teléfono, WhatsApp, correo, dirección, coordenadas del
mapa, horarios, servicios, equipo, testimonios y redes sociales. Al
guardarlo se actualizan solos el hero, los horarios, el mapa, los enlaces
de WhatsApp, el pie y los **datos estructurados de Google** (JSON-LD).
No hace falta tocar ningún componente.

Los valores actuales son **placeholders realistas**. Los tres imprescindibles:

| Campo | Ahora | Qué poner |
|---|---|---|
| `telefono` | `+51 919 550 076` | Lo que se ve en pantalla, y en `tel` el mismo número sin espacios |
| `whatsapp` | `51919550076` | Sólo dígitos con código de país. Perú: `51` + los 9 dígitos. (México móvil llevaría `52` + `1` + número) |
| `sitio` | `https://juarez20jc.github.io/landing-page-san-anton` | La URL de GitHub Pages. Cámbiala si algún día hay dominio propio (y con ella `robots.txt` y `sitemap.xml`) |

Al cambiar `sitio`, actualiza también `public/robots.txt` y `public/sitemap.xml`.

---

## Imágenes

Las fotos están generadas con IA y **guardadas localmente** en
`public/img/` como WebP en 1x y 2x. La página no llama a ningún servicio
externo al cargar.

```bash
npm run imagenes                 # genera sólo las que falten
npm run imagenes -- --force      # regenera todas
npm run imagenes -- --force hero # regenera sólo la que coincida
```

Los prompts están en `scripts/generar-imagenes.mjs`. Cuando tengas fotos
reales de la clínica, basta con sustituir los archivos de `public/img/`
respetando los nombres (`hero.webp`, `hero@2x.webp`, `equipo-1.webp`…).

La iconografía de servicios y el patrón de huellas son **SVG dibujados a
mano** en `src/components/icons/Iconos.jsx`, no imágenes.

---

## Verificación

```bash
npm run preview   # en una terminal
npm run capturas  # capturas en 360/390/820/1440/1920 px + detección de scroll horizontal
npm run secciones # una captura por sección, con las imágenes diferidas ya cargadas
npm run auditar   # accesibilidad, teclado, contraste AA, enlaces y formulario
```

Las capturas se guardan en `scripts/.capturas/` (ignorado por git).

Estado actual: **auditoría superada sin fallos** — contraste AA en todo el
texto, un solo `h1`, jerarquía de encabezados correcta, foco visible,
menú móvil con `<dialog>` modal (foco atrapado y cierre con `Esc`),
todas las imágenes con `alt` y `width`/`height`, `fetchpriority="high"`
sólo en el LCP, y ninguna animación activa con `prefers-reduced-motion`.

---

## Estructura

```
index.html                  meta base; el SEO se inyecta en el build
vite.config.js              plugin que genera title, Open Graph y JSON-LD desde clinica.js
public/
  img/                      fotos generadas con IA (webp 1x y 2x)
  favicon.svg  robots.txt  sitemap.xml  og-image.jpg
scripts/
  generar-imagenes.mjs      descarga y optimiza las fotos
  capturas.mjs  secciones.mjs  auditoria.mjs
src/
  index.css                 tokens de color y tipografía (@theme) + utilidades
  data/clinica.js           ← TODOS los datos editables
  hooks/                    useAbiertoAhora (estado de apertura en vivo)
                            useDesplazado  (header compacto y botón flotante)
  components/               Header Hero Servicios SobreClinica Equipo
                            Testimonios Horarios Ubicacion FormularioCita
                            CtaFinal Footer BotonWhatsApp
    ui/Primitivas.jsx       Boton, Foto, SeccionTitulo, Estrellas
    icons/Iconos.jsx        SVG a medida
```

## El formulario de cita

No hay servidor. Al enviar, el formulario redacta un mensaje de WhatsApp
con los datos y abre la conversación con la clínica. Cero mantenimiento,
cero coste, y la petición llega al canal donde ya se responde.

Si prefieres recibir las citas por correo o en una hoja de cálculo, el
punto a cambiar es la función `enviar` de
`src/components/FormularioCita.jsx`.
