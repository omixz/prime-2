import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { testItem, formatPrice } from "../data/menu";
import { useCart } from "../context/CartContext";

export function TestOrder() {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <div className="mx-auto max-w-lg px-5 py-24 text-center">
      <h1 className="font-display text-3xl font-black uppercase text-charcoal">POS Test Order</h1>
      <p className="mt-3 text-charcoal/70">
        Adds a real {formatPrice(testItem.priceCents)} item to your cart, priced at Square's minimum. Use it to run a
        genuine payment through checkout and confirm the ticket reaches the till — nothing here is shown on the real
        menu.
      </p>

      <button
        onClick={() => {
          addItem(testItem);
          setAdded(true);
        }}
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-flame px-6 py-3 font-display font-bold uppercase text-cream shadow-soft transition-transform hover:scale-105"
      >
        <ShoppingCart size={18} /> Add {formatPrice(testItem.priceCents)} Test Item
      </button>

      {added ? (
        <p className="mt-4 text-sm font-display font-bold uppercase text-charcoal/60">
          Added — open the cart icon in the top right and check out as normal.
        </p>
      ) : null}
    </div>
  );
}
