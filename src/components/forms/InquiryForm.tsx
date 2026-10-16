"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { submitInquiry, type SubmitResult } from "@/lib/submit";
import { contactTopics, emptyInquiry, isValid, validateInquiry, type Errors, type FieldName, type InquiryData } from "@/lib/validation";

type Status = "idle" | "submitting" | SubmitResult["status"];

export function InquiryForm({ endpoint = process.env.NEXT_PUBLIC_FORM_ENDPOINT }: { endpoint?: string }) {
  const uid = useId();
  const [data, setData] = useState<InquiryData>(emptyInquiry);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverMessage, setServerMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const enabled = Boolean(endpoint);

  const set = <K extends keyof InquiryData>(key: K, value: InquiryData[K], touch = false) => {
    const next = { ...data, [key]: value };
    setData(next);
    if (touch) setTouched((x) => ({ ...x, [key]: true }));
    if (touch || touched[key as FieldName]) setErrors(validateInquiry(next));
  };
  const blur = (key: FieldName) => {
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors(validateInquiry(data));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const found = validateInquiry(data);
    setErrors(found);
    setTouched(Object.fromEntries(Object.keys(found).map((k) => [k, true])));
    if (!isValid(found)) {
      const first = Object.keys(found)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      setStatus("idle");
      return;
    }
    setStatus("submitting");
    const result = await submitInquiry(data, endpoint);
    setStatus(result.status);
    setServerMessage(result.status === "error" ? result.message : "");
    if (result.status === "sent") {
      setData(emptyInquiry());
      setTouched({});
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  };

  const field =
    "w-full border-0 border-b border-tinta/30 bg-transparent px-0 py-3 text-base outline-none transition-colors placeholder:opacity-50 focus:border-borgona focus:ring-0";
  const labelCls = "eyebrow block text-sepia-oscuro";
  const id = (k: string) => `${uid}-${k}`;
  const shown = (k: FieldName) => Boolean(errors[k] && touched[k]);
  const describedBy = (k: FieldName) => (shown(k) ? `${id(k)}-error` : undefined);
  const err = (k: FieldName) =>
    shown(k) ? (
      <p id={`${id(k)}-error`} className="mt-2 text-sm text-rojo-etiqueta">
        {errors[k]}
      </p>
    ) : null;

  const input = (k: "name" | "company" | "email" | "phone", labelText: string, opts: { type?: string; autoComplete?: string; optional?: boolean } = {}) => (
    <div>
      <label htmlFor={id(k)} className={labelCls}>
        {labelText}
        {opts.optional && <span className="ml-2 normal-case tracking-normal opacity-70">(opcional)</span>}
      </label>
      <input
        id={id(k)}
        name={k}
        type={opts.type ?? "text"}
        autoComplete={opts.autoComplete}
        required={!opts.optional}
        aria-required={!opts.optional}
        aria-invalid={shown(k)}
        aria-describedby={describedBy(k)}
        value={data[k]}
        onChange={(e) => set(k, e.target.value)}
        onBlur={() => blur(k)}
        className={field}
      />
      {err(k)}
    </div>
  );

  const errorCount = Object.keys(errors).filter((k) => touched[k as FieldName]).length;

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} aria-describedby={enabled ? undefined : `${uid}-disabled`} className="grid gap-8">
      {!enabled && (
        <p id={`${uid}-disabled`} className="border-l-2 border-oro pl-4 text-sm leading-relaxed text-sepia-oscuro">
          El envío online todavía no está activo. Puedes revisar el formulario, pero aún no se enviará ningún dato.
        </p>
      )}

      <div className="grid gap-8 sm:grid-cols-2">
        {input("name", "Nombre", { autoComplete: "name" })}
        {input("company", "Empresa o establecimiento", { autoComplete: "organization", optional: true })}
      </div>
      <div className="grid gap-8 sm:grid-cols-2">
        {input("email", "Correo electrónico", { type: "email", autoComplete: "email" })}
        {input("phone", "Teléfono", { type: "tel", autoComplete: "tel", optional: true })}
      </div>

      <fieldset aria-describedby={describedBy("topic")}>
        <legend className={labelCls}>Motivo de la consulta</legend>
        <div className="mt-4 flex flex-wrap gap-3">
          {contactTopics.map((t) => {
            const on = data.topic === t;
            return (
              <label
                key={t}
                className={`cursor-pointer border px-4 py-2.5 text-sm transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-oro ${
                  on ? "border-tinta bg-tinta text-pergamino" : "border-tinta/25 hover:border-tinta/60"
                }`}
              >
                <input type="radio" name="topic" value={t} checked={on} onChange={() => set("topic", t, true)} className="sr-only" />
                {t}
              </label>
            );
          })}
        </div>
        {err("topic")}
      </fieldset>

      <div>
        <label htmlFor={id("message")} className={labelCls}>
          Mensaje
        </label>
        <textarea
          id={id("message")}
          name="message"
          rows={4}
          required
          aria-required
          aria-invalid={shown("message")}
          aria-describedby={describedBy("message")}
          value={data.message}
          onChange={(e) => set("message", e.target.value)}
          onBlur={() => blur("message")}
          className={`${field} resize-y`}
        />
        {err("message")}
      </div>

      {/* Campo trampa anti-spam, invisible para personas */}
      <div aria-hidden className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor={id("website")}>No rellenar</label>
        <input id={id("website")} name="website" tabIndex={-1} autoComplete="off" value={data.website} onChange={(e) => set("website", e.target.value)} />
      </div>

      {/* Información básica de protección de datos (primera capa, RGPD art. 13) */}
      <div className="border border-tinta/15 bg-marfil/60 p-5 text-xs leading-relaxed text-sepia-oscuro">
        <p className="eyebrow mb-3 text-tinta">Información básica sobre protección de datos</p>
        <dl className="grid gap-1.5 sm:grid-cols-[8rem_1fr]">
          <dt className="font-medium text-tinta">Responsable</dt>
          <dd>El titular de ESTORIA (ver aviso legal).</dd>
          <dt className="font-medium text-tinta">Finalidad</dt>
          <dd>Responder a tu consulta. No enviamos publicidad.</dd>
          <dt className="font-medium text-tinta">Legitimación</dt>
          <dd>Tu consentimiento.</dd>
          <dt className="font-medium text-tinta">Destinatarios</dt>
          <dd>El proveedor técnico que recibe el formulario, como encargado del tratamiento. No se ceden datos a terceros.</dd>
          <dt className="font-medium text-tinta">Derechos</dt>
          <dd>Acceso, rectificación, supresión, oposición, limitación y portabilidad.</dd>
        </dl>
        <p className="mt-3">
          Más información en la{" "}
          <Link href="/privacidad/" className="underline underline-offset-2 hover:text-tinta">
            Política de privacidad
          </Link>
          .
        </p>
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed">
          <input
            type="checkbox"
            name="privacy"
            required
            aria-required
            checked={data.privacy}
            onChange={(e) => set("privacy", e.target.checked, true)}
            aria-invalid={shown("privacy")}
            aria-describedby={describedBy("privacy")}
            className="mt-1 h-4 w-4 shrink-0 accent-borgona"
          />
          <span className="text-sepia-oscuro">
            He leído y acepto la{" "}
            <Link href="/privacidad/" className="text-tinta underline underline-offset-2">
              Política de privacidad
            </Link>{" "}
            y consiento el tratamiento de mis datos para responder a esta consulta.
          </span>
        </label>
        {err("privacy")}
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="eyebrow bg-tinta px-8 py-4 text-pergamino transition-colors duration-500 hover:bg-borgona disabled:opacity-60"
        >
          {status === "submitting" ? "Enviando…" : "Enviar consulta"}
        </button>
        {errorCount > 0 && status !== "submitting" && (
          <p className="text-sm text-rojo-etiqueta">Revisa {errorCount === 1 ? "el campo marcado" : `los ${errorCount} campos marcados`}.</p>
        )}
      </div>

      <div ref={statusRef} tabIndex={-1} role="status" aria-live="polite" className="outline-none">
        {status === "sent" && <p className="border-l-2 border-vinedo pl-4">Gracias. Hemos recibido tu consulta y te responderemos pronto.</p>}
        {status === "disabled" && (
          <p className="border-l-2 border-oro pl-4">
            El formulario es correcto, pero el envío online aún no está conectado: <strong>no se ha enviado ningún dato</strong>.
          </p>
        )}
        {status === "error" && (
          <p role="alert" className="border-l-2 border-current pl-4 text-rojo-etiqueta">
            No se ha podido enviar la consulta. {serverMessage}
          </p>
        )}
      </div>
    </form>
  );
}
