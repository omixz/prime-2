import { useState } from "react";
import { Check, Gift, Plus } from "lucide-react";
import { giftCardItems, formatPrice, type MenuItem } from "../data/menu";
import { useCart } from "../context/CartContext";

export function GiftCards() {
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
        <p className="text-sm font-display font-bold uppercase tracking-widest text-flame">Treat Someone</p>
        <h1 className="mt-2 font-display text-5xl font-black uppercase md:text-6xl">Gift Cards</h1>
        <p className="mx-auto mt-4 max-w-2xl text-charcoal/70">
          Buy a digital gift card online and pay securely with Square. Show your confirmation email in-store
          to redeem — perfect for birthdays, thank-yous, or just spreading the halal burger love.
        </p>
      </header>

      <div className="mt-16 grid gap-5 md:grid-cols-3">
        {giftCardItems.map((item) => (
          <div
            key={item.id}
            className="group flex flex-col items-center gap-4 rounded-2xl bg-white p-8 text-center shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-glow"
          >
            <span className="grid h-14 w-14 place-items-center rounded-full bg-flame/10 text-flame">
              <Gift size={26} />
            </span>
            <h3 className="font-display text-2xl font-black text-charcoal">{formatPrice(item.priceCents)}</h3>
            <p className="text-sm text-charcoal/60">{item.desc}</p>
            <button
              onClick={() => handleAdd(item)}
              className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-charcoal/5 px-5 py-2 text-sm font-display font-bold uppercase text-charcoal transition-colors hover:bg-flame hover:text-cream"
            >
              {justAdded === item.id ? <Check size={15} /> : <Plus size={15} />}
              {justAdded === item.id ? "Added" : "Add to cart"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
