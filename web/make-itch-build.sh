#!/usr/bin/env bash
# Produces an itch.io-ready HTML5 build: web/build/index.html + a zip to upload.
set -e
DIR="$(cd "$(dirname "$0")" && pwd)"
mkdir -p "$DIR/build"
cp "$DIR/../basketball-rpg.html" "$DIR/build/index.html"
( cd "$DIR/build" && rm -f ../hoop-legends-web.zip && zip -q -r ../hoop-legends-web.zip index.html )
echo "Built:"
echo "  $DIR/build/index.html"
echo "  $DIR/hoop-legends-web.zip  (upload this to itch.io, mark 'played in browser')"
