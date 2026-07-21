import { describe, expect, it } from "vitest";
import { validateAllAnswers, isValid } from "./validate-answers";
import { EMPTY_ANSWERS } from "./types";
import type { DiagnosticAnswers } from "./types";

const COMPLETE: DiagnosticAnswers = {
  necesidad: "liderazgo",
  necesidadOtro: "",
  motivo: "Rotación alta en el equipo de ventas",
  numPersonas: "6-15",
  tiempoDisponible: "4-8h",
  objetivo: "Reducir la rotación y mejorar el clima",
  email: "lead@empresa.com",
};

describe("validateAllAnswers", () => {
  it("no reporta errores cuando todas las respuestas son válidas", () => {
    expect(isValid(validateAllAnswers(COMPLETE))).toBe(true);
  });

  it("reporta todos los campos vacíos como inválidos", () => {
    const errors = validateAllAnswers(EMPTY_ANSWERS);
    expect(isValid(errors)).toBe(false);
    expect(Object.keys(errors).sort()).toEqual(
      ["email", "motivo", "necesidad", "numPersonas", "objetivo", "tiempoDisponible"].sort()
    );
  });

  it("exige el detalle de 'otro' cuando la necesidad no es una opción del catálogo", () => {
    const errors = validateAllAnswers({ ...COMPLETE, necesidad: "otro", necesidadOtro: "" });
    expect(errors.necesidadOtro).toBeDefined();
  });

  it("rechaza un email con formato inválido", () => {
    const errors = validateAllAnswers({ ...COMPLETE, email: "no-es-un-correo" });
    expect(errors.email).toBeDefined();
  });
});
