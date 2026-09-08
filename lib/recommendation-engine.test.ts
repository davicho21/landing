import { describe, expect, it } from "vitest";
import { computeAspectScores, getRecommendation } from "./recommendation-engine";
import { EMPTY_ANSWERS } from "./types";
import { PENTAGON_AREAS } from "./pentagon-config";
import type { DiagnosticAnswers } from "./types";

function answersWithScores(scoresByArea: Record<string, [number, number, number]>): DiagnosticAnswers {
  const respuestas: Record<string, number> = { ...EMPTY_ANSWERS.respuestas };
  for (const area of PENTAGON_AREAS) {
    const [p1, p2, p3] = area.preguntas;
    const [v1, v2, v3] = scoresByArea[area.id] ?? [5, 5, 5];
    respuestas[p1.id] = v1;
    respuestas[p2.id] = v2;
    respuestas[p3.id] = v3;
  }
  return {
    nombres: "María",
    apellidos: "González",
    email: "lead@empresa.com",
    cargo: "Directora de RRHH",
    areaDesempeno: "Recursos Humanos / Gestión del Talento / L&D",
    empresa: "Empresa Test",
    sitioWeb: "",
    pais: "Colombia",
    ciudad: "Bogotá",
    industria: "Tecnología y Software",
    numColaboradores: "150 - 500 (Mediana consolidada)",
    desafioPrincipal: "",
    respuestas,
  };
}

describe("computeAspectScores", () => {
  it("promedia las tres preguntas de cada área", () => {
    const answers = answersWithScores({ tecnicas: [6, 8, 7] });
    const scores = computeAspectScores(answers);
    const tecnicas = scores.find((s) => s.aspecto.id === "tecnicas");
    expect(tecnicas?.promedio).toBe(7);
  });

  it("devuelve un puntaje por cada una de las 5 áreas", () => {
    const answers = answersWithScores({});
    const scores = computeAspectScores(answers);
    expect(scores).toHaveLength(5);
  });
});

describe("getRecommendation", () => {
  it("identifica las 2 áreas con menor puntaje como áreas críticas", () => {
    const answers = answersWithScores({
      tecnicas: [2, 2, 2],
      liderazgo: [3, 3, 3],
      blandas: [9, 9, 9],
      cultura: [9, 9, 9],
      innovacion: [9, 9, 9],
    });

    const result = getRecommendation(answers);
    const idsCriticos = result.areasCriticas.map((a) => a.aspecto.id);

    expect(idsCriticos).toEqual(["tecnicas", "liderazgo"]);
  });

  it("resuelve la ruta y el curso principal de cada área crítica", () => {
    const answers = answersWithScores({ liderazgo: [1, 1, 1] });
    const result = getRecommendation(answers);
    const liderazgo = result.areasCriticas.find((a) => a.aspecto.id === "liderazgo");

    expect(liderazgo?.track.id).toBe("liderazgo");
    expect(liderazgo?.cursoPrincipal).toBeDefined();
  });

  it("marca la figura como desbalanceada cuando hay picos y valles marcados", () => {
    const answers = answersWithScores({
      tecnicas: [1, 1, 1],
      liderazgo: [10, 10, 10],
    });
    const result = getRecommendation(answers);
    expect(result.forma.tipo).toBe("desbalanceado");
  });

  it("marca la figura como armónica y de madurez alta cuando todos los puntajes son altos y parejos", () => {
    const answers = answersWithScores(
      Object.fromEntries(PENTAGON_AREAS.map((a) => [a.id, [8, 8, 8] as [number, number, number]]))
    );
    const result = getRecommendation(answers);
    expect(result.forma.tipo).toBe("armonico-alto");
  });

  it("marca la figura como armónica pero de estancamiento cuando todos los puntajes son bajos y parejos", () => {
    const answers = answersWithScores(
      Object.fromEntries(PENTAGON_AREAS.map((a) => [a.id, [3, 3, 3] as [number, number, number]]))
    );
    const result = getRecommendation(answers);
    expect(result.forma.tipo).toBe("armonico-estancamiento");
  });
});
