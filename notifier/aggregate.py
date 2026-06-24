"""Pure pattern aggregations over parsed filings (no network, unit-tested).

Each `filing` is a dict with "name" and "trades" (list of trade dicts with
ticker/side/txn_date/instrument/amount_low/amount_high), matching filings.json.
"""
import datetime as _dt


def _within(txn_date_iso, today_iso, window_days):
    try:
        d = _dt.date.fromisoformat(txn_date_iso)
        t = _dt.date.fromisoformat(today_iso)
    except (ValueError, TypeError):
        return False
    return 0 <= (t - d).days <= window_days


def _iter_trades(filings):
    for f in filings:
        for t in (f.get("trades") or []):
            yield f.get("name"), t


def _mid_dollars(t):
    lo = t.get("amount_low") or 0
    hi = t.get("amount_high") or lo
    return (lo + hi) // 2 if hi else lo


def compute_consensus(filings, today_iso, window_days=90, min_members=2):
    """Tickers BOUGHT by >= min_members distinct members within the window."""
    by_ticker = {}
    for member, t in _iter_trades(filings):
        if t.get("side") != "buy" or not t.get("ticker"):
            continue
        if not _within(t.get("txn_date"), today_iso, window_days):
            continue
        members = by_ticker.setdefault(t["ticker"], {})
        prev = members.get(member)
        if prev is None or (t.get("txn_date") or "") > prev:
            members[member] = t.get("txn_date") or ""

    out = [{
        "ticker": ticker,
        "member_count": len(members),
        "members": sorted(members),
        "last_txn_date": max(members.values()),
    } for ticker, members in by_ticker.items() if len(members) >= min_members]
    out.sort(key=lambda r: (r["member_count"], r["last_txn_date"]), reverse=True)
    return out


def compute_leaderboard(filings, today_iso, window_days=90, top=15):
    """Most-accumulated tickers (buys only) within the window."""
    agg = {}
    for member, t in _iter_trades(filings):
        if t.get("side") != "buy" or not t.get("ticker"):
            continue
        if not _within(t.get("txn_date"), today_iso, window_days):
            continue
        a = agg.setdefault(t["ticker"], {"members": set(), "trade_count": 0, "dollars": 0})
        a["members"].add(member)
        a["trade_count"] += 1
        a["dollars"] += _mid_dollars(t)

    out = [{
        "ticker": ticker,
        "member_count": len(v["members"]),
        "members": sorted(v["members"]),
        "trade_count": v["trade_count"],
        "approx_dollars": v["dollars"],
    } for ticker, v in agg.items()]
    out.sort(key=lambda r: (r["member_count"], r["approx_dollars"], r["trade_count"]),
             reverse=True)
    return out[:top]


def compute_ticker_activity(filings):
    """All trades grouped by ticker (buys + sells) for the per-stock view."""
    agg = {}
    for member, t in _iter_trades(filings):
        ticker = t.get("ticker")
        if not ticker:
            continue
        a = agg.setdefault(ticker, {
            "buys": 0, "sells": 0, "members": set(), "last_txn_date": "", "events": [],
        })
        if t.get("side") == "buy":
            a["buys"] += 1
        elif t.get("side") == "sell":
            a["sells"] += 1
        a["members"].add(member)
        when = t.get("txn_date") or ""
        if when > a["last_txn_date"]:
            a["last_txn_date"] = when
        a["events"].append({
            "member": member,
            "side": t.get("side"),
            "txn_date": when,
            "instrument": t.get("instrument"),
            "amount_low": t.get("amount_low"),
            "amount_high": t.get("amount_high"),
        })

    out = [{
        "ticker": ticker,
        "buys": v["buys"],
        "sells": v["sells"],
        "member_count": len(v["members"]),
        "members": sorted(v["members"]),
        "last_txn_date": v["last_txn_date"],
        "events": sorted(v["events"], key=lambda e: e.get("txn_date") or "", reverse=True),
    } for ticker, v in agg.items()]
    out.sort(key=lambda r: (r["last_txn_date"], r["buys"]), reverse=True)
    return out


def consensus_signature(row):
    """Stable key for 'have I already alerted this consensus level?' dedup."""
    return "{}|{}".format(row["ticker"], row["member_count"])
