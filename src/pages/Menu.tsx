import { useState } from "react";
import { Plus, Check, Beef, Drumstick, UtensilsCrossed, Sparkles, CupSoda, Wine, Flame, type LucideIcon } from "lucide-react";
import { menuSections, formatPrice, type MenuItem } from "../data/menu";
import { useCart } from "../context/CartContext";
import { ComboModal } from "../components/ComboModal";
import { getItemArt } from "../components/itemArt";

const POPULAR_IDS = new Set(["beef-juicy-prime", "beef-cheesy-prime", "chk-mushroom-prime", "fries-chicken-mushroom"]);

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const SECTION_ICONS: Record<string, LucideIcon> = {
  "Beef Burgers": Beef,
  "Chicken Burgers": Drumstick,
  "Loaded Fries": UtensilsCrossed,
  "Sides & Tenders": UtensilsCrossed,
  Extras: Sparkles,
  "Small Drinks": CupSoda,
  Bottles: Wine,
};

export function Menu() {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const [comboItem, setComboItem] = useState<MenuItem | null>(null);

  const handleAdd = (item: MenuItem) => {
    if (item.comboEligible) {
      setComboItem(item);
      return;
    }
    addItem(item);
    setJustAdded(item.id);
    window.setTimeout(() => setJustAdded((cur) => (cur === item.id ? null : cur)), 1200);
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
      <header className="text-center">
        <p className="text-sm font-display font-bold uppercase tracking-widest text-flame">Order Online</p>
        <h1 className="mt-2 font-display text-5xl font-black uppercase md:text-6xl">The Menu</h1>
        <p className="mx-auto mt-4 max-w-2xl text-charcoal/70">
          Add items to your cart and check out securely with Square. Pickup orders only — 100% halal.
        </p>
      </header>

      <div className="mt-12 flex flex-wrap justify-center gap-2">
        {menuSections.map((s) => {
          const Icon = SECTION_ICONS[s.title];
          return (
            <a
              key={s.title}
              href={`#${slug(s.title)}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-charcoal/15 bg-white px-4 py-2 text-sm font-display font-semibold uppercase text-charcoal shadow-sm transition-colors hover:bg-flame hover:text-cream hover:border-flame"
            >
              {Icon ? <Icon size={14} /> : null}
              {s.title}
            </a>
          );
        })}
      </div>

      <div className="mt-16 space-y-20">
        {menuSections.map((section) => {
          const Icon = SECTION_ICONS[section.title];
          return (
            <section key={section.title} id={slug(section.title)} className="scroll-mt-24">
              <div className="mb-8 flex items-center gap-4 border-b-2 border-dashed border-charcoal/15 pb-5">
                {Icon ? (
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-flame/10 text-flame">
                    <Icon size={22} />
                  </span>
                ) : null}
                <div>
                  <h2 className="font-display text-3xl font-black uppercase text-flame md:text-4xl">{section.title}</h2>
                  <p className="mt-1 text-charcoal/70">{section.blurb}</p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {section.items.map((item) => (
                  <div
                    key={item.id}
                    className="group relative flex items-start gap-4 rounded-2xl bg-white p-5 shadow-soft ring-1 ring-charcoal/5 transition-all hover:-translate-y-0.5 hover:shadow-glow"
                  >
                    {POPULAR_IDS.has(item.id) ? (
                      <span className="absolute -top-2.5 left-4 inline-flex items-center gap-1 rounded-full bg-flame px-2.5 py-1 text-[10px] font-display font-bold uppercase tracking-wide text-cream shadow-soft">
                        <Flame size={11} /> Bestseller
                      </span>
                    ) : null}
                    <div className="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-cream ring-1 ring-charcoal/5">
                      <div className="h-11 w-11">{getItemArt(section.title, item)}</div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <h3 className="font-display text-lg font-bold text-charcoal">{item.name}</h3>
                        <span className="shrink-0 font-display text-lg font-black text-flame">{formatPrice(item.priceCents)}</span>
                      </div>
                      {item.desc ? <p className="mt-1.5 text-sm text-charcoal/60">{item.desc}</p> : null}
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => handleAdd(item)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-charcoal/5 px-4 py-1.5 text-sm font-display font-bold uppercase text-charcoal transition-colors hover:bg-flame hover:text-cream"
                        >
                          {justAdded === item.id ? <Check size={15} /> : <Plus size={15} />}
                          {justAdded === item.id ? "Added" : "Add to cart"}
                        </button>
                        {item.comboEligible ? (
                          <span className="rounded-full bg-gold/25 px-3 py-1 text-xs font-display font-bold uppercase text-charcoal/70">
                            Combo available
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
      {comboItem && <ComboModal item={comboItem} onClose={() => setComboItem(null)} />}
    </div>
  );
}
