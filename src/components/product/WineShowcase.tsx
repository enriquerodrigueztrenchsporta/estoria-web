"use client";

import { useId, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import { story } from "@/content/copy";
import { publicFacts, wines } from "@/content/wines";
import type { Wine } from "@/content/types";
import { asset } from "@/lib/asset";
import { WineSheet } from "./WineSheet";
import { ProvisionalLabel } from "./ProvisionalLabel";

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
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      select(index + 1, true);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      select(index - 1, true);
    } else if (e.key === "Home") {
      e.preventDefault();
      select(0, true);
    } else if (e.key === "End") {
      e.preventDefault();
      select(wines.length - 1, true);
    }
  };

  // La luz sigue al cursor: destaca discretamente el vidrio y el papel
  const lx = useSpring(useMotionValue(30), { stiffness: 60, damping: 20 });
  const ly = useSpring(useMotionValue(35), { stiffness: 60, damping: 20 });
  const glow = useMotionTemplate`radial-gradient(circle at ${lx}% ${ly}%, var(--light) 0%, transparent 55%)`;
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    lx.set(((e.clientX - r.left) / r.width) * 100);
    ly.set(((e.clientY - r.top) / r.height) * 100);
  };

  const t = wine.theme;

  return (
    <section id="vinos" aria-labelledby="vinos-title" className="relative bg-pergamino pt-28 md:pt-40" data-tone="light">
      <div className="container-editorial text-center">
        <p className="eyebrow text-sepia-oscuro">{story.collection.eyebrow}</p>
        <h2 id="vinos-title" className="display mx-auto mt-5 max-w-[14ch] text-[clamp(2.5rem,6vw,5.5rem)]">
          {story.collection.title}
        </h2>
      </div>

      <motion.div
        className="relative mt-16 overflow-hidden md:mx-[var(--gutter)] md:mt-24"
        data-tone={t.mode}
        animate={{ backgroundColor: t.background, color: t.ink }}
        transition={{ duration: 1.1, ease: EASE }}
        style={{ ["--light" as string]: `${t.light}33` }}
      >
        {/* Luz lateral cálida de la escena */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          animate={{
            background:
              t.mode === "dark"
                ? "radial-gradient(ellipse 60% 80% at 18% 40%, rgba(201,162,122,0.22), transparent 70%)"
                : "radial-gradient(ellipse 60% 80% at 18% 40%, rgba(233,214,168,0.55), transparent 70%)",
          }}
          transition={{ duration: 1.1 }}
        />

        <div className="relative grid min-h-[92svh] items-center gap-10 px-[var(--gutter)] py-16 md:grid-cols-[1.1fr_1fr] md:gap-16 md:py-24">
          {/* Escenario de la botella */}
          <div className="relative flex h-[62svh] items-center justify-center md:h-[78svh]" onPointerMove={onMove}>
            <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: glow }} />
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={wine.slug}
                className="relative h-full"
                initial={{ opacity: 0, x: 40, filter: "brightness(0.6)" }}
                animate={{ opacity: 1, x: 0, filter: "brightness(1)" }}
                exit={{ opacity: 0, x: -40, filter: "brightness(0.6)" }}
                transition={{ duration: 0.9, ease: EASE }}
              >
                <WineVisual wine={wine} />
              </motion.div>
            </AnimatePresence>
            {/* Sombra de apoyo */}
            <div aria-hidden className="absolute bottom-[3%] left-1/2 h-6 w-1/2 -translate-x-1/2 rounded-[50%] bg-black/25 blur-xl" />
          </div>

          {/* Contenido */}
          <div className="relative">
            <div role="tablist" aria-label="Vinos ESTORIA" className="flex gap-8 border-b border-current/20">
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
                  <h3 className="display mt-3 text-[clamp(3rem,7vw,6.5rem)] uppercase tracking-[0.04em]">{wine.variety}</h3>
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
                    <a href="#detalle" className="link-underline eyebrow pb-1" style={{ color: t.accent }}>
                      Explorar la etiqueta
                    </a>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>

      <WineSheet wine={wine} open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </section>
  );
}

function WineVisual({ wine }: { wine: Wine }) {
  if (wine.bottle) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={asset(wine.bottle.src)}
        alt={wine.bottle.alt}
        width={wine.bottle.width}
        height={wine.bottle.height}
        loading="lazy"
        decoding="async"
        className="h-full w-auto object-contain [mask-image:radial-gradient(ellipse_52%_54%_at_48.5%_48%,#000_55%,transparent_98%)]"
        draggable={false}
      />
    );
  }
  return <ProvisionalLabel wine={wine} />;
}
