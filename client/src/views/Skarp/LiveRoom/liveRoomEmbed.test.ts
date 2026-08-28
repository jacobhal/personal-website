import { describe, expect, test } from 'vitest'

import { liveRoomEmbedUrl } from './liveRoomEmbed'

describe('liveRoomEmbedUrl', () => {
    test('passes normalized room, display mode, and locale to Flutter Web', () => {
        expect(liveRoomEmbedUrl(' ab-c234 ', true, 'sv')).toBe(
            '/skarp-live/index.html?code=ABC234&display=1&locale=sv'
        )
    })

    test('does not enable display mode for a joining player', () => {
        expect(liveRoomEmbedUrl('ABC234', false, 'en')).toBe(
            '/skarp-live/index.html?code=ABC234&locale=en'
        )
    })
})
