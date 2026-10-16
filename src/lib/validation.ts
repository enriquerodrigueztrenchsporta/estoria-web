export type InquiryKind = "profesional" | "general";

export type InquiryData = {
  kind: InquiryKind;
  name: string;
  company: string;
  establishment: string;
  topic: string;
  city: string;
  email: string;
  phone: string;
  message: string;
  consent: boolean;
  /** Campo trampa anti-spam: debe quedar vacío */
  website: string;
};

export type FieldName = Exclude<keyof InquiryData, "kind" | "website">;
export type Errors = Partial<Record<FieldName, string>>;

export const establishmentTypes = [
  "Restaurante",
  "Vinoteca",
  "Tienda especializada",
  "Distribuidor",
  "Hotel",
  "Bar o cafetería",
  "Otro",
] as const;

export const contactTopics = [
  "Información de producto",
  "Distribución",
  "Venta profesional",
  "Colaboraciones",
  "Disponibilidad",
] as const;

export const emptyInquiry = (kind: InquiryKind): InquiryData => ({
  kind,
  name: "",
  company: "",
  establishment: "",
  topic: "",
  city: "",
  email: "",
  phone: "",
  message: "",
  consent: false,
  website: "",
});

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[0-9\s().-]{9,20}$/;

/** Validación compartida por los formularios. Devuelve un mapa de errores (vacío = válido). */
export function validateInquiry(data: InquiryData): Errors {
  const errors: Errors = {};
  const t = (v: string) => v.trim();

  if (t(data.name).length < 2) errors.name = "Indica tu nombre.";
  if (t(data.email) === "") errors.email = "Indica tu correo electrónico.";
  else if (!EMAIL.test(t(data.email))) errors.email = "El correo electrónico no parece válido.";
  if (t(data.phone) !== "" && !PHONE.test(t(data.phone))) errors.phone = "El teléfono no parece válido.";
  if (t(data.message).length < 10) errors.message = "Cuéntanos un poco más (mínimo 10 caracteres).";
  else if (t(data.message).length > 2000) errors.message = "El mensaje no puede superar 2000 caracteres.";
  if (!data.consent) errors.consent = "Necesitamos tu consentimiento para responder a la consulta.";

  if (data.kind === "profesional") {
    if (t(data.company).length < 2) errors.company = "Indica el nombre de la empresa.";
    if (!(establishmentTypes as readonly string[]).includes(data.establishment))
      errors.establishment = "Selecciona el tipo de establecimiento.";
    if (t(data.city).length < 2) errors.city = "Indica la ciudad.";
  } else if (!(contactTopics as readonly string[]).includes(data.topic)) {
    errors.topic = "Selecciona el motivo de la consulta.";
  }
  return errors;
}

export const isValid = (errors: Errors) => Object.keys(errors).length === 0;
