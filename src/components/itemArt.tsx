import type { MenuItem } from "../data/menu";
import { BurgerArt, FriesArt, DrinkArt, TenderArt, SauceArt, ToppingArt } from "./FoodArt";

const BEEF_VARIANTS: Record<string, { drizzle?: string; extra?: "bacon" | "egg"; bunColor?: string }> = {
  "beef-bbq-rasher": { drizzle: "#7A3B12", extra: "bacon" },
  "beef-mustard": { drizzle: "#E8B923" },
  "beef-cheesy-prime": { bunColor: "#F6C568" },
  "beef-double-cheese": { bunColor: "#F6C568" },
};

const CHICKEN_VARIANTS: Record<string, { drizzle?: string }> = {
  "chk-mushroom-prime": { drizzle: "#D8C9A3" },
  "chk-fusion": { drizzle: "#D5451B" },
};

const FRIES_VARIANTS: Record<string, "cheese" | "mushroom"> = {
  "fries-cheesy": "cheese",
  "fries-chicken-mushroom": "mushroom",
};

const SAUCE_COLORS: Record<string, string> = {
  "sauce-tomato": "#D5451B",
  "sauce-bbq": "#5A2E1D",
  "sauce-pickle-mac": "#B7C93C",
  "sauce-fusion": "#E08B3A",
  "sauce-mayo": "#F6EFE4",
  "sauce-garlic": "#F2EAD8",
  "sauce-gravy": "#4A2E1D",
};

const TOPPING_TYPES: Record<string, "patty" | "cheese" | "bacon" | "egg" | "onion" | "pickle" | "beetroot"> = {
  "extra-patty": "patty",
  "extra-cheese": "cheese",
  "extra-bacon": "bacon",
  "extra-egg": "egg",
  "extra-onion": "onion",
  "extra-pickles": "pickle",
  "extra-beetroot": "beetroot",
};

// Flavour family → cup/cap colours, matched by keyword against the item id.
const DRINK_KEYWORD_COLORS: [string, { cup: string; cap: string }][] = [
  ["coke-zero", { cup: "#2A2A2A", cap: "#C7C7C7" }],
  ["cherry-coke", { cup: "#4A241C", cap: "#8A1F12" }],
  ["mexican-cola", { cup: "#3B2A20", cap: "#8A1F12" }],
  ["coke", { cup: "#3B2A20", cap: "#8A1F12" }],
  ["fanta-orange", { cup: "#F2A93B", cap: "#D5451B" }],
  ["fanta-peach", { cup: "#F5C6A0", cap: "#E08B3A" }],
  ["fanta-grape", { cup: "#6B4A9A", cap: "#4A2E7A" }],
  ["fanta-berry", { cup: "#8C2F5A", cap: "#5C1A3A" }],
  ["blue-lemonade", { cup: "#3E8FD0", cap: "#1E5C99" }],
  ["watermelon", { cup: "#E8607A", cap: "#3E9A4F" }],
  ["mango", { cup: "#F2B23C", cap: "#E08B1A" }],
  ["blueberry", { cup: "#4B4A8C", cap: "#2E2D5C" }],
  ["pomegranate", { cup: "#9C2B3E", cap: "#6B1626" }],
  ["solo", { cup: "#F2C23C", cap: "#2E7D32" }],
  ["sprite", { cup: "#4CAF50", cap: "#1B5E20" }],
  ["spring-water", { cup: "#BEE3F5", cap: "#3E8FD0" }],
  ["lemon-lime", { cup: "#B7D93C", cap: "#5C8A1A" }],
  ["mandarin", { cup: "#F2913C", cap: "#D5451B" }],
  ["7-fruits", { cup: "#C0392B", cap: "#7A1F17" }],
  ["banana-mango", { cup: "#F2C23C", cap: "#E08B1A" }],
  ["apple-juice", { cup: "#D8C93C", cap: "#8A7A1A" }],
  ["orange-mango", { cup: "#F2A93B", cap: "#D5451B" }],
  ["v-original", { cup: "#2E9E4F", cap: "#1B5E20" }],
  ["v-strawberry", { cup: "#D9436B", cap: "#8A1F3A" }],
];

function drinkColors(id: string) {
  const match = DRINK_KEYWORD_COLORS.find(([kw]) => id.includes(kw));
  return match ? match[1] : { cup: "#F2A93B", cap: "#D5451B" };
}

/** Small deterministic illustration for a menu item, used as a card thumbnail. */
export function getItemArt(sectionTitle: string, item: MenuItem) {
  if (sectionTitle === "Beef Burgers") {
    const v = BEEF_VARIANTS[item.id] ?? {};
    return <BurgerArt pattyColor="#5A2E1D" {...v} />;
  }
  if (sectionTitle === "Chicken Burgers") {
    const v = CHICKEN_VARIANTS[item.id] ?? {};
    return <BurgerArt pattyColor="#E3B23C" bunColor="#F2A93B" {...v} />;
  }
  if (sectionTitle === "Loaded Fries") {
    return <FriesArt topping={FRIES_VARIANTS[item.id]} />;
  }
  if (sectionTitle === "Sides & Tenders") {
    return <TenderArt />;
  }
  if (sectionTitle === "Extras") {
    if (item.id.startsWith("sauce-")) return <SauceArt color={SAUCE_COLORS[item.id]} />;
    const type = TOPPING_TYPES[item.id];
    return type ? <ToppingArt type={type} /> : <ToppingArt type="patty" />;
  }
  if (sectionTitle === "Small Drinks" || sectionTitle === "Bottles") {
    const { cup, cap } = drinkColors(item.id);
    return <DrinkArt cupColor={cup} capColor={cap} />;
  }
  return null;
}
