from __future__ import annotations

import logging
import time
import traceback

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

    def run_forever(self) -> None:
        self.alerter.send(
            f"Trading bot started ({'TESTNET' if self.config.testnet else 'LIVE'} mode)."
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
        # Crypto trades 24/7, so "day" is just a UTC calendar boundary for
        # resetting risk counters — not tied to any market open/close.
        previous = self.state.state
        current_state = self.state._load()
        if current_state.trading_day != previous.trading_day:
            self.alerter.send(
                f"Daily summary {previous.trading_day}: realized P&L "
                f"${previous.realized_pnl_usd:.2f}, {previous.trades_placed} trades, "
                f"kill switch tripped: {previous.kill_switch_tripped}"
            )
            self.state.state = current_state
            self.state.save()

    def _tick(self) -> None:
        equity = self.broker.get_quote_balance()

        if self.risk.check_daily_loss(equity):
            self.broker.close_all_positions()
            self.alerter.send("Kill switch tripped — all positions liquidated.")
            return

        positions = self.broker.get_positions()

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
            if dollar_amount <= 0:
                return

            approved, reason = self.risk.approve_entry(
                symbol, equity, len(positions), dollar_amount
            )
            if not approved:
                logger.info("Entry for %s rejected by risk manager: %s", symbol, reason)
                return

            self.broker.submit_notional_buy(symbol, dollar_amount)
            self.state.record_trade()
            levels = compute_trade_levels(bars, price, strat_cfg)
            logger.info(
                "Bought %s ~$%.2f @ ~%.2f (stop %.2f, target %.2f)",
                symbol,
                dollar_amount,
                price,
                levels.stop_loss,
                levels.take_profit,
            )

        elif signal == Signal.SELL and held:
            qty = positions[symbol]
            self.broker.submit_market_sell(symbol, qty)
            self.state.record_trade()
            logger.info("Sold %s x%.6f on crossover-down signal", symbol, qty)


def main() -> None:
    setup_logging()
    config = load_config()
    bot = TradingBot(config)
    bot.run_forever()


if __name__ == "__main__":
    main()
