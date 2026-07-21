export const NUM_PERSONAS_OPTIONS = [
  { value: "1-5", label: "1 a 5 personas" },
  { value: "6-15", label: "6 a 15 personas" },
  { value: "16-50", label: "16 a 50 personas" },
  { value: "50+", label: "Más de 50 personas" },
] as const;

export const TIEMPO_DISPONIBLE_OPTIONS = [
  { value: "menos-4h", label: "Menos de 4 horas en total" },
  { value: "4-8h", label: "Entre 4 y 8 horas" },
  { value: "8-16h", label: "Entre 8 y 16 horas" },
  { value: "mas-16h", label: "Más de 16 horas" },
] as const;

export type NumPersonas = (typeof NUM_PERSONAS_OPTIONS)[number]["value"];
export type TiempoDisponible = (typeof TIEMPO_DISPONIBLE_OPTIONS)[number]["value"];

export type DiagnosticAnswers = {
  necesidad: string;
  necesidadOtro: string;
  motivo: string;
  numPersonas: NumPersonas | "";
  tiempoDisponible: TiempoDisponible | "";
  objetivo: string;
  email: string;
};

export const EMPTY_ANSWERS: DiagnosticAnswers = {
  necesidad: "",
  necesidadOtro: "",
  motivo: "",
  numPersonas: "",
  tiempoDisponible: "",
  objetivo: "",
  email: "",
};
