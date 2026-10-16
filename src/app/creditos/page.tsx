import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { allPhotos, audioCredits } from "@/content/credits";
import { site } from "@/content/site";
import { asset } from "@/lib/asset";

export const metadata: Metadata = {
  title: "Créditos",
  alternates: { canonical: `${site.url}/creditos/` },
};

export default function Creditos() {
  return (
    <LegalPage title="Créditos" updated="16 de octubre de 2026">
      <p>
        La etiqueta, la fotografía de la botella y la identidad de ESTORIA pertenecen a su titular. Las siguientes fotografías,
        la música y la voz son obra de terceros y se publican conforme a sus licencias libres. Las fotografías proceden de
        Wikimedia Commons. Las licencias
        Creative Commons BY-SA permiten el uso, incluso comercial, citando autor y licencia; las adaptaciones se comparten con
        la misma licencia.
      </p>
      <ul className="!list-none !pl-0">
        {allPhotos.map((p) => (
          <li key={p.id} className="grid gap-4 border-b border-tinta/15 py-6 sm:grid-cols-[10rem_1fr]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset(p.srcSmall)} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover" />
            <div className="text-sm">
              <p className="font-medium">{p.alt}</p>
              {p.place && <p className="text-sepia-oscuro">{p.place}</p>}
              <p className="mt-2">
                Autor: {p.author} · Licencia:{" "}
                <a href={p.licenseUrl} target="_blank" rel="noopener noreferrer">
                  {p.license}
                </a>{" "}
                ·{" "}
                <a href={p.sourceUrl} target="_blank" rel="noopener noreferrer">
                  Original en Wikimedia Commons
                </a>
              </p>
              <p className="text-sepia-oscuro">Cambios: {p.changes}</p>
            </div>
          </li>
        ))}
      </ul>

      <h2>Música y voz del recorrido</h2>
      <ul className="!list-none !pl-0">
        {audioCredits.map((c) => (
          <li key={c.id} className="border-b border-tinta/15 py-6 text-sm">
            <p className="font-medium">{c.what}</p>
            <p className="text-sepia-oscuro">{c.detail}</p>
            <p className="mt-2">
              Licencia:{" "}
              <a href={c.licenseUrl} target="_blank" rel="noopener noreferrer">
                {c.license}
              </a>{" "}
              ·{" "}
              <a href={c.sourceUrl} target="_blank" rel="noopener noreferrer">
                {c.sourceLabel}
              </a>
            </p>
            <p className="text-sepia-oscuro">Cambios: {c.changes}</p>
          </li>
        ))}
      </ul>
    </LegalPage>
  );
}
