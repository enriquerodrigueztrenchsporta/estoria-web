"use client";

import { motion } from "motion/react";
import type { EditorialPhoto } from "@/content/editorial";
import { asset } from "@/lib/asset";

/**
 * Marco fotográfico editorial. Si la fotografía aún no existe, muestra un marco provisional
 * con trama de grabado y el encargo fotográfico, rotulado como pendiente.
 */
export function PhotoSlot({ photo, ratio, className = "", delay = 0 }: { photo: EditorialPhoto; ratio: number; className?: string; delay?: number }) {
  return (
    <motion.figure
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio: ratio }}
      initial={{ clipPath: "inset(12% 0% 12% 0%)", opacity: 0.4 }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {photo.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={asset(photo.src)} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full flex-col justify-between bg-papel p-5 text-sepia-oscuro md:p-7 [background-image:repeating-linear-gradient(135deg,rgba(132,107,83,0.13)_0_1px,transparent_1px_7px)]">
          <span className="eyebrow self-start bg-papel/90 px-2 py-1">Fotografía pendiente</span>
          <figcaption className="max-w-[38ch] bg-papel/90 p-2 text-sm leading-relaxed">
            <span className="sr-only">Marco provisional. </span>
            {photo.brief}
          </figcaption>
        </div>
      )}
    </motion.figure>
  );
}
