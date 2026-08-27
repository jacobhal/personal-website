import { describe, expect, it } from 'vitest'

import {
    answerLabel,
    normalizeRoomCode,
    parseLiveRoomState,
} from './liveRoomState'

describe('live room state', () => {
    it('normalizes valid room codes and rejects ambiguous input', () => {
        expect(normalizeRoomCode(' abc234 ')).toBe('ABC234')
        expect(normalizeRoomCode('ABC01I')).toBeNull()
    })

    it('parses all-answer reveal state', () => {
        const state = parseLiveRoomState({
            code: 'ABC234',
            status: 'reveal',
            is_host: false,
            question_count: 10,
            current_question_index: 0,
            participants: [{ id: 'p1', display_name: 'Ada', score: 1250 }],
            question: {
                id: 'q1',
                quiz_type: 'ordering',
                question_en: 'Order these',
                question_sv: 'Ordna dessa',
                order_items_en: ['A', 'B', 'C', 'D'],
                order_items_sv: ['A', 'B', 'C', 'D'],
                correct_answer: { kind: 'ordering', indices: [0, 1, 2, 3] },
            },
            answers: [
                {
                    participant_id: 'p1',
                    display_name: 'Ada',
                    answer: { kind: 'ordering', indices: [1, 0, 2, 3] },
                    points: 833,
                },
            ],
        })

        expect(state.phase).toBe('reveal')
        expect(state.answers[0].points).toBe(833)
        expect(
            answerLabel(state.question!, state.answers[0].answer, 'en')
        ).toBe('B → A → C → D')
    })
})
