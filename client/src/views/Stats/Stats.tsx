import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet'
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
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
    fetchAcquisitionReport,
    isAcquisitionStoreConfigured,
    type AcquisitionReport,
    type AppOverview,
} from '../../services/acquisitionStore'
import type { AcquisitionApp } from '../../services/acquisitionTelemetry'
import { summarize, type AppTotals } from './summarize'

const colors = {
    bg: '#0E0E14',
    surface: '#1A1A28',
    border: '#2A2A40',
    accent: '#5C6BC0',
    text: '#ECECF2',
    muted: '#A0A0B4',
}

const TOKEN_KEY = 'jacobhal.statsToken'
const RANGES = [7, 30, 90] as const
type AppFilter = AcquisitionApp | 'all'

const readToken = (): string => {
    try {
        return window.localStorage.getItem(TOKEN_KEY) ?? ''
    } catch {
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

const percent = (part: number, whole: number): string =>
    whole === 0 ? '—' : `${((part / whole) * 100).toFixed(1)}%`

const numberFormat = new Intl.NumberFormat('sv-SE')
const count = (value: number): string => numberFormat.format(value)

const TotalsCard: React.FC<{
    title: string
    totals: AppTotals
    overview?: AppOverview
}> = ({ title, totals, overview }) => (
    <Box
        sx={{
            flex: 1,
            minWidth: 200,
            backgroundColor: colors.surface,
            border: `1px solid ${colors.border}`,
            borderRadius: 3,
            p: 2.5,
        }}
    >
        <Typography sx={{ color: colors.muted, fontSize: 13, mb: 1.5 }}>
            {title}
        </Typography>
        <Stack direction="row" spacing={3}>
            {[
                ['Views', count(totals.views)],
                ['Clicks', count(totals.clicks)],
                ['CTR', percent(totals.clicks, totals.views)],
            ].map(([label, value]) => (
                <Box key={label}>
                    <Typography
                        sx={{ fontSize: 22, fontWeight: 800, lineHeight: 1.2 }}
                    >
                        {value}
                    </Typography>
                    <Typography sx={{ color: colors.muted, fontSize: 12 }}>
                        {label}
                    </Typography>
                </Box>
            ))}
        </Stack>
        <Typography sx={{ color: colors.muted, fontSize: 12, mt: 1.5 }}>
            iOS {count(totals.appStore)} · Android {count(totals.googlePlay)}
        </Typography>
        {overview && (
            <Box
                sx={{
                    mt: 2,
                    pt: 2,
                    borderTop: `1px solid ${colors.border}`,
                }}
            >
                <Stack direction="row" spacing={3}>
                    {[
                        ['Users', count(overview.registered_users)],
                        ['New', count(overview.new_users)],
                        ['Active', count(overview.active_users)],
                    ].map(([label, value]) => (
                        <Box key={label}>
                            <Typography
                                sx={{ fontSize: 18, fontWeight: 800 }}
                            >
                                {value}
                            </Typography>
                            <Typography
                                sx={{ color: colors.muted, fontSize: 12 }}
                            >
                                {label}
                            </Typography>
                        </Box>
                    ))}
                </Stack>
                {overview.anonymous_users > 0 && (
                    <Typography
                        sx={{ color: colors.muted, fontSize: 12, mt: 1 }}
                    >
                        plus {count(overview.anonymous_users)} guest accounts
                    </Typography>
                )}
            </Box>
        )}
    </Box>
)

/**
 * Acquisition dashboard for the app marketing pages.
 *
 * Gated by a passphrase rather than an account: the numbers are read through a
 * SECURITY DEFINER function that verifies the passphrase server-side, so the
 * anon key in the bundle grants nothing on its own. The passphrase is typed
 * once and kept in localStorage.
 *
 * Not linked from anywhere and excluded from robots.txt and the sitemap.
 */
const Stats: React.FC = () => {
    const [token, setToken] = useState(readToken)
    const [draftToken, setDraftToken] = useState('')
    const [days, setDays] = useState<number>(30)
    const [app, setApp] = useState<AppFilter>('all')
    const [report, setReport] = useState<AcquisitionReport | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const load = useCallback(async () => {
        if (!token) return
        setLoading(true)
        setError(null)
        try {
            setReport(
                await fetchAcquisitionReport(
                    token,
                    days,
                    app === 'all' ? undefined : app
                )
            )
        } catch (caught) {
            setError(
                caught instanceof Error
                    ? caught.message
                    : 'Could not load statistics'
            )
            setReport(null)
        } finally {
            setLoading(false)
        }
    }, [app, days, token])

    useEffect(() => {
        void load()
    }, [load])

    const summary = useMemo(() => summarize(report?.rows ?? []), [report])
    const overviewFor = (name: AcquisitionApp): AppOverview | undefined =>
        report?.overviews.find((entry) => entry.app === name)

    if (!isAcquisitionStoreConfigured()) {
        return (
            <Box sx={{ backgroundColor: colors.bg, minHeight: '100vh', p: 4 }}>
                <Alert severity="warning">
                    No Supabase project is configured for this build. Set
                    VITE_SUPABASE_SKARP_URL / _ANON_KEY and
                    VITE_SUPABASE_KRYDDA_URL / _ANON_KEY.
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
                <title>Acquisition stats</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
                <Typography
                    component="h1"
                    sx={{ fontSize: 28, fontWeight: 900, mb: 0.5 }}
                >
                    Acquisition
                </Typography>
                <Typography sx={{ color: colors.muted, fontSize: 14, mb: 4 }}>
                    Marketing-page views and store clicks for Skarp and Krydda.
                </Typography>

                {!token && (
                    <Stack
                        component="form"
                        direction="row"
                        spacing={2}
                        sx={{ maxWidth: 480, mb: 4 }}
                        onSubmit={(event) => {
                            event.preventDefault()
                            storeToken(draftToken)
                            setToken(draftToken)
                        }}
                    >
                        <TextField
                            fullWidth
                            size="small"
                            type="password"
                            label="Passphrase"
                            value={draftToken}
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
                            sx={{
                                backgroundColor: colors.accent,
                                textTransform: 'none',
                            }}
                        >
                            Open
                        </Button>
                    </Stack>
                )}

                {token && (
                    <>
                        <Stack
                            direction="row"
                            spacing={2}
                            flexWrap="wrap"
                            useFlexGap
                            sx={{ mb: 3 }}
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
                                value={app}
                                onChange={(_event, next) =>
                                    next !== null && setApp(next as AppFilter)
                                }
                            >
                                {(
                                    [
                                        ['all', 'Both'],
                                        ['skarp', 'Skarp'],
                                        ['krydda', 'Krydda'],
                                    ] as const
                                ).map(([value, label]) => (
                                    <ToggleButton
                                        key={value}
                                        value={value}
                                        sx={toggleSx}
                                    >
                                        {label}
                                    </ToggleButton>
                                ))}
                            </ToggleButtonGroup>

                            <Button
                                onClick={() => void load()}
                                sx={{
                                    color: colors.accent,
                                    textTransform: 'none',
                                    fontWeight: 700,
                                }}
                            >
                                Refresh
                            </Button>
                        </Stack>

                        {error && (
                            <Alert severity="error" sx={{ mb: 3 }}>
                                {error}
                            </Alert>
                        )}

                        {report !== null && report.failed.length > 0 && (
                            <Alert severity="warning" sx={{ mb: 3 }}>
                                Could not reach the{' '}
                                {report.failed.join(' and ')} project. The
                                figures below exclude it.
                            </Alert>
                        )}

                        {loading && <CircularProgress size={24} />}

                        {!loading && report !== null && report.rows.length === 0 && (
                            <Alert severity="info">
                                No events in this window. If you have just set
                                the passphrase, check it matches the one stored
                                in the database.
                            </Alert>
                        )}

                        {!loading && report !== null && report.rows.length > 0 && (
                            <>
                                <Stack
                                    direction="row"
                                    spacing={2}
                                    flexWrap="wrap"
                                    useFlexGap
                                    sx={{ mb: 4 }}
                                >
                                    <TotalsCard
                                        title="Skarp"
                                        totals={summary.byApp.skarp}
                                        overview={overviewFor('skarp')}
                                    />
                                    <TotalsCard
                                        title="Krydda"
                                        totals={summary.byApp.krydda}
                                        overview={overviewFor('krydda')}
                                    />
                                </Stack>

                                <Typography
                                    sx={{ fontWeight: 800, mb: 1.5 }}
                                >
                                    By source
                                </Typography>
                                <Box
                                    sx={{
                                        overflowX: 'auto',
                                        border: `1px solid ${colors.border}`,
                                        borderRadius: 3,
                                    }}
                                >
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                {[
                                                    'App',
                                                    'Source',
                                                    'Medium',
                                                    'Campaign',
                                                    'Creative',
                                                    'Views',
                                                    'Clicks',
                                                    'CTR',
                                                    'iOS',
                                                    'Android',
                                                ].map((heading) => (
                                                    <TableCell
                                                        key={heading}
                                                        sx={{
                                                            color: colors.muted,
                                                            borderColor:
                                                                colors.border,
                                                            fontWeight: 700,
                                                        }}
                                                    >
                                                        {heading}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {summary.rows.map((row) => (
                                                <TableRow
                                                    key={`${row.app}-${row.utm_source}-${row.utm_medium}-${row.utm_campaign}-${row.utm_content}`}
                                                >
                                                    {[
                                                        row.app,
                                                        row.utm_source,
                                                        row.utm_medium,
                                                        row.utm_campaign,
                                                        row.utm_content,
                                                        count(row.views),
                                                        count(row.clicks),
                                                        percent(
                                                            row.clicks,
                                                            row.views
                                                        ),
                                                        count(
                                                            row.clicks_app_store
                                                        ),
                                                        count(
                                                            row.clicks_google_play
                                                        ),
                                                    ].map((cell, index) => (
                                                        <TableCell
                                                            key={index}
                                                            sx={{
                                                                color: colors.text,
                                                                borderColor:
                                                                    colors.border,
                                                                whiteSpace:
                                                                    'nowrap',
                                                            }}
                                                        >
                                                            {cell}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Box>
                            </>
                        )}
                    </>
                )}
            </Container>
        </Box>
    )
}

export default Stats
