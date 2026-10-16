"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { animate, motion, useMotionValue, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import { story } from "@/content/copy";
import { bottleLabelBox, engravingBands, media } from "@/content/media";
import { riojaPhotos } from "@/content/site";
import { asset } from "@/lib/asset";
import { containSize, maxScale } from "@/lib/camera";
import { usePrefersReducedMotion, useViewport } from "@/lib/hooks";
import { SCENES, T, buildCameraStops, captionOpacity, sceneAt, shotAt } from "@/lib/timeline";
import { StaticJourney } from "./StaticJourney";

const label = media.tempranilloLabel;
const bottle = media.tempranilloBottle;

/** Máscara vertical para aislar una banda del grabado. */
const bandMask = (top: number, bottom: number, feather = 0.03) =>
  `linear-gradient(180deg, transparent ${(top - feather) * 100}%, #000 ${top * 100}%, #000 ${bottom * 100}%, transparent ${(bottom + feather) * 100}%)`;

function useWindow(p: MotionValue<number>, window: readonly [number, number]) {
  return useTransform(p, (v) => captionOpacity(v, window));
}

/** Oculta del árbol de accesibilidad y del tabulador lo que no está en pantalla. */
function useVisibility(opacity: MotionValue<number>) {
  return useTransform(opacity, (o) => (o > 0.02 ? "visible" : "hidden"));
}

export function CinematicJourney() {
  const reduced = usePrefersReducedMotion();
  if (reduced) return <StaticJourney />;
  return <Journey />;
}

