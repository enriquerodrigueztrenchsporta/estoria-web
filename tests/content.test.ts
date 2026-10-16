import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import path from "node:path";
import { story } from "@/content/copy";
import { media } from "@/content/media";
import { riojaPhotos, stockists } from "@/content/site";
import { confirmedTechnical, wines } from "@/content/wines";

const publicDir = path.resolve(__dirname, "../public");

describe("credibilidad del contenido", () => {
  it("no publica datos técnicos sin confirmar", () => {
    for (const w of wines) {
      const pendingKeys = Object.entries(w.technical).filter(([, f]) => f.status === "pending").length;
      expect(confirmedTechnical(w)).toHaveLength(Object.keys(w.technical).length - pendingKeys);
    }
  });

  it("no hay precios publicados sin confirmar", () => {
    for (const w of wines) expect(w.commerce.price.status).toBe("pending");
  });

  it("no hay puntos de venta ni fotos de Rioja ficticios por defecto", () => {
    expect(stockists).toEqual([]);
    expect(riojaPhotos).toEqual([]);
  });

  it("los textos no contienen afirmaciones prohibidas", () => {
    const all = JSON.stringify(story).toLowerCase();
    for (const word of ["premio", "medalla", "puntos parker", "generaciones", "nuestra bodega", "nuestros viñedos", "desde 18", "desde 19"]) {
      expect(all).not.toContain(word);
    }
  });

  it("solo el Tempranillo usa la etiqueta original; el Viura queda como provisional", () => {
    expect(wines.find((w) => w.slug === "tempranillo")?.labelStatus).toBe("definitiva");
    const viura = wines.find((w) => w.slug === "viura");
    expect(viura?.labelStatus).toBe("en-desarrollo");
    expect(viura?.label).toBeNull();
  });

  it("todos los recursos referenciados existen", () => {
    for (const m of Object.values(media)) expect(existsSync(path.join(publicDir, m.src))).toBe(true);
  });

  it("las zonas de la etiqueta están dentro de la imagen", () => {
    for (const w of wines)
      for (const r of w.labelRegions) {
        expect(r.cx).toBeGreaterThan(0);
        expect(r.cx).toBeLessThan(1);
        expect(r.cy).toBeGreaterThan(0);
        expect(r.cy).toBeLessThan(1);
        expect(r.span).toBeGreaterThan(0);
        expect(r.span).toBeLessThanOrEqual(1);
      }
  });
});
