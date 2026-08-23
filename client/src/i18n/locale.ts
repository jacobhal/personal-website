/**
 * Locale resolution for the app marketing pages.
 *
 * These pages are the destination for paid and organic traffic, and most of
 * that traffic is Swedish. Serving it English copy is a conversion leak, so the
 * page picks a language instead of hardcoding one.
 *
 * Precedence, highest first:
 *   1. `?lang=sv` / `?lang=en` — lets a campaign link pin a language.
 *   2. A previous explicit choice from the in-page toggle.
 *   3. The browser's own language list.
 *   4. English.
 */
export type Locale = 'sv' | 'en'

export const LOCALES: readonly Locale[] = ['sv', 'en']

export const LOCALE_STORAGE_KEY = 'jacobhal.appLocale'

const isLocale = (value: string | null | undefined): value is Locale =>
    value === 'sv' || value === 'en'

export interface LocaleSources {
    /** `window.location.search`, including the leading `?`. */
    search?: string
    /** A previously stored explicit choice. */
    stored?: string | null
    /** `navigator.languages`, most preferred first. */
    languages?: readonly string[]
}

/** Pure so the precedence rules can be tested without a DOM. */
export const resolveLocale = ({
    search = '',
    stored = null,
    languages = [],
}: LocaleSources = {}): Locale => {
    const requested = new URLSearchParams(search).get('lang')?.toLowerCase()
    if (isLocale(requested)) return requested

    if (isLocale(stored)) return stored

    for (const tag of languages) {
        // `sv`, `sv-SE`, `sv-FI` all mean Swedish copy. Compare on the primary
        // subtag so `sv-SE` does not fall through to English.
        if (tag?.toLowerCase().split('-')[0] === 'sv') return 'sv'
    }

    return 'en'
}

/** Picks the matching half of a `{ sv, en }` copy record. */
export const pick = <T,>(locale: Locale, copy: Record<Locale, T>): T =>
    copy[locale]
