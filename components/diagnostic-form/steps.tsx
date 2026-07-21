import { TRAINING_TRACKS } from "@/lib/course-catalog";
import { NUM_PERSONAS_OPTIONS, TIEMPO_DISPONIBLE_OPTIONS, type DiagnosticAnswers } from "@/lib/types";
import type { FieldErrors } from "@/lib/validate-answers";

type StepProps = {
  answers: DiagnosticAnswers;
  errors: FieldErrors;
  onChange: <K extends keyof DiagnosticAnswers>(field: K, value: DiagnosticAnswers[K]) => void;
};

const fieldLabel = "text-sm font-medium text-brand-muted";
const errorText = "text-sm text-red-400";
const inputClass =
  "w-full rounded-xl border border-brand-border bg-brand-panel-2 px-4 py-3 text-brand-text placeholder:text-brand-muted/60 outline-none focus:border-brand-accent";

function OptionCard({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
        selected
          ? "border-brand-accent bg-brand-accent/10 text-brand-text"
          : "border-brand-border bg-brand-panel-2 text-brand-muted hover:border-white/20"
      }`}
    >
      {children}
    </button>
  );
}

export function StepNecesidad({ answers, errors, onChange }: StepProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold">¿Cuál es la necesidad de formación actual?</h2>
      <div className="grid gap-2 sm:grid-cols-2">
        {TRAINING_TRACKS.map((track) => (
          <OptionCard
            key={track.id}
            selected={answers.necesidad === track.id}
            onClick={() => onChange("necesidad", track.id)}
          >
            {track.nombre}
          </OptionCard>
        ))}
        <OptionCard selected={answers.necesidad === "otro"} onClick={() => onChange("necesidad", "otro")}>
          Otra necesidad
        </OptionCard>
      </div>
      {errors.necesidad && <p className={errorText}>{errors.necesidad}</p>}
      {answers.necesidad === "otro" && (
        <div className="flex flex-col gap-1">
          <label className={fieldLabel} htmlFor="necesidadOtro">
            Cuéntanos brevemente
          </label>
          <input
            id="necesidadOtro"
            className={inputClass}
            value={answers.necesidadOtro}
            onChange={(e) => onChange("necesidadOtro", e.target.value)}
            placeholder="Ej. queremos mejorar cómo negociamos con clientes grandes"
          />
          {errors.necesidadOtro && <p className={errorText}>{errors.necesidadOtro}</p>}
        </div>
      )}
    </div>
  );
}

export function StepMotivo({ answers, errors, onChange }: StepProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold">¿Por qué considera necesaria esta formación ahora?</h2>
      <textarea
        className={`${inputClass} min-h-32`}
        value={answers.motivo}
        onChange={(e) => onChange("motivo", e.target.value)}
        placeholder="Ej. notamos brechas de habilidades que están afectando los resultados del equipo"
      />
      {errors.motivo && <p className={errorText}>{errors.motivo}</p>}
    </div>
  );
}

export function StepNumPersonas({ answers, errors, onChange }: StepProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold">¿Cuántas personas participarán?</h2>
      <div className="grid gap-2 sm:grid-cols-2">
        {NUM_PERSONAS_OPTIONS.map((option) => (
          <OptionCard
            key={option.value}
            selected={answers.numPersonas === option.value}
            onClick={() => onChange("numPersonas", option.value)}
          >
            {option.label}
          </OptionCard>
        ))}
      </div>
      {errors.numPersonas && <p className={errorText}>{errors.numPersonas}</p>}
    </div>
  );
}

export function StepTiempo({ answers, errors, onChange }: StepProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold">¿Cuánto tiempo tienen disponible para la capacitación?</h2>
      <div className="grid gap-2 sm:grid-cols-2">
        {TIEMPO_DISPONIBLE_OPTIONS.map((option) => (
          <OptionCard
            key={option.value}
            selected={answers.tiempoDisponible === option.value}
            onClick={() => onChange("tiempoDisponible", option.value)}
          >
            {option.label}
          </OptionCard>
        ))}
      </div>
      {errors.tiempoDisponible && <p className={errorText}>{errors.tiempoDisponible}</p>}
    </div>
  );
}

export function StepObjetivo({ answers, errors, onChange }: StepProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold">¿Qué espera lograr con esta formación?</h2>
      <textarea
        className={`${inputClass} min-h-32`}
        value={answers.objetivo}
        onChange={(e) => onChange("objetivo", e.target.value)}
        placeholder="Ej. reducir la rotación del equipo y mejorar los resultados comerciales"
      />
      {errors.objetivo && <p className={errorText}>{errors.objetivo}</p>}
    </div>
  );
}

export function StepEmail({ answers, errors, onChange }: StepProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold">¿A qué correo enviamos tu informe?</h2>
      <p className="text-sm text-brand-muted">
        Te enviaremos un PDF con recomendaciones y una ruta de formación sugerida para tu equipo.
      </p>
      <input
        type="email"
        className={inputClass}
        value={answers.email}
        onChange={(e) => onChange("email", e.target.value)}
        placeholder="nombre@empresa.com"
      />
      {errors.email && <p className={errorText}>{errors.email}</p>}
    </div>
  );
}
