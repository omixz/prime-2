import { MapPin, Clock, Instagram } from "lucide-react";

const hours = [
  ["Monday", "6:00 PM – 2:00 AM"],
  ["Tuesday", "6:00 PM – 2:00 AM"],
  ["Wednesday", "6:00 PM – 2:00 AM"],
  ["Thursday", "6:00 PM – 2:00 AM"],
  ["Friday", "6:00 PM – 2:00 AM"],
  ["Saturday", "1:00 PM – 2:00 AM"],
  ["Sunday", "1:00 PM – 2:00 AM"],
];

export function Visit() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
      <header className="text-center">
        <p className="text-sm font-display font-bold uppercase tracking-widest text-flame">Come Say Hi</p>
        <h1 className="mt-2 font-display text-5xl font-black uppercase md:text-6xl">Visit Us</h1>
        <p className="mx-auto mt-4 max-w-2xl text-charcoal/70">
          Right in Yagoona — order ahead online, or pull up and grab a bite.
        </p>
      </header>

      <div className="mt-14 grid gap-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-3xl bg-white shadow-soft">
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-charcoal/5">
            <iframe
              title="Prime Burger Co on the map"
              src="https://www.google.com/maps?q=585+Hume+Highway,+Yagoona+NSW+2199&output=embed"
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="p-6">
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 shrink-0 text-flame" size={22} />
              <div>
                <h2 className="font-display text-xl font-bold">Our Address</h2>
                <p className="mt-1 text-charcoal/70">
                  585 Hume Highway<br />
                  Yagoona, NSW 2199, Australia
                </p>
                <a
                  href="https://maps.google.com/?q=585+Hume+Highway+Yagoona+NSW+2199"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex rounded-full bg-flame px-5 py-2 text-sm font-display font-bold uppercase text-cream hover:scale-105 transition-transform"
                >
                  Open in Maps
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-soft">
            <div className="flex items-center gap-3">
              <Clock className="text-flame" size={22} />
              <h2 className="font-display text-xl font-bold">Opening Hours</h2>
            </div>
            <ul className="mt-4 divide-y divide-charcoal/10">
              {hours.map(([day, time]) => (
                <li key={day} className="flex justify-between py-2.5 text-sm">
                  <span className="font-semibold">{day}</span>
                  <span className="text-charcoal/60">{time}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-charcoal p-6 text-cream shadow-soft">
            <h2 className="font-display text-xl font-bold text-gold">Order Online</h2>
            <p className="mt-2 text-sm opacity-80">Skip the queue — order ahead and pick up when it's ready.</p>
            <a
              href="/menu"
              className="mt-4 inline-flex rounded-2xl bg-flame px-6 py-3 font-display font-bold uppercase text-cream hover:scale-105 transition-transform"
            >
              Order for Pickup
            </a>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-soft">
            <h2 className="font-display text-xl font-bold">Get in Touch</h2>
            <p className="mt-2 text-sm text-charcoal/60">DM us on Instagram — we're quick to reply.</p>
            <div className="mt-5 flex gap-3">
              <a href="https://www.instagram.com/primeburgerco/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="grid h-11 w-11 place-items-center rounded-full bg-charcoal/5 text-charcoal hover:bg-flame hover:text-cream transition-colors">
                <Instagram size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
