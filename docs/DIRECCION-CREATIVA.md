# Dirección creativa · ESTORIA

## Auditoría del material (16/10/2026)

| Recurso | Estado | Implicación |
|---|---|---|
| Etiqueta Tempranillo (PDF de imprenta) | Ráster único de 1122 × 1402 px (~285 ppp), sin capas ni vectores | Fuente principal. Zoom limitado a 1,2× su resolución nativa (`lib/camera.ts`, verificado por tests) |
| Foto de la botella (WhatsApp) | 921 × 1298 útiles, recomprimida, recortada (sin cuello, cápsula ni base) | Se usa en la revelación y en el expositor. No se reconstruye nada de lo que falta |
| Etiqueta Viura | No existe | Representación tipográfica rotulada «Etiqueta en desarrollo · provisional» |
| Fotos de Rioja, mesa y gastronomía | No existen | Escena 05 con encuadres del grabado; marcos editoriales rotulados con el brief fotográfico |

## Direcciones evaluadas

1. **Grabado vivo (elegida):** la etiqueta como eje de todo el lenguaje visual; se alternan escenas oscuras y pergamino. Máxima fidelidad y viable con el material real.
2. Bodegón nocturno: claroscuro en toda la web. Requiere fotografía inexistente.
3. Cuaderno de Rioja: libro de viaje ilustrado. Riesgo de parecer antigua.

## Storyboard v2 (16/10/2026)

Cambios pedidos por el cliente: el recorrido ya no repasa los textos de la etiqueta (se mantienen los colores) y cada
apartado es una página propia. Progreso de scroll de la sección de inicio (`lib/timeline.ts`):

| Escena | Progreso | Cámara y capas | Fondo | Texto |
|---|---|---|---|---|
| I · Revelación | 0–0,08 | Botella centrada; máscara de luz lateral animada en el tiempo + brillo sobre el vidrio | #120A0C | ESTORIA + lema |
| II · Aproximación | 0,08–0,28 | Zoom hacia la etiqueta y fundido directo a la etiqueta original, calibrado para que el texto coincida | aclara a #4A3328 | — |
| III · El origen | 0,28–0,55 | Desaparece el texto impreso; el grabado se separa en capas, los viñedos pasan junto a la cámara; luz dorada | papel #E6DAC7 | «Toda historia tiene un origen.» / «El nuestro se expresa en Rioja.» |
| IV · Rioja | 0,55–0,86 | El pueblo del grabado se funde con Briones (foto real); siguen Elvillar en otoño, con movimiento lento de cámara | foto | 3 frases + crédito de cada foto |
| V · Regreso | 0,86–1 | Vuelve la botella como lámina editorial; enlace a /vinos/ | pergamino | «El carácter de Rioja, en ESTORIA.» |

La página `/rioja/` muestra el grabado de la etiqueta con el lema «La tierra guarda memoria y cada historia encuentra su
momento» y una galería de paisajes reales de la DOCa. El universo de marca (paleta, explicación de la etiqueta), el
explorador de detalles de la etiqueta y la sección de profesionales se retiraron a petición del cliente.

Decisiones técnicas:
- Un solo valor de progreso alimenta todas las capas, sin animaciones independientes. Motion 12 acelera la opacidad con `ScrollTimeline` nativo y eso desincronizaba las capas. Por eso el progreso se replica en un `MotionValue` propio.
- La foto y la etiqueta se igualan en **altura**, no en anchura, porque la curvatura del vidrio estrecha la etiqueta fotografiada.
- En pantallas verticales, el paisaje se encuadra más cerrado, siempre dentro del límite de resolución.
- Con `prefers-reduced-motion` se muestra `StaticJourney`: el mismo contenido y el mismo orden, sin movimiento.

## Cambios v3 (16/10/2026)

- El recorrido de inicio deja de depender del scroll: ocupa una sola pantalla y se reproduce (20 s, `JOURNEY_SECONDS`) solo si el visitante pulsa «Ver la historia». Se puede pausar, saltar o volver a ver; se pausa solo si el visitante sigue bajando. Las progresiones de la tabla anterior son ahora fracciones de esos 20 s.
- Debajo del recorrido, la presentación de la marca (`BrandIntro`) sustituye al índice de páginas.
- La botella 3D se retira por poco realista. `/vinos/` usa solo fotografía real: vista 360° a partir de fotos sobre base giratoria (`TurntableViewer`), o la foto disponible mientras no existan.
- `/rioja/` incorpora la tradición vinícola de la Denominación y las dos variedades; `/mesa/`, cuatro momentos de consumo.

## Cambios v4 (16/10/2026)

- El recorrido lleva música (Satie, Gymnopédie n.º 1, 20 s). Con sonido, el reloj del recorrido es el propio audio, así que
  música e imagen terminan a la vez. Botones de pausa, saltar y sonido. Si el navegador bloquea el audio, sigue en silencio.
  Se probó una voz narrada sintética (Piper) y se retiró a petición de la marca por no sonar natural.
- La mesa: portada con copa de tinto, sección «Dos vinos, dos mesas» (tinto con cocido, blanco con pescado) y momentos.
- Viura con la etiqueta del Tempranillo cambiando solo la variedad.
- Revisión móvil: títulos que se salían a 360–390 px y tabla de cookies con desplazamiento horizontal.

## Sistema visual

- **Color:** tokens en `src/app/globals.css` (`@theme`): pergamino, papel, marfil, borgoña, vino, noche, tinta, oro, sepia, viñedo y rojo etiqueta.
- **Tipografía:** Cormorant Garamond para titulares (la más cercana a la serif de la etiqueta) e Inter para lectura. `.wordmark` con tracking amplio y `.eyebrow` en versalitas de 11 px.
- **Grid:** contenedor de 90 rem con margen lateral `clamp(1.25rem, 4vw, 3.5rem)`; composiciones de 12 columnas asimétricas.
- **Movimiento:** curva `cubic-bezier(0.22, 1, 0.36, 1)`. Cada capítulo tiene un gesto propio: cámara, cambio de luz, recorte, aparición palabra a palabra.
- **Vista 360° (/vinos/):** fotogramas reales en un canvas; arrastre horizontal para girar (con inercia), vertical para cambiar la altura de cámara, flechas del teclado. Carga progresiva empezando por la vuelta frontal.
- **Breakpoints:** los de Tailwind (`md` 768 px y `lg` 1024 px). El índice de capítulos solo aparece desde `lg`.
