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
 * Representación 3D de la botella. La forma, el vidrio y la cápsula son ilustrativos:
 * solo la etiqueta procede del archivo original.
 */
export type Bottle3D = {
  /** Color del vidrio */
  glass: string;
  /** Vidrio translúcido (deja ver el vino) u opaco */
  translucent: boolean;
  /** Color del vino visible a través del vidrio (si es translúcido) */
  wine?: string;
  capsule: string;
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
  bottle3d: Bottle3D;
  /** "en-desarrollo": no existe etiqueta aprobada; se muestra una representación provisional rotulada */
  labelStatus: "definitiva" | "en-desarrollo";
  description: string;
  technical: TechnicalSheet;
  commerce: Commerce;
};
