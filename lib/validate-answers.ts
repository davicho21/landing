import { NUM_PERSONAS_OPTIONS, TIEMPO_DISPONIBLE_OPTIONS, type DiagnosticAnswers } from "./types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const NUM_PERSONAS_VALUES = new Set(NUM_PERSONAS_OPTIONS.map((o) => o.value));
const TIEMPO_VALUES = new Set(TIEMPO_DISPONIBLE_OPTIONS.map((o) => o.value));

export type FieldErrors = Partial<Record<keyof DiagnosticAnswers, string>>;

export function validateStep(step: number, answers: DiagnosticAnswers): FieldErrors {
  const errors: FieldErrors = {};

  switch (step) {
    case 1:
      if (!answers.necesidad.trim()) {
        errors.necesidad = "Selecciona una opción.";
      } else if (answers.necesidad === "otro" && !answers.necesidadOtro.trim()) {
        errors.necesidadOtro = "Cuéntanos brevemente cuál es la necesidad.";
      }
      break;
    case 2:
      if (!answers.motivo.trim()) {
        errors.motivo = "Este campo es obligatorio.";
      }
      break;
    case 3:
      if (!NUM_PERSONAS_VALUES.has(answers.numPersonas as never)) {
        errors.numPersonas = "Selecciona una opción.";
      }
      break;
    case 4:
      if (!TIEMPO_VALUES.has(answers.tiempoDisponible as never)) {
        errors.tiempoDisponible = "Selecciona una opción.";
      }
      break;
    case 5:
      if (!answers.objetivo.trim()) {
        errors.objetivo = "Este campo es obligatorio.";
      }
      break;
    case 6:
      if (!answers.email.trim()) {
        errors.email = "Ingresa tu correo electrónico.";
      } else if (!EMAIL_RE.test(answers.email.trim())) {
        errors.email = "Ingresa un correo electrónico válido.";
      }
      break;
  }

  return errors;
}

export function validateAllAnswers(answers: DiagnosticAnswers): FieldErrors {
  return [1, 2, 3, 4, 5, 6].reduce<FieldErrors>(
    (acc, step) => ({ ...acc, ...validateStep(step, answers) }),
    {}
  );
}

export function isValid(errors: FieldErrors): boolean {
  return Object.keys(errors).length === 0;
}
