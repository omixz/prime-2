#!/usr/bin/env bash
# Copies the game into the Tauri frontend dist folder as index.html.
# Run this before building so the desktop app bundles the latest game.
set -e
DIR="$(cd "$(dirname "$0")" && pwd)"
cp "$DIR/../basketball-rpg.html" "$DIR/dist/index.html"
echo "Synced basketball-rpg.html -> desktop/dist/index.html"
