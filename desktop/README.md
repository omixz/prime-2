# Hoop Legends — Desktop (Steam-ready) build

This wraps the single-file browser game (`../basketball-rpg.html`) into a native
desktop app using **Tauri v2**. The result is a small native binary (a few MB,
not the ~100 MB an Electron build produces) for Windows, macOS, and Linux —
suitable for uploading to Steam or distributing directly.

## One-time prerequisites

1. **Rust** — install from https://rustup.rs
2. **Tauri CLI**:
   ```
   cargo install tauri-cli --version "^2"
   ```
3. **OS build deps** — see https://tauri.app/start/prerequisites/
   (e.g. WebView2 on Windows is already present on Win10/11; on Linux install
   `libwebkit2gtk-4.1-dev` and friends).

## Build steps

From the `desktop/` folder:

```bash
./sync.sh                 # copies the latest game into dist/index.html
cd src-tauri
cargo tauri build         # produces installers/binaries in target/release/bundle
```

- Windows: `.msi` / `.exe` in `target/release/bundle/`
- macOS: `.app` / `.dmg`
- Linux: `.AppImage` / `.deb`

For a quick dev run with a live window:

```bash
cd src-tauri && cargo tauri dev
```

## Icons

Drop a single 1024×1024 `app-icon.png` in `src-tauri/icons/` and run
`cargo tauri icon src-tauri/icons/app-icon.png` to generate every icon size
the bundler needs (`.ico`, `.icns`, and the PNGs referenced in
`tauri.conf.json`).

## Putting it on Steam

1. Build the platform binaries above.
2. In Steamworks, create the app, then upload each build via SteamPipe
   (`steamcmd` + a build script) pointing at the bundled binary/installer.
3. Optional Steamworks features (achievements, cloud saves, overlay) are added
   with a Rust Steamworks crate such as `steamworks`; wire calls into
   `src/main.rs`. The in-game manual save slots already work offline and inside
   the packaged app, and can be mirrored to Steam Cloud by pointing Steam Cloud
   at the app's local data directory.

## Notes

- The game is 100% offline and self-contained; no network calls, no external
  assets. `sync.sh` keeps `dist/index.html` in step with the source game file —
  re-run it whenever `basketball-rpg.html` changes.
- Local 2-player (couch versus) works out of the box in the desktop build.
  Online multiplayer would require adding netcode and a matchmaking service,
  which is a separate, larger effort.
