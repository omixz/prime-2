from __future__ import annotations

import logging
import time
import traceback
from datetime import date

from alpaca.trading.enums import OrderSide

from .alerts import Alerter
from .broker import Broker
from .config import Config, load_config
from .logging_config import setup_logging
from .risk_manager import RiskManager
from .state import StateStore
from .strategy import Signal, compute_trade_levels, generate_signal, min_bars_required

logger = logging.getLogger("trading_bot.main")


class TradingBot:
    def __init__(self, config: Config):
        self.config = config
        self.broker = Broker(config)
        self.state = StateStore()
        self.risk = RiskManager(config.risk, self.state)
        self.alerter = Alerter(config.alert_webhook_url)
        self._last_day_summarized: str | None = None

    def run_forever(self) -> None:
        self.alerter.send(
            f"Trading bot started ({'PAPER' if self.config.paper else 'LIVE'} mode)."
        )
        while True:
            try:
                self._roll_day_if_needed()
                self._tick()
            except Exception:
                logger.exception("Unhandled error in trading loop tick")
                self.alerter.send(
                    "Trading bot hit an unhandled error (see logs) — "
                    "it will keep retrying, no manual restart needed:\n"
                    f"{traceback.format_exc()[-500:]}"
                )
            time.sleep(self.config.schedule.poll_interval_seconds)

    def _roll_day_if_needed(self) -> None:
        current_state = self.state._load()
        if current_state.trading_day != self.state.state.trading_day:
            self.state.state = current_state
            self.state.save()

    def _tick(self) -> None:
        if not self.broker.is_market_open():
            self._maybe_send_daily_summary()
            return

        if self.risk.check_daily_loss():
            self.broker.close_all_positions()
            self.alerter.send("Kill switch tripped — all positions liquidated.")
            return

        minutes_left = self.broker.minutes_to_close()
        if minutes_left <= self.config.schedule.flatten_before_close_minutes:
            positions = self.broker.get_positions()
            if positions:
                logger.info("Flattening positions before market close")
                self.broker.close_all_positions()
            return

        account = self.broker.get_account()
        equity = float(account.equity)
        positions = {p.symbol: p for p in self.broker.get_positions()}

        for symbol in self.config.watchlist:
            try:
                self._evaluate_symbol(symbol, equity, positions)
            except Exception:
                logger.exception("Error evaluating %s", symbol)

    def _evaluate_symbol(self, symbol: str, equity: float, positions: dict) -> None:
        strat_cfg = self.config.strategy
        bars = self.broker.get_bars(
            symbol,
            strat_cfg.bar_timeframe_minutes,
            limit=min_bars_required(strat_cfg) + 10,
        )
        if bars.empty or len(bars) < min_bars_required(strat_cfg):
            return

        signal = generate_signal(bars, strat_cfg)
        held = symbol in positions

        if signal == Signal.BUY and not held:
            price = float(bars["close"].iloc[-1])
            dollar_amount = self.risk.position_size_dollars(equity)
            qty = round(dollar_amount / price, 4)
            if qty <= 0:
                return

            approved, reason = self.risk.approve_entry(
                symbol, equity, len(positions), dollar_amount
            )
            if not approved:
                logger.info("Entry for %s rejected by risk manager: %s", symbol, reason)
                return

            self.broker.submit_market_order(symbol, qty, OrderSide.BUY)
            self.state.record_trade()
            levels = compute_trade_levels(bars, price, strat_cfg)
            logger.info(
                "Bought %s x%.4f @ ~%.2f (stop %.2f, target %.2f)",
                symbol,
                qty,
                price,
                levels.stop_loss,
                levels.take_profit,
            )

        elif signal == Signal.SELL and held:
            qty = float(positions[symbol].qty)
            self.broker.submit_market_order(symbol, qty, OrderSide.SELL)
            self.state.record_trade()
            logger.info("Sold %s x%.4f on crossover-down signal", symbol, qty)

    def _maybe_send_daily_summary(self) -> None:
        today = date.today().isoformat()
        if self._last_day_summarized == today:
            return
        # Only summarize once we've actually seen at least one trade-day tick
        # after market close, avoiding a spam message on every off-hours poll.
        if self.state.state.trading_day != today:
            return
        self._last_day_summarized = today
        self.alerter.send(
            f"Daily summary {today}: realized P&L ${self.state.state.realized_pnl_usd:.2f}, "
            f"{self.state.state.trades_placed} trades, "
            f"kill switch tripped: {self.state.state.kill_switch_tripped}"
        )


def main() -> None:
    setup_logging()
    config = load_config()
    bot = TradingBot(config)
    bot.run_forever()


if __name__ == "__main__":
    main()
