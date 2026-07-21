const ICON_ACCENT = "#6fffb0";
const WORDMARK_LIGHT = "#f5f7fa"; // on dark backgrounds
const WORDMARK_DARK = "#2f4fe0"; // on light backgrounds

export function LogoIcon({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <mask id="referente-icon-notch">
        <rect width="48" height="48" fill="white" />
        <rect x="24" y="24" width="24" height="24" fill="black" />
      </mask>
      <circle
        cx="24"
        cy="24"
        r="24"
        fill={ICON_ACCENT}
        mask="url(#referente-icon-notch)"
      />
    </svg>
  );
}

export function Logo({
  variant = "light",
  iconSize = 28,
}: {
  variant?: "light" | "dark";
  iconSize?: number;
}) {
  const wordmarkColor = variant === "light" ? WORDMARK_LIGHT : WORDMARK_DARK;

  return (
    <div className="inline-flex items-center gap-2" aria-label="Academia Referente">
      <LogoIcon size={iconSize} />
      <span className="flex flex-col leading-none">
        <span
          className="text-lg font-bold tracking-tight"
          style={{ color: wordmarkColor }}
        >
          Referente
        </span>
        <span
          className="text-[0.6rem] font-semibold uppercase tracking-[0.35em]"
          style={{ color: wordmarkColor }}
        >
          Academia
        </span>
      </span>
    </div>
  );
}
