/**
 * Fotografías de terceros con licencia libre verificada en Wikimedia Commons (16/10/2026).
 * Comprobado por archivo: licencia declarada, autor, obra propia o revisión de licencia superada,
 * sin plantillas de derechos de imagen ni de marca, sin personas identificables ni marcas de vino de terceros.
 * Las licencias CC BY y CC BY-SA exigen citar autor y licencia: se hace junto a cada foto y en /creditos/.
 * Regenerar los archivos: `python scripts/prepare_photos.py`.
 */
export type License = "CC0 1.0" | "CC BY-SA 3.0" | "CC BY-SA 4.0";

export type Photo = {
  id: string;
  src: string;
  srcSmall: string;
  width: number;
  height: number;
  alt: string;
  /** Lugar mostrado (solo cuando la fuente lo documenta) */
  place?: string;
  author: string;
  license: License;
  licenseUrl: string;
  sourceUrl: string;
  /** Cambios respecto al original (obligatorio indicarlo en CC BY-SA) */
  changes: string;
};

const commons = (file: string) => `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replace(/ /g, "_"))}`;
const BY_SA_4 = "https://creativecommons.org/licenses/by-sa/4.0/deed.es";
const BY_SA_3 = "https://creativecommons.org/licenses/by-sa/3.0/deed.es";
const CC0 = "https://creativecommons.org/publicdomain/zero/1.0/deed.es";
const RESIZED = "Redimensionada y convertida a WebP.";

const photo = (p: Omit<Photo, "src" | "srcSmall"> & { file: string }): Photo => {
  const { file: _file, ...rest } = p;
  return { ...rest, src: `/media/fotos/${p.id}.webp`, srcSmall: `/media/fotos/${p.id}-sm.webp` };
};

export const photos = {
  briones: photo({
    id: "briones",
    file: "Briones 02.jpg",
    width: 2400,
    height: 1281,
    alt: "El pueblo de Briones, con su iglesia en lo alto, rodeado de viñedos verdes y campos de cereal.",
    place: "Briones, La Rioja",
    author: "LBM1948",
    license: "CC BY-SA 4.0",
    licenseUrl: BY_SA_4,
    sourceUrl: commons("Briones 02.jpg"),
    changes: RESIZED,
  }),
  elvillarPueblo: photo({
    id: "elvillar-pueblo",
    file: "Viñedos en otoño, Elvillar 5.jpg",
    width: 2400,
    height: 1350,
    alt: "Elvillar en otoño: el pueblo y su iglesia tras un viñedo de hojas rojizas.",
    place: "Elvillar, Rioja Alavesa",
    author: "Mentxuwiki",
    license: "CC BY-SA 4.0",
    licenseUrl: BY_SA_4,
    sourceUrl: commons("Viñedos en otoño, Elvillar 5.jpg"),
    changes: RESIZED,
  }),
  elvillarHileras: photo({
    id: "elvillar-hileras",
    file: "Viñedos en otoño, Elvillar 6.jpg",
    width: 2400,
    height: 1350,
    alt: "Hileras de viñedo en otoño, con tonos rojos y dorados, bajo un cielo con nubes.",
    place: "Elvillar, Rioja Alavesa",
    author: "Mentxuwiki",
    license: "CC BY-SA 4.0",
    licenseUrl: BY_SA_4,
    sourceUrl: commons("Viñedos en otoño, Elvillar 6.jpg"),
    changes: RESIZED,
  }),
  elvillarSierra: photo({
    id: "elvillar-sierra",
    file: "Viñedos en otoño, Elvillar 4.jpg",
    width: 2400,
    height: 1350,
    alt: "Viñedo otoñal a los pies de la Sierra de Cantabria.",
    place: "Elvillar y Sierra de Cantabria, Rioja Alavesa",
    author: "Mentxuwiki",
    license: "CC BY-SA 4.0",
    licenseUrl: BY_SA_4,
    sourceUrl: commons("Viñedos en otoño, Elvillar 4.jpg"),
    changes: RESIZED,
  }),
  sanVicente: photo({
    id: "san-vicente",
    file: "San Vicente de la Sonsierra (2020) 3.jpg",
    width: 2400,
    height: 1600,
    alt: "Valle de viñedos en verano desde San Vicente de la Sonsierra, con la sierra al fondo.",
    place: "San Vicente de la Sonsierra, La Rioja",
    author: "Artistosteles",
    license: "CC BY-SA 4.0",
    licenseUrl: BY_SA_4,
    sourceUrl: commons("San Vicente de la Sonsierra (2020) 3.jpg"),
    changes: RESIZED,
  }),
  mesaFlores: photo({
    id: "mesa-flores",
    file: "Legant table setting with white floral centerpiece.jpg",
    width: 2400,
    height: 1121,
    alt: "Mesa vestida de blanco con cubertería, copas y un centro de flores blancas.",
    author: "Bhullargraphic",
    license: "CC BY-SA 4.0",
    licenseUrl: BY_SA_4,
    sourceUrl: commons("Legant table setting with white floral centerpiece.jpg"),
    changes: "Recortada (se elimina la parte superior del fondo), redimensionada y convertida a WebP.",
  }),
  mesaVelas: photo({
    id: "mesa-velas",
    file: "Pixella15317 (24030634680).jpg",
    width: 2400,
    height: 1600,
    alt: "Detalle de una mesa preparada: platos blancos, cubiertos y velas encendidas.",
    author: "Pixel.la Free Stock Photos",
    license: "CC0 1.0",
    licenseUrl: CC0,
    sourceUrl: commons("Pixella15317 (24030634680).jpg"),
    changes: RESIZED,
  }),
  pinchos: photo({
    id: "pinchos-laguardia",
    file: "Pinchos laguardia.jpg",
    width: 2272,
    height: 1704,
    alt: "Pinchos sobre una barra en Laguardia.",
    place: "Laguardia, Rioja Alavesa",
    author: "Ardo Beltz",
    license: "CC BY-SA 3.0",
    licenseUrl: BY_SA_3,
    sourceUrl: commons("Pinchos laguardia.jpg"),
    changes: RESIZED,
  }),
} satisfies Record<string, Photo>;

export const allPhotos: Photo[] = Object.values(photos);

/** Texto de atribución corto para pie de foto. */
export const attribution = (p: Photo) => `Foto: ${p.author} · ${p.license}`;
