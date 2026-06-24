import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { Helmet } from 'react-helmet'
import {
    Box,
    Chip,
    Container,
    Link as MuiLink,
    MenuItem,
    Paper,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Tabs,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material'

import { NavBar } from '../../components/NavBar'
import DefaultLoader from '../../components/DefaultLoader'
import Errormessage from '../../components/Errormessage'
import { type FilingTrade, summarizeTrades } from './tradeFormatting'

// Data file produced by the GitHub Actions notifier (notifier/check_filings.py),
// fetched live from the repo so the page reflects the latest run without a redeploy.
const FILINGS_URL =
    'https://raw.githubusercontent.com/jacobhal/personal-website/master/notifier/filings.json'

interface Filing {
    name: string
    filing_type: string
    filing_date: string
    year: string
    doc_id: string
    pdf_url: string
    proven?: boolean
    trades?: FilingTrade[]
}

interface ConsensusRow {
    ticker: string
    member_count: number
    members: string[]
    last_txn_date: string
}

interface LeaderboardRow {
    ticker: string
    member_count: number
    members: string[]
    trade_count: number
    approx_dollars: number
}

interface StockRow {
    ticker: string
    buys: number
    sells: number
    member_count: number
    members: string[]
    last_txn_date: string
}

interface FilingsFile {
    updated: string
    window_days?: number
    proven_members?: string[]
    filings: Filing[]
    consensus?: ConsensusRow[]
    leaderboard?: LeaderboardRow[]
    stocks?: StockRow[]
}

const money = (v: number): string => {
    if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
    if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`
    return `$${v}`
}

// A ticker rendered as a link to its TradingView chart (opens in a new tab).
const chartUrl = (ticker: string): string =>
    `https://www.tradingview.com/symbols/${encodeURIComponent(ticker)}/`

const TickerLink: React.FC<{ ticker: string }> = ({ ticker }) => (
    <MuiLink href={chartUrl(ticker)} target="_blank" rel="noopener noreferrer">
        {ticker}
    </MuiLink>
)

const daysAgo = (iso: string): number | null => {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return null
    return Math.floor((Date.now() - d.getTime()) / 86_400_000)
}

interface BuyIdea {
    member: string
    ticker: string
    instrument: string
    txn_date: string
    amount_low: number | null
    amount_high: number | null
    pct_since?: number | null
    price_then?: number | null
    price_now?: number | null
    pdf_url: string
}

const TabPanel: React.FC<{ value: number; index: number; children: React.ReactNode }> = ({
    value,
    index,
    children,
}) => (value === index ? <Box sx={{ pt: 3 }}>{children}</Box> : null)

type Order = 'asc' | 'desc'
interface Sort {
    key: string
    order: Order
}

// Generic column sort: numbers compared numerically, everything else as strings.
function applySort<T>(rows: T[], { key, order }: Sort): T[] {
    return [...rows].sort((a, b) => {
        const av = (a as Record<string, unknown>)[key]
        const bv = (b as Record<string, unknown>)[key]
        const cmp =
            typeof av === 'number' && typeof bv === 'number'
                ? av - bv
                : String(av ?? '').localeCompare(String(bv ?? ''))
        return order === 'asc' ? cmp : -cmp
    })
}

// A clickable, sortable header cell. First click sorts descending ("most" first).
const SortCell: React.FC<{
    label: string
    col: string
    sort: Sort
    setSort: (s: Sort) => void
    align?: 'left' | 'center' | 'right'
}> = ({ label, col, sort, setSort, align }) => (
    <TableCell align={align} sortDirection={sort.key === col ? sort.order : false}>
        <TableSortLabel
            active={sort.key === col}
            direction={sort.key === col ? sort.order : 'desc'}
            onClick={() =>
                setSort({
                    key: col,
                    order: sort.key === col && sort.order === 'desc' ? 'asc' : 'desc',
                })
            }
        >
            {label}
        </TableSortLabel>
    </TableCell>
)

const CongressFilings: React.FC = () => {
    const [data, setData] = useState<FilingsFile | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)
    const [tab, setTab] = useState(0)
    const [stockQuery, setStockQuery] = useState('')

    useEffect(() => {
        axios
            .get<FilingsFile>(FILINGS_URL)
            .then((res) => setData(res.data))
            .catch((e) => setError(e))
            .finally(() => setIsLoading(false))
    }, [])

    const [consensusSort, setConsensusSort] = useState<Sort>({ key: 'member_count', order: 'desc' })
    const [leaderSort, setLeaderSort] = useState<Sort>({ key: 'member_count', order: 'desc' })
    const [stockSort, setStockSort] = useState<Sort>({ key: 'member_count', order: 'desc' })
    const [filingSort, setFilingSort] = useState<Sort>({ key: 'filing_date', order: 'desc' })
    const [memberFilter, setMemberFilter] = useState('')

    const filteredStocks = useMemo(() => {
        const stocks = data?.stocks ?? []
        const q = stockQuery.trim().toUpperCase()
        return q ? stocks.filter((s) => s.ticker.toUpperCase().includes(q)) : stocks
    }, [data, stockQuery])

    const sortedConsensus = useMemo(
        () => applySort(data?.consensus ?? [], consensusSort), [data, consensusSort])
    const sortedLeaderboard = useMemo(
        () => applySort(data?.leaderboard ?? [], leaderSort), [data, leaderSort])
    const sortedStocks = useMemo(
        () => applySort(filteredStocks, stockSort), [filteredStocks, stockSort])
    const sortedFilings = useMemo(
        () => applySort(data?.filings ?? [], filingSort), [data, filingSort])

    const allMembers = useMemo(
        () => Array.from(new Set((data?.filings ?? []).map((f) => f.name))).sort(),
        [data])

    const visibleFilings = useMemo(
        () => (memberFilter ? sortedFilings.filter((f) => f.name === memberFilter) : sortedFilings),
        [sortedFilings, memberFilter])

    // Flattened recent BUYS, newest trade first — a ready action list.
    const buyIdeas = useMemo<BuyIdea[]>(() => {
        const out: BuyIdea[] = []
        for (const f of data?.filings ?? []) {
            for (const t of f.trades ?? []) {
                if (t.side !== 'buy' || !t.ticker) continue
                out.push({
                    member: f.name,
                    ticker: t.ticker,
                    instrument: t.instrument,
                    txn_date: t.txn_date,
                    amount_low: t.amount_low,
                    amount_high: t.amount_high,
                    pct_since: t.pct_since,
                    price_then: t.price_then,
                    price_now: t.price_now,
                    pdf_url: f.pdf_url,
                })
            }
        }
        return out.sort((a, b) => b.txn_date.localeCompare(a.txn_date))
    }, [data])

    const windowDays = data?.window_days ?? 365
    const provenSet = useMemo(() => new Set(data?.proven_members ?? []), [data])
    const memberLabel = (name: string): string => (provenSet.has(name) ? `⭐ ${name}` : name)

    return (
        <div>
            <Helmet>
                <title>Jacob Hallman - Congress Trades</title>
                <meta
                    name="description"
                    content="Patterns in US House members' disclosed stock trades: where multiple members overlap, what's being accumulated, and per-stock activity. Official public data."
                />
            </Helmet>
            <NavBar />
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Congress trades &amp; patterns
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Parsed from official US House PTR filings by the members I track. The
                    edge here isn&apos;t timing (trades surface up to ~45 days late) &mdash;
                    it&apos;s <strong>conviction</strong>: which names multiple members keep
                    buying.
                    {data ? ` Updated ${new Date(data.updated).toLocaleDateString()}.` : ''}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 3 }}>
                    ⭐ = cited top-return performer (Unusual Whales / Quiver annual rankings). Pelosi
                    is the consistent multi-year name; others reflect a strong single year, so weight
                    accordingly.
                </Typography>

                {isLoading && <DefaultLoader />}
                {error && (
                    <Errormessage title="Could not load data">
                        Please try again later.
                    </Errormessage>
                )}

                {data && (
                    <>
                        <Tabs
                            value={tab}
                            onChange={(_e, v) => setTab(v)}
                            sx={{ borderBottom: 1, borderColor: 'divider' }}
                        >
                            <Tab label="Patterns" />
                            <Tab label="Buy ideas" />
                            <Tab label="Filings" />
                            <Tab label="Stocks" />
                        </Tabs>

                        {/* PATTERNS */}
                        <TabPanel value={tab} index={0}>
                            <Typography variant="h6" gutterBottom>
                                Consensus buys
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                                Tickers bought by 2+ tracked members in the last {windowDays} days.
                            </Typography>
                            <TableContainer component={Paper} sx={{ mb: 4 }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <SortCell label="Ticker" col="ticker" sort={consensusSort} setSort={setConsensusSort} />
                                            <SortCell label="Members" col="member_count" sort={consensusSort} setSort={setConsensusSort} align="center" />
                                            <TableCell>Who</TableCell>
                                            <SortCell label="Latest buy" col="last_txn_date" sort={consensusSort} setSort={setConsensusSort} />
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {sortedConsensus.map((c) => (
                                            <TableRow key={c.ticker} hover>
                                                <TableCell>
                                                    <MuiLink href={chartUrl(c.ticker)} target="_blank" rel="noopener noreferrer" underline="none">
                                                        <Chip size="small" color="success" label={c.ticker} clickable />
                                                    </MuiLink>
                                                </TableCell>
                                                <TableCell align="center">{c.member_count}</TableCell>
                                                <TableCell>{c.members.map(memberLabel).join(', ')}</TableCell>
                                                <TableCell>{c.last_txn_date}</TableCell>
                                            </TableRow>
                                        ))}
                                        {(data.consensus ?? []).length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={4}>
                                                    No multi-member overlap in the window yet.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Typography variant="h6" gutterBottom>
                                Most accumulated (buys)
                            </Typography>
                            <TableContainer component={Paper}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <SortCell label="Ticker" col="ticker" sort={leaderSort} setSort={setLeaderSort} />
                                            <SortCell label="Members" col="member_count" sort={leaderSort} setSort={setLeaderSort} align="center" />
                                            <SortCell label="Buys" col="trade_count" sort={leaderSort} setSort={setLeaderSort} align="center" />
                                            <SortCell label="Approx $" col="approx_dollars" sort={leaderSort} setSort={setLeaderSort} align="right" />
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {sortedLeaderboard.map((r) => (
                                            <TableRow key={r.ticker} hover>
                                                <TableCell><TickerLink ticker={r.ticker} /></TableCell>
                                                <TableCell align="center">{r.member_count}</TableCell>
                                                <TableCell align="center">{r.trade_count}</TableCell>
                                                <TableCell align="right">{money(r.approx_dollars)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </TabPanel>

                        {/* BUY IDEAS */}
                        <TabPanel value={tab} index={1}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Every disclosed BUY, newest trade first. Tap a ticker for its chart.
                                &ldquo;Since trade&rdquo; is the price move since they bought &mdash;{' '}
                                <Box component="span" sx={{ color: 'success.main' }}>green</Box> means
                                it&apos;s at or below the trade price (your buy zone). Prices fill in
                                over a few runs and show &ldquo;&mdash;&rdquo; until then.
                            </Typography>
                            <TableContainer component={Paper}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Member</TableCell>
                                            <TableCell>Ticker</TableCell>
                                            <TableCell>Amount</TableCell>
                                            <TableCell>Traded</TableCell>
                                            <TableCell>Since trade</TableCell>
                                            <TableCell>Filing</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {buyIdeas.slice(0, 300).map((b, i) => {
                                            const age = daysAgo(b.txn_date)
                                            return (
                                                <TableRow key={`${b.ticker}-${b.txn_date}-${i}`} hover>
                                                    <TableCell>{memberLabel(b.member)}</TableCell>
                                                    <TableCell>
                                                        <TickerLink ticker={b.ticker} />
                                                        {b.instrument === 'options' ? ' (opt)' : ''}
                                                    </TableCell>
                                                    <TableCell>
                                                        {b.amount_low != null ? money(b.amount_low) : '?'}
                                                        {b.amount_high != null ? `–${money(b.amount_high)}` : ''}
                                                    </TableCell>
                                                    <TableCell>
                                                        {b.txn_date}
                                                        {age != null ? ` (${age}d ago)` : ''}
                                                    </TableCell>
                                                    <TableCell>
                                                        {b.pct_since != null ? (
                                                            <Tooltip
                                                                title={
                                                                    b.price_then != null && b.price_now != null
                                                                        ? `$${b.price_then} → $${b.price_now}`
                                                                        : ''
                                                                }
                                                            >
                                                                <Typography
                                                                    variant="body2"
                                                                    component="span"
                                                                    sx={{
                                                                        color:
                                                                            b.pct_since <= 0
                                                                                ? 'success.main'
                                                                                : 'error.main',
                                                                    }}
                                                                >
                                                                    {b.pct_since > 0 ? '+' : ''}
                                                                    {b.pct_since}%
                                                                </Typography>
                                                            </Tooltip>
                                                        ) : (
                                                            <Typography variant="caption" color="text.secondary">
                                                                —
                                                            </Typography>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <MuiLink href={b.pdf_url} target="_blank" rel="noopener noreferrer">
                                                            PDF
                                                        </MuiLink>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </TabPanel>

                        {/* FILINGS */}
                        <TabPanel value={tab} index={2}>
                            <TextField
                                select
                                size="small"
                                label="Member"
                                value={memberFilter}
                                onChange={(e) => setMemberFilter(e.target.value)}
                                sx={{ mb: 2, minWidth: 220 }}
                            >
                                <MenuItem value="">All members</MenuItem>
                                {allMembers.map((m) => (
                                    <MenuItem key={m} value={m}>
                                        {memberLabel(m)}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <SortCell label="Member" col="name" sort={filingSort} setSort={setFilingSort} />
                                            <SortCell label="Filed" col="filing_date" sort={filingSort} setSort={setFilingSort} />
                                            <TableCell>Trades</TableCell>
                                            <TableCell>Disclosure</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {visibleFilings.map((f) => {
                                            const summary = summarizeTrades(f.trades ?? [])
                                            return (
                                                <TableRow key={f.doc_id} hover>
                                                    <TableCell>{memberLabel(f.name)}</TableCell>
                                                    <TableCell>{f.filing_date}</TableCell>
                                                    <TableCell>
                                                        {summary.lines.length > 0 ? (
                                                            <Box sx={{ display: 'grid', gap: 0.5 }}>
                                                                {summary.lines.map((line, i) => (
                                                                    <Typography key={`${f.doc_id}-${i}`} variant="body2">
                                                                        {line}
                                                                    </Typography>
                                                                ))}
                                                                {summary.overflowCount > 0 && (
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        +{summary.overflowCount} more in PDF
                                                                    </Typography>
                                                                )}
                                                            </Box>
                                                        ) : (
                                                            <Typography variant="body2" color="text.secondary">
                                                                Open PDF for details
                                                            </Typography>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <MuiLink href={f.pdf_url} target="_blank" rel="noopener noreferrer">
                                                            Open PDF
                                                        </MuiLink>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </TabPanel>

                        {/* STOCKS */}
                        <TabPanel value={tab} index={3}>
                            <TextField
                                size="small"
                                label="Filter ticker"
                                value={stockQuery}
                                onChange={(e) => setStockQuery(e.target.value)}
                                sx={{ mb: 2 }}
                            />
                            <TableContainer component={Paper}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <SortCell label="Ticker" col="ticker" sort={stockSort} setSort={setStockSort} />
                                            <SortCell label="Members" col="member_count" sort={stockSort} setSort={setStockSort} align="center" />
                                            <SortCell label="Buys" col="buys" sort={stockSort} setSort={setStockSort} align="center" />
                                            <SortCell label="Sells" col="sells" sort={stockSort} setSort={setStockSort} align="center" />
                                            <SortCell label="Last activity" col="last_txn_date" sort={stockSort} setSort={setStockSort} />
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {sortedStocks.slice(0, 200).map((s) => (
                                            <TableRow key={s.ticker} hover>
                                                <TableCell>
                                                    <Tooltip title={s.members.map(memberLabel).join(', ')}>
                                                        <span><TickerLink ticker={s.ticker} /></span>
                                                    </Tooltip>
                                                </TableCell>
                                                <TableCell align="center">{s.member_count}</TableCell>
                                                <TableCell align="center">{s.buys}</TableCell>
                                                <TableCell align="center">{s.sells}</TableCell>
                                                <TableCell>{s.last_txn_date}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </TabPanel>
                    </>
                )}
            </Container>
        </div>
    )
}

export default CongressFilings
