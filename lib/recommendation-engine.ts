import { getTrackById, type Course, type TrainingTrack } from "./course-catalog";
import { PENTAGON_AREAS, type PentagonArea } from "./pentagon-config";
import type { DiagnosticAnswers } from "./types";

export type AspectScore = {
  aspecto: PentagonArea;
  promedio: number;
};

export type AreaCritica = {
  aspecto: PentagonArea;
  promedio: number;
  track: TrainingTrack;
  cursoPrincipal: Course;
  cursosComplementarios: Course[];
};

export type FormaPentagono = {
  tipo: "desbalanceado" | "armonico-alto" | "armonico-estancamiento";
  mensaje: string;
};

export type RecommendationResult = {
  aspectScores: AspectScore[];
  areasCriticas: AreaCritica[];
  forma: FormaPentagono;
};

const DESBALANCE_UMBRAL = 3;
const MADUREZ_ALTA_UMBRAL = 6.5;

export function computeAspectScores(answers: DiagnosticAnswers): AspectScore[] {
  return PENTAGON_AREAS.map((aspecto) => {
    const [p1, p2, p3] = aspecto.preguntas;
    const v1 = answers.respuestas[p1.id] ?? 0;
    const v2 = answers.respuestas[p2.id] ?? 0;
    const v3 = answers.respuestas[p3.id] ?? 0;
    const promedio = Math.round(((v1 + v2 + v3) / 3) * 10) / 10;
    return { aspecto, promedio };
  });
}

function resolveForma(aspectScores: AspectScore[]): FormaPentagono {
  const valores = aspectScores.map((a) => a.promedio);
  const max = Math.max(...valores);
  const min = Math.min(...valores);
  const promedioGeneral = valores.reduce((sum, v) => sum + v, 0) / valores.length;
  const spread = max - min;

  if (spread > DESBALANCE_UMBRAL) {
    return {
      tipo: "desbalanceado",
      mensaje:
        "La estructura de talento de la empresa tiene fuertes inconsistencias. Existen silos de excelencia operando junto a áreas críticas que sabotean el rendimiento general de la organización.",
    };
  }

  if (promedioGeneral >= MADUREZ_ALTA_UMBRAL) {
    return {
      tipo: "armonico-alto",
      mensaje:
        "La organización se encuentra en un equilibrio saludable y maduro. Las cinco dimensiones se refuerzan mutuamente de manera integrada, creando un ecosistema propicio para el alto rendimiento.",
    };
  }

  return {
    tipo: "armonico-estancamiento",
    mensaje:
      "Existe equilibrio entre las áreas, pero en un nivel de desempeño modesto. Los equipos operan en una zona de confort que requiere elevar de manera integral las exigencias y estándares organizacionales.",
  };
}

function buildAreaCritica(aspectScore: AspectScore): AreaCritica {
  const track = getTrackById(aspectScore.aspecto.trackId);
  if (!track) {
    throw new Error(`No se encontró la ruta de formación para el área "${aspectScore.aspecto.id}".`);
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
