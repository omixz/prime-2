import { Link } from "react-router-dom";
import { Instagram, MapPin, Clock } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 bg-charcoal text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-flame font-display text-lg font-black text-cream">
              P
            </span>
            <span className="font-display text-xl font-black uppercase">Prime Burger Co</span>
          </div>
          <p className="mt-4 max-w-xs text-sm opacity-80">
            Smashed prime cut wagyu burgers, loaded fries and shakes. 100% halal. Order ahead for pickup in Yagoona.
          </p>
        </div>

        <div>
          <h4 className="font-display text-lg font-bold text-gold">Visit</h4>
          <p className="mt-3 flex items-start gap-2 text-sm opacity-90">
            <MapPin size={16} className="mt-0.5 shrink-0" />
            585 Hume Hwy, Yagoona, NSW 2199
          </p>
          <p className="mt-2 flex items-start gap-2 text-sm opacity-90">
            <Clock size={16} className="mt-0.5 shrink-0" />
            Mon–Fri 6pm–2am · Sat–Sun 1pm–2am
          </p>
        </div>

        <div>
          <h4 className="font-display text-lg font-bold text-gold">Explore</h4>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link to="/menu" className="opacity-90 hover:opacity-100 hover:text-gold">Order Online</Link>
            <Link to="/gift-cards" className="opacity-90 hover:opacity-100 hover:text-gold">Gift Cards</Link>
            <Link to="/visit" className="opacity-90 hover:opacity-100 hover:text-gold">Visit Us</Link>
          </div>
          <div className="mt-5 flex gap-3">
            <a href="https://www.instagram.com/primeburgerco/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-flame transition-colors">
              <Instagram size={18} />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-5 py-5 text-xs opacity-70">
          © {new Date().getFullYear()} Prime Burger Co. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
