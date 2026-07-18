import { useState } from "react";
import { Plus, Check } from "lucide-react";
import { menuSections, formatPrice, type MenuItem } from "../data/menu";
import { useCart } from "../context/CartContext";

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function Menu() {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState<string | null>(null);

  const handleAdd = (item: MenuItem) => {
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
        {menuSections.map((s) => (
          <a
            key={s.title}
            href={`#${slug(s.title)}`}
            className="rounded-full border border-charcoal/15 bg-white px-4 py-2 text-sm font-display font-semibold uppercase text-charcoal shadow-sm transition-colors hover:bg-flame hover:text-cream hover:border-flame"
          >
            {s.title}
          </a>
        ))}
      </div>

      <div className="mt-16 space-y-20">
        {menuSections.map((section) => (
          <section key={section.title} id={slug(section.title)} className="scroll-mt-24">
            <div className="mb-8 border-b-2 border-dashed border-charcoal/15 pb-5">
              <h2 className="font-display text-3xl font-black uppercase text-flame md:text-4xl">{section.title}</h2>
              <p className="mt-2 text-charcoal/70">{section.blurb}</p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {section.items.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-start gap-4 rounded-2xl bg-white p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-glow"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-display text-lg font-bold text-charcoal">{item.name}</h3>
                      <span className="shrink-0 font-display text-lg font-black text-flame">{formatPrice(item.priceCents)}</span>
                    </div>
                    <p className="mt-1.5 text-sm text-charcoal/60">{item.desc}</p>
                    {item.badge && (
                      <div className="mt-2 inline-block rounded-full bg-flame/10 px-3 py-1 text-xs font-display font-bold uppercase text-flame">
                        {item.badge}
                      </div>
                    )}
                    <button
                      onClick={() => handleAdd(item)}
                      className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-charcoal/5 px-4 py-1.5 text-sm font-display font-bold uppercase text-charcoal transition-colors hover:bg-flame hover:text-cream"
                    >
                      {justAdded === item.id ? <Check size={15} /> : <Plus size={15} />}
                      {justAdded === item.id ? "Added" : "Add to cart"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
