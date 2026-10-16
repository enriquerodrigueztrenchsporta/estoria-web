/**
 * Fotografías de terceros con licencia libre verificada en Wikimedia Commons (16/10/2026).
 * Comprobado por archivo: licencia declarada, autor, obra propia o revisión de licencia superada,
 * o (fotos de Unsplash anteriores a junio de 2017) copia archivada de su publicación original con CC0,
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
  cocido: photo({
    id: "cocido",
    file: "Cocido.jpg",
    width: 2400,
    height: 1345,
    alt: "Plato de cocido: garbanzos, patata, verdura, carne, pollo y chorizo.",
    author: "Rubendene",
    license: "CC BY-SA 4.0",
    licenseUrl: BY_SA_4,
    sourceUrl: commons("Cocido.jpg"),
    changes: RESIZED,
  }),
  mesaTinto: photo({
    id: "mesa-tinto",
    file: "Outdoor wine dinner (Unsplash).jpg",
    width: 2400,
    height: 2728,
    alt: "Una copa de vino tinto sobre una mesa de madera en una terraza al atardecer.",
    author: "Serge Esteve",
    license: "CC0 1.0",
    licenseUrl: CC0,
    sourceUrl: commons("Outdoor wine dinner (Unsplash).jpg"),
    changes: "Recortada (se elimina el borde derecho), redimensionada y convertida a WebP.",
  }),
  blancoPescado: photo({
    id: "mesa-blanco-pescado",
    file: "Gourmet meal and white wine (Unsplash).jpg",
    width: 2400,
    height: 1600,
    alt: "Plato de pescado en una mesa compartida, con copas de vino blanco al fondo.",
    author: "Jay Wennington",
    license: "CC0 1.0",
    licenseUrl: CC0,
    sourceUrl: commons("Gourmet meal and white wine (Unsplash).jpg"),
    changes: RESIZED,
  }),
  mesaDos: photo({
    id: "mesa-dos",
    file: "Vintage wine dinner for two (Unsplash).jpg",
    width: 2400,
    height: 1600,
    alt: "Mesa de madera para dos con copas de vino blanco y tinto, dos platos y un ramo de flores silvestres.",
    author: "Stefan Johnson",
    license: "CC0 1.0",
    licenseUrl: CC0,
    sourceUrl: commons("Vintage wine dinner for two (Unsplash).jpg"),
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

/** Música y voz del recorrido «Ver la historia» (audio generado con scripts/prepare_narration.py). */
export const audioCredits = [
  {
    id: "musica",
    what: "Música: Erik Satie, Gymnopédie n.º 1 (1888)",
    detail: "Interpretación al piano de Teknopazzo. Obra y grabación en dominio público / CC0.",
    license: "CC0 1.0",
    licenseUrl: CC0,
    sourceUrl: commons("Gymnopedie No. 1..ogg"),
    sourceLabel: "Original en Wikimedia Commons",
    changes: "Fragmento de los primeros segundos, con fundidos, volumen reducido bajo la voz y conversión a MP3.",
  },
  {
    id: "voz",
    what: "Voz: síntesis de voz con Piper TTS, modelo es_ES «sharvard» (voz femenina)",
    detail: "Modelo entrenado con el Sharvard corpus (Universidad de Edimburgo; Aubanel, García Lecumberri y Cooke, 2014).",
    license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0/deed.es",
    sourceUrl: "https://huggingface.co/rhasspy/piper-voices/tree/main/es/es_ES/sharvard/medium",
    sourceLabel: "Modelo de voz",
    changes: "Texto propio de ESTORIA leído por la voz sintética y mezclado con la música.",
  },
] as const;
