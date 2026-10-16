"use client";

import { motion } from "motion/react";
import { story } from "@/content/copy";
import { tablePhotos } from "@/content/editorial";
import { PhotoFigure } from "./PhotoFigure";

const EASE = [0.22, 1, 0.36, 1] as const;
const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-12% 0px" },
  transition: { duration: 1.1, delay, ease: EASE },
});

/** «Las buenas historias siempre encuentran una mesa.» Composición de revista, no de tarjetas. */
export function TableChapter() {
  const [mesa, pinchos, velas] = tablePhotos;
  const { table } = story;
  const [compartir, especiales, comida, pequenos] = table.moments;

  return (
    <section aria-labelledby="mesa-title" data-tone="light" className="relative overflow-hidden bg-pergamino pb-28 pt-[calc(var(--header-h)+4rem)] md:pb-44">
      <div className="container-editorial">
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5 md:pt-16">
            <p className="eyebrow text-sepia-oscuro">{table.eyebrow}</p>
            <h1 id="mesa-title" className="display mt-6 text-[clamp(2.5rem,5.4vw,5rem)]">
              {table.title.split(" ").map((word, i) => (
                <motion.span
                  key={i}
                  className="mr-[0.22em] inline-block"
                  initial={{ opacity: 0, y: "0.35em" }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.2 + i * 0.05, ease: EASE }}
                >
                  {word}
                </motion.span>
              ))}
            </h1>
            <p className="mt-8 max-w-[40ch] text-lg leading-relaxed text-sepia-oscuro">{table.body}</p>
          </div>
          {mesa && <PhotoFigure photo={mesa} ratio={4 / 3} className="md:col-span-7" priority />}
        </div>

        {/* Momentos: texto y fotos alternados */}
        <div className="mt-24 grid gap-16 md:mt-36 md:grid-cols-12 md:gap-8">
          {compartir && <Moment index={1} {...compartir} className="md:col-span-5" />}
          {especiales && <Moment index={2} {...especiales} className="md:col-span-5 md:col-start-8 md:mt-32" />}
        </div>

        <div className="mt-20 grid items-end gap-14 md:mt-28 md:grid-cols-12 md:gap-8">
          {pinchos && <PhotoFigure photo={pinchos} ratio={1} className="md:col-span-5" delay={0.1} />}
          {comida && <Moment index={3} {...comida} className="md:col-span-5 md:col-start-8" />}
        </div>

        <div className="mt-20 grid items-center gap-14 md:mt-32 md:grid-cols-12 md:gap-8">
          {pequenos && <Moment index={4} {...pequenos} className="md:col-span-4 md:col-start-2" />}
          {velas && <PhotoFigure photo={velas} ratio={3 / 2} className="md:col-span-6 md:col-start-7" delay={0.2} />}
        </div>

        <motion.p className="display mx-auto mt-28 max-w-[22ch] text-center text-[clamp(2rem,4vw,3.5rem)] italic text-borgona md:mt-40" {...reveal()}>
          {table.closing}
        </motion.p>

        <p className="mx-auto mt-16 max-w-[48ch] text-center text-sm leading-relaxed text-sepia-oscuro md:mt-24">{table.moderation}</p>
      </div>
    </section>
  );
}

function Moment({ index, title, text, className = "" }: { index: number; title: string; text: string; className?: string }) {
  return (
    <motion.article className={className} {...reveal()}>
      <span className="eyebrow text-sepia-oscuro">{String(index).padStart(2, "0")}</span>
      <h2 className="display mt-4 text-[clamp(1.9rem,3.4vw,2.9rem)]">{title}</h2>
      <p className="mt-5 max-w-[44ch] text-lg leading-relaxed text-sepia-oscuro">{text}</p>
    </motion.article>
  );
}
