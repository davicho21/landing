import { Badge } from "@/components/ui/badge";

export function Confirmation({ emailSent, email }: { emailSent: boolean; email: string }) {
  if (emailSent) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <Badge>Diagnóstico completo</Badge>
        <h2 className="text-2xl font-semibold">Revisa tu correo</h2>
        <p className="max-w-md text-brand-muted">
          Enviamos tu informe de recomendaciones a <span className="text-brand-text">{email}</span>. Si no lo ves
          en unos minutos, revisa la carpeta de spam.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <Badge className="bg-brand-accent-2 text-[#0a1030]">Respuestas guardadas</Badge>
      <h2 className="text-2xl font-semibold">Tuvimos un problema enviando el correo</h2>
      <p className="max-w-md text-brand-muted">
        Guardamos tus respuestas correctamente, pero no pudimos enviar el PDF a <span className="text-brand-text">{email}</span>.
        Nuestro equipo se pondrá en contacto contigo directamente.
      </p>
    </div>
  );
}
