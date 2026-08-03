import { describe, expect, it } from "vitest";
import { computeAspectScores, getRecommendation } from "./recommendation-engine";
import { EMPTY_ANSWERS } from "./types";
import { WHEEL_ASPECTS } from "./wheel-config";
import type { DiagnosticAnswers } from "./types";

function answersWithScores(scoresByAspect: Record<string, [number, number]>): DiagnosticAnswers {
  const respuestas: Record<string, number> = { ...EMPTY_ANSWERS.respuestas };
  for (const aspecto of WHEEL_ASPECTS) {
    const [p1, p2] = aspecto.preguntas;
    const [v1, v2] = scoresByAspect[aspecto.id] ?? [5, 5];
    respuestas[p1.id] = v1;
    respuestas[p2.id] = v2;
  }
  return { empresa: "Empresa Test", email: "lead@empresa.com", sector: "Tecnología", respuestas };
}

describe("computeAspectScores", () => {
  it("promedia las dos preguntas de cada aspecto", () => {
    const answers = answersWithScores({ estrategia: [6, 8] });
    const scores = computeAspectScores(answers);
    const estrategia = scores.find((s) => s.aspecto.id === "estrategia");
    expect(estrategia?.promedio).toBe(7);
  });

  it("devuelve un puntaje por cada una de las 8 áreas", () => {
    const answers = answersWithScores({});
    const scores = computeAspectScores(answers);
    expect(scores).toHaveLength(8);
  });
});

describe("getRecommendation", () => {
  it("identifica las 2 áreas con menor puntaje como áreas críticas", () => {
    const answers = answersWithScores({
      estrategia: [2, 2],
      liderazgo: [3, 3],
      cultura: [9, 9],
      aprendizaje: [9, 9],
      bienestar: [9, 9],
      comunicacion: [9, 9],
      tecnologia: [9, 9],
      analitica: [9, 9],
    });

    const result = getRecommendation(answers);
    const idsCriticos = result.areasCriticas.map((a) => a.aspecto.id);

    expect(idsCriticos).toEqual(["estrategia", "liderazgo"]);
  });

  it("resuelve la ruta y el curso principal de cada área crítica", () => {
    const answers = answersWithScores({ liderazgo: [1, 1] });
    const result = getRecommendation(answers);
    const liderazgo = result.areasCriticas.find((a) => a.aspecto.id === "liderazgo");

    expect(liderazgo?.track.id).toBe("liderazgo");
    expect(liderazgo?.cursoPrincipal).toBeDefined();
  });

  it("marca la figura como irregular cuando hay picos y valles marcados", () => {
    const answers = answersWithScores({
      estrategia: [1, 1],
      liderazgo: [10, 10],
    });
    const result = getRecommendation(answers);
    expect(result.forma.tipo).toBe("irregular");
  });

  it("marca la figura como armónica y de madurez alta cuando todos los puntajes son altos y parejos", () => {
    const answers = answersWithScores(
      Object.fromEntries(WHEEL_ASPECTS.map((a) => [a.id, [8, 8] as [number, number]]))
    );
    const result = getRecommendation(answers);
    expect(result.forma.tipo).toBe("armonica-alta");
  });

  it("marca la figura como armónica pero de estancamiento cuando todos los puntajes son bajos y parejos", () => {
    const answers = answersWithScores(
      Object.fromEntries(WHEEL_ASPECTS.map((a) => [a.id, [3, 3] as [number, number]]))
    );
    const result = getRecommendation(answers);
    expect(result.forma.tipo).toBe("armonica-baja");
  });
});
