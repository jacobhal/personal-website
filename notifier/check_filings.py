#!/usr/bin/env python3
"""Poll the US House Clerk financial-disclosure index for new PTR filings by the
people in watchlist.json, parse each new filing's PDF for the actual trades,
push an ntfy notification, and write notifier/filings.json (consumed by the
website page).

Stdlib only for the pure logic; pdfplumber is used at runtime for PDF parsing.
"""
import datetime as _dt
import json
import os
import time
import urllib.request
import xml.etree.ElementTree as ET

import aggregate
import prices
import ptr_parser

# Only push a per-filing alert when the filing is at most this many days old, so
# adding members to the watchlist backfills history without a notification flood.
RECENT_DAYS = 7
# Disclosure lag (trades surface up to ~45 days late, in batches) means a
# year-long view is the right grain for "conviction names", while the
# leaderboard's "what's being accumulated lately" reads better over ~6 months.
CONSENSUS_WINDOW_DAYS = 365
LEADERBOARD_WINDOW_DAYS = 180
# The page shows every 2+ member overlap; only 3+ member overlaps are loud
# enough to ping the phone, so a larger roster doesn't bury the signal.
CONSENSUS_ALERT_MIN_MEMBERS = 3
# Price "% since the trade" context (Twelve Data). Only recent buys are priced,
# and at most a few tickers are fetched per run to respect the free 8/min limit.
PRICE_LOOKBACK_DAYS = 200
# Twelve Data free tier: 8 requests/min, 800/day. Fetch newest-buy tickers first
# and pace requests so we can do more per run without tripping the rate limit.
MAX_PRICE_FETCH = 24
PRICE_SLEEP_SECONDS = 8

HOUSE_INDEX_URL = "https://disclosures-clerk.house.gov/public_disc/financial-pdfs/{year}FD.xml"
PTR_PDF_URL = "https://disclosures-clerk.house.gov/public_disc/ptr-pdfs/{year}/{doc_id}.pdf"
OTHER_PDF_URL = "https://disclosures-clerk.house.gov/public_disc/financial-pdfs/{year}/{doc_id}.pdf"
_UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
       "(KHTML, like Gecko) Chrome/124.0 Safari/537.36")
TRADES_VERSION = 1

HERE = os.path.dirname(os.path.abspath(__file__))


# --------------------------------------------------------------------------- #
# Pure functions (unit-tested)
# --------------------------------------------------------------------------- #
def parse_filings(xml_bytes):
    """Parse a House Clerk {year}FD.xml index into a list of filing dicts."""
    root = ET.fromstring(xml_bytes)
    out = []
    for m in root.findall(".//Member"):
        def t(tag):
            v = m.findtext(tag)
            return v.strip() if v else ""
        out.append({
            "last": t("Last"),
            "first": t("First"),
            "filing_type": t("FilingType"),
            "state_dst": t("StateDst"),
            "year": t("Year"),
            "filing_date": t("FilingDate"),
            "doc_id": t("DocID"),
        })
    return out


def select_watched(filings, watchlist, filing_types=("P",)):
    """Keep filings whose name matches a watchlist entry and whose FilingType is
    in filing_types (default PTRs only). Name matching is case-insensitive;
    `first` in a watchlist entry is optional."""
    wanted = []
    for w in watchlist:
        last = (w.get("last") or "").strip().lower()
        first = (w.get("first") or "").strip().lower()
        wanted.append((last, first))

    def matches(f):
        if filing_types and f["filing_type"] not in filing_types:
            return False
        fl, ff = f["last"].lower(), f["first"].lower()
        for last, first in wanted:
            if last and fl == last and (not first or ff == first):
                return True
        return False

    return [f for f in filings if matches(f)]


def new_filings(filings, seen_ids):
    """Filings whose doc_id is not already in seen_ids."""
    return [f for f in filings if f["doc_id"] not in seen_ids]


def pdf_url(filing):
    """Public PDF URL for a filing. PTRs ('P') live under ptr-pdfs/."""
    if filing["filing_type"] == "P":
        return PTR_PDF_URL.format(year=filing["year"], doc_id=filing["doc_id"])
    return OTHER_PDF_URL.format(year=filing["year"], doc_id=filing["doc_id"])


