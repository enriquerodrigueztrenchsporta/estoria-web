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

## Storyboard (progreso de scroll de la sección `#historia`, `lib/timeline.ts`)

| Escena | Progreso | Cámara y capas | Fondo | Texto |
|---|---|---|---|---|
| I · Revelación | 0–0,08 | Botella centrada; máscara de luz lateral animada en el tiempo (2,8 s) + brillo sobre el vidrio | #120A0C | ESTORIA + lema, indicador de scroll |
| II · Aproximación | 0,08–0,22 | Zoom sincronizado hacia el centro de la etiqueta; fundido a la etiqueta en alta resolución a igual altura | aclara a #3B2621 | — |
| III · La etiqueta | 0,22–0,50 | Recorrido: RIOJA → nombre → detalle de la iglesia | #4A3328 | 3 rótulos |
| IV · El grabado | 0,50–0,71 | Desaparecen los textos impresos; el grabado se separa en dos capas (pueblo/montañas y viñedos), los viñedos pasan junto a la cámara; luz dorada | papel #E6DAC7 | «Toda historia tiene un origen.» / «El nuestro se expresa en Rioja.» |
| V · Rioja | 0,71–0,88 | Panorámica lateral sobre el pueblo; el tono de luz cambia (mañana, mediodía, tarde) | papel | 3 frases |
| VI · Regreso | 0,88–1 | Vuelve la botella como lámina editorial; la cámara se aleja | pergamino | «El carácter de Rioja, en ESTORIA.» |

Decisiones técnicas:
- Un solo valor de progreso alimenta todas las capas, sin animaciones independientes. Motion 12 acelera la opacidad con `ScrollTimeline` nativo y eso desincronizaba las capas. Por eso el progreso se replica en un `MotionValue` propio.
- La foto y la etiqueta se igualan en **altura**, no en anchura, porque la curvatura del vidrio estrecha la etiqueta fotografiada.
- En pantallas verticales, el paisaje se encuadra más cerrado, siempre dentro del límite de resolución.
- Con `prefers-reduced-motion` se muestra `StaticJourney`: el mismo contenido y el mismo orden, sin movimiento.

## Sistema visual

- **Color:** tokens en `src/app/globals.css` (`@theme`): pergamino, papel, marfil, borgoña, vino, noche, tinta, oro, sepia, viñedo y rojo etiqueta.
- **Tipografía:** Cormorant Garamond para titulares (la más cercana a la serif de la etiqueta) e Inter para lectura. `.wordmark` con tracking amplio y `.eyebrow` en versalitas de 11 px.
- **Grid:** contenedor de 90 rem con margen lateral `clamp(1.25rem, 4vw, 3.5rem)`; composiciones de 12 columnas asimétricas.
- **Movimiento:** curva `cubic-bezier(0.22, 1, 0.36, 1)`. Cada capítulo tiene un gesto propio: cámara, cambio de luz, zoom de detalle, recorte, aparición palabra a palabra.
- **Breakpoints:** los de Tailwind (`md` 768 px y `lg` 1024 px). El índice de capítulos solo aparece desde `lg`.
