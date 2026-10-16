"use client";

import { useEffect, useRef } from "react";
import type { Wine } from "@/content/types";
import { confirmedTechnical, publicFacts } from "@/content/wines";

/** Ficha del vino en un <dialog> nativo (foco atrapado y Escape incluidos). */
export function WineSheet({ wine, open, onClose }: { wine: Wine; open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const technical = confirmedTechnical(wine);
  const titleId = `ficha-${wine.slug}`;

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className="m-auto w-[min(92vw,40rem)] bg-pergamino p-0 text-tinta backdrop:bg-noche/70 backdrop:backdrop-blur-sm"
    >
      <div className="relative p-8 md:p-12">
        <button
          type="button"
          onClick={onClose}
          className="eyebrow absolute right-6 top-6 flex h-11 items-center px-2 text-sepia-oscuro hover:text-tinta"
        >
          Cerrar
        </button>
        <p className="wordmark text-sm tracking-[0.42em] text-borgona">{wine.name}</p>
        <h3 id={titleId} className="display mt-3 text-5xl uppercase">
          {wine.variety}
        </h3>
        <div className="rule my-8 text-sepia" />

        <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {[...publicFacts(wine), ...technical].map((f) => (
            <div key={f.label}>
              <dt className="eyebrow text-sepia-oscuro">{f.label}</dt>
              <dd className="display mt-1 text-xl">{f.value}</dd>
            </div>
          ))}
        </dl>

        {technical.length === 0 && (
          <p className="mt-10 border-l border-oro pl-4 text-sm leading-relaxed text-sepia-oscuro">
            La ficha técnica completa (añada, crianza, graduación, notas de cata y servicio) se publicará cuando esté
            confirmada por la bodega elaboradora.
          </p>
        )}
        {wine.labelStatus === "en-desarrollo" && (
          <p className="mt-4 text-sm text-sepia-oscuro">La etiqueta definitiva de este vino está en desarrollo.</p>
        )}

        <a href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/contacto/`} onClick={onClose} className="link-underline eyebrow mt-10 inline-block pb-1 text-borgona">
          Solicitar información
        </a>
      </div>
    </dialog>
  );
}
