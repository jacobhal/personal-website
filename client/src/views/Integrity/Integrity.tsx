import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Helmet } from 'react-helmet'
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Container,
    Divider,
    Stack,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from '@mui/material'

import {
    fetchIntegrityBoard,
    fetchIntegrityOverview,
    fetchIntegrityPlayer,
    isIntegrityStoreConfigured,
    searchIntegrityPlayers,
    type BoardRow,
    type IntegrityOverview,
    type PlayerReport,
    type SearchRow,
} from '../../services/integrityStore'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import {
    COLUMN_GLOSSARY,
    bandColor,
    compareToMedian,
    countLabel,
    describeCoverage,
    formatPercent,
    formatSeconds,
    formatZ,
    sampleCaveats,
    type Comparison,
} from './present'
import { historyAssessment, scoreContributions } from './evidence'

const colors = {
    bg: '#0E0E14',
    surface: '#1A1A28',
    border: '#2A2A40',
    accent: '#A5B4FC',
    text: '#ECECF2',
    muted: '#A0A0B4',
    good: '#66bb6a',
    bad: '#ef5350',
}

const TOKEN_KEY = 'jacobhal.integrityToken'
const RANGES = [7, 30, 90] as const
// Deliberately reaches down to 1. The 40-answer floor is an email threshold,
// not a visibility rule: a player with three matches is exactly the case worth
// looking at by hand.
const FLOORS = [1, 5, 10, 40] as const

const readToken = (): string => {
    try {
        return (window.localStorage.getItem(TOKEN_KEY) ?? '').trim()
    } catch {
        // Private browsing refuses localStorage entirely.
        return ''
    }
}

const storeToken = (token: string): void => {
    try {
        window.localStorage.setItem(TOKEN_KEY, token)
    } catch {
        // Session-only access is still access.
    }
}

const alertSx = {
    backgroundColor: 'rgba(92,107,192,0.10)',
    border: `1px solid ${colors.border}`,
    color: colors.text,
    '& .MuiAlert-icon': { color: colors.accent },
    '& code': {
        backgroundColor: 'rgba(255,255,255,0.07)',
        borderRadius: 1,
        px: 0.75,
        py: 0.25,
        fontSize: 13,
        color: colors.text,
        whiteSpace: 'nowrap',
        display: 'inline-block',
    },
} as const

const errorAlertSx = {
    ...alertSx,
    backgroundColor: 'rgba(198,40,40,0.14)',
    border: '1px solid rgba(198,40,40,0.45)',
    '& .MuiAlert-icon': { color: colors.bad },
    '& code': alertSx['& code'],
} as const

const toggleSx = {
    color: colors.muted,
    borderColor: colors.border,
    textTransform: 'none',
    px: 1.75,
    '&:hover': { backgroundColor: 'rgba(92,107,192,0.12)' },
    '&.Mui-selected': {
        color: colors.text,
        backgroundColor: 'rgba(92,107,192,0.28)',
        '&:hover': { backgroundColor: 'rgba(92,107,192,0.36)' },
    },
} as const

const nameOf = (row: {
    display_name: string | null
    username: string | null
    user_id: string
}): string => row.display_name || row.username || row.user_id

const BandChip: React.FC<{
    band: 'high' | 'review' | 'watch'
    score?: number
}> = ({ band, score }) => (
    <Chip
        size="small"
        label={`${band.toUpperCase()}${score == null ? '' : ` · score ${score}`}`}
        sx={{
            backgroundColor: `${bandColor(band)}22`,
            color: bandColor(band),
            border: `1px solid ${bandColor(band)}66`,
            fontWeight: 800,
            fontSize: 11,
        }}
    />
)

/** One measurement beside the population median it should be read against. */
const StatRow: React.FC<{
    label: string
    value: string
    median: string
    comparison: Comparison
}> = ({ label, value, median, comparison }) => {
    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr auto', sm: '1fr auto auto' },
                gap: 1.5,
                alignItems: 'baseline',
                py: 1,
                borderBottom: `1px solid ${colors.border}`,
            }}
        >
            <Typography sx={{ color: colors.muted, fontSize: 13 }}>
                {label}
            </Typography>
            <Typography
                sx={{
                    fontSize: 15,
                    fontWeight: 800,
                    color:
                        comparison.direction === 'unknown'
                            ? colors.text
                            : colors.accent,
                }}
            >
                {value}
            </Typography>
            <Typography
                sx={{
                    color: colors.muted,
                    fontSize: 12,
                    minWidth: 96,
                    gridColumn: { xs: '1 / -1', sm: 'auto' },
                }}
            >
                median {median}
            </Typography>
        </Box>
    )
}

