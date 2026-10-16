"use client";

import { motion } from "motion/react";
import { story } from "@/content/copy";
import { tablePhotos } from "@/content/editorial";
import { PhotoSlot } from "./PhotoSlot";

/** "Las buenas historias siempre encuentran una mesa." Composición de revista, no de tarjetas. */
export function TableChapter() {
  const [mesa, detalle, sobremesa] = tablePhotos;
  return (
    <section aria-labelledby="mesa-title" data-tone="light" className="relative overflow-hidden bg-pergamino py-28 md:py-44">
      <div className="container-editorial">
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5 md:pt-24">
            <p className="eyebrow text-sepia-oscuro">{story.table.eyebrow}</p>
            <h2 id="mesa-title" className="display mt-6 text-[clamp(2.5rem,5.4vw,5rem)]">
              {story.table.title.split(" ").map((word, i) => (
                <motion.span
                  key={i}
                  className="mr-[0.22em] inline-block"
                  initial={{ opacity: 0, y: "0.35em" }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20% 0px" }}
                  transition={{ duration: 1, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                >
                  {word}
                </motion.span>
              ))}
            </h2>
            <p className="mt-8 max-w-[40ch] text-lg leading-relaxed text-sepia-oscuro">{story.table.body}</p>
          </div>
          {mesa && <PhotoSlot photo={mesa} ratio={4 / 5} className="md:col-span-6 md:col-start-7" />}
        </div>

        <div className="mt-16 grid items-end gap-8 md:mt-28 md:grid-cols-12">
          {detalle && <PhotoSlot photo={detalle} ratio={1} className="md:col-span-4" delay={0.1} />}
          {sobremesa && <PhotoSlot photo={sobremesa} ratio={16 / 10} className="md:col-span-7 md:col-start-6 md:-mb-16" delay={0.2} />}
        </div>

        <p className="mt-24 max-w-[48ch] text-sm leading-relaxed text-sepia-oscuro md:mt-36">
          ESTORIA invita a disfrutar del vino con calma y con moderación. Venta y consumo reservados a mayores de 18 años.
        </p>
      </div>
    </section>
  );
}
