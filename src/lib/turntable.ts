/**
 * Visor 360° a partir de fotografías reales de la botella sobre una base giratoria.
 * Cada fila es una altura de cámara; cada fila contiene una vuelta completa de fotos.
 */
import type { Turntable } from "@/content/types";

/** Fotograma (0…frames-1) correspondiente a una posición continua de giro, con vuelta completa. */
export function frameAt(position: number, frames: number): number {
  if (frames <= 0) return 0;
  const i = Math.round(position) % frames;
  return i < 0 ? i + frames : i;
}

/** Fila válida más próxima. */
export const clampRow = (row: number, rows: number) => Math.max(0, Math.min(rows - 1, Math.round(row)));

/** Ruta pública de un fotograma: `<dir>/f<fila>-<fotograma de 3 cifras>.webp`. */
export const framePath = (t: Turntable, row: number, frame: number) => `${t.dir}/f${row}-${String(frame).padStart(3, "0")}.webp`;

/** Orden de carga: primero la fila frontal (para poder girar cuanto antes) y luego las demás, de dentro afuera. */
export function loadOrder(t: Turntable): { row: number; frame: number }[] {
  const rows = [t.frontRow];
  for (let d = 1; rows.length < t.rows; d++) {
    if (t.frontRow - d >= 0) rows.push(t.frontRow - d);
    if (t.frontRow + d < t.rows) rows.push(t.frontRow + d);
  }
  return rows.flatMap((row) => Array.from({ length: t.frames }, (_, frame) => ({ row, frame })));
}

/** Fotogramas que avanza el giro por cada píxel arrastrado: una vuelta completa ≈ 1,5 anchos del visor. */
export const framesPerPixel = (frames: number, viewerWidth: number) => frames / Math.max(1, viewerWidth * 1.5);
