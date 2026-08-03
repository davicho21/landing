import { WHEEL_ASPECTS } from "./wheel-config";

export const FREE_EMAIL_DOMAINS = [
  "gmail.com",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "yahoo.com",
  "yahoo.es",
  "icloud.com",
  "aol.com",
  "msn.com",
  "protonmail.com",
];

export const DEFAULT_SCORE = 5;

export type DiagnosticAnswers = {
  empresa: string;
  email: string;
  sector: string;
  respuestas: Record<string, number>;
};

function buildEmptyRespuestas(): Record<string, number> {
  const respuestas: Record<string, number> = {};
  for (const aspecto of WHEEL_ASPECTS) {
    for (const pregunta of aspecto.preguntas) {
      respuestas[pregunta.id] = DEFAULT_SCORE;
    }
  }
  return respuestas;
}

export const EMPTY_ANSWERS: DiagnosticAnswers = {
  empresa: "",
  email: "",
  sector: "",
  respuestas: buildEmptyRespuestas(),
};
