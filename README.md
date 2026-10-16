# ESTORIA · web oficial

Universo digital de **ESTORIA**, vino de la Denominación de Origen Calificada Rioja (Tempranillo y Viura).
Una única experiencia cinematográfica controlada por scroll: la botella → la etiqueta → el grabado → Rioja → el regreso al producto.

- **Stack:** Next.js 15 (export estático) · TypeScript estricto · Tailwind CSS 4 · Motion for React
- **Sin 3D ni GSAP:** con el material disponible (una foto frontal y la etiqueta plana) solo un 2.5D es fiel al producto. Ver `docs/DIRECCION-CREATIVA.md`.

## Requisitos

- Node.js 20 o superior (probado con Node 24)
- Python 3 con `pymupdf` y `Pillow`, solo para regenerar los recursos desde los originales

## Instalación y uso local

```bash
npm install
npm run dev          # http://localhost:3000
npm test             # tests (Vitest)
npm run typecheck
npm run build        # genera el sitio estático en out/
npm start            # sirve out/ localmente
```

Variables de entorno (copiar `.env.example` como `.env.local`):

| Variable | Uso |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL pública completa (canonical, sitemap, Open Graph) |
| `NEXT_PUBLIC_BASE_PATH` | Subruta del sitio (GitHub Pages: `/estoria-web`). Vacío en local o con dominio propio |
| `NEXT_PUBLIC_FORM_ENDPOINT` | Endpoint POST JSON para los formularios. **Vacío = envío desactivado**: la web lo indica y no simula éxito |

## Despliegue

**GitHub Pages (configurado):** cada push a `main` ejecuta `.github/workflows/deploy.yml`: typecheck → tests → build → publicación.
El base path y la URL los calcula `actions/configure-pages`. Para activar los formularios, crear la variable
de repositorio `FORM_ENDPOINT` (Settings → Secrets and variables → Actions → Variables).

**Dominio propio / otro hosting estático:** `npm run build` y subir `out/`. Con dominio propio, dejar `NEXT_PUBLIC_BASE_PATH` vacío.

## Estructura

```
src/
  app/            layout, página, sitemap, robots, estilos y tokens (globals.css)
  content/        TODO el contenido editable: vinos, textos, medios, fotos, contacto, puntos de venta
  lib/            cámara (zoom con límite de resolución), guion temporal, validación, envío, hooks
  components/
    scenes/       recorrido cinematográfico + versión estática (movimiento reducido)
    product/      expositor de vinos, ficha, explorador de etiqueta, etiqueta provisional
    editorial/    capítulo de la mesa, universo de marca, marcos fotográficos
    forms/        formulario profesional y de contacto
    navigation/   cabecera adaptativa y menú móvil
scripts/prepare_assets.py   genera public/media desde source-assets/ (sin retocar píxeles)
tests/            cámara y continuidad, contenido y credibilidad, formularios
docs/             dirección creativa, storyboard y guía de contenido
```

## Recursos originales

`source-assets/` **no se sube al repositorio** (contiene el PDF de imprenta). Para regenerar `public/media`:
colocar en `source-assets/` el PDF `ESTORIA_original_para_imprenta.pdf` y la foto `estoria-tempranillo-foto-whatsapp.jpeg`
y ejecutar `npm run assets`.

## Incorporar fotografías y datos definitivos

Ver **[docs/CONTENIDO.md](docs/CONTENIDO.md)**.
