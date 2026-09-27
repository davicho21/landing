"use client";

import { useState } from "react";
import { Donut } from "./donut";
import {
  BASES,
  DRIZZLES,
  GLAZES,
  MAX_TOPPINGS,
  TOPPINGS,
  findOption,
  formatPrice,
  recipeName,
  recipePrice,
  type DonutRecipe,
  type Option,
  type ToppingKind,
} from "@/lib/options";
import { WHATSAPP_NUMBER } from "@/lib/contact";

const STEPS = [
  { n: 1, label: "Base", color: "bg-tp-butter" },
  { n: 2, label: "Glaseado", color: "bg-tp-pink" },
  { n: 3, label: "Toppings", color: "bg-tp-mint" },
  { n: 4, label: "¡Lista!", color: "bg-tp-lilac" },
] as const;

const BOX_SIZE = 6;

const START: DonutRecipe = {
  base: "clasica",
  glaze: "fresa",
  drizzle: "blanco",
  toppings: ["chispas"],
};

function pick<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

function randomRecipe(): DonutRecipe {
  const shuffled = [...TOPPINGS].sort(() => Math.random() - 0.5);
  const count = 1 + Math.floor(Math.random() * MAX_TOPPINGS);
  return {
    base: pick(BASES).id,
    glaze: pick(GLAZES.filter((g) => g.id !== "ninguno")).id,
    drizzle: pick(DRIZZLES).id,
    toppings: shuffled.slice(0, count).map((t) => t.id),
  };
}