/**
 * Every column, defined. These numbers get read months apart, and a
 * half-remembered definition is how a one-sample "100%" becomes a conviction.
 */
const Glossary: React.FC = () => (
    <Accordion
        disableGutters
        sx={{
            color: colors.text,
            backgroundColor: colors.surface,
            border: `1px solid ${colors.border}`,
            borderRadius: 3,
            mb: 4,
            '&:before': { display: 'none' },
        }}
    >
        <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: colors.muted }} />}
        >
            <Typography sx={{ fontWeight: 800, fontSize: 15 }}>
                What the numbers mean
            </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0 }}>
            {COLUMN_GLOSSARY.map((entry) => (
                <Accordion
                    key={entry.term}
                    disableGutters
                    elevation={0}
                    sx={{
                        backgroundColor: 'transparent',
                        color: colors.text,
                        '&:before': { display: 'none' },
                        borderTop: `1px solid ${colors.border}`,
                    }}
                >
                    <AccordionSummary
                        expandIcon={
                            <ExpandMoreIcon sx={{ color: colors.muted }} />
                        }
                    >
                        <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                            {entry.term}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography
                            sx={{
                                fontSize: 14,
                                color: colors.muted,
                                lineHeight: 1.7,
                                maxWidth: 680,
                            }}
                        >
                            {entry.meaning}
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            ))}
        </AccordionDetails>
    </Accordion>
)

/**
 * Where the risk score came from, signal by signal.
 *
 * The board hands over one integer. "Score 3" from three weak signals and
 * "score 3" from a single z-score band are different findings, and only the
 * second one is answered by looking at the player's answers. Showing the
 * breakdown also makes a zero visible: a row reading "0 of 3" states that app
 * exits were measured and found nothing, which the total cannot say.
 */
const ScoreBreakdown: React.FC<{
    total: number | undefined
    comparableAnswers: number
    contributions: ReturnType<typeof scoreContributions>
}> = ({ total, comparableAnswers, contributions }) => (
    <Box
        sx={{
            border: `1px solid ${colors.border}`,
            borderRadius: 2,
            p: 2,
            mb: 2,
        }}
    >
        <Stack
            direction="row"
            spacing={1.5}
            alignItems="baseline"
            flexWrap="wrap"
            useFlexGap
            sx={{ mb: 1 }}
        >
            <Typography sx={{ fontSize: 15, fontWeight: 800 }}>
                Why this account is on the board
            </Typography>
            <Typography sx={{ color: colors.muted, fontSize: 13 }}>
                {total == null
                    ? 'No score reported'
                    : `Review score ${total} of 12`}
            </Typography>
        </Stack>
        <Typography sx={{ color: colors.muted, fontSize: 12, mb: 1 }}>
            Tap a signal to see its scoring rule.
        </Typography>
        {contributions.map((item) => (
            <Accordion
                key={item.label}
                disableGutters
                elevation={0}
                sx={{
                    backgroundColor: 'transparent',
                    color: colors.text,
                    borderBottom: `1px solid ${colors.border}`,
                    '&:before': { display: 'none' },
                }}
            >
                <AccordionSummary
                    sx={{ px: 0 }}
                    expandIcon={<ExpandMoreIcon sx={{ color: colors.muted }} />}
                >
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        gap={1}
                        sx={{ width: '100%', pr: 1 }}
                    >
                        <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                            {item.label}
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: 13,
                                fontWeight: 800,
                                color: item.points ? '#FFCC80' : colors.muted,
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {item.points == null
                                ? 'not measured'
                                : `${item.points} of ${item.max}`}
                        </Typography>
                    </Stack>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 0 }}>
                    <Typography
                        sx={{
                            fontSize: 13,
                            lineHeight: 1.6,
                            color: colors.muted,
                        }}
                    >
                        {item.detail}
                    </Typography>
                </AccordionDetails>
            </Accordion>
        ))}
        <Typography sx={{ color: colors.muted, fontSize: 12.5, mt: 1.25 }}>
            {historyAssessment(comparableAnswers)}
        </Typography>
    </Box>
)

