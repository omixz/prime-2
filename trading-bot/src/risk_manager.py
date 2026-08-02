from __future__ import annotations

import logging
from dataclasses import dataclass

from .config import RiskConfig
from .state import StateStore

logger = logging.getLogger("trading_bot.risk")


@dataclass(frozen=True)
class TradeRequest:
    symbol: str
    side: str  # "buy" | "sell"
    price: float


class RiskManager:
    """Single choke point for every order. The strategy proposes; this module
    disposes. Nothing in main.py is allowed to call the broker directly."""

    def __init__(self, config: RiskConfig, state: StateStore):
        self.config = config
        self.state = state

    @property
    def kill_switch_tripped(self) -> bool:
        return self.state.state.kill_switch_tripped

    def check_daily_loss(self, equity: float) -> bool:
        """Returns True and trips the kill switch if the daily loss limit has
        been breached. Limit is a fraction of current equity so it scales
        automatically with account size."""
        pnl = self.state.state.realized_pnl_usd
        kill_switch_threshold = equity * self.config.kill_switch_daily_loss_pct_equity
        if pnl <= -abs(kill_switch_threshold):
            logger.error(
                "Kill-switch daily loss limit breached: realized P&L %.2f <= -%.2f "
                "(%.1f%% of equity %.2f)",
                pnl,
                kill_switch_threshold,
                self.config.kill_switch_daily_loss_pct_equity * 100,
                equity,
            )
            self.state.trip_kill_switch()
            return True
        return False

    def approve_entry(
        self,
        symbol: str,
        equity: float,
        open_position_count: int,
        proposed_dollar_amount: float,
        pattern_day_trader: bool = False,
        day_trade_count: int = 0,
    ) -> tuple[bool, str]:
        if self.kill_switch_tripped:
            return False, "kill switch is tripped, no new entries today"

        max_daily_loss = equity * self.config.max_daily_loss_pct_equity
        if self.state.state.realized_pnl_usd <= -abs(max_daily_loss):
            return False, "max daily loss limit reached, no new entries today"

        if self.state.state.trades_placed >= self.config.max_trades_per_day:
            return False, "max trades per day reached"

        if open_position_count >= self.config.max_concurrent_positions:
            return False, "max concurrent positions reached"

        # FINRA's Pattern Day Trader rule: accounts under $25k equity that
        # are flagged (or would become flagged) as PDT are limited to 3 day
        # trades per rolling 5 business days. Opening a new position here
        # will become a day trade if the strategy closes it same-day, so we
        # must not open one that would push the account over the limit —
        # Alpaca rejects/restricts the account if we do.
        if equity < 25_000 and (pattern_day_trader or day_trade_count >= 3):
            return False, (
                f"PDT rule: equity ${equity:,.2f} < $25,000 and day_trade_count="
                f"{day_trade_count} (pattern_day_trader={pattern_day_trader}) — "
                "opening a new position risks a PDT violation"
            )

        max_dollar_amount = equity * self.config.max_position_pct_equity
        if proposed_dollar_amount > max_dollar_amount:
            return False, (
                f"position size ${proposed_dollar_amount:.2f} exceeds max "
                f"${max_dollar_amount:.2f} ({self.config.max_position_pct_equity:.0%} of equity)"
            )

        return True, "approved"

    def position_size_dollars(self, equity: float) -> float:
        return equity * self.config.max_position_pct_equity
