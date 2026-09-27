import { Donut } from "@/components/donut";
import { DonutBuilder } from "@/components/donut-builder";
import { Drip, Sparkle, ToppixLogo } from "@/components/brand";
import { FAVORITES, formatPrice, recipePrice, totalCombinations, type DonutRecipe } from "@/lib/options";
import { ADDRESS, HOURS, INSTAGRAM_HANDLE } from "@/lib/contact";

const COMBOS = Math.floor(totalCombinations() / 1000) * 1000;

const HERO_DONUT: DonutRecipe = {
  base: "clasica",
  glaze: "fresa",
  drizzle: "blanco",
  toppings: ["chispas", "corazones"],
};

const FLOATERS: { recipe: DonutRecipe; className: string; r: string; delay: string }[] = [
  {
    recipe: { base: "chocolate", glaze: "menta", drizzle: "chocolate", toppings: ["chocochips"] },
    className: "left-[-6%] top-[4%] w-24 sm:w-32",
    r: "-12deg",
    delay: "0s",
  },
  {
    recipe: { base: "clasica", glaze: "maracuya", drizzle: "ninguno", toppings: ["coco"] },
    className: "right-[-4%] top-[-2%] w-20 sm:w-28",
    r: "14deg",
    delay: "-2s",
  },
  {
    recipe: { base: "red-velvet", glaze: "lavanda", drizzle: "blanco", toppings: ["malvaviscos"] },
    className: "bottom-[2%] right-[-2%] w-24 sm:w-32",
    r: "8deg",
    delay: "-4s",
  },
];

const STEPS = [
  { n: 1, title: "Elige tu base", text: "Clásica, chocolate, red velvet o matcha. Recién hecha.", bg: "bg-tp-butter", emoji: "🍩" },
  { n: 2, title: "Elige tu glaseado", text: "Fresa, vainilla, menta, lavanda… y hilos por encima.", bg: "bg-tp-pink", emoji: "🎨" },
  { n: 3, title: "Elige tus toppings", text: "Hasta 3 de nuestra barra: chispas, fresas, galleta y más.", bg: "bg-tp-mint", emoji: "✨" },
  { n: 4, title: "¡Disfruta!", text: "La armamos frente a ti. Foto obligatoria antes del primer mordisco.", bg: "bg-tp-lilac", emoji: "📸" },
];

const MARQUEE = [
  "Glaseado de fresa",
  "Chispas de colores",
  "Hilos de caramelo",
  "Mini malvaviscos",
  "Red velvet",
  "Menta fresh",
  "Galleta triturada",
  "Corazones de azúcar",
];

const PLACE = [
  { title: "Barra de toppings a la vista", text: "Una pared entera de frascos para que elijas con los ojos.", emoji: "🫙", bg: "bg-tp-pink" },
  { title: "Sofás rosados", text: "Para quedarte, conversar y pedir la segunda (sabemos que habrá segunda).", emoji: "🛋️", bg: "bg-tp-butter" },
  { title: "Madera y plantas", text: "Mesas cálidas, luz suave y mucho verde. El spot perfecto para tus fotos.", emoji: "🌿", bg: "bg-tp-mint" },
  { title: "Café para acompañar", text: "Espresso, lattes y bebidas frías que combinan con cualquier dona.", emoji: "☕", bg: "bg-tp-sky" },
];

const REVIEWS = [
  { name: "Vale M.", text: "Hice una dona de lavanda con malvaviscos y fue amor. El lugar es TAN bonito.", bg: "bg-tp-lilac", r: "-2deg" },
  { name: "Juan P.", text: "La Choco Loca es otro nivel. Volví al día siguiente con mis amigos.", bg: "bg-tp-butter", r: "1.5deg" },
  { name: "Caro R.", text: "Armar tu propia dona es lo más divertido. Mi sobrina no quería irse.", bg: "bg-tp-mint", r: "-1deg" },
];

