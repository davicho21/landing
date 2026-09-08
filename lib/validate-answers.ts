import { FREE_EMAIL_DOMAINS, type DiagnosticAnswers } from "./types";
import { PENTAGON_AREAS } from "./pentagon-config";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type FieldErrors = Partial<
  Record<
    | "nombres"
    | "apellidos"
    | "email"
    | "cargo"
    | "areaDesempeno"
    | "empresa"
    | "pais"
    | "ciudad"
    | "industria"
    | "numColaboradores",
    string
  >
>;

export function isFreeEmailDomain(email: string): boolean {
  const domain = email.trim().toLowerCase().split("@")[1];
  if (!domain) return false;
  return FREE_EMAIL_DOMAINS.includes(domain);
}

export function validateStep(step: number, answers: DiagnosticAnswers): FieldErrors {
  const errors: FieldErrors = {};

  switch (step) {
    case 1:
      if (!answers.nombres.trim()) errors.nombres = "Ingresa tu nombre.";
      if (!answers.apellidos.trim()) errors.apellidos = "Ingresa tu apellido.";
      if (!answers.email.trim()) {
        errors.email = "Ingresa tu correo corporativo.";
      } else if (!EMAIL_RE.test(answers.email.trim())) {
        errors.email = "Ingresa un correo electrónico válido.";
      } else if (isFreeEmailDomain(answers.email)) {
        errors.email = "Usa tu correo corporativo — no aceptamos direcciones de Gmail, Hotmail, Outlook u otros proveedores gratuitos.";
      }
      if (!answers.cargo.trim()) errors.cargo = "Ingresa tu cargo o puesto.";
      if (!answers.areaDesempeno.trim()) errors.areaDesempeno = "Selecciona tu área de desempeño.";
      break;
    case 2:
      if (!answers.empresa.trim()) errors.empresa = "Ingresa el nombre de la empresa.";
      if (!answers.pais.trim()) errors.pais = "Selecciona un país.";
      if (!answers.ciudad.trim()) errors.ciudad = "Ingresa la ciudad.";
      if (!answers.industria.trim()) errors.industria = "Selecciona la industria o sector.";
      if (!answers.numColaboradores.trim()) errors.numColaboradores = "Selecciona el número de colaboradores.";
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
  };

  return errors;
}

export function hasValidRespuestas(answers: DiagnosticAnswers): boolean {
  return PENTAGON_AREAS.every((aspecto) =>
    aspecto.preguntas.every((pregunta) => {
      const value = answers.respuestas[pregunta.id];
      return typeof value === "number" && value >= 1 && value <= 10;
    })
  );
}

export function isValid(errors: FieldErrors): boolean {
  return Object.keys(errors).length === 0;
}
