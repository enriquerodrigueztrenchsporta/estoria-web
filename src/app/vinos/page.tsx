import type { Metadata } from "next";
import { WineShowcase } from "@/components/product/WineShowcase";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Nuestros vinos",
  description: "ESTORIA Tempranillo y ESTORIA Viura, vinos de la Denominación de Origen Calificada Rioja. Descubre cada botella en 360 grados.",
  alternates: { canonical: `${site.url}/vinos/` },
};

export default function Vinos() {
  return <WineShowcase />;
}
