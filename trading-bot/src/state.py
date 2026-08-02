from __future__ import annotations

import json
from dataclasses import asdict, dataclass
from datetime import date
from pathlib import Path

STATE_PATH = Path(__file__).resolve().parent.parent / "state" / "daily_state.json"


@dataclass
class DailyState:
    trading_day: str
    realized_pnl_usd: float = 0.0
    trades_placed: int = 0
    kill_switch_tripped: bool = False

    @classmethod
    def for_today(cls) -> "DailyState":
        return cls(trading_day=date.today().isoformat())


class StateStore:
    """Persists the current trading day's counters to disk so a restart mid-day
    (crash, redeploy, host reboot) doesn't reset risk limits back to zero."""

    def __init__(self, path: Path = STATE_PATH):
        self.path = path
        self.path.parent.mkdir(exist_ok=True)
        self.state = self._load()

    def _load(self) -> DailyState:
        if self.path.exists():
            data = json.loads(self.path.read_text())
            state = DailyState(**data)
            if state.trading_day == date.today().isoformat():
                return state
        return DailyState.for_today()

    def save(self) -> None:
        self.path.write_text(json.dumps(asdict(self.state), indent=2))

    def record_trade(self, realized_pnl_delta: float = 0.0) -> None:
        self.state.trades_placed += 1
        self.state.realized_pnl_usd += realized_pnl_delta
        self.save()

    def record_pnl(self, realized_pnl_delta: float) -> None:
        self.state.realized_pnl_usd += realized_pnl_delta
        self.save()

    def trip_kill_switch(self) -> None:
        self.state.kill_switch_tripped = True
        self.save()
