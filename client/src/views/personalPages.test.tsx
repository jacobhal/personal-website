import React from 'react'
import { describe, expect, test } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'

import { Home } from './Home'
import { Resume } from './Resume'
import { About } from './About'
import { Contact } from './Contact'

const renderHtml = (element: React.ReactElement) =>
    renderToStaticMarkup(element)

describe('main personal pages', () => {
    test('Home presents a current personal introduction', () => {
        const html = renderHtml(<Home />)

        expect(html).toContain('Browse projects')
        expect(html).toContain('Current projects')
    })

    test('Resume presents both CV downloads', () => {
        const html = renderHtml(<Resume />)

        expect(html).toContain('Download Swedish CV')
        expect(html).toContain('Download English CV')
    })

    test('About keeps the important external links', () => {
        const html = renderHtml(<About />)

        expect(html).toContain('https://github.com/jacobhal')
        expect(html).toContain('https://www.linkedin.com/in/jacob-hallman-603829164/')
        expect(html).toContain('kth.diva-portal.org')
    })

    test('Contact keeps the mail form available', () => {
        const html = renderHtml(<Contact />)

        expect(html).toContain('id="contact-form"')
        expect(html).toContain('id="contact-name"')
        expect(html).toContain('name="message"')
        expect(html).toContain('<textarea')
    })
})
