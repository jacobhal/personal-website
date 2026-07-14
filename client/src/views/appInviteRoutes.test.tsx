// @vitest-environment jsdom

import React from 'react'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import {
    cleanup,
    fireEvent,
    render,
    screen,
    waitFor,
} from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { Routes } from '../routes'

const renderRoute = (path: string) =>
    render(
        <MemoryRouter initialEntries={[path]}>
            <Routes />
        </MemoryRouter>
    )

beforeEach(() => {
    window.scrollTo = vi.fn()
})

afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
})

describe('app invite routes', () => {
    test('normalizes and displays a valid Skarp referral code', () => {
        renderRoute('/skarp/invite/abc234xyz789')

        expect(
            screen.getByRole('heading', {
                name: 'A friend challenged you in Skarp',
            })
        ).toBeTruthy()
        expect(
            screen.getByText(
                'Play the same five questions and see who scores higher. Install Skarp, then use this challenge code.'
            )
        ).toBeTruthy()
        expect(screen.getByText('ABC234XYZ789')).toBeTruthy()
        expect(
            screen
                .getByRole('link', { name: 'Download on the App Store' })
                .getAttribute('href')
        ).toBe(
            'https://apps.apple.com/se/app/skarp-quiz-trivia/id6763050250?l=en-GB'
        )
        expect(
            screen
                .getByRole('link', { name: 'Get it on Google Play' })
                .getAttribute('href')
        ).toBe(
            'https://play.google.com/store/apps/details?id=se.jacobhallman.quizapp&hl=en&referrer=referral_code%3DABC234XYZ789'
        )
    })

    test('copies only after an explicit click', async () => {
        const writeText = vi.fn().mockResolvedValue(undefined)
        Object.defineProperty(navigator, 'clipboard', {
            configurable: true,
            value: { writeText },
        })

        renderRoute('/krydda/invite/9zx7wt4mnpqr')

        expect(writeText).not.toHaveBeenCalled()
        fireEvent.click(
            screen.getByRole('button', { name: 'Copy invite code' })
        )

        await waitFor(() =>
            expect(writeText).toHaveBeenCalledWith('9ZX7WT4MNPQR')
        )
        expect(screen.getByText('Code copied')).toBeTruthy()
    })

    test('uses existing store URLs and preserves code in Play referrer', () => {
        renderRoute('/krydda/invite/a2b3c4d5e6f7')

        expect(
            screen
                .getByRole('link', { name: 'Download on the App Store' })
                .getAttribute('href')
        ).toBe(
            'https://apps.apple.com/se/app/krydda-recipes-meal-plan/id6777108071?l=en-GB'
        )
        expect(
            screen
                .getByRole('link', { name: 'Get it on Google Play' })
                .getAttribute('href')
        ).toBe(
            'https://play.google.com/store/apps/details?id=se.jacobhallman.krydda&referrer=referral_code%3DA2B3C4D5E6F7'
        )
    })

    test('rejects non-Crockford codes with a friendly marketing-page fallback', () => {
        renderRoute('/skarp/invite/ABC234')

        expect(
            screen.getByRole('heading', {
                name: 'This invite link is not valid',
            })
        ).toBeTruthy()
        expect(
            screen
                .getByRole('link', { name: 'Visit the Skarp page' })
                .getAttribute('href')
        ).toBe('/skarp')
        expect(screen.queryByText('ABC234')).toBeNull()
    })

    test('rejects characters outside the backend alphabet', () => {
        renderRoute('/krydda/invite/I1O0ABCDEFGH')

        expect(
            screen.getByRole('heading', {
                name: 'This invite link is not valid',
            })
        ).toBeTruthy()
    })
})

describe('app-link association sources', () => {
    test('publishes iOS associations for both invite routes', () => {
        const association = JSON.parse(
            readFileSync(
                resolve('public/.well-known/apple-app-site-association'),
                'utf8'
            )
        )

        expect(association.applinks.details).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    appID: '9423J75LZV.se.jacobhallman.quizapp',
                    paths: ['/skarp/invite/*'],
                }),
                expect.objectContaining({
                    appID: '9423J75LZV.se.jacobhallman.krydda',
                    paths: ['/krydda/invite/*'],
                }),
            ])
        )
    })

    test('publishes the verified Google Play signing fingerprints', () => {
        const source = JSON.parse(
            readFileSync(
                resolve('association-files/assetlinks.json'),
                'utf8'
            )
        )
        const published = JSON.parse(
            readFileSync(
                resolve('public/.well-known/assetlinks.json'),
                'utf8'
            )
        )

        expect(published).toEqual(source)
        expect(published).toHaveLength(2)
        expect(published[0].target.package_name).toBe(
            'se.jacobhallman.quizapp'
        )
        expect(published[0].target.sha256_cert_fingerprints).toEqual([
            '86:4A:25:AC:D4:46:D2:66:D7:DF:C9:C4:F5:77:FF:E4:6A:3E:D3:5A:75:A7:52:DF:41:8E:A0:00:59:7C:A3:37',
        ])
        expect(published[1].target.package_name).toBe(
            'se.jacobhallman.krydda'
        )
        expect(published[1].target.sha256_cert_fingerprints).toEqual([
            '57:91:66:94:16:BE:CA:F6:2E:07:32:B6:97:03:69:BE:44:B1:C2:67:F3:87:D0:EE:8E:C4:54:FC:55:61:C5:29',
        ])
    })
})
