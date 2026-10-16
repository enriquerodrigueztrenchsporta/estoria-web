"use client";

import { motion } from "motion/react";
import { attribution, type Photo } from "@/content/credits";
import { asset } from "@/lib/asset";

type Props = {
  photo: Photo;
  /** Proporción del marco (ancho/alto). Por defecto, la de la foto. */
  ratio?: number;
  className?: string;
  delay?: number;
  /** Tono del fondo sobre el que va el pie de foto */
  tone?: "light" | "dark";
  priority?: boolean;
};

/** Fotografía editorial con su crédito obligatorio (autor y licencia enlazados). */
export function PhotoFigure({ photo, ratio, className = "", delay = 0, tone = "light", priority = false }: Props) {
  const muted = tone === "dark" ? "text-pergamino/70" : "text-sepia-oscuro";
  return (
    <motion.figure
      className={className}
      initial={{ clipPath: "inset(10% 0% 10% 0%)", opacity: 0.4 }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1], delay }}
    >
      <div className="relative overflow-hidden bg-papel" style={{ aspectRatio: ratio ?? photo.width / photo.height }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset(photo.src)}
          srcSet={`${asset(photo.srcSmall)} 1200w, ${asset(photo.src)} 2400w`}
          sizes="(min-width: 768px) 60vw, 100vw"
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>
      <figcaption className={`mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-xs ${muted}`}>
        {photo.place && <span className="eyebrow">{photo.place}</span>}
        <span>
          <a href={photo.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline">
            {attribution(photo)}
          </a>
        </span>
      </figcaption>
    </motion.figure>
  );
}
