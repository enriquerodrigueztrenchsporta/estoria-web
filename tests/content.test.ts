import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import path from "node:path";
import { story } from "@/content/copy";
import { allPhotos } from "@/content/credits";
import { media } from "@/content/media";
import { site, stockists } from "@/content/site";
import { confirmedTechnical, wines } from "@/content/wines";

const publicDir = path.resolve(__dirname, "../public");
const appDir = path.resolve(__dirname, "../src/app");

describe("credibilidad del contenido", () => {
  it("no publica datos técnicos sin confirmar", () => {
    for (const w of wines) {
      const pendingKeys = Object.entries(w.technical).filter(([, f]) => f.status === "pending").length;
      expect(confirmedTechnical(w)).toHaveLength(Object.keys(w.technical).length - pendingKeys);
    }
  });

  it("no hay precios ni puntos de venta inventados", () => {
    for (const w of wines) expect(w.commerce.price.status).toBe("pending");
    expect(stockists).toEqual([]);
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

  it("todos los recursos propios existen", () => {
    for (const m of Object.values(media)) expect(existsSync(path.join(publicDir, m.src))).toBe(true);
  });
});

describe("fotografías de terceros", () => {
  it("cada foto tiene archivo, autor, licencia libre con enlace y fuente verificable", () => {
    for (const p of allPhotos) {
      expect(existsSync(path.join(publicDir, p.src)), p.src).toBe(true);
      expect(existsSync(path.join(publicDir, p.srcSmall)), p.srcSmall).toBe(true);
      expect(p.author.length).toBeGreaterThan(1);
      expect(["CC0 1.0", "CC BY-SA 3.0", "CC BY-SA 4.0"]).toContain(p.license);
      expect(p.licenseUrl).toMatch(/^https:\/\/creativecommons\.org\//);
      expect(p.sourceUrl).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
      expect(p.changes.length).toBeGreaterThan(5);
      expect(p.alt.length).toBeGreaterThan(10);
    }
  });
});

describe("estructura de páginas", () => {
  it("cada entrada de la navegación y de los textos legales tiene su página", () => {
    for (const { href } of [...site.nav, ...site.legalNav]) {
      const dir = href === "/" ? appDir : path.join(appDir, href.replace(/^\/|\/$/g, ""));
      expect(existsSync(path.join(dir, "page.tsx")), href).toBe(true);
    }
  });
});
