from __future__ import annotations

from dataclasses import dataclass
from enum import Enum

import pandas as pd

from .config import StrategyConfig


class Signal(Enum):
    BUY = "buy"
    SELL = "sell"
    HOLD = "hold"


@dataclass(frozen=True)
class TradeLevels:
    stop_loss: float
    take_profit: float


def _ema(series: pd.Series, span: int) -> pd.Series:
    return series.ewm(span=span, adjust=False).mean()


def _atr(df: pd.DataFrame, period: int) -> pd.Series:
    high, low, close = df["high"], df["low"], df["close"]
    prev_close = close.shift(1)
    tr = pd.concat(
        [
            high - low,
            (high - prev_close).abs(),
            (low - prev_close).abs(),
        ],
        axis=1,
    ).max(axis=1)
    return tr.rolling(period).mean()


def min_bars_required(config: StrategyConfig) -> int:
    return max(config.slow_ema, config.atr_period) + 2


def generate_signal(bars: pd.DataFrame, config: StrategyConfig) -> Signal:
    """Pure function: given historical OHLC bars (oldest first), decide whether
    to buy, sell, or hold. No I/O, no side effects — fully unit-testable."""
    if len(bars) < min_bars_required(config):
        return Signal.HOLD

    fast = _ema(bars["close"], config.fast_ema)
    slow = _ema(bars["close"], config.slow_ema)

    prev_fast, prev_slow = fast.iloc[-2], slow.iloc[-2]
    curr_fast, curr_slow = fast.iloc[-1], slow.iloc[-1]

    crossed_up = prev_fast <= prev_slow and curr_fast > curr_slow
    crossed_down = prev_fast >= prev_slow and curr_fast < curr_slow

    if crossed_up:
        return Signal.BUY
    if crossed_down:
        return Signal.SELL
    return Signal.HOLD


def compute_trade_levels(
    bars: pd.DataFrame, entry_price: float, config: StrategyConfig
) -> TradeLevels:
    atr = _atr(bars, config.atr_period).iloc[-1]
    if pd.isna(atr) or atr <= 0:
        # Fallback so a bad ATR reading can never produce a stop/target that
        # doesn't bound risk.
        atr = entry_price * 0.01
    return TradeLevels(
        stop_loss=entry_price - atr * config.stop_loss_atr_multiple,
        take_profit=entry_price + atr * config.take_profit_atr_multiple,
    )
