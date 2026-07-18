import { Star, Gift, Zap } from "lucide-react";

export function Loyalty() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
      <header className="text-center">
        <p className="text-sm font-display font-bold uppercase tracking-widest text-flame">Rewards Program</p>
        <h1 className="mt-2 font-display text-5xl font-black uppercase md:text-6xl">Earn & Enjoy</h1>
        <p className="mx-auto mt-4 max-w-2xl text-charcoal/70">
          Every order brings you closer to free burgers. Join our loyalty program and start earning rewards today.
        </p>
      </header>

      <div className="mt-16 grid gap-8 md:grid-cols-3">
        <div className="rounded-2xl bg-gradient-to-br from-flame/5 to-gold/5 p-8 shadow-soft">
          <div className="mb-4 inline-block rounded-full bg-flame/10 p-3">
            <Star className="text-flame" size={24} />
          </div>
          <h3 className="font-display text-xl font-black uppercase text-charcoal">Earn Points</h3>
          <p className="mt-3 text-charcoal/70">Earn 1 point for every dollar spent on any burger, side, drink, or merch.</p>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-gold/5 to-flame/5 p-8 shadow-soft">
          <div className="mb-4 inline-block rounded-full bg-gold/10 p-3">
            <Gift className="text-gold" size={24} />
          </div>
          <h3 className="font-display text-xl font-black uppercase text-charcoal">Redeem Rewards</h3>
          <p className="mt-3 text-charcoal/70">Every 10th burger is free. Collect 10 points and grab your free burger on your next visit.</p>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-cream/5 to-flame/5 p-8 shadow-soft">
          <div className="mb-4 inline-block rounded-full bg-charcoal/10 p-3">
            <Zap className="text-charcoal" size={24} />
          </div>
          <h3 className="font-display text-xl font-black uppercase text-charcoal">Stay Engaged</h3>
          <p className="mt-3 text-charcoal/70">Get exclusive perks, early access to new menu items, and special birthday rewards.</p>
        </div>
      </div>

      <div className="mt-16 rounded-3xl bg-gradient-to-r from-charcoal to-charcoal/95 p-8 md:p-12">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-black uppercase text-cream md:text-4xl">How it works</h2>
          <div className="mt-8 space-y-5 text-cream/80">
            <div className="flex gap-4">
              <div className="flex-shrink-0 font-display text-2xl font-black text-gold">1</div>
              <div>
                <p className="font-semibold text-cream">Sign up in-store or ask when you order</p>
                <p className="mt-1 text-sm">Scan the QR code or provide your phone number at checkout.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 font-display text-2xl font-black text-gold">2</div>
              <div>
                <p className="font-semibold text-cream">Earn points on every purchase</p>
                <p className="mt-1 text-sm">1 point per dollar — no minimum order, applies to everything.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 font-display text-2xl font-black text-gold">3</div>
              <div>
                <p className="font-semibold text-cream">Redeem when you're ready</p>
                <p className="mt-1 text-sm">Hit 10 points and your next burger is on us. Simple as that.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-charcoal/70">Questions? <a href="mailto:loyalty@primeburger.example" className="font-semibold text-flame hover:underline">Get in touch</a></p>
      </div>
    </div>
  );
}
