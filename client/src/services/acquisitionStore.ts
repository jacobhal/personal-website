import type { StoreCampaign } from '../config/storeCampaign'
import type { Locale } from '../i18n/locale'
import {
    configuredApps,
    targetFor,
    type SupabaseTarget,
} from '../config/supabaseTargets'
import type {
    AcquisitionApp,
    AcquisitionStore,
} from './acquisitionTelemetry'

/**
 * Reads and writes the acquisition tables in each app's own Supabase project.
 *
 * Uses `fetch` against PostgREST rather than `@supabase/supabase-js`: the calls
 * needed are one insert and two RPCs, and the bundle already exceeds the 500 kB
 * warning threshold without adding a client library for that.
 *
 * Nothing on the write path can fail loudly. A blocked request, an ad blocker,
 * a missing environment variable — all of it becomes a no-op, because a
 * marketing counter must never break a download button.
 */

const headers = (target: SupabaseTarget): Record<string, string> => ({
    'Content-Type': 'application/json',
    apikey: target.anonKey,
    Authorization: `Bearer ${target.anonKey}`,
})

export const isAcquisitionStoreConfigured = (): boolean =>
    configuredApps().length > 0

/** Column limits mirror the CHECK constraints in the migration. */
const LIMITS = {
    utm_source: 64,
    utm_medium: 64,
    utm_campaign: 96,
    utm_content: 96,
} as const

const clean = (value: string | undefined, max: number): string | null => {
    const trimmed = value?.trim().toLowerCase()
    if (!trimmed) return null
    return trimmed.slice(0, max)
}

export interface AcquisitionEventInput {
    app: AcquisitionApp
    event: 'landing_view' | 'store_click'
    store?: AcquisitionStore
    campaign: StoreCampaign
    locale: Locale
}

export const buildEventRow = ({
    app,
    event,
    store,
    campaign,
    locale,
}: AcquisitionEventInput): Record<string, string | null> => ({
    app,
    event,
    store: event === 'store_click' ? (store ?? null) : null,
    utm_source: clean(campaign.source, LIMITS.utm_source),
    utm_medium: clean(campaign.medium, LIMITS.utm_medium),
    utm_campaign: clean(campaign.campaign, LIMITS.utm_campaign),
    utm_content: clean(campaign.content, LIMITS.utm_content),
    locale,
})

/**
 * Records one event in the app's own project.
 *
 * A store click navigates away immediately, so `keepalive` is set — without it
 * the browser cancels the request as the page unloads, losing precisely the
 * event that matters most.
 */
export const recordAcquisitionEvent = async (
    input: AcquisitionEventInput
): Promise<void> => {
    const target = targetFor(input.app)
    if (target === null) return

    try {
        await fetch(`${target.url}/rest/v1/web_acquisition_events`, {
            method: 'POST',
            keepalive: true,
            headers: { ...headers(target), Prefer: 'return=minimal' },
            body: JSON.stringify(buildEventRow(input)),
        })
    } catch {
        // Offline, blocked by an extension, or CORS. Not worth reporting: the
        // Sentry event for the same action already went out.
    }
}

export interface AcquisitionSummaryRow {
    app: AcquisitionApp
    utm_source: string
    utm_medium: string
    utm_campaign: string
    utm_content: string
    views: number
    clicks: number
    clicks_app_store: number
    clicks_google_play: number
}

export interface AppOverview {
    app: AcquisitionApp
    total_users: number
    registered_users: number
    anonymous_users: number
    new_users: number
    active_users: number
}

export interface AcquisitionReport {
    rows: AcquisitionSummaryRow[]
    overviews: AppOverview[]
    /** Apps whose project could not be read, so the page can say so instead of
     *  quietly reporting half the picture as the whole. */
    failed: AcquisitionApp[]
}

export class AcquisitionSummaryError extends Error {}

const callRpc = async <T,>(
    target: SupabaseTarget,
    fn: string,
    body: Record<string, unknown>
): Promise<T> => {
    const response = await fetch(`${target.url}/rest/v1/rpc/${fn}`, {
        method: 'POST',
        headers: headers(target),
        body: JSON.stringify(body),
    })
    if (!response.ok) {
        throw new AcquisitionSummaryError(
            `${fn} failed (${response.status})`
        )
    }
    return (await response.json()) as T
}

/**
 * Reads every configured project and merges the results for /stats.
 *
 * The passphrase is verified inside each project's SECURITY DEFINER function,
 * so it never reaches the bundle and the anon keys stay powerless on their own.
 * A wrong passphrase yields empty results rather than an error, by design.
 *
 * One project being unreachable must not blank the whole dashboard, so failures
 * are collected per app and reported alongside whatever did load.
 */
export const fetchAcquisitionReport = async (
    token: string,
    days: number,
    only?: AcquisitionApp
): Promise<AcquisitionReport> => {
    const apps = configuredApps().filter(
        (app) => only === undefined || app === only
    )
    if (apps.length === 0) {
        throw new AcquisitionSummaryError('No Supabase project is configured')
    }

    const rows: AcquisitionSummaryRow[] = []
    const overviews: AppOverview[] = []
    const failed: AcquisitionApp[] = []

    await Promise.all(
        apps.map(async (app) => {
            const target = targetFor(app)
            if (target === null) return
            try {
                const [summary, overview] = await Promise.all([
                    callRpc<AcquisitionSummaryRow[]>(
                        target,
                        'web_acquisition_summary',
                        { p_token: token, p_days: days, p_app: app }
                    ),
                    callRpc<Omit<AppOverview, 'app'>[]>(
                        target,
                        'web_app_overview',
                        { p_token: token, p_days: days }
                    ),
                ])
                rows.push(...summary)
                // The function returns one row, or none for a bad passphrase.
                if (overview.length > 0) {
                    overviews.push({ app, ...overview[0] })
                }
            } catch {
                failed.push(app)
            }
        })
    )

    return { rows, overviews, failed }
}
