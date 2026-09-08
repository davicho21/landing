import { describe, expect, it } from "vitest";
import { validateAllAnswers, isValid, isFreeEmailDomain, hasValidRespuestas } from "./validate-answers";
import { EMPTY_ANSWERS } from "./types";
import type { DiagnosticAnswers } from "./types";

const COMPLETE: DiagnosticAnswers = {
  nombres: "María",
  apellidos: "González",
  email: "lead@empresa.com",
  cargo: "Directora de RRHH",
  areaDesempeno: "Recursos Humanos / Gestión del Talento / L&D",
  empresa: "Empresa Test S.A.S.",
  sitioWeb: "",
  pais: "Colombia",
  ciudad: "Bogotá",
  industria: "Tecnología y Software",
  numColaboradores: "150 - 500 (Mediana consolidada)",
  desafioPrincipal: "",
  respuestas: { ...EMPTY_ANSWERS.respuestas },
};

describe("validateAllAnswers", () => {
  it("no reporta errores cuando el contacto y la organización son válidos", () => {
    expect(isValid(validateAllAnswers(COMPLETE))).toBe(true);
  });

  it("reporta los campos obligatorios vacíos como inválidos", () => {
    const errors = validateAllAnswers({
      ...COMPLETE,
      nombres: "",
      apellidos: "",
      email: "",
      cargo: "",
      areaDesempeno: "",
      empresa: "",
      pais: "",
      ciudad: "",
      industria: "",
      numColaboradores: "",
    });
    expect(isValid(errors)).toBe(false);
    expect(Object.keys(errors).sort()).toEqual(
      [
        "apellidos",
        "areaDesempeno",
        "cargo",
        "ciudad",
        "email",
        "empresa",
        "industria",
        "nombres",
        "numColaboradores",
        "pais",
      ].sort()
    );
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

  it("no exige el desafío principal ni el sitio web (son opcionales)", () => {
    const errors = validateAllAnswers({ ...COMPLETE, desafioPrincipal: "", sitioWeb: "" });
    expect(isValid(errors)).toBe(true);
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
      Object.entries(COMPLETE.respuestas).filter(([id]) => id !== "tecnicas-p1")
    );
    expect(hasValidRespuestas({ ...COMPLETE, respuestas: respuestasIncompletas })).toBe(false);
    expect(
      hasValidRespuestas({ ...COMPLETE, respuestas: { ...COMPLETE.respuestas, "tecnicas-p1": 11 } })
    ).toBe(false);
  });
});