function Swatch({
  option,
  selected,
  onClick,
}: {
  option: Option;
  selected: boolean;
  onClick: () => void;
}) {
  const none = option.color === "transparent";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group flex items-center gap-3 rounded-2xl border-2 bg-white px-3 py-2.5 text-left transition-all hover:-translate-y-0.5 ${
        selected ? "border-tp-rose shadow-[0_6px_0_#e7a2ae]" : "border-tp-line hover:border-tp-rose/50"
      }`}
    >
      <span
        className="h-9 w-9 shrink-0 rounded-full border-2 border-white shadow-[0_0_0_2px_#f1d6db]"
        style={{
          background: none
            ? "repeating-linear-gradient(45deg,#fff 0 4px,#f6dde2 4px 8px)"
            : option.color,
        }}
      />
      <span className="min-w-0">
        <span className="block text-sm font-bold text-tp-cocoa">{option.name}</span>
        <span className="block text-xs text-tp-cocoa/60">
          {option.price ? `+${formatPrice(option.price)}` : "Incluido"}
        </span>
      </span>
    </button>
  );
}

export function DonutBuilder() {
  const [step, setStep] = useState(1);
  const [recipe, setRecipe] = useState<DonutRecipe>(START);
  const [customName, setCustomName] = useState("");
  const [box, setBox] = useState<{ recipe: DonutRecipe; name: string }[]>([]);
  const [sent, setSent] = useState(false);
  const [bump, setBump] = useState(0);

  const price = recipePrice(recipe);
  const name = customName.trim() || recipeName(recipe);

  function update(patch: Partial<DonutRecipe>) {
    setRecipe((r) => ({ ...r, ...patch }));
    setBump((b) => b + 1);
    setSent(false);
  }

  function toggleTopping(id: ToppingKind) {
    const has = recipe.toppings.includes(id);
    if (!has && recipe.toppings.length >= MAX_TOPPINGS) return;
    update({ toppings: has ? recipe.toppings.filter((t) => t !== id) : [...recipe.toppings, id] });
  }

  function addToBox() {
    if (box.length >= BOX_SIZE) return;
    setBox((b) => [...b, { recipe, name }]);
    setCustomName("");
    setSent(false);
  }

  function order() {
    const items = box.length ? box : [{ recipe, name }];
    if (WHATSAPP_NUMBER) {
      const lines = items.map((d, i) => {
        const t = d.recipe.toppings
          .map((id) => TOPPINGS.find((x) => x.id === id)?.name)
          .join(", ");
        return `${i + 1}. ${d.name} — base ${findOption(BASES, d.recipe.base).name}, glaseado ${findOption(GLAZES, d.recipe.glaze).name}, hilos ${findOption(DRIZZLES, d.recipe.drizzle).name}${t ? `, toppings: ${t}` : ""}`;
      });
      const text = `¡Hola Toppix! Quiero pedir:\n${lines.join("\n")}`;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank");
    }
    setSent(true);
  }

  const boxTotal = box.reduce((s, d) => s + recipePrice(d.recipe), 0);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
      {/* Preview */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-tp-pink p-6 sm:p-10">
        <div className="tp-dots absolute inset-0 opacity-60" aria-hidden />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-tp-rose-deep">
              Tu creación
            </p>
            <p className="font-display text-2xl font-bold text-tp-cocoa sm:text-3xl">{name}</p>
          </div>
          <div className="rotate-6 rounded-2xl bg-white px-4 py-2 text-center shadow-[0_6px_0_#e7a2ae]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-tp-cocoa/60">Precio</p>
            <p className="font-display text-xl font-bold text-tp-rose-deep">{formatPrice(price)}</p>
          </div>
        </div>

        <div className="relative mx-auto my-4 aspect-square w-full max-w-[380px]">
          <div key={bump} className="tp-pop h-full w-full">
            <Donut recipe={recipe} uid="builder" className="tp-spin-slow h-full w-full" title={name} />
          </div>
        </div>

        <div className="relative flex flex-wrap justify-center gap-2">
          {recipe.toppings.length === 0 ? (
            <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-tp-cocoa/70">
              Sin toppings… ¿seguro? 👀
            </span>
          ) : (
            recipe.toppings.map((id) => {
              const t = TOPPINGS.find((x) => x.id === id)!;
              return (
                <span key={id} className="rounded-full bg-white px-3 py-1 text-xs font-bold text-tp-cocoa">
                  {t.emoji} {t.name}
                </span>
              );
            })
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col">
        <ol className="grid grid-cols-4 gap-2" aria-label="Pasos">
          {STEPS.map((s) => (
            <li key={s.n}>
              <button
                type="button"
                onClick={() => setStep(s.n)}
                aria-current={step === s.n ? "step" : undefined}
                className={`flex w-full flex-col items-center gap-1 rounded-2xl border-2 px-1 py-2.5 transition-all ${
                  step === s.n
                    ? `${s.color} border-tp-cocoa text-tp-cocoa shadow-[0_5px_0_#5a3a2e]`
                    : "border-tp-line bg-white text-tp-cocoa/60 hover:border-tp-cocoa/40"
                }`}
              >
                <span className="font-display text-lg font-bold leading-none">{s.n}</span>
                <span className="text-[11px] font-bold sm:text-xs">{s.label}</span>
              </button>
            </li>
          ))}
        </ol>

        <div className="mt-6 flex-1">
          {step === 1 && (
            <section>
              <h3 className="font-display text-2xl font-bold text-tp-cocoa">Elige tu base</h3>
              <p className="mt-1 text-sm text-tp-cocoa/70">Masa esponjosa, hecha cada mañana.</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {BASES.map((o) => (
                  <Swatch key={o.id} option={o} selected={recipe.base === o.id} onClick={() => update({ base: o.id })} />
                ))}
              </div>
            </section>
          )}

          {step === 2 && (
            <section>
              <h3 className="font-display text-2xl font-bold text-tp-cocoa">Elige tu glaseado</h3>
              <p className="mt-1 text-sm text-tp-cocoa/70">Bañada a mano, frente a ti.</p>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {GLAZES.map((o) => (
                  <Swatch key={o.id} option={o} selected={recipe.glaze === o.id} onClick={() => update({ glaze: o.id })} />
                ))}
              </div>
              <h4 className="mt-6 font-display text-lg font-bold text-tp-cocoa">¿Hilos por encima?</h4>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {DRIZZLES.map((o) => (
                  <Swatch
                    key={o.id}
                    option={o}
                    selected={recipe.drizzle === o.id}
                    onClick={() => update({ drizzle: o.id })}
                  />
                ))}
              </div>
            </section>
          )}

          {step === 3 && (
            <section>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h3 className="font-display text-2xl font-bold text-tp-cocoa">Elige tus toppings</h3>
                  <p className="mt-1 text-sm text-tp-cocoa/70">Hasta {MAX_TOPPINGS}. Sin juzgar.</p>
                </div>
                <span className="rounded-full bg-tp-mint px-3 py-1 font-display text-sm font-bold text-tp-cocoa">
                  {recipe.toppings.length}/{MAX_TOPPINGS}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {TOPPINGS.map((t) => {
                  const on = recipe.toppings.includes(t.id);
                  const full = !on && recipe.toppings.length >= MAX_TOPPINGS;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => toggleTopping(t.id)}
                      aria-pressed={on}
                      disabled={full}
                      className={`flex items-center gap-3 rounded-2xl border-2 px-3 py-2.5 text-left transition-all enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 ${
                        on ? "border-tp-rose bg-tp-pink/60 shadow-[0_6px_0_#e7a2ae]" : "border-tp-line bg-white"
                      }`}
                    >
                      <span className="text-2xl" aria-hidden>
                        {t.emoji}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-bold text-tp-cocoa">{t.name}</span>
                        <span className="block text-xs text-tp-cocoa/60">+{formatPrice(t.price)}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {step === 4 && (
            <section>
              <h3 className="font-display text-2xl font-bold text-tp-cocoa">¡Tu dona está lista! 🎉</h3>
              <p className="mt-1 text-sm text-tp-cocoa/70">Ponle nombre, agrégala a tu caja o pídela ya.</p>
              <label className="mt-4 block">
                <span className="text-xs font-bold uppercase tracking-widest text-tp-cocoa/60">Nombre de tu dona</span>
                <input
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value.slice(0, 28))}
                  placeholder={recipeName(recipe)}
                  className="mt-2 w-full rounded-2xl border-2 border-tp-line bg-white px-4 py-3 font-display text-lg font-semibold text-tp-cocoa outline-none placeholder:text-tp-cocoa/35 focus:border-tp-rose"
                />
              </label>

              <div className="mt-5 rounded-3xl border-2 border-dashed border-tp-rose/50 bg-white p-4">
                <div className="flex items-center justify-between">
                  <p className="font-display font-bold text-tp-cocoa">
                    Tu caja <span className="text-tp-cocoa/50">({box.length}/{BOX_SIZE})</span>
                  </p>
                  {box.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setBox([])}
                      className="text-xs font-bold text-tp-rose-deep underline-offset-2 hover:underline"
                    >
                      Vaciar
                    </button>
                  )}
                </div>
                <div className="mt-3 grid grid-cols-6 gap-2">
                  {Array.from({ length: BOX_SIZE }, (_, i) => {
                    const d = box[i];
                    return (
                      <div
                        key={i}
                        className="aspect-square rounded-xl bg-tp-cream"
                        title={d?.name}
                      >
                        {d && <Donut recipe={d.recipe} uid={`box-${i}`} className="tp-pop h-full w-full" title={d.name} />}
                      </div>
                    );
                  })}
                </div>
                {box.length > 0 && (
                  <p className="mt-3 text-right text-sm font-bold text-tp-cocoa">Total: {formatPrice(boxTotal)}</p>
                )}
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={addToBox}
                  disabled={box.length >= BOX_SIZE}
                  className="tp-btn flex-1 bg-white text-tp-cocoa disabled:opacity-50"
                >
                  + Agregar a la caja
                </button>
                <button type="button" onClick={order} className="tp-btn flex-1 bg-tp-rose-deep text-white">
                  {box.length ? "Pedir mi caja" : "Pedir esta dona"}
                </button>
              </div>
              {sent && (
                <p role="status" className="tp-pop mt-4 rounded-2xl bg-tp-mint px-4 py-3 text-sm font-semibold text-tp-cocoa">
                  ¡Pedido listo! Muestra tu creación en caja y la preparamos al momento. 🍩
                </p>
              )}
            </section>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              setRecipe(randomRecipe());
              setBump((b) => b + 1);
              setSent(false);
            }}
            className="tp-btn bg-tp-butter text-tp-cocoa"
          >
            🎲 Sorpréndeme
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
              className="tp-btn bg-white px-4 text-tp-cocoa disabled:opacity-40"
              aria-label="Paso anterior"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(4, s + 1))}
              disabled={step === 4}
              className="tp-btn bg-tp-cocoa text-white disabled:opacity-40"
            >
              Siguiente →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
