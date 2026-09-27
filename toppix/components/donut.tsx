import {
  BASES,
  DRIZZLES,
  GLAZES,
  findOption,
  type DonutRecipe,
  type ToppingKind,
} from "@/lib/options";

const C = 100; // centre of the 200×200 viewBox

function r2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Deterministic PRNG so server and client render identical toppings. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  return h >>> 0;
}

function wavyRing(radius: (a: number) => number, steps = 160): string {
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const r = radius(a);
    d += `${i === 0 ? "M" : "L"}${r2(C + r * Math.cos(a))} ${r2(C + r * Math.sin(a))}`;
  }
  return d + "Z";
}

function circle(r: number): string {
  return `M${C + r} ${C}A${r} ${r} 0 1 0 ${C - r} ${C}A${r} ${r} 0 1 0 ${C + r} ${C}Z`;
}

const GLAZE_OUTER = wavyRing(
  (a) =>
    72 +
    3 * Math.sin(5 * a) +
    2.5 * Math.sin(9 * a + 1) +
    // a few drips that run towards the edge of the dough
    7 * Math.max(0, Math.sin(3 * a + 0.6)) ** 12 +
    6 * Math.max(0, Math.sin(4 * a + 2.2)) ** 14,
);
const GLAZE_INNER = wavyRing((a) => 31 + 1.8 * Math.sin(6 * a + 0.4));
const GLAZE_PATH = GLAZE_OUTER + GLAZE_INNER;
const DOUGH_PATH = circle(88) + circle(24);
const ANNULUS = circle(71) + circle(33);

const SPRINKLE_COLORS = ["#F7A1C4", "#9FD8C4", "#FBE08A", "#B9A7EE", "#8EC9EE", "#FFFFFF", "#F28C8C"];

function toppingPositions(kind: ToppingKind, count: number, seed: number) {
  const rand = rng(seed ^ hash(kind));
  return Array.from({ length: count }, () => {
    const a = rand() * Math.PI * 2;
    const r = 39 + rand() * 28;
    return {
      x: r2(C + r * Math.cos(a)),
      y: r2(C + r * Math.sin(a)),
      rot: Math.round(rand() * 360),
      pick: rand(),
      size: 0.8 + rand() * 0.45,
    };
  });
}

const COUNTS: Record<ToppingKind, number> = {
  chispas: 38,
  chocochips: 16,
  fresas: 7,
  galleta: 18,
  coco: 34,
  pistacho: 16,
  malvaviscos: 11,
  corazones: 9,
};

function ToppingLayer({ kind, seed }: { kind: ToppingKind; seed: number }) {
  const items = toppingPositions(kind, COUNTS[kind], seed);
  return (
    <g>
      {items.map((p, i) => {
        const t = `translate(${p.x} ${p.y}) rotate(${p.rot}) scale(${r2(p.size)})`;
        switch (kind) {
          case "chispas":
            return (
              <rect
                key={i}
                x={-5}
                y={-1.6}
                width={10}
                height={3.2}
                rx={1.6}
                transform={t}
                fill={SPRINKLE_COLORS[Math.floor(p.pick * SPRINKLE_COLORS.length)]}
              />
            );
          case "chocochips":
            return (
              <g key={i} transform={t}>
                <path d="M0 -4 C3 -1 4 2 0 3 C-4 2 -3 -1 0 -4Z" fill="#43261C" />
                <circle cx={-1} cy={0} r={0.8} fill="#8A5A48" />
              </g>
            );
          case "fresas":
            return (
              <g key={i} transform={t}>
                <path d="M0 -6 C6 -6 7 2 0 7 C-7 2 -6 -6 0 -6Z" fill="#E2566B" />
                <path d="M0 -3.5 C3.5 -3.5 4 1 0 4 C-4 1 -3.5 -3.5 0 -3.5Z" fill="#F7A7B1" />
                <circle cx={-1.5} cy={-1} r={0.5} fill="#FFF3C4" />
                <circle cx={1.5} cy={0.5} r={0.5} fill="#FFF3C4" />
              </g>
            );
          case "galleta":
            return (
              <path
                key={i}
                transform={t}
                d="M-3 -2 L2 -3.5 L4 0 L1.5 3 L-3 2.5Z"
                fill={p.pick > 0.5 ? "#C98E57" : "#3B2A26"}
              />
            );
          case "coco":
            return (
              <line
                key={i}
                transform={t}
                x1={-3}
                x2={3}
                y1={0}
                y2={0}
                stroke="#FFFFFF"
                strokeWidth={1.3}
                strokeLinecap="round"
              />
            );
          case "pistacho":
            return (
              <path
                key={i}
                transform={t}
                d="M-2.5 -2 L2.5 -2.5 L3 1.5 L-1 3 L-3 0.5Z"
                fill={p.pick > 0.4 ? "#9CC27A" : "#C4DDA0"}
              />
            );
          case "malvaviscos":
            return (
              <rect
                key={i}
                transform={t}
                x={-3.5}
                y={-3.5}
                width={7}
                height={7}
                rx={2.6}
                fill={p.pick > 0.5 ? "#FFFFFF" : "#FBD3E0"}
                stroke="#F2BFD0"
                strokeWidth={0.5}
              />
            );
          case "corazones":
            return (
              <path
                key={i}
                transform={t}
                d="M0 3.5 C-5 0 -4 -4.5 -1.5 -4 C-0.6 -3.8 0 -3 0 -2.4 C0 -3 0.6 -3.8 1.5 -4 C4 -4.5 5 0 0 3.5Z"
                fill={p.pick > 0.5 ? "#E86A86" : "#FFFFFF"}
              />
            );
        }
      })}
    </g>
  );
}

