from __future__ import annotations

import logging

import pandas as pd
from alpaca.data.historical import StockHistoricalDataClient
from alpaca.data.requests import StockBarsRequest
from alpaca.data.timeframe import TimeFrame
from alpaca.trading.client import TradingClient
from alpaca.trading.enums import OrderSide, TimeInForce
from alpaca.trading.requests import GetOrdersRequest, MarketOrderRequest
from tenacity import retry, stop_after_attempt, wait_exponential

from .config import Config

logger = logging.getLogger("trading_bot.broker")

_RETRY = dict(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=1, max=10),
    reraise=True,
)


class Broker:
    """Thin wrapper around the Alpaca SDK. All network calls are retried with
    backoff; nothing here decides *whether* to trade — that's risk_manager."""

    def __init__(self, config: Config):
        self.config = config
        self.trading = TradingClient(
            config.api_key, config.secret_key, paper=config.paper
        )
        self.data = StockHistoricalDataClient(config.api_key, config.secret_key)

    @retry(**_RETRY)
    def get_account(self):
        return self.trading.get_account()

    @retry(**_RETRY)
    def get_positions(self):
        return self.trading.get_all_positions()

    @retry(**_RETRY)
    def is_market_open(self) -> bool:
        return self.trading.get_clock().is_open

    @retry(**_RETRY)
    def minutes_to_close(self) -> float:
        clock = self.trading.get_clock()
        if not clock.is_open:
            return 0.0
        return (clock.next_close - clock.timestamp).total_seconds() / 60.0

    @retry(**_RETRY)
    def get_bars(self, symbol: str, timeframe_minutes: int, limit: int) -> pd.DataFrame:
        request = StockBarsRequest(
            symbol_or_symbols=symbol,
            timeframe=TimeFrame(timeframe_minutes, TimeFrame.Minute.unit),
            limit=limit,
        )
        bars = self.data.get_stock_bars(request)
        df = bars.df
        if df.empty:
            return df
        return df.xs(symbol, level="symbol") if "symbol" in df.index.names else df

    @retry(**_RETRY)
    def submit_notional_buy(self, symbol: str, notional_usd: float):
        """Buy a fixed dollar amount rather than a share quantity. This keeps
        the actual fill within the risk manager's approved dollar cap even if
        price moves between signal and fill, and works for both fractionable
        and whole-share-only symbols."""
        order = MarketOrderRequest(
            symbol=symbol,
            notional=round(notional_usd, 2),
            side=OrderSide.BUY,
            time_in_force=TimeInForce.DAY,
        )
        logger.info("Submitting BUY %s: $%.2f notional", symbol, notional_usd)
        return self.trading.submit_order(order)

    @retry(**_RETRY)
    def submit_market_sell(self, symbol: str, qty: float):
        # Selling must be qty-based: we're closing a specific position, and
        # the qty comes from the broker's own position record.
        order = MarketOrderRequest(
            symbol=symbol,
            qty=qty,
            side=OrderSide.SELL,
            time_in_force=TimeInForce.DAY,
        )
        logger.info("Submitting SELL %s x%s", symbol, qty)
        return self.trading.submit_order(order)

    @retry(**_RETRY)
    def cancel_all_orders(self) -> None:
        self.trading.cancel_orders()

    @retry(**_RETRY)
    def get_open_orders(self):
        return self.trading.get_orders(GetOrdersRequest(status="open"))

    @retry(**_RETRY)
    def close_all_positions(self) -> None:
        logger.warning("Liquidating all open positions")
        self.trading.close_all_positions(cancel_orders=True)
