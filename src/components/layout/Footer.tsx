import { site } from "@/content/site";

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
              {[...site.nav, site.professionalLink].map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="link-underline pb-0.5 text-pergamino/80 hover:text-pergamino">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="text-sm leading-relaxed text-pergamino/70 md:col-span-2">
            <p className="eyebrow text-oro-claro">DOCa Rioja</p>
            <p className="mt-3">Tempranillo · Viura</p>
          </div>
        </div>

        <div className="rule mt-20 text-pergamino" />
        <div className="mt-6 flex flex-col gap-3 text-xs text-pergamino/65 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} ESTORIA. Disfruta de un consumo responsable. Venta reservada a mayores de 18 años.</p>
          <p>Aviso legal, privacidad y cookies: en preparación.</p>
        </div>
      </div>
    </footer>
  );
}
