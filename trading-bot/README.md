# Day Trading Bot

An unattended crypto day-trading bot on [Binance](https://www.binance.com) spot
markets, built to run continuously without you opening or touching it.

**Read this before you connect real money.** No trading system — this one
included — can guarantee profit or promise zero bugs. Crypto markets are
adversarial and more volatile than stocks; every strategy can lose money,
including on days it "should" have worked. What this bot *does* guarantee is
that losses are bounded: every order passes through a risk manager that
enforces hard limits as a fraction of your account equity, and a kill switch
liquidates everything and halts trading the moment your configured daily loss
limit is hit. Start on testnet. Only move to live trading once you've watched
it behave correctly for several full days, and only fund it with an amount
you are fully prepared to lose.

## Why Binance

Binance was chosen specifically because its **Intermediate** verification
tier needs only a government photo ID (a passport is enough) — no separate
proof-of-address document, which most other regulated brokers require. Its
spot API is fully available to Australian residents (only leveraged
derivatives/futures are restricted there, which this bot doesn't use).

## How it works

- **Strategy** (`src/strategy.py`): EMA(9/21) crossover on 5-minute bars,
  ATR-based stop-loss/take-profit. Simple and back-testable on purpose —
  simple strategies are far easier to verify than complex ones. Crypto is
  noisier than large-cap stocks, so watch the logs and retune if you see
  excessive whipsawing.
- **Risk manager** (`src/risk_manager.py`): the only path to placing an order.
  Enforces max position size (% of equity), max concurrent positions, max
  trades/day, and max daily loss (% of equity). Every check is config-driven
  in `config.yaml`.
- **Kill switch**: if realized P&L for the day drops to
  `kill_switch_daily_loss_pct_equity`, the bot cancels all open orders,
  liquidates all positions back to USDT, and refuses new entries for the
  rest of the day. It resets automatically at the next UTC day boundary.
- **State** (`src/state.py`): today's P&L/trade count is persisted to
  `state/daily_state.json`, so a crash or redeploy mid-day doesn't reset your
  risk limits back to zero.
- **Main loop** (`src/main.py`): polls once a minute (configurable). Crypto
  markets never close, so the bot just runs continuously — there's no
  market-hours check or end-of-day flatten, unlike a stock-market bot. It
  never crashes the process on a single bad tick — errors are logged,
  alerted, and the loop keeps going.
- All symbols trade against **USDT** (far better liquidity on Binance than
  AUD pairs) — deposit AUD, convert to USDT once, and the bot only ever
  trades USDT pairs from there.

## Setup

1. Create a [Binance](https://www.binance.com) account and complete
   **Intermediate** verification (Account → Verification): passport as
   government ID, plus a selfie. No proof-of-address document is required at
   this tier.
2. For testing: get free testnet API keys by logging into
   [testnet.binance.vision](https://testnet.binance.vision) with GitHub —
   this gives you a fake-funds account against real market data.
3. `cp .env.example .env` and fill in `BINANCE_API_KEY` / `BINANCE_API_SECRET`
   with your testnet keys. Leave `BINANCE_TESTNET=true`.
4. (Optional) Set `ALERT_WEBHOOK_URL` to a Slack or Discord incoming webhook
   so the bot can message you about the kill switch, crashes, and daily
   summaries without you having to check on it.
5. Review `config.yaml` — especially `risk.max_daily_loss_pct_equity` and
   `risk.kill_switch_daily_loss_pct_equity`. These are fractions of your
   *current* account equity, so they auto-scale with deposits/withdrawals
   instead of needing to be updated by hand. Defaults are conservative
   (1.5% / 2.5%) and deliberately tighter than a stock-only bot, since crypto
   is more volatile.

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

1. Run on testnet for at least a week of real days and read the logs / daily
   summaries.
2. Generate a **live** API key/secret in the Binance dashboard
   (Account → API Management). Restrict the key to spot trading only, and to
   your server's IP if possible — never enable withdrawal permissions on a
   bot's API key.
3. Update `.env`: new `BINANCE_API_KEY`/`BINANCE_API_SECRET`, set
   `BINANCE_TESTNET=false`.
4. Deposit AUD, convert to USDT, and only fund the account with an amount
   you're comfortable risking — the bot's `max_daily_loss_pct_equity` limit
   only bounds losses if the account itself doesn't hold more than you can
   afford to lose.
5. Restart the service/container.

## Verify it against your real testnet account before leaving it unattended

Unit tests prove the strategy/risk logic is correct in isolation; they don't
prove your credentials work or that Binance's API responds the way the code
expects. After filling in `.env`, run:

```bash
.venv/bin/python scripts/smoke_test.py
```

This hits your real testnet account (refuses to run if `BINANCE_TESTNET=false`)
and checks credentials, balance/positions/market-data endpoints, and a live
signal computation — **it places no orders**. Fix anything it reports before
starting the bot unattended.

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
  trips, on unhandled errors, and a daily P&L summary at each UTC day
  rollover — that's the intended way to keep an eye on it without logging in.
