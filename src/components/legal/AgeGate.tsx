"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { readAgeConfirmed, saveAgeConfirmed } from "@/lib/consent";

/**
 * Verificación de mayoría de edad para una web de bebidas alcohólicas.
 * Se muestra en la primera visita; la respuesta afirmativa se recuerda en este navegador.
 */
export function AgeGate() {
  const [state, setState] = useState<"checking" | "ask" | "denied" | "ok">("checking");
  const yesRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setState(readAgeConfirmed() ? "ok" : "ask");
  }, []);

  useEffect(() => {
    if (state !== "ask" && state !== "denied") return;
    document.documentElement.style.overflow = "hidden";
    yesRef.current?.focus();
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [state]);

  const accept = () => {
    saveAgeConfirmed();
    setState("ok");
  };

  return (
    <AnimatePresence>
      {(state === "ask" || state === "denied") && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="edad-titulo"
          aria-describedby="edad-texto"
          className="fixed inset-0 z-[90] flex items-center justify-center bg-noche/96 px-[var(--gutter)] text-pergamino backdrop-blur-sm"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          onKeyDown={(e) => {
            if (e.key !== "Tab") return;
            const items = [...e.currentTarget.querySelectorAll<HTMLElement>("button, a")];
            const first = items[0];
            const last = items[items.length - 1];
            if (e.shiftKey && document.activeElement === first) {
              e.preventDefault();
              last?.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
              e.preventDefault();
              first?.focus();
            }
          }}
        >
          <div className="max-w-md text-center">
            <p className="wordmark text-3xl tracking-[0.3em]">ESTORIA</p>
            <p className="eyebrow mt-3 text-oro-claro">DOCa Rioja</p>
            <div className="rule mx-auto my-10 w-24 text-oro-claro" />
            {state === "ask" ? (
              <>
                <h2 id="edad-titulo" className="display text-3xl">
                  ¿Eres mayor de edad?
                </h2>
                <p id="edad-texto" className="mt-4 text-sm leading-relaxed text-pergamino/75">
                  Para visitar esta web debes tener al menos 18 años.
                </p>
                <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
                  <button ref={yesRef} type="button" onClick={accept} className="eyebrow bg-pergamino px-8 py-4 text-tinta transition-colors hover:bg-oro-claro">
                    Sí, soy mayor de 18 años
                  </button>
                  <button type="button" onClick={() => setState("denied")} className="eyebrow border border-pergamino/40 px-8 py-4 transition-colors hover:bg-pergamino/10">
                    No
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 id="edad-titulo" className="display text-3xl">
                  Lo sentimos.
                </h2>
                <p id="edad-texto" className="mt-4 text-sm leading-relaxed text-pergamino/75">
                  El acceso a esta web está reservado a mayores de 18 años.
                </p>
                <button ref={yesRef} type="button" onClick={() => setState("ask")} className="eyebrow mt-10 border border-pergamino/40 px-8 py-4">
                  Volver
                </button>
              </>
            )}
            <p className="mt-12 text-xs text-pergamino/55">Disfruta del vino con moderación.</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
