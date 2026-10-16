# Guía para incorporar fotografías y datos definitivos

Todo el contenido vive en `src/content/`. Ningún componente contiene datos del vino ni del titular.
Regla: **un dato no confirmado nunca se publica**. Los campos `pending()` no se muestran (o, en los textos legales, se muestran como «Pendiente»). Los tests lo verifican.

## 1. Datos del titular (obligatorio antes del lanzamiento)

`owner` en `src/content/site.ts`: razón social, NIF, domicilio, correo, teléfono y datos registrales, con `confirmed("…")`.
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

## 3. Etiqueta definitiva del Viura

1. Exportar la etiqueta a la máxima resolución disponible en `public/media/etiqueta-viura.webp` (con transparencia fuera del papel).
2. En `src/content/media.ts`, añadir el recurso con `width`, `height` y `alt`.
3. En `wines.ts` (Viura): `label: media.viuraLabel` y `labelStatus: "definitiva"`. La botella 3D usará automáticamente la etiqueta real, a su tamaño de imprenta (100 × 125 mm).
4. Ajustar en `bottle3d` el color real del vidrio y de la cápsula.

## 4. Botella y modelo 3D

- La botella 3D de `/vinos/` es **ilustrativa**: forma bordelesa estándar de 75 cl con la etiqueta original. Con un modelo del fabricante (glTF) o una fotogrametría de la botella real, sustituir la geometría en `src/components/product/BottleViewer.tsx`.
- Si cambia la foto del Tempranillo, recalibrar `bottleLabelBox` en `media.ts` para que el texto de la etiqueta en la foto coincida con el del archivo original durante el fundido del recorrido.

## 5. Fotografías

Todas las fotos de terceros se registran en `src/content/credits.ts` (autor, licencia, enlace, cambios) y se descargan con `npm run photos`.
Una foto propia de la marca puede sustituir a cualquiera de ellas.

Dónde se usa cada foto:

| Sección | Lista | Archivo |
|---|---|---|
| Recorrido de inicio | `riojaPhotos` | `site.ts` |
| Página Rioja | `riojaGallery` | `editorial.ts` |
| La mesa | `tablePhotos` | `editorial.ts` |

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

## 7. Formulario

Configurar `NEXT_PUBLIC_FORM_ENDPOINT` (en GitHub, la variable `FORM_ENDPOINT`) y declarar el proveedor en `formProcessor` (`site.ts`). Ese proveedor aparece en la política de privacidad como encargado del tratamiento.

El formulario envía un `POST` JSON con `name, company, email, phone, topic, message, privacy, source`. Es compatible con Formspree, Basin, Getform o una función propia. Solo se muestra «recibido» si el servidor responde 2xx.

## 8. Venta directa (futuro)

Cada vino tiene `commerce` (`sku`, `price`, `available`) como `pending`. La tienda no está implementada a propósito: requiere condiciones comerciales, pasarela de pago, verificación de la mayoría de edad en la compra y política de envíos.
