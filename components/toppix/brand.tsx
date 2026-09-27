export function ToppixLogo({ className = "", light = false }: { className?: string; light?: boolean }) {
  const ink = light ? "text-white" : "text-tp-rose-deep";
  return (
    <span className={`inline-flex flex-col items-center leading-none ${className}`}>
      <span className={`flex items-center font-display text-[1.9em] font-bold tracking-tight ${ink}`}>
        t
        <svg viewBox="0 0 40 40" className="mx-[0.02em] h-[0.72em] w-[0.72em] translate-y-[0.08em]" aria-hidden>
          <circle cx="20" cy="20" r="18" fill="#E7B47E" />
          <path
            d="M20 4.5C29 4 35.5 11 35 19c1 3-1 4 0 7-3 6-9 9.5-15 9.5C11.5 35.5 4.5 28.5 4.5 20S11.5 4.5 20 4.5ZM20 13a7 7 0 1 0 0 14a7 7 0 1 0 0-14Z"
            fill={light ? "#FFFFFF" : "#F4A9BA"}
            fillRule="evenodd"
          />
          <circle cx="20" cy="20" r="5.2" fill="currentColor" className={light ? "text-tp-rose-deep" : "text-tp-cream"} />
          <rect x="11" y="11" width="5" height="2" rx="1" fill="#9FD8C4" transform="rotate(-30 13 12)" />
          <rect x="26" y="12" width="5" height="2" rx="1" fill="#FBE08A" transform="rotate(40 28 13)" />
          <rect x="27" y="26" width="5" height="2" rx="1" fill="#B9A7EE" transform="rotate(-20 29 27)" />
          <rect x="9" y="25" width="5" height="2" rx="1" fill="#8EC9EE" transform="rotate(25 11 26)" />
        </svg>
        ppix
      </span>
      <span className={`font-display text-[0.55em] font-semibold uppercase tracking-[0.55em] ${light ? "text-white/80" : "text-tp-cocoa/70"}`}>
        donas
      </span>
    </span>
  );
}

/** Glaze drip edge, like the wall in the store. Place at the bottom of a coloured block. */
export function Drip({ color, className = "", flip = false }: { color: string; className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      className={`block h-16 w-full sm:h-24 ${flip ? "rotate-180" : ""} ${className}`}
      aria-hidden
    >
      <path
        fill={color}
        d="M0 0H1440V38C1410 38 1402 52 1400 70C1398 96 1370 98 1368 70C1366 44 1340 40 1310 42C1270 44 1262 58 1260 88C1258 118 1222 118 1220 88C1218 58 1200 40 1160 40C1110 40 1100 48 1098 62C1096 80 1070 80 1068 62C1066 44 1040 38 990 40C940 42 930 56 928 96C926 124 888 124 886 96C884 60 870 42 820 42C770 42 760 50 758 66C756 84 730 84 728 66C726 48 700 38 650 40C600 42 588 56 586 80C584 106 552 106 550 80C548 56 530 40 480 40C430 40 420 50 418 70C416 92 386 92 384 70C382 48 360 40 310 42C262 44 252 60 250 100C248 126 212 126 210 100C208 62 190 42 150 40C110 40 100 48 98 62C96 80 70 80 68 62C66 44 40 38 0 40Z"
      />
    </svg>
  );
}

export function Sparkle({ className = "", color = "#fff" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0Z" fill={color} />
    </svg>
  );
}
