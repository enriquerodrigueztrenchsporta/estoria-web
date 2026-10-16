"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { AGE_EVENT, readAgeConfirmed, readConsent, saveConsent, useCookieSettingsRequest } from "@/lib/consent";

/**
 * Aviso y configuración de cookies (criterios de la Guía de cookies de la AEPD, 2023):
 * aceptar y rechazar con el mismo peso visual, configuración por finalidades,
 * sin casillas premarcadas y posibilidad de cambiar la decisión desde el pie de página.
 */
export function CookieBanner() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    // Se muestra tras la verificación de edad para no superponer dos diálogos
    const check = () => {
      if (!readConsent() && readAgeConfirmed()) setOpen(true);
    };
    check();
    window.addEventListener(AGE_EVENT, check);
    return () => window.removeEventListener(AGE_EVENT, check);
  }, []);

  useEffect(() => {
    if (open) setAnalytics(readConsent()?.analytics ?? false);
  }, [open]);

  const openSettings = useCallback(() => {
    setOpen(true);
    setSettings(true);
  }, []);
  useCookieSettingsRequest(openSettings);

  const decide = (value: boolean) => {
    saveConsent(value);
    setOpen(false);
    setSettings(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="false"
          aria-labelledby="cookies-titulo"
          className="fixed inset-x-3 bottom-3 z-[80] mx-auto max-w-3xl border border-tinta/15 bg-pergamino p-6 text-tinta shadow-[0_30px_80px_-30px_rgba(18,10,12,0.6)] md:inset-x-6 md:bottom-6 md:p-8"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 id="cookies-titulo" className="display text-2xl">
            Cookies y privacidad
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-sepia-oscuro">
            Esta web solo utiliza almacenamiento técnico necesario para funcionar (recordar tu confirmación de edad y esta
            elección). No usamos cookies de análisis ni de publicidad. Si en el futuro las incorporamos, solo se activarán con tu
            consentimiento. Más información en la{" "}
            <Link href="/cookies/" className="underline underline-offset-2" onClick={() => setOpen(false)}>
              Política de cookies
            </Link>
            .
          </p>

          {settings && (
            <fieldset className="mt-6 space-y-4 border-t border-tinta/15 pt-6">
              <legend className="sr-only">Configuración por finalidades</legend>
              <label className="flex items-start justify-between gap-6 text-sm">
                <span>
                  <span className="font-medium">Técnicas (necesarias)</span>
                  <span className="mt-1 block text-sepia-oscuro">Permiten que la web funcione. No se pueden desactivar.</span>
                </span>
                <input type="checkbox" checked disabled className="mt-1 h-4 w-4 accent-borgona" />
              </label>
              <label className="flex items-start justify-between gap-6 text-sm">
                <span>
                  <span className="font-medium">Análisis</span>
                  <span className="mt-1 block text-sepia-oscuro">Medición anónima de visitas. Actualmente no se utiliza ninguna herramienta.</span>
                </span>
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="mt-1 h-4 w-4 accent-borgona"
                />
              </label>
            </fieldset>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={() => decide(false)} className="eyebrow flex-1 border border-tinta px-5 py-3.5 hover:bg-tinta hover:text-pergamino sm:flex-none">
              Rechazar
            </button>
            <button type="button" onClick={() => decide(true)} className="eyebrow flex-1 border border-tinta px-5 py-3.5 hover:bg-tinta hover:text-pergamino sm:flex-none">
              Aceptar
            </button>
            {settings ? (
              <button type="button" onClick={() => decide(analytics)} className="eyebrow flex-1 bg-tinta px-5 py-3.5 text-pergamino hover:bg-borgona sm:flex-none">
                Guardar selección
              </button>
            ) : (
              <button type="button" onClick={() => setSettings(true)} className="eyebrow flex-1 px-5 py-3.5 underline underline-offset-4 sm:flex-none">
                Configurar
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
