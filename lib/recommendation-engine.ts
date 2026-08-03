import { getTrackById, type Course, type TrainingTrack } from "./course-catalog";
import { WHEEL_ASPECTS, type WheelAspect } from "./wheel-config";
import type { DiagnosticAnswers } from "./types";

export type AspectScore = {
  aspecto: WheelAspect;
  promedio: number;
};

export type AreaCritica = {
  aspecto: WheelAspect;
  promedio: number;
  track: TrainingTrack;
  cursoPrincipal: Course;
  cursosComplementarios: Course[];
};

export type FormaRueda = {
  tipo: "armonica-alta" | "armonica-baja" | "irregular";
  mensaje: string;
};

export type RecommendationResult = {
  aspectScores: AspectScore[];
  areasCriticas: AreaCritica[];
  forma: FormaRueda;
};

const IRREGULARIDAD_UMBRAL = 3;
const MADUREZ_ALTA_UMBRAL = 6.5;

export function computeAspectScores(answers: DiagnosticAnswers): AspectScore[] {
  return WHEEL_ASPECTS.map((aspecto) => {
    const [p1, p2] = aspecto.preguntas;
    const v1 = answers.respuestas[p1.id] ?? 0;
    const v2 = answers.respuestas[p2.id] ?? 0;
    const promedio = Math.round(((v1 + v2) / 2) * 10) / 10;
    return { aspecto, promedio };
  });
}

function resolveForma(aspectScores: AspectScore[]): FormaRueda {
  const valores = aspectScores.map((a) => a.promedio);
  const max = Math.max(...valores);
  const min = Math.min(...valores);
  const promedioGeneral = valores.reduce((sum, v) => sum + v, 0) / valores.length;
  const spread = max - min;

  if (spread > IRREGULARIDAD_UMBRAL) {
    return {
      tipo: "irregular",
      mensaje:
        "La figura resultante es irregular, con picos y valles marcados. Los picos son fortalezas que pueden apalancar el crecimiento; los valles representan riesgos críticos que frenan el desarrollo y deben atenderse primero.",
    };
  }

  if (promedioGeneral >= MADUREZ_ALTA_UMBRAL) {
    return {
      tipo: "armonica-alta",
      mensaje:
        "La figura resultante es un círculo armónico y amplio: la organización está en equilibrio y en un nivel alto de madurez en las ocho áreas evaluadas.",
    };
  }

  return {
    tipo: "armonica-baja",
    mensaje:
      "La figura resultante es un círculo armónico pero pequeño: hay equilibrio entre las áreas, pero también un estancamiento general que requiere elevar los estándares en conjunto, no solo en un área puntual.",
  };
}

function buildAreaCritica(aspectScore: AspectScore): AreaCritica {
  const track = getTrackById(aspectScore.aspecto.trackId);
  if (!track) {
    throw new Error(`No se encontró la ruta de formación para el aspecto "${aspectScore.aspecto.id}".`);
  }

  const [cursoPrincipal, ...cursosComplementarios] = track.cursos;
  return {
    aspecto: aspectScore.aspecto,
    promedio: aspectScore.promedio,
    track,
    cursoPrincipal,
    cursosComplementarios,
  };
}

export function getRecommendation(answers: DiagnosticAnswers): RecommendationResult {
  const aspectScores = computeAspectScores(answers);
  const areasCriticas = [...aspectScores]
    .sort((a, b) => a.promedio - b.promedio)
    .slice(0, 2)
    .map(buildAreaCritica);

  return {
    aspectScores,
    areasCriticas,
    forma: resolveForma(aspectScores),
  };
}
