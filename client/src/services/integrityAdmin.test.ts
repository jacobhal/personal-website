import { beforeEach, expect, test, vi } from 'vitest'
const mocks = vi.hoisted(() => ({
    rpc: vi.fn(),
    signInWithPassword: vi.fn(),
    signOut: vi.fn(),
    createClient: vi.fn(),
    captureException: vi.fn(),
}))
vi.mock('@supabase/supabase-js', () => ({ createClient: mocks.createClient }))
vi.mock('@sentry/react', () => ({ captureException: mocks.captureException }))
vi.mock('../config/supabaseTargets', () => ({
    targetFor: () => ({
        url: 'https://example.supabase.co',
        anonKey: 'public',
    }),
}))
beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    mocks.createClient.mockReturnValue({
        rpc: mocks.rpc,
        auth: {
            signInWithPassword: mocks.signInWithPassword,
            signOut: mocks.signOut,
        },
    })
    mocks.signInWithPassword.mockResolvedValue({ error: null })
    mocks.signOut.mockResolvedValue({ error: null })
})
test('admin auth never persists credentials and requires server authorization', async () => {
    const { signInIntegrityAdmin } = await import('./integrityAdmin')
    mocks.rpc.mockResolvedValue({ data: false, error: null })
    await expect(
        signInIntegrityAdmin('admin@example.com', 'secret')
    ).rejects.toThrow('not authorised')
    expect(mocks.createClient).toHaveBeenCalledWith(
        expect.any(String),
        'public',
        expect.objectContaining({
            auth: expect.objectContaining({
                persistSession: false,
                detectSessionInUrl: true,
            }),
        })
    )
    expect(mocks.rpc).toHaveBeenCalledWith('is_integrity_admin')
    expect(mocks.signOut).toHaveBeenCalledWith({ scope: 'local' })
})
test('issuing a reminder preserves the request ID for safe retries', async () => {
    const { issueFairPlayReminder } = await import('./integrityAdmin')
    mocks.rpc.mockResolvedValue({ data: { id: 'reminder' }, error: null })
    await issueFairPlayReminder(
        'player',
        'Repeated reviewed evidence here',
        'matches:123',
        'request'
    )
    expect(mocks.rpc).toHaveBeenCalledWith('admin_issue_fair_play_reminder', {
        p_user_id: 'player',
        p_internal_note: 'Repeated reviewed evidence here',
        p_evidence_key: 'matches:123',
        p_request_id: 'request',
    })
})
test('backend failures expose no raw details in telemetry or UI', async () => {
    const { getFairPlayReminders } = await import('./integrityAdmin')
    mocks.rpc.mockResolvedValue({
        data: null,
        error: { message: 'secret admin@example.com', code: '500' },
    })
    await expect(getFairPlayReminders('player')).rejects.toThrow(
        'Could not load reminder history'
    )
    expect(JSON.stringify(mocks.captureException.mock.calls)).not.toContain(
        'secret'
    )
})
