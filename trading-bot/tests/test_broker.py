from decimal import Decimal
from unittest.mock import MagicMock, patch

from src.broker import Broker
from src.config import Config, RiskConfig, ScheduleConfig, StrategyConfig

CONFIG = Config(
    watchlist=["BTCUSDT"],
    strategy=StrategyConfig(9, 21, 5, 14, 1.5, 3.0),
    risk=RiskConfig(0.02, 0.10, 5, 20, 0.025),
    schedule=ScheduleConfig(60),
    api_key="test-key",
    secret_key="test-secret",
    testnet=True,
    alert_webhook_url=None,
)


def _mock_symbol_info():
    return {
        "filters": [
            {"filterType": "LOT_SIZE", "stepSize": "0.00010000", "minQty": "0.00010000"},
        ]
    }


@patch("src.broker.Client")
def test_submit_notional_buy_sends_quote_order_qty(mock_client_cls):
    mock_client = MagicMock()
    mock_client_cls.return_value = mock_client

    broker = Broker(CONFIG)
    broker.submit_notional_buy("BTCUSDT", 123.456)

    mock_client.order_market_buy.assert_called_once_with(
        symbol="BTCUSDT", quoteOrderQty=123.46
    )


@patch("src.broker.Client")
def test_submit_market_sell_rounds_to_lot_size(mock_client_cls):
    mock_client = MagicMock()
    mock_client.get_symbol_info.return_value = _mock_symbol_info()
    mock_client_cls.return_value = mock_client

    broker = Broker(CONFIG)
    broker.submit_market_sell("BTCUSDT", 0.123456)

    mock_client.order_market_sell.assert_called_once_with(symbol="BTCUSDT", quantity=0.1234)


@patch("src.broker.Client")
def test_submit_market_sell_skips_dust_below_step(mock_client_cls):
    mock_client = MagicMock()
    mock_client.get_symbol_info.return_value = _mock_symbol_info()
    mock_client_cls.return_value = mock_client

    broker = Broker(CONFIG)
    broker.submit_market_sell("BTCUSDT", 0.00001)

    mock_client.order_market_sell.assert_not_called()


@patch("src.broker.Client")
def test_get_quote_balance_reads_usdt_free(mock_client_cls):
    mock_client = MagicMock()
    mock_client.get_asset_balance.return_value = {"asset": "USDT", "free": "500.25", "locked": "0"}
    mock_client_cls.return_value = mock_client

    broker = Broker(CONFIG)
    assert broker.get_quote_balance() == 500.25
    mock_client.get_asset_balance.assert_called_once_with(asset="USDT")


@patch("src.broker.Client")
def test_get_positions_filters_by_min_qty(mock_client_cls):
    mock_client = MagicMock()
    mock_client.get_symbol_info.return_value = _mock_symbol_info()
    mock_client.get_account.return_value = {
        "balances": [
            {"asset": "BTC", "free": "0.05", "locked": "0"},
            {"asset": "USDT", "free": "1000", "locked": "0"},
        ]
    }
    mock_client_cls.return_value = mock_client

    broker = Broker(CONFIG)
    positions = broker.get_positions()
    assert positions == {"BTCUSDT": 0.05}


@patch("src.broker.Client")
def test_get_positions_excludes_dust_below_min_qty(mock_client_cls):
    mock_client = MagicMock()
    mock_client.get_symbol_info.return_value = _mock_symbol_info()
    mock_client.get_account.return_value = {
        "balances": [
            {"asset": "BTC", "free": "0.00000001", "locked": "0"},
            {"asset": "USDT", "free": "1000", "locked": "0"},
        ]
    }
    mock_client_cls.return_value = mock_client

    broker = Broker(CONFIG)
    assert broker.get_positions() == {}
