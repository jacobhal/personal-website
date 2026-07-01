import React from 'react'
import { describe, expect, test } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { Routes } from '../routes'
import { Krydda } from './Krydda'
import { Skarp } from './Skarp'

const renderHtml = (element: React.ReactElement) => renderToStaticMarkup(element)

describe('app legal links', () => {
    test('Krydda landing page links to privacy policy and terms', () => {
        const html = renderHtml(<Krydda />)

        expect(html).toContain('href="/krydda/privacy"')
        expect(html).toContain('href="/krydda/terms"')
    })

    test('Skarp landing page links to privacy policy and terms', () => {
        const html = renderHtml(<Skarp />)

        expect(html).toContain('href="/skarp/privacy"')
        expect(html).toContain('href="/skarp/terms"')
    })

    test('Skarp terms route renders terms page', () => {
        const html = renderHtml(
            <MemoryRouter initialEntries={['/skarp/terms']}>
                <Routes />
            </MemoryRouter>
        )

        expect(html).toContain('Användarvillkor')
    })
})
