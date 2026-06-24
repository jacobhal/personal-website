"""Tests for the pure price helpers (no network)."""
import unittest

import prices as pr

PAYLOAD = {
    "status": "ok",
    "values": [
        {"datetime": "2026-06-24", "close": "74.53"},
        {"datetime": "2026-06-23", "close": "73.10"},
        {"datetime": "2026-02-04", "close": "73.92"},
        {"datetime": "2026-02-03", "close": "72.00"},
    ],
}


class ParseSeries(unittest.TestCase):
    def test_parses_closes_and_current(self):
        closes, current = pr.parse_series(PAYLOAD)
        self.assertEqual(current, 74.53)  # newest row is current
        self.assertEqual(closes["2026-02-04"], 73.92)

    def test_error_payload(self):
        closes, current = pr.parse_series({"status": "error", "message": "bad symbol"})
        self.assertIsNone(closes)
        self.assertIsNone(current)


class CloseOnOrBefore(unittest.TestCase):
    def setUp(self):
        self.closes, _ = pr.parse_series(PAYLOAD)

    def test_exact_date(self):
        self.assertEqual(pr.close_on_or_before(self.closes, "2026-02-04"), 73.92)

    def test_falls_back_to_prior_trading_day(self):
        # 2026-02-05 has no row -> use 2026-02-04.
        self.assertEqual(pr.close_on_or_before(self.closes, "2026-02-05"), 73.92)

    def test_returns_none_when_too_far(self):
        self.assertIsNone(pr.close_on_or_before(self.closes, "2025-01-01"))


class PctChange(unittest.TestCase):
    def test_basic(self):
        self.assertEqual(pr.pct_change(73.92, 74.53), 0.8)

    def test_negative(self):
        self.assertEqual(pr.pct_change(100.0, 90.0), -10.0)

    def test_none_inputs(self):
        self.assertIsNone(pr.pct_change(None, 50.0))
        self.assertIsNone(pr.pct_change(50.0, None))


if __name__ == "__main__":
    unittest.main()
