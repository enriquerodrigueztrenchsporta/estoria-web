import { story } from "@/content/copy";
import { contact, stockists } from "@/content/site";
import { InquiryForm } from "./InquiryForm";

export function ContactSection() {
  return (
    <section aria-labelledby="contacto-title" data-tone="light" className="bg-marfil pb-28 pt-[calc(var(--header-h)+4rem)] md:pb-40">
      <div className="container-editorial grid gap-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="eyebrow text-sepia-oscuro">{story.contact.eyebrow}</p>
          <h1 id="contacto-title" className="display mt-6 text-[clamp(3rem,7vw,6rem)]">
            {story.contact.title}
          </h1>
          <p className="mt-6 max-w-[36ch] text-lg leading-relaxed text-sepia-oscuro">{story.contact.body}</p>
          <dl className="mt-10 space-y-6">
            <div>
              <dt className="eyebrow text-sepia-oscuro">Correo electrónico</dt>
              <dd className="mt-2">
                <a href={`mailto:${contact.email}`} className="link-underline display text-2xl">
                  {contact.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow text-sepia-oscuro">Teléfono</dt>
              <dd className="mt-2 flex flex-wrap gap-x-8 gap-y-2">
                {contact.phones.map((p) => (
                  <a key={p.tel} href={`tel:${p.tel}`} className="link-underline display text-2xl">
                    {p.label}
                  </a>
                ))}
              </dd>
            </div>
          </dl>

          <div className="mt-16 border-t border-tinta/15 pt-8">
            <h2 className="eyebrow text-sepia-oscuro">Dónde encontrar ESTORIA</h2>
            {stockists.length > 0 ? (
              <ul className="mt-6 space-y-4">
                {stockists.map((s) => (
                  <li key={`${s.name}-${s.city}`} className="flex items-baseline justify-between gap-4 border-b border-tinta/10 pb-3">
                    <span className="display text-xl">
                      {s.url ? (
                        <a href={s.url} className="link-underline">
                          {s.name}
                        </a>
                      ) : (
                        s.name
                      )}
                    </span>
                    <span className="eyebrow text-sepia-oscuro">
                      {s.city} · {s.kind}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 max-w-[38ch] leading-relaxed text-sepia-oscuro">
                Pronto publicaremos los establecimientos donde encontrar ESTORIA. Si eres restaurante, vinoteca o distribuidor y te
                interesa ofrecerlo, escríbenos con el formulario.
              </p>
            )}
          </div>
        </div>
        <div className="md:col-span-6 md:col-start-7 md:pt-4">
          <InquiryForm />
        </div>
      </div>
    </section>
  );
}
