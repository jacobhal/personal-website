"""Twelve Data price lookups for the 'percent since the trade' badge.

Pure helpers (parse_series, close_on_or_before, pct_change) are unit-tested;
fetch_series is the thin networked entry used at runtime.
"""
import datetime as _dt
import json
import urllib.request

TD_URL = ("https://api.twelvedata.com/time_series"
          "?symbol={sym}&interval=1day&outputsize=400&apikey={key}")


def parse_series(payload):
    """Twelve Data time_series JSON -> (closes {date: float}, current float).
    Returns (None, None) on an error payload."""
    if not isinstance(payload, dict) or payload.get("status") == "error":
        return None, None
    values = payload.get("values") or []
    closes = {}
    for v in values:
        day = (v.get("datetime") or "")[:10]
        try:
            closes[day] = float(v["close"])
        except (KeyError, TypeError, ValueError):
            continue
    current = None
    if values:
        try:
            current = float(values[0]["close"])  # newest row first
        except (KeyError, TypeError, ValueError):
            current = None
    return closes, current


def close_on_or_before(closes, date_iso, max_back=7):
    """Close on date_iso, or the nearest prior trading day within max_back days."""
    if not closes:
        return None
    try:
        d0 = _dt.date.fromisoformat(date_iso)
    except (ValueError, TypeError):
        return None
    for off in range(max_back + 1):
        key = (d0 - _dt.timedelta(days=off)).isoformat()
        if key in closes:
            return closes[key]
    return None


def pct_change(then, now):
    """Percent change from `then` to `now`, one decimal. None if either missing."""
    if not then or now is None:
        return None
    return round((now / then - 1.0) * 100, 1)


def _http_get(url):
    req = urllib.request.Request(url, headers={"User-Agent": "medvind-notifier"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode()


def fetch_series(ticker, api_key, http_get=_http_get):
    """Fetch a ticker's daily series. Returns (closes, current)."""
    raw = http_get(TD_URL.format(sym=ticker, key=api_key))
    return parse_series(json.loads(raw))
