/**
 * Matemática de la "cámara" que recorre la etiqueta.
 * Todo en píxeles CSS. La etiqueta se dibuja centrada en el viewport con tamaño `base`
 * y la cámara aplica translate + scale con origen en el centro.
 */

export type Size = { width: number; height: number };
export type Shot = { scale: number; x: number; y: number };
export type Framing = { cx: number; cy: number; span: number };

/** Factor de ampliación tolerado sobre la resolución nativa antes de considerar que se pixela. */
export const UPSCALE_TOLERANCE = 1.2;

/** Tamaño "contain" de una imagen dentro del viewport, ocupando como máximo `fill` de cada eje. */
export function containSize(viewport: Size, aspect: number, fill = 0.78): Size {
  const maxW = viewport.width * fill;
  const maxH = viewport.height * fill;
  const width = Math.min(maxW, maxH * aspect);
  return { width, height: width / aspect };
}

/** Escala máxima permitida para que la imagen nunca supere su resolución nativa (con tolerancia). */
export function maxScale(baseWidth: number, nativeWidth: number, tolerance = UPSCALE_TOLERANCE): number {
  if (baseWidth <= 0) return 1;
  return Math.max(1, (nativeWidth * tolerance) / baseWidth);
}

/**
 * Encuadre de una zona de la etiqueta: la zona (`span` del ancho) llena ~90 % del ancho del viewport,
 * limitado por `cap` para no perder calidad.
 */
export function frame(region: Framing, base: Size, viewport: Size, cap: number): Shot {
  const desired = (viewport.width * 0.9) / (region.span * base.width);
  const scale = Math.max(1, Math.min(desired, cap));
  return {
    scale,
    x: -(region.cx - 0.5) * base.width * scale,
    y: -(region.cy - 0.5) * base.height * scale,
  };
}

/** Plano general: etiqueta completa centrada. */
export const wideShot: Shot = { scale: 1, x: 0, y: 0 };

/** Interpolación lineal entre dos planos. */
export function mixShots(a: Shot, b: Shot, t: number): Shot {
  const k = Math.min(1, Math.max(0, t));
  return { scale: a.scale + (b.scale - a.scale) * k, x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k };
}
