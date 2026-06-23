"""Parse a House PTR's extracted text into individual transactions.

`parse_ptr_text` is pure and unit-tested against a real filing's text.
`extract_pdf_text` is a thin pdfplumber wrapper used at runtime (lazy import).
"""
import datetime as _dt
import re

# A transaction's first line, e.g.:
#   "SP Broadcom Inc. - Common Stock P 06/20/2025 06/20/2025 $1,000,001 -"
#   "SP Matthews International Mutual Fund S 06/20/2025 06/20/2025 $15,001 - $50,000"
_LINE_RE = re.compile(
    r"^(?:(SP|JT|DC)\s+)?"            # optional owner code
    r"(.+?)\s+"                       # asset (lazy)
    r"([PSE])\s+"                     # transaction type
    r"(\d{2}/\d{2}/\d{4})\s+"         # transaction date
    r"(\d{2}/\d{2}/\d{4})\s+"         # notification date
    r"\$([\d,]+)\s*-\s*"              # amount low
    r"(\$[\d,]+)?\s*$"                # amount high (may wrap to next line)
)

_OWNER = {"SP": "spouse", "JT": "joint", "DC": "dependent", None: "self"}
_SIDE = {"P": "buy", "S": "sell", "E": "exchange"}


def to_iso(us_date):
    """'06/20/2025' -> '2025-06-20'; returns input unchanged if unparseable."""
    try:
        return _dt.datetime.strptime(us_date, "%m/%d/%Y").strftime("%Y-%m-%d")
    except (ValueError, TypeError):
        return us_date


def parse_amount(s):
    """'$1,000,001' -> 1000001; None -> None."""
    if not s:
        return None
    digits = re.sub(r"[^\d]", "", s)
    return int(digits) if digits else None


def parse_ptr_text(text):
    """Return a list of transaction dicts parsed from PTR text."""
    lines = [ln.strip() for ln in text.splitlines()]
    out = []
    i = 0
    while i < len(lines):
        m = _LINE_RE.match(lines[i])
        if not m:
            i += 1
            continue
        owner_code, asset, ttype, txn, _notif, low, high = m.groups()

        # Gather continuation lines (ticker, wrapped amount, description) until the
        # next transaction or a footer marker.
        j = i + 1
        cont = []
        while j < len(lines):
            ln = lines[j]
            if (not ln or _LINE_RE.match(ln) or ln.startswith("*")
                    or ln.startswith("Digitally Signed")):
                break
            cont.append(ln)
            j += 1
        block = asset + " " + " ".join(cont)

        side = _SIDE.get(ttype)
        if side != "exchange":  # exchanges have no buy/sell semantics
            tk = re.search(r"\(([A-Z.]{1,6})\)", block)
            low_amount = parse_amount(low)
            high_amount = parse_amount(high)
            if high_amount is None:
                candidates = [
                    parse_amount(amount)
                    for amount in re.findall(r"\$[\d,]+", " ".join(cont))
                ]
                candidates = [amount for amount in candidates if amount is not None]
                if low_amount is not None:
                    high_amount = next(
                        (amount for amount in candidates if amount >= low_amount),
                        None,
                    )
                if high_amount is None and candidates:
                    high_amount = candidates[-1]
            instrument = "options" if re.search(r"option", block, re.I) else "shares"
            out.append({
                "owner": _OWNER.get(owner_code, "self"),
                "asset": re.sub(r"\s+", " ", asset).strip(),
                "ticker": tk.group(1) if tk else None,
                "side": side,
                "instrument": instrument,
                "txn_date": to_iso(txn),
                "amount_low": low_amount,
                "amount_high": high_amount,
            })
        i = j
    return out


def extract_pdf_text(pdf_bytes):
    """Extract text from a PTR PDF (lazy pdfplumber import; runtime only)."""
    import io
    import pdfplumber  # noqa: WPS433 - optional heavy dep, only needed at runtime
    with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
        return "\n".join((p.extract_text() or "") for p in pdf.pages).replace("\x00", "")
