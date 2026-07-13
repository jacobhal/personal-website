import { describe, expect, test } from 'vitest'

import { portfolioProjects } from './portfolioData'

describe('portfolio project selection', () => {
    test('keeps the current nine-card showcase in presentation order', () => {
        expect(portfolioProjects.map((project) => project.title)).toEqual([
            'HitQuiz',
            'Dagens Ord',
            'Skarp',
            'Krydda',
            'Congress Filings',
            'React Playground',
            'Corona Dashboard',
            'Restocker',
            'Complete Git Guide',
        ])
    })

    test('does not surface stale projects in the showcase', () => {
        expect(
            portfolioProjects.some(
                (project) => project.title === 'Stock predictor'
            )
        ).toBe(false)
        expect(
            portfolioProjects.some(
                (project) => project.title === 'Game review website'
            )
        ).toBe(false)
    })
})
