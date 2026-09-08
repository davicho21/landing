import type { DiagnosticAnswers } from "@/lib/types";
import type { PentagonArea } from "@/lib/pentagon-config";
import type { FieldErrors } from "@/lib/validate-answers";
import {
  AREA_DESEMPENO_OPTIONS,
  DESAFIO_PRINCIPAL_OPTIONS,
  INDUSTRIA_OPTIONS,
  NUM_COLABORADORES_OPTIONS,
  PAISES,
} from "@/lib/form-options";

type StepProps = {
  answers: DiagnosticAnswers;
  errors: FieldErrors;
  onChange: <K extends keyof DiagnosticAnswers>(field: K, value: DiagnosticAnswers[K]) => void;
};

const errorText = "text-sm text-red-400";
const labelClass = "text-sm font-medium text-brand-text";
const inputClass =
  "w-full rounded-xl border border-brand-border bg-brand-panel-2 px-4 py-3 text-brand-text placeholder:text-brand-muted/60 outline-none focus:border-brand-accent";
const selectClass = `${inputClass} appearance-none`;

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className={labelClass}>{label}</label>
      {children}
      {error && <p className={errorText}>{error}</p>}
    </div>
  );
}

export function StepContacto({ answers, errors, onChange }: StepProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-2xl font-semibold">Información de contacto profesional</h2>
        <p className="mt-1 text-sm text-brand-muted">
          Usamos estos datos para identificarte como lead y darte seguimiento comercial.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nombre(s)" error={errors.nombres}>
          <input
            className={inputClass}
            value={answers.nombres}
            onChange={(e) => onChange("nombres", e.target.value)}
            placeholder="Ej. María"
          />
        </Field>
        <Field label="Apellido(s)" error={errors.apellidos}>
          <input
            className={inputClass}
            value={answers.apellidos}
            onChange={(e) => onChange("apellidos", e.target.value)}
            placeholder="Ej. González"
          />
        </Field>
      </div>

      <Field label="Correo electrónico corporativo" error={errors.email}>
        <input
          type="email"
          className={inputClass}
          value={answers.email}
          onChange={(e) => onChange("email", e.target.value)}
          placeholder="nombre@tuempresa.com"
        />
        <p className="text-xs text-brand-muted">
          No aceptamos direcciones de Gmail, Hotmail, Outlook u otros proveedores gratuitos.
        </p>
      </Field>

      <Field label="Cargo / Puesto" error={errors.cargo}>
        <input
          className={inputClass}
          value={answers.cargo}
          onChange={(e) => onChange("cargo", e.target.value)}
          placeholder="Ej. Director de Gestión Humana, Gerente de L&D, CEO"
        />
      </Field>

      <Field label="Área de desempeño" error={errors.areaDesempeno}>
        <select
          className={selectClass}
          value={answers.areaDesempeno}
          onChange={(e) => onChange("areaDesempeno", e.target.value)}
        >
          <option value="">Selecciona un área</option>
          {AREA_DESEMPENO_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </Field>
    </div>
  );
}

export function StepOrganizacion({ answers, errors, onChange }: StepProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-2xl font-semibold">Perfil de la organización</h2>
        <p className="mt-1 text-sm text-brand-muted">
          Esta información nos permite personalizar tu informe y contactarte con la propuesta adecuada.
        </p>
      </div>

      <Field label="Nombre de la empresa" error={errors.empresa}>
        <input
          className={inputClass}
          value={answers.empresa}
          onChange={(e) => onChange("empresa", e.target.value)}
          placeholder="Ej. Academia Referente S.A.S."
        />
      </Field>

      <Field label="Sitio web de la empresa (opcional)">
        <input
          className={inputClass}
          value={answers.sitioWeb}
          onChange={(e) => onChange("sitioWeb", e.target.value)}
          placeholder="www.tuempresa.com"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="País" error={errors.pais}>
          <select className={selectClass} value={answers.pais} onChange={(e) => onChange("pais", e.target.value)}>
            <option value="">Selecciona un país</option>
            {PAISES.map((pais) => (
              <option key={pais} value={pais}>
                {pais}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Ciudad" error={errors.ciudad}>
          <input
            className={inputClass}
            value={answers.ciudad}
            onChange={(e) => onChange("ciudad", e.target.value)}
            placeholder="Ej. Bogotá"
          />
        </Field>
      </div>

      <Field label="Industria / Sector" error={errors.industria}>
        <select
          className={selectClass}
          value={answers.industria}
          onChange={(e) => onChange("industria", e.target.value)}
        >
          <option value="">Selecciona una industria</option>
          {INDUSTRIA_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Número de colaboradores" error={errors.numColaboradores}>
        <select
          className={selectClass}
          value={answers.numColaboradores}
          onChange={(e) => onChange("numColaboradores", e.target.value)}
        >
          <option value="">Selecciona un rango</option>
          {NUM_COLABORADORES_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </Field>
    </div>
  );
}

export function StepDesafio({ answers, onChange }: StepProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-2xl font-semibold">¿Cuál es tu principal desafío de formación hoy?</h2>
        <p className="mt-1 text-sm text-brand-muted">Opcional — nos ayuda a entender mejor tu contexto.</p>
      </div>
      <select
        className={selectClass}
        value={answers.desafioPrincipal}
        onChange={(e) => onChange("desafioPrincipal", e.target.value)}
      >
        <option value="">Prefiero no responder</option>
        {DESAFIO_PRINCIPAL_OPTIONS.map((opt) => (
          <option key={opt.label} value={opt.label}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function tierFor(value: number): { label: string; className: string } {
  if (value <= 4) return { label: "Crítico", className: "text-red-400" };
  if (value <= 7) return { label: "En consolidación", className: "text-amber-400" };
  return { label: "Excelencia estratégica", className: "text-brand-accent" };
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
  aspecto: PentagonArea;
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