function Journey() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewport = useViewport();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  // Espejo sin aceleración: Motion 12 delega la opacidad en ScrollTimeline nativo, que aquí
  // desincroniza unas capas de otras. Un único reloj JS mantiene todas las capas en fase.
  const p = useMotionValue(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => p.set(v));
  useEffect(() => p.set(scrollYProgress.get()), [p, scrollYProgress]);

  // ── Geometría ────────────────────────────────────────────────
  const isMobile = viewport.width < 768;
  const base = containSize(viewport, label.width / label.height, isMobile ? 0.92 : 0.78);
  const cap = maxScale(base.width, label.width);
  const stops = useMemo(
    () => buildCameraStops(base, viewport, cap),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [base.width, base.height, viewport.width, viewport.height, cap],
  );
  const stopsRef = useRef(stops);
  stopsRef.current = stops;

  const bottleAspect = bottle.width / bottle.height;
  const bottleH = isMobile
    ? Math.min(viewport.height * 0.6, (viewport.width * 1.05) / bottleAspect)
    : Math.min(viewport.height * 0.86, (viewport.width * 1.15) / bottleAspect);
  const bottleW = bottleH * bottleAspect;
  const labelCx = (bottleLabelBox.left + bottleLabelBox.right) / 2;
  const labelCy = (bottleLabelBox.top + bottleLabelBox.bottom) / 2;
  // Escala a la que la etiqueta fotografiada coincide en altura con la etiqueta en alta resolución.
  // (En la foto la curvatura del vidrio estrecha el ancho; igualar alturas evita el efecto doble.)
  const match = base.height / (bottleH * (bottleLabelBox.bottom - bottleLabelBox.top));

  // ── Escena 01: revelación por luz (tiempo) ───────────────────
  const intro = useMotionValue(0);
  useEffect(() => {
    const controls = animate(intro, 1, { duration: 2.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 });
    return () => controls.stop();
  }, [intro]);

  const shade = useTransform([intro, p], (v: unknown[]) => {
    const i = Number(v[0]);
    const s = Number(v[1]);
    const x = 16 + 36 * i;
    const inner = 6 + 34 * i;
    const outer = inner + 46;
    const alpha = 0.96 - 0.5 * Math.min(1, s / 0.14);
    return `radial-gradient(ellipse 60% 70% at ${x}% 44%, rgba(18,10,12,0) ${inner}%, rgba(18,10,12,${alpha.toFixed(3)}) ${outer}%)`;
  });
  const sheenX = useTransform([intro, p], (v: unknown[]) => `${-60 + 50 * Number(v[0]) + 160 * Math.min(1, Number(v[1]) / 0.2)}%`);

  // ── Escena 02: aproximación ──────────────────────────────────
  const bottleScale = useTransform(p, [0, 0.08, 0.15, 0.21], [1, 1.015, match, match * 1.04]);
  const bottleOpacity = useTransform(p, T.bottleOut, [1, 0]);
  // En móvil la botella arranca más arriba para dejar sitio al titular y vuelve al centro al acercarse
  const bottleY = useTransform(p, [0, 0.15], [isMobile ? -viewport.height * 0.13 : 0, 0]);
  const heroOpacity = useTransform(p, T.heroText, [1, 0]);
  const heroY = useTransform(p, T.heroText, [0, -24]);

  const background = useTransform(
    p,
    [0, 0.1, 0.22, 0.46, 0.53, 0.86, 0.93],
    ["#120a0c", "#2a161b", "#3b2621", "#4a3328", "#e6dac7", "#e6dac7", "#f4ebdd"],
  );

  // ── Escenas 02–05: cámara sobre la etiqueta ──────────────────
  const camX = useTransform(p, (v) => shotAt(stopsRef.current, v).x);
  const camY = useTransform(p, (v) => shotAt(stopsRef.current, v).y);
  const camScale = useTransform(p, (v) => shotAt(stopsRef.current, v).scale);
  const labelOpacity = useTransform(p, [...T.labelIn, ...T.engravingOut], [0, 1, 1, 0]);
  const paperOpacity = useTransform(p, T.paperOut, [1, 0]);

  // Escena 04: separación en capas (los viñedos pasan junto a la cámara)
  const nearScale = useTransform(p, [0.58, 0.68], [1, 1.6]);
  const nearY = useTransform(p, [0.58, 0.68], [0, base.height * 0.16]);
  const nearOpacity = useTransform(p, T.nearOut, [1, 0]);
  const midScale = useTransform(p, [0.56, 0.7, 0.88], [1, 1.07, 1.1]);

  // Luz: del sepia al oro, y el paso del día sobre Rioja
  const warmth = useTransform(p, [0.55, 0.66, 0.86, 0.91], [0, 0.5, 0.5, 0]);
  const tint = useTransform(p, [0.6, 0.72, 0.78, 0.84], ["#e8c27e", "#e8c27e", "#c9d1cf", "#d9a066"]);
  const scrim = useTransform(p, [0.25, 0.27, 0.86, 0.89], [0, 1, 1, 0]);

  // Fotografías reales de Rioja (si existen): fundido desde el grabado
  const photoOpacity = useTransform(p, [0.64, 0.73, 0.86, 0.9], [0, 1, 1, 0]);

  // Rótulos
  const labelCaps = [useWindow(p, T.labelCaptions[0]), useWindow(p, T.labelCaptions[1]), useWindow(p, T.labelCaptions[2])];
  const originCaps = [useWindow(p, T.originCaptions[0]), useWindow(p, T.originCaptions[1])];
  const riojaCaps = [useWindow(p, T.riojaCaptions[0]), useWindow(p, T.riojaCaptions[1]), useWindow(p, T.riojaCaptions[2])];

  // ── Escena 06: regreso ──────────────────────────────────────
  const returnOpacity = useTransform(p, T.returnIn, [0, 1]);
  const returnScale = useTransform(p, [0.88, 1], [1.12, 1]);
  const returnTextOpacity = useTransform(p, [0.92, 0.97], [0, 1]);
  const returnTextVisibility = useVisibility(returnTextOpacity);
  const heroVisibility = useVisibility(heroOpacity);

  // Capítulo activo + tono para la navegación
  const [scene, setScene] = useState<(typeof SCENES)[number]>(SCENES[0]);
  useMotionValueEvent(p, "change", (v) => {
    const s = sceneAt(v);
    if (s.id !== scene.id) setScene(s);
    const el = sectionRef.current;
    if (el) el.dataset.tone = v < 0.5 ? "dark" : "light";
  });
  const dark = scene.start < 0.5;

  const goTo = (start: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + (start + 0.01) * (el.offsetHeight - window.innerHeight), behavior: "smooth" });
  };

  const bandStyle = { width: base.width, height: base.height } as const;

  return (
    <section
      ref={sectionRef}
      id="historia"
      data-tone="dark"
      aria-label="La historia de ESTORIA"
      className="relative h-[720svh] md:h-[900svh]"
    >
      {/* Ancla de la escena Rioja: misma posición de scroll que el progreso 0.72 */}
      <div id="rioja" aria-hidden className="absolute left-0" style={{ top: "calc((100% - 100svh) * 0.72)" }} />

      <div className="sticky top-0 h-svh w-full overflow-hidden">
        <motion.div aria-hidden className="absolute inset-0" style={{ backgroundColor: background }} />

        {/* ── Botella ───────────────────────────── */}
        <motion.div
          className="absolute will-change-transform"
          style={{
            width: bottleW,
            height: bottleH,
            left: `calc(50% - ${bottleW * labelCx}px)`,
            top: `calc(50% - ${bottleH * labelCy}px)`,
            transformOrigin: `${labelCx * 100}% ${labelCy * 100}%`,
            scale: bottleScale,
            y: bottleY,
            opacity: bottleOpacity,
            WebkitMaskImage: "radial-gradient(ellipse 58% 56% at 48.5% 48%, #000 62%, transparent 100%)",
            maskImage: "radial-gradient(ellipse 58% 56% at 48.5% 48%, #000 62%, transparent 100%)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset(bottle.src)}
            width={bottle.width}
            height={bottle.height}
            alt={bottle.alt}
            fetchPriority="high"
            decoding="async"
            className="h-full w-full select-none object-cover"
            draggable={false}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 w-[70%] mix-blend-screen"
            style={{
              left: sheenX,
              background: "linear-gradient(100deg, transparent 30%, rgba(255,226,190,0.11) 50%, transparent 70%)",
            }}
          />
          <motion.div aria-hidden className="pointer-events-none absolute -inset-px" style={{ background: shade }} />
        </motion.div>

        {/* ── Etiqueta / grabado ─────────────────── */}
        <motion.div aria-hidden className="absolute inset-0 flex items-center justify-center" style={{ opacity: labelOpacity }}>
          <motion.div className="relative shrink-0 will-change-transform" style={{ ...bandStyle, x: camX, y: camY, scale: camScale }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <motion.img src={asset(label.src)} alt="" className="absolute inset-0 h-full w-full" style={{ opacity: paperOpacity }} draggable={false} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <motion.img
              src={asset(label.src)}
              alt=""
              className="band-mask absolute inset-0 h-full w-full"
              style={{ ["--band" as string]: bandMask(engravingBands.mid.top, 0.6, 0.012), scale: midScale, transformOrigin: "52% 52%" }}
              draggable={false}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <motion.img
              src={asset(label.src)}
              alt=""
              className="band-mask absolute inset-0 h-full w-full"
              style={{
                ["--band" as string]: bandMask(engravingBands.near.top + 0.015, engravingBands.near.bottom),
                scale: nearScale,
                y: nearY,
                opacity: nearOpacity,
                transformOrigin: "50% 72%",
              }}
              draggable={false}
            />
          </motion.div>
        </motion.div>

        {/* Luz cálida sobre el grabado y el paso del día */}
        <motion.div aria-hidden className="pointer-events-none absolute inset-0 mix-blend-multiply" style={{ opacity: warmth, backgroundColor: tint }}>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_20%,rgba(255,250,240,0.9),transparent_70%)]" />
        </motion.div>

        {riojaPhotos.length > 0 && (
          <motion.div aria-hidden className="absolute inset-0" style={{ opacity: photoOpacity }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset(riojaPhotos[0]!.src)} alt="" className="h-full w-full object-cover" />
          </motion.div>
        )}

        {/* Velo para la legibilidad de los rótulos sobre el papel */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-[#e6dac7]/90 via-[#e6dac7]/45 to-transparent"
          style={{ opacity: scrim }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[42%] bg-gradient-to-b from-[#e6dac7] via-[#e6dac7]/85 to-transparent"
          style={{ opacity: useTransform(p, [0.53, 0.56, 0.69, 0.71], [0, 1, 1, 0]) }}
        />

        {/* ── Escena 01: texto ───────────────────── */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-noche via-noche/80 to-transparent md:h-[38%] md:via-noche/40"
          style={{ opacity: heroOpacity }}
        />
        <motion.header
          className="absolute inset-x-0 bottom-0 z-10 px-[var(--gutter)] pb-[max(2rem,6svh)] text-pergamino"
          style={{ opacity: heroOpacity, y: heroY, visibility: heroVisibility }}
        >
          <div className="mx-auto flex max-w-[90rem] flex-col items-center gap-6 text-center md:flex-row md:items-end md:justify-between md:text-left">
            <div>
              <motion.p
                className="eyebrow text-oro-claro"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6, duration: 1.2 }}
              >
                {story.hero.eyebrow}
              </motion.p>
              <h1 className="wordmark mt-3 text-[clamp(2.75rem,7vw,6rem)] leading-none" aria-label="ESTORIA">
                {story.hero.title.split("").map((ch, i) => (
                  <motion.span
                    key={i}
                    aria-hidden
                    className="inline-block"
                    initial={{ opacity: 0, y: "0.18em" }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 + i * 0.07, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {ch}
                  </motion.span>
                ))}
              </h1>
              <motion.p
                className="display mt-4 text-[clamp(1.25rem,2.2vw,1.75rem)] italic text-pergamino/90"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.9, duration: 1.4 }}
              >
                {story.hero.tagline}
              </motion.p>
            </div>
            <motion.button
              type="button"
              onClick={() => goTo(SCENES[1].start + 0.04)}
              className="group flex items-center gap-4 text-pergamino/80 transition-colors hover:text-pergamino"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.6, duration: 1 }}
            >
              <span className="eyebrow">{story.hero.scroll}</span>
              <span aria-hidden className="relative block h-12 w-px overflow-hidden bg-pergamino/25">
                <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2.4s_var(--ease-suave)_infinite] bg-oro-claro" />
              </span>
            </motion.button>
          </div>
        </motion.header>

        {/* ── Escena 03: rótulos de la etiqueta ──── */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-[var(--gutter)] pb-[max(2rem,7svh)]">
          <div className="relative mx-auto h-28 max-w-[90rem]">
            {story.label.map((c, i) => (
              <motion.p
                key={c.at}
                className="absolute bottom-0 left-0 w-[min(88vw,30rem)] text-tinta"
                style={{ opacity: labelCaps[i], y: useTransform(labelCaps[i]!, [0, 1], [12, 0]) }}
              >
                <span className="eyebrow block text-borgona">III · {String(i + 1).padStart(2, "0")}</span>
                <span className="display mt-2 block text-[clamp(1.75rem,3.4vw,2.75rem)] italic">{c.text}</span>
              </motion.p>
            ))}
          </div>
        </div>

        {/* ── Escena 04: origen ──────────────────── */}
        <div className="pointer-events-none absolute inset-x-0 top-[calc(var(--header-h)+5svh)] z-10 px-[var(--gutter)] text-center text-tinta">
          <motion.h2 className="display mx-auto max-w-[16ch] text-[clamp(2.25rem,5.5vw,4.75rem)]" style={{ opacity: originCaps[0] }}>
            {story.origin.title}
          </motion.h2>
          <motion.p
            className="display absolute inset-x-0 top-0 mx-auto max-w-[18ch] text-[clamp(2.25rem,5.5vw,4.75rem)] italic text-borgona"
            style={{ opacity: originCaps[1] }}
          >
            {story.origin.subtitle}
          </motion.p>
        </div>

        {/* ── Escena 05: Rioja ───────────────────── */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-[var(--gutter)] pb-[max(2rem,8svh)]">
          <h2 className="sr-only">Rioja</h2>
          <div className="relative mx-auto h-32 max-w-[90rem]">
            {story.rioja.map((line, i) => (
              <motion.p
                key={line}
                className="display absolute bottom-0 right-0 w-[min(88vw,34rem)] text-right text-[clamp(1.9rem,4vw,3.5rem)] text-tinta"
                style={{ opacity: riojaCaps[i], x: useTransform(riojaCaps[i]!, [0, 1], [16, 0]) }}
              >
                {line}
              </motion.p>
            ))}
          </div>
        </div>

        {/* ── Escena 06: regreso ─────────────────── */}
        <motion.div
          className="absolute inset-0 z-10 grid grid-rows-[auto_1fr] items-center gap-6 px-[var(--gutter)] pb-8 pt-[calc(var(--header-h)+2rem)] md:grid-cols-[1fr_auto_1fr] md:grid-rows-1 md:pt-[var(--header-h)]"
          style={{ opacity: returnOpacity }}
        >
          <motion.div className="text-center text-tinta md:text-left" style={{ opacity: returnTextOpacity, visibility: returnTextVisibility }}>
            <p className="eyebrow text-sepia-oscuro">VI · El regreso</p>
            <h2 className="display mt-4 text-[clamp(2rem,4.4vw,4rem)]">{story.return.title}</h2>
            <a href="#vinos" className="link-underline eyebrow mt-8 inline-block pb-1 text-borgona">
              Conocer los vinos
            </a>
          </motion.div>
          <motion.figure className="relative mx-auto h-full max-h-[70svh] min-h-0 md:h-[72svh]" style={{ scale: returnScale }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset(bottle.src)}
              alt=""
              className="h-full w-auto object-contain shadow-[0_50px_90px_-40px_rgba(53,29,34,0.55)]"
              draggable={false}
            />
            <figcaption className="eyebrow mt-3 text-center text-sepia-oscuro">ESTORIA Tempranillo · DOCa Rioja</figcaption>
          </motion.figure>
          <div className="hidden md:block" />
        </motion.div>

        {/* ── Índice de capítulos ───────────────── */}
        <nav
          aria-label="Capítulos de la historia"
          className={`absolute right-[var(--gutter)] top-1/2 z-20 hidden -translate-y-1/2 lg:block ${dark ? "text-pergamino" : "text-tinta"}`}
        >
          <ol className="flex flex-col gap-3">
            {SCENES.map((s) => {
              const active = s.id === scene.id;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => goTo(s.start)}
                    aria-current={active ? "step" : undefined}
                    className={`group flex items-center justify-end gap-3 transition-opacity duration-500 ${active ? "opacity-100" : "opacity-45 hover:opacity-80"}`}
                  >
                    <span className={`eyebrow transition-all duration-500 ${active ? "translate-x-0 opacity-100" : "translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:opacity-100"}`}>
                      {s.title}
                    </span>
                    <span className="w-6 text-center font-serif text-sm">{s.numeral}</span>
                    <span aria-hidden className={`block h-px bg-current transition-all duration-500 ${active ? "w-8" : "w-3"}`} />
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </section>
  );
}
