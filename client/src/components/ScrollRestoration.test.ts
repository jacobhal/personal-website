import { describe, expect, test, vi } from 'vitest'

import { scrollToLocation } from './ScrollRestoration'

describe('scrollToLocation', () => {
    test('scrolls a normal route to the top', () => {
        const scrollToTop = vi.fn()

        scrollToLocation('', () => null, scrollToTop)

        expect(scrollToTop).toHaveBeenCalledOnce()
    })

    test('keeps intentional hash navigation on its target', () => {
        const scrollToTop = vi.fn()
        const scrollIntoView = vi.fn()

        scrollToLocation(
            '#selected-work',
            (id) => (id === 'selected-work' ? { scrollIntoView } : null),
            scrollToTop
        )

        expect(scrollIntoView).toHaveBeenCalledWith({
            behavior: 'smooth',
            block: 'start',
        })
        expect(scrollToTop).not.toHaveBeenCalled()
    })
})
