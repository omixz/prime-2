# Hoop Legends — Web publishing (itch.io / Poki / CrazyGames)

The whole game is one self-contained file: `../basketball-rpg.html`. No build
step, no external assets, no network calls — which is exactly what web game
portals want.

## itch.io (HTML5) — works today, zero code changes

1. Copy the game in as `index.html`:
   ```
   ./make-itch-build.sh        # produces web/build/index.html + hoop-legends-web.zip
   ```
2. On itch.io: **Upload files → hoop-legends-web.zip**, tick **"This file will be
   played in the browser"**, and set the embed size to **1000 × 640** (or larger;
   the canvas is 960×540 and scales).
3. Recommended itch settings: Kind of project = **HTML**, enable **Fullscreen
   button**, mobile-friendly is optional (game is keyboard-based).

## Poki / CrazyGames — SDK hooks are already wired

The game calls a small `Platform` shim (`gameplayStart`, `gameplayStop`,
`commercialBreak`) that **no-ops unless the portal SDK is present**. To go live
on a portal, add their SDK `<script>` in the `<head>` of `index.html`:

- **Poki**: add `<script src="//game-cdn.poki.com/scripts/v2/poki-sdk.js"></script>`.
  The shim will then call `PokiSDK.init()`, `gameplayStart()`, `gameplayStop()`,
  and `commercialBreak()` automatically.
- **CrazyGames**: add `<script src="https://sdk.crazygames.com/crazygames-sdk-v3.js"></script>`.
  The shim calls `window.CrazyGames.SDK.init()`, `game.gameplayStart/Stop()`,
  and `ad.requestAd('midgame', …)`.

Both portals require: no external network requests (already true), the game
pauses during ad breaks (the pause system handles this), and gameplay
start/stop events around active play (already fired in `startGame` / `endGame`
/ pause).

### Where ad breaks fire
`Platform.commercialBreak(done)` is available to gate a game behind a portal ad.
It always runs `done()` even with no SDK, so hooking it into the "Tip Off"
buttons is safe. It's intentionally left un-forced so you can decide ad
frequency per portal policy (Poki disallows ads too frequently).

## Notes
- Keyboard controls are listed on the in-game HUD; portals accept keyboard games.
- Everything (art, music, names, teams) is original — safe for commercial
  distribution.
