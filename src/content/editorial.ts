import { photos, type Photo } from "./credits";

/** Fotografías del capítulo «La mesa». */
export const tablePhotos = {
  hero: photos.mesaTinto,
  /** Una por vino, en el orden de `story.table.pairings.items` */
  pairings: [photos.cocido, photos.blancoPescado],
  special: photos.mesaDos,
  small: photos.pinchos,
} satisfies Record<string, Photo | Photo[]>;

/** Galería de la página Rioja (además de las del recorrido). */
export const riojaGallery: Photo[] = [photos.briones, photos.elvillarSierra, photos.sanVicente, photos.elvillarPueblo, photos.elvillarHileras];
