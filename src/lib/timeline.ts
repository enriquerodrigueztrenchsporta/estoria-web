/**
 * Guion temporal del recorrido cinematográfico, en fracciones del progreso de scroll (0–1).
 * Un único eje de tiempo para todas las capas: avanzar y retroceder es siempre continuo.
 */
import { frame, mixShots, wideShot, type Framing, type Shot, type Size } from "./camera";

export const SCENES = [
  { id: "revelacion", numeral: "I", title: "La revelación", start: 0 },
  { id: "aproximacion", numeral: "II", title: "Aproximación", start: 0.08 },
  { id: "etiqueta", numeral: "III", title: "La etiqueta", start: 0.22 },
  { id: "grabado", numeral: "IV", title: "El grabado", start: 0.5 },
  { id: "rioja", numeral: "V", title: "Rioja", start: 0.71 },
  { id: "regreso", numeral: "VI", title: "El regreso", start: 0.88 },
] as const;

export const sceneAt = (p: number) => {
  let current: (typeof SCENES)[number] = SCENES[0];
  for (const s of SCENES) if (p >= s.start) current = s;
  return current;
};

type Window = [number, number];

/** Ventanas de tiempo de cada capa. */
export const T = {
  heroText: [0.03, 0.08] as Window,
  bottleZoom: [0, 0.2] as Window,
  bottleOut: [0.155, 0.2] as Window,
  labelIn: [0.15, 0.19] as Window,
  paperOut: [0.52, 0.58] as Window,
  nearOut: [0.6, 0.67] as Window,
  engravingOut: [0.86, 0.91] as Window,
  returnIn: [0.88, 0.95] as Window,
  /** Rótulos de la escena de la etiqueta */
  labelCaptions: [
    [0.265, 0.335],
    [0.345, 0.415],
    [0.425, 0.495],
  ] as const,
  originCaptions: [
    [0.555, 0.63],
    [0.635, 0.7],
  ] as const,
  riojaCaptions: [
    [0.72, 0.775],
    [0.775, 0.83],
    [0.83, 0.885],
  ] as const,
};

/** Encuadres de cámara sobre la etiqueta. */
const FRAMINGS = {
  rioja: { cx: 0.5, cy: 0.1, span: 0.72 },
  nombre: { cx: 0.5, cy: 0.305, span: 0.86 },
  detalle: { cx: 0.62, cy: 0.5, span: 0.36 },
  grabado: { cx: 0.5, cy: 0.53, span: 0.96 },
  pueblo: { cx: 0.56, cy: 0.47, span: 0.72 },
  panInicio: { cx: 0.32, cy: 0.52, span: 0.58 },
  panFin: { cx: 0.7, cy: 0.52, span: 0.58 },
  salida: { cx: 0.5, cy: 0.56, span: 0.9 },
} satisfies Record<string, Framing>;

export type Stop = { at: number; shot: Shot };

export function buildCameraStops(base: Size, viewport: Size, cap: number): Stop[] {
  // En pantallas verticales el paisaje se encuadra más cerrado para que no quede como una franja
  const portrait = viewport.width < viewport.height;
  const landscapeShots = new Set<keyof typeof FRAMINGS>(["grabado", "pueblo", "panInicio", "panFin", "salida"]);
  const f = (k: keyof typeof FRAMINGS) => {
    const fr = FRAMINGS[k];
    const span = portrait && landscapeShots.has(k) ? fr.span * 0.55 : fr.span;
    return frame({ ...fr, span }, base, viewport, cap);
  };
  return [
    { at: 0.15, shot: wideShot },
    { at: 0.21, shot: { ...wideShot, scale: 1.04 } },
    { at: 0.275, shot: f("rioja") },
    { at: 0.32, shot: f("rioja") },
    { at: 0.355, shot: f("nombre") },
    { at: 0.4, shot: f("nombre") },
    { at: 0.435, shot: f("detalle") },
    { at: 0.48, shot: f("detalle") },
    { at: 0.545, shot: f("grabado") },
    { at: 0.58, shot: f("grabado") },
    { at: 0.68, shot: f("pueblo") },
    { at: 0.73, shot: f("panInicio") },
    { at: 0.87, shot: f("panFin") },
    { at: 0.92, shot: f("salida") },
  ];
}

/** Curva suave (smoothstep) para que cada movimiento de cámara arranque y frene con naturalidad. */
export const ease = (t: number) => t * t * (3 - 2 * t);

/** Plano de cámara en el progreso `p`: interpolación suave entre paradas, constante fuera del rango. */
export function shotAt(stops: Stop[], p: number): Shot {
  const first = stops[0];
  const last = stops[stops.length - 1];
  if (!first || !last) return wideShot;
  if (p <= first.at) return first.shot;
  if (p >= last.at) return last.shot;
  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i]!;
    const b = stops[i + 1]!;
    if (p >= a.at && p <= b.at) {
      const t = b.at === a.at ? 1 : (p - a.at) / (b.at - a.at);
      return mixShots(a.shot, b.shot, ease(t));
    }
  }
  return last.shot;
}

/** Opacidad de un rótulo: entra y sale con un fundido del 20 % de su ventana. */
export function captionOpacity(p: number, [start, end]: readonly [number, number]): number {
  const fade = (end - start) * 0.2;
  if (p <= start || p >= end) return 0;
  if (p < start + fade) return (p - start) / fade;
  if (p > end - fade) return (end - p) / fade;
  return 1;
}
