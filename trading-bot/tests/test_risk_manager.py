import pytest

from src.config import RiskConfig
from src.risk_manager import RiskManager
from src.state import DailyState, StateStore

RISK_CONFIG = RiskConfig(
    max_daily_loss_pct_equity=0.02,
    max_position_pct_equity=0.10,
    max_concurrent_positions=5,
    max_trades_per_day=20,
    kill_switch_daily_loss_pct_equity=0.025,
)


@pytest.fixture
def state_store(tmp_path):
    store = StateStore(path=tmp_path / "state.json")
    store.state = DailyState.for_today()
    return store


def test_approve_entry_happy_path(state_store):
    risk = RiskManager(RISK_CONFIG, state_store)
    approved, _ = risk.approve_entry("BTCUSDT", equity=10_000, open_position_count=0,
                                      proposed_dollar_amount=500)
    assert approved


def test_reject_when_kill_switch_tripped(state_store):
    state_store.trip_kill_switch()
    risk = RiskManager(RISK_CONFIG, state_store)
    approved, reason = risk.approve_entry("BTCUSDT", equity=10_000, open_position_count=0,
                                           proposed_dollar_amount=500)
    assert not approved
    assert "kill switch" in reason


def test_reject_when_daily_loss_limit_hit(state_store):
    state_store.state.realized_pnl_usd = -200
    risk = RiskManager(RISK_CONFIG, state_store)
    approved, reason = risk.approve_entry("BTCUSDT", equity=10_000, open_position_count=0,
                                           proposed_dollar_amount=500)
    assert not approved
    assert "daily loss" in reason


def test_reject_when_max_trades_hit(state_store):
    state_store.state.trades_placed = 20
    risk = RiskManager(RISK_CONFIG, state_store)
    approved, reason = risk.approve_entry("BTCUSDT", equity=10_000, open_position_count=0,
                                           proposed_dollar_amount=500)
    assert not approved
    assert "trades per day" in reason


def test_reject_when_max_positions_hit(state_store):
    risk = RiskManager(RISK_CONFIG, state_store)
    approved, reason = risk.approve_entry("BTCUSDT", equity=10_000, open_position_count=5,
                                           proposed_dollar_amount=500)
    assert not approved
    assert "concurrent positions" in reason


def test_reject_when_position_too_large(state_store):
    risk = RiskManager(RISK_CONFIG, state_store)
    approved, reason = risk.approve_entry("BTCUSDT", equity=10_000, open_position_count=0,
                                           proposed_dollar_amount=5000)
    assert not approved
    assert "exceeds max" in reason


def test_kill_switch_trips_on_breach(state_store):
    risk = RiskManager(RISK_CONFIG, state_store)
    state_store.state.realized_pnl_usd = -250
    assert risk.check_daily_loss(equity=10_000) is True
    assert risk.kill_switch_tripped is True


def test_kill_switch_not_tripped_above_limit(state_store):
    risk = RiskManager(RISK_CONFIG, state_store)
    state_store.state.realized_pnl_usd = -100
    assert risk.check_daily_loss(equity=10_000) is False
    assert risk.kill_switch_tripped is False


def test_daily_loss_limit_scales_with_equity(state_store):
    # $250 loss is under the 2% limit on $20k equity but breaches it on $10k.
    risk = RiskManager(RISK_CONFIG, state_store)
    state_store.state.realized_pnl_usd = -250
    assert risk.check_daily_loss(equity=20_000) is False
    assert risk.check_daily_loss(equity=10_000) is True


def test_position_size_dollars(state_store):
    risk = RiskManager(RISK_CONFIG, state_store)
    assert risk.position_size_dollars(10_000) == 1_000
