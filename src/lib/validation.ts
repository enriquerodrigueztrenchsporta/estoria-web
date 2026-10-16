export type InquiryData = {
  name: string;
  /** Opcional: empresa o establecimiento */
  company: string;
  email: string;
  /** Opcional */
  phone: string;
  topic: string;
  message: string;
  /** Aceptación expresa de la política de privacidad (RGPD art. 6.1.a y 7) */
  privacy: boolean;
  /** Campo trampa anti-spam: debe quedar vacío */
  website: string;
};

export type FieldName = Exclude<keyof InquiryData, "website">;
export type Errors = Partial<Record<FieldName, string>>;

export const contactTopics = [
  "Información de producto",
  "Distribución",
  "Hostelería y comercios",
  "Colaboraciones",
  "Disponibilidad",
] as const;

export const emptyInquiry = (): InquiryData => ({
  name: "",
  company: "",
  email: "",
  phone: "",
  topic: "",
  message: "",
  privacy: false,
  website: "",
});

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[0-9\s().-]{9,20}$/;

/** Validación del formulario de contacto. Devuelve un mapa de errores (vacío = válido). */
export function validateInquiry(data: InquiryData): Errors {
  const errors: Errors = {};
  const t = (v: string) => v.trim();

  if (t(data.name).length < 2) errors.name = "Indica tu nombre.";
  if (t(data.email) === "") errors.email = "Indica tu correo electrónico.";
  else if (!EMAIL.test(t(data.email))) errors.email = "El correo electrónico no parece válido.";
  if (t(data.phone) !== "" && !PHONE.test(t(data.phone))) errors.phone = "El teléfono no parece válido.";
  if (!(contactTopics as readonly string[]).includes(data.topic)) errors.topic = "Selecciona el motivo de la consulta.";
  if (t(data.message).length < 10) errors.message = "Cuéntanos un poco más (mínimo 10 caracteres).";
  else if (t(data.message).length > 2000) errors.message = "El mensaje no puede superar 2000 caracteres.";
  if (!data.privacy) errors.privacy = "Debes aceptar la política de privacidad para enviar la consulta.";
  return errors;
}

export const isValid = (errors: Errors) => Object.keys(errors).length === 0;
