import { targetFor, type SupabaseTarget } from '../config/supabaseTargets'
import type { ReviewBand } from '../views/Integrity/present'

/**
 * Reads the player-integrity review functions in the Skarp project.
 *
 * Read-only by design. The passphrase is checked inside each SECURITY DEFINER
 * function, so it never reaches the bundle and the public anon key is powerless
 * on its own. That is enough authority to look at aggregates and nowhere near
 * enough to restrict an account, so no write path exists here: restrictions run
 * through `admin_set_ranked_restriction`, which is service_role only.
 *
 * A wrong passphrase returns an empty result rather than an error, matching the
 * acquisition dashboard, so the endpoint never says which case it hit.
 */

const headers = (target: SupabaseTarget): Record<string, string> => ({
    'Content-Type': 'application/json',
    apikey: target.anonKey,
    Authorization: `Bearer ${target.anonKey}`,
})

export interface BoardRow {
    user_id: string
    username: string | null
    display_name: string | null
    rating: number
    scored_answers: number
    accuracy: number | null
    expected_accuracy: number | null
    z_score: number | null
    hard_answers: number
    hard_accuracy: number | null
    median_answer_ms: number | null
    p90_answer_ms: number | null
    slow_correct_share: number | null
    /** Denominator behind median_answer_ms and slow_correct_share. */
    timed_answers: number
    background_events: number
    risk_score: number
    review_band: ReviewBand
    actively_restricted: boolean
}

export interface SearchRow {
    user_id: string
    username: string | null
    display_name: string | null
    rating: number
    actively_restricted: boolean
}

export interface PlayerCard {
    user_id: string
    username: string | null
    display_name: string | null
    rating: number
    scored_answers: number
    raw_ranked_answers: number
    correct_answers?: number
    accuracy?: number | null
    expected_accuracy?: number | null
    z_score?: number | null
    hard_answers?: number
    hard_accuracy?: number | null
    median_answer_ms?: number | null
    p90_answer_ms?: number | null
    slow_correct_share?: number | null
    timed_answers?: number | null
    background_events?: number
    risk_score?: number
    review_band?: ReviewBand
    actively_restricted: boolean
}

export interface PopulationMedians {
    accounts: number
    median_accuracy: number | null
    median_z_score: number | null
    median_answer_ms: number | null
    median_hard_accuracy: number | null
    median_slow_correct_share: number | null
    median_background_events: number | null
}

export interface PlayerRestriction {
    restriction_id: string
    starts_at: string
    ends_at: string | null
    source: string
    appeal_status: string | null
    appeal_submitted_at: string | null
}

export interface PlayerAnswer {
    question_id: string
    question_en: string | null
    difficulty: number | null
    population_correct_rate: number | null
    population_answers: number
    is_correct: boolean | null
    answer_ms: number | null
    answered_at: string | null
}

export interface PlayerReport {
    window_days: number
    player: PlayerCard
    population: PopulationMedians
    restriction: PlayerRestriction | null
    answers: PlayerAnswer[]
}

/**
 * Header counts, and the passphrase signal.
 *
 * The board and the search both return an empty set for a rejected passphrase
 * and for a genuinely quiet week. This function returns exactly one row for a
 * valid passphrase and none for an invalid one, so the page can tell a typo
 * from an empty database instead of rendering "nothing suspicious" either way.
 */
export interface IntegrityOverview {
    window_days: number
    review_floor: number
    tracked_accounts: number
    eligible_accounts: number
    flagged_accounts: number
    restricted_accounts: number
}

export class IntegrityError extends Error {}

export const isIntegrityStoreConfigured = (): boolean =>
    targetFor('skarp') !== null

const callRpc = async <T,>(
    fn: string,
    body: Record<string, unknown>
): Promise<T> => {
    const target = targetFor('skarp')
    if (target === null) {
        throw new IntegrityError('The Skarp Supabase project is not configured')
    }
    const response = await fetch(`${target.url}/rest/v1/rpc/${fn}`, {
        method: 'POST',
        headers: headers(target),
        body: JSON.stringify(body),
    })
    if (!response.ok) {
        throw new IntegrityError(`${fn} failed (${response.status})`)
    }
    return (await response.json()) as T
}

export const fetchIntegrityOverview = async (
    token: string,
    days: number
): Promise<IntegrityOverview | null> => {
    const rows = await callRpc<IntegrityOverview[]>('web_integrity_overview', {
        p_token: token,
        p_days: days,
    })
    return rows.length > 0 ? rows[0] : null
}

export const fetchIntegrityBoard = (
    token: string,
    days: number,
    minAnswers: number
): Promise<BoardRow[]> =>
    callRpc<BoardRow[]>('web_integrity_board', {
        p_token: token,
        p_days: days,
        p_min_answers: minAnswers,
    })

export const searchIntegrityPlayers = (
    token: string,
    query: string
): Promise<SearchRow[]> =>
    callRpc<SearchRow[]>('web_integrity_search', {
        p_token: token,
        p_query: query,
    })

export const fetchIntegrityPlayer = (
    token: string,
    userId: string,
    days: number
): Promise<PlayerReport | null> =>
    callRpc<PlayerReport | null>('web_integrity_player', {
        p_token: token,
        p_user_id: userId,
        p_days: days,
    })
