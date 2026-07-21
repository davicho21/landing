import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function Confirmation({
  pdfGenerated,
  downloadUrl,
  fileName,
}: {
  pdfGenerated: boolean;
  downloadUrl: string | null;
  fileName: string;
}) {
  if (pdfGenerated && downloadUrl) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <Badge>Diagnóstico completo</Badge>
        <h2 className="text-2xl font-semibold">Tu informe está listo</h2>
        <p className="max-w-md text-brand-muted">
          Guardamos tus respuestas. Descarga tu informe con recomendaciones y una ruta de formación sugerida
          para tu equipo.
        </p>
        <a href={downloadUrl} download={fileName}>
          <Button>Descargar informe (PDF)</Button>
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <Badge className="bg-brand-accent-2 text-[#0a1030]">Respuestas guardadas</Badge>
      <h2 className="text-2xl font-semibold">Tuvimos un problema generando tu informe</h2>
      <p className="max-w-md text-brand-muted">
        Guardamos tus respuestas correctamente, pero no pudimos generar el PDF en este momento. Nuestro equipo
        se pondrá en contacto contigo directamente.
      </p>
    </div>
  );
}
