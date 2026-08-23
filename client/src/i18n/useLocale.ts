import { useCallback, useEffect, useState } from 'react'

import { LOCALE_STORAGE_KEY, resolveLocale, type Locale } from './locale'

const readStored = (): string | null => {
    try {
        return window.localStorage.getItem(LOCALE_STORAGE_KEY)
    } catch {
        // Safari private mode throws on localStorage access. A missing
        // preference is not worth failing the page over.
        return null
    }
}

const writeStored = (locale: Locale): void => {
    try {
        window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
    } catch {
        // Same as above: the toggle still works for this page view.
    }
}

const initialLocale = (): Locale => {
    if (typeof window === 'undefined') return 'en'
    return resolveLocale({
        search: window.location.search,
        stored: readStored(),
        languages: window.navigator.languages ?? [
            window.navigator.language,
        ].filter(Boolean),
    })
}

export interface UseLocaleResult {
    locale: Locale
    setLocale: (next: Locale) => void
}

/**
 * Language state for a marketing page.
 *
 * Also keeps `<html lang>` truthful, which matters for screen readers and for
 * the automatic-translation prompts browsers show on a mismatched page.
 */
export const useLocale = (): UseLocaleResult => {
    const [locale, setLocaleState] = useState<Locale>(initialLocale)

    useEffect(() => {
        document.documentElement.setAttribute('lang', locale)
    }, [locale])

    const setLocale = useCallback((next: Locale) => {
        writeStored(next)
        setLocaleState(next)
    }, [])

    return { locale, setLocale }
}
