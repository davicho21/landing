import { describe, expect, it } from "vitest";
import { validateAllAnswers, isValid, isFreeEmailDomain, hasValidRespuestas } from "./validate-answers";
import { EMPTY_ANSWERS } from "./types";
import type { DiagnosticAnswers } from "./types";

const COMPLETE: DiagnosticAnswers = {
  empresa: "Empresa Test S.A.S.",
  email: "lead@empresa.com",
  sector: "Tecnología",
  respuestas: { ...EMPTY_ANSWERS.respuestas },
};

describe("validateAllAnswers", () => {
  it("no reporta errores cuando empresa, email corporativo y sector son válidos", () => {
    expect(isValid(validateAllAnswers(COMPLETE))).toBe(true);
  });

  it("reporta empresa, email y sector vacíos como inválidos", () => {
    const errors = validateAllAnswers({ ...COMPLETE, empresa: "", email: "", sector: "" });
    expect(isValid(errors)).toBe(false);
    expect(Object.keys(errors).sort()).toEqual(["email", "empresa", "sector"]);
  });

  it("rechaza un email con formato inválido", () => {
    const errors = validateAllAnswers({ ...COMPLETE, email: "no-es-un-correo" });
    expect(errors.email).toBeDefined();
  });

  it("rechaza correos de proveedores gratuitos comunes", () => {
    for (const domain of ["gmail.com", "hotmail.com", "outlook.com"]) {
      const errors = validateAllAnswers({ ...COMPLETE, email: `lead@${domain}` });
      expect(errors.email).toBeDefined();
    }
  });
});

describe("isFreeEmailDomain", () => {
  it("detecta dominios gratuitos conocidos sin importar mayúsculas", () => {
    expect(isFreeEmailDomain("Persona@Gmail.com")).toBe(true);
  });

  it("no marca un dominio corporativo como gratuito", () => {
    expect(isFreeEmailDomain("lead@academiareferentes.com")).toBe(false);
  });
});

describe("hasValidRespuestas", () => {
  it("es válido con las respuestas por defecto (todas en 5)", () => {
    expect(hasValidRespuestas(COMPLETE)).toBe(true);
  });

  it("es inválido si falta una pregunta o el valor está fuera de rango", () => {
    const respuestasIncompletas = Object.fromEntries(
      Object.entries(COMPLETE.respuestas).filter(([id]) => id !== "estrategia-p1")
    );
    expect(hasValidRespuestas({ ...COMPLETE, respuestas: respuestasIncompletas })).toBe(false);
    expect(
      hasValidRespuestas({ ...COMPLETE, respuestas: { ...COMPLETE.respuestas, "estrategia-p1": 11 } })
    ).toBe(false);
  });
});
