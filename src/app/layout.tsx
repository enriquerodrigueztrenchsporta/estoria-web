import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/layout/Footer";
import { AgeGate } from "@/components/legal/AgeGate";
import { CookieBanner } from "@/components/legal/CookieBanner";
import { site } from "@/content/site";
import "./globals.css";

// next/font descarga las tipografías al compilar y las sirve desde el propio sitio (sin peticiones a Google)
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "ESTORIA · DOCa Rioja", template: "%s · ESTORIA" },
  description: site.description,
  applicationName: "ESTORIA",
  alternates: { canonical: `${site.url}/` },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: `${site.url}/`,
    siteName: "ESTORIA",
    title: "ESTORIA · DOCa Rioja",
    description: site.tagline,
    images: [{ url: `${site.url}/media/og-estoria.jpg`, width: 1200, height: 630, alt: "Etiqueta de ESTORIA Tempranillo, DOCa Rioja" }],
  },
  twitter: { card: "summary_large_image", title: "ESTORIA · DOCa Rioja", description: site.tagline },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#120a0c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${cormorant.variable} ${inter.variable}`}>
      <body>
        <a href="#contenido" className="sr-only-focusable fixed left-4 top-4 z-[100] bg-tinta px-4 py-3 text-sm text-pergamino">
          Saltar al contenido
        </a>
        <Header />
        <main id="contenido">{children}</main>
        <Footer />
        <AgeGate />
        <CookieBanner />
      </body>
    </html>
  );
}
