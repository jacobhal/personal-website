import type { StoreCampaign } from '../config/storeCampaign'
import type { Locale } from '../i18n/locale'
import type {
    AcquisitionApp,
    AcquisitionStore,
} from './acquisitionTelemetry'

/**
 * Writes acquisition events to Supabase, alongside the Sentry events.
 *
 * Sentry answers "is this broken"; this answers "did the campaign work", and
 * keeps the history in a table we own and can query for as long as we like,
 * rather than inside an error tracker's retention window.
 *
 * Uses `fetch` against PostgREST rather than `@supabase/supabase-js`: the one
 * call needed here is an insert, and the bundle is already over the 500 kB
 * warning threshold without adding a client library for it.
 *
 * Nothing here can fail loudly. A blocked request, an ad blocker, a missing
 * environment variable — all of it resolves to a no-op, because a marketing
 * counter must never break a download button.
 */

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL ?? '').trim()
const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? '').trim()

const ENDPOINT = '/rest/v1/web_acquisition_events'

export const isAcquisitionStoreConfigured = (): boolean =>
    SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0

/** Column limits mirror the CHECK constraints in the migration. */
const LIMITS = {
    utm_source: 64,
    utm_medium: 64,
    utm_campaign: 96,
    utm_content: 96,
} as const

const clean = (
    value: string | undefined,
    max: number
): string | null => {
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
 * Sends one event.
 *
 * A store click navigates away immediately, so `keepalive` is set — without it
 * the browser cancels the request as the page unloads and the click is lost,
 * which is precisely the event that matters most.
 */
export const recordAcquisitionEvent = async (
    input: AcquisitionEventInput
): Promise<void> => {
    if (!isAcquisitionStoreConfigured()) return

    try {
        await fetch(`${SUPABASE_URL}${ENDPOINT}`, {
            method: 'POST',
            keepalive: true,
            headers: {
                'Content-Type': 'application/json',
                apikey: SUPABASE_ANON_KEY,
                Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
                Prefer: 'return=minimal',
            },
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

export class AcquisitionSummaryError extends Error {}

/**
 * Reads the aggregate for the /stats page.
 *
 * The passphrase is checked inside the SECURITY DEFINER function, so it is
 * never in the bundle and the anon role still cannot read the events table
 * directly. A wrong passphrase returns an empty array, not an error.
 */
export const fetchAcquisitionSummary = async (
    token: string,
    days: number,
    app?: AcquisitionApp
): Promise<AcquisitionSummaryRow[]> => {
    if (!isAcquisitionStoreConfigured()) {
        throw new AcquisitionSummaryError('Supabase is not configured')
    }

    const response = await fetch(
        `${SUPABASE_URL}/rest/v1/rpc/web_acquisition_summary`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                apikey: SUPABASE_ANON_KEY,
                Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({
                p_token: token,
                p_days: days,
                p_app: app ?? null,
            }),
        }
    )

    if (!response.ok) {
        throw new AcquisitionSummaryError(
            `Summary request failed (${response.status})`
        )
    }
    return (await response.json()) as AcquisitionSummaryRow[]
}
