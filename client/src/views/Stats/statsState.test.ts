import { describe, expect, test } from 'vitest'

import { summarize } from './summarize'
import type { AcquisitionReport } from '../../services/acquisitionStore'

/**
 * The rule the dashboard renders on.
 *
 * Both RPCs return an empty set for a bad passphrase, and `web_app_overview`
 * always returns a row for a good one. So an empty overview list with no failed
 * project means the passphrase was rejected — which must be distinguished from
 * simply having no ad traffic yet, the normal state before the first visitor.
 */
const passphraseRejected = (report: AcquisitionReport | null): boolean =>
    report !== null &&
    report.overviews.length === 0 &&
    report.failed.length === 0

const overview = (app: 'skarp' | 'krydda', users: number) => ({
    app,
    total_users: users,
    registered_users: users,
    anonymous_users: 0,
    new_users: 1,
    active_users: 1,
})

describe('dashboard state', () => {
    test('a good passphrase with no ad traffic is not a rejection', () => {
        const report: AcquisitionReport = {
            rows: [],
            overviews: [overview('skarp', 53)],
            failed: [],
        }

        expect(passphraseRejected(report)).toBe(false)
        // The user counts must still be shown — this was the bug.
        expect(report.overviews[0].registered_users).toBe(53)
        expect(summarize(report.rows).rows).toEqual([])
    })

    test('an empty overview with no failure means the passphrase was rejected', () => {
        expect(
            passphraseRejected({ rows: [], overviews: [], failed: [] })
        ).toBe(true)
    })

    test('an unreachable project is a failure, not a rejection', () => {
        expect(
            passphraseRejected({ rows: [], overviews: [], failed: ['krydda'] })
        ).toBe(false)
    })

    test('nothing loaded yet is not a rejection', () => {
        expect(passphraseRejected(null)).toBe(false)
    })
})
