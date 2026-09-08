import { Logo } from "@/components/logo";
import { DiagnosticForm } from "@/components/diagnostic-form";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-brand-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Logo variant="light" />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center gap-12 px-6 py-16">
        <div className="flex max-w-2xl flex-col items-center gap-4 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">
            Índice de Madurez de Formación Corporativa
          </span>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
            ¿Qué tan preparada está tu empresa para{" "}
            <span className="text-brand-accent">crecer en 2026?</span>
          </h1>
          <p className="max-w-xl text-brand-muted">
            Determina el nivel actual del desarrollo profesional dentro de tu empresa. Evalúa 5 dimensiones
            clave y descarga un informe con tu Pentágono de Formación Corporativa, áreas críticas y una ruta
            de formación sugerida, elaborado por Academia Referente.
          </p>
        </div>

        <DiagnosticForm />
      </main>

      <footer className="border-t border-brand-border py-6 text-center text-xs text-brand-muted">
        © {new Date().getFullYear()} Academia Referente. Todos los derechos reservados.
      </footer>
    </div>
  );
}
