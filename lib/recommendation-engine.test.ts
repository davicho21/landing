import { describe, expect, it } from "vitest";
import { getRecommendation } from "./recommendation-engine";
import { EMPTY_ANSWERS } from "./types";
import type { DiagnosticAnswers } from "./types";

function answers(overrides: Partial<DiagnosticAnswers>): DiagnosticAnswers {
  return { ...EMPTY_ANSWERS, ...overrides };
}

describe("getRecommendation", () => {
  it("recomienda la ruta de liderazgo cuando se selecciona directamente", () => {
    const result = getRecommendation(
      answers({
        necesidad: "liderazgo",
        numPersonas: "6-15",
        tiempoDisponible: "mas-16h",
      })
    );

    expect(result.track.id).toBe("liderazgo");
  });

  it("prioriza los cursos más cortos cuando el tiempo disponible es limitado", () => {
    const result = getRecommendation(
      answers({
        necesidad: "liderazgo",
        numPersonas: "6-15",
        tiempoDisponible: "menos-4h",
      })
    );

    const allDurations = [
      result.cursoPrincipal.duracionHoras,
      ...result.cursosComplementarios.map((c) => c.duracionHoras),
    ];

    expect(result.cursoPrincipal.duracionHoras).toBeLessThanOrEqual(4);
    expect([...allDurations].sort((a, b) => a - b)).toEqual(allDurations);
  });

  it("no prioriza por duración cuando hay tiempo de sobra", () => {
    const result = getRecommendation(
      answers({
        necesidad: "ventas",
        numPersonas: "6-15",
        tiempoDisponible: "mas-16h",
      })
    );

    expect(result.cursoPrincipal.id).toBe("venta-consultiva");
  });

  it("infiere la ruta por palabras clave cuando la necesidad es texto libre", () => {
    const result = getRecommendation(
      answers({
        necesidad: "otro",
        necesidadOtro: "Queremos mejorar cómo negociamos con clientes grandes",
        numPersonas: "1-5",
        tiempoDisponible: "8-16h",
      })
    );

    expect(result.track.id).toBe("ventas");
  });

  it("cae a una ruta transversal por defecto cuando no hay señal clara", () => {
    const result = getRecommendation(
      answers({
        necesidad: "otro",
        necesidadOtro: "No estoy muy seguro todavía",
        numPersonas: "1-5",
        tiempoDisponible: "8-16h",
      })
    );

    expect(result.track.id).toBe("comunicacion");
  });

  it("agrega una nota de modalidad para grupos grandes", () => {
    const result = getRecommendation(
      answers({
        necesidad: "productividad-digital",
        numPersonas: "50+",
        tiempoDisponible: "mas-16h",
      })
    );

    expect(result.notaModalidad).toMatch(/cohortes/i);
  });
});
