import React, { useMemo } from 'react'
import { Helmet } from 'react-helmet'
import { useLocation, useParams } from 'react-router-dom'

import {
    liveRoomEmbedUrl,
    normalizeLiveRoomCode,
    type LiveRoomLocale,
} from './liveRoomEmbed'
import './SkarpLiveRoom.scss'

const browserLocale = (): LiveRoomLocale => {
    const language = document.documentElement.lang || navigator.language
    return language.toLowerCase().startsWith('sv') ? 'sv' : 'en'
}

const SkarpLiveRoom: React.FC = () => {
    const { code: routeCode = '' } = useParams<{ code: string }>()
    const location = useLocation()
    const displayMode = location.pathname.endsWith('/display')
    const code = normalizeLiveRoomCode(routeCode)
    const locale = browserLocale()
    const source = useMemo(
        () => liveRoomEmbedUrl(code, displayMode, locale),
        [code, displayMode, locale]
    )
    const frameTitle = displayMode
        ? 'Skarp Live Quiz display'
        : 'Skarp Live Quiz'

    return (
        <main className="skarp-live-room">
            <Helmet>
                <title>{frameTitle}</title>
                <meta
                    name="description"
                    content="Join a Skarp live quiz or show the shared game screen."
                />
            </Helmet>
            <iframe
                className="skarp-live-room__frame"
                src={source}
                title={frameTitle}
                allow="clipboard-write"
            />
        </main>
    )
}

export default SkarpLiveRoom
