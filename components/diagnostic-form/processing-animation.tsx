"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "Analizando tus respuestas...",
  "Calculando tu Pentágono de Formación Corporativa...",
  "Generando tu informe personalizado...",
];

const MESSAGE_INTERVAL_MS = 2000;
const FILL_DURATION_MS = 6000;

export function ProcessingAnimation() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % MESSAGES.length);
    }, MESSAGE_INTERVAL_MS);
    // Trigger the width transition on the next frame so it animates from 0 instead of
    // snapping straight to 100% (CSS transitions don't fire on the same paint as mount).
    const raf = requestAnimationFrame(() => setFilled(true));
    return () => {
      clearInterval(interval);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 py-8 text-center">
      <div className="h-14 w-14 animate-spin rounded-full border-4 border-white/10 border-t-brand-accent" />
      <div>
        <h2 className="text-xl font-semibold">Procesando tu diagnóstico</h2>
        <p className="mt-2 text-sm text-brand-muted">{MESSAGES[messageIndex]}</p>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-brand-accent ease-linear"
          style={{
            width: filled ? "100%" : "0%",
            transitionProperty: "width",
            transitionDuration: `${FILL_DURATION_MS}ms`,
          }}
        />
      </div>
    </div>
  );
}
