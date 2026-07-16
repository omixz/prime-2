# Store assets

Key art and screenshots for submitting Hoop Legends to Poki, CrazyGames, and
itch.io. All key art is generated from `poster-src/poster.html`, which reuses
the exact same pixel-sprite/team-color code as the shipped game, so it's
guaranteed to look on-brand and never depends on external art.

## What's here

- **`poki/thumbnail-1024x1024.png`** — Poki's static thumbnail. Square,
  full-bleed, no text (Poki explicitly penalizes text/borders on this one).
  Meets their ≥628×628 minimum with room to spare.
- **`crazygames/`** — the three cover images CrazyGames requires per submission:
  `cover-landscape-1920x1080.png` (16:9), `cover-portrait-800x1200.png` (2:3),
  `cover-square-800x800.png` (1:1). Same lineup/colors across all three so the
  game is recognizable regardless of which one a page shows.
- **`itch/cover-630x500.png`** — itch.io's recommended cover size (315:250
  ratio, this is 2x that so it stays crisp on hi-DPI screens).
- **`screenshots/01`–`05`** — real, unedited captures of actual gameplay
  (mode select, character creation, live play with the OVR/position labels,
  Franchise HQ, and the roster/trade screen) — not staged mockups. itch.io
  and both portals want real screenshots, not just key art.

## Regenerating

If the game's visuals change later (new team, new sprite, etc.), rerun the
generator rather than hand-editing the PNGs:

```bash
# poster/cover art — needs a Chromium binary; adjust the executablePath
# if you're not running in this project's containerized environment
node -e "
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  async function render(w,h,layout,text,out){
    await page.setViewportSize({width:w,height:h});
    await page.goto(\`file://\${__dirname}/poster-src/poster.html?w=\${w}&h=\${h}&layout=\${layout}&text=\${text?1:0}\`);
    await page.waitForTimeout(150);
    await page.locator('#c').screenshot({ path: out });
  }
  await render(1024,1024,'square',false,'poki/thumbnail-1024x1024.png');
  await render(1920,1080,'landscape',true,'crazygames/cover-landscape-1920x1080.png');
  await render(800,1200,'portrait',true,'crazygames/cover-portrait-800x1200.png');
  await render(800,800,'square',true,'crazygames/cover-square-800x800.png');
  await render(630,500,'square',true,'itch/cover-630x500.png');
  await browser.close();
})();
"
```

Screenshots are just Playwright captures of the real game — see the
Playwright script used in the PR history for the exact click paths, or drive
the game manually and use your OS screenshot tool.
