# Guía para incorporar fotografías y datos definitivos

Todo el contenido vive en `src/content/`. Ningún componente contiene datos del vino.
Regla: **un dato no confirmado nunca se publica**. Los campos `pending()` no se muestran; los tests lo verifican.

## 1. Ficha técnica de un vino

`src/content/wines.ts`: sustituir `pending()` por `confirmed("…")` en el vino correspondiente.

```ts
technical: {
  ...emptySheet(),
  vintage: confirmed("2023"),
  alcohol: confirmed("14 % vol."),
},
```

Importar `confirmed` desde `./types`. Los datos aparecen automáticamente en la ficha (diálogo «Ver ficha del vino»).

## 2. Etiqueta definitiva del Viura

1. Exportar la etiqueta a la máxima resolución disponible (idealmente ≥ 2000 px de ancho) en `public/media/etiqueta-viura.webp`.
   Si viene con fondo, usar `scripts/prepare_assets.py` como referencia para extraerla sin retocar.
2. En `src/content/media.ts` añadir el recurso con `width`, `height` y `alt`.
3. En `wines.ts` (Viura): `label: media.viuraLabel`, `labelStatus: "definitiva"` y sus `labelRegions`
   (coordenadas 0–1 del centro de cada zona y `span`, fracción del ancho que debe llenar la vista).
   El explorador «Descubre cada detalle» mostrará automáticamente el selector de vino.

## 3. Fotografía de botella

- **Botella completa de cada vino (pendiente y prioritaria):** fondo neutro u oscuro, luz lateral suave,
  sin recortes de cuello ni base, ≥ 3000 px de alto. Permitirá que la escena 01 muestre la botella entera y la cápsula.
- Si cambia la foto del Tempranillo, actualizar `bottleLabelBox` en `media.ts` (posición de la etiqueta dentro de la foto)
  para que la transición foto → etiqueta siga alineada.

## 4. Fotografías de Rioja (escena 05)

`src/content/site.ts` → `riojaPhotos`. Cada foto debe ser **de Rioja, verificable y con licencia**:

```ts
{ src: "/media/rioja-01.webp", width: 2400, height: 1600, alt: "…", place: "Municipio, Rioja Alta", credit: "Autor / licencia" }
```

Con al menos una foto, la escena 04 funde el grabado con la fotografía real.

## 5. Fotografía editorial (mesa, gastronomía)

`src/content/editorial.ts` → `tablePhotos`: rellenar `src`, `width`, `height`. El marco provisional desaparece solo.
Cada entrada incluye el *brief* fotográfico. No mostrar consumo excesivo ni rostros sin cesión de derechos.

## 6. Contacto, datos legales y puntos de venta

- `contactDetails` en `site.ts`: correo, teléfono y razón social con `confirmed(...)`.
- `stockists`: solo establecimientos con acuerdo real.
- Antes de lanzar: crear **aviso legal, política de privacidad y cookies** (el pie lo indica como «en preparación»)
  y revisar el uso de la mención DOCa Rioja con el Consejo Regulador.

## 7. Formularios

Configurar `NEXT_PUBLIC_FORM_ENDPOINT` (en GitHub: variable `FORM_ENDPOINT`). El formulario envía `POST` JSON con
`kind, name, company, establishment, topic, city, email, phone, message, consent, source`.
Compatible con Formspree, Basin, Getform o una función propia. Solo se muestra «recibido» si el servidor responde 2xx.

## 8. Venta directa (futuro)

Cada vino tiene `commerce` (`sku`, `price`, `available`) como `pending`. La tienda no está implementada a propósito:
requiere condiciones comerciales, pasarela de pago, verificación de mayoría de edad en la compra y política de envíos.
