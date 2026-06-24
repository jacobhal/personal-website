"""Tests for the pure pattern-aggregation functions."""
import unittest

import aggregate as ag

TODAY = "2026-06-24"

# Synthetic filings shaped like notifier/filings.json entries.
FILINGS = [
    {"name": "Nancy Pelosi", "trades": [
        {"ticker": "NVDA", "side": "buy", "txn_date": "2026-06-01",
         "instrument": "options", "amount_low": 1000001, "amount_high": 5000000},
        {"ticker": "GOOGL", "side": "buy", "txn_date": "2026-06-01",
         "instrument": "shares", "amount_low": 250001, "amount_high": 500000},
    ]},
    {"name": "Dan Crenshaw", "trades": [
        {"ticker": "NVDA", "side": "buy", "txn_date": "2026-05-20",
         "instrument": "shares", "amount_low": 15001, "amount_high": 50000},
    ]},
    {"name": "Some Seller", "trades": [
        {"ticker": "AAPL", "side": "sell", "txn_date": "2026-06-02",
         "instrument": "shares", "amount_low": 1001, "amount_high": 15000},
    ]},
    {"name": "Old Trade", "trades": [
        {"ticker": "NVDA", "side": "buy", "txn_date": "2025-01-01",  # outside 90d window
         "instrument": "shares", "amount_low": 1001, "amount_high": 15000},
    ]},
    {"name": "No Ticker Fund", "trades": [
        {"ticker": None, "side": "buy", "txn_date": "2026-06-10",
         "instrument": "shares", "amount_low": 1001, "amount_high": 15000},
    ]},
]


class Consensus(unittest.TestCase):
    def test_two_members_same_ticker_in_window(self):
        rows = ag.compute_consensus(FILINGS, TODAY, window_days=90, min_members=2)
        self.assertEqual(len(rows), 1)
        nvda = rows[0]
        self.assertEqual(nvda["ticker"], "NVDA")
        self.assertEqual(nvda["member_count"], 2)
        self.assertEqual(nvda["members"], ["Dan Crenshaw", "Nancy Pelosi"])
        self.assertEqual(nvda["last_txn_date"], "2026-06-01")

    def test_single_member_not_consensus(self):
        rows = ag.compute_consensus(FILINGS, TODAY, window_days=90, min_members=2)
        self.assertNotIn("GOOGL", [r["ticker"] for r in rows])

    def test_old_trades_excluded_by_window(self):
        # NVDA's 2025 buy must not add a phantom third member.
        rows = ag.compute_consensus(FILINGS, TODAY, window_days=90, min_members=2)
        self.assertEqual(rows[0]["member_count"], 2)


class Leaderboard(unittest.TestCase):
    def test_ranks_by_member_count_then_dollars(self):
        rows = ag.compute_leaderboard(FILINGS, TODAY, window_days=90)
        self.assertEqual(rows[0]["ticker"], "NVDA")
        self.assertEqual(rows[0]["member_count"], 2)
        self.assertEqual(rows[0]["trade_count"], 2)
        tickers = [r["ticker"] for r in rows]
        self.assertIn("GOOGL", tickers)
        self.assertNotIn("AAPL", tickers)  # sells excluded
        self.assertNotIn(None, tickers)    # funds without tickers excluded


class TickerActivity(unittest.TestCase):
    def test_groups_all_trades_by_ticker(self):
        rows = ag.compute_ticker_activity(FILINGS)
        by = {r["ticker"]: r for r in rows}
        self.assertEqual(by["NVDA"]["buys"], 3)   # all sides counted (incl. old)
        self.assertEqual(by["AAPL"]["sells"], 1)
        self.assertEqual(by["NVDA"]["member_count"], 3)
        self.assertEqual(by["NVDA"]["last_txn_date"], "2026-06-01")
        self.assertTrue(len(by["NVDA"]["events"]) == 3)


if __name__ == "__main__":
    unittest.main()