def to_iso(us_date):
    """'3/21/2024' -> '2024-03-21'. Returns the input unchanged if unparseable."""
    try:
        return _dt.datetime.strptime(us_date, "%m/%d/%Y").strftime("%Y-%m-%d")
    except (ValueError, TypeError):
        return us_date


def full_name(filing):
    return " ".join(p for p in (filing["first"], filing["last"]) if p).strip()


def age_days(iso_date):
    """Whole days between an ISO date and today (UTC). None if unparseable."""
    try:
        d = _dt.datetime.strptime(iso_date, "%Y-%m-%d").date()
        return (_dt.datetime.utcnow().date() - d).days
    except (ValueError, TypeError):
        return None


def _money(v):
    if v is None:
        return "?"
    def short(value, suffix, divisor):
        n = "{:.1f}".format(value / divisor).rstrip("0").rstrip(".")
        return "${}{}".format(n, suffix)
    if v >= 1_000_000:
        return short(v, "M", 1_000_000)
    if v >= 1_000:
        return short(v, "K", 1_000)
    return "${}".format(v)


def format_trade_line(t):
    """One scannable line for a parsed trade, used in the push body."""
    mark = "🟢" if t["side"] == "buy" else "🔴"
    verb = "BUY" if t["side"] == "buy" else "SELL"
    sym = t["ticker"] or (t["asset"][:18] if t.get("asset") else "?")
    opt = " (opt)" if t.get("instrument") == "options" else ""
    parts = [
        "{} {} {}{}".format(mark, verb, sym, opt),
        "{}–{}".format(_money(t.get("amount_low")), _money(t.get("amount_high"))),
    ]
    age = age_days(t.get("txn_date"))
    if age is not None:
        parts.append("{}d ago".format(age))
    pct = t.get("pct_since")
    if pct is not None:
        parts.append("{}{}% since".format("+" if pct >= 0 else "", pct))
    return " · ".join(parts)


def notification_trade_lines(trades, limit=8):
    def sort_key(trade):
        return (
            trade.get("txn_date") or "",
            trade.get("ticker") or "",
            trade.get("asset") or "",
        )

    ordered = sorted(trades, key=sort_key, reverse=True)
    return [format_trade_line(trade) for trade in ordered[:limit]]


# --------------------------------------------------------------------------- #
# Side-effecting runner
# --------------------------------------------------------------------------- #
def _fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": _UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read()


def _load_json(path, default):
    try:
        with open(path) as fh:
            return json.load(fh)
    except (FileNotFoundError, json.JSONDecodeError):
        return default


def _cached_trades_valid(cached):
    return bool(
        cached
        and cached.get("trades") is not None
        and cached.get("trades_version") == TRADES_VERSION
    )


def _trades_for(filing, cache):
    """Parsed trades for a filing, reused from cache when available."""
    cached = cache.get(filing["doc_id"])
    if _cached_trades_valid(cached):
        return cached["trades"]
    try:
        text = ptr_parser.extract_pdf_text(_fetch(pdf_url(filing)))
        return ptr_parser.parse_ptr_text(text)
    except Exception as e:  # noqa: BLE001 - a scanned/odd PDF must not crash the job
        print("  warn: could not parse {}: {}".format(filing["doc_id"], e))
        return []


def _send_ntfy(topic, filing, trades, proven=False):
    who = full_name(filing)
    if trades:
        n = len(trades)
        title = "{} · {} new trade{}".format(who, n, "" if n == 1 else "s")
        body = "\n".join(notification_trade_lines(trades))
    else:
        title = who + " · new filing"
        body = "Tap to open the disclosure PDF."
    # Tags render as emoji before the title; "star" flags a proven performer.
    tags = "star,classical_building" if proven else "classical_building"
    if not topic:
        print("  [dry-run, no NTFY_TOPIC] " + title + "\n    " + body.replace("\n", "\n    "))
        return
    req = urllib.request.Request(
        "https://ntfy.sh/" + topic, data=body.encode("utf-8"), method="POST")
    req.add_header("Title", title)
    req.add_header("Click", pdf_url(filing))
    req.add_header("Tags", tags)
    urllib.request.urlopen(req, timeout=20)
    print("  pushed: " + title)


