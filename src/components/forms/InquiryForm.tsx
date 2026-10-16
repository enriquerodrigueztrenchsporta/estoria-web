"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { submitInquiry, type SubmitResult } from "@/lib/submit";
import {
  contactTopics,
  emptyInquiry,
  establishmentTypes,
  isValid,
  validateInquiry,
  type Errors,
  type FieldName,
  type InquiryData,
  type InquiryKind,
} from "@/lib/validation";

type Status = "idle" | "submitting" | SubmitResult["status"];

type Props = {
  kind: InquiryKind;
  /** Tono del fondo donde se coloca el formulario */
  tone?: "light" | "dark";
  endpoint?: string;
};

export function InquiryForm({ kind, tone = "light", endpoint = process.env.NEXT_PUBLIC_FORM_ENDPOINT }: Props) {
  const uid = useId();
  const [data, setData] = useState<InquiryData>(() => emptyInquiry(kind));
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverMessage, setServerMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const enabled = Boolean(endpoint);

  const set = <K extends keyof InquiryData>(key: K, value: InquiryData[K]) => {
    const next = { ...data, [key]: value };
    setData(next);
    if (touched[key as FieldName]) setErrors(validateInquiry(next));
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
      setData(emptyInquiry(kind));
      setTouched({});
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  };

  const dark = tone === "dark";
  const field = `w-full border-0 border-b bg-transparent px-0 py-3 text-base outline-none transition-colors placeholder:opacity-50 focus:ring-0 ${
    dark ? "border-pergamino/35 focus:border-oro-claro" : "border-tinta/30 focus:border-borgona"
  }`;
  const labelCls = `eyebrow block ${dark ? "text-pergamino/80" : "text-sepia-oscuro"}`;
  const errCls = dark ? "text-[#f2b8a8]" : "text-rojo-etiqueta";

  const id = (k: string) => `${uid}-${k}`;
  const describedBy = (k: FieldName) => (errors[k] && touched[k] ? `${id(k)}-error` : undefined);
  const Err = ({ k }: { k: FieldName }) =>
    errors[k] && touched[k] ? (
      <p id={`${id(k)}-error`} className={`mt-2 text-sm ${errCls}`}>
        {errors[k]}
      </p>
    ) : null;

  const input = (k: FieldName, labelText: string, opts: { type?: string; autoComplete?: string; required?: boolean } = {}) => (
    <div>
      <label htmlFor={id(k)} className={labelCls}>
        {labelText}
        {opts.required === false ? <span className="ml-2 normal-case tracking-normal opacity-70">(opcional)</span> : null}
      </label>
      <input
        id={id(k)}
        name={k}
        type={opts.type ?? "text"}
        autoComplete={opts.autoComplete}
        required={opts.required !== false}
        aria-required={opts.required !== false}
        aria-invalid={Boolean(errors[k] && touched[k])}
        aria-describedby={describedBy(k)}
        value={data[k] as string}
        onChange={(e) => set(k, e.target.value)}
        onBlur={() => blur(k)}
        className={field}
      />
      <Err k={k} />
    </div>
  );

  const errorCount = Object.keys(errors).filter((k) => touched[k as FieldName]).length;

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} aria-describedby={enabled ? undefined : `${uid}-disabled`} className="grid gap-8">
      {!enabled && (
        <p id={`${uid}-disabled`} className={`border-l-2 pl-4 text-sm leading-relaxed ${dark ? "border-oro-claro text-pergamino/80" : "border-oro text-sepia-oscuro"}`}>
          El envío online todavía no está activo. Puedes revisar el formulario, pero aún no se enviará ningún dato.
        </p>
      )}

      <div className="grid gap-8 sm:grid-cols-2">
        {input("name", "Nombre", { autoComplete: "name" })}
        {kind === "profesional" ? input("company", "Empresa", { autoComplete: "organization" }) : input("email", "Correo electrónico", { type: "email", autoComplete: "email" })}
      </div>

      {kind === "profesional" ? (
        <>
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <label htmlFor={id("establishment")} className={labelCls}>
                Tipo de establecimiento
              </label>
              <select
                id={id("establishment")}
                name="establishment"
                required
                aria-required
                aria-invalid={Boolean(errors.establishment && touched.establishment)}
                aria-describedby={describedBy("establishment")}
                value={data.establishment}
                onChange={(e) => set("establishment", e.target.value)}
                onBlur={() => blur("establishment")}
                className={`${field} appearance-none`}
              >
                <option value="">Selecciona…</option>
                {establishmentTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <Err k="establishment" />
            </div>
            {input("city", "Ciudad", { autoComplete: "address-level2" })}
          </div>
          <div className="grid gap-8 sm:grid-cols-2">
            {input("email", "Correo electrónico", { type: "email", autoComplete: "email" })}
            {input("phone", "Teléfono", { type: "tel", autoComplete: "tel", required: false })}
          </div>
        </>
      ) : (
        <fieldset>
          <legend className={labelCls}>Motivo de la consulta</legend>
          <div className="mt-4 flex flex-wrap gap-3" aria-describedby={describedBy("topic")}>
            {contactTopics.map((t) => {
              const on = data.topic === t;
              return (
                <label
                  key={t}
                  className={`cursor-pointer border px-4 py-2.5 text-sm transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-oro ${
                    on ? (dark ? "border-pergamino bg-pergamino text-tinta" : "border-tinta bg-tinta text-pergamino") : dark ? "border-pergamino/30" : "border-tinta/25"
                  }`}
                >
                  <input
                    type="radio"
                    name="topic"
                    value={t}
                    checked={on}
                    onChange={() => {
                      set("topic", t);
                      setTouched((x) => ({ ...x, topic: true }));
                    }}
                    className="sr-only"
                  />
                  {t}
                </label>
              );
            })}
          </div>
          <Err k="topic" />
        </fieldset>
      )}

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
          aria-invalid={Boolean(errors.message && touched.message)}
          aria-describedby={describedBy("message")}
          value={data.message}
          onChange={(e) => set("message", e.target.value)}
          onBlur={() => blur("message")}
          className={`${field} resize-y`}
        />
        <Err k="message" />
      </div>

      {/* Campo trampa anti-spam, invisible para personas */}
      <div aria-hidden className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor={id("website")}>No rellenar</label>
        <input id={id("website")} name="website" tabIndex={-1} autoComplete="off" value={data.website} onChange={(e) => set("website", e.target.value)} />
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed">
          <input
            type="checkbox"
            name="consent"
            checked={data.consent}
            onChange={(e) => {
              set("consent", e.target.checked);
              setTouched((x) => ({ ...x, consent: true }));
            }}
            aria-invalid={Boolean(errors.consent && touched.consent)}
            aria-describedby={describedBy("consent")}
            className={`mt-1 h-4 w-4 shrink-0 ${dark ? "accent-oro-claro" : "accent-borgona"}`}
          />
          <span className={dark ? "text-pergamino/85" : "text-sepia-oscuro"}>
            Acepto que ESTORIA trate estos datos únicamente para responder a mi consulta.
          </span>
        </label>
        <Err k="consent" />
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <button
          type="submit"
          disabled={status === "submitting"}
          className={`eyebrow px-8 py-4 transition-colors duration-500 disabled:opacity-60 ${
            dark ? "bg-pergamino text-tinta hover:bg-oro-claro" : "bg-tinta text-pergamino hover:bg-borgona"
          }`}
        >
          {status === "submitting" ? "Enviando…" : "Enviar consulta"}
        </button>
        {errorCount > 0 && status !== "submitting" && (
          <p className={`text-sm ${errCls}`}>Revisa {errorCount === 1 ? "el campo marcado" : `los ${errorCount} campos marcados`}.</p>
        )}
      </div>

      <div ref={statusRef} tabIndex={-1} role="status" aria-live="polite" className="outline-none">
        {status === "sent" && (
          <p className={`border-l-2 pl-4 ${dark ? "border-oro-claro" : "border-vinedo"}`}>Gracias. Hemos recibido tu consulta y te responderemos pronto.</p>
        )}
        {status === "disabled" && (
          <p className={`border-l-2 pl-4 ${dark ? "border-oro-claro" : "border-oro"}`}>
            El formulario es correcto, pero el envío online aún no está conectado: <strong>no se ha enviado ningún dato</strong>.
          </p>
        )}
        {status === "error" && (
          <p role="alert" className={`border-l-2 border-current pl-4 ${errCls}`}>
            No se ha podido enviar la consulta. {serverMessage}
          </p>
        )}
      </div>
    </form>
  );
}
