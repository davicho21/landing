import type { DiagnosticAnswers } from "@/lib/types";
import type { WheelAspect } from "@/lib/wheel-config";
import type { FieldErrors } from "@/lib/validate-answers";

type StepProps = {
  answers: DiagnosticAnswers;
  errors: FieldErrors;
  onChange: <K extends keyof DiagnosticAnswers>(field: K, value: DiagnosticAnswers[K]) => void;
};

const errorText = "text-sm text-red-400";
const inputClass =
  "w-full rounded-xl border border-brand-border bg-brand-panel-2 px-4 py-3 text-brand-text placeholder:text-brand-muted/60 outline-none focus:border-brand-accent";

export function StepEmpresa({ answers, errors, onChange }: StepProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold">¿Cuál es el nombre de tu empresa?</h2>
      <input
        className={inputClass}
        value={answers.empresa}
        onChange={(e) => onChange("empresa", e.target.value)}
        placeholder="Ej. Academia Referente S.A.S."
      />
      {errors.empresa && <p className={errorText}>{errors.empresa}</p>}
    </div>
  );
}

export function StepEmail({ answers, errors, onChange }: StepProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold">¿Cuál es tu correo corporativo?</h2>
      <p className="text-sm text-brand-muted">
        Usamos tu correo corporativo para identificarte como lead y darte seguimiento. No aceptamos
        direcciones de Gmail, Hotmail, Outlook u otros proveedores gratuitos.
      </p>
      <input
        type="email"
        className={inputClass}
        value={answers.email}
        onChange={(e) => onChange("email", e.target.value)}
        placeholder="nombre@tuempresa.com"
      />
      {errors.email && <p className={errorText}>{errors.email}</p>}
    </div>
  );
}

export function StepSector({ answers, errors, onChange }: StepProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold">¿A qué sector pertenece la empresa?</h2>
      <input
        className={inputClass}
        value={answers.sector}
        onChange={(e) => onChange("sector", e.target.value)}
        placeholder="Ej. Tecnología, Retail, Salud, Manufactura..."
      />
      {errors.sector && <p className={errorText}>{errors.sector}</p>}
    </div>
  );
}

function tierFor(value: number): { label: string; className: string } {
  if (value <= 4) return { label: "Urgente", className: "text-red-400" };
  if (value <= 7) return { label: "En proceso", className: "text-amber-400" };
  return { label: "Excelente", className: "text-brand-accent" };
}

function ScoreSlider({
  questionText,
  value,
  onChange,
}: {
  questionText: string;
  value: number;
  onChange: (value: number) => void;
}) {
  const tier = tierFor(value);

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-brand-border bg-brand-panel-2 p-4">
      <p className="text-sm text-brand-text">{questionText}</p>
      <input
        type="range"
        min={1}
        max={10}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#6fffb0]"
      />
      <div className="flex items-center justify-between text-xs">
        <span className={`font-semibold ${tier.className}`}>{tier.label}</span>
        <span className="font-semibold text-brand-text">{value} / 10</span>
      </div>
    </div>
  );
}

export function AspectStep({
  aspecto,
  respuestas,
  onChangeRespuesta,
}: {
  aspecto: WheelAspect;
  respuestas: Record<string, number>;
  onChangeRespuesta: (questionId: string, value: number) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-2xl font-semibold">{aspecto.nombre}</h2>
        <p className="mt-1 text-sm text-brand-muted">{aspecto.descripcion}</p>
      </div>
      <div className="flex flex-col gap-3">
        {aspecto.preguntas.map((pregunta) => (
          <ScoreSlider
            key={pregunta.id}
            questionText={pregunta.texto}
            value={respuestas[pregunta.id] ?? 5}
            onChange={(value) => onChangeRespuesta(pregunta.id, value)}
          />
        ))}
      </div>
    </div>
  );
}
