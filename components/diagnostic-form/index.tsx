"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Card } from "@/components/ui/card";
import { EMPTY_ANSWERS, type DiagnosticAnswers } from "@/lib/types";
import { validateStep, isValid, type FieldErrors } from "@/lib/validate-answers";
import {
  StepNecesidad,
  StepMotivo,
  StepNumPersonas,
  StepTiempo,
  StepObjetivo,
  StepEmail,
} from "./steps";
import { Confirmation } from "./confirmation";

const TOTAL_STEPS = 6;
const DEFAULT_FILE_NAME = "informe-diagnostico-academia-referente.pdf";

const STEP_COMPONENTS = [
  StepNecesidad,
  StepMotivo,
  StepNumPersonas,
  StepTiempo,
  StepObjetivo,
  StepEmail,
];

type SubmitStatus = "idle" | "submitting" | "done" | "error";

function base64ToObjectUrl(base64: string): string {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
}

export function DiagnosticForm() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<DiagnosticAnswers>(EMPTY_ANSWERS);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [pdfGenerated, setPdfGenerated] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState(DEFAULT_FILE_NAME);

  function handleChange<K extends keyof DiagnosticAnswers>(field: K, value: DiagnosticAnswers[K]) {
    setAnswers((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function submit() {
    setStatus("submitting");
    try {
      const res = await fetch("/api/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.saved) {
        setStatus("error");
        return;
      }

      if (data.pdfGenerated && typeof data.pdfBase64 === "string") {
        setDownloadUrl(base64ToObjectUrl(data.pdfBase64));
        setFileName(data.fileName ?? DEFAULT_FILE_NAME);
        setPdfGenerated(true);
      } else {
        setPdfGenerated(false);
      }
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  function handleNext() {
    const stepErrors = validateStep(step, answers);
    if (!isValid(stepErrors)) {
      setErrors(stepErrors);
      return;
    }

    if (step < TOTAL_STEPS) {
      setStep(step + 1);
      return;
    }

    submit();
  }

  function handleBack() {
    if (step > 1) setStep(step - 1);
  }

  if (status === "done") {
    return (
      <Card className="w-full max-w-xl p-8">
        <Confirmation pdfGenerated={pdfGenerated} downloadUrl={downloadUrl} fileName={fileName} />
      </Card>
    );
  }

  const StepComponent = STEP_COMPONENTS[step - 1];

  return (
    <Card className="w-full max-w-xl p-8">
      <div className="flex flex-col gap-8">
        <ProgressBar step={step} total={TOTAL_STEPS} />
        <StepComponent answers={answers} errors={errors} onChange={handleChange} />

        {status === "error" && (
          <p className="text-sm text-red-400">
            No pudimos procesar tu solicitud. Verifica tu conexión e inténtalo de nuevo.
          </p>
        )}

        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={handleBack} disabled={step === 1 || status === "submitting"}>
            Atrás
          </Button>
          <Button onClick={handleNext} disabled={status === "submitting"}>
            {status === "submitting" ? "Generando..." : step === TOTAL_STEPS ? "Enviar" : "Siguiente"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
