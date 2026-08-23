import { useEffect } from 'react'

export interface PageFaviconProps {
    /** 32px icon shown in the browser tab. */
    icon32: string
    /** 180px icon used when the page is saved to a home screen. */
    icon180: string
    /** Per-app web manifest. Without it the page keeps the personal site's
     *  manifest.json, which names "Jacob Hallman" and declares favicon.ico —
     *  the J monogram — so browsers can still pick that for the tab and for a
     *  home-screen shortcut even after the icon links are replaced. */
    manifest?: string
}

const ICON_SELECTOR =
    'link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"], link[rel="manifest"]'

/**
 * Swaps the tab icon for a product page.
 *
 * Deliberately imperative rather than a `react-helmet` block. Helmet *appends*
 * its links, so index.html's own `<link rel="shortcut icon">` stayed in the
 * document — first in the head, with an absolute URL — and browsers kept using
 * it. Safari is the strictest: it resolves the favicon from the initial HTML
 * before React runs and ignores links added afterwards unless the old ones are
 * actually gone.
 *
 * So this removes every existing icon link, inserts its own, and puts the
 * originals back on unmount, leaving the personal site's favicon intact
 * everywhere else.
 */
export const PageFavicon: React.FC<PageFaviconProps> = ({
    icon32,
    icon180,
    manifest,
}) => {
    useEffect(() => {
        const head = document.head
        const previous = Array.from(head.querySelectorAll(ICON_SELECTOR))
        previous.forEach((node) => node.remove())

        const added = (
            [
                ['icon', icon32, 'image/png', '32x32'],
                ['shortcut icon', icon32, 'image/png', undefined],
                ['apple-touch-icon', icon180, undefined, '180x180'],
                ...(manifest
                    ? ([['manifest', manifest, undefined, undefined]] as const)
                    : []),
            ] as const
        ).map(([rel, href, type, sizes]) => {
            const link = document.createElement('link')
            link.setAttribute('rel', rel)
            link.setAttribute('href', href)
            if (type) link.setAttribute('type', type)
            if (sizes) link.setAttribute('sizes', sizes)
            head.appendChild(link)
            return link
        })

        return () => {
            added.forEach((node) => node.remove())
            previous.forEach((node) => head.appendChild(node))
        }
    }, [icon32, icon180, manifest])

    return null
}

export default PageFavicon
