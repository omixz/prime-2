#!/usr/bin/env bash
# Convenience local runner: creates a venv if missing, installs deps, runs the bot.
set -euo pipefail
cd "$(dirname "$0")/.."

if [ ! -d .venv ]; then
  python3 -m venv .venv
fi

.venv/bin/pip install -q -r requirements.txt
exec .venv/bin/python -m src.main
