import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Star, Quote } from "lucide-react";
import { menuSections, formatPrice, type MenuItem } from "../data/menu";
import { useCart } from "../context/CartContext";
import { ComboModal } from "../components/ComboModal";
import { BurgerArt, FriesArt, DrinkArt } from "../components/FoodArt";

const FEATURED_ART: Record<string, typeof BurgerArt> = {
  "beef-juicy-prime": BurgerArt,
  "chk-mushroom-prime": BurgerArt,
  "beef-cheesy-prime": BurgerArt,
  "fries-chicken-mushroom": FriesArt,
};

const featuredIds = ["beef-juicy-prime", "chk-mushroom-prime", "beef-cheesy-prime", "fries-chicken-mushroom"];
const featured = menuSections.flatMap((s) => s.items).filter((i) => featuredIds.includes(i.id));

const reviews = [
  {
    quote: "One of the best burgers I've had in Australia, if not the best.",
    source: "Pedro Thebich, Google review",
  },
  {
    quote: "The best burger truck in Sydney — a hidden gem.",
    source: "Frank Wordd, Google review",
  },
  {
    quote: "Top notch street food, cooked perfectly every time.",
    source: "Brian Levesque, Google review",
  },
];

export function Home() {
  const { addItem } = useCart();
  const [comboItem, setComboItem] = useState<MenuItem | null>(null);

  const handleAdd = (item: MenuItem) => {
    if (item.comboEligible) {
      setComboItem(item);
      return;
    }
    addItem(item);
  };

  return (
    <div>
      <section className="relative overflow-hidden bg-charcoal">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-display font-bold uppercase tracking-widest text-gold">
              <Star size={14} fill="currentColor" /> 100% Halal · Yagoona
            </span>
            <h1 className="mt-5 font-display text-5xl font-black uppercase leading-[1.05] text-cream md:text-7xl">
              Smashed <span className="text-flame">prime</span> burgers.
            </h1>
            <p className="mt-5 max-w-md text-lg text-cream/70">
              Wagyu smash patties, loaded fries and shakes — order ahead online and skip the queue for pickup.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 rounded-full bg-flame px-6 py-3 font-display font-bold uppercase text-cream shadow-glow transition-transform hover:scale-105"
              >
                Order Online <ArrowRight size={18} />
              </Link>
              <Link
                to="/visit"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 font-display font-bold uppercase text-cream shadow-soft hover:bg-white/20"
              >
                <MapPin size={18} /> Get Directions
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[3rem] bg-flame opacity-20 blur-3xl" />
            <div className="relative flex aspect-square w-full items-center justify-center rounded-[2.5rem] bg-gradient-to-br from-flame/30 to-gold/20 p-10 shadow-glow">
              <BurgerArt className="w-full max-w-xs drop-shadow-2xl" />
            </div>
            <DrinkArt className="absolute -bottom-6 -left-6 h-24 w-24 drop-shadow-xl" />
            <FriesArt className="absolute -top-4 -right-4 h-20 w-20 drop-shadow-xl" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-display font-bold uppercase tracking-widest text-flame">Fan Favourites</p>
            <h2 className="mt-1 font-display text-3xl font-black uppercase md:text-4xl">Order the classics</h2>
          </div>
          <Link to="/menu" className="hidden md:inline-flex items-center gap-1 text-sm font-display font-bold uppercase text-flame hover:gap-2 transition-all">
            Full menu <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((item) => {
            const Art = FEATURED_ART[item.id];
            return (
              <div
                key={item.id}
                className="group flex flex-col justify-between overflow-hidden rounded-3xl bg-white p-5 shadow-soft ring-1 ring-charcoal/5 transition-transform hover:-translate-y-1 hover:shadow-glow"
              >
                <div>
                  {Art ? (
                    <div className="mb-4 flex h-28 items-center justify-center rounded-2xl bg-cream">
                      <Art className="h-20 w-20" />
                    </div>
                  ) : null}
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-display text-lg font-bold">{item.name}</h3>
                    <span className="font-display text-lg font-black text-flame">{formatPrice(item.priceCents)}</span>
                  </div>
                  <p className="mt-2 text-sm text-charcoal/60">{item.desc}</p>
                </div>
                <button
                  onClick={() => handleAdd(item)}
                  className="mt-4 rounded-full bg-charcoal/5 px-4 py-2 text-sm font-display font-bold uppercase text-charcoal transition-colors hover:bg-flame hover:text-cream"
                >
                  Add to cart
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-smoke py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-center text-sm font-display font-bold uppercase tracking-widest text-gold">What people are saying</p>
          <h2 className="mt-1 text-center font-display text-3xl font-black uppercase text-cream md:text-4xl">Real reviews</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {reviews.map((r) => (
              <div key={r.source + r.quote} className="rounded-3xl bg-white/5 p-6">
                <Quote className="text-flame" size={24} />
                <p className="mt-3 text-cream/90">{r.quote}</p>
                <p className="mt-4 text-xs uppercase tracking-widest text-cream/50">{r.source}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {comboItem && <ComboModal item={comboItem} onClose={() => setComboItem(null)} />}
    </div>
  );
}
