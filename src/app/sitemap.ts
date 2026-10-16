import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const main = site.nav.map((n) => ({ url: `${site.url}${n.href}`, changeFrequency: "monthly" as const, priority: n.href === "/" ? 1 : 0.8 }));
  const legal = site.legalNav.map((n) => ({ url: `${site.url}${n.href}`, changeFrequency: "yearly" as const, priority: 0.3 }));
  return [...main, ...legal];
}
