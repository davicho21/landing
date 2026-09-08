import { PENTAGON_AREAS } from "./pentagon-config";

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
  nombres: string;
  apellidos: string;
  email: string;
  cargo: string;
  areaDesempeno: string;
  empresa: string;
  sitioWeb: string;
  pais: string;
  ciudad: string;
  industria: string;
  numColaboradores: string;
  desafioPrincipal: string;
  respuestas: Record<string, number>;
};

function buildEmptyRespuestas(): Record<string, number> {
  const respuestas: Record<string, number> = {};
  for (const area of PENTAGON_AREAS) {
    for (const pregunta of area.preguntas) {
      respuestas[pregunta.id] = DEFAULT_SCORE;
    }
  }
  return respuestas;
}

export const EMPTY_ANSWERS: DiagnosticAnswers = {
  nombres: "",
  apellidos: "",
  email: "",
  cargo: "",
  areaDesempeno: "",
  empresa: "",
  sitioWeb: "",
  pais: "",
  ciudad: "",
  industria: "",
  numColaboradores: "",
  desafioPrincipal: "",
  respuestas: buildEmptyRespuestas(),
};
