import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { submitInquiry } from "@/lib/submit";
import { emptyInquiry, isValid, validateInquiry, type InquiryData } from "@/lib/validation";

const validPro = (): InquiryData => ({
  ...emptyInquiry("profesional"),
  name: "Ana López",
  company: "Casa Ejemplo",
  establishment: "Restaurante",
  city: "Logroño",
  email: "ana@example.com",
  message: "Querríamos información para nuestra carta.",
  consent: true,
});

describe("validación", () => {
  it("acepta una consulta profesional completa", () => {
    expect(isValid(validateInquiry(validPro()))).toBe(true);
  });

  it("exige los campos obligatorios", () => {
    const e = validateInquiry(emptyInquiry("profesional"));
    expect(Object.keys(e).sort()).toEqual(["city", "company", "consent", "email", "establishment", "message", "name"].sort());
  });

  it("detecta correo y teléfono no válidos; el teléfono es opcional", () => {
    expect(validateInquiry({ ...validPro(), email: "ana@" }).email).toBeDefined();
    expect(validateInquiry({ ...validPro(), phone: "abc" }).phone).toBeDefined();
    expect(validateInquiry({ ...validPro(), phone: "" }).phone).toBeUndefined();
    expect(validateInquiry({ ...validPro(), phone: "+34 600 000 000" }).phone).toBeUndefined();
  });

  it("la consulta general exige motivo", () => {
    const base = { ...validPro(), kind: "general" as const };
    expect(validateInquiry(base).topic).toBeDefined();
    expect(validateInquiry({ ...base, topic: "Distribución" }).topic).toBeUndefined();
  });
});

describe("envío", () => {
  it("sin endpoint no envía nada", async () => {
    const f = vi.fn();
    expect(await submitInquiry(validPro(), "", f as unknown as typeof fetch)).toEqual({ status: "disabled" });
    expect(f).not.toHaveBeenCalled();
  });

  it("solo confirma con respuesta 2xx", async () => {
    const ok = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    const ko = vi.fn().mockResolvedValue({ ok: false, status: 500 });
    expect((await submitInquiry(validPro(), "https://x.test", ok as unknown as typeof fetch)).status).toBe("sent");
    expect((await submitInquiry(validPro(), "https://x.test", ko as unknown as typeof fetch)).status).toBe("error");
  });

  it("los errores de red no se presentan como éxito", async () => {
    const boom = vi.fn().mockRejectedValue(new Error("offline"));
    expect((await submitInquiry(validPro(), "https://x.test", boom as unknown as typeof fetch)).status).toBe("error");
  });
});

describe("<InquiryForm />", () => {
  it("muestra errores al enviar vacío", async () => {
    render(<InquiryForm kind="profesional" endpoint="" />);
    fireEvent.click(screen.getByRole("button", { name: /enviar consulta/i }));
    expect(await screen.findByText("Indica tu nombre.")).toBeTruthy();
    expect(screen.getByLabelText("Nombre").getAttribute("aria-invalid")).toBe("true");
  });

  it("sin integración avisa de que no se ha enviado ningún dato (nunca finge éxito)", async () => {
    render(<InquiryForm kind="profesional" endpoint="" />);
    const v = validPro();
    fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: v.name } });
    fireEvent.change(screen.getByLabelText("Empresa"), { target: { value: v.company } });
    fireEvent.change(screen.getByLabelText("Tipo de establecimiento"), { target: { value: v.establishment } });
    fireEvent.change(screen.getByLabelText("Ciudad"), { target: { value: v.city } });
    fireEvent.change(screen.getByLabelText("Correo electrónico"), { target: { value: v.email } });
    fireEvent.change(screen.getByLabelText("Mensaje"), { target: { value: v.message } });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: /enviar consulta/i }));
    await waitFor(() => expect(screen.getByRole("status").textContent).toMatch(/no se ha enviado ningún dato/i));
    expect(screen.queryByText(/hemos recibido/i)).toBeNull();
  });
});
