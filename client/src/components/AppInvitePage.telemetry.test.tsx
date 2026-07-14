// @vitest-environment jsdom

import React from 'react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import {
    cleanup,
    fireEvent,
    render,
    screen,
    waitFor,
} from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const telemetry = vi.hoisted(() => ({
    captureAcquisitionFailure: vi.fn(),
    recordAcquisitionBreadcrumb: vi.fn(),
    setAcquisitionApp: vi.fn(),
}))

vi.mock('../services/acquisitionTelemetry', () => telemetry)

import AppInvitePage, { type AppInviteConfig } from './AppInvitePage'

const config = (overrides: Partial<AppInviteConfig> = {}): AppInviteConfig => ({
    app: 'skarp',
    appName: 'Skarp',
    appIcon: '/icon.png',
    appStoreUrl: 'https://apps.apple.com/app/id123',
    playStoreUrl:
        'https://play.google.com/store/apps/details?id=se.example.skarp',
    marketingPath: '/skarp',
    eyebrow: 'Challenge',
    headline: 'A friend challenged you',
    description: 'Play now.',
    codeLabel: 'Challenge code',
    accent: '#fff',
    background: '#000',
    surface: '#111',
    text: '#fff',
    muted: '#aaa',
    ...overrides,
})

const renderInvite = (inviteConfig = config()) =>
    render(
        <MemoryRouter initialEntries={['/skarp/invite/ABC234XYZ789']}>
            <Routes>
                <Route
                    path="/skarp/invite/:code"
                    element={<AppInvitePage config={inviteConfig} />}
                />
            </Routes>
        </MemoryRouter>
    )

beforeEach(() => {
    vi.clearAllMocks()
    window.scrollTo = vi.fn()
})

afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
})

describe('AppInvitePage telemetry', () => {
    test('records a typed landing breadcrumb without the invite code', async () => {
        renderInvite()

        await waitFor(() =>
            expect(telemetry.recordAcquisitionBreadcrumb).toHaveBeenCalledWith({
                app: 'skarp',
                stage: 'landing',
                outcome: 'valid',
            })
        )
        expect(
            JSON.stringify(telemetry.recordAcquisitionBreadcrumb.mock.calls)
        ).not.toContain('ABC234XYZ789')
    })

    test('captures clipboard failure with safe typed context', async () => {
        const failure = new Error('clipboard denied for ABC234XYZ789')
        Object.defineProperty(navigator, 'clipboard', {
            configurable: true,
            value: { writeText: vi.fn().mockRejectedValue(failure) },
        })
        renderInvite()

        fireEvent.click(
            screen.getByRole('button', { name: 'Copy invite code' })
        )

        await waitFor(() =>
            expect(telemetry.captureAcquisitionFailure).toHaveBeenCalledWith(
                failure,
                { app: 'skarp', stage: 'clipboard' }
            )
        )
        expect(telemetry.recordAcquisitionBreadcrumb).toHaveBeenCalledWith({
            app: 'skarp',
            stage: 'clipboard',
            outcome: 'failed',
        })
    })

    test('captures malformed store destination instead of throwing in render', async () => {
        renderInvite(config({ playStoreUrl: 'not a URL' }))

        await waitFor(() =>
            expect(telemetry.captureAcquisitionFailure).toHaveBeenCalledWith(
                expect.any(TypeError),
                {
                    app: 'skarp',
                    stage: 'store_navigation',
                    store: 'google_play',
                }
            )
        )
        expect(
            screen
                .getByRole('link', { name: 'Get it on Google Play' })
                .getAttribute('aria-disabled')
        ).toBe('true')
    })

    test('records only the app and store when navigation starts', () => {
        renderInvite()

        fireEvent.click(
            screen.getByRole('link', { name: 'Download on the App Store' })
        )

        expect(telemetry.recordAcquisitionBreadcrumb).toHaveBeenCalledWith({
            app: 'skarp',
            stage: 'store_navigation',
            outcome: 'started',
            store: 'app_store',
        })
    })
})
