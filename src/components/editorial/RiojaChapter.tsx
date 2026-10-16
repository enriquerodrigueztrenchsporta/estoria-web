"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { story } from "@/content/copy";
import { riojaGallery } from "@/content/editorial";
import { LabelCrop } from "@/components/ui/LabelCrop";
import { PhotoFigure } from "./PhotoFigure";

const EASE = [0.22, 1, 0.36, 1] as const;

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
