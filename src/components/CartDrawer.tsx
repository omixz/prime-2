import { useState } from "react";
import { X, Minus, Plus, Trash2, Loader2, Mail, Phone } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../data/menu";

export function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { lines, updateQuantity, removeItem, totalCents, email, setEmail, phone, setPhone } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.map((l) => ({ id: l.id, name: l.name, priceCents: l.priceCents, quantity: l.quantity })),
          email,
          phone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error ?? "Something went wrong starting checkout. Please try again.");
        setLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      setError("Couldn't reach checkout. Check your connection and try again.");
      setLoading(false);
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
              <div className="mt-12 text-center text-charcoal/60">
                <p className="font-display text-lg font-bold uppercase">Your cart is empty</p>
                <p className="mt-1 text-sm">Add something from the menu.</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {lines.map((line) => (
                  <li key={line.id} className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-soft">
                    <div className="min-w-0 flex-1">
                      <p className="font-display font-bold">{line.name}</p>
                      <p className="mt-0.5 text-sm text-charcoal/60">{formatPrice(line.priceCents)} each</p>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(line.id, line.quantity - 1)}
                          className="grid h-7 w-7 place-items-center rounded-full bg-charcoal/5 hover:bg-charcoal/10"
                          aria-label={`Decrease quantity of ${line.name}`}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-6 text-center text-sm font-bold">{line.quantity}</span>
                        <button
                          onClick={() => updateQuantity(line.id, line.quantity + 1)}
                          className="grid h-7 w-7 place-items-center rounded-full bg-charcoal/5 hover:bg-charcoal/10"
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
                        className="text-charcoal/40 hover:text-flame"
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
              <div className="mb-4 space-y-3">
                <div>
                  <label className="flex items-center gap-2 text-xs font-display font-bold uppercase text-charcoal/70">
                    <Mail size={14} /> Email (for receipts)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="mt-1.5 w-full rounded-lg border border-charcoal/15 bg-white px-3 py-2 text-sm placeholder-charcoal/40 focus:border-flame focus:outline-none focus:ring-1 focus:ring-flame"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs font-display font-bold uppercase text-charcoal/70">
                    <Phone size={14} /> Phone (pickup confirmation)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(02) XXXX XXXX"
                    className="mt-1.5 w-full rounded-lg border border-charcoal/15 bg-white px-3 py-2 text-sm placeholder-charcoal/40 focus:border-flame focus:outline-none focus:ring-1 focus:ring-flame"
                  />
                </div>
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
