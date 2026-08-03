import { FREE_EMAIL_DOMAINS, type DiagnosticAnswers } from "./types";
import { WHEEL_ASPECTS } from "./wheel-config";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type FieldErrors = Partial<Record<"empresa" | "email" | "sector", string>>;

export function isFreeEmailDomain(email: string): boolean {
  const domain = email.trim().toLowerCase().split("@")[1];
  if (!domain) return false;
  return FREE_EMAIL_DOMAINS.includes(domain);
}

export function validateStep(step: number, answers: DiagnosticAnswers): FieldErrors {
  const errors: FieldErrors = {};

  switch (step) {
    case 1:
      if (!answers.empresa.trim()) {
        errors.empresa = "Ingresa el nombre de la empresa.";
      }
      break;
    case 2:
      if (!answers.email.trim()) {
        errors.email = "Ingresa tu correo corporativo.";
      } else if (!EMAIL_RE.test(answers.email.trim())) {
        errors.email = "Ingresa un correo electrónico válido.";
      } else if (isFreeEmailDomain(answers.email)) {
        errors.email = "Usa tu correo corporativo — no aceptamos direcciones de Gmail, Hotmail, Outlook u otros proveedores gratuitos.";
      }
      break;
    case 3:
      if (!answers.sector.trim()) {
        errors.sector = "Ingresa el sector de la empresa.";
      }
      break;
    default:
      break;
  }

  return errors;
}

export function validateAllAnswers(answers: DiagnosticAnswers): FieldErrors {
  const errors: FieldErrors = {
    ...validateStep(1, answers),
    ...validateStep(2, answers),
    ...validateStep(3, answers),
  };

  return errors;
}

export function hasValidRespuestas(answers: DiagnosticAnswers): boolean {
  return WHEEL_ASPECTS.every((aspecto) =>
    aspecto.preguntas.every((pregunta) => {
      const value = answers.respuestas[pregunta.id];
      return typeof value === "number" && value >= 1 && value <= 10;
    })
  );
}

export function isValid(errors: FieldErrors): boolean {
  return Object.keys(errors).length === 0;
}
