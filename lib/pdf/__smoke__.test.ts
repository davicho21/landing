import { describe, it } from "vitest";
import { renderToBuffer } from "@react-pdf/renderer";
import { DiagnosticReportDocument } from "./diagnostic-report";
import { getRecommendation } from "@/lib/recommendation-engine";
import { EMPTY_ANSWERS } from "@/lib/types";
import { PENTAGON_AREAS } from "@/lib/pentagon-config";
import type { DiagnosticAnswers } from "@/lib/types";

describe("smoke: render PDF", () => {
  it("renders a full report without throwing, worst case course count", async () => {
    const respuestas: Record<string, number> = { ...EMPTY_ANSWERS.respuestas };
    const scores: Record<string, [number, number, number]> = {
      tecnicas: [3, 4, 2],
      blandas: [7, 8, 7],
      cultura: [6, 7, 6],
      liderazgo: [8, 9, 8],
      innovacion: [3, 3, 4],
    };
    for (const area of PENTAGON_AREAS) {
      const [p1, p2, p3] = area.preguntas;
      const [v1, v2, v3] = scores[area.id];
      respuestas[p1.id] = v1;
      respuestas[p2.id] = v2;
      respuestas[p3.id] = v3;
    }

    const answers: DiagnosticAnswers = {
      nombres: "María",
      apellidos: "González Pérez",
      email: "maria.gonzalez@empresatest.com",
      cargo: "Directora de Gestión Humana",
      areaDesempeno: "Recursos Humanos / Gestión del Talento / L&D",
      empresa: "Empresa de Prueba S.A.S.",
      sitioWeb: "www.empresatest.com",
      pais: "Colombia",
      ciudad: "Bogotá",
      industria: "Tecnología y Software",
      numColaboradores: "150 - 500 (Mediana consolidada)",
      desafioPrincipal: "Alinear a los equipos con los valores de la empresa y evitar el agotamiento (burnout).",
      respuestas,
    };

    const recommendation = getRecommendation(answers);
    const doc = DiagnosticReportDocument({ answers, recommendation, generatedAt: new Date("2026-08-04") });
    await renderToBuffer(doc);
  });
});
