import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { submitInquiry } from "@/lib/submit";
import { emptyInquiry, isValid, validateInquiry, type InquiryData } from "@/lib/validation";

vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

const valid = (): InquiryData => ({
  ...emptyInquiry(),
  name: "Ana López",
  company: "Casa Ejemplo",
  email: "ana@example.com",
  topic: "Distribución",
  message: "Querríamos información para nuestra carta.",
  privacy: true,
});

describe("validación", () => {
  it("acepta una consulta completa", () => {
    expect(isValid(validateInquiry(valid()))).toBe(true);
  });

  it("exige los campos obligatorios y la aceptación de la privacidad", () => {
    const e = validateInquiry(emptyInquiry());
    expect(Object.keys(e).sort()).toEqual(["email", "message", "name", "privacy", "topic"].sort());
  });

  it("empresa y teléfono son opcionales, pero el teléfono debe ser válido si se indica", () => {
    expect(validateInquiry({ ...valid(), company: "", phone: "" })).toEqual({});
    expect(validateInquiry({ ...valid(), phone: "abc" }).phone).toBeDefined();
    expect(validateInquiry({ ...valid(), phone: "+34 600 000 000" }).phone).toBeUndefined();
  });

  it("detecta correos no válidos", () => {
    expect(validateInquiry({ ...valid(), email: "ana@" }).email).toBeDefined();
  });

  it("sin aceptar la política de privacidad no se puede enviar", () => {
    expect(validateInquiry({ ...valid(), privacy: false }).privacy).toBeDefined();
  });
});

describe("envío", () => {
  it("sin endpoint no envía nada", async () => {
    const f = vi.fn();
    expect(await submitInquiry(valid(), "", f as unknown as typeof fetch)).toEqual({ status: "disabled" });
    expect(f).not.toHaveBeenCalled();
  });

  it("solo confirma con respuesta 2xx", async () => {
    const ok = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    const ko = vi.fn().mockResolvedValue({ ok: false, status: 500 });
    expect((await submitInquiry(valid(), "https://x.test", ok as unknown as typeof fetch)).status).toBe("sent");
    expect((await submitInquiry(valid(), "https://x.test", ko as unknown as typeof fetch)).status).toBe("error");
  });

  it("los errores de red no se presentan como éxito", async () => {
    const boom = vi.fn().mockRejectedValue(new Error("offline"));
    expect((await submitInquiry(valid(), "https://x.test", boom as unknown as typeof fetch)).status).toBe("error");
  });
});

describe("<InquiryForm />", () => {
  it("muestra errores al enviar vacío y enlaza la política de privacidad", async () => {
    render(<InquiryForm endpoint="" />);
    fireEvent.click(screen.getByRole("button", { name: /enviar consulta/i }));
    expect(await screen.findByText("Indica tu nombre.")).toBeTruthy();
    expect(screen.getByText(/Debes aceptar la política de privacidad/)).toBeTruthy();
    expect(screen.getAllByRole("link", { name: /política de privacidad/i })[0]!.getAttribute("href")).toBe("/privacidad/");
  });

  it("sin integración avisa de que no se ha enviado ningún dato (nunca finge éxito)", async () => {
    render(<InquiryForm endpoint="" />);
    const v = valid();
    fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: v.name } });
    fireEvent.change(screen.getByLabelText("Correo electrónico"), { target: { value: v.email } });
    fireEvent.click(screen.getByLabelText("Distribución"));
    fireEvent.change(screen.getByLabelText("Mensaje"), { target: { value: v.message } });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: /enviar consulta/i }));
    await waitFor(() => expect(screen.getByRole("status").textContent).toMatch(/no se ha enviado ningún dato/i));
    expect(screen.queryByText(/hemos recibido/i)).toBeNull();
  });
});
