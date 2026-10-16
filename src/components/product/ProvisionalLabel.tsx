import type { Wine } from "@/content/types";

/**
 * Representación PROVISIONAL de un vino sin etiqueta aprobada.
 * No imita la etiqueta definitiva ni inventa ilustraciones: solo tipografía y un rótulo explícito.
 */
export function ProvisionalLabel({ wine }: { wine: Wine }) {
  return (
    <figure className="flex h-full items-center">
      <div
        role="img"
        aria-label={`Representación provisional de ${wine.name} ${wine.variety}. La etiqueta definitiva está en desarrollo.`}
        className="relative flex aspect-[1122/1402] h-[min(56svh,30rem)] flex-col items-center justify-center border border-dashed border-sepia/60 bg-marfil/80 px-8 text-center text-tinta shadow-[0_40px_80px_-50px_rgba(36,32,29,0.5)]"
      >
        <span className="eyebrow text-sepia-oscuro">DOCa Rioja</span>
        <span className="wordmark mt-6 text-4xl">{wine.name}</span>
        <span aria-hidden className="mt-6 block h-px w-16 bg-oro" />
        <span className="display mt-6 text-2xl uppercase tracking-[0.18em]">{wine.variety}</span>
      </div>
      <figcaption className="sr-only">Etiqueta en desarrollo</figcaption>
      <span className="eyebrow absolute left-1/2 top-[6%] -translate-x-1/2 whitespace-nowrap bg-tinta px-3 py-1.5 text-marfil">
        Etiqueta en desarrollo · provisional
      </span>
    </figure>
  );
}
