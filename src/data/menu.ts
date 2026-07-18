export type MenuItem = {
  id: string;
  name: string;
  desc: string;
  priceCents: number;
  badge?: string; // "NEW", "POPULAR", "SAVE $X"
};

export type ComboItem = MenuItem & {
  includesItems: string[];
};

export type MenuSection = {
  title: string;
  blurb: string;
  items: MenuItem[];
};

export const menuSections: MenuSection[] = [
  {
    title: "Combo Meals",
    blurb: "Burger, loaded fries, and a drink — great value.",
    items: [
      { id: "combo-beef-classic", name: "Classic Beef Combo", desc: "Classic Beef Burger + Fries + Soft Drink Can. Save $1.80.", priceCents: 2290, badge: "SAVE $1.80" },
      { id: "combo-beef-prime", name: "Juicy Prime Combo", desc: "Juicy Prime Burger + Cheesy Loaded Fries + Soft Drink Can. Save $2.50.", priceCents: 3130, badge: "SAVE $2.50" },
      { id: "combo-chk-mushroom", name: "Mushroom Prime Combo", desc: "Mushroom Prime Burger + Cheesy Loaded Fries + Soft Drink Can. Save $2.50.", priceCents: 3030, badge: "SAVE $2.50" },
      { id: "combo-chk-classic", name: "Classic Chicken Combo", desc: "Classic Chicken Burger + Fries + Soft Drink Can. Save $1.80.", priceCents: 2290, badge: "SAVE $1.80" },
    ],
  },
  {
    title: "Beef Burgers",
    blurb: "Smashed prime cut wagyu beef, 100% halal.",
    items: [
      { id: "beef-juicy-prime", name: "Juicy Prime Burger", desc: "Two smashed prime cut wagyu patties, cheese, lettuce, minced onion, pickles, American cheddar, in-house fusion sauce.", priceCents: 1890 },
      { id: "beef-cheesy-prime", name: "Cheesy Prime", desc: "Smashed wagyu patty, soft bun, extra cheddar, pickles — no fuss.", priceCents: 1590 },
      { id: "beef-double-cheese", name: "Double Cheese Beef", desc: "Beef burger loaded with a double serve of melted cheese.", priceCents: 1790 },
      { id: "beef-classic", name: "Classic Beef Burger", desc: "Smashed wagyu patty, lettuce, tomato, minced onion, pickles, cheddar, ketchup, mayo.", priceCents: 1490 },
      { id: "beef-mustard", name: "Mustard Prime", desc: "Smashed wagyu patty, minced onion, pickles, cheddar, ketchup, mustard.", priceCents: 1490 },
      { id: "beef-bbq-rasher", name: "Smokey BBQ Rasher", desc: "Smashed wagyu patty, minced onion, tomato, beetroot, beef rasher, cheddar, smokey BBQ sauce.", priceCents: 1790 },
    ],
  },
  {
    title: "Chicken Burgers",
    blurb: "Marinated fillets, always fresh.",
    items: [
      { id: "chk-mushroom-prime", name: "Mushroom Prime Burger", desc: "Two marinated chicken fillets, American cheddar, creamy mushroom sauce.", priceCents: 1790 },
      { id: "chk-classic", name: "Classic Chicken Burger", desc: "Marinated chicken fillet, lettuce, tomato, mayo, pickles.", priceCents: 1490 },
      { id: "chk-fusion", name: "Fusion Chicken", desc: "Two marinated fillets, cheese, lettuce, minced onion, pickles, in-house fusion sauce.", priceCents: 1790 },
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
      { id: "side-combo", name: "Combo Add-On", desc: "Add small chips and a can of drink to any burger.", priceCents: 690 },
    ],
  },
  {
    title: "Drinks",
    blurb: "Cold and ready to go.",
    items: [
      { id: "drink-can", name: "Soft Drink Can", desc: "Your choice of Coke, Sprite, Fanta.", priceCents: 400 },
      { id: "drink-water", name: "Bottled Water", desc: "Still water, 600ml.", priceCents: 350 },
    ],
  },
];

export const giftCardItems: MenuItem[] = [
  { id: "gift-card-25", name: "$25 Gift Card", desc: "Digital gift card, redeemable in-store for any order.", priceCents: 2500 },
  { id: "gift-card-50", name: "$50 Gift Card", desc: "Digital gift card, redeemable in-store for any order.", priceCents: 5000 },
  { id: "gift-card-100", name: "$100 Gift Card", desc: "Digital gift card, redeemable in-store for any order.", priceCents: 10000 },
];

export const merchItems: MenuItem[] = [
  { id: "merch-cap", name: "Prime Burger Co Cap", desc: "Official branded snapback cap.", priceCents: 1990, badge: "MERCH" },
  { id: "merch-sauce-bottle", name: "Signature Sauce (500ml)", desc: "Grab a bottle of our in-house fusion sauce.", priceCents: 890, badge: "MERCH" },
  { id: "merch-tshirt", name: "Prime Burger Co T-Shirt", desc: "Unisex cotton tee, classic logo print.", priceCents: 2490, badge: "MERCH" },
];

export const allItems: MenuItem[] = [...menuSections.flatMap((s) => s.items), ...giftCardItems, ...merchItems];

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
