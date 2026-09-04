import React, { useCallback, useEffect, useMemo, useState } from 'react'
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
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

const colors = {
    bg: '#0E0E14',
    surface: '#1A1A28',
    border: '#2A2A40',
    accent: '#5C6BC0',
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

const cellSx = { color: colors.text, borderColor: colors.border } as const
const headCellSx = {
    color: colors.muted,
    borderColor: colors.border,
    fontWeight: 700,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
} as const

const nameOf = (row: {
    display_name: string | null
    username: string | null
    user_id: string
}): string => row.display_name || row.username || row.user_id

const BandChip: React.FC<{ band: 'high' | 'review' | 'watch' }> = ({
    band,
}) => (
    <Chip
        size="small"
        label={band.toUpperCase()}
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
    /** Higher than the median is suspicious for most of these, but not all. */
    higherIsSuspicious?: boolean
}> = ({ label, value, median, comparison, higherIsSuspicious = true }) => {
    const suspicious =
        comparison.direction === (higherIsSuspicious ? 'above' : 'below')
    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: '1fr auto auto',
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
                            : suspicious
                              ? colors.bad
                              : colors.good,
                }}
            >
                {value}
            </Typography>
            <Typography
                sx={{ color: colors.muted, fontSize: 12, minWidth: 96 }}
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
        defaultExpanded
        disableGutters
        sx={{
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
                What every column means
            </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0 }}>
            {COLUMN_GLOSSARY.map((entry) => (
                <Box
                    key={entry.term}
                    sx={{
                        py: 1.25,
                        borderTop: `1px solid ${colors.border}`,
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: 13,
                            fontWeight: 800,
                            color: colors.accent,
                            mb: 0.25,
                        }}
                    >
                        {entry.term}
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: 13,
                            color: colors.muted,
                            lineHeight: 1.55,
                        }}
                    >
                        {entry.meaning}
                    </Typography>
                </Box>
            ))}
        </AccordionDetails>
    </Accordion>
)

