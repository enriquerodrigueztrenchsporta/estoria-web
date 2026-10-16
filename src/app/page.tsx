import Link from "next/link";
import { CinematicJourney } from "@/components/scenes/CinematicJourney";
import { story } from "@/content/copy";
import { site } from "@/content/site";
import { wines } from "@/content/wines";

/** Datos estructurados: solo información confirmada (marca, variedad, origen). */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Brand", name: "ESTORIA", slogan: site.tagline, url: `${site.url}/` },
    ...wines.map((w) => ({
      "@type": "Product",
      name: `${w.name} ${w.variety}`,
      brand: { "@type": "Brand", name: "ESTORIA" },
      category: w.type === "tinto" ? "Vino tinto" : "Vino blanco",
      description: w.description,
    })),
  ],
};

export default function Home() {
  return (
    <>
      <CinematicJourney />

      {/* Índice editorial hacia el resto de capítulos */}
      <section aria-labelledby="continua" data-tone="light" className="bg-pergamino pb-28 pt-8 md:pb-40">
        <div className="container-editorial">
          <h2 id="continua" className="eyebrow text-sepia-oscuro">
            {story.next.eyebrow}
          </h2>
          <ul className="mt-8 border-t border-tinta/15">
            {story.next.links.map((l) => (
              <li key={l.href} className="border-b border-tinta/15">
                <Link href={l.href} className="group grid grid-cols-[3rem_1fr_auto] items-baseline gap-4 py-8 md:grid-cols-[5rem_1fr_1fr_auto] md:py-10">
                  <span className="eyebrow text-sepia-oscuro">{l.index}</span>
                  <span className="display text-[clamp(2rem,4.5vw,4rem)] transition-colors group-hover:text-borgona">{l.title}</span>
                  <span className="hidden text-sepia-oscuro md:block">{l.text}</span>
                  <span aria-hidden className="text-2xl transition-transform duration-500 group-hover:translate-x-2">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
