"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { animate, motion, useMotionValue, useMotionValueEvent, useTransform, type AnimationPlaybackControls, type MotionValue } from "motion/react";
import { story } from "@/content/copy";
import { attribution, type Photo } from "@/content/credits";
import { bottleLabelBox, engravingBands, media } from "@/content/media";
import { riojaPhotos } from "@/content/site";
import { asset } from "@/lib/asset";
import { containSize, maxScale } from "@/lib/camera";
import { usePrefersReducedMotion, useViewport } from "@/lib/hooks";
import { ENTRY_SCALE, JOURNEY_SECONDS, SCENES, T, buildCameraStops, captionOpacity, sceneAt, shotAt } from "@/lib/timeline";
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

/** Tono de la cabecera según la escena: oscuro sobre la botella y las fotos, claro sobre el papel. */
const toneAt = (v: number) => (v < 0.3 || (v >= 0.5 && v < 0.86) ? "dark" : "light");

function Journey() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewport = useViewport();
  // El recorrido es voluntario y no depende del scroll: un único reloj (`p`, 0–1) mueve todas
  // las capas y solo avanza cuando el visitante pulsa «Ver la historia».
  const p = useMotionValue(0);
  const [status, setStatus] = useState<"idle" | "playing" | "paused" | "ended">("idle");
  const playback = useRef<AnimationPlaybackControls | null>(null);

  const stop = useCallback(() => {
    playback.current?.stop();
    playback.current = null;
  }, []);
  const play = useCallback(
    (from?: number) => {
      stop();
      const start = from ?? (p.get() >= 1 ? 0 : p.get());
      p.set(start);
      setStatus("playing");
      playback.current = animate(p, 1, {
        duration: JOURNEY_SECONDS * (1 - start),
        ease: "linear",
        onComplete: () => setStatus("ended"),
      });
    },
    [p, stop],
  );
  const pause = useCallback(() => {
    stop();
    setStatus((s) => (s === "playing" ? "paused" : s));
  }, [stop]);
  const skip = () => {
    stop();
    p.set(1);
    setStatus("ended");
  };
  useEffect(() => stop, [stop]);

  // Si el visitante sigue bajando por la página, el recorrido se pausa
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.intersectionRatio < 0.5) pause();
      },
      { threshold: [0, 0.5] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [pause]);
  const progressWidth = useTransform(p, (v) => `${v * 100}%`);

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
  // Escala de la botella a la que la etiqueta fotografiada coincide en altura con la etiqueta
  // en alta resolución en su plano de entrada (la curvatura del vidrio estrecha el ancho en la foto).
  const entry = Math.min(ENTRY_SCALE, cap);
  const match = (entry * base.height) / (bottleH * (bottleLabelBox.bottom - bottleLabelBox.top));

  // ── I · Revelación por luz (tiempo) ──────────────────────────
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

  // ── II · Aproximación: la botella se acerca y se funde con el grabado ──
  const bottleScale = useTransform(p, [0, 0.08, 0.18, 0.24], [1, 1.015, match, match * 1.02]);
  const bottleOpacity = useTransform(p, T.bottleOut, [1, 0]);
  // En móvil la botella arranca más arriba para dejar sitio al titular y vuelve al centro al acercarse
  const bottleY = useTransform(p, [0, 0.16], [isMobile ? -viewport.height * 0.13 : 0, 0]);
  const heroOpacity = useTransform(p, T.heroText, [1, 0]);
  const heroY = useTransform(p, T.heroText, [0, -24]);

  const background = useTransform(
    p,
    [0, 0.1, 0.2, 0.26, 0.32, 0.86, 0.93],
    ["#120a0c", "#2a161b", "#3b2621", "#4a3328", "#e6dac7", "#e6dac7", "#f4ebdd"],
  );

  // ── Cámara sobre el grabado ─────────────────────────────────
  const camX = useTransform(p, (v) => shotAt(stopsRef.current, v).x);
  const camY = useTransform(p, (v) => shotAt(stopsRef.current, v).y);
  const camScale = useTransform(p, (v) => shotAt(stopsRef.current, v).scale);
  const labelOpacity = useTransform(p, [...T.labelIn, ...T.engravingOut], [0, 1, 1, 0]);
  const paperOpacity = useTransform(p, T.paperOut, [1, 0]);

  // III · Separación en capas (los viñedos pasan junto a la cámara)
  const nearScale = useTransform(p, [0.4, 0.5], [1, 1.6]);
  const nearY = useTransform(p, [0.4, 0.5], [0, base.height * 0.16]);
  const nearOpacity = useTransform(p, T.nearOut, [1, 0]);
  const midScale = useTransform(p, [0.38, 0.5, 0.86], [1, 1.07, 1.1]);
  const warmth = useTransform(p, [0.33, 0.45, 0.84, 0.89], [0, 0.5, 0.5, 0]);
  const topScrim = useTransform(p, [0.3, 0.33, 0.49, 0.52], [0, 1, 1, 0]);

  // IV · Rioja: el grabado se funde con fotografías reales
  const photosOpacity = useTransform(p, [...T.photosIn, ...T.engravingOut], [0, 1, 1, 0]);
  const originCaps = [useWindow(p, T.originCaptions[0]), useWindow(p, T.originCaptions[1])];
  const riojaCaps = [useWindow(p, T.riojaCaptions[0]), useWindow(p, T.riojaCaptions[1]), useWindow(p, T.riojaCaptions[2])];
  const hasPhotos = riojaPhotos.length > 0;

  // V · Regreso
  const returnOpacity = useTransform(p, T.returnIn, [0, 1]);
  const returnScale = useTransform(p, [0.88, 1], [1.12, 1]);
  const returnTextOpacity = useTransform(p, [0.92, 0.97], [0, 1]);
  const returnTextVisibility = useVisibility(returnTextOpacity);
  const heroVisibility = useVisibility(heroOpacity);

  // Capítulo activo + tono para la navegación
  const [scene, setScene] = useState<(typeof SCENES)[number]>(SCENES[0]);
  const [tone, setTone] = useState<"dark" | "light">("dark");
  useMotionValueEvent(p, "change", (v) => {
    const s = sceneAt(v);
    if (s.id !== scene.id) setScene(s);
    const t = toneAt(v);
    if (t !== tone) setTone(t);
  });

  const goTo = (start: number) => {
    if (status === "playing") return play(start + 0.005);
    stop();
    p.set(start + 0.005);
    setStatus("paused");
  };
  const active = status !== "idle";

  const bandStyle = { width: base.width, height: base.height } as const;

  return (
    <section ref={sectionRef} data-tone={tone} aria-label="La historia de ESTORIA" className="relative">
      <div className="relative h-svh w-full overflow-hidden">
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
            style={{ left: sheenX, background: "linear-gradient(100deg, transparent 30%, rgba(255,226,190,0.11) 50%, transparent 70%)" }}
          />
          <motion.div aria-hidden className="pointer-events-none absolute -inset-px" style={{ background: shade }} />
        </motion.div>

        {/* ── Grabado de la etiqueta ─────────────── */}
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
                ["--band" as string]: bandMask(engravingBands.near.top + 0.015, engravingBands.near.bottom, 0.012),
                scale: nearScale,
                y: nearY,
                opacity: nearOpacity,
                transformOrigin: "50% 72%",
              }}
              draggable={false}
            />
          </motion.div>
        </motion.div>

        {/* Luz cálida sobre el grabado */}
        <motion.div aria-hidden className="pointer-events-none absolute inset-0 bg-[#e8c27e] mix-blend-multiply" style={{ opacity: warmth }}>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_20%,rgba(255,250,240,0.9),transparent_70%)]" />
        </motion.div>

        {/* ── IV · Fotografías reales de Rioja ───── */}
        {hasPhotos && (
          <motion.div className="absolute inset-0" style={{ opacity: photosOpacity }}>
            {riojaPhotos.map((photo, i) => (
              <RiojaPhoto key={photo.id} photo={photo} p={p} index={i} />
            ))}
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-noche/85 via-noche/35 to-transparent" />
            <div aria-hidden className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-noche/50 to-transparent" />
          </motion.div>
        )}

        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[42%] bg-gradient-to-b from-[#e6dac7] via-[#e6dac7]/85 to-transparent"
          style={{ opacity: topScrim }}
        />

        {/* ── I · Texto ─────────────────────────── */}
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
              <motion.p className="eyebrow text-oro-claro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6, duration: 1.2 }}>
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
            <motion.div
              className="flex flex-col items-center gap-5 md:items-end"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.4, duration: 1 }}
            >
              <button
                type="button"
                onClick={() => play(0)}
                className="flex items-center gap-4 border border-pergamino/45 px-6 py-4 text-pergamino transition-colors duration-500 hover:bg-pergamino/10"
              >
                <span aria-hidden className="block h-0 w-0 border-y-[6px] border-l-[10px] border-y-transparent border-l-oro-claro" />
                <span className="eyebrow">{story.hero.play}</span>
              </button>
              <p className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-pergamino/65">
                <span>{story.hero.playHint}</span>
                <span aria-hidden>·</span>
                <a href="#la-marca" className="link-underline text-pergamino/85">
                  {story.hero.more} ↓
                </a>
              </p>
            </motion.div>
          </div>
        </motion.header>

        {/* ── III · Origen ──────────────────────── */}
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

        {/* ── IV · Rioja ────────────────────────── */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-[var(--gutter)] pb-[max(2rem,8svh)]">
          <h2 className="sr-only">Rioja</h2>
          <div className="relative mx-auto h-36 max-w-[90rem]">
            {story.rioja.map((line, i) => (
              <motion.div
                key={line}
                className="absolute bottom-0 right-0 w-[min(88vw,36rem)] text-right"
                style={{ opacity: riojaCaps[i], x: useTransform(riojaCaps[i]!, [0, 1], [16, 0]) }}
              >
                <p className={`display text-[clamp(1.9rem,4vw,3.5rem)] ${hasPhotos ? "text-pergamino" : "text-tinta"}`}>{line}</p>
                {hasPhotos && riojaPhotos[i] && (
                  <p className="eyebrow mt-3 text-pergamino/75">
                    {riojaPhotos[i]!.place} · {attribution(riojaPhotos[i]!)}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── V · Regreso ───────────────────────── */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-10 grid grid-rows-[auto_1fr] items-center gap-6 px-[var(--gutter)] pb-8 pt-[calc(var(--header-h)+2rem)] md:grid-cols-[1fr_auto_1fr] md:grid-rows-1 md:pt-[var(--header-h)]"
          style={{ opacity: returnOpacity }}
        >
          <motion.div className="pointer-events-auto text-center text-tinta md:text-left" style={{ opacity: returnTextOpacity, visibility: returnTextVisibility }}>
            <p className="eyebrow text-sepia-oscuro">V · El regreso</p>
            <h2 className="display mt-4 text-[clamp(2rem,4.4vw,4rem)]">{story.return.title}</h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-8 md:justify-start">
              <Link href="/vinos/" className="link-underline eyebrow inline-block pb-1 text-borgona">
                Conocer los vinos
              </Link>
              <button type="button" onClick={() => play(0)} className="eyebrow text-sepia-oscuro transition-colors hover:text-tinta">
                ↺ {story.hero.replay}
              </button>
            </div>
          </motion.div>
          <motion.figure className="relative mx-auto h-full max-h-[70svh] min-h-0 md:h-[72svh]" style={{ scale: returnScale }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset(bottle.src)} alt="" className="h-full w-auto object-contain shadow-[0_50px_90px_-40px_rgba(53,29,34,0.55)]" draggable={false} />
            <figcaption className="eyebrow mt-3 text-center text-sepia-oscuro">ESTORIA Tempranillo · DOCa Rioja</figcaption>
          </motion.figure>
          <div className="hidden md:block" />
        </motion.div>

        {/* ── Controles del recorrido ────────────── */}
        {active && status !== "ended" && (
          <div
            className="absolute bottom-[max(1rem,2.5svh)] left-1/2 z-20 flex -translate-x-1/2 items-center gap-6 whitespace-nowrap rounded-full bg-noche/55 px-5 py-2.5 text-pergamino backdrop-blur-sm"
          >
            <button type="button" onClick={() => (status === "playing" ? pause() : play())} className="eyebrow opacity-80 hover:opacity-100">
              {status === "playing" ? `❚❚ ${story.hero.pause}` : `▶ ${story.hero.resume}`}
            </button>
            <button type="button" onClick={skip} className="eyebrow opacity-80 hover:opacity-100">
              {story.hero.skip} →
            </button>
            <span aria-hidden className="relative hidden h-px w-32 bg-current/25 sm:block">
              <motion.span className="absolute inset-y-0 left-0 bg-current" style={{ width: progressWidth }} />
            </span>
          </div>
        )}

        {/* ── Índice de capítulos ───────────────── */}
        <nav
          hidden={!active}
          aria-label="Capítulos de la historia"
          className={`absolute right-[var(--gutter)] top-1/2 z-20 hidden -translate-y-1/2 transition-colors duration-700 lg:block ${tone === "dark" ? "text-pergamino" : "text-tinta"}`}
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
                    <span
                      className={`eyebrow transition-all duration-500 ${active ? "translate-x-0 opacity-100" : "translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:opacity-100"}`}
                    >
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

/** Una fotografía de Rioja: aparece en su ventana de la escena IV con un leve movimiento de cámara. */
function RiojaPhoto({ photo, p, index }: { photo: Photo; p: MotionValue<number>; index: number }) {
  const [start, end] = T.riojaCaptions[Math.min(index, T.riojaCaptions.length - 1)]!;
  // La primera foto ya está presente cuando el grabado se funde; las siguientes entran en su ventana
  const opacity = useTransform(p, index === 0 ? [0, 1] : [start - 0.01, start + 0.012], index === 0 ? [1, 1] : [0, 1]);
  const scale = useTransform(p, [index === 0 ? T.photosIn[0] : start - 0.01, end + 0.02], [1.1, 1]);
  return (
    <motion.div aria-hidden className="absolute inset-0 overflow-hidden" style={{ opacity }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <motion.img
        src={asset(photo.src)}
        srcSet={`${asset(photo.srcSmall)} 1200w, ${asset(photo.src)} 2400w`}
        sizes="100vw"
        alt=""
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
        style={{ scale }}
      />
    </motion.div>
  );
}
