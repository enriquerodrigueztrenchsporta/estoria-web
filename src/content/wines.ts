import { media } from "./media";
import turntableData from "./turntables.json";
import { pending, type TechnicalSheet, type Turntable, type Wine } from "./types";

/** Vistas 360° generadas por `npm run turntable` a partir de las fotos reales de cada botella. */
const turntables = turntableData as Record<string, Turntable>;

/**
 * Catálogo de ESTORIA. Para añadir un vino basta con añadir una entrada.
 * Los campos `pending()` NO se muestran en la web hasta pasarlos a `confirmed(...)`.
 * Ver docs/CONTENIDO.md.
 */
const emptySheet = (): TechnicalSheet => ({
  vintage: pending(),
  ageing: pending(),
  alcohol: pending(),
  tastingNotes: pending(),
  pairing: pending(),
  servingTemperature: pending(),
  winemaking: pending(),
});

export const wines: Wine[] = [
  {
    slug: "tempranillo",
    name: "ESTORIA",
    variety: "Tempranillo",
    type: "tinto",
    appellation: "DOCa Rioja",
    theme: { background: "#351D22", ink: "#F4EBDD", muted: "#D9C7B0", accent: "#C4A273", light: "#C9A27A", mode: "dark" },
    bottle: media.tempranilloBottle,
    label: media.tempranilloLabel,
    labelStatus: "definitiva",
    turntable: turntables.tempranillo ?? null,
    description: "Vino tinto de la Denominación de Origen Calificada Rioja, elaborado con Tempranillo.",
    technical: emptySheet(),
    commerce: { sku: pending(), price: pending(), available: pending() },
  },
  {
    slug: "viura",
    name: "ESTORIA",
    variety: "Viura",
    type: "blanco",
    appellation: "DOCa Rioja",
    theme: { background: "#FAF7F0", ink: "#24201D", muted: "#5E5248", accent: "#8E6F45", light: "#E9D6A8", mode: "light" },
    bottle: null,
    // Adaptación digital de la etiqueta del Tempranillo pedida por la marca (scripts/prepare_viura_label.py)
    label: media.viuraLabel,
    labelStatus: "definitiva",
    turntable: turntables.viura ?? null,
    description: "Vino blanco de la Denominación de Origen Calificada Rioja, elaborado con Viura.",
    technical: emptySheet(),
    commerce: { sku: pending(), price: pending(), available: pending() },
  },
];

export const getWine = (slug: string) => wines.find((w) => w.slug === slug);

/** Datos confirmados por la marca que se publican siempre: tipo, variedad y origen. */
export const publicFacts = (wine: Wine) => [
  { label: "Tipo", value: wine.type === "tinto" ? "Vino tinto" : "Vino blanco" },
  { label: "Variedad", value: wine.variety },
  { label: "Origen", value: wine.appellation },
];

const technicalLabels: Record<keyof TechnicalSheet, string> = {
  vintage: "Añada",
  ageing: "Crianza",
  alcohol: "Graduación",
  tastingNotes: "Notas de cata",
  pairing: "Maridaje",
  servingTemperature: "Temperatura de servicio",
  winemaking: "Elaboración",
};

/** Solo los datos técnicos confirmados. Los pendientes nunca se devuelven. */
export const confirmedTechnical = (wine: Wine) =>
  (Object.keys(wine.technical) as (keyof TechnicalSheet)[]).flatMap((key) => {
    const field = wine.technical[key];
    return field.status === "confirmed" ? [{ label: technicalLabels[key], value: field.value }] : [];
  });