const PlayerPanel: React.FC<{ report: PlayerReport }> = ({ report }) => {
    const { player, population, restriction, answers } = report
    const caveats = sampleCaveats({
        scored_answers: player.scored_answers,
        timed_answers: player.timed_answers ?? 0,
        hard_answers: player.hard_answers ?? 0,
    })

    return (
        <Box
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
                {player.review_band && <BandChip band={player.review_band} />}
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
                · {report.window_days} day window ·{' '}
                {population.accounts} accounts in the comparison
            </Typography>

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
                        label="Accuracy"
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
                        label={`Median answer time (${player.timed_answers ?? 0} timed)`}
                        value={formatSeconds(player.median_answer_ms)}
                        median={formatSeconds(population.median_answer_ms)}
                        comparison={compareToMedian(
                            player.median_answer_ms,
                            population.median_answer_ms
                        )}
                    />
                    <StatRow
                        label="Correct answers that took over 12s"
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
                    <Typography
                        sx={{ fontSize: 15, fontWeight: 800, mb: 1 }}
                    >
                        Recent ranked answers
                    </Typography>
                    <Box sx={{ overflowX: 'auto' }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={headCellSx}>
                                        Question
                                    </TableCell>
                                    <TableCell sx={headCellSx} align="center">
                                        Result
                                    </TableCell>
                                    <TableCell sx={headCellSx} align="center">
                                        Time
                                    </TableCell>
                                    <TableCell sx={headCellSx} align="center">
                                        Others correct
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {answers.map((answer, index) => (
                                    <TableRow
                                        key={`${answer.question_id}-${index}`}
                                    >
                                        <TableCell sx={cellSx}>
                                            {answer.question_en ??
                                                answer.question_id}
                                        </TableCell>
                                        <TableCell sx={cellSx} align="center">
                                            <Box
                                                component="span"
                                                sx={{
                                                    color: answer.is_correct
                                                        ? colors.good
                                                        : colors.bad,
                                                    fontWeight: 800,
                                                }}
                                            >
                                                {answer.is_correct
                                                    ? 'Correct'
                                                    : 'Wrong'}
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={cellSx} align="center">
                                            {formatSeconds(answer.answer_ms)}
                                        </TableCell>
                                        <TableCell sx={cellSx} align="center">
                                            {formatPercent(
                                                answer.population_correct_rate
                                            )}
                                            <Box
                                                component="span"
                                                sx={{
                                                    color: colors.muted,
                                                    fontSize: 12,
                                                    ml: 0.5,
                                                }}
                                            >
                                                ({answer.population_answers})
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>
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
            setError(
                caught instanceof Error ? caught.message : 'Search failed'
            )
        }
    }

    const openPlayer = async (userId: string) => {
        setLoading(true)
        try {
            setPlayer(await fetchIntegrityPlayer(token, userId, days))
        } catch (caught) {
            setError(
                caught instanceof Error ? caught.message : 'Lookup failed'
            )
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
        }-answer email floor · ${overview.flagged_accounts} flagged · ${
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
                    Ranked answer patterns for manual review. These figures are
                    review priorities, never proof of cheating, and nothing on
                    this page can restrict an account.
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

                            <ToggleButtonGroup
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
                                        {value}+ answers
                                    </ToggleButton>
                                ))}
                            </ToggleButtonGroup>

                            {loading && (
                                <CircularProgress
                                    size={18}
                                    sx={{ color: colors.accent }}
                                />
                            )}
                        </Stack>

                        {headline && (
                            <Typography
                                sx={{
                                    color: colors.muted,
                                    fontSize: 13,
                                    mb: 3,
                                }}
                            >
                                {headline}
                            </Typography>
                        )}

                        <Stack
                            component="form"
                            direction="row"
                            spacing={2}
                            sx={{ maxWidth: 480, mb: 2 }}
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
                                    px: 3,
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

                        <Glossary />

                        <Typography sx={{ fontSize: 18, fontWeight: 900, mb: 1 }}>
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
                            <Box sx={{ overflowX: 'auto' }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={headCellSx}>
                                                Player
                                            </TableCell>
                                            <TableCell
                                                sx={headCellSx}
                                                align="center"
                                            >
                                                Band
                                            </TableCell>
                                            <TableCell
                                                sx={headCellSx}
                                                align="center"
                                            >
                                                Answers
                                            </TableCell>
                                            <TableCell
                                                sx={headCellSx}
                                                align="center"
                                            >
                                                Accuracy
                                            </TableCell>
                                            <TableCell
                                                sx={headCellSx}
                                                align="center"
                                            >
                                                Z
                                            </TableCell>
                                            <TableCell
                                                sx={headCellSx}
                                                align="center"
                                            >
                                                Median time
                                            </TableCell>
                                            <TableCell
                                                sx={headCellSx}
                                                align="center"
                                            >
                                                App exits
                                            </TableCell>
                                            <TableCell
                                                sx={headCellSx}
                                                align="center"
                                            >
                                                Restricted
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {(board ?? []).map((row) => (
                                            <TableRow
                                                key={row.user_id}
                                                hover
                                                onClick={() =>
                                                    void openPlayer(
                                                        row.user_id
                                                    )
                                                }
                                                sx={{ cursor: 'pointer' }}
                                            >
                                                <TableCell sx={cellSx}>
                                                    {nameOf(row)}
                                                    <Box
                                                        component="span"
                                                        sx={{
                                                            color: colors.muted,
                                                            fontSize: 12,
                                                            ml: 1,
                                                        }}
                                                    >
                                                        {row.rating}
                                                    </Box>
                                                </TableCell>
                                                <TableCell
                                                    sx={cellSx}
                                                    align="center"
                                                >
                                                    <BandChip
                                                        band={row.review_band}
                                                    />
                                                </TableCell>
                                                <TableCell
                                                    sx={cellSx}
                                                    align="center"
                                                >
                                                    {row.scored_answers}
                                                </TableCell>
                                                <TableCell
                                                    sx={cellSx}
                                                    align="center"
                                                >
                                                    {formatPercent(
                                                        row.accuracy
                                                    )}
                                                    <Box
                                                        component="span"
                                                        sx={{
                                                            color: colors.muted,
                                                            fontSize: 12,
                                                            ml: 0.5,
                                                        }}
                                                    >
                                                        exp{' '}
                                                        {formatPercent(
                                                            row.expected_accuracy
                                                        )}
                                                    </Box>
                                                </TableCell>
                                                <TableCell
                                                    sx={cellSx}
                                                    align="center"
                                                >
                                                    {formatZ(row.z_score)}
                                                </TableCell>
                                                <TableCell
                                                    sx={cellSx}
                                                    align="center"
                                                >
                                                    {formatSeconds(
                                                        row.median_answer_ms
                                                    )}
                                                    <Box
                                                        component="span"
                                                        sx={{
                                                            color: colors.muted,
                                                            fontSize: 12,
                                                            ml: 0.5,
                                                        }}
                                                    >
                                                        {row.timed_answers}{' '}
                                                        timed
                                                    </Box>
                                                </TableCell>
                                                <TableCell
                                                    sx={cellSx}
                                                    align="center"
                                                >
                                                    {row.background_events}
                                                </TableCell>
                                                <TableCell
                                                    sx={cellSx}
                                                    align="center"
                                                >
                                                    {row.actively_restricted
                                                        ? 'Yes'
                                                        : 'No'}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        )}
                    </>
                )}
            </Container>
        </Box>
    )
}
