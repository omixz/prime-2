from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path

import yaml
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent.parent


@dataclass(frozen=True)
class StrategyConfig:
    fast_ema: int
    slow_ema: int
    bar_timeframe_minutes: int
    atr_period: int
    stop_loss_atr_multiple: float
    take_profit_atr_multiple: float


@dataclass(frozen=True)
class RiskConfig:
    max_daily_loss_usd: float
    max_position_pct_equity: float
    max_concurrent_positions: int
    max_trades_per_day: int
    kill_switch_daily_loss_usd: float


@dataclass(frozen=True)
class ScheduleConfig:
    flatten_before_close_minutes: int
    poll_interval_seconds: int


@dataclass(frozen=True)
class Config:
    watchlist: list[str]
    strategy: StrategyConfig
    risk: RiskConfig
    schedule: ScheduleConfig
    api_key: str
    secret_key: str
    paper: bool
    alert_webhook_url: str | None


def load_config(config_path: Path | None = None) -> Config:
    load_dotenv(ROOT / ".env")

    path = config_path or ROOT / "config.yaml"
    with open(path) as f:
        raw = yaml.safe_load(f)

    api_key = os.environ.get("ALPACA_API_KEY", "")
    secret_key = os.environ.get("ALPACA_SECRET_KEY", "")
    if not api_key or not secret_key:
        raise RuntimeError(
            "ALPACA_API_KEY / ALPACA_SECRET_KEY are not set. Copy .env.example to "
            ".env and fill them in before starting the bot."
        )

    return Config(
        watchlist=raw["watchlist"],
        strategy=StrategyConfig(**raw["strategy"]),
        risk=RiskConfig(**raw["risk"]),
        schedule=ScheduleConfig(**raw["schedule"]),
        api_key=api_key,
        secret_key=secret_key,
        paper=os.environ.get("ALPACA_PAPER", "true").strip().lower() != "false",
        alert_webhook_url=os.environ.get("ALERT_WEBHOOK_URL") or None,
    )
