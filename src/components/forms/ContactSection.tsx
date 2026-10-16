import { story } from "@/content/copy";
import { contactDetails, stockists } from "@/content/site";
import { InquiryForm } from "./InquiryForm";

export function ContactSection() {
  const email = contactDetails.email.status === "confirmed" ? contactDetails.email.value : null;
  return (
    <section id="contacto" aria-labelledby="contacto-title" data-tone="light" className="bg-marfil py-28 md:py-40">
      <div className="container-editorial grid gap-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="eyebrow text-sepia-oscuro">{story.contact.eyebrow}</p>
          <h2 id="contacto-title" className="display mt-6 text-[clamp(3rem,7vw,6rem)]">
            {story.contact.title}
          </h2>
          <p className="mt-6 max-w-[36ch] text-lg leading-relaxed text-sepia-oscuro">{story.contact.body}</p>
          {email && (
            <a href={`mailto:${email}`} className="link-underline display mt-8 inline-block text-2xl">
              {email}
            </a>
          )}

          <div className="mt-16 border-t border-tinta/15 pt-8">
            <h3 className="eyebrow text-sepia-oscuro">Dónde encontrar ESTORIA</h3>
            {stockists.length > 0 ? (
              <ul className="mt-6 space-y-4">
                {stockists.map((s) => (
                  <li key={`${s.name}-${s.city}`} className="flex items-baseline justify-between gap-4 border-b border-tinta/10 pb-3">
                    <span className="display text-xl">{s.url ? <a href={s.url} className="link-underline">{s.name}</a> : s.name}</span>
                    <span className="eyebrow text-sepia-oscuro">
                      {s.city} · {s.kind}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 max-w-[38ch] leading-relaxed text-sepia-oscuro">
                Pronto publicaremos los establecimientos donde encontrar ESTORIA. Si te interesa ofrecerlo, escríbenos
                desde el <a href="#profesionales" className="link-underline text-borgona">acceso para profesionales</a>.
              </p>
            )}
          </div>
        </div>
        <div className="md:col-span-6 md:col-start-7 md:pt-4">
          <InquiryForm kind="general" />
        </div>
      </div>
    </section>
  );
}
