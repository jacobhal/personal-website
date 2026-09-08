// @vitest-environment jsdom
import React from 'react'
import { afterEach, expect, test, vi } from 'vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IntegrityAdmin } from './IntegrityAdmin'
import { issueFairPlayReminder } from '../../services/integrityAdmin'
vi.mock('../../services/integrityAdmin', () => ({
    integrityAdminClient: () => ({
        auth: {
            getSession: async () => ({ data: { session: {} } }),
            onAuthStateChange: () => ({
                data: { subscription: { unsubscribe() {} } },
            }),
        },
    }),
    checkIntegrityAdmin: async () => true,
    getFairPlayReminders: async () => [],
    issueFairPlayReminder: vi.fn(async () => ({
        id: 'notice',
        issued_at: '2026-09-08T12:00:00Z',
        internal_note: 'Reviewed repeated unusual answers',
        evidence_key: 'match-123',
        delivered_at: null,
        acknowledged_at: null,
    })),
    signInIntegrityAdmin: vi.fn(),
    signOutIntegrityAdmin: vi.fn(),
    setIntegrityAdminPassword: vi.fn(),
}))
afterEach(cleanup)
test('manual reminder requires reviewed evidence and explicit send', async () => {
    render(<IntegrityAdmin userId="player" playerName="Player" />)
    await screen.findByText('Send a personal reminder')
    const send = screen.getByRole('button', { name: 'Send reminder' })
    expect((send as HTMLButtonElement).disabled).toBe(true)
    await userEvent.type(
        screen.getByLabelText('Internal review note'),
        'Reviewed repeated unusual answers'
    )
    await userEvent.type(
        screen.getByLabelText('Evidence reference'),
        'match-123'
    )
    expect((send as HTMLButtonElement).disabled).toBe(true)
    await userEvent.click(screen.getByRole('checkbox'))
    await userEvent.click(send)
    await waitFor(() => expect(issueFairPlayReminder).toHaveBeenCalledTimes(1))
    expect(screen.getByText(/does not necessarily mean/)).toBeTruthy()
})
