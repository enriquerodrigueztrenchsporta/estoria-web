import type { Metadata } from "next";
import { ContactSection } from "@/components/forms/ContactSection";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Escribe a ESTORIA: información de producto, distribución, hostelería y comercios, colaboraciones o disponibilidad.",
  alternates: { canonical: `${site.url}/contacto/` },
};

export default function Contacto() {
  return <ContactSection />;
}
