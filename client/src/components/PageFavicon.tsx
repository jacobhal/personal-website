import React from 'react'
import { Helmet } from 'react-helmet'

export interface PageFaviconProps {
    /** 32px icon shown in the browser tab. */
    icon32: string
    /** 180px icon used when the page is saved to a home screen. */
    icon180: string
}

/**
 * Swaps the tab icon for a product page.
 *
 * jacobhal.se hosts several apps under one domain, so every tab carried the
 * personal-site favicon and they were indistinguishable when a few were open at
 * once. `react-helmet` replaces same-`rel` tags rather than appending, so
 * leaving a page restores the site default from index.html.
 */
export const PageFavicon: React.FC<PageFaviconProps> = ({ icon32, icon180 }) => (
    <Helmet>
        <link rel="icon" type="image/png" sizes="32x32" href={icon32} />
        <link rel="shortcut icon" type="image/png" href={icon32} />
        <link rel="apple-touch-icon" sizes="180x180" href={icon180} />
    </Helmet>
)

export default PageFavicon
