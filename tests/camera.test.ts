import { describe, expect, it } from "vitest";
import { UPSCALE_TOLERANCE, containSize, frame, maxScale } from "@/lib/camera";
import { media } from "@/content/media";
import { buildCameraStops, captionOpacity, shotAt } from "@/lib/timeline";

const label = media.tempranilloLabel;
const viewports = [
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
  { width: 2560, height: 1440 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
];

describe("cámara de la etiqueta", () => {
  it("containSize respeta la proporción y cabe en el viewport", () => {
    const s = containSize({ width: 1440, height: 900 }, label.width / label.height, 0.78);
    expect(s.width / s.height).toBeCloseTo(label.width / label.height, 5);
    expect(s.height).toBeLessThanOrEqual(900 * 0.78 + 1e-6);
  });

  it("frame centra la zona pedida", () => {
    const base = { width: 500, height: 625 };
    const shot = frame({ cx: 0.5, cy: 0.5, span: 0.5 }, base, { width: 1000, height: 800 }, 10);
    expect(shot.x).toBeCloseTo(0);
    expect(shot.y).toBeCloseTo(0);
    expect(shot.scale).toBeCloseTo((1000 * 0.9) / (0.5 * 500));
  });

  it.each(viewports)("ningún plano supera la resolución nativa de la etiqueta (%o)", (viewport) => {
    const base = containSize(viewport, label.width / label.height, viewport.width < 768 ? 0.92 : 0.78);
    const cap = maxScale(base.width, label.width);
    const stops = buildCameraStops(base, viewport, cap);
    for (let p = 0; p <= 1; p += 0.005) {
      const { scale } = shotAt(stops, p);
      // ancho en pantalla de la etiqueta / ancho nativo
      expect((base.width * scale) / label.width).toBeLessThanOrEqual(UPSCALE_TOLERANCE + 1e-9);
    }
  });

  it("el recorrido es continuo: sin saltos entre fotogramas cercanos", () => {
    const viewport = { width: 1440, height: 900 };
    const base = containSize(viewport, label.width / label.height, 0.78);
    const stops = buildCameraStops(base, viewport, maxScale(base.width, label.width));
    let prev = shotAt(stops, 0);
    for (let p = 0.001; p <= 1; p += 0.001) {
      const cur = shotAt(stops, p);
      expect(Math.abs(cur.x - prev.x)).toBeLessThan(40);
      expect(Math.abs(cur.y - prev.y)).toBeLessThan(40);
      expect(Math.abs(cur.scale - prev.scale)).toBeLessThan(0.05);
      prev = cur;
    }
  });

  it("los rótulos aparecen y desaparecen dentro de su ventana", () => {
    expect(captionOpacity(0.1, [0.2, 0.3])).toBe(0);
    expect(captionOpacity(0.25, [0.2, 0.3])).toBe(1);
    expect(captionOpacity(0.35, [0.2, 0.3])).toBe(0);
  });
});
