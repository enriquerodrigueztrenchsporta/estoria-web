import { story } from "@/content/copy";
import { media } from "@/content/media";
import { asset } from "@/lib/asset";
import { LabelCrop } from "@/components/ui/LabelCrop";

/**
 * Versión sin movimiento del recorrido (prefers-reduced-motion).
 * Mismo contenido y mismo orden narrativo, presentado como capítulos estáticos.
 */
export function StaticJourney() {
  const bottle = media.tempranilloBottle;
  return (
    <section id="historia" data-tone="dark" aria-label="La historia de ESTORIA">
      <div className="relative flex min-h-svh flex-col items-center justify-end overflow-hidden bg-noche px-[var(--gutter)] pb-12 pt-28 text-pergamino">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset(bottle.src)}
          alt={bottle.alt}
          width={bottle.width}
          height={bottle.height}
          className="absolute left-1/2 top-1/2 h-[82svh] w-auto -translate-x-1/2 -translate-y-1/2 [mask-image:radial-gradient(ellipse_58%_56%_at_48.5%_48%,#000_62%,transparent_100%)]"
        />
        <div className="relative text-center">
          <p className="eyebrow text-oro-claro">{story.hero.eyebrow}</p>
          <h1 className="wordmark mt-3 text-[clamp(2.75rem,7vw,6rem)] leading-none">{story.hero.title}</h1>
          <p className="display mt-4 text-2xl italic">{story.hero.tagline}</p>
        </div>
      </div>

      <div className="bg-papel px-[var(--gutter)] py-24">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-3">
          {(["rioja", "nombre", "grabado"] as const).map((id, i) => (
            <figure key={id}>
              <LabelCrop cx={id === "rioja" ? 0.5 : id === "nombre" ? 0.5 : 0.62} cy={id === "rioja" ? 0.1 : id === "nombre" ? 0.305 : 0.5} span={id === "grabado" ? 0.42 : 0.8} ratio={4 / 3} />
              <figcaption className="display mt-4 text-2xl italic">{story.label[i]?.text}</figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div id="rioja" className="bg-papel px-[var(--gutter)] pb-24 text-center">
        <LabelCrop cx={0.5} cy={0.52} span={0.94} ratio={2.2} className="mx-auto max-w-6xl" />
        <h2 className="display mt-12 text-5xl">{story.origin.title}</h2>
        <p className="display mt-3 text-4xl italic text-borgona">{story.origin.subtitle}</p>
        <ul className="mx-auto mt-16 max-w-xl space-y-4">
          {story.rioja.map((line) => (
            <li key={line} className="display text-3xl">
              {line}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-pergamino px-[var(--gutter)] py-24 text-center">
        <h2 className="display text-4xl md:text-5xl">{story.return.title}</h2>
      </div>
    </section>
  );
}