const PlayerPanel: React.FC<{ report: PlayerReport }> = ({ report }) => {
    const { player, population, restriction, answers } = report
    const panelRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        panelRef.current?.focus()
    }, [report])
    const caveats = sampleCaveats({
        scored_answers: player.scored_answers,
        timed_answers: player.timed_answers ?? 0,
        hard_answers: player.hard_answers ?? 0,
    })

    return (
        <Box
            ref={panelRef}
            tabIndex={-1}
            role="region"
            aria-label="Player evidence"
            sx={{
                backgroundColor: colors.surface,
                border: `1px solid ${colors.border}`,
                borderRadius: 3,
                p: 2.5,
                mb: 4,
            }}
        >
            <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                flexWrap="wrap"
                useFlexGap
                sx={{ mb: 0.5 }}
            >
                <Typography sx={{ fontSize: 22, fontWeight: 900 }}>
                    {nameOf(player)}
                </Typography>
                {player.review_band && (
                    <BandChip
                        band={player.review_band}
                        score={player.risk_score}
                    />
                )}
                {player.actively_restricted && (
                    <Chip
                        size="small"
                        label="RANKED RESTRICTED"
                        sx={{
                            backgroundColor: 'rgba(239,83,80,0.16)',
                            color: colors.bad,
                            border: `1px solid ${colors.bad}66`,
                            fontWeight: 800,
                            fontSize: 11,
                        }}
                    />
                )}
            </Stack>
            <Typography sx={{ color: colors.muted, fontSize: 13, mb: 2 }}>
                Rating {player.rating} ·{' '}
                {describeCoverage(
                    player.scored_answers,
                    player.raw_ranked_answers
                )}{' '}
                · {report.window_days} day window · {population.accounts}{' '}
                accounts in the comparison
            </Typography>

            <ScoreBreakdown
                total={player.risk_score}
                comparableAnswers={player.scored_answers}
                contributions={scoreContributions({
                    z_score: player.z_score,
                    background_events: player.background_events,
                    slow_correct_share: player.slow_correct_share,
                    hard_answers: player.hard_answers,
                    hard_accuracy: player.hard_accuracy,
                })}
            />

            <Accordion
                disableGutters
                elevation={0}
                sx={{
                    backgroundColor: colors.bg,
                    color: colors.text,
                    borderRadius: 2,
                    mb: 2,
                    '&:before': { display: 'none' },
                }}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: colors.muted }} />}
                >
                    <Box>
                        <Typography sx={{ fontWeight: 800 }}>
                            Next step
                        </Typography>
                        <Typography sx={{ color: colors.muted, fontSize: 13 }}>
                            Check the evidence before taking action.
                        </Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ fontSize: 14, lineHeight: 1.65 }}>
                    <Box sx={{ mb: 1 }}>
                        This is a selected subset, not the player's overall
                        accuracy. Comparable answers exclude unsupported
                        question types and questions with too few attempts.
                        Repeated attempts can come from the same person.
                    </Box>
                    Check repeated unusual answers across the 7, 30 and 90 day
                    windows. Read the comparison counts beside each answer
                    before trusting its difficulty. Receipt gaps include reveals
                    and network delay; app exits can be innocent, and zero exits
                    cannot rule out another device.
                    <Box sx={{ mt: 1 }}>
                        Do not restrict an account from its score or rank alone.
                        Record the specific answers and supporting context
                        before deciding whether a manual ranked restriction is
                        justified. Uneven matches need a matchmaking review even
                        when there is no cheating evidence.
                    </Box>
                    <Box sx={{ mt: 1.5, color: colors.muted }}>
                        This page is read-only. It cannot send a warning or
                        restrict an account. A neutral fair-play reminder is an
                        option when evidence is uncertain, but this score alone
                        does not justify accusing a player.
                    </Box>
                </AccordionDetails>
            </Accordion>

            {restriction && (
                <Alert severity="warning" sx={{ ...alertSx, mb: 2 }}>
                    Restricted since{' '}
                    {new Date(restriction.starts_at).toLocaleDateString(
                        'sv-SE'
                    )}
                    {restriction.ends_at
                        ? `, until ${new Date(
                              restriction.ends_at
                          ).toLocaleDateString('sv-SE')}`
                        : ', until further notice'}
                    . Source: {restriction.source}.
                    {restriction.appeal_status
                        ? ` Appeal: ${restriction.appeal_status}.`
                        : ' No appeal submitted.'}
                </Alert>
            )}

            {player.scored_answers === 0 ? (
                <Typography sx={{ color: colors.muted, fontSize: 14 }}>
                    Nothing to measure yet. This account has no ranked answers
                    whose questions have been seen by enough other players to
                    estimate a difficulty.
                </Typography>
            ) : (
                <>
                    <StatRow
                        label="Comparable-answer accuracy"
                        value={formatPercent(player.accuracy)}
                        median={formatPercent(population.median_accuracy)}
                        comparison={compareToMedian(
                            player.accuracy,
                            population.median_accuracy
                        )}
                    />
                    <StatRow
                        label="Expected accuracy for these questions"
                        value={formatPercent(player.expected_accuracy)}
                        median="—"
                        comparison={{ delta: null, direction: 'unknown' }}
                    />
                    <StatRow
                        label="Z score against the question difficulty"
                        value={formatZ(player.z_score)}
                        median={formatZ(population.median_z_score)}
                        comparison={compareToMedian(
                            player.z_score,
                            population.median_z_score
                        )}
                    />
                    <StatRow
                        label={`Hard-question accuracy (${countLabel(
                            player.hard_answers ?? 0,
                            'answer'
                        )})`}
                        value={formatPercent(player.hard_accuracy)}
                        median={formatPercent(population.median_hard_accuracy)}
                        comparison={compareToMedian(
                            player.hard_accuracy,
                            population.median_hard_accuracy
                        )}
                    />
                    <StatRow
                        label={`Median receipt gap (${player.timed_answers ?? 0} timed)`}
                        value={formatSeconds(player.median_answer_ms)}
                        median={formatSeconds(population.median_answer_ms)}
                        comparison={compareToMedian(
                            player.median_answer_ms,
                            population.median_answer_ms
                        )}
                    />
                    <StatRow
                        label="Correct answers with receipt gaps over 12s"
                        value={formatPercent(player.slow_correct_share)}
                        median={formatPercent(
                            population.median_slow_correct_share
                        )}
                        comparison={compareToMedian(
                            player.slow_correct_share,
                            population.median_slow_correct_share
                        )}
                    />
                    <StatRow
                        label="App exits during ranked questions"
                        value={String(player.background_events ?? 0)}
                        median={
                            population.median_background_events == null
                                ? '—'
                                : String(population.median_background_events)
                        }
                        comparison={compareToMedian(
                            player.background_events,
                            population.median_background_events
                        )}
                    />
                </>
            )}

            {caveats.length > 0 && (
                <Alert severity="info" sx={{ ...alertSx, mt: 2 }}>
                    {caveats.map((caveat) => (
                        <Box key={caveat}>{caveat}</Box>
                    ))}
                </Alert>
            )}

            {answers.length > 0 && (
                <>
                    <Divider sx={{ borderColor: colors.border, my: 2.5 }} />
                    <Typography sx={{ fontSize: 15, fontWeight: 800, mb: 1 }}>
                        Recent ranked answers
                    </Typography>
                    <Stack spacing={1.5}>
                        {answers.map((answer, index) => (
                            <Box
                                key={`${answer.question_id}-${index}`}
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    backgroundColor: colors.bg,
                                    border: `1px solid ${colors.border}`,
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: 15,
                                        lineHeight: 1.5,
                                        mb: 1.5,
                                    }}
                                >
                                    {answer.question_en ?? answer.question_id}
                                </Typography>
                                <Stack direction="row" gap={2} flexWrap="wrap">
                                    <Typography
                                        sx={{
                                            fontWeight: 700,
                                            color:
                                                answer.is_correct == null
                                                    ? colors.muted
                                                    : answer.is_correct
                                                      ? colors.good
                                                      : colors.bad,
                                        }}
                                    >
                                        {answer.is_correct == null
                                            ? 'Unknown'
                                            : answer.is_correct
                                              ? 'Correct'
                                              : 'Wrong'}
                                    </Typography>
                                    <Box>
                                        <Typography
                                            sx={{
                                                fontSize: 12,
                                                color: colors.muted,
                                            }}
                                        >
                                            Receipt gap
                                        </Typography>
                                        <Typography>
                                            {formatSeconds(answer.answer_ms)}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography
                                            sx={{
                                                fontSize: 12,
                                                color: colors.muted,
                                            }}
                                        >
                                            Baseline correct
                                        </Typography>
                                        <Typography>
                                            {formatPercent(
                                                answer.population_correct_rate
                                            )}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontSize: 12,
                                                color: colors.muted,
                                            }}
                                        >
                                            {countLabel(
                                                answer.population_answers,
                                                'total attempt'
                                            )}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Box>
                        ))}
                    </Stack>
                </>
            )}
        </Box>
    )
}

