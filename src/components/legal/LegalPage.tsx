import type { ReactNode } from "react";
import type { Field } from "@/content/types";

/** Plantilla común de las páginas legales. */
export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <article data-tone="light" className="bg-pergamino pb-28 pt-[calc(var(--header-h)+4rem)]">
      <div className="container-editorial max-w-3xl">
        <p className="eyebrow text-sepia-oscuro">Información legal</p>
        <h1 className="display mt-5 text-[clamp(2.5rem,5vw,4rem)]">{title}</h1>
        <p className="mt-4 text-sm text-sepia-oscuro">Última actualización: {updated}</p>
        <div className="legal-prose mt-12">{children}</div>
      </div>
    </article>
  );
}

/** Muestra un dato confirmado o, si falta, un aviso visible de dato pendiente (nunca un dato inventado). */
export function Value({ field, fallback }: { field: Field<string>; fallback: string }) {
  if (field.status === "confirmed") return <>{field.value}</>;
  return (
    <mark className="rounded-sm bg-oro/20 px-1.5 py-0.5 text-[0.92em] text-tinta" title="Dato pendiente de completar por el titular">
      [Pendiente: {field.note ?? fallback}]
    </mark>
  );
}
