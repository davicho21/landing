export function ProgressBar({ step, total }: { step: number; total: number }) {
  const percent = Math.round((step / total) * 100);

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-xs font-medium uppercase tracking-wide text-brand-muted">
        <span>
          Pregunta {step} de {total}
        </span>
        <span>{percent}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-brand-accent transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
