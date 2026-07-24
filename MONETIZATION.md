# Monetizing Hoop Legends

Several paths, roughly in order of speed-to-revenue. All of the code-side
wiring listed here is already done — what's left in each section is stuff
only you can do (accounts, payment/tax info, store submission).

## 1. Poki / CrazyGames / GameDistribution (ads — fastest path)

The game already calls all three portal SDKs correctly:
- `Platform.gameplayStart()` / `gameplayStop()` fire on game start/pause (required so portals can pause their own ad timers during play).
- `Platform.commercialBreak()` fires an interstitial ad request right when you click "Play Game" / "Tip Off Next Game" / "Play Game" (Franchise) / "Tip Off" (Versus), before the match starts — the standard "between-session" slot; nothing interrupts live gameplay.
- `Platform.rewardedBreak()` powers the "Watch an Ad for +2 SP" button in the Journey hub (only shown when an SDK is actually present).
- GameDistribution works differently from the other two — it pauses/resumes the game via its own events rather than us calling it — see the `<head>` comment block for exactly how that's wired (`window.HoopLegendsGD`).
- All hooks no-op safely if no portal SDK is present, so the same `basketball-rpg.html` works unmodified on itch.io or the desktop build.

**To go live on one of these:**
1. Pick one (you can submit to more than one, just not with the same exact build running two SDKs at once — ship one SDK block per host; the `<head>` comment in `basketball-rpg.html` has all three ready, uncomment the one you need. For GameDistribution, also replace `YOUR_GD_GAME_ID` with the real ID from their dashboard).
2. Poki: developers.poki.com → "Submit a game". CrazyGames: developer.crazygames.com → "New Game". GameDistribution: gamedistribution.com/developers → their submission form.
3. Upload the zip from `web/hoop-legends-web.zip` (regenerate anytime with `bash web/make-itch-build.sh`).
4. Fill in: title, short description, category (Sports), and images — **all ready-made in `store-assets/`**: the portal-specific covers/thumbnails plus the 5 real gameplay screenshots. See `store-assets/README.md` for what each file is.
5. They review for SDK compliance and content, then ad revenue starts accruing automatically. **If rejected on a vague "quality" basis (this happened with CrazyGames)** — that's a curation-bar rejection, not a broken build. Newgrounds, GameJolt, and GameDistribution's own network have a much lower bar and are worth submitting to in parallel rather than waiting on a resubmission. Their published "New games" / quality-guidelines pages are worth checking against before trying the strict portals again.
6. Payment: portals pay out via PayPal/bank transfer past a minimum threshold — set that up in their dashboard once approved, using your own info.

## 1b. Newgrounds / GameJolt (near-zero rejection risk)

Both are indie-friendly with minimal curation — good for getting the game live
and earning something while a Poki/CrazyGames application is pending or being
reconsidered. Same zip (`web/hoop-legends-web.zip`) and screenshots work for
both; no extra SDK integration needed for a basic listing on either.

## 2. itch.io (direct — you set the price)

1. `bash web/make-itch-build.sh` → uploads `web/hoop-legends-web.zip`.
2. Create the project at https://itch.io/game/new (needs your itch.io account).
3. Upload the zip, check **"This file will be played in the browser"**, set the viewport to roughly 1000×700 (the game's native canvas size). Use `store-assets/itch/cover-630x500.png` as the cover image and the 5 files in `store-assets/screenshots/` as the screenshot gallery.
4. Pricing: for a first release, **"Pay what you want" with a suggested price of ~$3–5 and a free/$0 minimum** tends to get the most plays + some revenue, since itch.io traffic is discovery-driven and a hard paywall kills your visibility in "new & popular." You can switch to a fixed price later once you have reviews.
5. Suggested page copy (edit to taste):
   - **Short description**: "Rise from a dead-end court to Finals MVP, or run a whole franchise — trade players, draft rookies, and chase a title. No install, just tip off."
   - **Tags**: `basketball`, `sports`, `rpg`, `management`, `pixel-art`, `2-player`
   - Mention couch co-op (Local Versus) explicitly — itch.io's "2-player" filter is a real discovery channel.
6. itch.io takes a revenue split you choose yourself (default suggestion is 10%, adjustable down to 0%).

## 3. Steam (biggest lift, do last)

The desktop wrapper (`desktop/`, Tauri) is already scaffolded and documented in `desktop/README.md`. Before this is submittable:
- Generate real icons: drop a 1024×1024 PNG in `desktop/src-tauri/icons/` and run `cargo tauri icon` (the folder is currently empty).
- Build and smoke-test actual binaries on Windows/macOS/Linux (`cargo tauri build`) — untested so far in this environment since it needs Rust + platform build tools per-OS.
- Steamworks account ($100 one-time fee per app), store page assets (capsule images, trailer), and SteamPipe upload — all manual, on Valve's side.
- Optional: wire the `steamworks` Rust crate for achievements/cloud saves if you want them (not required to ship).

This path is worth doing once the game has some traction from #1/#2 — Steam reviews are much harder to bootstrap from zero than a Poki/CrazyGames or itch.io listing.
