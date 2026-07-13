import { useState } from "react";
import { X, Minus, Plus, Trash2, Loader2, ChevronDown, ChevronUp, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatPrice, checkoutExtraGroups } from "../data/menu";

export function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { lines, updateQuantity, removeItem, addItem, totalCents } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extrasOpen, setExtrasOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState(0);

  const handleCheckout = async () => {
    setError(null);
    setLoading(true);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20_000);
    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          items: lines.map((l) => ({
            id: l.itemId,
            comboSize: l.comboSize,
            drinkId: l.drinkId,
            quantity: l.quantity,
          })),
        }),
      });

      const isJson = res.headers.get("content-type")?.includes("application/json");
      const data = isJson ? await res.json() : null;

      if (!res.ok) {
        setError(
          data?.error ??
            `Checkout failed (${res.status}). The server didn't return a valid response — this usually means the /api function crashed or isn't deployed. Please try again or contact the shop directly.`
        );
        setLoading(false);
        return;
      }

      if (!data?.url) {
        setError("Checkout started but no payment link came back. Please try again shortly.");
        setLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setError("Checkout is taking too long to respond. Please try again in a moment.");
      } else {
        setError("Couldn't reach the checkout server. Check your connection and try again.");
      }
      setLoading(false);
    } finally {
      window.clearTimeout(timeout);
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`fixed right-0 top-0 z-[70] h-full w-full max-w-md transform bg-cream shadow-glow transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-charcoal/10 px-6 py-5">
            <h2 className="font-display text-2xl font-black uppercase">Your Cart</h2>
            <button onClick={onClose} className="rounded-full p-2 hover:bg-charcoal/5" aria-label="Close cart">
              <X size={22} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            {lines.length === 0 ? (
              <div className="mt-12 flex flex-col items-center text-center text-charcoal/60">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-charcoal/5">
                  <ShoppingBag size={28} className="text-charcoal/30" />
                </div>
                <p className="mt-4 font-display text-lg font-bold uppercase">Your cart is empty</p>
                <p className="mt-1 text-sm">Add something from the menu.</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {lines.map((line) => (
                  <li key={line.id} className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-charcoal/5">
                    <div className="min-w-0 flex-1">
                      <p className="font-display font-bold leading-snug">{line.name}</p>
                      <p className="mt-0.5 text-sm text-charcoal/60">{formatPrice(line.priceCents)} each</p>
                      <div className="mt-2.5 flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(line.id, line.quantity - 1)}
                          className="grid h-7 w-7 place-items-center rounded-full bg-charcoal/5 transition-colors hover:bg-flame hover:text-cream"
                          aria-label={`Decrease quantity of ${line.name}`}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-6 text-center text-sm font-bold">{line.quantity}</span>
                        <button
                          onClick={() => updateQuantity(line.id, line.quantity + 1)}
                          className="grid h-7 w-7 place-items-center rounded-full bg-charcoal/5 transition-colors hover:bg-flame hover:text-cream"
                          aria-label={`Increase quantity of ${line.name}`}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="font-display font-black text-flame">
                        {formatPrice(line.priceCents * line.quantity)}
                      </span>
                      <button
                        onClick={() => removeItem(line.id)}
                        className="rounded-full p-1 text-charcoal/40 transition-colors hover:bg-flame/10 hover:text-flame"
                        aria-label={`Remove ${line.name} from cart`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {lines.length > 0 && (
            <div className="border-t border-charcoal/10 px-6 py-5">
              <div className="mb-4 overflow-hidden rounded-2xl bg-charcoal/5">
                <button
                  onClick={() => setExtrasOpen((v) => !v)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left font-display text-sm font-bold uppercase text-charcoal"
                >
                  Want to add extras?
                  {extrasOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {extrasOpen && (
                  <div className="px-4 pb-4">
                    <div className="flex flex-wrap gap-1.5 border-b border-charcoal/10 pb-3">
                      {checkoutExtraGroups.map((group, i) => (
                        <button
                          key={group.title}
                          onClick={() => setActiveGroup(i)}
                          className={`rounded-full px-3 py-1 text-xs font-display font-bold uppercase transition-colors ${
                            activeGroup === i ? "bg-flame text-cream" : "bg-white text-charcoal/70 hover:bg-charcoal/10"
                          }`}
                        >
                          {group.title}
                        </button>
                      ))}
                    </div>
                    <ul className="mt-3 max-h-52 space-y-1 overflow-y-auto">
                      {checkoutExtraGroups[activeGroup].items.map((extra) => (
                        <li key={extra.id} className="flex items-center justify-between gap-3 text-sm">
                          <span>{extra.name}</span>
                          <button
                            onClick={() => addItem(extra)}
                            className="flex shrink-0 items-center gap-1 rounded-full bg-white px-3 py-1 font-display font-bold uppercase text-charcoal shadow-sm transition-colors hover:bg-flame hover:text-cream"
                          >
                            <Plus size={12} /> {formatPrice(extra.priceCents)}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between text-lg">
                <span className="font-semibold">Total</span>
                <span className="font-display text-2xl font-black text-flame">{formatPrice(totalCents)}</span>
              </div>
              {error && (
                <p role="alert" className="mt-3 rounded-xl bg-flame/10 px-4 py-2 text-sm text-flame">
                  {error}
                </p>
              )}
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-flame px-6 py-3 font-display font-bold uppercase text-cream shadow-soft transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : null}
                {loading ? "Starting checkout…" : "Checkout with Square"}
              </button>
              <p className="mt-2 text-center text-xs text-charcoal/50">Pickup orders only — pay securely on Square's checkout page.</p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
