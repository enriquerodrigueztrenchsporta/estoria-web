"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { story } from "@/content/copy";
import { wines } from "@/content/wines";
import { asset } from "@/lib/asset";
import { maxScale } from "@/lib/camera";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * "Descubre cada detalle": exploración 2.5D de la etiqueta original.
 * La ampliación está limitada por la resolución real del archivo para no pixelar.
 */
export function LabelExplorer() {
  const explorable = wines.filter((w) => w.label && w.labelRegions.length > 0);
  const pendingLabels = wines.filter((w) => w.labelStatus === "en-desarrollo");
  const [wineSlug, setWineSlug] = useState(explorable[0]?.slug ?? "");
  const wine = explorable.find((w) => w.slug === wineSlug) ?? explorable[0];
  const [active, setActive] = useState<string | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [frameWidth, setFrameWidth] = useState(480);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => entry && setFrameWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  if (!wine || !wine.label) return null;
  const label = wine.label;
  const regions = wine.labelRegions;
  const region = regions.find((r) => r.id === active) ?? null;
  const cap = maxScale(frameWidth, label.width);
  const scale = region ? Math.min(1 / region.span, cap) : 1;
  const tx = region ? (0.5 - region.cx) * 100 : 0;
  const ty = region ? (0.5 - region.cy) * 100 : 0;

  const step = (dir: 1 | -1) => {
    const i = regions.findIndex((r) => r.id === active);
    const next = regions[(i + dir + regions.length) % regions.length];
    if (next) setActive(next.id);
  };

  return (
    <section id="detalle" aria-labelledby="detalle-title" data-tone="light" className="relative bg-marfil py-28 md:py-40">
      <div className="container-editorial grid items-center gap-14 md:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] md:gap-20">
        <div className="md:order-2">
          <p className="eyebrow text-sepia-oscuro">{story.explorer.eyebrow}</p>
          <h2 id="detalle-title" className="display mt-5 text-[clamp(2.5rem,5vw,4.5rem)]">
            {story.explorer.title}
          </h2>
          <p className="mt-6 max-w-[40ch] leading-relaxed text-sepia-oscuro">
            Selecciona un punto para acercarte a la etiqueta original de ESTORIA {wine.variety}.
          </p>

          {explorable.length > 1 && (
            <div className="mt-8 flex gap-3" role="group" aria-label="Vino">
              {explorable.map((w) => (
                <button
                  key={w.slug}
                  type="button"
                  aria-pressed={w.slug === wine.slug}
                  onClick={() => {
                    setWineSlug(w.slug);
                    setActive(null);
                  }}
                  className="eyebrow border border-tinta/25 px-4 py-2 aria-pressed:bg-tinta aria-pressed:text-marfil"
                >
                  {w.variety}
                </button>
              ))}
            </div>
          )}

          <ol className="mt-10 border-t border-tinta/15">
            {regions.map((r) => {
              const on = r.id === active;
              return (
                <li key={r.id} className="border-b border-tinta/15">
                  <button
                    type="button"
                    aria-pressed={on}
                    aria-controls="detalle-visor"
                    onClick={() => setActive(on ? null : r.id)}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowDown") {
                        e.preventDefault();
                        (e.currentTarget.parentElement?.nextElementSibling?.querySelector("button") as HTMLButtonElement | null)?.focus();
                      } else if (e.key === "ArrowUp") {
                        e.preventDefault();
                        (e.currentTarget.parentElement?.previousElementSibling?.querySelector("button") as HTMLButtonElement | null)?.focus();
                      }
                    }}
                    className="group flex w-full items-baseline gap-5 py-4 text-left"
                  >
                    <span className={`eyebrow tabular-nums transition-colors ${on ? "text-borgona" : "text-sepia-oscuro"}`}>{r.index}</span>
                    <span className="flex-1">
                      <span className={`display block text-2xl transition-colors md:text-[1.7rem] ${on ? "text-borgona" : "group-hover:text-borgona"}`}>
                        {r.title}
                      </span>
                      <AnimatePresence initial={false}>
                        {on && (
                          <motion.span
                            className="block overflow-hidden text-sm leading-relaxed text-sepia-oscuro"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.5, ease: EASE }}
                          >
                            <span className="block pt-2">{r.caption}</span>
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </span>
                    <span aria-hidden className={`h-px bg-current transition-all duration-500 ${on ? "w-10 text-borgona" : "w-4 text-tinta/40"}`} />
                  </button>
                </li>
              );
            })}
          </ol>

          {pendingLabels.length > 0 && (
            <p className="mt-6 text-sm text-sepia-oscuro">
              {pendingLabels.map((w) => w.variety).join(", ")}: etiqueta en desarrollo, se añadirá cuando esté aprobada.
            </p>
          )}
        </div>

        {/* Visor */}
        <div className="md:order-1">
          <div
            ref={frameRef}
            id="detalle-visor"
            aria-live="polite"
            className="relative mx-auto aspect-[1122/1402] w-full max-w-[min(100%,calc(78svh*0.8))] overflow-hidden bg-papel shadow-[0_50px_100px_-60px_rgba(36,32,29,0.55)]"
          >
            <motion.div
              className="absolute inset-0"
              animate={{ scale, x: `${tx * scale}%`, y: `${ty * scale}%` }}
              transition={{ duration: 1.2, ease: EASE }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(label.src)} alt={label.alt} loading="lazy" decoding="async" className="h-full w-full" draggable={false} />
            </motion.div>

            {/* Puntos interactivos discretos (solo en vista completa) */}
            <AnimatePresence>
              {!region &&
                regions.map((r, i) => (
                  <motion.button
                    key={r.id}
                    type="button"
                    tabIndex={-1}
                    aria-hidden
                    onClick={() => setActive(r.id)}
                    className="group absolute flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
                    style={{ left: `${r.cx * 100}%`, top: `${r.cy * 100}%` }}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={{ delay: 0.4 + i * 0.06, duration: 0.5 }}
                  >
                    <span className="absolute inset-0 animate-ping rounded-full bg-oro/30 [animation-duration:2.8s]" />
                    <span className="relative flex h-7 w-7 items-center justify-center rounded-full border border-oro bg-marfil/90 font-sans text-[0.625rem] font-medium text-tinta transition-transform group-hover:scale-110">
                      {r.index}
                    </span>
                  </motion.button>
                ))}
            </AnimatePresence>

            <p className="sr-only">{region ? `Ampliado: ${region.title}. ${region.caption}` : "Vista completa de la etiqueta."}</p>
          </div>

          <div className="mx-auto mt-6 flex max-w-[min(100%,calc(78svh*0.8))] items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setActive(null)}
              disabled={!region}
              className="eyebrow flex h-11 items-center gap-3 text-tinta transition-opacity disabled:opacity-35"
            >
              <span aria-hidden className="block h-3 w-3 border border-current" />
              Vista completa
            </button>
            <div className="flex gap-2">
              <button type="button" onClick={() => step(-1)} aria-label="Detalle anterior" className="flex h-11 w-11 items-center justify-center border border-tinta/25 hover:bg-tinta hover:text-marfil">
                <span aria-hidden>←</span>
              </button>
              <button type="button" onClick={() => step(1)} aria-label="Detalle siguiente" className="flex h-11 w-11 items-center justify-center border border-tinta/25 hover:bg-tinta hover:text-marfil">
                <span aria-hidden>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
