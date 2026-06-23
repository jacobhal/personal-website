"""Unit tests for the pure logic in check_filings.py (stdlib only)."""
import unittest

import check_filings as cf

SAMPLE_XML = b"""<?xml version="1.0" encoding="UTF-8"?>
<FinancialDisclosure>
  <Member>
    <Prefix>Hon.</Prefix><Last>Pelosi</Last><First>Nancy</First><Suffix/>
    <FilingType>P</FilingType><StateDst>CA11</StateDst><Year>2024</Year>
    <FilingDate>3/21/2024</FilingDate><DocID>20024625</DocID>
  </Member>
  <Member>
    <Last>Pelosi</Last><First>Nancy</First>
    <FilingType>O</FilingType><StateDst>CA11</StateDst><Year>2024</Year>
    <FilingDate>5/15/2025</FilingDate><DocID>10066169</DocID>
  </Member>
  <Member>
    <Last>Smith</Last><First>John</First>
    <FilingType>P</FilingType><StateDst>TX01</StateDst><Year>2024</Year>
    <FilingDate>1/2/2024</FilingDate><DocID>20020001</DocID>
  </Member>
</FinancialDisclosure>"""

WATCHLIST = [{"last": "Pelosi", "first": "Nancy"}]


class ParseFilings(unittest.TestCase):
    def test_parses_all_members(self):
        filings = cf.parse_filings(SAMPLE_XML)
        self.assertEqual(len(filings), 3)
        first = filings[0]
        self.assertEqual(first["last"], "Pelosi")
        self.assertEqual(first["first"], "Nancy")
        self.assertEqual(first["filing_type"], "P")
        self.assertEqual(first["year"], "2024")
        self.assertEqual(first["doc_id"], "20024625")
        self.assertEqual(first["filing_date"], "3/21/2024")


class SelectWatched(unittest.TestCase):
    def test_keeps_only_watched_ptr_filings(self):
        filings = cf.parse_filings(SAMPLE_XML)
        watched = cf.select_watched(filings, WATCHLIST)
        # Pelosi 'P' only — excludes her 'O' annual report and unrelated Smith.
        self.assertEqual([f["doc_id"] for f in watched], ["20024625"])

    def test_name_match_is_case_insensitive(self):
        filings = cf.parse_filings(SAMPLE_XML)
        watched = cf.select_watched(filings, [{"last": "pELOSI", "first": "nancy"}])
        self.assertEqual([f["doc_id"] for f in watched], ["20024625"])

    def test_first_name_optional(self):
        filings = cf.parse_filings(SAMPLE_XML)
        watched = cf.select_watched(filings, [{"last": "Pelosi"}])
        self.assertEqual([f["doc_id"] for f in watched], ["20024625"])


class NewFilings(unittest.TestCase):
    def test_filters_already_seen(self):
        filings = cf.parse_filings(SAMPLE_XML)
        new = cf.new_filings(filings, {"20024625"})
        self.assertNotIn("20024625", [f["doc_id"] for f in new])
        self.assertIn("20020001", [f["doc_id"] for f in new])

    def test_empty_seen_returns_all(self):
        filings = cf.parse_filings(SAMPLE_XML)
        new = cf.new_filings(filings, set())
        self.assertEqual(len(new), 3)


class PdfUrl(unittest.TestCase):
    def test_ptr_pdf_url(self):
        f = {"filing_type": "P", "year": "2024", "doc_id": "20024625"}
        self.assertEqual(
            cf.pdf_url(f),
            "https://disclosures-clerk.house.gov/public_disc/ptr-pdfs/2024/20024625.pdf",
        )

    def test_non_ptr_uses_financial_pdfs_path(self):
        f = {"filing_type": "O", "year": "2024", "doc_id": "10066169"}
        self.assertEqual(
            cf.pdf_url(f),
            "https://disclosures-clerk.house.gov/public_disc/financial-pdfs/2024/10066169.pdf",
        )


if __name__ == "__main__":
    unittest.main()
