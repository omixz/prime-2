import { useState } from "react";
import { Users, Calendar, Phone, Mail } from "lucide-react";

export function Catering() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    headcount: "",
    orderType: "platters",
    details: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `Catering Inquiry from ${formData.name}`;
    const body = `
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Event Date: ${formData.date}
Headcount: ${formData.headcount}
Order Type: ${formData.orderType}

Details:
${formData.details}

---
Sent from Prime Burger Co Catering Form
    `.trim();
    window.location.href = `mailto:catering@primeburger.example?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
      <header className="text-center">
        <p className="text-sm font-display font-bold uppercase tracking-widest text-flame">Bulk Orders</p>
        <h1 className="mt-2 font-display text-5xl font-black uppercase md:text-6xl">Catering</h1>
        <p className="mx-auto mt-4 max-w-2xl text-charcoal/70">
          Staff lunches, team events, celebrations — we've got the burgers and platters to feed your crew.
        </p>
      </header>

      <div className="mt-16 grid gap-8 md:grid-cols-2">
        <div>
          <div className="space-y-6">
            <div className="rounded-2xl border-2 border-flame/20 bg-flame/5 p-6">
              <div className="flex gap-4">
                <Users className="text-flame" size={24} />
                <div>
                  <h3 className="font-display font-bold uppercase text-charcoal">Feed Your Team</h3>
                  <p className="mt-1 text-charcoal/70">From 10 to 100+ people — we customize to your headcount.</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border-2 border-gold/20 bg-gold/5 p-6">
              <div className="flex gap-4">
                <Calendar className="text-gold" size={24} />
                <div>
                  <h3 className="font-display font-bold uppercase text-charcoal">Flexible Timing</h3>
                  <p className="mt-1 text-charcoal/70">Book ahead for guaranteed availability — minimum 2 days notice.</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border-2 border-charcoal/20 bg-charcoal/5 p-6">
              <div className="flex gap-4">
                <Phone className="text-charcoal" size={24} />
                <div>
                  <h3 className="font-display font-bold uppercase text-charcoal">Direct Support</h3>
                  <p className="mt-1 text-charcoal/70">Dedicated account support to nail your event. No question too small.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl bg-gradient-to-br from-charcoal to-charcoal/95 p-8">
            <h3 className="font-display text-xl font-black uppercase text-cream">What we offer</h3>
            <ul className="mt-4 space-y-2 text-cream/80">
              <li className="flex gap-2">
                <span className="shrink-0">✓</span>
                <span>Build-your-own burger platters</span>
              </li>
              <li className="flex gap-2">
                <span className="shrink-0">✓</span>
                <span>Loaded fries family portions</span>
              </li>
              <li className="flex gap-2">
                <span className="shrink-0">✓</span>
                <span>Combo meal packages</span>
              </li>
              <li className="flex gap-2">
                <span className="shrink-0">✓</span>
                <span>Bulk drink orders</span>
              </li>
              <li className="flex gap-2">
                <span className="shrink-0">✓</span>
                <span>Custom pricing for large orders</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-glow">
          <h2 className="font-display text-2xl font-black uppercase text-charcoal">Get a Quote</h2>
          <p className="mt-2 text-charcoal/70">Fill out your details and we'll follow up within 24 hours.</p>

          {submitted && (
            <div className="mt-4 rounded-lg bg-flame/10 px-4 py-3 text-sm font-semibold text-flame">
              Email client opened — we'll be in touch soon!
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-display font-bold uppercase text-charcoal">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border border-charcoal/15 px-4 py-2 text-charcoal placeholder-charcoal/50 focus:border-flame focus:outline-none focus:ring-1 focus:ring-flame"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-display font-bold uppercase text-charcoal">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border border-charcoal/15 px-4 py-2 text-charcoal placeholder-charcoal/50 focus:border-flame focus:outline-none focus:ring-1 focus:ring-flame"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-display font-bold uppercase text-charcoal">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border border-charcoal/15 px-4 py-2 text-charcoal placeholder-charcoal/50 focus:border-flame focus:outline-none focus:ring-1 focus:ring-flame"
                placeholder="+61 2 XXXX XXXX"
              />
            </div>

            <div>
              <label className="block text-sm font-display font-bold uppercase text-charcoal">Event Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border border-charcoal/15 px-4 py-2 text-charcoal focus:border-flame focus:outline-none focus:ring-1 focus:ring-flame"
              />
            </div>

            <div>
              <label className="block text-sm font-display font-bold uppercase text-charcoal">Headcount</label>
              <input
                type="number"
                name="headcount"
                value={formData.headcount}
                onChange={handleChange}
                required
                min="10"
                className="mt-1 w-full rounded-lg border border-charcoal/15 px-4 py-2 text-charcoal placeholder-charcoal/50 focus:border-flame focus:outline-none focus:ring-1 focus:ring-flame"
                placeholder="How many people?"
              />
            </div>

            <div>
              <label className="block text-sm font-display font-bold uppercase text-charcoal">Order Type</label>
              <select
                name="orderType"
                value={formData.orderType}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-charcoal/15 px-4 py-2 text-charcoal focus:border-flame focus:outline-none focus:ring-1 focus:ring-flame"
              >
                <option value="platters">Burger Platters</option>
                <option value="combos">Combo Meals</option>
                <option value="fries">Loaded Fries Portions</option>
                <option value="mixed">Mixed Selection</option>
                <option value="custom">Custom Order</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-display font-bold uppercase text-charcoal">Details</label>
              <textarea
                name="details"
                value={formData.details}
                onChange={handleChange}
                rows={4}
                className="mt-1 w-full rounded-lg border border-charcoal/15 px-4 py-2 text-charcoal placeholder-charcoal/50 focus:border-flame focus:outline-none focus:ring-1 focus:ring-flame"
                placeholder="Any preferences, dietary needs, or special requests?"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-flame px-6 py-3 font-display font-bold uppercase text-cream shadow-soft transition-transform hover:scale-105"
            >
              Send Inquiry
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-charcoal/60">
            Or call us directly: <a href="tel:+61XXXXXXXXX" className="font-semibold text-flame hover:underline">(02) XXXX XXXX</a>
          </p>
        </div>
      </div>
    </div>
  );
}
