"""Connectivity/integration smoke test against a real Binance testnet account.

Places NO orders. Verifies: credentials work, balance/positions/klines
endpoints respond, and a live signal can be computed end-to-end. Run this
after filling in .env, before leaving the bot unattended.

    .venv/bin/python scripts/smoke_test.py
"""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from src.broker import Broker  # noqa: E402
from src.config import load_config  # noqa: E402
from src.strategy import generate_signal, min_bars_required  # noqa: E402


def main() -> int:
    config = load_config()
    if not config.testnet:
        print("BINANCE_TESTNET=false — refusing to run the smoke test against a "
              "live account. Set BINANCE_TESTNET=true first.")
        return 1

    broker = Broker(config)

    print(f"Mode: {'TESTNET' if config.testnet else 'LIVE'}")

    balance = broker.get_quote_balance()
    print(f"USDT balance: ${balance:,.2f}")

    positions = broker.get_positions()
    print(f"Open positions: {len(positions)} {positions}")

    symbol = config.watchlist[0]
    bars = broker.get_bars(
        symbol,
        config.strategy.bar_timeframe_minutes,
        limit=min_bars_required(config.strategy) + 10,
    )
    print(f"Fetched {len(bars)} bars for {symbol}")
    if not bars.empty and len(bars) >= min_bars_required(config.strategy):
        signal = generate_signal(bars, config.strategy)
        print(f"Current signal for {symbol}: {signal.value}")
    else:
        print(f"Not enough bars yet for {symbol} to compute a signal "
              f"(need {min_bars_required(config.strategy)}, have {len(bars)})")

    print("\nSmoke test passed: credentials, balance, positions, and market "
          "data all reachable. No orders were placed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
