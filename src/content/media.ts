import type { MediaAsset } from "./types";

/** Recursos auténticos de ESTORIA (generados con `npm run assets` desde source-assets/). */
export const media = {
  tempranilloLabel: {
    src: "/media/etiqueta-tempranillo.webp",
    width: 1122,
    height: 1402,
    alt: "Etiqueta original de ESTORIA Tempranillo: RIOJA, Denominación de Origen Calificada, un ornamento dorado, el nombre ESTORIA y un grabado de un pueblo con iglesia entre montañas y viñedos.",
  },
  tempranilloLabelSmall: {
    src: "/media/etiqueta-tempranillo-sm.webp",
    width: 561,
    height: 701,
    alt: "Etiqueta original de ESTORIA Tempranillo.",
  },
  tempranilloBottle: {
    src: "/media/botella-tempranillo.webp",
    width: 921,
    height: 1298,
    alt: "Botella de ESTORIA Tempranillo sobre piedra, con la etiqueta de papel pergamino iluminada por una luz cálida lateral.",
  },
} satisfies Record<string, MediaAsset>;

/**
 * Posición de la etiqueta dentro de la fotografía de la botella (fracciones de la foto).
 * Permite encadenar la foto con la etiqueta en alta resolución sin saltos.
 */
export const bottleLabelBox = { left: 0.097, right: 0.873, top: 0.084, bottom: 0.876 } as const;

/** Bandas del grabado dentro de la etiqueta (fracciones verticales de la etiqueta). */
export const engravingBands = {
  /** Cielo y montañas */
  far: { top: 0.38, bottom: 0.56 },
  /** Pueblo e iglesia */
  mid: { top: 0.386, bottom: 0.65 },
  /** Viñedos en primer plano */
  near: { top: 0.6, bottom: 0.815 },
} as const;

/** Centro del grabado (para encuadres de cámara). */
export const engravingCenter = { cx: 0.5, cy: 0.6 } as const;
