import type { Metadata } from "next";
import { TableChapter } from "@/components/editorial/TableChapter";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "La mesa",
  description: "Las buenas historias siempre encuentran una mesa. ESTORIA, para compartir con calma.",
  alternates: { canonical: `${site.url}/mesa/` },
};

export default function Mesa() {
  return <TableChapter />;
}
