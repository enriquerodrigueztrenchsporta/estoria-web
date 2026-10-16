import { CinematicJourney } from "@/components/scenes/CinematicJourney";
import { BrandIntro } from "@/components/brand/BrandIntro";
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

      <BrandIntro />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
