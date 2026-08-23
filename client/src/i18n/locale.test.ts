import { describe, expect, test } from 'vitest'

import { resolveLocale } from './locale'

describe('resolveLocale', () => {
    test('defaults to English with no signal at all', () => {
        expect(resolveLocale()).toBe('en')
    })

    test('uses Swedish for a Swedish browser', () => {
        expect(resolveLocale({ languages: ['sv-SE', 'en-US'] })).toBe('sv')
    })

    test('matches the primary subtag, not the whole tag', () => {
        expect(resolveLocale({ languages: ['sv-FI'] })).toBe('sv')
        expect(resolveLocale({ languages: ['en-GB'] })).toBe('en')
    })

    test('honours a stored choice over the browser language', () => {
        expect(
            resolveLocale({ stored: 'en', languages: ['sv-SE'] })
        ).toBe('en')
    })

    test('lets a campaign link pin the language over everything else', () => {
        expect(
            resolveLocale({
                search: '?lang=sv',
                stored: 'en',
                languages: ['en-US'],
            })
        ).toBe('sv')
    })

    test('ignores an unsupported language parameter', () => {
        expect(
            resolveLocale({ search: '?lang=de', languages: ['sv-SE'] })
        ).toBe('sv')
    })
})
