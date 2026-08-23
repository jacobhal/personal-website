import type { AcquisitionSummaryRow } from '../../services/acquisitionStore'
import type { AcquisitionApp } from '../../services/acquisitionTelemetry'

export interface AppTotals {
    views: number
    clicks: number
    appStore: number
    googlePlay: number
}

export interface AcquisitionSummary {
    byApp: Record<AcquisitionApp, AppTotals>
    /** Source rows, highest traffic first. */
    rows: AcquisitionSummaryRow[]
    overall: AppTotals
}

const emptyTotals = (): AppTotals => ({
    views: 0,
    clicks: 0,
    appStore: 0,
    googlePlay: 0,
})

const add = (totals: AppTotals, row: AcquisitionSummaryRow): void => {
    totals.views += row.views
    totals.clicks += row.clicks
    totals.appStore += row.clicks_app_store
    totals.googlePlay += row.clicks_google_play
}

/**
 * Rolls the per-campaign rows up into per-app and overall totals.
 *
 * Kept out of the component so the arithmetic is testable without rendering,
 * and so a row for an app that is not in the fixed pair cannot crash the page —
 * it counts toward the overall total and is skipped in the per-app cards.
 */
export const summarize = (
    rows: AcquisitionSummaryRow[]
): AcquisitionSummary => {
    const byApp: Record<AcquisitionApp, AppTotals> = {
        skarp: emptyTotals(),
        krydda: emptyTotals(),
    }
    const overall = emptyTotals()

    for (const row of rows) {
        add(overall, row)
        const totals = byApp[row.app]
        if (totals) add(totals, row)
    }

    return {
        byApp,
        overall,
        rows: [...rows].sort(
            (a, b) => b.views - a.views || b.clicks - a.clicks
        ),
    }
}
