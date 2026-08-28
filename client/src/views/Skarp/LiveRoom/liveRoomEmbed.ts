export type LiveRoomLocale = 'en' | 'sv'

export const normalizeLiveRoomCode = (value: string): string =>
    value.replace(/[^a-z0-9]/gi, '').toUpperCase()

export const liveRoomEmbedUrl = (
    code: string,
    displayMode: boolean,
    locale: LiveRoomLocale
): string => {
    const params = new URLSearchParams({
        code: normalizeLiveRoomCode(code),
    })
    if (displayMode) params.set('display', '1')
    params.set('locale', locale)
    return `/skarp-live/index.html?${params.toString()}`
}