export default function ToppixPage() {
  return (
    <main className="overflow-x-clip">
      {/* NAV */}
      <header className="sticky top-0 z-40 border-b border-tp-line/70 bg-tp-cream/85 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <a href="#inicio" aria-label="Toppix Donas, inicio" className="text-[1.1rem]">
            <ToppixLogo />
          </a>
          <ul className="hidden items-center gap-7 font-display text-[15px] font-medium md:flex">
            <li><a className="hover:text-tp-rose-deep" href="#como-funciona">Cómo funciona</a></li>
            <li><a className="hover:text-tp-rose-deep" href="#crea">Crea tu dona</a></li>
            <li><a className="hover:text-tp-rose-deep" href="#favoritas">Favoritas</a></li>
            <li><a className="hover:text-tp-rose-deep" href="#visitanos">Visítanos</a></li>
          </ul>
          <a href="#crea" className="tp-btn bg-tp-rose-deep px-4 py-2 text-sm text-white sm:px-5">
            Crear mi dona
          </a>
        </nav>
      </header>

      {/* HERO */}
      <section id="inicio" className="relative bg-tp-pink">
        <div className="tp-dots pointer-events-none absolute inset-0 opacity-50" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pb-6 pt-12 sm:px-6 md:grid-cols-[1.1fr_1fr] md:pt-20">
          <div>
            <span className="tp-wiggle inline-flex items-center gap-2 rounded-full border-2 border-tp-cocoa bg-white px-4 py-1.5 font-display text-sm font-semibold [--r:-2deg]">
              <span className="h-2 w-2 rounded-full bg-tp-rose-deep" /> Recién glaseadas, todos los días
            </span>
            <h1 className="mt-6 font-display text-5xl font-bold leading-[0.95] text-tp-cocoa sm:text-6xl lg:text-7xl">
              Tu dona,
              <br />
              <span className="relative inline-block text-tp-rose-deep">
                tus reglas.
                <svg viewBox="0 0 300 20" className="absolute -bottom-3 left-0 w-full" aria-hidden>
                  <path d="M4 14 C60 2 120 2 150 10 C190 20 250 6 296 8" stroke="#fff" strokeWidth="6" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="mt-7 max-w-md text-lg leading-relaxed text-tp-cocoa/80">
              En <strong>Toppix</strong> tú eliges la base, el glaseado y los toppings. Nosotros la armamos al momento,
              frente a ti. Simple, dulce y 100% tuya.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#crea" className="tp-btn bg-tp-rose-deep text-lg text-white">
                Crea tu dona 🍩
              </a>
              <a href="#favoritas" className="tp-btn bg-white text-lg text-tp-cocoa">
                Ver favoritas
              </a>
            </div>
            <dl className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
              <div>
                <dt className="text-xs font-bold uppercase tracking-widest text-tp-cocoa/60">Combinaciones</dt>
                <dd className="font-display text-3xl font-bold">+{COMBOS.toLocaleString("es-CO")}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-widest text-tp-cocoa/60">Toppings</dt>
                <dd className="font-display text-3xl font-bold">8+</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-widest text-tp-cocoa/60">Aburrimiento</dt>
                <dd className="font-display text-3xl font-bold">0%</dd>
              </div>
            </dl>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-[460px]">
            <div className="absolute inset-[6%] rounded-full bg-white/60" aria-hidden />
            <Donut recipe={HERO_DONUT} uid="hero" className="tp-spin-slow relative h-full w-full drop-shadow-xl" title="Dona Pink Toppix" />
            {FLOATERS.map((f, i) => (
              <div
                key={i}
                className={`tp-float absolute ${f.className}`}
                style={{ ["--r" as string]: f.r, animationDelay: f.delay }}
              >
                <Donut recipe={f.recipe} uid={`float-${i}`} className="h-full w-full drop-shadow-lg" />
              </div>
            ))}
            <div className="tp-wiggle absolute bottom-[10%] left-[-4%] rounded-2xl border-2 border-tp-cocoa bg-tp-butter px-4 py-2 font-display font-bold shadow-[0_5px_0_#5a3a2e] [--r:-8deg]">
              ¡Hecha a tu gusto!
            </div>
            <Sparkle className="absolute left-[8%] top-[18%] h-6 w-6" />
            <Sparkle className="absolute right-[12%] bottom-[28%] h-4 w-4" />
            <Sparkle className="absolute right-[30%] top-[2%] h-5 w-5" color="#c9607a" />
          </div>
        </div>
        <Drip color="var(--color-tp-pink)" className="absolute left-0 top-full" />
      </section>

      {/* MARQUEE */}
      <div className="relative z-10 mt-24 -rotate-2 border-y-2 border-tp-cocoa bg-tp-cocoa py-3 sm:mt-32">
        <div className="tp-marquee flex w-max gap-8 whitespace-nowrap font-display text-xl font-semibold text-tp-cream">
          {[...MARQUEE, ...MARQUEE].map((m, i) => (
            <span key={i} className="flex items-center gap-8">
              {m} <span className="text-tp-blush">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section id="como-funciona" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-display font-semibold uppercase tracking-[0.25em] text-tp-rose-deep">Crea tu dona</p>
          <h2 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Cuatro pasos. Cero reglas.</h2>
          <p className="mt-4 text-lg text-tp-cocoa/75">
            Igual que en nuestra barra: eliges, combinamos y te la entregamos brillando.
          </p>
        </div>
        <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li
              key={s.n}
              className={`${s.bg} relative rounded-[2rem] border-2 border-tp-cocoa p-6 shadow-[0_8px_0_#5a3a2e] transition-transform hover:-translate-y-1 hover:rotate-[-1deg]`}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-tp-cocoa bg-white font-display text-2xl font-bold">
                {s.n}
              </span>
              <span className="absolute right-5 top-5 text-4xl" aria-hidden>
                {s.emoji}
              </span>
              <h3 className="mt-5 font-display text-2xl font-bold">{s.title}</h3>
              <p className="mt-2 text-tp-cocoa/80">{s.text}</p>
              {i < STEPS.length - 1 && (
                <span className="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 font-display text-3xl lg:block" aria-hidden>
                  →
                </span>
              )}
            </li>
          ))}
        </ol>
      </section>

      {/* BUILDER */}
      <section id="crea" className="relative scroll-mt-16 bg-white">
        <Drip color="var(--color-tp-cream)" className="absolute left-0 top-0" />
        <div className="mx-auto max-w-6xl px-4 pb-24 pt-28 sm:px-6 sm:pt-36">
          <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="font-display font-semibold uppercase tracking-[0.25em] text-tp-rose-deep">Laboratorio Toppix</p>
              <h2 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
                Diseña tu dona <span className="text-tp-rose-deep">aquí mismo</span>
              </h2>
            </div>
            <p className="max-w-sm text-tp-cocoa/75">
              Juega, combina y guarda tu creación. Luego pídela en tienda o arma una caja para compartir.
            </p>
          </div>
          <DonutBuilder />
        </div>
      </section>

      {/* FAVORITES */}
      <section id="favoritas" className="relative scroll-mt-16 bg-tp-mint/60">
        <Drip color="#ffffff" className="absolute left-0 top-0" />
        <div className="mx-auto max-w-6xl px-4 pb-24 pt-28 sm:px-6 sm:pt-36">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-display font-semibold uppercase tracking-[0.25em] text-tp-rose-deep">¿Sin ideas?</p>
            <h2 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Las favoritas de la casa</h2>
            <p className="mt-4 text-lg text-tp-cocoa/75">Combinaciones que la gente pide una y otra vez.</p>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FAVORITES.map((f, i) => (
              <article
                key={f.name}
                className="group relative rounded-[2rem] border-2 border-tp-cocoa bg-white p-5 shadow-[0_8px_0_#5a3a2e] transition-transform hover:-translate-y-2"
              >
                <span className="absolute -top-3 left-5 rounded-full border-2 border-tp-cocoa bg-tp-butter px-3 py-0.5 font-display text-xs font-bold">
                  {f.tag}
                </span>
                <div className="rounded-[1.5rem] p-4" style={{ background: f.bg }}>
                  <Donut
                    recipe={f.recipe}
                    uid={`fav-${i}`}
                    className="mx-auto w-full max-w-[200px] transition-transform duration-500 group-hover:rotate-45 group-hover:scale-105"
                    title={f.name}
                  />
                </div>
                <div className="mt-4 flex items-baseline justify-between gap-2">
                  <h3 className="font-display text-xl font-bold">{f.name}</h3>
                  <span className="font-display font-bold text-tp-rose-deep">{formatPrice(recipePrice(f.recipe))}</span>
                </div>
                <p className="mt-1 text-sm text-tp-cocoa/75">{f.blurb}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* THE PLACE */}
      <section className="relative bg-tp-cream">
        <Drip color="color-mix(in srgb, var(--color-tp-mint) 60%, var(--color-tp-cream))" className="absolute left-0 top-0" />
        <div className="mx-auto grid max-w-6xl gap-12 px-4 pb-24 pt-28 sm:px-6 sm:pt-36 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <p className="font-display font-semibold uppercase tracking-[0.25em] text-tp-rose-deep">El lugar</p>
            <h2 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Un rincón rosa hecho para quedarse</h2>
            <p className="mt-5 text-lg leading-relaxed text-tp-cocoa/80">
              Paredes con glaseado que gotea, luz cálida, madera, plantas y una barra enorme de toppings. Toppix no es
              solo para comprar donas: es para venir con tus amigos, crear, probar y tomar la mejor foto de la semana.
            </p>
            <a
              href={`https://instagram.com/${INSTAGRAM_HANDLE}`}
              target="_blank"
              rel="noreferrer"
              className="tp-btn mt-8 bg-tp-lilac text-tp-cocoa"
            >
              Síguenos @{INSTAGRAM_HANDLE}
            </a>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {PLACE.map((p, i) => (
              <div
                key={p.title}
                className={`${p.bg} rounded-[2rem] border-2 border-tp-cocoa p-6 ${i % 2 ? "sm:translate-y-8" : ""}`}
              >
                <span className="text-4xl" aria-hidden>
                  {p.emoji}
                </span>
                <h3 className="mt-3 font-display text-xl font-bold">{p.title}</h3>
                <p className="mt-1.5 text-sm text-tp-cocoa/80">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <h2 className="text-center font-display text-4xl font-bold sm:text-5xl">
          Lo que dicen de <span className="text-tp-rose-deep">#MiToppix</span>
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <figure
              key={r.name}
              className={`${r.bg} rounded-[2rem] border-2 border-tp-cocoa p-6 shadow-[0_8px_0_#5a3a2e]`}
              style={{ transform: `rotate(${r.r})` }}
            >
              <p className="text-tp-rose-deep" aria-label="5 de 5 estrellas">★★★★★</p>
              <blockquote className="mt-3 font-display text-lg font-medium leading-snug">“{r.text}”</blockquote>
              <figcaption className="mt-4 text-sm font-bold text-tp-cocoa/70">— {r.name}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* VISIT */}
      <section id="visitanos" className="scroll-mt-16 px-4 pb-24 sm:px-6">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] border-2 border-tp-cocoa bg-tp-rose-deep px-6 py-14 text-white shadow-[0_10px_0_#5a3a2e] sm:px-12">
          <div className="tp-dots absolute inset-0 opacity-20" aria-hidden />
          <div className="relative grid gap-10 md:grid-cols-[1.3fr_1fr] md:items-center">
            <div>
              <h2 className="font-display text-4xl font-bold leading-tight sm:text-5xl">
                Ven a crear la tuya.
                <br />
                <span className="text-tp-butter">Te esperamos con el glaseado listo.</span>
              </h2>
              <p className="mt-5 text-lg text-white/85">📍 {ADDRESS}</p>
              <a href="#crea" className="tp-btn mt-8 bg-tp-butter text-tp-cocoa">
                Diseñar mi dona ahora
              </a>
            </div>
            <div className="rounded-[2rem] bg-white p-6 text-tp-cocoa">
              <h3 className="font-display text-xl font-bold">Horario</h3>
              <ul className="mt-3 divide-y divide-tp-line">
                {HOURS.map((h) => (
                  <li key={h.days} className="flex justify-between gap-4 py-2.5 text-sm">
                    <span className="font-semibold">{h.days}</span>
                    <span>{h.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <Donut
            recipe={{ base: "clasica", glaze: "vainilla", drizzle: "fresa", toppings: ["chispas"] }}
            uid="cta"
            className="tp-spin-slow pointer-events-none absolute -bottom-16 -right-16 hidden w-56 opacity-90 lg:block"
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t-2 border-tp-cocoa bg-tp-cocoa px-4 py-12 text-tp-cream sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
          <ToppixLogo light className="text-[1.2rem]" />
          <p className="text-center text-sm text-tp-cream/70">
            Hecho con glaseado y mucho amor · © {new Date().getFullYear()} Toppix Donas
          </p>
          <a
            href={`https://instagram.com/${INSTAGRAM_HANDLE}`}
            target="_blank"
            rel="noreferrer"
            className="font-display font-semibold hover:text-tp-blush"
          >
            @{INSTAGRAM_HANDLE}
          </a>
        </div>
      </footer>
    </main>
  );
}
