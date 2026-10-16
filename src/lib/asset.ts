/** Prefija rutas de /public con el basePath (necesario en GitHub Pages con export estático). */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const asset = (path: string) => `${basePath}${path}`;
