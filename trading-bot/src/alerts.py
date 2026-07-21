from __future__ import annotations

import logging

import requests

logger = logging.getLogger("trading_bot.alerts")


class Alerter:
    """Best-effort webhook notifier. Never raises — a broken webhook must not
    take down the trading loop."""

    def __init__(self, webhook_url: str | None):
        self.webhook_url = webhook_url

    def send(self, message: str) -> None:
        logger.info("ALERT: %s", message)
        if not self.webhook_url:
            return
        try:
            requests.post(self.webhook_url, json={"text": message}, timeout=10)
        except Exception:
            logger.exception("Failed to deliver alert webhook")
