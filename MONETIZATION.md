# Monetizing Hoop Legends

Three paths, roughly in order of speed-to-revenue. All of the code-side wiring
listed here is already done — what's left in each section is stuff only you
can do (accounts, payment/tax info, store submission).

## 1. Poki / CrazyGames (ads — fastest path)

The game already calls the portal SDKs correctly:
- `Platform.gameplayStart()` / `gameplayStop()` fire on game start/pause (required by both portals so they can pause their own ad timers during play).
- `Platform.commercialBreak()` now actually fires — an interstitial ad request goes out right when you click "Play Game" / "Tip Off Next Game" / "Play Game" (Franchise) / "Tip Off" (Versus), before the match starts. This is the standard "between-session" ad slot portals expect; nothing interrupts live gameplay.
- Both hooks no-op safely if the portal's SDK script isn't present, so the same `basketball-rpg.html` works unmodified on itch.io or the desktop build.

**To go live on one of these:**
1. Pick Poki or CrazyGames (you can submit to both, just not with the same exact build running both SDKs at once — ship one SDK tag per host, which the `<head>` comment block in `basketball-rpg.html` already sets up — uncomment the one you need).
2. Poki: apply at https://developers.poki.com/ → "Submit a game" (free, they review and reach back out). CrazyGames: https://developer.crazygames.com/ → create a developer account → "New Game".
3. Upload the zip from `web/hoop-legends-web.zip` (regenerate anytime with `bash web/make-itch-build.sh` — same static build works for both portals and itch.io).
4. Fill in: game title, short description, a few screenshots (take some from actual play — franchise mode with the OVR labels visible reads well), and category (Sports).
5. They review for SDK compliance (this is why `gameplayStart`/`gameplayStop`/`commercialBreak` had to actually be wired up, not just defined) and content. Once approved, ad revenue starts accruing automatically — no per-game setup beyond that.
6. Payment: both portals pay out via PayPal/bank transfer past a minimum threshold — you'll set that up in their dashboard once your account is approved, using your own info.

## 2. itch.io (direct — you set the price)

1. `bash web/make-itch-build.sh` → uploads `web/hoop-legends-web.zip`.
2. Create the project at https://itch.io/game/new (needs your itch.io account).
3. Upload the zip, check **"This file will be played in the browser"**, set the viewport to roughly 1000×700 (the game's native canvas size).
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
