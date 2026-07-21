import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { EMPTY_ANSWERS, type DiagnosticAnswers } from "@/lib/types";
import { validateAllAnswers, isValid } from "@/lib/validate-answers";
import { getRecommendation } from "@/lib/recommendation-engine";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { DiagnosticReportDocument } from "@/lib/pdf/diagnostic-report";

export const runtime = "nodejs";

function toAnswers(body: unknown): DiagnosticAnswers {
  const raw = (body ?? {}) as Partial<DiagnosticAnswers>;
  return {
    ...EMPTY_ANSWERS,
    ...Object.fromEntries(
      Object.keys(EMPTY_ANSWERS).map((key) => [
        key,
        typeof raw[key as keyof DiagnosticAnswers] === "string" ? raw[key as keyof DiagnosticAnswers] : "",
      ])
    ),
  } as DiagnosticAnswers;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ saved: false, error: "invalid_json" }, { status: 400 });
  }

  const answers = toAnswers(body);
  const errors = validateAllAnswers(answers);
  if (!isValid(errors)) {
    return NextResponse.json({ saved: false, errors }, { status: 400 });
  }

  const recommendation = getRecommendation(answers);

  const supabase = getSupabaseServerClient();
  const { data: lead, error: insertError } = await supabase
    .from("leads")
    .insert({
      necesidad: answers.necesidad,
      necesidad_otro: answers.necesidad === "otro" ? answers.necesidadOtro : null,
      motivo: answers.motivo,
      num_personas: answers.numPersonas,
      tiempo_disponible: answers.tiempoDisponible,
      objetivo: answers.objetivo,
      email: answers.email,
      ruta_recomendada: recommendation.track.id,
      cursos_recomendados: [recommendation.cursoPrincipal, ...recommendation.cursosComplementarios],
    })
    .select("id")
    .single();

  if (insertError || !lead) {
    return NextResponse.json({ saved: false, error: "database_error" }, { status: 500 });
  }

  const reportDocument = (
    <DiagnosticReportDocument answers={answers} recommendation={recommendation} generatedAt={new Date()} />
  );

  try {
    const pdfBuffer = await renderToBuffer(reportDocument);
    return NextResponse.json({
      saved: true,
      pdfGenerated: true,
      pdfBase64: pdfBuffer.toString("base64"),
      fileName: "informe-diagnostico-academia-referente.pdf",
    });
  } catch (error) {
    console.error("No se pudo generar el PDF del lead", lead.id, error);
    return NextResponse.json({ saved: true, pdfGenerated: false });
  }
}
