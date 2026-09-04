/**
 * Presentation rules for the integrity panel.
 *
 * Kept apart from the component because these are the judgements that decide
 * whether a number reads as evidence or as noise, and they are worth testing on
 * their own.
 */

export type ReviewBand = 'high' | 'review' | 'watch'

export const bandColor = (band: ReviewBand): string =>
    band === 'high' ? '#ef5350' : band === 'review' ? '#ffa726' : '#8d9199'

export const formatPercent = (value: number | null | undefined): string =>
    value == null ? '—' : `${(value * 100).toFixed(1)}%`

export const formatSeconds = (ms: number | null | undefined): string =>
    ms == null ? '—' : `${(ms / 1000).toFixed(1)}s`

export const formatZ = (value: number | null | undefined): string =>
    value == null ? '—' : value.toFixed(2)

export type CompareDirection = 'above' | 'below' | 'level' | 'unknown'

export interface Comparison {
    delta: number | null
    direction: CompareDirection
}

/**
 * A single figure means nothing without the population beside it: 81% accuracy
 * is ordinary or remarkable depending on who else is playing. A missing median
 * yields `unknown` rather than a comparison against zero, because an empty week
 * must not paint every player as an outlier.
 */
export const compareToMedian = (
    value: number | null | undefined,
    median: number | null | undefined
): Comparison => {
    if (value == null || median == null) {
        return { delta: null, direction: 'unknown' }
    }
    const delta = value - median
    if (delta === 0) return { delta, direction: 'level' }
    return { delta, direction: delta > 0 ? 'above' : 'below' }
}

export interface SampleSizes {
    scored_answers: number
    timed_answers: number | null
    hard_answers: number | null
}

/** "1 answer", "3 answers". A card that reads "(1 answers)" looks unmaintained
 *  next to numbers it is asking to be trusted. */
export const countLabel = (n: number, word: string): string =>
    `${n} ${word}${n === 1 ? '' : 's'}`

/**
 * Names every figure on the card that rests on too little data to mean
 * anything. Live example: a 100% slow-correct share measured over one timed
 * answer, which reads as "always answers slowly" unless the sample is stated.
 */
export const sampleCaveats = (sizes: SampleSizes): string[] => {
    const caveats: string[] = []
    if (sizes.scored_answers < 10) {
        caveats.push(
            `Only ${sizes.scored_answers} comparable answers. Every figure here is noise at this sample size.`
        )
    }
    const timed = sizes.timed_answers ?? 0
    if (timed < 5) {
        caveats.push(`Timing is based on ${countLabel(timed, 'timed answer')}.`)
    }
    const hard = sizes.hard_answers ?? 0
    if (hard < 5) {
        caveats.push(
            `Hard-question accuracy is based on ${countLabel(hard, 'answer')}.`
        )
    }
    return caveats
}

/**
 * `scored_answers` counts only answers whose question has enough ranked answers
 * overall to carry a difficulty estimate. At this app's volume that is a small
 * fraction of what a player actually saw, so both numbers are shown.
 */
export const describeCoverage = (
    scored: number,
    rawRanked: number
): string => {
    if (rawRanked === 0) return 'No ranked answers yet'
    if (scored === 0) {
        return `No comparable answers yet, from ${rawRanked} ranked answers`
    }
    return `${scored} comparable of ${rawRanked} ranked answers`
}

export interface GlossaryEntry {
    term: string
    meaning: string
}

/**
 * Plain-language definition of every column on the page.
 *
 * Written out rather than left to a tooltip because these numbers are read
 * rarely, months apart, and a half-remembered definition is how a one-sample
 * "100%" turns into a conviction.
 */
export const COLUMN_GLOSSARY: GlossaryEntry[] = [
    {
        term: 'Answers',
        meaning:
            'Ranked answers that can be compared. A question only counts once at least four ranked players have answered it, because a question nobody else has met has no known difficulty. This is normally far below the number of questions the player actually saw, and the player card shows both numbers.',
    },
    {
        term: 'Accuracy',
        meaning:
            'Share of those comparable answers the player got right. On its own it says very little: it depends entirely on which questions they happened to draw. Always read it against the expected accuracy next to it.',
    },
    {
        term: 'Expected accuracy (exp)',
        meaning:
            'What these exact questions predict, from how often every other player got each one right. "exp 71%" means a typical player would score about 71% on this specific set of questions. A player who draws easy questions has a high expected accuracy and it means nothing about them.',
    },
    {
        term: 'Z score',
        meaning:
            'How far above the expected accuracy the player actually landed, counted in standard deviations. 0 is exactly as predicted. 1 is a good day. 2 is roughly a 1-in-40 result by luck alone, 3 about 1 in 700. It measures surprise, not skill or guilt: a genuinely strong player and someone looking answers up both score high, which is why it is read together with timing and app exits, never on its own. It is also unstable on small samples, so treat anything under about 40 answers as a hint at best.',
    },
    {
        term: 'Hard-question accuracy',
        meaning:
            'Accuracy on questions fewer than 35% of players get right. Someone with ordinary overall accuracy who is near-perfect on the hardest questions is a more interesting pattern than someone who is simply good at everything.',
    },
    {
        term: 'Median time',
        meaning:
            'The middle gap between two consecutive answer submissions from this player. It is not think time: it includes reading the next question and watching the answer reveal, so it runs longer than the question clock. Answers played before the app started recording receipt times have no timing at all, which is why the timed count beside it is usually small.',
    },
    {
        term: 'Correct answers over 12s',
        meaning:
            'Of the correct answers that have a timing at all, the share that took 12 seconds or more. Read it with the timed count next to it: at 1 timed answer, "100%" means one slow answer, not a habit. This is the closest thing here to "used the whole clock", and it is a weak signal on its own.',
    },
    {
        term: 'App exits',
        meaning:
            'How many times the app was sent to the background while a ranked question was on screen. The app cannot see where the player went, so a phone call, a notification and a search engine all look identical. Strong enough to make you look, never enough to conclude.',
    },
    {
        term: 'Band',
        meaning:
            'WATCH, REVIEW or HIGH, from a risk score that adds points for a high z score, app exits, slow correct answers and unusually high accuracy on hard questions. It is a queue order for human review. It is not a probability that somebody cheated, and no band restricts anybody.',
    },
    {
        term: 'Restricted',
        meaning:
            'Whether the account currently cannot start new ranked matchmaking or enter Gold Rush. Friendly challenges, live quizzes, solo play and matches already in progress are unaffected. Restrictions are applied by hand in SQL, never from this page.',
    },
]
