import { describe, expect, it } from 'vitest'

import { formatTradeSummary, summarizeTrades, type FilingTrade } from './tradeFormatting'

const avgoTrade: FilingTrade = {
    owner: 'spouse',
    asset: 'Broadcom Inc. - Common Stock',
    ticker: 'AVGO',
    side: 'buy',
    instrument: 'options',
    txn_date: '2025-06-20',
    amount_low: 1000001,
    amount_high: 5000000,
}

describe('formatTradeSummary', () => {
    it('formats ticker, options, amount range, and age', () => {
        expect(formatTradeSummary(avgoTrade, '2025-06-23')).toBe(
            'BUY AVGO (opt) $1M-$5M • traded 2025-06-20 (3d ago)'
        )
    })

    it('falls back to asset name when ticker missing', () => {
        expect(
            formatTradeSummary(
                {
                    owner: 'self',
                    asset: 'Matthews International Mutual Fund',
                    ticker: null,
                    side: 'sell',
                    instrument: 'shares',
                    txn_date: '2025-06-20',
                    amount_low: 15001,
                    amount_high: 50000,
                },
                '2025-06-23'
            )
        ).toBe('SELL Matthews International Mutual Fund $15K-$50K • traded 2025-06-20 (3d ago)')
    })
})

describe('summarizeTrades', () => {
    it('returns visible trade summaries and overflow count', () => {
        const trades = [
            avgoTrade,
            { ...avgoTrade, ticker: 'NVDA' },
            { ...avgoTrade, ticker: 'MSFT' },
            { ...avgoTrade, ticker: 'AMZN' },
        ]

        expect(summarizeTrades(trades, '2025-06-23')).toEqual({
            lines: [
                'BUY AVGO (opt) $1M-$5M • traded 2025-06-20 (3d ago)',
                'BUY NVDA (opt) $1M-$5M • traded 2025-06-20 (3d ago)',
                'BUY MSFT (opt) $1M-$5M • traded 2025-06-20 (3d ago)',
            ],
            overflowCount: 1,
        })
    })
})
