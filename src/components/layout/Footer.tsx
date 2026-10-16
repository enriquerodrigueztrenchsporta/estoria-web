import Link from "next/link";
import { contact, site } from "@/content/site";
import { CookieSettingsButton } from "@/components/legal/CookieSettingsButton";

export function Footer() {
  return (
    <footer data-tone="dark" className="bg-noche pb-10 pt-24 text-pergamino">
      <div className="container-editorial">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="wordmark text-[clamp(2.5rem,8vw,7rem)] leading-none tracking-[0.18em]">ESTORIA</p>
            <p className="display mt-6 text-2xl italic text-pergamino/80">{site.tagline}</p>
          </div>
          <nav aria-label="Pie de página" className="md:col-span-3 md:col-start-8">
            <ul className="space-y-3">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="link-underline pb-0.5 text-pergamino/80 hover:text-pergamino">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="text-sm leading-relaxed text-pergamino/70 md:col-span-2">
            <p className="eyebrow text-oro-claro">DOCa Rioja</p>
            <p className="mt-3">Tempranillo · Viura</p>
            <p className="eyebrow mt-8 text-oro-claro">Contacto</p>
            <ul className="mt-3 space-y-1">
              <li>
                <a href={`mailto:${contact.email}`} className="hover:text-pergamino">
                  {contact.email}
                </a>
              </li>
              {contact.phones.map((p) => (
                <li key={p.tel}>
                  <a href={`tel:${p.tel}`} className="hover:text-pergamino">
                    {p.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rule mt-20 text-pergamino" />
        <div className="mt-6 flex flex-col gap-4 text-xs text-pergamino/65 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} ESTORIA. Disfruta de un consumo responsable. Venta y consumo reservados a mayores de 18 años.</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {site.legalNav.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-pergamino">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <CookieSettingsButton className="hover:text-pergamino" />
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
