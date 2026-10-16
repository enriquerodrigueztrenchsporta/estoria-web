"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { site } from "@/content/site";

type Tone = "dark" | "light";

/** Lee el tono (`data-tone`) de la sección que queda bajo la cabecera. */
function useToneUnderHeader(): { tone: Tone; scrolled: boolean } {
  const [state, setState] = useState<{ tone: Tone; scrolled: boolean }>({ tone: "dark", scrolled: false });
  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      const probe = document.elementsFromPoint(window.innerWidth / 2, 36);
      let tone: Tone = "light";
      for (const el of probe) {
        const host = (el as HTMLElement).closest<HTMLElement>("[data-tone]");
        if (host && !host.closest("header[data-site-header]")) {
          tone = host.dataset.tone === "dark" ? "dark" : "light";
          break;
        }
      }
      const scrolled = window.scrollY > 24;
      setState((prev) => (prev.tone === tone && prev.scrolled === scrolled ? prev : { tone, scrolled }));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    // El tono también cambia sin scroll (p. ej. al elegir otro vino)
    const mo = new MutationObserver(onScroll);
    mo.observe(document.body, { subtree: true, attributes: true, attributeFilter: ["data-tone"] });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      mo.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return state;
}

export function Header() {
  const { tone, scrolled } = useToneUnderHeader();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Menú móvil: Escape cierra, foco atrapado y devuelto al botón
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (e.key === "Tab" && panel) {
        const items = [toggleRef.current, ...panel.querySelectorAll<HTMLElement>("a")].filter(Boolean) as HTMLElement[];
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const dark = tone === "dark" && !open;
  const ink = dark ? "text-pergamino" : "text-tinta";
  const surface = open
    ? "bg-pergamino"
    : scrolled
      ? dark
        ? "bg-noche/35 backdrop-blur-md"
        : "bg-pergamino/70 backdrop-blur-md"
      : "bg-transparent";

  return (
    <header data-site-header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-700 ${surface} ${ink}`}>
      <div className="container-editorial flex h-[var(--header-h)] items-center justify-between">
        <a href="#historia" className="wordmark text-lg tracking-[0.3em]" onClick={() => setOpen(false)} aria-label="ESTORIA, inicio">
          ESTORIA
        </a>

        <nav aria-label="Principal" className="hidden items-center gap-10 md:flex">
          <ul className="flex items-center gap-8">
            {site.nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="link-underline eyebrow pb-1 opacity-85 transition-opacity hover:opacity-100">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={site.professionalLink.href}
            className={`eyebrow border px-4 py-2 transition-colors duration-500 ${dark ? "border-pergamino/35 hover:bg-pergamino hover:text-tinta" : "border-tinta/30 hover:bg-tinta hover:text-pergamino"}`}
          >
            {site.professionalLink.label}
          </a>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className="relative -mr-2 flex h-11 w-11 items-center justify-center md:hidden"
          aria-expanded={open}
          aria-controls="menu-movil"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((o) => !o)}
        >
          <span aria-hidden className={`absolute h-px w-6 bg-current transition-transform duration-500 ${open ? "rotate-45" : "-translate-y-1"}`} />
          <span aria-hidden className={`absolute h-px w-6 bg-current transition-transform duration-500 ${open ? "-rotate-45" : "translate-y-1"}`} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-movil"
            ref={panelRef}
            className="overflow-hidden border-t border-tinta/10 bg-pergamino md:hidden"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <nav aria-label="Menú móvil" className="container-editorial py-8">
              <ul className="space-y-1">
                {[...site.nav, site.professionalLink].map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12 + i * 0.05, duration: 0.5 }}
                  >
                    <a href={item.href} onClick={() => setOpen(false)} className="display flex items-baseline gap-4 py-2 text-3xl">
                      <span className="eyebrow text-sepia-oscuro">{String(i + 1).padStart(2, "0")}</span>
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
              <p className="eyebrow mt-8 text-sepia-oscuro">DOCa Rioja</p>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
