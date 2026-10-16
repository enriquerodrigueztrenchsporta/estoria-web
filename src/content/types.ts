/**
 * Un dato que todavía no está confirmado por la marca.
 * Nunca se publica: los componentes solo muestran valores `confirmed`.
 */
export type Pending = { status: "pending"; note?: string };
export type Confirmed<T> = { status: "confirmed"; value: T };
export type Field<T> = Pending | Confirmed<T>;

export const pending = (note?: string): Pending => ({ status: "pending", note });
export const confirmed = <T,>(value: T): Confirmed<T> => ({ status: "confirmed", value });

export type Theme = {
  /** Fondo de la escena del vino */
  background: string;
  /** Color de texto principal sobre ese fondo */
  ink: string;
  /** Texto secundario sobre ese fondo (contraste AA) */
  muted: string;
  /** Acento cromático (detalles, filetes) */
  accent: string;
  /** Color de la luz que ilumina la botella */
  light: string;
  mode: "dark" | "light";
};

export type MediaAsset = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

/**
 * Vista 360° hecha con fotografías reales de la botella (base giratoria).
 * La genera `npm run turntable` en `src/content/turntables.json`. Ver docs/CONTENIDO.md.
 */
export type Turntable = {
  /** Carpeta pública de los fotogramas */
  dir: string;
  /** Fotos por vuelta completa */
  frames: number;
  /** Alturas de cámara (1 = solo giro horizontal) */
  rows: number;
  /** Fila con la cámara a la altura de la etiqueta */
  frontRow: number;
  width: number;
  height: number;
};

export type Commerce = {
  /** Preparado para venta directa futura. Sin precios inventados. */
  sku: Field<string>;
  price: Field<{ amount: number; currency: "EUR" }>;
  available: Field<boolean>;
};

export type TechnicalSheet = {
  vintage: Field<string>;
  ageing: Field<string>;
  alcohol: Field<string>;
  tastingNotes: Field<string>;
  pairing: Field<string>;
  servingTemperature: Field<string>;
  winemaking: Field<string>;
};

export type Wine = {
  slug: string;
  name: string;
  variety: string;
  type: "tinto" | "blanco";
  appellation: string;
  theme: Theme;
  bottle: MediaAsset | null;
  label: MediaAsset | null;
  /** Vista 360° con fotografías reales; `null` mientras no se hayan hecho las fotos */
  turntable: Turntable | null;
  /** "en-desarrollo": no existe etiqueta aprobada; se muestra una representación provisional rotulada */
  labelStatus: "definitiva" | "en-desarrollo";
  description: string;
  technical: TechnicalSheet;
  commerce: Commerce;
};
