from unittest.mock import MagicMock, patch

from src.broker import Broker
from src.config import Config, RiskConfig, ScheduleConfig, StrategyConfig

CONFIG = Config(
    watchlist=["AAPL"],
    strategy=StrategyConfig(9, 21, 5, 14, 1.5, 3.0),
    risk=RiskConfig(200, 0.10, 5, 20, 250),
    schedule=ScheduleConfig(15, 60),
    api_key="test-key",
    secret_key="test-secret",
    paper=True,
    alert_webhook_url=None,
)


@patch("src.broker.StockHistoricalDataClient")
@patch("src.broker.TradingClient")
def test_submit_notional_buy_sends_dollar_amount_not_qty(mock_trading_cls, mock_data_cls):
    mock_trading = MagicMock()
    mock_trading_cls.return_value = mock_trading

    broker = Broker(CONFIG)
    broker.submit_notional_buy("AAPL", 123.45)

    submitted_order = mock_trading.submit_order.call_args[0][0]
    assert submitted_order.notional == 123.45
    assert submitted_order.qty is None
    assert submitted_order.side.value == "buy"


@patch("src.broker.StockHistoricalDataClient")
@patch("src.broker.TradingClient")
def test_submit_market_sell_sends_qty_not_notional(mock_trading_cls, mock_data_cls):
    mock_trading = MagicMock()
    mock_trading_cls.return_value = mock_trading

    broker = Broker(CONFIG)
    broker.submit_market_sell("AAPL", 3.5)

    submitted_order = mock_trading.submit_order.call_args[0][0]
    assert submitted_order.qty == 3.5
    assert submitted_order.notional is None
    assert submitted_order.side.value == "sell"


@patch("src.broker.StockHistoricalDataClient")
@patch("src.broker.TradingClient")
def test_is_market_open_reflects_clock(mock_trading_cls, mock_data_cls):
    mock_trading = MagicMock()
    mock_trading.get_clock.return_value = MagicMock(is_open=True)
    mock_trading_cls.return_value = mock_trading

    broker = Broker(CONFIG)
    assert broker.is_market_open() is True
