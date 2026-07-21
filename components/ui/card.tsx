import { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-brand-border bg-brand-panel/60 backdrop-blur-sm ${className}`}
      {...props}
    />
  );
}
