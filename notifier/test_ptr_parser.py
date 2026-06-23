"""Tests for the pure PTR text parser, using a real Pelosi filing's text."""
import os
import unittest

import ptr_parser as pp

HERE = os.path.dirname(os.path.abspath(__file__))
FIXTURE = os.path.join(HERE, "fixtures", "ptr_20030630.txt")


class ParsePtrText(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with open(FIXTURE) as fh:
            cls.trades = pp.parse_ptr_text(fh.read())

    def test_finds_both_transactions(self):
        self.assertEqual(len(self.trades), 2)

    def test_broadcom_purchase(self):
        t = self.trades[0]
        self.assertEqual(t["ticker"], "AVGO")
        self.assertEqual(t["side"], "buy")
        self.assertEqual(t["owner"], "spouse")
        self.assertEqual(t["txn_date"], "2025-06-20")
        self.assertEqual(t["amount_low"], 1000001)
        self.assertEqual(t["amount_high"], 5000000)
        # The description mentions exercised call options.
        self.assertEqual(t["instrument"], "options")
        self.assertIn("Broadcom", t["asset"])

    def test_fund_sale_without_ticker(self):
        t = self.trades[1]
        self.assertEqual(t["side"], "sell")
        self.assertIsNone(t["ticker"])  # a mutual fund, no stock symbol
        self.assertEqual(t["amount_low"], 15001)
        self.assertEqual(t["amount_high"], 50000)
        self.assertEqual(t["instrument"], "shares")
        self.assertIn("Matthews", t["asset"])

    def test_page_break_headers_do_not_corrupt_wrapped_high_amount(self):
        text = """
SP Tempus AI, Inc. - Class A Common P 01/16/2026 01/16/2026 $50,001 -
ID Owner Asset Transaction Date Notification Amount Cap.
Type Date Gains >
$200?
Stock (TEM) [ST] $100,000
F S: New
""".strip()

        trades = pp.parse_ptr_text(text)

        self.assertEqual(len(trades), 1)
        self.assertEqual(trades[0]["ticker"], "TEM")
        self.assertEqual(trades[0]["amount_low"], 50001)
        self.assertEqual(trades[0]["amount_high"], 100000)


class Helpers(unittest.TestCase):
    def test_to_iso(self):
        self.assertEqual(pp.to_iso("06/20/2025"), "2025-06-20")
        self.assertEqual(pp.to_iso("garbage"), "garbage")

    def test_parse_amount(self):
        self.assertEqual(pp.parse_amount("$1,000,001"), 1000001)
        self.assertIsNone(pp.parse_amount(None))


if __name__ == "__main__":
    unittest.main()
