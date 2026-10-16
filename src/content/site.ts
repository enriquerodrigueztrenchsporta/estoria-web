import { photos, type Photo } from "./credits";
import { pending, type Field } from "./types";

export const site = {
  name: "ESTORIA",
  tagline: "Hay historias que merecen ser compartidas.",
  description:
    "ESTORIA, vino de la Denominación de Origen Calificada Rioja. Tempranillo y Viura: el carácter de Rioja, en una historia para compartir.",
  locale: "es_ES",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  nav: [
    { href: "/", label: "La historia" },
    { href: "/vinos/", label: "Nuestros vinos" },
    { href: "/rioja/", label: "Rioja" },
    { href: "/mesa/", label: "La mesa" },
    { href: "/contacto/", label: "Contacto" },
  ],
  legalNav: [
    { href: "/aviso-legal/", label: "Aviso legal" },
    { href: "/privacidad/", label: "Privacidad" },
    { href: "/cookies/", label: "Cookies" },
    { href: "/creditos/", label: "Créditos fotográficos" },
  ],
};

/**
 * Titular de la web (LSSI art. 10 y RGPD art. 13). Pendiente de que la marca lo facilite:
 * mientras sea `pending`, las páginas legales lo muestran como «pendiente de completar».
 */
export const owner: {
  company: Field<string>;
  taxId: Field<string>;
  address: Field<string>;
  email: Field<string>;
  phone: Field<string>;
  registry: Field<string>;
} = {
  company: pending("Razón social o nombre del titular"),
  taxId: pending("NIF / CIF"),
  address: pending("Domicilio"),
  email: pending("Correo electrónico de contacto"),
  phone: pending("Teléfono"),
  registry: pending("Datos de inscripción en el Registro Mercantil, si procede"),
};

/** Proveedor que recibirá los formularios (encargado del tratamiento). Pendiente de elegir. */
export const formProcessor: Field<{ name: string; country: string; url: string }> = pending("Servicio de envío de formularios");

/** Puntos de venta. Solo acuerdos reales. Vacío hasta que existan. */
export type Stockist = {
  name: string;
  city: string;
  kind: "restaurante" | "vinoteca" | "tienda" | "distribuidor";
  url?: string;
};
export const stockists: Stockist[] = [];

/** Fotografías de Rioja para el recorrido (escena V), en orden de aparición. */
export const riojaPhotos: Photo[] = [photos.briones, photos.elvillarPueblo, photos.elvillarHileras];
