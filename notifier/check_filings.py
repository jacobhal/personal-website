#!/usr/bin/env python3
"""Poll the US House Clerk financial-disclosure index for new PTR filings by the
people in watchlist.json, push an ntfy notification for each new one, and write
notifier/filings.json (consumed by the website page).

Stdlib only — runs anywhere Python 3 is available (GitHub Actions, locally).
"""
import datetime as _dt
import json
import os
import urllib.request
import xml.etree.ElementTree as ET

HOUSE_INDEX_URL = "https://disclosures-clerk.house.gov/public_disc/financial-pdfs/{year}FD.xml"
PTR_PDF_URL = "https://disclosures-clerk.house.gov/public_disc/ptr-pdfs/{year}/{doc_id}.pdf"
OTHER_PDF_URL = "https://disclosures-clerk.house.gov/public_disc/financial-pdfs/{year}/{doc_id}.pdf"
_UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
       "(KHTML, like Gecko) Chrome/124.0 Safari/537.36")

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


def _send_ntfy(topic, filing):
    """Push one notification. No-op (logged) when topic is unset."""
    title = "New PTR: " + full_name(filing)
    body = "Filed {} - tap to open the disclosure".format(to_iso(filing["filing_date"]))
    if not topic:
        print("  [dry-run, no NTFY_TOPIC] " + title)
        return
    req = urllib.request.Request(
        "https://ntfy.sh/" + topic, data=body.encode("utf-8"), method="POST")
    req.add_header("Title", title)
    req.add_header("Click", pdf_url(filing))
    req.add_header("Tags", "classical_building")
    urllib.request.urlopen(req, timeout=20)
    print("  pushed: " + title)


def run():
    topic = os.environ.get("NTFY_TOPIC", "").strip()
    watchlist = _load_json(os.path.join(HERE, "watchlist.json"), [])
    seen = set(_load_json(os.path.join(HERE, "seen.json"), []))

    # Current + previous year, so the new-year index gap never hides filings.
    this_year = _dt.datetime.utcnow().year
    all_filings = []
    for year in (this_year, this_year - 1):
        try:
            all_filings += parse_filings(_fetch(HOUSE_INDEX_URL.format(year=year)))
        except Exception as e:  # noqa: BLE001 - a missing/late index must not crash the job
            print("  warn: could not fetch {} index: {}".format(year, e))

    watched = select_watched(all_filings, watchlist)
    fresh = new_filings(watched, seen)
    print("watched PTRs: {} | new: {}".format(len(watched), len(fresh)))

    for f in fresh:
        _send_ntfy(topic, f)
        seen.add(f["doc_id"])

    # Data file for the website page: all watched PTRs, newest first.
    page_rows = sorted(
        ({
            "name": full_name(f),
            "last": f["last"],
            "first": f["first"],
            "filing_type": f["filing_type"],
            "filing_date": to_iso(f["filing_date"]),
            "year": f["year"],
            "doc_id": f["doc_id"],
            "pdf_url": pdf_url(f),
        } for f in watched),
        key=lambda r: r["filing_date"], reverse=True,
    )
    with open(os.path.join(HERE, "filings.json"), "w") as fh:
        json.dump({"updated": _dt.datetime.utcnow().isoformat() + "Z",
                   "filings": page_rows}, fh, indent=2)
    with open(os.path.join(HERE, "seen.json"), "w") as fh:
        json.dump(sorted(seen), fh, indent=2)


if __name__ == "__main__":
    run()
