import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { EMPTY_ANSWERS, type DiagnosticAnswers } from "@/lib/types";
import { validateAllAnswers, isValid, hasValidRespuestas } from "@/lib/validate-answers";
import { getRecommendation } from "@/lib/recommendation-engine";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { DiagnosticReportDocument } from "@/lib/pdf/diagnostic-report";

export const runtime = "nodejs";

function toAnswers(body: unknown): DiagnosticAnswers {
  const raw = (body ?? {}) as Partial<DiagnosticAnswers>;
  const respuestasRaw = (raw.respuestas ?? {}) as Record<string, unknown>;
  const respuestas: Record<string, number> = { ...EMPTY_ANSWERS.respuestas };

  for (const key of Object.keys(respuestas)) {
    const value = respuestasRaw[key];
    if (typeof value === "number" && Number.isFinite(value)) {
      respuestas[key] = Math.min(10, Math.max(1, Math.round(value)));
    }
  }

  return {
    empresa: typeof raw.empresa === "string" ? raw.empresa : "",
    email: typeof raw.email === "string" ? raw.email : "",
    sector: typeof raw.sector === "string" ? raw.sector : "",
    respuestas,
  };
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
  if (!isValid(errors) || !hasValidRespuestas(answers)) {
    return NextResponse.json({ saved: false, errors }, { status: 400 });
  }

  const recommendation = getRecommendation(answers);

  const supabase = getSupabaseServerClient();
  const { data: lead, error: insertError } = await supabase
    .from("leads")
    .insert({
      empresa: answers.empresa,
      email: answers.email,
      sector: answers.sector,
      respuestas: answers.respuestas,
      puntajes_aspectos: recommendation.aspectScores.map((score) => ({
        id: score.aspecto.id,
        nombre: score.aspecto.nombre,
        promedio: score.promedio,
      })),
      areas_criticas: recommendation.areasCriticas.map((area) => ({
        id: area.aspecto.id,
        nombre: area.aspecto.nombre,
        promedio: area.promedio,
        ruta: area.track.id,
        cursoPrincipal: area.cursoPrincipal.id,
        cursosComplementarios: area.cursosComplementarios.map((c) => c.id),
      })),
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
      fileName: "rueda-crecimiento-organizacional-academia-referente.pdf",
    });
  } catch (error) {
    console.error("No se pudo generar el PDF del lead", lead.id, error);
    return NextResponse.json({ saved: true, pdfGenerated: false });
  }
}
