"use client";

import { useEffect, useState } from "react";
import type { Size } from "./camera";

const SSR_VIEWPORT: Size = { width: 1440, height: 900 };

/** Tamaño del viewport (en SSR usa un escritorio de referencia). */
export function useViewport(): Size {
  const [size, setSize] = useState<Size>(SSR_VIEWPORT);
  useEffect(() => {
    let raf = 0;
    const read = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        // innerHeight estable en móvil: se ignoran los cambios de la barra del navegador < 120px
        setSize((prev) => {
          const width = window.innerWidth;
          const height = window.innerHeight;
          if (prev.width === width && Math.abs(prev.height - height) < 120 && prev !== SSR_VIEWPORT) return prev;
          return { width, height };
        });
      });
    };
    read();
    window.addEventListener("resize", read);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", read);
    };
  }, []);
  return size;
}

/** Preferencia de movimiento reducido. Empieza en `false` para evitar desajustes de hidratación. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}