def _is_recent_filing(filing):
    age = age_days(to_iso(filing["filing_date"]))
    return age is not None and age <= RECENT_DAYS


def _send_consensus_ntfy(topic, row):
    title = "Consensus buy: {} ({} members)".format(row["ticker"], row["member_count"])
    body = "{} tracked members bought {} — latest {}\n{}".format(
        row["member_count"], row["ticker"], row["last_txn_date"],
        ", ".join(row["members"]))
    if not topic:
        print("  [dry-run, no NTFY_CONSENSUS_TOPIC] " + title + " -> " + ", ".join(row["members"]))
        return
    req = urllib.request.Request(
        "https://ntfy.sh/" + topic, data=body.encode("utf-8"), method="POST")
    req.add_header("Title", title)
    req.add_header("Click", "https://www.tradingview.com/symbols/{}/".format(row["ticker"]))
    req.add_header("Tags", "chart_with_upwards_trend")
    urllib.request.urlopen(req, timeout=20)
    print("  pushed consensus: " + title)


def _enrich_prices(watched, trades_by_doc, td_key, cache, today_iso):
    """Attach price_then/price_now/pct_since to recent BUY trades (in place).

    `cache` maps ticker -> {"asof", "current"}; historical closes are not cached
    (price_then is immutable, so it is stored on the trade itself once filled)."""
    if not td_key:
        return

    # Track each recent-buy ticker's most recent buy date, newest first, so the
    # tickers at the top of the Buy-ideas list get priced first.
    latest = {}
    for f in watched:
        for t in trades_by_doc.get(f["doc_id"], []):
            age = age_days(t.get("txn_date"))
            if (t.get("side") == "buy" and t.get("ticker")
                    and age is not None and age <= PRICE_LOOKBACK_DAYS):
                day = t.get("txn_date") or ""
                if day > latest.get(t["ticker"], ""):
                    latest[t["ticker"]] = day
    recent_tickers = sorted(latest, key=lambda tk: latest[tk], reverse=True)

    # Refresh up to MAX_PRICE_FETCH stale tickers this run, paced to respect the
    # 8 requests/minute free limit.
    stale = [tk for tk in recent_tickers if cache.get(tk, {}).get("asof") != today_iso]
    fetched_closes = {}
    for i, tk in enumerate(stale[:MAX_PRICE_FETCH]):
        if i > 0:
            time.sleep(PRICE_SLEEP_SECONDS)
        try:
            closes, current = prices.fetch_series(tk, td_key)
            if current is not None:
                cache[tk] = {"asof": today_iso, "current": current}
            if closes:
                fetched_closes[tk] = closes
        except Exception as e:  # noqa: BLE001 - a price hiccup must not crash the job
            print("  warn: price fetch failed for {}: {}".format(tk, e))

    for f in watched:
        for t in trades_by_doc.get(f["doc_id"], []):
            tk = t.get("ticker")
            if not tk or t.get("side") != "buy" or tk not in recent_tickers:
                continue
            if t.get("price_then") is None and tk in fetched_closes:
                t["price_then"] = prices.close_on_or_before(fetched_closes[tk], t.get("txn_date"))
            now = cache.get(tk, {}).get("current")
            t["price_now"] = now
            t["pct_since"] = prices.pct_change(t.get("price_then"), now)