export const Integrity: React.FC = () => {
    const [token, setToken] = useState<string>(readToken)
    const [draftToken, setDraftToken] = useState('')
    const [days, setDays] = useState<number>(30)
    const [floor, setFloor] = useState<number>(5)
    const [overview, setOverview] = useState<IntegrityOverview | null>(null)
    const [board, setBoard] = useState<BoardRow[] | null>(null)
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<SearchRow[] | null>(null)
    const [player, setPlayer] = useState<PlayerReport | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [loaded, setLoaded] = useState(false)

    const load = useCallback(async () => {
        if (!token) return
        setLoading(true)
        setError(null)
        try {
            const [nextOverview, nextBoard] = await Promise.all([
                fetchIntegrityOverview(token, days),
                fetchIntegrityBoard(token, days, floor),
            ])
            setOverview(nextOverview)
            setBoard(nextBoard)
        } catch (caught) {
            setError(
                caught instanceof Error ? caught.message : 'Request failed'
            )
        } finally {
            setLoading(false)
            setLoaded(true)
        }
    }, [token, days, floor])

    useEffect(() => {
        void load()
    }, [load])

    // A valid passphrase always returns exactly one overview row, so an empty
    // one after a successful request means the passphrase was rejected — not
    // that nobody has played yet.
    const passphraseRejected = loaded && error === null && overview === null

    const runSearch = async (raw: string) => {
        const cleaned = raw.trim()
        if (cleaned.length < 2) {
            setResults(null)
            return
        }
        try {
            setResults(await searchIntegrityPlayers(token, cleaned))
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : 'Search failed')
        }
    }

    const openPlayer = async (userId: string) => {
        setLoading(true)
        try {
            setPlayer(await fetchIntegrityPlayer(token, userId, days))
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : 'Lookup failed')
        } finally {
            setLoading(false)
        }
    }

    // Reopen the selected player whenever the window changes, so the card and
    // the board never describe two different periods.
    useEffect(() => {
        if (player) void openPlayer(player.player.user_id)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [days])

    const headline = useMemo(() => {
        if (!overview) return null
        return `${overview.tracked_accounts} ranked ${
            overview.tracked_accounts === 1 ? 'account' : 'accounts'
        } tracked · ${overview.eligible_accounts} above the ${
            overview.review_floor
        }-answer email floor · ${overview.flagged_accounts} with review signals (score 3+) · ${
            overview.restricted_accounts
        } currently restricted`
    }, [overview])

    if (!isIntegrityStoreConfigured()) {
        return (
            <Box sx={{ backgroundColor: colors.bg, minHeight: '100vh', p: 4 }}>
                <Alert severity="warning" sx={errorAlertSx}>
                    No Supabase project is configured for this build. Set
                    VITE_SUPABASE_SKARP_URL and VITE_SUPABASE_SKARP_ANON_KEY.
                </Alert>
            </Box>
        )
    }

    return (
        <Box
            sx={{
                backgroundColor: colors.bg,
                minHeight: '100vh',
                color: colors.text,
                overflowWrap: 'anywhere',
                '& button:focus-visible': {
                    outline: `2px solid ${colors.accent}`,
                    outlineOffset: 3,
                },
                '& .MuiAccordion-root': { color: colors.text },
            }}
        >
            <Helmet>
                <title>Player integrity</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
                <Typography
                    component="h1"
                    sx={{ fontSize: 28, fontWeight: 900, mb: 0.5 }}
                >
                    Player integrity
                </Typography>
                <Typography sx={{ color: colors.muted, fontSize: 14, mb: 3 }}>
                    Review priorities, never proof of cheating. This page is
                    read-only.
                </Typography>

                {error && (
                    <Alert
                        severity="error"
                        sx={{ ...errorAlertSx, mb: 2.5, maxWidth: 640 }}
                    >
                        {error}
                    </Alert>
                )}

                {!loading && passphraseRejected && (
                    <Alert
                        severity="error"
                        sx={{ ...errorAlertSx, mb: 2.5, maxWidth: 640 }}
                    >
                        Passphrase not accepted. Check for a trailing space or
                        line break, the usual cause when pasting on a phone. It
                        must match the value set with{' '}
                        <code>private.set_web_integrity_token()</code>.
                    </Alert>
                )}

                {(!token || passphraseRejected) && (
                    <Stack
                        component="form"
                        direction="row"
                        spacing={2}
                        sx={{ maxWidth: 480, mb: 4 }}
                        onSubmit={(event) => {
                            event.preventDefault()
                            const cleaned = draftToken.trim()
                            if (!cleaned) return
                            storeToken(cleaned)
                            setToken(cleaned)
                            setLoaded(false)
                        }}
                    >
                        <TextField
                            fullWidth
                            size="small"
                            type="password"
                            label="Passphrase"
                            value={draftToken}
                            autoComplete="current-password"
                            inputProps={{
                                autoCapitalize: 'none',
                                autoCorrect: 'off',
                                spellCheck: false,
                            }}
                            onChange={(event) =>
                                setDraftToken(event.target.value)
                            }
                            sx={{
                                '& .MuiInputBase-root': { color: colors.text },
                                '& .MuiInputLabel-root': {
                                    color: colors.muted,
                                },
                            }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            disableElevation
                            sx={{
                                backgroundColor: colors.accent,
                                textTransform: 'none',
                                fontWeight: 700,
                                px: 3,
                                '&:hover': { backgroundColor: '#4d5bb0' },
                            }}
                        >
                            Open
                        </Button>
                    </Stack>
                )}

                {token && !passphraseRejected && (
                    <>
                        <Stack
                            direction="row"
                            spacing={2}
                            flexWrap="wrap"
                            useFlexGap
                            alignItems="center"
                            sx={{ mb: 2 }}
                        >
                            <ToggleButtonGroup
                                size="small"
                                exclusive
                                value={days}
                                onChange={(_event, next) =>
                                    next !== null && setDays(next)
                                }
                            >
                                {RANGES.map((range) => (
                                    <ToggleButton
                                        key={range}
                                        value={range}
                                        sx={toggleSx}
                                    >
                                        {range}d
                                    </ToggleButton>
                                ))}
                            </ToggleButtonGroup>

                            <Box>
                                <Typography
                                    sx={{
                                        fontSize: 12,
                                        color: colors.muted,
                                        mb: 0.5,
                                    }}
                                >
                                    Minimum comparable answers
                                </Typography>
                                <ToggleButtonGroup
                                    aria-label="Minimum comparable answers"
                                    size="small"
                                    exclusive
                                    value={floor}
                                    onChange={(_event, next) =>
                                        next !== null && setFloor(next)
                                    }
                                >
                                    {FLOORS.map((value) => (
                                        <ToggleButton
                                            key={value}
                                            value={value}
                                            sx={toggleSx}
                                        >
                                            {value}+
                                        </ToggleButton>
                                    ))}
                                </ToggleButtonGroup>
                            </Box>

                            {loading && (
                                <CircularProgress
                                    size={18}
                                    sx={{ color: colors.accent }}
                                />
                            )}
                        </Stack>

                        {overview && (
                            <Box sx={{ mb: 3 }}>
                                <Box
                                    sx={{
                                        display: 'grid',
                                        gridTemplateColumns: {
                                            xs: 'repeat(2, minmax(0, 1fr))',
                                            md: 'repeat(4, minmax(0, 1fr))',
                                        },
                                        gap: 1.5,
                                        mb: 2,
                                    }}
                                >
                                    {[
                                        [
                                            overview.tracked_accounts,
                                            'Accounts tracked',
                                        ],
                                        [
                                            overview.flagged_accounts,
                                            'Review signals',
                                        ],
                                        [
                                            overview.eligible_accounts,
                                            '40+ comparable answers',
                                        ],
                                        [
                                            overview.restricted_accounts,
                                            'Currently restricted',
                                        ],
                                    ].map(([value, label]) => (
                                        <Box
                                            key={label}
                                            sx={{
                                                p: 2,
                                                borderRadius: 2.5,
                                                border: `1px solid ${colors.border}`,
                                                backgroundColor: colors.surface,
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontSize: 28,
                                                    fontWeight: 800,
                                                }}
                                            >
                                                {value}
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    fontSize: 12,
                                                    color: colors.muted,
                                                }}
                                            >
                                                {label}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                                <Typography sx={{ fontSize: 14, mb: 1 }}>
                                    Scores prioritise review. They never prove
                                    cheating or trigger restrictions.
                                </Typography>
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    flexWrap="wrap"
                                    useFlexGap
                                    sx={{ mb: 1 }}
                                >
                                    <Chip
                                        size="small"
                                        label="Watch 0–3"
                                        sx={{
                                            color: colors.text,
                                            backgroundColor: colors.surface,
                                        }}
                                    />
                                    <Chip
                                        size="small"
                                        label="Review 4–6"
                                        sx={{
                                            color: '#FFCC80',
                                            backgroundColor: '#33291E',
                                        }}
                                    />
                                    <Chip
                                        size="small"
                                        label="High 7–12"
                                        sx={{
                                            color: '#FFABAB',
                                            backgroundColor: '#352126',
                                        }}
                                    />
                                </Stack>
                                <Accordion
                                    disableGutters
                                    elevation={0}
                                    sx={{
                                        backgroundColor: 'transparent',
                                        color: colors.muted,
                                        '&:before': { display: 'none' },
                                    }}
                                >
                                    <AccordionSummary
                                        expandIcon={
                                            <ExpandMoreIcon
                                                sx={{ color: colors.muted }}
                                            />
                                        }
                                        sx={{ px: 0 }}
                                    >
                                        <Typography sx={{ fontSize: 13 }}>
                                            How scores and counts work
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails
                                        sx={{
                                            px: 0,
                                            fontSize: 13,
                                            lineHeight: 1.7,
                                        }}
                                    >
                                        <Typography
                                            sx={{ fontSize: 13, mb: 1 }}
                                        >
                                            {headline}
                                        </Typography>
                                        Score 3 still belongs to Watch but
                                        counts as a review signal above.
                                        Accuracy covers only comparable answers,
                                        not every answer the player submitted.
                                        <Box sx={{ mt: 1 }}>
                                            Counts cover the whole window,
                                            regardless of the selected answer
                                            filter. The 40-answer floor is for
                                            the weekly email, not a threshold
                                            for proving cheating.
                                        </Box>
                                    </AccordionDetails>
                                </Accordion>
                            </Box>
                        )}

                        <Stack
                            component="form"
                            direction="row"
                            spacing={2}
                            sx={{
                                maxWidth: 560,
                                mb: 2,
                                '& .MuiTextField-root': { minWidth: 0 },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: colors.border,
                                },
                            }}
                            onSubmit={(event) => {
                                event.preventDefault()
                                void runSearch(query)
                            }}
                        >
                            <TextField
                                fullWidth
                                size="small"
                                label="Find a player"
                                value={query}
                                onChange={(event) =>
                                    setQuery(event.target.value)
                                }
                                sx={{
                                    '& .MuiInputBase-root': {
                                        color: colors.text,
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: colors.muted,
                                    },
                                }}
                            />
                            <Button
                                type="submit"
                                variant="outlined"
                                sx={{
                                    color: colors.text,
                                    borderColor: colors.border,
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    px: 2,
                                    minHeight: 44,
                                    flexShrink: 0,
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                Search
                            </Button>
                        </Stack>

                        {results !== null && (
                            <Stack
                                direction="row"
                                spacing={1}
                                flexWrap="wrap"
                                useFlexGap
                                sx={{ mb: 3 }}
                            >
                                {results.length === 0 ? (
                                    <Typography
                                        sx={{
                                            color: colors.muted,
                                            fontSize: 13,
                                        }}
                                    >
                                        No player matches that.
                                    </Typography>
                                ) : (
                                    results.map((row) => (
                                        <Chip
                                            key={row.user_id}
                                            label={nameOf(row)}
                                            onClick={() =>
                                                void openPlayer(row.user_id)
                                            }
                                            sx={{
                                                backgroundColor: colors.surface,
                                                color: colors.text,
                                                border: `1px solid ${
                                                    row.actively_restricted
                                                        ? colors.bad
                                                        : colors.border
                                                }`,
                                                cursor: 'pointer',
                                            }}
                                        />
                                    ))
                                )}
                            </Stack>
                        )}

                        {player && <PlayerPanel report={player} />}

                        <Typography
                            sx={{ fontSize: 18, fontWeight: 900, mb: 1 }}
                        >
                            Review board
                        </Typography>
                        {board !== null && board.length === 0 ? (
                            <Typography
                                sx={{ color: colors.muted, fontSize: 14 }}
                            >
                                No account has {floor} or more comparable ranked
                                answers in this window.
                            </Typography>
                        ) : (
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: {
                                        xs: 'minmax(0, 1fr)',
                                        md: 'repeat(2, minmax(0, 1fr))',
                                    },
                                    gap: 2,
                                }}
                            >
                                {(board ?? []).map((row) => (
                                    <Box
                                        component="article"
                                        key={row.user_id}
                                        sx={{
                                            minWidth: 0,
                                            backgroundColor: colors.surface,
                                            border: `1px solid ${colors.border}`,
                                            borderRadius: 3,
                                            p: { xs: 2, sm: 2.5 },
                                        }}
                                    >
                                        <Stack
                                            direction="row"
                                            justifyContent="space-between"
                                            alignItems="flex-start"
                                            gap={1}
                                            flexWrap="wrap"
                                            sx={{ mb: 2 }}
                                        >
                                            <Box sx={{ minWidth: 0 }}>
                                                <Button
                                                    onClick={() =>
                                                        void openPlayer(
                                                            row.user_id
                                                        )
                                                    }
                                                    aria-label={`Review ${nameOf(row)}`}
                                                    sx={{
                                                        color: colors.text,
                                                        fontSize: 20,
                                                        fontWeight: 800,
                                                        textTransform: 'none',
                                                        p: 0,
                                                        minHeight: 44,
                                                        justifyContent:
                                                            'flex-start',
                                                        overflowWrap:
                                                            'anywhere',
                                                        textAlign: 'left',
                                                    }}
                                                >
                                                    {nameOf(row)}
                                                </Button>
                                                <Typography
                                                    sx={{
                                                        color: colors.muted,
                                                        fontSize: 12,
                                                    }}
                                                >
                                                    Rating {row.rating} ·{' '}
                                                    {row.actively_restricted
                                                        ? 'Ranked restricted'
                                                        : 'No restriction'}
                                                </Typography>
                                            </Box>
                                            <BandChip
                                                band={row.review_band}
                                                score={row.risk_score}
                                            />
                                        </Stack>
                                        <Box
                                            sx={{
                                                backgroundColor: colors.bg,
                                                borderRadius: 2,
                                                p: 1.5,
                                                mb: 2,
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    color: colors.muted,
                                                    fontSize: 12,
                                                    mb: 1,
                                                }}
                                            >
                                                Comparable-answer accuracy
                                            </Typography>
                                            <Stack
                                                direction="row"
                                                alignItems="baseline"
                                                spacing={1}
                                                flexWrap="wrap"
                                                useFlexGap
                                            >
                                                <Typography
                                                    sx={{
                                                        fontSize: 28,
                                                        fontWeight: 800,
                                                        fontVariantNumeric:
                                                            'tabular-nums',
                                                    }}
                                                >
                                                    {formatPercent(
                                                        row.accuracy
                                                    )}
                                                </Typography>
                                                <Typography
                                                    sx={{
                                                        color: colors.muted,
                                                        fontSize: 14,
                                                    }}
                                                >
                                                    expected{' '}
                                                    {formatPercent(
                                                        row.expected_accuracy
                                                    )}
                                                </Typography>
                                            </Stack>
                                            <Typography
                                                sx={{
                                                    color: colors.muted,
                                                    fontSize: 12,
                                                    mt: 0.5,
                                                }}
                                            >
                                                {row.scored_answers} comparable
                                                answers ·{' '}
                                                {row.scored_answers < 40
                                                    ? 'Limited comparison history'
                                                    : 'Review the supporting evidence'}
                                            </Typography>
                                        </Box>
                                        <Box
                                            sx={{
                                                display: 'grid',
                                                gridTemplateColumns:
                                                    'repeat(3, minmax(0, 1fr))',
                                                gap: 1,
                                            }}
                                        >
                                            {[
                                                [
                                                    'Z score',
                                                    formatZ(row.z_score),
                                                    'Baseline distance',
                                                ],
                                                [
                                                    'Receipt gap',
                                                    formatSeconds(
                                                        row.median_answer_ms
                                                    ),
                                                    `${row.timed_answers} timed`,
                                                ],
                                                [
                                                    'App exits',
                                                    String(
                                                        row.background_events
                                                    ),
                                                    'Recorded events',
                                                ],
                                            ].map(([label, value, detail]) => (
                                                <Box key={label}>
                                                    <Typography
                                                        sx={{
                                                            color: colors.muted,
                                                            fontSize: 12,
                                                        }}
                                                    >
                                                        {label}
                                                    </Typography>
                                                    <Typography
                                                        sx={{
                                                            fontSize: 19,
                                                            fontWeight: 700,
                                                            my: 0.5,
                                                        }}
                                                    >
                                                        {value}
                                                    </Typography>
                                                    <Typography
                                                        sx={{
                                                            color: colors.muted,
                                                            fontSize: 11,
                                                        }}
                                                    >
                                                        {detail}
                                                    </Typography>
                                                </Box>
                                            ))}
                                        </Box>
                                        <Button
                                            fullWidth
                                            onClick={() =>
                                                void openPlayer(row.user_id)
                                            }
                                            sx={{
                                                mt: 2,
                                                minHeight: 44,
                                                color: colors.accent,
                                                border: `1px solid ${colors.border}`,
                                                borderRadius: 2,
                                                textTransform: 'none',
                                            }}
                                        >
                                            View evidence and score breakdown
                                        </Button>
                                    </Box>
                                ))}
                            </Box>
                        )}
                        <Box sx={{ mt: 3 }}>
                            <Glossary />
                        </Box>
                    </>
                )}
            </Container>
        </Box>
    )
}
