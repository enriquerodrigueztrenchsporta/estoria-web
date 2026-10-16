"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { story } from "@/content/copy";
import { riojaGallery } from "@/content/editorial";
import { LabelCrop } from "@/components/ui/LabelCrop";
import { PhotoFigure } from "./PhotoFigure";

const EASE = [0.22, 1, 0.36, 1] as const;
const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-12% 0px" },
  transition: { duration: 1.1, delay, ease: EASE },
});

/** Página Rioja: el grabado de la etiqueta y el lema, seguidos de paisajes reales de la Denominación. */
export function RiojaChapter() {
  const engravingRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: engravingRef, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);
  const [main, ...rest] = riojaGallery;
  const { riojaPage: copy } = story;

  return (
    <>
      <section aria-labelledby="rioja-title" data-tone="light" className="relative overflow-hidden bg-papel pb-24 pt-[calc(var(--header-h)+4rem)] md:pb-36">
        <div className="container-editorial">
          <p className="eyebrow text-center text-sepia-oscuro">{copy.eyebrow}</p>
          <h1 id="rioja-title" className="display mx-auto mt-6 max-w-[18ch] text-center text-[clamp(2.6rem,6.5vw,6rem)]">
            {copy.motto.map((line, i) => (
              <motion.span
                key={line}
                className={`block ${i === 1 ? "italic text-borgona" : ""}`}
                initial={{ opacity: 0, y: "0.3em" }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.2 + i * 0.35, ease: EASE }}
              >
                {line}
              </motion.span>
            ))}
          </h1>

          <motion.figure
            ref={engravingRef}
            className="mx-auto mt-16 max-w-6xl md:mt-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.6, delay: 0.8 }}
          >
            <div className="overflow-hidden">
              <motion.div style={{ scale }}>
                <LabelCrop
                  cx={0.5}
                  cy={0.6}
                  span={0.96}
                  ratio={2.15}
                  alt="Grabado de la etiqueta de ESTORIA: un pueblo con su iglesia, montañas al fondo y viñedos en primer plano."
                />
              </motion.div>
            </div>
            <figcaption className="eyebrow mt-4 text-center text-sepia-oscuro">El grabado de la etiqueta de ESTORIA</figcaption>
          </motion.figure>

          <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:mt-24 md:grid-cols-2 md:gap-16">
            {copy.body.map((p, i) => (
              <motion.p
                key={i}
                className={i === 0 ? "display text-2xl leading-snug md:text-[1.75rem]" : "self-end text-lg leading-relaxed text-sepia-oscuro"}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-15% 0px" }}
                transition={{ duration: 1, delay: i * 0.15, ease: EASE }}
              >
                {p}
              </motion.p>
            ))}
          </div>
        </div>
      </section>

      {/* Tradición vinícola de Rioja */}
      <section aria-labelledby="tradicion" data-tone="dark" className="bg-noche py-24 text-pergamino md:py-36">
        <div className="container-editorial">
          <div className="grid gap-12 md:grid-cols-12 md:gap-8">
            <motion.div className="md:col-span-5" {...reveal()}>
              <p className="eyebrow text-oro-claro">{copy.tradition.eyebrow}</p>
              <h2 id="tradicion" className="display mt-6 text-[clamp(2.4rem,5vw,4.5rem)]">
                {copy.tradition.title}
              </h2>
            </motion.div>
            <div className="space-y-6 md:col-span-6 md:col-start-7 md:pt-4">
              {copy.tradition.paragraphs.map((text, i) => (
                <motion.p key={i} className="text-lg leading-relaxed text-pergamino/80" {...reveal(0.1 * i)}>
                  {text}
                </motion.p>
              ))}
            </div>
          </div>
          <dl className="mt-20 grid gap-10 border-t border-pergamino/20 pt-10 md:mt-28 md:grid-cols-3">
            {copy.tradition.facts.map((f, i) => (
              <motion.div key={f.value} {...reveal(0.1 * i)}>
                <dt className="sr-only">{f.label}</dt>
                <dd>
                  <span className="display block text-6xl text-oro-claro md:text-7xl">{f.value}</span>
                  <span className="mt-3 block max-w-[28ch] text-sm leading-relaxed text-pergamino/70">{f.label}</span>
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </section>

      {/* Las variedades de ESTORIA */}
      <section aria-labelledby="uvas" data-tone="light" className="bg-papel py-24 md:py-36">
        <div className="container-editorial">
          <motion.div className="mx-auto max-w-3xl text-center" {...reveal()}>
            <p className="eyebrow text-sepia-oscuro">{copy.grapes.eyebrow}</p>
            <h2 id="uvas" className="display mt-6 text-[clamp(2.4rem,5vw,4.5rem)]">
              {copy.grapes.title}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-sepia-oscuro">{copy.grapes.intro}</p>
          </motion.div>
          <div className="mt-16 grid gap-6 md:mt-24 md:grid-cols-2 md:gap-8">
            {copy.grapes.items.map((g, i) => (
              <motion.article
                key={g.name}
                className={`px-6 py-10 md:px-12 md:py-16 ${i === 0 ? "bg-vino text-pergamino" : "bg-marfil text-tinta"}`}
                {...reveal(0.12 * i)}
              >
                <p className={`eyebrow ${i === 0 ? "text-oro-claro" : "text-sepia-oscuro"}`}>{g.kind}</p>
                <h3 className="display mt-4 text-[clamp(1.9rem,8vw,4rem)] uppercase tracking-[0.04em] md:text-[clamp(2.5rem,5vw,4rem)]">{g.name}</h3>
                <p className={`mt-6 max-w-[44ch] text-lg leading-relaxed ${i === 0 ? "text-pergamino/80" : "text-sepia-oscuro"}`}>{g.text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="paisajes" data-tone="light" className="bg-pergamino py-24 md:py-36">
        <div className="container-editorial">
          <div className="grid gap-6 md:grid-cols-12">
            <h2 id="paisajes" className="display text-[clamp(2.2rem,4.5vw,3.75rem)] md:col-span-6">
              {copy.galleryTitle}
            </h2>
            <p className="self-end text-sm leading-relaxed text-sepia-oscuro md:col-span-4 md:col-start-9">{copy.galleryNote}</p>
          </div>

          {main && <PhotoFigure photo={main} className="mt-14 md:mt-20" ratio={21 / 9} />}
          <div className="mt-14 grid gap-14 md:mt-24 md:grid-cols-12 md:gap-8">
            {rest[0] && <PhotoFigure photo={rest[0]} className="md:col-span-7" ratio={4 / 3} />}
            {rest[1] && <PhotoFigure photo={rest[1]} className="md:col-span-5 md:mt-40" ratio={4 / 5} delay={0.1} />}
          </div>
          <div className="mt-14 grid gap-14 md:mt-24 md:grid-cols-12 md:gap-8">
            {rest[2] && <PhotoFigure photo={rest[2]} className="md:col-span-5 md:col-start-2" ratio={1} />}
            {rest[3] && <PhotoFigure photo={rest[3]} className="md:col-span-5 md:mt-28" ratio={3 / 4} delay={0.1} />}
          </div>
        </div>
      </section>
    </>
  );
}
