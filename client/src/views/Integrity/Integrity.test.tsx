import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, describe, expect, test, vi } from 'vitest'

const renderIntegrity = async (): Promise<string> => {
    // The Supabase target is read into a module constant at import time, so the
    // env has to be stubbed before the module graph is pulled in.
    const { Integrity } = await import('./Integrity')
    return renderToStaticMarkup(<Integrity />)
}

afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
})

describe('/skarp/integrity', () => {
    test('an unconfigured build says which variables are missing', async () => {
        vi.stubEnv('VITE_SUPABASE_SKARP_URL', '')
        vi.stubEnv('VITE_SUPABASE_SKARP_ANON_KEY', '')

        const html = await renderIntegrity()

        expect(html).toContain('VITE_SUPABASE_SKARP_URL')
        expect(html).not.toContain('Review board')
    })

    test('without a passphrase it shows the gate and no player data', async () => {
        vi.stubEnv('VITE_SUPABASE_SKARP_URL', 'https://example.supabase.co')
        vi.stubEnv('VITE_SUPABASE_SKARP_ANON_KEY', 'anon-key')

        const html = await renderIntegrity()

        expect(html).toContain('Passphrase')
        expect(html).toContain('type="password"')
        // The board and the search only exist once a passphrase is accepted.
        expect(html).not.toContain('Review board')
        expect(html).not.toContain('Find a player')
    })

    test('it states that the page cannot restrict anyone', async () => {
        vi.stubEnv('VITE_SUPABASE_SKARP_URL', 'https://example.supabase.co')
        vi.stubEnv('VITE_SUPABASE_SKARP_ANON_KEY', 'anon-key')

        const html = await renderIntegrity()

        expect(html).toContain('never proof of cheating')
        expect(html).toContain('nothing on this page can restrict an account')
    })
})
