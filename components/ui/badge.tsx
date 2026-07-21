import { HTMLAttributes } from "react";

export function Badge({ className = "", ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-brand-accent px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#06110a] ${className}`}
      {...props}
    />
  );
}
