"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { Turntable } from "@/content/types";
import { asset } from "@/lib/asset";
import { clampRow, frameAt, framePath, framesPerPixel, loadOrder } from "@/lib/turntable";

type Props = {
  turntable: Turntable;
  /** Texto alternativo de la botella */
  alt: string;
  onReady?: () => void;
};

/** Píxeles de arrastre vertical para pasar a la siguiente altura de cámara. */
const ROW_PIXELS = 70;
/** Giro automático lento (fotogramas por segundo) hasta que el visitante toca la botella. */
const IDLE_SPEED = 6;

/**
 * Vista 360° con fotografías reales: cada fotograma es una foto de la botella.
 * Arrastrar en horizontal gira la botella; en vertical cambia la altura de cámara (si hay varias filas).
 */
export function TurntableViewer({ turntable: t, alt, onReady }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const images = useRef<Map<string, HTMLImageElement>>(new Map());
  const state = useRef({ pos: 0, row: t.frontRow, vel: 0, dragging: false, touched: false, lastX: 0, lastY: 0, accY: 0 });
  const [loaded, setLoaded] = useState(0);
  const [frontReady, setFrontReady] = useState(false);
  const shown = useRef("");

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const s = state.current;
    const key = `${s.row}-${frameAt(s.pos, t.frames)}`;
    if (key === shown.current) return;
    // Si la foto de esa altura aún no está, se muestra la de la fila frontal
    const img = images.current.get(key) ?? images.current.get(`${t.frontRow}-${frameAt(s.pos, t.frames)}`);
    if (!img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    shown.current = images.current.has(key) ? key : "";
  }, [t.frames, t.frontRow]);

  // Carga progresiva de los fotogramas
  useEffect(() => {
    let cancelled = false;
    const order = loadOrder(t);
    const frontCount = t.frames;
    let done = 0;
    let i = 0;
    const next = () => {
      if (cancelled || i >= order.length) return;
      const { row, frame } = order[i++]!;
      const img = new Image();
      img.decoding = "async";
      img.src = asset(framePath(t, row, frame));
      const finish = () => {
        if (cancelled) return;
        if (img.naturalWidth) images.current.set(`${row}-${frame}`, img);
        done++;
        setLoaded(done);
        if (done === frontCount) setFrontReady(true);
        shown.current = "";
        draw();
        next();
      };
      img.onload = finish;
      img.onerror = finish;
    };
    // Seis descargas en paralelo
    for (let k = 0; k < 6; k++) next();
    return () => {
      cancelled = true;
    };
  }, [t, draw]);

  useEffect(() => {
    if (frontReady) onReady?.();
  }, [frontReady, onReady]);

  // Bucle de animación: inercia y giro automático
  useEffect(() => {
    if (!frontReady) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const s = state.current;
      if (!s.dragging) {
        if (!s.touched) s.pos += IDLE_SPEED * dt;
        else if (Math.abs(s.vel) > 0.05) {
          s.pos += s.vel * dt;
          s.vel *= Math.pow(0.04, dt);
        } else s.vel = 0;
      }
      draw();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [frontReady, draw]);

  const onPointerDown = (e: PointerEvent<HTMLCanvasElement>) => {
    const s = state.current;
    s.dragging = true;
    s.touched = true;
    s.vel = 0;
    s.lastX = e.clientX;
    s.lastY = e.clientY;
    s.accY = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: PointerEvent<HTMLCanvasElement>) => {
    const s = state.current;
    if (!s.dragging) return;
    const width = e.currentTarget.clientWidth;
    const dx = e.clientX - s.lastX;
    const dy = e.clientY - s.lastY;
    s.lastX = e.clientX;
    s.lastY = e.clientY;
    // Arrastrar hacia la derecha gira la botella hacia la derecha
    const df = -dx * framesPerPixel(t.frames, width);
    s.pos += df;
    s.vel = s.vel * 0.6 + (df / (1 / 60)) * 0.4;
    if (t.rows > 1) {
      s.accY += dy;
      if (Math.abs(s.accY) >= ROW_PIXELS) {
        // Arrastrar hacia abajo baja la cámara (se ve la botella más desde abajo)
        s.row = clampRow(s.row - Math.sign(s.accY), t.rows);
        s.accY = 0;
      }
    }
  };
  const onPointerUp = () => {
    state.current.dragging = false;
  };

  const onKeyDown = (e: KeyboardEvent<HTMLCanvasElement>) => {
    const s = state.current;
    const moves: Record<string, () => void> = {
      ArrowLeft: () => (s.pos += 1),
      ArrowRight: () => (s.pos -= 1),
      ArrowUp: () => (s.row = clampRow(s.row + 1, t.rows)),
      ArrowDown: () => (s.row = clampRow(s.row - 1, t.rows)),
      Home: () => {
        s.pos = 0;
        s.row = t.frontRow;
      },
    };
    const move = moves[e.key];
    if (!move) return;
    e.preventDefault();
    s.touched = true;
    s.vel = 0;
    move();
  };

  return (
    <div className="relative h-full w-full">
      <canvas
        ref={canvasRef}
        width={t.width}
        height={t.height}
        role="img"
        tabIndex={0}
        aria-label={`${alt}. Vista de 360 grados con fotografías reales: usa las flechas para girarla.`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
        className="mx-auto h-full w-auto max-w-full cursor-grab touch-none select-none object-contain outline-none focus-visible:ring-1 focus-visible:ring-current/50 active:cursor-grabbing"
      />
      {!frontReady && (
        <p className="eyebrow absolute inset-x-0 bottom-4 text-center opacity-70" aria-live="polite">
          Cargando vista 360° · {Math.round((Math.min(loaded, t.frames) / t.frames) * 100)} %
        </p>
      )}
    </div>
  );
}