def run():
    topic = os.environ.get("NTFY_TOPIC", "").strip()
    consensus_topic = os.environ.get("NTFY_CONSENSUS_TOPIC", "").strip()
    watchlist = _load_json(os.path.join(HERE, "watchlist.json"), [])
    proven_keys = {((w.get("last") or "").lower(), (w.get("first") or "").lower())
                   for w in watchlist if w.get("proven")}
    proven_members = sorted(
        "{} {}".format(w.get("first", ""), w.get("last", "")).strip()
        for w in watchlist if w.get("proven"))
    seen = set(_load_json(os.path.join(HERE, "seen.json"), []))
    seen_consensus = set(_load_json(os.path.join(HERE, "seen_consensus.json"), []))
    prev = _load_json(os.path.join(HERE, "filings.json"), {"filings": []})
    cache = {f["doc_id"]: f for f in prev.get("filings", [])}
    td_key = os.environ.get("TWELVE_DATA_KEY", "").strip()
    prices_cache = _load_json(os.path.join(HERE, "prices.json"), {})
    today_iso = _dt.datetime.utcnow().date().isoformat()

    # Current + previous year, so the new-year index gap never hides filings.
    this_year = _dt.datetime.utcnow().year
    all_filings = []
    for year in (this_year, this_year - 1):
        try:
            all_filings += parse_filings(_fetch(HOUSE_INDEX_URL.format(year=year)))
        except Exception as e:  # noqa: BLE001 - a missing/late index must not crash
            print("  warn: could not fetch {} index: {}".format(year, e))

    watched = select_watched(all_filings, watchlist)
    trades_by_doc = {f["doc_id"]: _trades_for(f, cache) for f in watched}
    _enrich_prices(watched, trades_by_doc, td_key, prices_cache, today_iso)
    fresh = new_filings(watched, seen)
    print("watched PTRs: {} | new: {}".format(len(watched), len(fresh)))

    # Per-filing alerts: only for genuinely fresh filings (avoids backlog floods).
    for f in fresh:
        if _is_recent_filing(f):
            is_pv = (f["last"].lower(), f["first"].lower()) in proven_keys
            _send_ntfy(topic, f, trades_by_doc.get(f["doc_id"], []), proven=is_pv)
        seen.add(f["doc_id"])

    page_filings = sorted(
        ({
            "name": full_name(f),
            "last": f["last"],
            "first": f["first"],
            "filing_type": f["filing_type"],
            "filing_date": to_iso(f["filing_date"]),
            "year": f["year"],
            "doc_id": f["doc_id"],
            "pdf_url": pdf_url(f),
            "proven": (f["last"].lower(), f["first"].lower()) in proven_keys,
            "trades": sorted(trades_by_doc.get(f["doc_id"], []),
                             key=lambda t: t.get("txn_date") or "", reverse=True),
            "trades_version": TRADES_VERSION,
        } for f in watched),
        key=lambda r: r["filing_date"], reverse=True,
    )

    consensus = aggregate.compute_consensus(page_filings, today_iso, CONSENSUS_WINDOW_DAYS)
    leaderboard = aggregate.compute_leaderboard(page_filings, today_iso, LEADERBOARD_WINDOW_DAYS)
    stocks = aggregate.compute_ticker_activity(page_filings)
    print("consensus tickers: {} | leaderboard: {} | stocks: {}".format(
        len(consensus), len(leaderboard), len(stocks)))

    # High-signal consensus alerts (deduped per ticker+member-count).
    for row in consensus:
        if row["member_count"] < CONSENSUS_ALERT_MIN_MEMBERS:
            continue
        sig = aggregate.consensus_signature(row)
        if sig not in seen_consensus:
            _send_consensus_ntfy(consensus_topic, row)
            # Only burn the signature once a topic exists, so the first alerts
            # still fire after you subscribe and set NTFY_CONSENSUS_TOPIC.
            if consensus_topic:
                seen_consensus.add(sig)

    with open(os.path.join(HERE, "filings.json"), "w") as fh:
        json.dump({"updated": _dt.datetime.utcnow().isoformat() + "Z",
                   "window_days": CONSENSUS_WINDOW_DAYS,
                   "proven_members": proven_members,
                   "filings": page_filings,
                   "consensus": consensus,
                   "leaderboard": leaderboard,
                   "stocks": stocks}, fh, indent=2)
    with open(os.path.join(HERE, "seen.json"), "w") as fh:
        json.dump(sorted(seen), fh, indent=2)
    with open(os.path.join(HERE, "seen_consensus.json"), "w") as fh:
        json.dump(sorted(seen_consensus), fh, indent=2)
    with open(os.path.join(HERE, "prices.json"), "w") as fh:
        json.dump(prices_cache, fh, indent=2)


if __name__ == "__main__":
    run()
