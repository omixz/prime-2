# Prime Burger Co — Website + Online Ordering

A static React site (Home, Menu, Visit Us) with online ordering: cart + Square-hosted checkout.
Same architecture as the Prime Creamery Co site — see that project's README for a more detailed
walkthrough of how the checkout flow works internally (server-side price validation, rate
limiting, etc.) — it applies here identically.

## Quick setup

### 1. Square
Create/log into your Square account at [squareup.com](https://squareup.com), create an app in the
[Developer Dashboard](https://developer.squareup.com/apps), and grab your **Access Token** and
**Location ID**.

### 2. Push to GitHub
```bash
cd prime-burger-ordering
git init
git add .
git commit -m "Initial commit: Prime Burger Co site + Square ordering"
git branch -M main
git remote add origin https://github.com/<your-username>/prime-burger-ordering.git
git push -u origin main
```

### 3. Deploy on Vercel
Import the repo at [vercel.com/new](https://vercel.com/new), then add these Environment Variables
in Project Settings before deploying:

| Key | Value |
|---|---|
| `SQUARE_ACCESS_TOKEN` | your Sandbox (or Production) access token |
| `SQUARE_LOCATION_ID` | your Square location ID |
| `SQUARE_ENVIRONMENT` | `sandbox` while testing, `production` when live |
| `SITE_URL` | your deployed URL |

Test a full order with `SQUARE_ENVIRONMENT=sandbox` first (fake test cards, no real charges),
then switch to `production` when ready.

## Editing the menu

Edit `src/data/menu.ts` — one source of truth for both what's displayed and what's charged.
Prices are in cents (e.g. `1890` = $18.90 AUD).

## Local development

```bash
npm install
npm run dev
```

`/api/create-checkout` only works when deployed to Vercel, or locally via `vercel dev` (requires
the Vercel CLI and your Square keys in a local `.env`, copied from `.env.example`).

## Location

585 Hume Highway, Yagoona, NSW 2199 — same address as Prime Creamery Co.

## Operational notes

- **This deployment's actual Vercel env vars are non-standard**: `SquareToken` /
  `SquareLocation` / `SquareEnviorment` (note the typo) / `SiteURL`, not the
  `SQUARE_*` names documented above. `api/create-checkout.ts` reads both sets,
  so either naming works — but if you're troubleshooting a "Missing Square
  configuration" error, check the dashboard for these exact names first.
- **`/test-order`** is a hidden, unlisted page (not linked from the nav/menu)
  that adds a real $1.00 line item and runs it through the exact same
  checkout → Square Orders API → POS fulfillment path as a real order. Use it
  to confirm a paid order actually reaches the physical POS terminal without
  needing a full-price test purchase. $1.00 because Square's payment links
  reject anything below their minimum charge.
- **`vercel.json`** exists solely to rewrite every non-`/api/*` route to
  `index.html` — without it, a direct hit to any client-side route (a page
  refresh on `/menu`, or Square's post-payment redirect to
  `/checkout/success`) 404s, since there's no literal file at that path for
  Vercel's static server to find.
