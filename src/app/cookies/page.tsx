import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { CookieSettingsButton } from "@/components/legal/CookieSettingsButton";
import { site } from "@/content/site";
import { AGE_KEY, CONSENT_KEY } from "@/lib/storage-keys";

export const metadata: Metadata = {
  title: "Política de cookies",
  alternates: { canonical: `${site.url}/cookies/` },
};

export default function Cookies() {
  return (
    <LegalPage title="Política de cookies" updated="16 de octubre de 2026">
      <h2>1. Qué son las cookies</h2>
      <p>
        Las cookies y tecnologías similares (como el almacenamiento local del navegador) son pequeños archivos o datos que un
        sitio web guarda en tu dispositivo para recordar información entre visitas. Su uso se regula en el artículo 22.2 de la
        LSSI-CE.
      </p>

      <h2>2. Qué utiliza este sitio</h2>
      <p>
        Este sitio <strong>no utiliza cookies de análisis, de publicidad ni de terceros</strong>. Las tipografías se sirven desde
        el propio sitio, sin conexiones a servicios externos. Únicamente se usa almacenamiento técnico, imprescindible para
        prestar el servicio que solicitas y exento de consentimiento:
      </p>
      <div className="-mx-[var(--gutter)] overflow-x-auto px-[var(--gutter)] md:mx-0 md:px-0">
      <table className="min-w-[34rem]">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Finalidad</th>
            <th>Duración</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>{AGE_KEY}</code>
            </td>
            <td>Almacenamiento local, propio, técnico</td>
            <td>Recordar que has confirmado ser mayor de edad, para no preguntarlo en cada visita.</td>
            <td>Hasta que borres los datos del navegador</td>
          </tr>
          <tr>
            <td>
              <code>{CONSENT_KEY}</code>
            </td>
            <td>Almacenamiento local, propio, técnico</td>
            <td>Guardar tu elección sobre cookies y la fecha en que la hiciste.</td>
            <td>Hasta que borres los datos del navegador o cambies tu elección</td>
          </tr>
        </tbody>
      </table>
      </div>
      <p>
        Si en el futuro se incorporan cookies de análisis u otras no necesarias, se actualizará esta política, se volverá a
        solicitar tu consentimiento y solo se activarán si lo aceptas.
      </p>

      <h2>3. Cómo gestionar tus preferencias</h2>
      <p>Puedes revisar o cambiar tu elección en cualquier momento:</p>
      <p>
        <CookieSettingsButton className="eyebrow border border-tinta px-5 py-3 no-underline hover:bg-tinta hover:text-pergamino" />
      </p>
      <p>
        También puedes borrar o bloquear el almacenamiento desde la configuración de tu navegador (Chrome, Firefox, Safari o
        Edge, en el apartado de privacidad o datos de sitios). Si bloqueas el almacenamiento técnico, se te preguntará la edad en
        cada visita.
      </p>

      <h2>4. Más información</h2>
      <p>
        Puedes consultar la Guía sobre el uso de las cookies de la Agencia Española de Protección de Datos en{" "}
        <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">
          www.aepd.es
        </a>
        .
      </p>
    </LegalPage>
  );
}
