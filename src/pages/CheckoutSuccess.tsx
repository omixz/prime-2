import { useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { useCart } from "../context/CartContext";

export function CheckoutSuccess() {
  const { clear } = useCart();

  useEffect(() => {
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-xl px-5 py-24 text-center">
      <CheckCircle2 size={56} className="mx-auto text-flame" />
      <h1 className="mt-6 font-display text-4xl font-black uppercase">Order placed!</h1>
      <p className="mt-3 text-charcoal/70">
        Thanks for your order. We'll have it ready for pickup at 585 Hume Highway, Yagoona — check your email for
        the receipt and pickup details from Square.
      </p>
      <Link
        to="/menu"
        className="mt-8 inline-flex rounded-full bg-flame px-6 py-3 font-display font-bold uppercase text-cream shadow-soft hover:scale-105 transition-transform"
      >
        Order Again
      </Link>
    </div>
  );
}
