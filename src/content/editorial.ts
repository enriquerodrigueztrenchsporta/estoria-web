/**
 * Fotografía editorial. `src: null` = fotografía pendiente: se muestra un marco provisional rotulado
 * con el encargo fotográfico (brief). Al añadir `src`, la imagen sustituye al marco.
 */
export type EditorialPhoto = {
  id: string;
  src: string | null;
  width?: number;
  height?: number;
  alt: string;
  brief: string;
};

export const tablePhotos: EditorialPhoto[] = [
  {
    id: "mesa",
    src: null,
    alt: "Mesa preparada para una comida compartida.",
    brief: "Mesa larga preparada, mantel de lino, luz natural lateral de tarde. Botella ESTORIA presente, sin protagonismo excesivo.",
  },
  {
    id: "detalle",
    src: null,
    alt: "Detalle gastronómico junto a una copa de vino tinto.",
    brief: "Detalle gastronómico de cocina riojana o mediterránea. Una copa servida con moderación.",
  },
  {
    id: "sobremesa",
    src: null,
    alt: "Sobremesa en un restaurante de luz cálida.",
    brief: "Sobremesa en un restaurante cálido: manos, conversación, copas a medio servir. Sin rostros identificables sin cesión de derechos.",
  },
];

export const palette = [
  { name: "Pergamino", hex: "#F4EBDD", use: "Fondos editoriales" },
  { name: "Marfil", hex: "#FAF7F0", use: "Espacios claros" },
  { name: "Borgoña", hex: "#622C32", use: "Identidad del tinto" },
  { name: "Vino profundo", hex: "#351D22", use: "Escenas cinematográficas" },
  { name: "Negro tinta", hex: "#24201D", use: "Tipografía" },
  { name: "Oro envejecido", hex: "#AC8958", use: "Detalles" },
  { name: "Sepia", hex: "#846B53", use: "Ilustración" },
  { name: "Verde viñedo", hex: "#454C3F", use: "Acentos naturales" },
] as const;
