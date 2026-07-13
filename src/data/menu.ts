export type MenuItem = {
  id: string;
  name: string;
  desc: string;
  priceCents: number;
  /** Burgers that can be upgraded to a combo (regular fries + small drink) or large combo (large fries + bottle drink). */
  comboEligible?: boolean;
  comboUpchargeCents?: number;
  largeComboUpchargeCents?: number;
};

export type MenuSection = {
  title: string;
  blurb: string;
  items: MenuItem[];
};

// Regular combo = small fries + a Small Drink. Large combo = large fries + a Bottle.
// Prices below are placeholders based on the previous "Combo Add-On" ($6.90) — adjust
// to match your current in-store combo pricing if it's different.
const COMBO_UPCHARGE_CENTS = 690;
const LARGE_COMBO_UPCHARGE_CENTS = 990;

export const menuSections: MenuSection[] = [
  {
    title: "Beef Burgers",
    blurb: "Smashed prime cut wagyu beef, 100% halal.",
    items: [
      { id: "beef-juicy-prime", name: "Juicy Prime Burger", desc: "Two smashed prime cut wagyu patties, cheese, lettuce, minced onion, pickles, American cheddar, in-house fusion sauce.", priceCents: 1890, comboEligible: true, comboUpchargeCents: COMBO_UPCHARGE_CENTS, largeComboUpchargeCents: LARGE_COMBO_UPCHARGE_CENTS },
      { id: "beef-cheesy-prime", name: "Cheesy Prime", desc: "Smashed wagyu patty, soft bun, extra cheddar, pickles — no fuss.", priceCents: 1590, comboEligible: true, comboUpchargeCents: COMBO_UPCHARGE_CENTS, largeComboUpchargeCents: LARGE_COMBO_UPCHARGE_CENTS },
      { id: "beef-double-cheese", name: "Double Cheese Beef", desc: "Beef burger loaded with a double serve of melted cheese.", priceCents: 1790, comboEligible: true, comboUpchargeCents: COMBO_UPCHARGE_CENTS, largeComboUpchargeCents: LARGE_COMBO_UPCHARGE_CENTS },
      { id: "beef-classic", name: "Classic Beef Burger", desc: "Smashed wagyu patty, lettuce, tomato, minced onion, pickles, cheddar, ketchup, mayo.", priceCents: 1490, comboEligible: true, comboUpchargeCents: COMBO_UPCHARGE_CENTS, largeComboUpchargeCents: LARGE_COMBO_UPCHARGE_CENTS },
      { id: "beef-mustard", name: "Mustard Prime", desc: "Smashed wagyu patty, minced onion, pickles, cheddar, ketchup, mustard.", priceCents: 1490, comboEligible: true, comboUpchargeCents: COMBO_UPCHARGE_CENTS, largeComboUpchargeCents: LARGE_COMBO_UPCHARGE_CENTS },
      { id: "beef-bbq-rasher", name: "Smokey BBQ Rasher", desc: "Smashed wagyu patty, minced onion, tomato, beetroot, beef rasher, cheddar, smokey BBQ sauce.", priceCents: 1790, comboEligible: true, comboUpchargeCents: COMBO_UPCHARGE_CENTS, largeComboUpchargeCents: LARGE_COMBO_UPCHARGE_CENTS },
    ],
  },
  {
    title: "Chicken Burgers",
    blurb: "Marinated fillets, always fresh.",
    items: [
      { id: "chk-mushroom-prime", name: "Mushroom Prime Burger", desc: "Two marinated chicken fillets, American cheddar, creamy mushroom sauce.", priceCents: 1790, comboEligible: true, comboUpchargeCents: COMBO_UPCHARGE_CENTS, largeComboUpchargeCents: LARGE_COMBO_UPCHARGE_CENTS },
      { id: "chk-classic", name: "Classic Chicken Burger", desc: "Marinated chicken fillet, lettuce, tomato, mayo, pickles.", priceCents: 1490, comboEligible: true, comboUpchargeCents: COMBO_UPCHARGE_CENTS, largeComboUpchargeCents: LARGE_COMBO_UPCHARGE_CENTS },
      { id: "chk-fusion", name: "Fusion Chicken", desc: "Two marinated fillets, cheese, lettuce, minced onion, pickles, in-house fusion sauce.", priceCents: 1790, comboEligible: true, comboUpchargeCents: COMBO_UPCHARGE_CENTS, largeComboUpchargeCents: LARGE_COMBO_UPCHARGE_CENTS },
    ],
  },
  {
    title: "Loaded Fries",
    blurb: "Big enough to share, if you want to.",
    items: [
      { id: "fries-cheesy", name: "Cheesy Loaded Fries", desc: "Crispy fries loaded with melted cheddar cheese sauce.", priceCents: 990 },
      { id: "fries-chicken-mushroom", name: "Chicken Mushroom Loaded Fries", desc: "Fries topped with chicken tenders and creamy mushroom sauce.", priceCents: 1290 },
      { id: "fries-plain", name: "Fries", desc: "Classic crispy fries, salted.", priceCents: 690 },
    ],
  },
  {
    title: "Sides & Tenders",
    blurb: "Perfect for sharing.",
    items: [
      { id: "side-tenders", name: "Chunky Tenders (5pc)", desc: "Hand-battered chunky chicken tenders.", priceCents: 1390 },
    ],
  },
  {
    title: "Extras",
    blurb: "Top up any order at checkout — extra fillings, sides, or a sauce for dipping.",
    items: [
      { id: "extra-patty", name: "Extra Patty", desc: "Add another smashed wagyu patty.", priceCents: 400 },
      { id: "extra-cheese", name: "Extra Cheese", desc: "Extra slice of American cheddar.", priceCents: 150 },
      { id: "extra-bacon", name: "Bacon Rasher", desc: "Add a beef rasher.", priceCents: 250 },
      { id: "extra-egg", name: "Fried Egg", desc: "Add a fried egg.", priceCents: 200 },
      { id: "extra-onion", name: "Extra Minced Onion", desc: "", priceCents: 100 },
      { id: "extra-pickles", name: "Extra Pickles", desc: "", priceCents: 100 },
      { id: "extra-beetroot", name: "Extra Beetroot", desc: "", priceCents: 100 },
      { id: "sauce-tomato", name: "Tomato Sauce (side)", desc: "", priceCents: 100 },
      { id: "sauce-bbq", name: "Smokey BBQ Sauce (side)", desc: "", priceCents: 100 },
      { id: "sauce-pickle-mac", name: "Pickle Mac Sauce (side)", desc: "", priceCents: 100 },
      { id: "sauce-fusion", name: "Fusion Sauce (side)", desc: "", priceCents: 100 },
      { id: "sauce-mayo", name: "Creamy Mayonnaise (side)", desc: "", priceCents: 100 },
      { id: "sauce-garlic", name: "Garlic Sauce (side)", desc: "", priceCents: 100 },
      { id: "sauce-gravy", name: "Gravy (side)", desc: "", priceCents: 100 },
    ],
  },
  {
    title: "Small Drinks",
    blurb: "Cans — included in a regular combo, or order on their own.",
    items: [
      { id: "drink-spring-water", name: "Spring Water", desc: "", priceCents: 400 },
      { id: "drink-coke", name: "Coke", desc: "", priceCents: 400 },
      { id: "drink-coke-zero", name: "Coke Zero", desc: "", priceCents: 400 },
      { id: "drink-cherry-coke", name: "Cherry Coke", desc: "", priceCents: 400 },
      { id: "drink-fanta-orange", name: "Fanta Orange", desc: "", priceCents: 400 },
      { id: "drink-fanta-peach", name: "Fanta Peach", desc: "", priceCents: 400 },
      { id: "drink-fanta-grape", name: "Fanta Grape", desc: "", priceCents: 400 },
      { id: "drink-fanta-berry", name: "Fanta Berry", desc: "", priceCents: 400 },
      { id: "drink-okf-blue-lemonade", name: "OKF Blue Lemonade", desc: "", priceCents: 400 },
      { id: "drink-okf-watermelon", name: "OKF Watermelon", desc: "", priceCents: 400 },
      { id: "drink-okf-mango", name: "OKF Mango", desc: "", priceCents: 400 },
      { id: "drink-okf-blueberry", name: "OKF Blueberry", desc: "", priceCents: 400 },
      { id: "drink-okf-pomegranate", name: "OKF Pomegranate", desc: "", priceCents: 400 },
      { id: "drink-solo", name: "Solo", desc: "", priceCents: 400 },
      { id: "drink-sprite", name: "Sprite", desc: "", priceCents: 400 },
    ],
  },
  {
    title: "Bottles",
    blurb: "Bottles — included in a large combo, or order on their own.",
    items: [
      { id: "bottle-jarritos-mexican-cola", name: "Jarritos Mexican Cola", desc: "", priceCents: 550 },
      { id: "bottle-jarritos-watermelon", name: "Jarritos Watermelon", desc: "", priceCents: 550 },
      { id: "bottle-jarritos-lemon-lime", name: "Jarritos Lemon Lime", desc: "", priceCents: 550 },
      { id: "bottle-jarritos-mandarin", name: "Jarritos Mandarin", desc: "", priceCents: 550 },
      { id: "bottle-joes-7-fruits", name: "Joes 7 Fruits", desc: "", priceCents: 550 },
      { id: "bottle-joes-banana-mango", name: "Joes Banana Mango", desc: "", priceCents: 550 },
      { id: "bottle-joes-apple-juice", name: "Joes Apple Juice", desc: "", priceCents: 550 },
      { id: "bottle-joes-orange-mango", name: "Joes Orange Mango", desc: "", priceCents: 550 },
      { id: "bottle-v-original-350ml", name: "V Original 350ml", desc: "", priceCents: 550 },
      { id: "bottle-v-strawberry-350ml", name: "V Strawberry 350ml", desc: "", priceCents: 550 },
      { id: "bottle-h2-watermelon", name: "H2Coco Watermelon", desc: "", priceCents: 550 },
      { id: "bottle-h2-mango", name: "H2Coco Mango", desc: "", priceCents: 550 },
    ],
  },
];

export const allItems: MenuItem[] = menuSections.flatMap((s) => s.items);

export const smallDrinks: MenuItem[] = menuSections.find((s) => s.title === "Small Drinks")!.items;
export const bottleDrinks: MenuItem[] = menuSections.find((s) => s.title === "Bottles")!.items;
export const extraItems: MenuItem[] = menuSections.find((s) => s.title === "Extras")!.items;

// Grouped quick-adds shown in the cart drawer's "Want to add extras?" panel —
// fries/tenders/sides alongside the topping & sauce extras, so people can top
// up an order at checkout without going back to the menu.
export type ExtraGroup = { title: string; items: MenuItem[] };

export const checkoutExtraGroups: ExtraGroup[] = [
  { title: "Fries & Sides", items: [...menuSections.find((s) => s.title === "Loaded Fries")!.items, ...menuSections.find((s) => s.title === "Sides & Tenders")!.items] },
  { title: "Extra Fillings", items: extraItems.filter((i) => !i.id.startsWith("sauce-")) },
  { title: "Sauces", items: extraItems.filter((i) => i.id.startsWith("sauce-")) },
  { title: "Drinks", items: [...smallDrinks, ...bottleDrinks] },
];

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
