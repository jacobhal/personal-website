// @vitest-environment jsdom
import React from 'react'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

/**
 * Renders the panel against payloads copied verbatim from the live production
 * RPCs on 2026-09-04, so a renamed column or an unhandled null fails here rather
 * than on the page.
 */
const overview = {
    window_days: 30,
    review_floor: 40,
    tracked_accounts: 9,
    eligible_accounts: 0,
    flagged_accounts: 0,
    restricted_accounts: 0,
}

const board = [
    {
        user_id: 'aab72a0f-2bca-4a66-bc36-1dc82298c059',
        username: 'ananya',
        display_name: 'ananya',
        rating: 1107,
        scored_answers: 16,
        accuracy: 0.875,
        expected_accuracy: 0.7125,
        z_score: 1.53206469257085,
        hard_answers: 1,
        hard_accuracy: 1,
        median_answer_ms: 22279,
        p90_answer_ms: 22279,
        slow_correct_share: 1,
        timed_answers: 1,
        background_events: 0,
        risk_score: 2,
        review_band: 'watch' as const,
        actively_restricted: false,
    },
    {
        user_id: '32019623-a844-4e50-9527-fda36a545196',
        username: 'Jacob',
        display_name: 'Jacob',
        rating: 1200,
        scored_answers: 37,
        accuracy: 0.810810810810811,
        expected_accuracy: 0.69,
        z_score: 1.68732297546421,
        hard_answers: 2,
        hard_accuracy: 0,
        median_answer_ms: 4735,
        p90_answer_ms: 9000,
        slow_correct_share: 0,
        timed_answers: 12,
        background_events: 0,
        risk_score: 0,
        review_band: 'watch' as const,
        actively_restricted: false,
    },
]

const playerReport = {
    window_days: 30,
    player: {
        user_id: 'aab72a0f-2bca-4a66-bc36-1dc82298c059',
        username: 'ananya',
        display_name: 'ananya',
        rating: 1107,
        scored_answers: 16,
        raw_ranked_answers: 214,
        correct_answers: 14,
        accuracy: 0.875,
        expected_accuracy: 0.7125,
        z_score: 1.53206469257085,
        hard_answers: 1,
        hard_accuracy: 1,
        median_answer_ms: 22279,
        p90_answer_ms: 22279,
        slow_correct_share: 1,
        timed_answers: 1,
        background_events: 0,
        risk_score: 2,
        review_band: 'watch' as const,
        actively_restricted: false,
    },
    population: {
        accounts: 3,
        median_accuracy: 0.810810810810811,
        median_z_score: 1.53206469257085,
        median_answer_ms: 13507,
        median_hard_accuracy: 0,
        median_slow_correct_share: 0.5,
        median_background_events: 0,
    },
    restriction: null,
    answers: [
        {
            question_id: 'q-science-246',
            question_en:
                'According to the law of conservation of energy, energy can do what?',
            difficulty: 1,
            population_correct_rate: 0.8,
            population_answers: 4,
            is_correct: false,
            answer_ms: null,
            answered_at: null,
        },
    ],
}

vi.mock('../../services/integrityStore', () => ({
    isIntegrityStoreConfigured: () => true,
    fetchIntegrityOverview: vi.fn(async () => overview),
    fetchIntegrityBoard: vi.fn(async () => board),
    fetchIntegrityPlayer: vi.fn(async () => playerReport),
    searchIntegrityPlayers: vi.fn(async () => [
        {
            user_id: 'aab72a0f-2bca-4a66-bc36-1dc82298c059',
            username: 'ananya',
            display_name: 'ananya',
            rating: 1107,
            actively_restricted: false,
        },
    ]),
    IntegrityError: class extends Error {},
}))

beforeEach(() => {
    // This jsdom build does not ship localStorage, and the page reads the
    // passphrase from it on mount.
    const store = new Map<string, string>([
        ['jacobhal.integrityToken', 'a-passphrase'],
    ])
    Object.defineProperty(window, 'localStorage', {
        configurable: true,
        value: {
            getItem: (key: string) => store.get(key) ?? null,
            setItem: (key: string, value: string) => store.set(key, value),
            removeItem: (key: string) => store.delete(key),
        },
    })
})

// This project does not enable vitest globals, so testing-library's automatic
// cleanup never registers and renders would stack across tests.
afterEach(cleanup)

const renderPage = async () => {
    const { Integrity } = await import('./Integrity')
    render(<Integrity />)
    await waitFor(() =>
        expect(screen.getByText(/ranked accounts tracked/)).toBeTruthy()
    )
}

describe('integrity panel with live-shaped data', () => {
    test('the header states the population and the email floor', async () => {
        await renderPage()

        expect(
            screen.getByText(
                /9 ranked accounts tracked · 0 above the 40-answer email floor · 0 flagged · 0 currently restricted/
            )
        ).toBeTruthy()
    })

    test('the board lists every account with its band and figures', async () => {
        await renderPage()

        expect(screen.getAllByText('ananya').length).toBeGreaterThan(0)
        expect(screen.getByText('87.5%')).toBeTruthy()
        expect(screen.getByText('1.53')).toBeTruthy()
        expect(screen.getByText('22.3s')).toBeTruthy()
    })

    test('opening a player shows the sample the figures rest on', async () => {
        await renderPage()
        await userEvent.click(screen.getAllByText('ananya')[0])

        // The coverage line is the whole point of the card at this volume: 16
        // comparable answers out of 214 actually played.
        await waitFor(() =>
            expect(
                screen.getByText(/16 comparable of 214 ranked answers/)
            ).toBeTruthy()
        )
        // A 100% slow-correct share off one timed answer must not read as a
        // habit.
        expect(
            screen.getByText('Timing is based on 1 timed answer.')
        ).toBeTruthy()
        expect(screen.getByText(/Median answer time \(1 timed\)/)).toBeTruthy()
        // "(1 answers)" shipped in the first render of this card.
        expect(
            screen.getByText(/Hard-question accuracy \(1 answer\)/)
        ).toBeTruthy()
    })

    test('the player card compares against the population median', async () => {
        await renderPage()
        await userEvent.click(screen.getAllByText('ananya')[0])

        await waitFor(() =>
            expect(screen.getByText('median 81.1%')).toBeTruthy()
        )
        expect(screen.getByText('median 13.5s')).toBeTruthy()
    })

    test('every column on the page is defined in plain language', async () => {
        await renderPage()

        expect(screen.getByText('What every column means')).toBeTruthy()
        expect(screen.getByText('Z score')).toBeTruthy()
        expect(
            screen.getByText(/It measures surprise, not skill or guilt/)
        ).toBeTruthy()
        expect(
            screen.getByText(/at 1 timed answer, "100%" means one slow answer/)
        ).toBeTruthy()
    })

    test('the board states how many answers a median rests on', async () => {
        await renderPage()

        // 22.3s over a single timed answer is not a median of anything.
        expect(screen.getByText('1 timed')).toBeTruthy()
        expect(screen.getByText('12 timed')).toBeTruthy()
    })

    test('a recent answer shows how many others got it right', async () => {
        await renderPage()
        await userEvent.click(screen.getAllByText('ananya')[0])

        await waitFor(() =>
            expect(
                screen.getByText(/law of conservation of energy/)
            ).toBeTruthy()
        )
        expect(screen.getByText('Wrong')).toBeTruthy()
        expect(screen.getByText('80.0%')).toBeTruthy()
    })
})
