import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "filled" | "outline";

const base =
  "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  filled: "bg-brand-accent text-[#06110a] hover:bg-brand-accent/90",
  outline:
    "border border-white/30 text-brand-text hover:border-brand-accent hover:text-brand-accent",
};

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }
>(function Button({ variant = "filled", className = "", ...props }, ref) {
  return (
    <button
      ref={ref}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    />
  );
});
