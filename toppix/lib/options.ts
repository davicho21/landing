export type Option = {
  id: string;
  name: string;
  color: string;
  price: number;
};

export type ToppingKind =
  | "chispas"
  | "chocochips"
  | "fresas"
  | "galleta"
  | "coco"
  | "pistacho"
  | "malvaviscos"
  | "corazones";

export type Topping = Option & { id: ToppingKind; emoji: string };

export const BASES: Option[] = [
  { id: "clasica", name: "Clásica", color: "#E7B47E", price: 5000 },
  { id: "chocolate", name: "Chocolate", color: "#7A4A36", price: 5500 },
  { id: "red-velvet", name: "Red velvet", color: "#B4505F", price: 6000 },
  { id: "matcha", name: "Matcha", color: "#A8C38B", price: 6000 },
];

export const GLAZES: Option[] = [
  { id: "fresa", name: "Fresa", color: "#F4A9BA", price: 1500 },
  { id: "vainilla", name: "Vainilla", color: "#FFF2DC", price: 1500 },
  { id: "chocolate", name: "Chocolate", color: "#6B3E2E", price: 1500 },
  { id: "menta", name: "Menta", color: "#BDE7D4", price: 1500 },
  { id: "lavanda", name: "Lavanda", color: "#D7C7F3", price: 2000 },
  { id: "maracuya", name: "Maracuyá", color: "#FBE08A", price: 2000 },
  { id: "ninguno", name: "Sin glaseado", color: "transparent", price: 0 },
];

export const DRIZZLES: Option[] = [
  { id: "ninguno", name: "Sin hilos", color: "transparent", price: 0 },
  { id: "chocolate", name: "Chocolate", color: "#4B2A20", price: 800 },
  { id: "caramelo", name: "Caramelo", color: "#D9954B", price: 800 },
  { id: "blanco", name: "Choco blanco", color: "#FFFBF5", price: 800 },
  { id: "fresa", name: "Fresa", color: "#E0707F", price: 800 },
];

export const TOPPINGS: Topping[] = [
  { id: "chispas", name: "Chispas de colores", color: "#F7A1C4", price: 700, emoji: "🌈" },
  { id: "chocochips", name: "Chocochips", color: "#4B2A20", price: 700, emoji: "🍫" },
  { id: "fresas", name: "Fresas", color: "#E2566B", price: 1200, emoji: "🍓" },
  { id: "galleta", name: "Galleta triturada", color: "#C98E57", price: 900, emoji: "🍪" },
  { id: "coco", name: "Coco rallado", color: "#FFFFFF", price: 700, emoji: "🥥" },
  { id: "pistacho", name: "Pistacho", color: "#9CC27A", price: 1200, emoji: "🌰" },
  { id: "malvaviscos", name: "Mini malvaviscos", color: "#FBD3E0", price: 900, emoji: "☁️" },
  { id: "corazones", name: "Corazones de azúcar", color: "#E86A86", price: 900, emoji: "💗" },
];

export const MAX_TOPPINGS = 3;

export type DonutRecipe = {
  base: string;
  glaze: string;
  drizzle: string;
  toppings: ToppingKind[];
};

export function findOption(list: Option[], id: string): Option {
  return list.find((o) => o.id === id) ?? list[0];
}

export function recipePrice(recipe: DonutRecipe): number {
  return (
    findOption(BASES, recipe.base).price +
    findOption(GLAZES, recipe.glaze).price +
    findOption(DRIZZLES, recipe.drizzle).price +
    recipe.toppings.reduce(
      (sum, id) => sum + (TOPPINGS.find((t) => t.id === id)?.price ?? 0),
      0,
    )
  );
}

function choose(n: number, k: number): number {
  let r = 1;
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
  return r;
}

/** Every distinct donut the builder can produce. */
export function totalCombinations(): number {
  let toppingSets = 0;
  for (let k = 0; k <= MAX_TOPPINGS; k++) toppingSets += choose(TOPPINGS.length, k);
  return BASES.length * GLAZES.length * DRIZZLES.length * toppingSets;
}

export function formatPrice(value: number): string {
  return `$${value.toLocaleString("es-CO")}`;
}

const NAME_START: Record<string, string> = {
  fresa: "Rosa",
  vainilla: "Nube",
  chocolate: "Cacao",
  menta: "Brisa",
  lavanda: "Lila",
  maracuya: "Sol",
  ninguno: "Pura",
};

const NAME_END: Record<ToppingKind | "none", string> = {
  chispas: "Fiestera",
  chocochips: "Crocante",
  fresas: "Enamorada",
  galleta: "Crujiente",
  coco: "Tropical",
  pistacho: "Gourmet",
  malvaviscos: "Esponjosa",
  corazones: "Romántica",
  none: "Clásica",
};

export function recipeName(recipe: DonutRecipe): string {
  const start = NAME_START[recipe.glaze] ?? "Dona";
  const end = NAME_END[recipe.toppings[0] ?? "none"];
  return `La ${start} ${end}`;
}

export const FAVORITES: { recipe: DonutRecipe; name: string; blurb: string; tag: string; bg: string }[] = [
  {
    name: "Pink Toppix",
    blurb: "Glaseado de fresa, chispas de colores y corazones. La insignia de la casa.",
    tag: "La más pedida",
    bg: "#FCE1E7",
    recipe: { base: "clasica", glaze: "fresa", drizzle: "blanco", toppings: ["chispas", "corazones"] },
  },
  {
    name: "Choco Loca",
    blurb: "Doble chocolate con hilos de caramelo y galleta triturada.",
    tag: "Para golosos",
    bg: "#F6E4D6",
    recipe: { base: "chocolate", glaze: "chocolate", drizzle: "caramelo", toppings: ["galleta", "chocochips"] },
  },
  {
    name: "Menta Fresh",
    blurb: "Glaseado de menta, choco blanco y chocochips. Frescura total.",
    tag: "Nueva",
    bg: "#DDF3E8",
    recipe: { base: "clasica", glaze: "menta", drizzle: "blanco", toppings: ["chocochips"] },
  },
  {
    name: "Lila Dream",
    blurb: "Red velvet con glaseado de lavanda y mini malvaviscos.",
    tag: "Edición pastel",
    bg: "#EAE2FA",
    recipe: { base: "red-velvet", glaze: "lavanda", drizzle: "fresa", toppings: ["malvaviscos", "coco"] },
  },
];
