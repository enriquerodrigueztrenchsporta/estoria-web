import type { InquiryData } from "./validation";

export type SubmitResult =
  | { status: "sent" }
  /** No hay servicio de envío configurado: no se ha enviado nada. */
  | { status: "disabled" }
  | { status: "error"; message: string };

/**
 * Envía la consulta al endpoint configurado (POST JSON).
 * Compatible con servicios tipo Formspree, Basin, Getform o una función propia.
 * Solo devuelve "sent" si el servidor responde 2xx.
 */
export async function submitInquiry(
  data: InquiryData,
  endpoint: string | undefined = process.env.NEXT_PUBLIC_FORM_ENDPOINT,
  fetchImpl: typeof fetch = fetch,
): Promise<SubmitResult> {
  if (!endpoint) return { status: "disabled" };
  if (data.website) return { status: "sent" }; // bot: se descarta en silencio
  const { website: _honeypot, ...payload } = data;
  try {
    const res = await fetchImpl(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ ...payload, source: "estoria-web" }),
    });
    if (!res.ok) return { status: "error", message: `El servidor respondió con un error (${res.status}).` };
    return { status: "sent" };
  } catch {
    return { status: "error", message: "No se ha podido conectar. Revisa tu conexión e inténtalo de nuevo." };
  }
}
