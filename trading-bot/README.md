# Day Trading Bot

An unattended day-trading bot for US equities via [Alpaca](https://alpaca.markets),
built to run continuously without you opening or touching it.

**Read this before you connect real money.** No trading system — this one
included — can guarantee profit or promise zero bugs. Markets are adversarial
and every strategy can lose money, including on days it "should" have worked.
What this bot *does* guarantee is that losses are bounded: every order passes
through a risk manager that enforces hard dollar limits, and a kill switch
liquidates everything and halts trading the moment your configured daily loss
limit is hit. Start in paper mode. Only move to live trading once you've
watched it behave correctly for several full trading days, and only fund it
with an amount you are fully prepared to lose.

## How it works

- **Strategy** (`src/strategy.py`): EMA(9/21) crossover on 5-minute bars,
  ATR-based stop-loss/take-profit. Simple and back-testable on purpose —
  simple strategies are far easier to verify than complex ones.
- **Risk manager** (`src/risk_manager.py`): the only path to placing an order.
  Enforces max position size (% of equity), max concurrent positions, max
  trades/day, and max daily loss. Every check is config-driven in
  `config.yaml`.
- **Kill switch**: if realized P&L for the day drops to `kill_switch_daily_loss_usd`,
  the bot cancels all open orders, liquidates all positions, and refuses new
  entries for the rest of the day. It resets automatically the next trading day.
- **State** (`src/state.py`): today's P&L/trade count is persisted to
  `state/daily_state.json`, so a crash or redeploy mid-day doesn't reset your
  risk limits back to zero.
- **Main loop** (`src/main.py`): polls once a minute (configurable), only
  acts during market hours, flattens all positions automatically before the
  close, and never crashes the process on a single bad tick — errors are
  logged, alerted, and the loop keeps going.

## Setup

1. Create an [Alpaca](https://alpaca.markets) account. You get a paper
   trading account immediately; live trading requires identity verification
   and funding.
2. Grab your API key/secret from the Alpaca dashboard (paper and live keys
   are separate).
3. `cp .env.example .env` and fill in `ALPACA_API_KEY` / `ALPACA_SECRET_KEY`.
   Leave `ALPACA_PAPER=true`.
4. (Optional) Set `ALERT_WEBHOOK_URL` to a Slack or Discord incoming webhook
   so the bot can message you about the kill switch, crashes, and daily
   summaries without you having to check on it.
5. Review `config.yaml` — especially `risk.max_daily_loss_usd` and
   `risk.kill_switch_daily_loss_usd`. These are your real budget. Defaults
   are conservative ($200/$250); lower them if you want less exposure.

## Running locally

```bash
./scripts/run.sh
```

## Running unattended (pick one)

### Docker (recommended — auto-restarts on crash or host reboot)

```bash
docker compose up -d --build
docker compose logs -f
```

### systemd (bare-metal Linux host)

```bash
sudo useradd --system --home /opt/trading-bot trading-bot
sudo cp -r . /opt/trading-bot
sudo chown -R trading-bot:trading-bot /opt/trading-bot
cd /opt/trading-bot && sudo -u trading-bot python3 -m venv .venv \
  && sudo -u trading-bot .venv/bin/pip install -r requirements.txt
sudo cp deploy/systemd/trading-bot.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now trading-bot
```

Either way, `Restart=always` / `restart: always` means it comes back up on
its own after a crash, an out-of-memory kill, or a host reboot — you should
not need to touch it day to day.

## Going live

1. Run in paper mode for at least a week of real trading days and read the
   logs / daily summaries.
2. Generate a **live** API key/secret in the Alpaca dashboard.
3. Update `.env`: new `ALPACA_API_KEY`/`ALPACA_SECRET_KEY`, set
   `ALPACA_PAPER=false`.
4. Fund the live account with only the amount you're comfortable risking —
   the bot's `max_daily_loss_usd` limit only bounds losses if the account
   itself doesn't hold more than you can afford to lose.
5. Restart the service/container.

## Verify it against your real paper account before leaving it unattended

Unit tests prove the strategy/risk logic is correct in isolation; they don't
prove your credentials work or that Alpaca's API responds the way the code
expects. After filling in `.env`, run:

```bash
.venv/bin/python scripts/smoke_test.py
```

This hits your real paper account (refuses to run if `ALPACA_PAPER=false`)
and checks credentials, account/positions/clock/market-data endpoints, and a
live signal computation — **it places no orders**. Fix anything it reports
before starting the bot unattended.

## Tests

```bash
.venv/bin/pip install -r requirements.txt
.venv/bin/python -m pytest tests/ -v
```

The strategy and risk manager are pure functions with no network dependency,
so the full test suite runs offline in under a second.

## Watching it without opening it

- `logs/trading_bot.log` (rotated automatically) has full detail.
- If `ALERT_WEBHOOK_URL` is set, you get a message on startup, on kill-switch
  trips, on unhandled errors, and a daily P&L summary after market close —
  that's the intended way to keep an eye on it without logging in.
