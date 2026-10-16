import { pending, type Field } from "./types";

export const site = {
  name: "ESTORIA",
  tagline: "Hay historias que merecen ser compartidas.",
  description:
    "ESTORIA, vino de la Denominación de Origen Calificada Rioja. Tempranillo y Viura: el carácter de Rioja, en una historia para compartir.",
  locale: "es_ES",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  nav: [
    { href: "#historia", label: "La historia" },
    { href: "#vinos", label: "Nuestros vinos" },
    { href: "#rioja", label: "Rioja" },
    { href: "#contacto", label: "Contacto" },
  ],
  professionalLink: { href: "#profesionales", label: "Profesionales" },
};

/** Datos de contacto y legales. Pendientes hasta que la marca los confirme; no se publican. */
export const contactDetails: { email: Field<string>; phone: Field<string>; company: Field<string> } = {
  email: pending("Correo de contacto oficial"),
  phone: pending(),
  company: pending("Razón social y NIF del titular de la marca"),
};

/** Puntos de venta. Solo acuerdos reales. Vacío hasta que existan. */
export type Stockist = {
  name: string;
  city: string;
  kind: "restaurante" | "vinoteca" | "tienda" | "distribuidor";
  url?: string;
};
export const stockists: Stockist[] = [];

/**
 * Fotografías reales de Rioja para la escena 05.
 * Vacío = la escena usa encuadres del propio grabado.
 * Cada imagen debe ser de Rioja, verificable y con licencia (ver docs/CONTENIDO.md).
 */
export type LandscapePhoto = { src: string; width: number; height: number; alt: string; place: string; credit: string };
export const riojaPhotos: LandscapePhoto[] = [];
