"use client";

import { motion } from "motion/react";
import { story } from "@/content/copy";
import { palette } from "@/content/editorial";
import { media } from "@/content/media";
import { asset } from "@/lib/asset";
import { LabelCrop } from "@/components/ui/LabelCrop";

const EASE = [0.22, 1, 0.36, 1] as const;

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-10% 0px" },
  transition: { duration: 1.1, delay, ease: EASE },
});

/** Capítulo de identidad: la etiqueta descompuesta como un proyecto de branding. */
export function BrandUniverse() {
  return (
    <section aria-labelledby="universo-title" data-tone="dark" className="relative bg-vino py-28 text-pergamino md:py-44">
      <div className="container-editorial">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="eyebrow text-oro-claro">{story.brand.eyebrow}</p>
            <h2 id="universo-title" className="display mt-6 text-[clamp(2.4rem,5vw,4.5rem)]">
              {story.brand.title}
            </h2>
          </div>
          <p className="self-end text-lg leading-relaxed text-pergamino/80 md:col-span-5 md:col-start-8">{story.brand.body}</p>
        </div>

        <div className="mt-20 grid gap-5 md:mt-28 md:grid-cols-12 md:grid-rows-[auto_auto]">
          {/* Logotipo */}
          <motion.figure className="md:col-span-8" {...reveal()}>
            <LabelCrop cx={0.5} cy={0.305} span={0.84} ratio={2.4} alt="Logotipo ESTORIA tal como aparece en la etiqueta." />
            <figcaption className="eyebrow mt-3 flex justify-between text-pergamino/70">
              <span>01 · Logotipo</span>
              <span>Serif clásica, perfil dorado</span>
            </figcaption>
          </motion.figure>

          {/* Ornamento */}
          <motion.figure className="md:col-span-4" {...reveal(0.1)}>
            <LabelCrop cx={0.5} cy={0.168} span={0.34} ratio={2.4} alt="Ornamento dorado de la etiqueta con filetes laterales." />
            <figcaption className="eyebrow mt-3 flex justify-between text-pergamino/70">
              <span>02 · Ornamento</span>
              <span>Oro envejecido</span>
            </figcaption>
          </motion.figure>

          {/* Composición */}
          <motion.figure className="md:col-span-4" {...reveal(0.05)}>
            <div className="relative bg-papel p-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(media.tempranilloLabelSmall.src)} alt="Composición completa de la etiqueta con su eje de simetría." loading="lazy" className="w-full" />
              <svg aria-hidden viewBox="0 0 100 125" className="absolute inset-6 h-[calc(100%-3rem)] w-[calc(100%-3rem)] text-borgona" preserveAspectRatio="none">
                <line x1="50" y1="0" x2="50" y2="125" stroke="currentColor" strokeWidth="0.25" strokeDasharray="1.5 1.5" />
                {[0.1, 0.305, 0.585, 0.86].map((y) => (
                  <line key={y} x1="0" x2="100" y1={y * 125} y2={y * 125} stroke="currentColor" strokeWidth="0.2" opacity="0.6" />
                ))}
              </svg>
            </div>
            <figcaption className="eyebrow mt-3 flex justify-between text-pergamino/70">
              <span>03 · Composición</span>
              <span>Simetría editorial</span>
            </figcaption>
          </motion.figure>

          {/* Grabado + papel */}
          <motion.figure className="md:col-span-5" {...reveal(0.1)}>
            <LabelCrop cx={0.5} cy={0.6} span={0.5} ratio={0.95} alt="Detalle del grabado: pueblo, iglesia y viñedos." />
            <figcaption className="eyebrow mt-3 flex justify-between text-pergamino/70">
              <span>04 · Grabado</span>
              <span>Trazo a línea, sepia</span>
            </figcaption>
          </motion.figure>

          <motion.figure className="md:col-span-3" {...reveal(0.15)}>
            <LabelCrop cx={0.08} cy={0.94} span={0.2} ratio={0.75} alt="Textura del papel y borde troquelado de la etiqueta." className="bg-vino" />
            <figcaption className="eyebrow mt-3 text-pergamino/70">05 · Papel y troquel</figcaption>
          </motion.figure>
        </div>

        {/* Paleta y tipografía */}
        <div className="mt-24 grid gap-16 md:mt-32 md:grid-cols-12">
          <div className="md:col-span-7">
            <h3 className="eyebrow text-oro-claro">Paleta</h3>
            <ul className="mt-6 grid grid-cols-2 gap-px bg-pergamino/10 sm:grid-cols-4">
              {palette.map((c, i) => (
                <motion.li key={c.hex} className="bg-vino" {...reveal(i * 0.04)}>
                  <span aria-hidden className="block aspect-[4/3] ring-1 ring-inset ring-pergamino/10" style={{ backgroundColor: c.hex }} />
                  <span className="block px-1 pb-4 pt-3">
                    <span className="display block text-lg">{c.name}</span>
                    <span className="eyebrow mt-1 block text-pergamino/70">{c.hex}</span>
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <h3 className="eyebrow text-oro-claro">Tipografía</h3>
            <div className="mt-6 border-t border-pergamino/15 pt-6">
              <p className="display text-7xl">Aa</p>
              <p className="eyebrow mt-3 text-pergamino/70">Cormorant Garamond · titulares</p>
            </div>
            <div className="mt-8 border-t border-pergamino/15 pt-6">
              <p className="font-sans text-5xl font-light">Aa</p>
              <p className="eyebrow mt-3 text-pergamino/70">Inter · lectura y precisión</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
