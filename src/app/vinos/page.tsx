import type { Metadata } from "next";
import { WineShowcase } from "@/components/product/WineShowcase";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Nuestros vinos",
  description: "ESTORIA Tempranillo y ESTORIA Viura, vinos de la Denominación de Origen Calificada Rioja. Tipo, variedad y origen de cada vino.",
  alternates: { canonical: `${site.url}/vinos/` },
};

export default function Vinos() {
  return <WineShowcase />;
}
