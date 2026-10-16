import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, Value } from "@/components/legal/LegalPage";
import { formProcessor, owner, site } from "@/content/site";

export const metadata: Metadata = {
  title: "Política de privacidad",
  alternates: { canonical: `${site.url}/privacidad/` },
};

export default function Privacidad() {
  return (
    <LegalPage title="Política de privacidad" updated="16 de octubre de 2026">
      <p>
        Esta política explica cómo se tratan los datos personales en este sitio web, conforme al Reglamento (UE) 2016/679
        (RGPD) y a la Ley Orgánica 3/2018 de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD).
      </p>

      <h2>1. Responsable del tratamiento</h2>
      <ul>
        <li>
          Responsable: <Value field={owner.company} fallback="razón social" />
        </li>
        <li>
          NIF/CIF: <Value field={owner.taxId} fallback="NIF" />
        </li>
        <li>
          Domicilio: <Value field={owner.address} fallback="domicilio" />
        </li>
        <li>
          Contacto para protección de datos: <Value field={owner.email} fallback="correo" />
        </li>
      </ul>

      <h2>2. Qué datos tratamos</h2>
      <p>
        Solo los datos que nos facilitas en el formulario de contacto: nombre, empresa o establecimiento (opcional), correo
        electrónico, teléfono (opcional), motivo de la consulta y mensaje. Te pedimos que no incluyas datos especialmente
        protegidos.
      </p>
      <p>
        Este sitio no utiliza herramientas de analítica, publicidad ni redes sociales que recojan tus datos de navegación.
      </p>

      <h2>3. Finalidad</h2>
      <p>
        Atender y responder a tu consulta (información de producto, distribución, hostelería y comercios, colaboraciones o
        disponibilidad). No enviaremos comunicaciones comerciales ni elaboraremos perfiles.
      </p>

      <h2>4. Legitimación</h2>
      <p>
        Tu consentimiento, otorgado al marcar la casilla del formulario (art. 6.1.a RGPD). Puedes retirarlo en cualquier
        momento, sin que ello afecte a la licitud del tratamiento previo. Si la consulta da lugar a una relación comercial, la
        base será la ejecución de medidas precontractuales o del contrato (art. 6.1.b RGPD).
      </p>

      <h2>5. Conservación</h2>
      <p>
        Conservaremos los datos el tiempo necesario para responder a la consulta y, después, durante un máximo de 12 meses para
        atender posibles seguimientos. Pasado ese plazo se suprimirán, salvo que exista una relación comercial u obligación legal
        que exija conservarlos, en cuyo caso se bloquearán durante los plazos de prescripción aplicables.
      </p>

      <h2>6. Destinatarios y encargados del tratamiento</h2>
      <p>No se ceden datos a terceros, salvo obligación legal. Acceden a ellos, como encargados del tratamiento:</p>
      <ul>
        <li>
          Servicio de recepción de formularios:{" "}
          {formProcessor.status === "confirmed" ? (
            <>
              {formProcessor.value.name} ({formProcessor.value.country})
            </>
          ) : (
            <Value field={formProcessor} fallback="proveedor de formularios" />
          )}
          .
        </li>
        <li>
          Alojamiento web: GitHub, Inc. (GitHub Pages), que puede registrar datos técnicos de conexión, como la dirección IP, por
          razones de seguridad. GitHub tiene su sede en Estados Unidos; las transferencias internacionales se amparan en las
          garantías previstas en el RGPD (Marco de Privacidad de Datos UE-EE. UU. o cláusulas contractuales tipo).
        </li>
      </ul>

      <h2>7. Tus derechos</h2>
      <p>
        Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad,
        así como retirar tu consentimiento, escribiendo a <Value field={owner.email} fallback="correo" />, indicando el derecho
        que ejerces y acreditando tu identidad.
      </p>
      <p>
        Si consideras que el tratamiento no es conforme a la normativa, puedes presentar una reclamación ante la Agencia
        Española de Protección de Datos (
        <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">
          www.aepd.es
        </a>
        ).
      </p>

      <h2>8. Personas menores de edad</h2>
      <p>
        Este sitio está dirigido exclusivamente a mayores de 18 años. No tratamos de forma consciente datos de menores; si
        detectamos que se han facilitado, los suprimiremos.
      </p>

      <h2>9. Seguridad</h2>
      <p>
        Aplicamos medidas técnicas y organizativas adecuadas al riesgo, como la conexión cifrada (HTTPS) y el acceso
        restringido a las consultas recibidas.
      </p>

      <h2>10. Almacenamiento en el navegador</h2>
      <p>
        El uso de almacenamiento local se explica en la <Link href="/cookies/">Política de cookies</Link>.
      </p>
    </LegalPage>
  );
}
