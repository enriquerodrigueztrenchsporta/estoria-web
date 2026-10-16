import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import path from "node:path";
import { story } from "@/content/copy";
import type { Turntable } from "@/content/types";
import { wines } from "@/content/wines";
import { JOURNEY_SECONDS, music } from "@/lib/timeline";
import { clampRow, frameAt, framePath, loadOrder } from "@/lib/turntable";

const t: Turntable = { dir: "/media/giro/prueba", frames: 36, rows: 3, frontRow: 1, width: 800, height: 1600 };

describe("vista 360°", () => {
  it("el giro da la vuelta completa en ambos sentidos", () => {
    expect(frameAt(0, 36)).toBe(0);
    expect(frameAt(35.6, 36)).toBe(0);
    expect(frameAt(37, 36)).toBe(1);
    expect(frameAt(-1, 36)).toBe(35);
    expect(frameAt(-73, 36)).toBe(35);
  });

  it("la altura de cámara no se sale de las filas fotografiadas", () => {
    expect(clampRow(-2, 3)).toBe(0);
    expect(clampRow(5, 3)).toBe(2);
    expect(clampRow(1, 1)).toBe(0);
  });

  it("carga primero la fila frontal completa y luego todas las demás, sin repetir", () => {
    const order = loadOrder(t);
    expect(order).toHaveLength(108);
    expect(order.slice(0, 36).every((o) => o.row === 1)).toBe(true);
    expect(new Set(order.map((o) => `${o.row}-${o.frame}`)).size).toBe(108);
    expect(framePath(t, 2, 7)).toBe("/media/giro/prueba/f2-007.webp");
  });

  it("solo usa fotos reales: cada fotograma declarado existe", () => {
    const publicDir = path.resolve(__dirname, "../public");
    for (const w of wines) {
      if (!w.turntable) continue;
      for (const { row, frame } of loadOrder(w.turntable)) {
        expect(existsSync(path.join(publicDir, framePath(w.turntable, row, frame)))).toBe(true);
      }
    }
  });
});

describe("recorrido de inicio", () => {
  it("anuncia su duración real", () => {
    expect(story.hero.playHint(JOURNEY_SECONDS)).toContain(String(JOURNEY_SECONDS));
  });

  it("la música existe y dura lo mismo que el recorrido", () => {
    expect(JOURNEY_SECONDS).toBeGreaterThanOrEqual(15);
    expect(JOURNEY_SECONDS).toBeLessThanOrEqual(30);
    expect(existsSync(path.resolve(__dirname, "../public", music.audio.replace(/^\//, "")))).toBe(true);
  });
});
