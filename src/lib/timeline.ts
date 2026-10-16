/**
 * Guion temporal del recorrido cinematográfico, en fracciones de su duración (0–1).
 * El recorrido no depende del scroll: solo se reproduce si el visitante lo pide.
 * Un único eje de tiempo para todas las capas: avanzar y retroceder es siempre continuo.
 * La cámara va de la botella directamente al grabado (sin recorrer los textos de la etiqueta).
 */
import { frame, mixShots, type Framing, type Shot, type Size } from "./camera";

/** Duración total del recorrido, en segundos. */
export const JOURNEY_SECONDS = 20;

export const SCENES = [
  { id: "revelacion", numeral: "I", title: "La revelación", start: 0 },
  { id: "aproximacion", numeral: "II", title: "Aproximación", start: 0.08 },
  { id: "grabado", numeral: "III", title: "El origen", start: 0.28 },
  { id: "rioja", numeral: "IV", title: "Rioja", start: 0.55 },
  { id: "regreso", numeral: "V", title: "El regreso", start: 0.86 },
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
  bottleOut: [0.19, 0.25] as Window,
  labelIn: [0.18, 0.24] as Window,
  paperOut: [0.25, 0.32] as Window,
  nearOut: [0.42, 0.5] as Window,
  photosIn: [0.47, 0.56] as Window,
  engravingOut: [0.84, 0.89] as Window,
  returnIn: [0.86, 0.93] as Window,
  originCaptions: [
    [0.31, 0.405],
    [0.405, 0.5],
  ] as const,
  riojaCaptions: [
    [0.555, 0.655],
    [0.655, 0.755],
    [0.755, 0.86],
  ] as const,
};

/** Escala de la etiqueta en el instante del fundido desde la fotografía de la botella. */
export const ENTRY_SCALE = 1.6;

/** Encuadres de cámara sobre la etiqueta. */
const FRAMINGS = {
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
  const f = (k: keyof typeof FRAMINGS) => {
    const fr = FRAMINGS[k];
    return frame({ ...fr, span: portrait ? fr.span * 0.55 : fr.span }, base, viewport, cap);
  };
  const entry = Math.min(ENTRY_SCALE, cap);
  return [
    { at: 0.18, shot: { scale: entry, x: 0, y: 0 } },
    { at: 0.24, shot: { scale: Math.min(entry * 1.02, cap), x: 0, y: 0 } },
    { at: 0.33, shot: f("grabado") },
    { at: 0.4, shot: f("grabado") },
    { at: 0.5, shot: f("pueblo") },
    { at: 0.56, shot: f("panInicio") },
    { at: 0.84, shot: f("panFin") },
    { at: 0.9, shot: f("salida") },
  ];
}

/** Curva suave (smoothstep) para que cada movimiento de cámara arranque y frene con naturalidad. */
export const ease = (t: number) => t * t * (3 - 2 * t);

/** Plano de cámara en el progreso `p`: interpolación suave entre paradas, constante fuera del rango. */
export function shotAt(stops: Stop[], p: number): Shot {
  const first = stops[0];
  const last = stops[stops.length - 1];
  if (!first || !last) return { scale: 1, x: 0, y: 0 };
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
