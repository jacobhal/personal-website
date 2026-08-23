import { describe, expect, test } from 'vitest'

import { pages, rewriteHead } from './appPageMeta'

/** The shape Vite emits: the personal site's head plus the hashed bundle. */
const INDEX = `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <!-- Linkedin Image -->
        <meta property="og:image" content="/favicon-1024.png" />
        <link rel="shortcut icon" href="https://jacobhal.se/favicon.ico" />
        <link rel="stylesheet" href="https://example.test/bootstrap.min.css" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <link rel="manifest" href="/manifest.json" />
        <title>Jacob Hallman - Fullstack developer</title>
        <meta name="description" content="The personal website of Jacob Hallman - A fullstack developer. @jacobhal at Github." />
      <script type="module" crossorigin src="/assets/index-Zf_HRMkA.js"></script>
    </head>
    <body>
        <div id="root"></div>
    </body>
</html>`

const skarp = () => pages().find((page) => page.file === 'skarp.html')!
const krydda = () => pages().find((page) => page.file === 'krydda.html')!

describe('appPageMeta', () => {
    test('emits one page per app marketing route', () => {
        expect(pages().map((page) => page.route)).toEqual(['/skarp', '/krydda'])
    })

    test('removes every trace of the personal site from the head', () => {
        const html = rewriteHead(INDEX, skarp())

        expect(html).not.toContain('Jacob Hallman')
        expect(html).not.toContain('Fullstack developer')
        expect(html).not.toContain('favicon-1024.png')
        expect(html).not.toContain('jacobhal.se/favicon.ico')
    })

    test('carries the app metadata a link crawler reads', () => {
        const html = rewriteHead(INDEX, skarp())

        expect(html).toContain('<title>Skarp — quizet som gör dig vassare</title>')
        expect(html).toContain(
            '<meta property="og:image" content="https://jacobhal.se/app-social/skarp-og.png" />'
        )
        expect(html).toContain(
            '<link rel="canonical" href="https://jacobhal.se/skarp" />'
        )
        expect(html).toContain('<meta property="og:site_name" content="Skarp" />')
        expect(html).toContain('name="twitter:card" content="summary_large_image"')
    })

    test('keeps the bundle and the shared head tags so the SPA still boots', () => {
        const html = rewriteHead(INDEX, krydda())

        expect(html).toContain('src="/assets/index-Zf_HRMkA.js"')
        expect(html).toContain('name="viewport"')
        expect(html).toContain('<meta charset="utf-8" />')
    })

    test('swaps the personal manifest for the app one', () => {
        const html = rewriteHead(INDEX, krydda())

        // manifest.json names "Jacob Hallman" and declares favicon.ico as its
        // icon, so leaving it in put the J monogram back on the tab.
        expect(html).not.toContain('href="/manifest.json"')
        expect(html).toContain('href="/app-icons/krydda.webmanifest"')
        expect(html).toContain(
            '<meta name="apple-mobile-web-app-title" content="Krydda" />'
        )
    })

    test('declares the crawler language on the document', () => {
        expect(rewriteHead(INDEX, krydda())).toContain('<html lang="sv">')
    })

    test('gives each app its own favicon and store banner', () => {
        expect(rewriteHead(INDEX, krydda())).toContain(
            'content="app-id=6777108071"'
        )
        expect(rewriteHead(INDEX, skarp())).toContain(
            'href="/app-icons/skarp-32.png"'
        )
    })

    test('escapes quotes so a stray character cannot break an attribute', () => {
        const html = rewriteHead(INDEX, {
            ...skarp(),
            ogTitle: 'Say "hi" & <run>',
        })

        expect(html).toContain('&quot;hi&quot; &amp; &lt;run&gt;')
        expect(html).not.toContain('content="Say "hi"')
    })
})
