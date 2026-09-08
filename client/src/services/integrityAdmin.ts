import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import * as Sentry from '@sentry/react'
import { targetFor } from '../config/supabaseTargets'

export interface FairPlayReminder {
    id: string
    user_id: string
    issued_at: string
    issued_by: string | null
    internal_note: string
    evidence_key: string
    delivered_at: string | null
    acknowledged_at: string | null
}

let client: SupabaseClient | undefined
export const integrityAdminClient = (): SupabaseClient => {
    if (!client) {
        const target = targetFor('skarp')
        if (!target) throw new Error('The Skarp project is not configured.')
        client = createClient(target.url, target.anonKey, {
            auth: {
                persistSession: false,
                detectSessionInUrl: true,
                autoRefreshToken: true,
                storageKey: 'integrity-admin',
            },
        })
    }
    return client
}

// Never report backend text, credentials, notes, or player identifiers.
const failure = (operation: string, message: string): Error => {
    Sentry.captureException(
        new Error(`Integrity admin operation failed: ${operation}`),
        {
            tags: { feature: 'integrity-admin', operation },
        }
    )
    return new Error(message)
}

export const checkIntegrityAdmin = async (): Promise<boolean> => {
    const { data, error } =
        await integrityAdminClient().rpc('is_integrity_admin')
    if (error)
        throw failure(
            'check_access',
            'Could not verify admin access. Try signing in again.'
        )
    return data === true
}

export const signOutIntegrityAdmin = async (): Promise<void> => {
    const { error } = await integrityAdminClient().auth.signOut({
        scope: 'local',
    })
    if (error)
        throw failure(
            'sign_out',
            'Could not sign out. Close this tab to clear this session.'
        )
}

export const signInIntegrityAdmin = async (
    email: string,
    password: string
): Promise<void> => {
    const { error } = await integrityAdminClient().auth.signInWithPassword({
        email,
        password,
    })
    if (error)
        throw failure(
            'sign_in',
            'Could not sign in. Check your admin credentials and try again.'
        )
    let allowed = false
    try {
        allowed = await checkIntegrityAdmin()
    } finally {
        if (!allowed) await signOutIntegrityAdmin()
    }
    if (!allowed)
        throw new Error('This account is not authorised to send reminders.')
}

export const setIntegrityAdminPassword = async (
    password: string
): Promise<void> => {
    const { error } = await integrityAdminClient().auth.updateUser({ password })
    if (error)
        throw failure(
            'set_password',
            'Could not set your password. Try a new invitation or a stronger password.'
        )
}

export const getFairPlayReminders = async (
    userId: string
): Promise<FairPlayReminder[]> => {
    const { data, error } = await integrityAdminClient().rpc(
        'admin_get_fair_play_reminders',
        { p_user_id: userId }
    )
    if (error)
        throw failure(
            'load_history',
            'Could not load reminder history. Try again before sending.'
        )
    return data ?? []
}

export const issueFairPlayReminder = async (
    userId: string,
    note: string,
    evidenceKey: string,
    requestId: string
): Promise<FairPlayReminder> => {
    const { data, error } = await integrityAdminClient().rpc(
        'admin_issue_fair_play_reminder',
        {
            p_user_id: userId,
            p_internal_note: note.trim(),
            p_evidence_key: evidenceKey.trim(),
            p_request_id: requestId,
        }
    )
    if (error)
        throw failure(
            'issue_reminder',
            'Reminder could not be confirmed. Refresh history before retrying. The server prevents duplicates, reminders within 30 days, and reminders for restricted accounts.'
        )
    if (!data?.id)
        throw failure(
            'issue_reminder',
            'Reminder could not be confirmed. Refresh history before retrying.'
        )
    return data
}
