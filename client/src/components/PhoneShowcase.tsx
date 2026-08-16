import React, { useEffect, useRef, useState } from 'react'
import { Box } from '@mui/material'

export interface PhoneShowcaseProps {
    /** Poster/still frame. Always present — the section reads correctly even if
     *  no video has been recorded for it yet. */
    image: string
    /** Optional screen recording. When given it replaces the still, muted and
     *  looping, and only starts once the phone is actually on screen. */
    video?: string
    alt: string
}

/**
 * A phone frame holding either a screen recording or a still.
 *
 * Video is treated as an upgrade, never a requirement: a section without one
 * still shows its screenshot, so the page is never broken by a missing asset.
 *
 * Playback is deferred until the frame scrolls into view. Autoplaying several
 * videos at once on a marketing page costs battery and decode bandwidth, and on
 * mobile Safari it is the difference between a smooth page and a stuttering one.
 */
export const PhoneShowcase: React.FC<PhoneShowcaseProps> = ({
    image,
    video,
    alt,
}) => {
    const wrapRef = useRef<HTMLDivElement | null>(null)
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const [inView, setInView] = useState(false)

    useEffect(() => {
        const node = wrapRef.current
        if (!node || typeof IntersectionObserver === 'undefined') {
            // No observer (older browser, SSR, test env): show it rather than
            // leave a blank frame.
            setInView(true)
            return
        }
        const observer = new IntersectionObserver(
            ([entry]) => setInView(entry.isIntersecting),
            { threshold: 0.25 }
        )
        observer.observe(node)
        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        const el = videoRef.current
        if (!el) return
        if (inView) {
            // play() rejects when the tab is backgrounded or autoplay is
            // blocked; the poster stays up, which is a fine outcome.
            void el.play().catch(() => undefined)
        } else {
            el.pause()
        }
    }, [inView])

    return (
        <Box
            ref={wrapRef}
            sx={{
                position: 'relative',
                width: { xs: 232, sm: 268 },
                mx: 'auto',
                // The frame: a dark bezel with a soft shadow, so a screenshot
                // with a white background still reads as "a phone".
                borderRadius: '38px',
                border: '10px solid #0E0C0A',
                backgroundColor: '#0E0C0A',
                boxShadow:
                    '0 30px 70px rgba(0,0,0,0.55), 0 2px 0 rgba(255,255,255,0.06) inset',
                overflow: 'hidden',
                lineHeight: 0,
            }}
        >
            {video ? (
                <video
                    ref={videoRef}
                    src={video}
                    poster={image}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-label={alt}
                    style={{ width: '100%', display: 'block' }}
                />
            ) : (
                <Box
                    component="img"
                    src={image}
                    alt={alt}
                    loading="lazy"
                    sx={{ width: '100%', display: 'block' }}
                />
            )}
        </Box>
    )
}

export default PhoneShowcase
