import Link from "next/link";
import { story } from "@/content/copy";
import { media } from "@/content/media";
import { riojaPhotos } from "@/content/site";
import { asset } from "@/lib/asset";
import { LabelCrop } from "@/components/ui/LabelCrop";
import { PhotoFigure } from "@/components/editorial/PhotoFigure";

/**
 * Versión sin movimiento del recorrido (prefers-reduced-motion).
 * Mismo contenido y mismo orden narrativo, presentado como capítulos estáticos.
 */
export function StaticJourney() {
  const bottle = media.tempranilloBottle;
  return (
    <section data-tone="dark" aria-label="La historia de ESTORIA">
      <div className="relative flex min-h-svh flex-col items-center justify-end overflow-hidden bg-noche px-[var(--gutter)] pb-12 pt-28 text-pergamino">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset(bottle.src)}
          alt={bottle.alt}
          width={bottle.width}
          height={bottle.height}
          className="absolute left-1/2 top-[45%] h-[62svh] w-auto -translate-x-1/2 -translate-y-1/2 [mask-image:radial-gradient(ellipse_58%_56%_at_48.5%_48%,#000_62%,transparent_100%)]"
        />
        <div className="relative text-center">
          <p className="eyebrow text-oro-claro">{story.hero.eyebrow}</p>
          <h1 className="wordmark mt-3 text-[clamp(2.75rem,7vw,6rem)] leading-none">{story.hero.title}</h1>
          <p className="display mt-4 text-2xl italic">{story.hero.tagline}</p>
        </div>
      </div>

      <div className="bg-papel px-[var(--gutter)] py-24 text-center">
        <LabelCrop cx={0.5} cy={0.52} span={0.94} ratio={2.2} className="mx-auto max-w-6xl" />
        <h2 className="display mt-12 text-5xl">{story.origin.title}</h2>
        <p className="display mt-3 text-4xl italic text-borgona">{story.origin.subtitle}</p>
      </div>

      <div className="bg-pergamino px-[var(--gutter)] py-24">
        <h2 className="sr-only">Rioja</h2>
        <div className="mx-auto grid max-w-6xl gap-12">
          {story.rioja.map((line, i) => (
            <div key={line}>
              {riojaPhotos[i] && <PhotoFigure photo={riojaPhotos[i]!} ratio={16 / 9} />}
              <p className="display mt-6 text-3xl">{line}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-pergamino px-[var(--gutter)] pb-24 text-center">
        <h2 className="display text-4xl md:text-5xl">{story.return.title}</h2>
        <Link href="/vinos/" className="link-underline eyebrow mt-8 inline-block pb-1 text-borgona">
          Conocer los vinos
        </Link>
      </div>
    </section>
  );
}
