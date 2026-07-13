import { useState } from "react";
import { X } from "lucide-react";
import { smallDrinks, bottleDrinks, formatPrice, type MenuItem } from "../data/menu";
import { useCart, type ComboSize } from "../context/CartContext";

export function ComboModal({ item, onClose }: { item: MenuItem; onClose: () => void }) {
  const { addItem } = useCart();
  const [size, setSize] = useState<ComboSize>("single");
  const [drinkId, setDrinkId] = useState<string>("");

  const drinkOptions = size === "regular" ? smallDrinks : size === "large" ? bottleDrinks : [];
  const needsDrink = size !== "single";
  const upcharge = size === "regular" ? item.comboUpchargeCents ?? 0 : size === "large" ? item.largeComboUpchargeCents ?? 0 : 0;
  const canAdd = !needsDrink || drinkId !== "";

  const handleAdd = () => {
    const drink = drinkOptions.find((d) => d.id === drinkId);
    addItem(item, {
      comboSize: size,
      drink: drink ? { id: drink.id, name: drink.name } : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-3xl bg-cream p-6 shadow-glow"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Add ${item.name} to cart`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-black uppercase text-charcoal">{item.name}</h2>
            <p className="mt-1 text-sm text-charcoal/60">Make it a combo?</p>
          </div>
          <button onClick={onClose} className="rounded-full p-1.5 hover:bg-charcoal/10" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="mt-5 space-y-2">
          <button
            onClick={() => {
              setSize("single");
              setDrinkId("");
            }}
            className={`w-full rounded-2xl border px-4 py-3 text-left transition-colors ${
              size === "single" ? "border-flame bg-flame/10" : "border-charcoal/15 bg-white hover:bg-charcoal/5"
            }`}
          >
            <span className="font-display font-bold uppercase">Just the burger</span>
            <span className="float-right font-display font-bold text-charcoal/60">{formatPrice(item.priceCents)}</span>
          </button>

          {item.comboUpchargeCents ? (
            <button
              onClick={() => {
                setSize("regular");
                setDrinkId("");
              }}
              className={`w-full rounded-2xl border px-4 py-3 text-left transition-colors ${
                size === "regular" ? "border-flame bg-flame/10" : "border-charcoal/15 bg-white hover:bg-charcoal/5"
              }`}
            >
              <span className="font-display font-bold uppercase">Make it a combo</span>
              <span className="mt-0.5 block text-xs text-charcoal/50">Regular fries + a small drink</span>
              <span className="float-right -mt-6 font-display font-bold text-flame">
                +{formatPrice(item.comboUpchargeCents)}
              </span>
            </button>
          ) : null}

          {item.largeComboUpchargeCents ? (
            <button
              onClick={() => {
                setSize("large");
                setDrinkId("");
              }}
              className={`w-full rounded-2xl border px-4 py-3 text-left transition-colors ${
                size === "large" ? "border-flame bg-flame/10" : "border-charcoal/15 bg-white hover:bg-charcoal/5"
              }`}
            >
              <span className="font-display font-bold uppercase">Make it a large combo</span>
              <span className="mt-0.5 block text-xs text-charcoal/50">Large fries + a bottled drink</span>
              <span className="float-right -mt-6 font-display font-bold text-flame">
                +{formatPrice(item.largeComboUpchargeCents)}
              </span>
            </button>
          ) : null}
        </div>

        {needsDrink && (
          <div className="mt-5">
            <label htmlFor="drink-select" className="font-display text-sm font-bold uppercase text-charcoal">
              {size === "regular" ? "Pick a drink" : "Pick a bottle"}
            </label>
            <select
              id="drink-select"
              value={drinkId}
              onChange={(e) => setDrinkId(e.target.value)}
              className="mt-2 w-full rounded-xl border border-charcoal/15 bg-white px-4 py-2.5 text-sm"
            >
              <option value="" disabled>
                Choose one…
              </option>
              {drinkOptions.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <span className="font-display text-sm font-semibold uppercase text-charcoal/60">Total</span>
          <span className="font-display text-2xl font-black text-flame">{formatPrice(item.priceCents + upcharge)}</span>
        </div>

        <button
          onClick={handleAdd}
          disabled={!canAdd}
          className="mt-4 w-full rounded-full bg-flame px-6 py-3 font-display font-bold uppercase text-cream shadow-soft transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
