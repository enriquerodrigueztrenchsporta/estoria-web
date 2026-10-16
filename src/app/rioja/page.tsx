import type { Metadata } from "next";
import { RiojaChapter } from "@/components/editorial/RiojaChapter";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Rioja",
  description: "La tierra guarda memoria y cada historia encuentra su momento. El paisaje de Rioja que inspira a ESTORIA.",
  alternates: { canonical: `${site.url}/rioja/` },
};

export default function Rioja() {
  return <RiojaChapter />;
}
