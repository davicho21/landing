import { TRAINING_TRACKS, getTrackById, type Course, type TrainingTrack } from "./course-catalog";
import type { DiagnosticAnswers } from "./types";

const TIME_BUDGET_HOURS: Record<string, number> = {
  "menos-4h": 4,
  "4-8h": 8,
  "8-16h": 16,
  "mas-16h": Infinity,
};

const SHORT_TIME_BUDGETS = new Set(["menos-4h", "4-8h"]);

const MODALIDAD_NOTES: Record<string, string> = {
  "1-5": "Formato personalizado, ideal para trabajo uno a uno o en grupo reducido.",
  "6-15": "Formato de taller grupal, ideal para un equipo o área completa.",
  "16-50":
    "Recomendamos dividir el grupo en cohortes de 10 a 15 personas para mantener la calidad de la experiencia.",
  "50+":
    "Recomendamos un despliegue por cohortes, comenzando con un piloto en un grupo representativo antes de escalar a toda la organización.",
};

const TRACK_KEYWORDS: Record<string, string[]> = {
  liderazgo: ["lider", "gerent", "equipo", "supervis", "gestion de personas", "jefatura"],
  ventas: ["venta", "comercial", "cliente", "negocia"],
  comunicacion: ["comunicacion", "hablar", "presentacion", "colabora"],
  "productividad-digital": ["digital", "herramienta", "google", "ia", "inteligencia artificial", "productividad", "automat"],
  "cultura-talento": ["cultura", "onboarding", "talento", "inclusion", "clima"],
  "datos-decisiones": ["dato", "analitica", "metrica", "roi", "reporte"],
};

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function containsKeyword(text: string, keyword: string): boolean {
  // Boundary only at the start: matches word stems (e.g. "cliente" in
  // "clientes", "negocia" in "negociamos") without matching mid-word
  // substrings (e.g. "ia" inside "todavia").
  return new RegExp(`\\b${escapeRegExp(keyword)}`).test(text);
}

function resolveTrack(answers: DiagnosticAnswers): TrainingTrack {
  const direct = getTrackById(answers.necesidad);
  if (direct) return direct;

  const freeText = normalize(answers.necesidadOtro || answers.necesidad || "");
  for (const track of TRAINING_TRACKS) {
    const keywords = TRACK_KEYWORDS[track.id] ?? [];
    if (keywords.some((keyword) => containsKeyword(freeText, keyword))) {
      return track;
    }
  }

  // Default: comunicación es la ruta más transversal cuando no hay una señal clara.
  return getTrackById("comunicacion")!;
}

function selectCourses(track: TrainingTrack, tiempoDisponible: string): Course[] {
  const maxHoras = TIME_BUDGET_HOURS[tiempoDisponible] ?? Infinity;
  const prioritizeShort = SHORT_TIME_BUDGETS.has(tiempoDisponible);

  const ordered = prioritizeShort
    ? [...track.cursos].sort((a, b) => a.duracionHoras - b.duracionHoras)
    : track.cursos;

  const withinBudget = ordered.filter((course) => course.duracionHoras <= maxHoras);
  const selected = (withinBudget.length > 0 ? withinBudget : ordered).slice(0, 3);

  return selected;
}

export type RecommendationResult = {
  track: TrainingTrack;
  cursoPrincipal: Course;
  cursosComplementarios: Course[];
  notaModalidad: string;
  notaTiempo?: string;
};

export function getRecommendation(answers: DiagnosticAnswers): RecommendationResult {
  const track = resolveTrack(answers);
  const cursos = selectCourses(track, answers.tiempoDisponible);
  const [cursoPrincipal, ...cursosComplementarios] = cursos;

  const maxHoras = TIME_BUDGET_HOURS[answers.tiempoDisponible] ?? Infinity;
  const notaTiempo =
    cursoPrincipal && cursoPrincipal.duracionHoras > maxHoras
      ? "El tiempo disponible declarado es menor a la duración de los cursos de esta ruta; se sugiere el más corto disponible y evaluar extender el tiempo asignado."
      : undefined;

  return {
    track,
    cursoPrincipal,
    cursosComplementarios,
    notaModalidad: MODALIDAD_NOTES[answers.numPersonas] ?? MODALIDAD_NOTES["6-15"],
    notaTiempo,
  };
}
