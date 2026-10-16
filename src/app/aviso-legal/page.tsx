import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, Value } from "@/components/legal/LegalPage";
import { owner, site } from "@/content/site";

export const metadata: Metadata = {
  title: "Aviso legal",
  alternates: { canonical: `${site.url}/aviso-legal/` },
};

export default function AvisoLegal() {
  return (
    <LegalPage title="Aviso legal" updated="16 de octubre de 2026">
      <h2>1. Titular del sitio web</h2>
      <p>
        En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de
        Comercio Electrónico (LSSI-CE), se informa de los datos del titular de este sitio web:
      </p>
      <ul>
        <li>
          Titular: <Value field={owner.company} fallback="razón social" />
        </li>
        <li>
          NIF/CIF: <Value field={owner.taxId} fallback="NIF" />
        </li>
        <li>
          Domicilio: <Value field={owner.address} fallback="domicilio" />
        </li>
        <li>
          Correo electrónico: <Value field={owner.email} fallback="correo" />
        </li>
        <li>
          Teléfono: <Value field={owner.phone} fallback="teléfono" />
        </li>
        <li>
          Datos registrales: <Value field={owner.registry} fallback="registro" />
        </li>
      </ul>

      <h2>2. Objeto</h2>
      <p>
        Este sitio web presenta la marca ESTORIA y sus vinos acogidos a la Denominación de Origen Calificada Rioja, y permite
        enviar consultas a través de un formulario. No se realizan ventas en línea.
      </p>

      <h2>3. Acceso reservado a mayores de edad</h2>
      <p>
        Este sitio web contiene información sobre bebidas alcohólicas y está dirigido exclusivamente a personas mayores de 18
        años. Al acceder, la persona usuaria declara cumplir este requisito. ESTORIA promueve un consumo responsable y moderado.
      </p>

      <h2>4. Condiciones de uso</h2>
      <p>
        La persona usuaria se compromete a hacer un uso adecuado de los contenidos, conforme a la ley, la buena fe y el orden
        público, y a no emplearlos para actividades ilícitas o que puedan dañar los derechos de terceros o el funcionamiento del
        sitio.
      </p>

      <h2>5. Propiedad intelectual e industrial</h2>
      <p>
        La marca ESTORIA, el diseño de su etiqueta, las ilustraciones, los textos y el diseño de este sitio web pertenecen a su
        titular o se utilizan con su autorización. Queda prohibida su reproducción, distribución o transformación sin
        autorización expresa.
      </p>
      <p>
        Algunas fotografías son obra de terceros y se publican bajo licencias Creative Commons u otras licencias libres, con
        indicación de autor y licencia junto a cada imagen y en la página de{" "}
        <Link href="/creditos/">créditos fotográficos</Link>. Estas fotografías se rigen por sus respectivas licencias.
      </p>
      <p>
        La mención «Denominación de Origen Calificada Rioja» se utiliza conforme a la normativa de la Denominación y a las
        indicaciones de su Consejo Regulador.
      </p>

      <h2>6. Responsabilidad</h2>
      <p>
        El titular procura que la información sea exacta y esté actualizada, pero no garantiza la ausencia de errores ni la
        disponibilidad continua del sitio. No se responsabiliza de los daños derivados del uso de la información o de
        interrupciones técnicas ajenas a su control.
      </p>

      <h2>7. Enlaces</h2>
      <p>
        Los enlaces a sitios de terceros (por ejemplo, las fuentes de las fotografías) se ofrecen solo como referencia. El
        titular no controla ni se responsabiliza de sus contenidos.
      </p>

      <h2>8. Protección de datos y cookies</h2>
      <p>
        El tratamiento de datos personales se describe en la <Link href="/privacidad/">Política de privacidad</Link>, y el uso
        de almacenamiento en el navegador, en la <Link href="/cookies/">Política de cookies</Link>.
      </p>

      <h2>9. Legislación aplicable</h2>
      <p>
        Este aviso legal se rige por la legislación española. Para cualquier controversia, las partes se someten a los juzgados
        y tribunales que correspondan conforme a la normativa vigente, en particular la de protección de personas consumidoras.
      </p>
    </LegalPage>
  );
}
