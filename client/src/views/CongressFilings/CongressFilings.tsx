import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { Helmet } from 'react-helmet'
import {
    Box,
    Chip,
    Container,
    Link as MuiLink,
    Paper,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
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

const TabPanel: React.FC<{ value: number; index: number; children: React.ReactNode }> = ({
    value,
    index,
    children,
}) => (value === index ? <Box sx={{ pt: 3 }}>{children}</Box> : null)

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

    const filteredStocks = useMemo(() => {
        const stocks = data?.stocks ?? []
        const q = stockQuery.trim().toUpperCase()
        const matched = q
            ? stocks.filter((s) => s.ticker.toUpperCase().includes(q))
            : stocks
        return [...matched].sort(
            (a, b) =>
                b.member_count - a.member_count ||
                b.last_txn_date.localeCompare(a.last_txn_date)
        )
    }, [data, stockQuery])

    const windowDays = data?.window_days ?? 365

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
                                            <TableCell>Ticker</TableCell>
                                            <TableCell align="center">Members</TableCell>
                                            <TableCell>Who</TableCell>
                                            <TableCell>Latest buy</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {(data.consensus ?? []).map((c) => (
                                            <TableRow key={c.ticker} hover>
                                                <TableCell>
                                                    <Chip size="small" color="success" label={c.ticker} />
                                                </TableCell>
                                                <TableCell align="center">{c.member_count}</TableCell>
                                                <TableCell>{c.members.join(', ')}</TableCell>
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
                                            <TableCell>Ticker</TableCell>
                                            <TableCell align="center">Members</TableCell>
                                            <TableCell align="center">Buys</TableCell>
                                            <TableCell align="right">Approx $</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {(data.leaderboard ?? []).map((r) => (
                                            <TableRow key={r.ticker} hover>
                                                <TableCell>{r.ticker}</TableCell>
                                                <TableCell align="center">{r.member_count}</TableCell>
                                                <TableCell align="center">{r.trade_count}</TableCell>
                                                <TableCell align="right">{money(r.approx_dollars)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </TabPanel>

                        {/* FILINGS */}
                        <TabPanel value={tab} index={1}>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Member</TableCell>
                                            <TableCell>Filed</TableCell>
                                            <TableCell>Trades</TableCell>
                                            <TableCell>Disclosure</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data.filings.map((f) => {
                                            const summary = summarizeTrades(f.trades ?? [])
                                            return (
                                                <TableRow key={f.doc_id} hover>
                                                    <TableCell>{f.name}</TableCell>
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
                        <TabPanel value={tab} index={2}>
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
                                            <TableCell>Ticker</TableCell>
                                            <TableCell align="center">Members</TableCell>
                                            <TableCell align="center">Buys</TableCell>
                                            <TableCell align="center">Sells</TableCell>
                                            <TableCell>Last activity</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredStocks.slice(0, 200).map((s) => (
                                            <TableRow key={s.ticker} hover>
                                                <TableCell>
                                                    <Tooltip title={s.members.join(', ')}>
                                                        <span>{s.ticker}</span>
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
