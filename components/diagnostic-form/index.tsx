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

const STEP_COMPONENTS = [
  StepNecesidad,
  StepMotivo,
  StepNumPersonas,
  StepTiempo,
  StepObjetivo,
  StepEmail,
];

type SubmitStatus = "idle" | "submitting" | "success" | "partial" | "error";

export function DiagnosticForm() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<DiagnosticAnswers>(EMPTY_ANSWERS);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");

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

      setStatus(data.emailSent ? "success" : "partial");
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

  if (status === "success" || status === "partial") {
    return (
      <Card className="w-full max-w-xl p-8">
        <Confirmation emailSent={status === "success"} email={answers.email} />
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
            {status === "submitting" ? "Enviando..." : step === TOTAL_STEPS ? "Enviar" : "Siguiente"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
