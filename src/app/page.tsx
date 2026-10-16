import { Header } from "@/components/navigation/Header";
import { CinematicJourney } from "@/components/scenes/CinematicJourney";
import { WineShowcase } from "@/components/product/WineShowcase";
import { LabelExplorer } from "@/components/product/LabelExplorer";
import { TableChapter } from "@/components/editorial/TableChapter";
import { BrandUniverse } from "@/components/editorial/BrandUniverse";
import { ProfessionalSection } from "@/components/forms/ProfessionalSection";
import { ContactSection } from "@/components/forms/ContactSection";
import { Footer } from "@/components/layout/Footer";
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
      <Header />
      <main id="contenido">
        <CinematicJourney />
        <WineShowcase />
        <LabelExplorer />
        <TableChapter />
        <BrandUniverse />
        <ProfessionalSection />
        <ContactSection />
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
