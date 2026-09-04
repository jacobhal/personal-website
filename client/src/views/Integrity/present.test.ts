import { describe, expect, test } from 'vitest'

import {
    COLUMN_GLOSSARY,
    bandColor,
    countLabel,
    compareToMedian,
    describeCoverage,
    formatPercent,
    formatSeconds,
    formatZ,
    sampleCaveats,
} from './present'

describe('formatting', () => {
    test('a missing measurement reads as unknown, never as zero', () => {
        expect(formatPercent(null)).toBe('—')
        expect(formatSeconds(null)).toBe('—')
        expect(formatZ(null)).toBe('—')
    })

    test('percentages and seconds keep one useful digit', () => {
        expect(formatPercent(0.8108)).toBe('81.1%')
        expect(formatSeconds(22279)).toBe('22.3s')
        expect(formatZ(1.53206)).toBe('1.53')
    })
})

describe('comparison against the population', () => {
    test('reports the gap and its direction', () => {
        expect(compareToMedian(0.875, 0.81)).toEqual({
            delta: expect.closeTo(0.065, 5),
            direction: 'above',
        })
        expect(compareToMedian(0.5, 0.81).direction).toBe('below')
    })

    test('an equal value is neither above nor below', () => {
        expect(compareToMedian(0.81, 0.81).direction).toBe('level')
    })

    // Without this the panel would draw a red "above median" chip against a
    // median that does not exist yet, which is the state on a quiet week.
    test('no median means no comparison', () => {
        expect(compareToMedian(0.875, null)).toEqual({
            delta: null,
            direction: 'unknown',
        })
        expect(compareToMedian(null, 0.81).direction).toBe('unknown')
    })
})

describe('sample-size caveats', () => {
    // Live production example: ananya's slow-correct share read 100%, off a
    // single timed answer. Presented bare it says "always answers slowly".
    test('names the measurement that rests on too few answers', () => {
        const caveats = sampleCaveats({
            scored_answers: 16,
            timed_answers: 1,
            hard_answers: 1,
        })

        expect(caveats).toContain(
            'Timing is based on 1 timed answer.'
        )
        expect(caveats).toContain(
            'Hard-question accuracy is based on 1 answer.'
        )
    })

    test('a well-sampled account carries no caveat', () => {
        expect(
            sampleCaveats({
                scored_answers: 120,
                timed_answers: 90,
                hard_answers: 30,
            })
        ).toEqual([])
    })

    test('too few comparable answers is itself a caveat', () => {
        expect(
            sampleCaveats({
                scored_answers: 3,
                timed_answers: 40,
                hard_answers: 40,
            })
        ).toContain(
            'Only 3 comparable answers. Every figure here is noise at this sample size.'
        )
    })
})

describe('coverage', () => {
    // scored_answers counts only answers whose question has enough ranked
    // answers overall to carry a difficulty estimate. At low volume that is a
    // small fraction of what the player actually played, and hiding the gap
    // makes an active account look idle.
    test('explains the gap between played and comparable answers', () => {
        expect(describeCoverage(16, 214)).toBe(
            '16 comparable of 214 ranked answers'
        )
    })

    test('says so plainly when nothing is comparable yet', () => {
        expect(describeCoverage(0, 12)).toBe(
            'No comparable answers yet, from 12 ranked answers'
        )
    })

    test('handles an account that has not played ranked at all', () => {
        expect(describeCoverage(0, 0)).toBe('No ranked answers yet')
    })
})

describe('count labels', () => {
    test('a single item is not pluralised', () => {
        expect(countLabel(1, 'answer')).toBe('1 answer')
        expect(countLabel(0, 'answer')).toBe('0 answers')
        expect(countLabel(7, 'timed answer')).toBe('7 timed answers')
    })
})

describe('glossary', () => {
    test('every column shown on the page has a definition', () => {
        const terms = COLUMN_GLOSSARY.map((entry) => entry.term)
        for (const column of [
            'Answers',
            'Accuracy',
            'Expected accuracy (exp)',
            'Z score',
            'Hard-question accuracy',
            'Median time',
            'Correct answers over 12s',
            'App exits',
            'Band',
            'Restricted',
        ]) {
            expect(terms).toContain(column)
        }
    })

    // The z score is the one number that reads as a verdict if left undefined,
    // so its entry has to say what it is not.
    test('the z score entry says it is not proof', () => {
        const entry = COLUMN_GLOSSARY.find((row) => row.term === 'Z score')
        expect(entry?.meaning).toMatch(/not skill or guilt/)
    })

    test('no definition is a stub', () => {
        for (const entry of COLUMN_GLOSSARY) {
            expect(entry.meaning.length).toBeGreaterThan(60)
        }
    })
})

describe('bands', () => {
    test('each band has its own colour', () => {
        const colors = new Set([
            bandColor('high'),
            bandColor('review'),
            bandColor('watch'),
        ])
        expect(colors.size).toBe(3)
    })
})
