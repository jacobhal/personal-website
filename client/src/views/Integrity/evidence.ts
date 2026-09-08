/**
 * Why an account is on the board, and how much the evidence is worth.
 *
 * The risk score is assembled in SQL (`player_integrity_scored`), so the page
 * receives a single integer with no account of where it came from. A reviewer
 * looking at "score 3" cannot tell whether three separate signals fired weakly
 * or one signal fired alone, and those two cases call for different next steps.
 * This module re-derives the same four bands from the figures already on the
 * card so the breakdown can be shown beside the total.
 *
 * The bands mirror `20260904160000_web_integrity_review_panel.sql`. When that
 * migration changes, change these with it.
 */

export interface ScoreInputs {
    z_score?: number | null
    background_events?: number | null
    slow_correct_share?: number | null
    hard_answers?: number | null
    hard_accuracy?: number | null
}

export interface ScoreContribution {
    /** Column name as it appears elsewhere on the page. */
    label: string
    /** Points this signal added, or null when the input is missing. */
    points: number | null
    /** Maximum this signal can contribute, for reading the total. */
    max: number
    /** What the reviewer should take from this number. */
    detail: string
}

const zPoints = (z: number): number => {
    if (z >= 5) return 5
    if (z >= 4) return 4
    if (z >= 3) return 3
    if (z >= 2) return 2
    return 0
}

const exitPoints = (events: number): number => {
    if (events >= 5) return 3
    if (events >= 2) return 2
    if (events >= 1) return 1
    return 0
}

const slowPoints = (share: number): number => {
    if (share >= 0.7) return 2
    if (share >= 0.5) return 1
    return 0
}

/**
 * A missing input stays `null` rather than becoming 0.
 *
 * Zero and unknown look identical in a total, and they are opposite findings:
 * "no app exits recorded" is mildly reassuring, "app exits were never measured
 * for this account" is not.
 */
export const scoreContributions = (
    inputs: ScoreInputs
): ScoreContribution[] => {
    const { z_score, background_events, slow_correct_share } = inputs
    const hardAnswers = inputs.hard_answers
    const hardAccuracy = inputs.hard_accuracy

    const hard: number | null =
        hardAnswers == null
            ? null
            : hardAnswers < 10
              ? 0
              : hardAccuracy == null
                ? null
                : hardAccuracy >= 0.85
                  ? 2
                  : 0

    return [
        {
            label: 'Z score',
            points: z_score == null ? null : zPoints(z_score),
            max: 5,
            detail: 'Z ≥ 2 adds 2 points; ≥ 3 adds 3; ≥ 4 adds 4; ≥ 5 adds 5. Below 2 adds 0. Strong knowledge can also produce a high Z score.',
        },
        {
            label: 'App exits',
            points:
                background_events == null
                    ? null
                    : exitPoints(background_events),
            max: 3,
            detail: 'One exit scores 1, two score 2, five score 3. The app cannot see where the player went, and a second device leaves no exit at all.',
        },
        {
            label: 'Slow correct answers',
            points:
                slow_correct_share == null
                    ? null
                    : slowPoints(slow_correct_share),
            max: 2,
            detail: 'Half of correct answers over 12s scores 1, seven in ten scores 2. Receipt gaps include the reveal and network delay.',
        },
        {
            label: 'Hard-question accuracy',
            points: hard,
            max: 2,
            detail: 'Scores 2 only at 10 or more hard answers and at least 85% correct. Below 10 answers it contributes nothing, however high the accuracy.',
        },
    ]
}

/**
 * How far the comparable-answer sample can be trusted.
 *
 * 40 is the threshold the weekly email already uses, so the page and the email
 * agree on what counts as a readable sample.
 */
export const historyAssessment = (comparableAnswers: number): string =>
    comparableAnswers < 40
        ? `Limited comparison history: ${comparableAnswers} comparable answers. A z score is unstable below about 40 answers, so treat this as a lead and not proof.`
        : `${comparableAnswers} comparable answers, enough to read the z score as a signal. A high score on this sample is still not proof of cheating.`
