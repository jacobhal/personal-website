import { describe, expect, test } from 'vitest'

import { summarize } from './summarize'
import type { AcquisitionSummaryRow } from '../../services/acquisitionStore'

const row = (
    overrides: Partial<AcquisitionSummaryRow> = {}
): AcquisitionSummaryRow => ({
    app: 'skarp',
    utm_source: 'tiktok',
    utm_medium: 'paid',
    utm_campaign: 'rush',
    utm_content: 'none',
    views: 100,
    clicks: 10,
    clicks_app_store: 7,
    clicks_google_play: 3,
    ...overrides,
})

describe('summarize', () => {
    test('returns zeroed totals for an empty result', () => {
        const summary = summarize([])

        expect(summary.byApp.skarp).toEqual({
            views: 0,
            clicks: 0,
            appStore: 0,
            googlePlay: 0,
        })
        expect(summary.rows).toEqual([])
    })

    test('totals each app separately', () => {
        const summary = summarize([
            row({ views: 100, clicks: 10, clicks_app_store: 7, clicks_google_play: 3 }),
            row({ app: 'krydda', views: 40, clicks: 6, clicks_app_store: 2, clicks_google_play: 4 }),
            row({ utm_source: 'instagram', views: 20, clicks: 5, clicks_app_store: 5, clicks_google_play: 0 }),
        ])

        expect(summary.byApp.skarp).toEqual({
            views: 120,
            clicks: 15,
            appStore: 12,
            googlePlay: 3,
        })
        expect(summary.byApp.krydda).toEqual({
            views: 40,
            clicks: 6,
            appStore: 2,
            googlePlay: 4,
        })
        expect(summary.overall.views).toBe(160)
    })

    test('sorts rows by traffic, then by clicks', () => {
        const summary = summarize([
            row({ utm_source: 'small', views: 10, clicks: 1 }),
            row({ utm_source: 'big', views: 900, clicks: 2 }),
            row({ utm_source: 'tied', views: 10, clicks: 9 }),
        ])

        expect(summary.rows.map((r) => r.utm_source)).toEqual([
            'big',
            'tied',
            'small',
        ])
    })

    test('does not crash on an app outside the known pair', () => {
        const summary = summarize([
            row({ app: 'hitquiz' as never, views: 5, clicks: 1 }),
        ])

        expect(summary.overall.views).toBe(5)
        expect(summary.byApp.skarp.views).toBe(0)
    })
})
