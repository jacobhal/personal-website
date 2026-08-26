// @vitest-environment jsdom

import React from 'react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { Skarp } from './Skarp'
import { Krydda } from './Krydda'
import { LOCALE_STORAGE_KEY } from '../i18n/locale'

/**
 * This jsdom runs without `--localstorage-file`, so `window.localStorage` is
 * undefined. The hook tolerates that (Safari private mode behaves the same
 * way), but the stored-preference test needs somewhere to store a preference.
 */
const installMemoryStorage = () => {
    let store = new Map<string, string>()
    Object.defineProperty(window, 'localStorage', {
        configurable: true,
        value: {
            getItem: (key: string) => store.get(key) ?? null,
            setItem: (key: string, value: string) => store.set(key, value),
            removeItem: (key: string) => store.delete(key),
            clear: () => {
                store = new Map()
            },
        },
    })
}

/** jsdom implements neither, and `PhoneShowcase` autoplays its clips. */
const stubMediaPlayback = () => {
    vi.spyOn(window.HTMLMediaElement.prototype, 'play').mockResolvedValue()
    vi.spyOn(window.HTMLMediaElement.prototype, 'pause').mockImplementation(
        () => undefined
    )
}

const setBrowserLanguages = (languages: string[]) => {
    Object.defineProperty(window.navigator, 'languages', {
        configurable: true,
        get: () => languages,
    })
}

const visit = (url: string) => window.history.replaceState({}, '', url)

const renderPage = (page: React.ReactElement) =>
    render(<MemoryRouter>{page}</MemoryRouter>)

/** Both pages repeat the store buttons in the hero and the closing call to
 *  action, so every store query is deliberately "the first of the pair". */
const storeLink = (name: string) => screen.getAllByRole('link', { name })[0]

const href = (name: string) => storeLink(name).getAttribute('href')

beforeEach(() => {
    window.scrollTo = vi.fn()
    installMemoryStorage()
    stubMediaPlayback()
    setBrowserLanguages(['en-US'])
    visit('/')
})

afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
})

describe('marketing page language', () => {
    test('serves Swedish copy to a Swedish browser', () => {
        setBrowserLanguages(['sv-SE', 'en-US'])
        renderPage(<Skarp />)

        expect(
            screen.getByText(/Quizet som gör dig vassare/)
        ).toBeTruthy()
        expect(storeLink('Ladda ner på App Store')).toBeTruthy()
    })

    test('serves English copy to an English browser', () => {
        renderPage(<Skarp />)

        expect(storeLink('Download on the App Store')).toBeTruthy()
    })

    test('lets a campaign link pin the language', () => {
        setBrowserLanguages(['sv-SE'])
        visit('/skarp?lang=en')
        renderPage(<Skarp />)

        expect(storeLink('Download on the App Store')).toBeTruthy()
    })

    test('remembers an explicit choice over the browser language', () => {
        setBrowserLanguages(['en-US'])
        window.localStorage.setItem(LOCALE_STORAGE_KEY, 'sv')
        renderPage(<Krydda />)

        expect(screen.getByText('Alla recept du gillar.')).toBeTruthy()
    })

    test('Krydda follows the same rules as Skarp', () => {
        setBrowserLanguages(['sv-SE'])
        renderPage(<Krydda />)

        expect(storeLink('Hämta på Google Play')).toBeTruthy()
    })
})

describe('marketing pages carry no personal-site branding', () => {
    test.each([
        ['Skarp', <Skarp key="skarp" />],
        ['Krydda', <Krydda key="krydda" />],
    ])('%s shows the app, not the portfolio', (_name, page) => {
        const { container } = renderPage(page)

        expect(screen.queryByText('Jacob Hallman')).toBeNull()
        expect(screen.queryByRole('link', { name: 'Resume' })).toBeNull()
        expect(screen.queryByRole('link', { name: 'Portfolio' })).toBeNull()
        expect(
            container.querySelector('img[alt="Jacob Hallman"]')
        ).toBeNull()
        expect(container.querySelector('.site-navbar')).toBeNull()
    })
})

describe('store links', () => {
    test('never pin a store language or storefront', () => {
        renderPage(<Skarp />)

        const appStore = href('Download on the App Store')!
        const play = href('Get it on Google Play')!

        expect(appStore).not.toContain('l=en-GB')
        expect(appStore).not.toContain('/se/')
        expect(play).not.toContain('hl=')
    })

    test('forward the campaign that produced the visit to both stores', () => {
        visit('/skarp?utm_source=tiktok&utm_medium=paid&utm_campaign=rush')
        renderPage(<Skarp />)

        expect(href('Download on the App Store')).toContain('ct=tiktok_rush')
        expect(href('Get it on Google Play')).toContain(
            'referrer=utm_source%3Dtiktok%26utm_medium%3Dpaid%26utm_campaign%3Drush'
        )
    })

    test('stay clean for organic traffic', () => {
        renderPage(<Krydda />)

        expect(href('Download on the App Store')).toBe(
            'https://apps.apple.com/app/id6777108071'
        )
        expect(href('Get it on Google Play')).toBe(
            'https://play.google.com/store/apps/details?id=se.jacobhallman.krydda'
        )
    })
})

describe('Krydda showcase recording', () => {
    test('English visitors get the English screen recording', () => {
        const { container } = renderPage(<Krydda />)

        const video = container.querySelector('video')

        expect(video?.getAttribute('src')).toBe(
            '/krydda-media/web-import-en.mp4'
        )
        expect(video?.getAttribute('poster')).toBe(
            '/krydda-media/web-import-en-poster.jpg'
        )
    })

    test('Swedish visitors keep the Swedish screen recording', () => {
        setBrowserLanguages(['sv-SE', 'en-US'])
        const { container } = renderPage(<Krydda />)

        const video = container.querySelector('video')

        expect(video?.getAttribute('src')).toBe('/krydda-media/web-import.mp4')
        expect(video?.getAttribute('poster')).toBe(
            '/krydda-media/web-import-poster.jpg'
        )
    })
})
