import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import type { Plugin } from 'vite'

import { SKARP_COPY } from '../src/views/Skarp/skarpContent'
import { KRYDDA_COPY } from '../src/views/Krydda/kryddaContent'
import type { Locale } from '../src/i18n/locale'

/**
 * The language a link crawler gets.
 *
 * Crawlers send no useful `Accept-Language`, so the prerendered card has to
 * commit to one language. Swedish, because that is where the paid and organic
 * traffic for both apps comes from. Human visitors are unaffected — React
 * re-renders in their own language the moment it boots.
 */
const CRAWLER_LOCALE: Locale = 'sv'

export interface AppPage {
    /** Output file, served for the route by the .htaccess rewrite. */
    file: string
    route: string
    siteName: string
    title: string
    description: string
    ogTitle: string
    ogDescription: string
    image: string
    icon32: string
    icon180: string
    themeColor: string
    appleAppId: string
}

export const pages = (): AppPage[] => {
    const skarp = SKARP_COPY[CRAWLER_LOCALE]
    const krydda = KRYDDA_COPY[CRAWLER_LOCALE]
    return [
        {
            file: 'skarp.html',
            route: '/skarp',
            siteName: 'Skarp',
            title: skarp.metaTitle,
            description: skarp.metaDescription,
            ogTitle: skarp.ogTitle,
            ogDescription: skarp.ogDescription,
            image: 'https://jacobhal.se/app-social/skarp-og.png',
            icon32: '/app-icons/skarp-32.png',
            icon180: '/app-icons/skarp-180.png',
            themeColor: '#0E0E14',
            appleAppId: '6763050250',
        },
        {
            file: 'krydda.html',
            route: '/krydda',
            siteName: 'Krydda',
            title: krydda.metaTitle,
            description: krydda.metaDescription,
            ogTitle: krydda.ogTitle,
            ogDescription: krydda.ogDescription,
            image: 'https://jacobhal.se/krydda-media/og-image.jpg',
            icon32: '/app-icons/krydda-32.png',
            icon180: '/app-icons/krydda-180.png',
            themeColor: '#14110E',
            appleAppId: '6777108071',
        },
    ]
}

const escapeAttribute = (value: string): string =>
    value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')

const head = (page: AppPage): string => {
    const attr = escapeAttribute
    return `        <title>${attr(page.title)}</title>
        <meta name="description" content="${attr(page.description)}" />
        <meta name="theme-color" content="${page.themeColor}" />
        <link rel="canonical" href="https://jacobhal.se${page.route}" />
        <link rel="icon" type="image/png" sizes="32x32" href="${page.icon32}" />
        <link rel="shortcut icon" href="${page.icon32}" />
        <link rel="apple-touch-icon" sizes="180x180" href="${page.icon180}" />
        <meta name="apple-itunes-app" content="app-id=${page.appleAppId}" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="${attr(page.siteName)}" />
        <meta property="og:locale" content="sv_SE" />
        <meta property="og:locale:alternate" content="en_GB" />
        <meta property="og:title" content="${attr(page.ogTitle)}" />
        <meta property="og:description" content="${attr(page.ogDescription)}" />
        <meta property="og:url" content="https://jacobhal.se${page.route}" />
        <meta property="og:image" content="${page.image}" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${attr(page.ogTitle)}" />
        <meta name="twitter:description" content="${attr(page.ogDescription)}" />
        <meta name="twitter:image" content="${page.image}" />`
}

/** Everything the personal site puts in `<head>` that must not survive here. */
const STRIP_PATTERNS: RegExp[] = [
    /^\s*<title>[\s\S]*?<\/title>\s*$/,
    /^\s*<meta\s+name="description"[\s\S]*?\/>\s*$/,
    /^\s*<meta\s+property="og:image"[\s\S]*?\/>\s*$/,
    /^\s*<meta\s+name="theme-color"[\s\S]*?\/>\s*$/,
    /^\s*<link\s+rel="shortcut icon"[\s\S]*?\/>\s*$/,
    /^\s*<!--\s*Linkedin Image\s*-->\s*$/,
]

/**
 * Removes the personal-site tags, keeping everything else (the stylesheet, the
 * viewport, the manifest, and the hashed module script Vite injected).
 */
export const rewriteHead = (html: string, page: AppPage): string => {
    const withoutOwn = html.replace(
        /<head>([\s\S]*?)<\/head>/,
        (_match, inner: string) => {
            const kept = inner
                .split(/\n(?=\s*<)/)
                .filter(
                    (chunk) =>
                        !STRIP_PATTERNS.some((pattern) => pattern.test(chunk))
                )
                .join('\n')
            return `<head>\n${kept.replace(/\s+$/, '')}\n${head(page)}\n    </head>`
        }
    )
    return withoutOwn.replace(/<html lang="[^"]*">/, `<html lang="sv">`)
}

/**
 * Writes a static HTML entry per app marketing route.
 *
 * The site is a client-rendered SPA on static Apache hosting, so every route
 * was served the same `index.html` — the one titled "Jacob Hallman - Fullstack
 * developer" with the personal favicon as its social image. `react-helmet`
 * fixes that only after React boots, and no link crawler (TikTok, iMessage,
 * WhatsApp, Slack, Facebook, LinkedIn) runs JavaScript. Every shared
 * `/skarp` or `/krydda` link therefore previewed as a developer CV.
 *
 * These files carry the app's own metadata in the initial HTML while loading
 * exactly the same bundle, so the SPA behaves as before for real visitors.
 * `.htaccess` points the routes at them.
 */
export const appPageMeta = (): Plugin => ({
    name: 'app-page-meta',
    apply: 'build',
    // `writeBundle` runs after Vite has written index.html to the out dir.
    async writeBundle(options) {
        const outDir = options.dir ?? resolve(process.cwd(), 'build')
        const indexPath = resolve(outDir, 'index.html')
        const index = await readFile(indexPath, 'utf8')

        for (const page of pages()) {
            await writeFile(
                resolve(outDir, page.file),
                rewriteHead(index, page),
                'utf8'
            )
        }
    },
})

export default appPageMeta
