"use client";

import { useEffect, useState } from "react";

/**
 * Preferencias de cookies y almacenamiento (LSSI art. 22.2 y Guía de cookies de la AEPD).
 * Hoy la web no usa cookies de análisis ni publicidad: solo almacenamiento técnico.
 * Si en el futuro se añade analítica, debe cargarse únicamente cuando `useConsent().analytics` sea true.
 */
import { AGE_KEY, CONSENT_KEY } from "./storage-keys";

/** Subir la versión obliga a pedir de nuevo el consentimiento (p. ej., al añadir nuevas finalidades). */
export const CONSENT_VERSION = 1;
const OPEN_EVENT = "estoria:open-cookie-settings";
const CHANGE_EVENT = "estoria:consent-change";
export const AGE_EVENT = "estoria:age-confirmed";

export type Consent = {
  version: number;
  /** Fecha ISO de la decisión, para poder acreditarla */
  date: string;
  analytics: boolean;
};

export function readConsent(): Consent | null {
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const c = JSON.parse(raw) as Consent;
    return c.version === CONSENT_VERSION ? c : null;
  } catch {
    return null;
  }
}

export function saveConsent(analytics: boolean): Consent {
  const c: Consent = { version: CONSENT_VERSION, date: new Date().toISOString(), analytics };
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(c));
  } catch {
    /* almacenamiento no disponible: la elección vale solo para esta visita */
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: c }));
  return c;
}

/** Abre el panel de configuración de cookies desde cualquier parte (pie, política de cookies). */
export const openCookieSettings = () => window.dispatchEvent(new Event(OPEN_EVENT));

export function useCookieSettingsRequest(onOpen: () => void) {
  useEffect(() => {
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, [onOpen]);
}

/** Consentimiento vigente (null = aún no decidido). */
export function useConsent(): Consent | null {
  const [c, setC] = useState<Consent | null>(null);
  useEffect(() => {
    setC(readConsent());
    const on = (e: Event) => setC((e as CustomEvent<Consent>).detail);
    window.addEventListener(CHANGE_EVENT, on);
    return () => window.removeEventListener(CHANGE_EVENT, on);
  }, []);
  return c;
}

let ageConfirmedThisVisit = false;

export function readAgeConfirmed(): boolean {
  if (ageConfirmedThisVisit) return true;
  try {
    return window.localStorage.getItem(AGE_KEY) === "si";
  } catch {
    return false;
  }
}

export function saveAgeConfirmed() {
  ageConfirmedThisVisit = true;
  try {
    window.localStorage.setItem(AGE_KEY, "si");
  } catch {
    /* sin almacenamiento: se volverá a preguntar en la próxima visita */
  }
  window.dispatchEvent(new Event(AGE_EVENT));
}
