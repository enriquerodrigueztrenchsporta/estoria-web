# Guía para incorporar fotografías y datos definitivos

Todo el contenido vive en `src/content/`. Ningún componente contiene datos del vino ni del titular.
Regla: **un dato no confirmado nunca se publica**. Los campos `pending()` no se muestran (o, en los textos legales, se muestran como «Pendiente»). Los tests lo verifican.

## 1. Datos del titular y contacto

`owner` en `src/content/site.ts`: razón social, NIF, domicilio y datos registrales, con `confirmed("…")` (obligatorio antes del lanzamiento).
Correo (info@estoria.com) y teléfonos ya confirmados por la marca: `owner` y `contact` en el mismo archivo.
Se rellenan solos en el aviso legal, la política de privacidad y la página de contacto.

## 2. Ficha técnica de un vino

`src/content/wines.ts`: sustituir `pending()` por `confirmed("…")` en el vino correspondiente.

```ts
technical: {
  ...emptySheet(),
  vintage: confirmed("2023"),
  alcohol: confirmed("14 % vol."),
},
```

Importar `confirmed` desde `./types`. Los datos aparecen automáticamente en la ficha (diálogo «Ver ficha del vino»).

## 3. Etiqueta del Viura

A petición de la marca, la etiqueta del Viura es la del Tempranillo con «VIURA» en lugar de «TEMPRANILLO»
(`npm run viura-label`, ver el script para el método). Solo cambia esa palabra; la tipografía es Cinzel (licencia OFL),
la más parecida a la original. Si el diseñador entrega el archivo de imprenta del Viura, sustituir
`public/media/etiqueta-viura.webp` (mismo tamaño, 1122 × 1402) por una exportación de ese archivo.

## 4. Vista 360° de las botellas (fotografía real)

La botella de `/vinos/` se muestra solo con fotografías reales: no hay modelos 3D ni reconstrucciones.
Mientras no existan las fotos de giro, se muestra la foto disponible (Tempranillo) o la etiqueta provisional (Viura).

**Cómo fotografiar cada botella** (estudio o fotógrafo de producto):

- Base giratoria motorizada o manual con marcas cada 5° (72 fotos por vuelta; 36 como mínimo).
- Cámara fija en trípode, con la misma exposición, enfoque y balance de blancos en manual en todas las fotos.
- Fondo liso. Recomendado: el color de la web (#351D22 para el Tempranillo, #FAF7F0 para el Viura) o un fondo neutro para recortarlo después.
- Luz difusa (cajas de luz o panel grande) para controlar los reflejos del vidrio; botella limpia y sin huellas.
- Botella entera en el encuadre, de la cápsula a la base, con margen.
- Para poder inclinar la vista arriba y abajo: repetir la vuelta completa con la cámara a 2 o 3 alturas (p. ej. 15° por debajo, a la altura de la etiqueta y 15° por encima). Con una sola altura la botella solo gira de lado a lado.
- Primera foto de cada vuelta: la etiqueta de frente. Todas las vueltas en el mismo sentido.

**Cómo incorporarlas:**

1. Copiar las fotos en `source-assets/giro/<vino>/` (`tempranillo` o `viura`). Con varias alturas, una subcarpeta por altura ordenada de la más baja a la más alta: `1-baja/`, `2-media/`, `3-alta/`.
2. Ejecutar `npm run turntable -- <vino>`. Opciones: `--recorte izq,arriba,der,abajo` (mismo recorte para todas), `--altura 1600`, `--frontal N`.
3. El script genera `public/media/giro/<vino>/` y añade el vino a `src/content/turntables.json`. La web lo usa automáticamente; los tests comprueban que existen todos los fotogramas.

Peso orientativo: 72 fotos × 3 alturas a 1600 px de alto en WebP ≈ 10–15 MB por botella. Se descargan de forma progresiva: primero la vuelta frontal.

- Si cambia la foto del Tempranillo, recalibrar `bottleLabelBox` en `media.ts` para que el texto de la etiqueta en la foto coincida con el del archivo original durante el fundido del recorrido.

## 5. Fotografías

Todas las fotos de terceros se registran en `src/content/credits.ts` (autor, licencia, enlace, cambios) y se descargan con `npm run photos`.
Una foto propia de la marca puede sustituir a cualquiera de ellas.

Dónde se usa cada foto:

| Sección | Lista | Archivo |
|---|---|---|
| Recorrido de inicio | `riojaPhotos` | `site.ts` |
| Página Rioja | `riojaGallery` | `editorial.ts` |
| Textos de todas las páginas | `story` | `copy.ts` |
| La mesa | `tablePhotos` (portada, maridajes tinto/blanco, ocasiones, pequeños momentos) | `editorial.ts` |

Requisitos de cada foto:

- de Rioja verificable;
- sin marcas de terceros;
- sin personas identificables, salvo cesión de derechos;
- sin consumo excesivo de alcohol.

## 6. Contacto, puntos de venta y textos legales

- `stockists` en `site.ts`: solo establecimientos con acuerdo real.
- Textos legales en `src/app/aviso-legal`, `src/app/privacidad` y `src/app/cookies`: revisarlos con asesoría jurídica antes del lanzamiento.
- Si se añade analítica:
  - cargarla solo cuando `useConsent()?.analytics` sea `true`;
  - declararla en la política de cookies;
  - subir `CONSENT_VERSION` en `src/lib/consent.ts` para volver a pedir el consentimiento.

## 7. Música del recorrido

- Generar: `npm run music -- --musica <Gymnopedie_No._1..ogg> [--segundos 20]` (requiere `pip install imageio-ffmpeg`).
  Escribe `public/media/audio/historia.mp3` y `src/content/soundtrack.json`; la duración del recorrido es la de la música.
- La voz narrada se retiró a petición de la marca (la voz sintética no sonaba natural). Si en el futuro se graba una
  locución profesional, puede mezclarse en la misma pista.
- Crédito: `audioCredits` en `src/content/credits.ts` (se muestra en /creditos/).

## 8. Formulario

Configurar `NEXT_PUBLIC_FORM_ENDPOINT` (en GitHub, la variable `FORM_ENDPOINT`) y declarar el proveedor en `formProcessor` (`site.ts`). Ese proveedor aparece en la política de privacidad como encargado del tratamiento.

El formulario envía un `POST` JSON con `name, company, email, phone, topic, message, privacy, source`. Es compatible con Formspree, Basin, Getform o una función propia. Solo se muestra «recibido» si el servidor responde 2xx.

## 9. Venta directa (futuro)

Cada vino tiene `commerce` (`sku`, `price`, `available`) como `pending`. La tienda no está implementada a propósito: requiere condiciones comerciales, pasarela de pago, verificación de la mayoría de edad en la compra y política de envíos.
