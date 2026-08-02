from __future__ import annotations

import logging
from decimal import ROUND_DOWN, Decimal

import pandas as pd
from binance.client import Client
from tenacity import retry, stop_after_attempt, wait_exponential

from .config import Config

logger = logging.getLogger("trading_bot.broker")

QUOTE_ASSET = "USDT"

_RETRY = dict(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=1, max=10),
    reraise=True,
)

_INTERVAL_MAP = {
    1: Client.KLINE_INTERVAL_1MINUTE,
    3: Client.KLINE_INTERVAL_3MINUTE,
    5: Client.KLINE_INTERVAL_5MINUTE,
    15: Client.KLINE_INTERVAL_15MINUTE,
    30: Client.KLINE_INTERVAL_30MINUTE,
    60: Client.KLINE_INTERVAL_1HOUR,
    240: Client.KLINE_INTERVAL_4HOUR,
    1440: Client.KLINE_INTERVAL_1DAY,
}


def _base_asset(symbol: str) -> str:
    if not symbol.endswith(QUOTE_ASSET):
        raise ValueError(f"{symbol} is not a {QUOTE_ASSET} pair")
    return symbol[: -len(QUOTE_ASSET)]


class Broker:
    """Thin wrapper around the Binance spot API. All network calls are
    retried with backoff; nothing here decides *whether* to trade — that's
    risk_manager. Every symbol is assumed to be quoted in USDT."""

    def __init__(self, config: Config):
        self.config = config
        self.client = Client(config.api_key, config.secret_key, testnet=config.testnet)
        self._lot_size_cache: dict[str, dict] = {}

    @retry(**_RETRY)
    def _symbol_filters(self, symbol: str) -> dict:
        if symbol not in self._lot_size_cache:
            info = self.client.get_symbol_info(symbol)
            filters = {f["filterType"]: f for f in info["filters"]}
            self._lot_size_cache[symbol] = {
                "step_size": Decimal(filters["LOT_SIZE"]["stepSize"]),
                "min_qty": Decimal(filters["LOT_SIZE"]["minQty"]),
            }
        return self._lot_size_cache[symbol]

    def _round_qty(self, symbol: str, qty: float) -> float:
        step = self._symbol_filters(symbol)["step_size"]
        rounded = (Decimal(str(qty)) // step) * step
        return float(rounded.quantize(step, rounding=ROUND_DOWN))

    @retry(**_RETRY)
    def get_quote_balance(self) -> float:
        balance = self.client.get_asset_balance(asset=QUOTE_ASSET)
        return float(balance["free"]) if balance else 0.0

    @retry(**_RETRY)
    def get_positions(self) -> dict[str, float]:
        """Returns {symbol: free_qty} for every watchlist symbol currently held
        above that symbol's minimum tradeable quantity."""
        account = self.client.get_account()
        balances = {b["asset"]: float(b["free"]) for b in account["balances"]}
        positions = {}
        for symbol in self.config.watchlist:
            base = _base_asset(symbol)
            qty = balances.get(base, 0.0)
            min_qty = float(self._symbol_filters(symbol)["min_qty"])
            if qty >= min_qty:
                positions[symbol] = qty
        return positions

    @retry(**_RETRY)
    def get_bars(self, symbol: str, timeframe_minutes: int, limit: int) -> pd.DataFrame:
        interval = _INTERVAL_MAP.get(timeframe_minutes)
        if interval is None:
            raise ValueError(
                f"Unsupported bar_timeframe_minutes={timeframe_minutes}. "
                f"Supported: {sorted(_INTERVAL_MAP)}"
            )
        klines = self.client.get_klines(symbol=symbol, interval=interval, limit=limit)
        if not klines:
            return pd.DataFrame()
        df = pd.DataFrame(
            klines,
            columns=[
                "open_time", "open", "high", "low", "close", "volume",
                "close_time", "quote_asset_volume", "num_trades",
                "taker_buy_base", "taker_buy_quote", "ignore",
            ],
        )
        for col in ("open", "high", "low", "close", "volume"):
            df[col] = df[col].astype(float)
        return df

    @retry(**_RETRY)
    def submit_notional_buy(self, symbol: str, notional_usdt: float):
        """Buy a fixed USDT amount rather than a base-asset quantity. Keeps the
        actual fill within the risk manager's approved dollar cap even if
        price moves between signal and fill."""
        logger.info("Submitting BUY %s: $%.2f notional", symbol, notional_usdt)
        return self.client.order_market_buy(
            symbol=symbol, quoteOrderQty=round(notional_usdt, 2)
        )

    @retry(**_RETRY)
    def submit_market_sell(self, symbol: str, qty: float):
        # Selling must be qty-based: we're closing a specific position, and
        # the qty comes from the broker's own balance record. Binance rejects
        # quantities that don't align to the symbol's lot-size step.
        rounded_qty = self._round_qty(symbol, qty)
        if rounded_qty <= 0:
            logger.warning("Sell qty for %s rounds to 0 after lot-size step, skipping", symbol)
            return None
        logger.info("Submitting SELL %s x%s", symbol, rounded_qty)
        return self.client.order_market_sell(symbol=symbol, quantity=rounded_qty)

    @retry(**_RETRY)
    def cancel_all_orders(self) -> None:
        for symbol in self.config.watchlist:
            open_orders = self.client.get_open_orders(symbol=symbol)
            for order in open_orders:
                self.client.cancel_order(symbol=symbol, orderId=order["orderId"])

    @retry(**_RETRY)
    def get_open_orders(self):
        orders = []
        for symbol in self.config.watchlist:
            orders.extend(self.client.get_open_orders(symbol=symbol))
        return orders

    @retry(**_RETRY)
    def close_all_positions(self) -> None:
        logger.warning("Liquidating all open positions")
        self.cancel_all_orders()
        for symbol, qty in self.get_positions().items():
            self.submit_market_sell(symbol, qty)
