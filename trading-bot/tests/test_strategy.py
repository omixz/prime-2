import numpy as np
import pandas as pd
import pytest

from src.config import StrategyConfig
from src.strategy import Signal, compute_trade_levels, generate_signal, min_bars_required

CONFIG = StrategyConfig(
    fast_ema=3,
    slow_ema=5,
    bar_timeframe_minutes=5,
    atr_period=3,
    stop_loss_atr_multiple=1.5,
    take_profit_atr_multiple=3.0,
)


def make_bars(closes: list[float]) -> pd.DataFrame:
    closes = np.array(closes, dtype=float)
    return pd.DataFrame(
        {
            "open": closes,
            "high": closes * 1.001,
            "low": closes * 0.999,
            "close": closes,
            "volume": [1000] * len(closes),
        }
    )


def test_hold_when_not_enough_bars():
    bars = make_bars([100, 101, 102])
    assert generate_signal(bars, CONFIG) == Signal.HOLD


def test_buy_signal_on_upward_crossover():
    # Flat series with a single sharp uptick on the final bar puts the fast
    # EMA crossing above the slow EMA right at the last bar.
    closes = [100] * 6 + [110]
    bars = make_bars(closes)
    assert generate_signal(bars, CONFIG) == Signal.BUY


def test_sell_signal_on_downward_crossover():
    closes = [100] * 6 + [90]
    bars = make_bars(closes)
    assert generate_signal(bars, CONFIG) == Signal.SELL


def test_hold_when_flat():
    closes = [100.0] * 10
    bars = make_bars(closes)
    assert generate_signal(bars, CONFIG) == Signal.HOLD


def test_min_bars_required():
    assert min_bars_required(CONFIG) == max(CONFIG.slow_ema, CONFIG.atr_period) + 2


def test_compute_trade_levels_bounds_risk():
    closes = [100, 101, 99, 102, 98, 103]
    bars = make_bars(closes)
    levels = compute_trade_levels(bars, entry_price=103.0, config=CONFIG)
    assert levels.stop_loss < 103.0 < levels.take_profit


def test_compute_trade_levels_handles_zero_atr():
    # Perfectly flat bars -> ATR of 0 -> must fall back to a nonzero bound.
    bars = make_bars([100.0] * 6)
    levels = compute_trade_levels(bars, entry_price=100.0, config=CONFIG)
    assert levels.stop_loss < 100.0 < levels.take_profit
