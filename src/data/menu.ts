export type MenuItem = {
  id: string;
  name: string;
  desc: string;
  priceCents: number;
};

export type MenuSection = {
  title: string;
  blurb: string;
  items: MenuItem[];
};

export const menuSections: MenuSection[] = [
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

export const allItems: MenuItem[] = menuSections.flatMap((s) => s.items);

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
