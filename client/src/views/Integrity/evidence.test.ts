import { describe, expect, test } from 'vitest'
import { scoreContributions, historyAssessment } from './evidence'

describe('review evidence', () => {
    test('explains a score-three performance outlier without inventing other signals', () => {
        expect(scoreContributions({ z_score: 3.01, background_events: 0, slow_correct_share: 0.2, hard_answers: 3, hard_accuracy: 1 }).map(item => item.points)).toEqual([3, 0, 0, 0])
    })
    test('does not award hard-question points from fewer than ten answers', () => {
        expect(scoreContributions({ hard_answers: 9, hard_accuracy: 1 })[3].points).toBe(0)
        expect(scoreContributions({ hard_answers: 10, hard_accuracy: 0.85 })[3].points).toBe(2)
    })
    test('preserves missing score inputs as unknown', () => {
        expect(scoreContributions({}).map(item => item.points)).toEqual([null, null, null, null])
    })
    test('shows insufficient history even for perfect selected accuracy', () => {
        expect(historyAssessment(18)).toContain('Limited comparison history')
        expect(historyAssessment(40)).toContain('not proof')
    })
})
