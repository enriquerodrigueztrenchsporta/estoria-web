"use client";

import { motion } from "motion/react";
import { story } from "@/content/copy";
import { tablePhotos } from "@/content/editorial";
import { PhotoFigure } from "./PhotoFigure";

/** «Las buenas historias siempre encuentran una mesa.» Composición de revista, no de tarjetas. */
export function TableChapter() {
  const [mesa, pinchos, velas] = tablePhotos;
  return (
    <section aria-labelledby="mesa-title" data-tone="light" className="relative overflow-hidden bg-pergamino pb-28 pt-[calc(var(--header-h)+4rem)] md:pb-44">
      <div className="container-editorial">
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5 md:pt-16">
            <p className="eyebrow text-sepia-oscuro">{story.table.eyebrow}</p>
            <h1 id="mesa-title" className="display mt-6 text-[clamp(2.5rem,5.4vw,5rem)]">
              {story.table.title.split(" ").map((word, i) => (
                <motion.span
                  key={i}
                  className="mr-[0.22em] inline-block"
                  initial={{ opacity: 0, y: "0.35em" }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.2 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                >
                  {word}
                </motion.span>
              ))}
            </h1>
            <p className="mt-8 max-w-[40ch] text-lg leading-relaxed text-sepia-oscuro">{story.table.body}</p>
          </div>
          {mesa && <PhotoFigure photo={mesa} ratio={4 / 3} className="md:col-span-7" priority />}
        </div>

        <div className="mt-16 grid items-end gap-14 md:mt-28 md:grid-cols-12 md:gap-8">
          {pinchos && <PhotoFigure photo={pinchos} ratio={1} className="md:col-span-5" delay={0.1} />}
          {velas && <PhotoFigure photo={velas} ratio={3 / 2} className="md:col-span-6 md:col-start-7 md:-mb-16" delay={0.2} />}
        </div>

        <p className="mt-24 max-w-[48ch] text-sm leading-relaxed text-sepia-oscuro md:mt-36">{story.table.moderation}</p>
      </div>
    </section>
  );
}
