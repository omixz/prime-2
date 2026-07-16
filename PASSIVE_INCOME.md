# Passive income strategies for Prime Burger Co

The online ordering site is the asset here — once it's live, these features
generate revenue with no extra staff time per sale.

## Shipped

- **Digital gift cards** (`/gift-cards`, `src/data/menu.ts` → `giftCardItems`).
  Customers buy a $25/$50/$100 card through the existing Square checkout flow
  (no new payment integration needed). Two passive revenue effects:
  - **Float** — cash in the door before the food is redeemed.
  - **Breakage** — a share of gift cards are never fully redeemed.
  - Also drives new-customer acquisition (the buyer is rarely the redeemer).

  Note: the site was previously missing its entire `src/` and `api/` source
  (only root config files had been committed — see git history on
  `prime-burger-ordering.zip`). That's restored as part of this change, since
  none of the above works, and the shop takes $0 in online orders, without it.

## Recommended next

- **Loyalty / punch-card program** — e.g. every 10th burger free. Square Loyalty
  plugs into the same Square account already configured here and needs no new
  code, just enabling it in the Square dashboard and adding a mention on the site.
- **Catering pre-orders** — a simple form/page for bulk orders (platters, staff
  lunches) taken and paid for ahead of time, fulfilled in a single batch.
- **Email/SMS list** — capture emails at checkout (Square supports this) and
  automate a monthly promo send — repeat revenue with no manual outreach.
- **Merch** (branded caps, sauce bottles) sold as extra line items through the
  same cart/checkout — incremental margin on an order that's already happening.
