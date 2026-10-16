"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { story } from "@/content/copy";

const EASE = [0.22, 1, 0.36, 1] as const;
const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-12% 0px" },
  transition: { duration: 1.1, delay, ease: EASE },
});

/** Presentación de la identidad de ESTORIA, justo después del recorrido de inicio. */
export function BrandIntro() {
  const { brand } = story;
  return (
    <section id="la-marca" aria-labelledby="marca-title" data-tone="light" className="scroll-mt-[var(--header-h)] bg-pergamino py-24 md:py-36">
      <div className="container-editorial">
        <div className="grid gap-10 md:grid-cols-12 md:gap-8">
          <motion.div className="md:col-span-6" {...reveal()}>
            <p className="eyebrow text-sepia-oscuro">{brand.eyebrow}</p>
            <h2 id="marca-title" className="display mt-6 text-[clamp(2.5rem,5.4vw,5rem)]">
              {brand.title}
            </h2>
          </motion.div>
          <div className="md:col-span-5 md:col-start-8 md:pt-12">
            <motion.p className="display text-2xl leading-snug md:text-[1.75rem]" {...reveal(0.1)}>
              {brand.lead}
            </motion.p>
            <motion.p className="mt-8 text-lg leading-relaxed text-sepia-oscuro" {...reveal(0.2)}>
              {brand.body}
            </motion.p>
          </div>
        </div>

        <ul className="mt-20 grid border-t border-tinta/15 md:mt-28 md:grid-cols-3">
          {brand.pillars.map((pillar, i) => (
            <motion.li
              key={pillar.title}
              className="border-b border-tinta/15 py-10 md:border-b-0 md:py-12 md:pr-10 [&:not(:first-child)]:md:border-l [&:not(:first-child)]:md:pl-10"
              {...reveal(0.1 * i)}
            >
              <span className="eyebrow text-sepia-oscuro">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="display mt-4 text-3xl md:text-4xl">{pillar.title}</h3>
              <p className="mt-4 max-w-[34ch] leading-relaxed text-sepia-oscuro">{pillar.text}</p>
            </motion.li>
          ))}
        </ul>

        <motion.div className="mt-16 text-center md:mt-24" {...reveal()}>
          <Link href="/vinos/" className="link-underline eyebrow inline-block pb-1 text-borgona">
            {brand.cta}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
