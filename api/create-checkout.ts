import type { VercelRequest, VercelResponse } from "@vercel/node";
// Vercel's Node runtime resolves this as native ESM (package.json has
// "type": "module"), which requires an explicit file extension on relative
// imports — omitting it caused a production 500 crash
// (ERR_MODULE_NOT_FOUND: Cannot find module '/var/task/src/data/menu').
import { allItems, smallDrinks, bottleDrinks } from "../src/data/menu.js";

// Server-side price lookup, keyed by menu item id. We NEVER trust prices sent
// from the browser — only the item id, combo size, drink id and quantity —
// so a tampered client request can't change what gets charged.
const PRICE_BY_ID = new Map(allItems.map((item) => [item.id, item]));
const SMALL_DRINK_BY_ID = new Map(smallDrinks.map((item) => [item.id, item]));
const BOTTLE_DRINK_BY_ID = new Map(bottleDrinks.map((item) => [item.id, item]));

const MAX_LINE_ITEMS = 30;
const MAX_QUANTITY_PER_ITEM = 20;

// Best-effort in-memory rate limit. Serverless instances are ephemeral and
// this resets on cold start, so it only slows down casual abuse — for
// stronger protection, add Vercel's Attack Challenge Mode or an Upstash
// Redis-backed limiter in front of this route.
const requestLog = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 10;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT_MAX_REQUESTS;
}

type IncomingItem = { id: unknown; quantity: unknown; comboSize?: unknown; drinkId?: unknown };

const MAX_NAME_LENGTH = 60;
const MAX_PHONE_LENGTH = 30;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.socket.remoteAddress || "unknown";
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: "Too many requests. Please wait a moment and try again." });
  }

  // Support both the documented var names and the ones currently set in Vercel
  // (SquareToken / SquareLocation / SquareEnviorment / SiteURL) so this works
  // without renaming anything in the dashboard. Trimmed because a stray
  // newline/space pasted into a Vercel env var value is a common source of
  // Square rejecting an otherwise-correct location ID or token outright.
  const accessToken = (process.env.SQUARE_ACCESS_TOKEN || process.env.SquareToken)?.trim();
  const locationId = (process.env.SQUARE_LOCATION_ID || process.env.SquareLocation)?.trim();
  const environment = (process.env.SQUARE_ENVIRONMENT || process.env.SquareEnviorment)?.trim();
  const squareApiBase = environment === "production"
    ? "https://connect.squareup.com"
    : "https://connect.squareupsandbox.com";
  const siteUrl = (process.env.SITE_URL || process.env.SiteURL)?.trim().replace(/\/+$/, "");

  if (!accessToken || !locationId || !siteUrl) {
    console.error("Missing Square configuration env vars");
    return res.status(500).json({ error: "Checkout isn't configured yet. Please contact the shop directly." });
  }

  const body = req.body as { items?: IncomingItem[]; pickupName?: unknown; pickupPhone?: unknown };
  if (!body || !Array.isArray(body.items) || body.items.length === 0) {
    return res.status(400).json({ error: "Your cart is empty." });
  }
  if (body.items.length > MAX_LINE_ITEMS) {
    return res.status(400).json({ error: "Too many different items in one order." });
  }

  const pickupName = typeof body.pickupName === "string" ? body.pickupName.trim().slice(0, MAX_NAME_LENGTH) : "";
  if (!pickupName) {
    return res.status(400).json({ error: "Please enter a name for pickup." });
  }
  const pickupPhone =
    typeof body.pickupPhone === "string" ? body.pickupPhone.trim().slice(0, MAX_PHONE_LENGTH) : "";

  const lineItems: { name: string; quantity: string; base_price_money: { amount: number; currency: string } }[] = [];

  for (const raw of body.items) {
    const id = typeof raw.id === "string" ? raw.id : null;
    const quantityNum = Number(raw.quantity);
    const comboSize = raw.comboSize === "regular" || raw.comboSize === "large" ? raw.comboSize : "single";
    const drinkId = typeof raw.drinkId === "string" ? raw.drinkId : null;

    if (!id || !PRICE_BY_ID.has(id)) {
      return res.status(400).json({ error: "One of the items in your cart is no longer available." });
    }
    if (!Number.isFinite(quantityNum) || quantityNum < 1) {
      return res.status(400).json({ error: "Invalid item quantity." });
    }

    const quantity = Math.min(MAX_QUANTITY_PER_ITEM, Math.floor(quantityNum));
    const menuItem = PRICE_BY_ID.get(id)!;

    let priceCents = menuItem.priceCents;
    let name = menuItem.name;

    if (comboSize === "regular" && menuItem.comboUpchargeCents) {
      const drink = drinkId ? SMALL_DRINK_BY_ID.get(drinkId) : null;
      priceCents += menuItem.comboUpchargeCents;
      name = `${menuItem.name} — Combo${drink ? ` w/ ${drink.name}` : ""}`;
    } else if (comboSize === "large" && menuItem.largeComboUpchargeCents) {
      const drink = drinkId ? BOTTLE_DRINK_BY_ID.get(drinkId) : null;
      priceCents += menuItem.largeComboUpchargeCents;
      name = `${menuItem.name} — Large Combo${drink ? ` w/ ${drink.name}` : ""}`;
    }

    lineItems.push({
      name,
      quantity: String(quantity),
      base_price_money: { amount: priceCents, currency: "AUD" },
    });
  }

  try {
    const idempotencyKey =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const squareRes = await fetch(`${squareApiBase}/v2/online-checkout/payment-links`, {
      method: "POST",
      headers: {
        "Square-Version": "2024-10-17",
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idempotency_key: idempotencyKey,
        order: {
          location_id: locationId,
          line_items: lineItems,
          // Without a fulfillment, Square records the payment but the order
          // never surfaces in the Point of Sale app's Orders queue — the
          // money moves but no ticket ever reaches the till.
          fulfillments: [
            {
              type: "PICKUP",
              pickup_details: {
                schedule_type: "ASAP",
                prep_time_duration: "PT15M",
                recipient: {
                  display_name: pickupName,
                  ...(pickupPhone ? { phone_number: pickupPhone } : {}),
                },
              },
            },
          ],
        },
        checkout_options: {
          redirect_url: `${siteUrl}/checkout/success`,
          ask_for_shipping_address: false,
        },
      }),
    });

    const data = await squareRes.json();

    if (!squareRes.ok) {
      console.error("Square API error:", data);
      return res.status(502).json({ error: "Couldn't start checkout right now. Please try again shortly." });
    }

    return res.status(200).json({ url: data.payment_link?.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}
