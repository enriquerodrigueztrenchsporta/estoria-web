# ESTORIA · web oficial

Universo digital de **ESTORIA**, vino de la Denominación de Origen Calificada Rioja (Tempranillo y Viura).

| Página | Contenido |
|---|---|
| `/` La historia | Recorrido cinematográfico de 20 s que solo se reproduce si el visitante pulsa «Ver la historia» (la botella → el grabado → Rioja → regreso), seguido de la presentación de la marca |
| `/vinos/` | Tempranillo y Viura con vista 360° hecha con fotografías reales de la botella (cuando existan) y ficha de cada vino |
| `/rioja/` | El grabado de la etiqueta con el lema, la tradición vinícola de Rioja, las uvas de ESTORIA (Tempranillo y Viura) y paisajes de la DOCa |
| `/mesa/` | Momentos para el vino: compartir, ocasiones especiales, buena comida, pequeños momentos |
| `/contacto/` | Formulario con consentimiento RGPD |
| `/aviso-legal/` · `/privacidad/` · `/cookies/` · `/creditos/` | Textos legales y créditos fotográficos |

Además: verificación de mayoría de edad, aviso y configuración de cookies (criterios de la AEPD) y página 404.

- **Stack:** Next.js 15 (export estático) · TypeScript estricto · Tailwind CSS 4 · Motion for React

## Requisitos

- Node.js 20 o superior (probado con Node 24)
- Python 3 con `pymupdf` y `Pillow`, solo para regenerar imágenes

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
| `NEXT_PUBLIC_FORM_ENDPOINT` | Endpoint POST JSON para el formulario. **Vacío = envío desactivado**: la web lo indica y no simula éxito |

## Despliegue

**GitHub Pages (configurado):** cada push a `main` ejecuta `.github/workflows/deploy.yml`: typecheck → tests → build → publicación.
Para activar el formulario, crear la variable de repositorio `FORM_ENDPOINT` (Settings → Secrets and variables → Actions → Variables).

**Dominio propio u otro hosting estático:** `npm run build` y subir `out/`. Con dominio propio, dejar `NEXT_PUBLIC_BASE_PATH` vacío.

## Antes del lanzamiento comercial (obligatorio)

1. Completar los datos del titular en `src/content/site.ts` (`owner`). Hoy aparecen como «Pendiente» en los textos legales.
2. Elegir y configurar el servicio de formularios (`FORM_ENDPOINT` y `formProcessor` en `site.ts`).
3. Revisión de los textos legales por un asesor jurídico, y del uso de la mención DOCa Rioja con el Consejo Regulador.

## Estructura

```
src/
  app/            páginas (inicio, vinos, rioja, mesa, contacto, legales), sitemap, robots, estilos y tokens
  content/        TODO el contenido editable: vinos, textos, medios, créditos de fotos, titular, puntos de venta
  lib/            cámara (zoom con límite de resolución), guion temporal, validación, envío, consentimiento
  components/
    scenes/       recorrido cinematográfico + versión estática (movimiento reducido)
    brand/        presentación de la marca (inicio)
    product/      expositor de vinos, visor 360° fotográfico, ficha, etiqueta provisional
    editorial/    páginas Rioja y La mesa, fotografía con créditos
    forms/        formulario de contacto
    legal/        verificación de edad, cookies, plantilla de textos legales
    navigation/   cabecera adaptativa y menú móvil
scripts/prepare_assets.py   genera public/media desde source-assets/ (sin retocar píxeles)
scripts/prepare_photos.py   descarga y optimiza las fotos con licencia libre
scripts/prepare_turntable.py convierte las fotos de la base giratoria en la vista 360° (npm run turntable -- <vino>)
tests/            cámara y continuidad, contenido, licencias de fotos, páginas, formularios
docs/             dirección creativa, storyboard y guía de contenido
```

## Fotografías de terceros

Todas proceden de Wikimedia Commons, con la licencia libre verificada archivo a archivo:

- licencia declarada;
- autor;
- obra propia o revisión de licencia superada;
- sin plantillas de derechos de imagen ni de marca;
- sin personas identificables ni marcas de vino de terceros.

Las atribuciones están registradas en `src/content/credits.ts`, y se muestran junto a cada foto y en `/creditos/`. Para regenerarlas: `npm run photos`.

**Antes de añadir una foto nueva:** comprobar su licencia en la página del archivo, añadirla a `credits.ts` (autor, licencia, enlace y cambios) y a `scripts/prepare_photos.py`. No usar fotos de bancos de imágenes sin licencia documentada.

## Recursos originales

`source-assets/` **no se sube al repositorio** (contiene el PDF de imprenta). Para regenerar `public/media`, colocar en `source-assets/` el PDF `ESTORIA_original_para_imprenta.pdf` y la foto `estoria-tempranillo-foto-whatsapp.jpeg`, y ejecutar `npm run assets`.

## Incorporar fotografías y datos definitivos

Ver **[docs/CONTENIDO.md](docs/CONTENIDO.md)**.
