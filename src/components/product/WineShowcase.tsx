"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { story } from "@/content/copy";
import { publicFacts, wines } from "@/content/wines";
import type { Wine } from "@/content/types";
import { asset } from "@/lib/asset";
import { WineSheet } from "./WineSheet";
import { ProvisionalLabel } from "./ProvisionalLabel";
import { TurntableViewer } from "./TurntableViewer";

const EASE = [0.22, 1, 0.36, 1] as const;

export function WineShowcase() {
  const [index, setIndex] = useState(0);
  const wine = wines[index]!;
  const tabsId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);

  const select = (i: number, focus = false) => {
    const next = (i + wines.length) % wines.length;
    setIndex(next);
    if (focus) tabRefs.current[next]?.focus();
  };

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const keys: Record<string, number> = { ArrowRight: index + 1, ArrowDown: index + 1, ArrowLeft: index - 1, ArrowUp: index - 1, Home: 0, End: wines.length - 1 };
    if (e.key in keys) {
      e.preventDefault();
      select(keys[e.key]!, true);
    }
  };

  const t = wine.theme;

  return (
    <motion.section
      aria-labelledby="vinos-title"
      data-tone={t.mode}
      className="relative overflow-hidden"
      animate={{ backgroundColor: t.background, color: t.ink }}
      transition={{ duration: 1.1, ease: EASE }}
    >
      {/* Luz lateral cálida de la escena */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        animate={{
          background:
            t.mode === "dark"
              ? "radial-gradient(ellipse 60% 80% at 25% 45%, rgba(201,162,122,0.22), transparent 70%)"
              : "radial-gradient(ellipse 60% 80% at 25% 45%, rgba(233,214,168,0.6), transparent 70%)",
        }}
        transition={{ duration: 1.1 }}
      />

      <div className="relative grid min-h-svh items-center gap-8 px-[var(--gutter)] pb-16 pt-[calc(var(--header-h)+2rem)] md:grid-cols-[1.1fr_1fr] md:gap-16 md:pb-20">
        {/* Escenario de la botella (solo fotografía real) */}
        <div className="relative">
          <div className="relative mx-auto h-[62svh] max-w-[34rem] md:h-[78svh]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={wine.slug}
                className="absolute inset-0"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                <BottleStage wine={wine} />
              </motion.div>
            </AnimatePresence>
          </div>
          {wine.turntable && (
            <p className="eyebrow mt-4 text-center" style={{ color: t.muted }}>
              {story.collection.viewerHint}
            </p>
          )}
        </div>

        {/* Contenido */}
        <div className="relative">
          <p className="eyebrow" style={{ color: t.muted }}>
            {story.collection.eyebrow}
          </p>
          <h1 id="vinos-title" className="display mt-4 max-w-[14ch] text-[clamp(2.25rem,4.5vw,4rem)]">
            {story.collection.title}
          </h1>

          <div role="tablist" aria-label="Vinos ESTORIA" className="mt-10 flex gap-8 border-b border-current/20">
            {wines.map((w, i) => {
              const active = i === index;
              return (
                <button
                  key={w.slug}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  role="tab"
                  id={`${tabsId}-tab-${w.slug}`}
                  aria-selected={active}
                  aria-controls={`${tabsId}-panel`}
                  tabIndex={active ? 0 : -1}
                  onClick={() => select(i)}
                  onKeyDown={onTabKey}
                  className={`relative -mb-px flex items-baseline gap-3 pb-4 transition-opacity duration-500 ${active ? "opacity-100" : "opacity-55 hover:opacity-85"}`}
                >
                  <span className="eyebrow">{String(i + 1).padStart(2, "0")}</span>
                  <span className="display text-2xl md:text-3xl">{w.variety}</span>
                  {active && <motion.span layoutId="tab-rule" className="absolute inset-x-0 -bottom-px h-px bg-current" />}
                </button>
              );
            })}
          </div>

          <div id={`${tabsId}-panel`} role="tabpanel" aria-labelledby={`${tabsId}-tab-${wine.slug}`} className="pt-10">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={wine.slug}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.55, ease: EASE }}
              >
                <p className="wordmark text-sm tracking-[0.42em]" style={{ color: t.accent }}>
                  {wine.name}
                </p>
                <h2 className="display mt-3 text-[clamp(2.25rem,9.5vw,6.5rem)] uppercase tracking-[0.04em] md:text-[clamp(3rem,7vw,6.5rem)]">{wine.variety}</h2>
                <p className="eyebrow mt-3" style={{ color: t.muted }}>
                  {wine.appellation}
                </p>
                <p className="mt-8 max-w-[42ch] text-base leading-relaxed" style={{ color: t.muted }}>
                  {wine.description}
                </p>

                <dl className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-current/15 pt-6">
                  {publicFacts(wine).map((f) => (
                    <div key={f.label}>
                      <dt className="eyebrow" style={{ color: t.muted }}>
                        {f.label}
                      </dt>
                      <dd className="display mt-2 text-lg">{f.value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-12 flex flex-wrap items-center gap-6">
                  <button
                    type="button"
                    onClick={() => setSheetOpen(true)}
                    className="eyebrow border border-current/40 px-6 py-4 transition-colors duration-500 hover:bg-current/10"
                  >
                    Ver ficha del vino
                  </button>
                  <Link href="/contacto/" className="link-underline eyebrow pb-1" style={{ color: t.accent }}>
                    Solicitar información
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <WineSheet wine={wine} open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </motion.section>
  );
}

/**
 * Escenario de la botella. Solo fotografía real: la vista 360° si ya existen las fotos de la botella
 * sobre base giratoria; si no, la foto disponible; sin foto, la etiqueta; y sin etiqueta, la provisional rotulada.
 */
function BottleStage({ wine }: { wine: Wine }) {
  const alt = `Botella de ${wine.name} ${wine.variety}`;
  if (wine.turntable) return <TurntableViewer turntable={wine.turntable} alt={alt} />;
  if (wine.bottle) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={asset(wine.bottle.src)}
        alt={wine.bottle.alt}
        width={wine.bottle.width}
        height={wine.bottle.height}
        className="absolute inset-0 m-auto h-full max-h-[86%] w-auto object-contain [mask-image:radial-gradient(ellipse_58%_56%_at_48.5%_48%,#000_62%,transparent_100%)]"
        draggable={false}
      />
    );
  }
  if (wine.label) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={asset(wine.label.src)}
        alt={wine.label.alt}
        width={wine.label.width}
        height={wine.label.height}
        className="absolute inset-0 m-auto h-auto max-h-[80%] w-auto max-w-[88%] object-contain drop-shadow-[0_40px_50px_rgba(36,32,29,0.28)]"
        draggable={false}
      />
    );
  }
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <ProvisionalLabel wine={wine} />
    </div>
  );
}
