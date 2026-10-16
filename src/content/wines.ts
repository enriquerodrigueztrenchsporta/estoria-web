import { media } from "./media";
import { pending, type TechnicalSheet, type Wine } from "./types";

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
    labelRegions: [
      { id: "nombre", index: "01", title: "El nombre", caption: "ESTORIA, compuesto en una serif clásica de remates finos y perfil dorado.", cx: 0.5, cy: 0.305, span: 0.84 },
      { id: "rioja", index: "02", title: "Rioja", caption: "La mención a la Denominación de Origen Calificada, en lo alto de la etiqueta.", cx: 0.5, cy: 0.1, span: 0.72 },
      { id: "grabado", index: "03", title: "El grabado", caption: "Un pueblo con su iglesia, montañas al fondo y viñedos en primer plano.", cx: 0.5, cy: 0.585, span: 0.62 },
      { id: "variedad", index: "04", title: "La variedad", caption: "Tempranillo, en rojo vino, tal como aparece impreso.", cx: 0.5, cy: 0.86, span: 0.62 },
      { id: "presentacion", index: "05", title: "La presentación", caption: "Papel de textura pergamino, filetes dorados y un borde troquelado irregular.", cx: 0.2, cy: 0.9, span: 0.4 },
    ],
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
    label: null,
    labelStatus: "en-desarrollo",
    labelRegions: [],
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
