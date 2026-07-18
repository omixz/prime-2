import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";

export function Navbar({ onOpenCart }: { onOpenCart: () => void }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalCount } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-display font-semibold uppercase tracking-wide transition-colors hover:text-flame ${isActive ? "text-flame" : "text-cream"}`;

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all ${
        scrolled ? "bg-charcoal/95 backdrop-blur-md shadow-soft" : "bg-charcoal"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-flame text-cream font-display text-lg font-black shadow-soft transition-transform group-hover:scale-105">
            P
          </span>
          <span className="font-display text-lg font-black uppercase text-cream">Prime Burger Co</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/menu" className={linkClass}>Menu</NavLink>
          <NavLink to="/gift-cards" className={linkClass}>Gift Cards</NavLink>
          <NavLink to="/loyalty" className={linkClass}>Loyalty</NavLink>
          <NavLink to="/catering" className={linkClass}>Catering</NavLink>
          <NavLink to="/visit" className={linkClass}>Visit Us</NavLink>
          <button
            onClick={onOpenCart}
            className="relative inline-flex items-center gap-2 rounded-full bg-flame px-5 py-2 text-sm font-display font-bold uppercase text-cream shadow-soft transition-transform hover:scale-105"
            aria-label={`Open cart, ${totalCount} items`}
          >
            <ShoppingBag size={16} />
            Cart
            {totalCount > 0 && (
              <span className="absolute -top-2 -right-2 grid h-5 w-5 place-items-center rounded-full bg-gold text-[11px] font-black text-charcoal">
                {totalCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={onOpenCart}
            className="relative rounded-full p-2 text-cream hover:bg-white/5"
            aria-label={`Open cart, ${totalCount} items`}
          >
            <ShoppingBag size={22} />
            {totalCount > 0 && (
              <span className="absolute top-0 right-0 grid h-4 w-4 place-items-center rounded-full bg-gold text-[10px] font-black text-charcoal">
                {totalCount}
              </span>
            )}
          </button>
          <button
            className="rounded-full p-2 text-cream hover:bg-white/5"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden border-t border-white/10 bg-charcoal">
          <div className="flex flex-col gap-1 px-5 py-4">
            <NavLink to="/" end onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 font-display font-semibold uppercase text-cream hover:bg-white/5">Home</NavLink>
            <NavLink to="/menu" onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 font-display font-semibold uppercase text-cream hover:bg-white/5">Menu</NavLink>
            <NavLink to="/gift-cards" onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 font-display font-semibold uppercase text-cream hover:bg-white/5">Gift Cards</NavLink>
            <NavLink to="/loyalty" onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 font-display font-semibold uppercase text-cream hover:bg-white/5">Loyalty</NavLink>
            <NavLink to="/catering" onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 font-display font-semibold uppercase text-cream hover:bg-white/5">Catering</NavLink>
            <NavLink to="/visit" onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 font-display font-semibold uppercase text-cream hover:bg-white/5">Visit Us</NavLink>
          </div>
        </div>
      )}
    </header>
  );
}