function Drizzle({ color, seed, clipId }: { color: string; seed: number; clipId: string }) {
  const rand = rng(seed ^ 0x9e3779b9);
  const lines = [0, 1, 2, 3, 4].map((row) => {
    const y0 = 40 + row * 30 + rand() * 6;
    let d = `M18 ${r2(y0)}`;
    for (let x = 18; x <= 182; x += 16) {
      const up = ((x - 18) / 16) % 2 === 0;
      d += ` Q${x + 8} ${r2(y0 + (up ? -18 : 18))} ${x + 16} ${r2(y0 + (rand() - 0.5) * 6)}`;
    }
    return d;
  });
  return (
    <g clipPath={`url(#${clipId})`}>
      {lines.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={3.4}
          strokeLinecap="round"
          transform={`rotate(-18 ${C} ${C})`}
        />
      ))}
    </g>
  );
}

export function Donut({
  recipe,
  uid,
  className,
  title,
}: {
  recipe: DonutRecipe;
  /** Unique per instance on the page; used for SVG defs ids. */
  uid: string;
  className?: string;
  title?: string;
}) {
  const base = findOption(BASES, recipe.base);
  const glaze = findOption(GLAZES, recipe.glaze);
  const drizzle = findOption(DRIZZLES, recipe.drizzle);
  const seed = hash(uid);
  const doughId = `${uid}-dough`;
  const clipId = `${uid}-clip`;

  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label={title ?? "Dona"}>
      <defs>
        <radialGradient id={doughId} cx="50%" cy="50%" r="50%">
          <stop offset="30%" stopColor={base.color} stopOpacity={0.85} />
          <stop offset="62%" stopColor={base.color} />
          <stop offset="100%" stopColor="#000" stopOpacity={0.25} />
        </radialGradient>
        <clipPath id={clipId}>
          <path d={ANNULUS} clipRule="evenodd" />
        </clipPath>
      </defs>

      <ellipse cx={C} cy={C + 84} rx={70} ry={8} fill="#000" opacity={0.08} />
      <path d={DOUGH_PATH} fillRule="evenodd" fill={base.color} />
      <path d={DOUGH_PATH} fillRule="evenodd" fill={`url(#${doughId})`} opacity={0.55} />

      {glaze.id !== "ninguno" && (
        <>
          <path d={GLAZE_PATH} fillRule="evenodd" fill={glaze.color} />
          <path
            d="M52 70 A58 58 0 0 1 96 44"
            fill="none"
            stroke="#fff"
            strokeOpacity={0.45}
            strokeWidth={5}
            strokeLinecap="round"
          />
        </>
      )}

      {drizzle.id !== "ninguno" && <Drizzle color={drizzle.color} seed={seed} clipId={clipId} />}

      {recipe.toppings.map((kind) => (
        <ToppingLayer key={kind} kind={kind} seed={seed} />
      ))}
    </svg>
  );
}
