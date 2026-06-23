import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Helmet } from 'react-helmet'
import {
    Box,
    Chip,
    Container,
    Link as MuiLink,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
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

interface FilingsFile {
    updated: string
    filings: Filing[]
}

const CongressFilings: React.FC = () => {
    const [data, setData] = useState<FilingsFile | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        axios
            .get<FilingsFile>(FILINGS_URL)
            .then((res) => setData(res.data))
            .catch((e) => setError(e))
            .finally(() => setIsLoading(false))
    }, [])

    return (
        <div>
            <Helmet>
                <title>Jacob Hallman - Congress Filings</title>
                <meta
                    name="description"
                    content="Periodic Transaction Reports filed with the US House Clerk by the members of Congress I track. Official public disclosures, updated daily."
                />
            </Helmet>
            <NavBar />
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Congress filings I&apos;m watching
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Periodic Transaction Reports (PTRs) filed with the US House Clerk by
                    the members I track. These are official public disclosures, and this
                    page surfaces the parsed trades so you can gauge disclosure lag faster.
                    Open the PDF for the full filing context.
                    {data ? ` Updated ${new Date(data.updated).toLocaleDateString()}.` : ''}
                </Typography>

                {isLoading && <DefaultLoader />}

                {error && (
                    <Errormessage title="Could not load filings">
                        Please try again later.
                    </Errormessage>
                )}

                {data && (
                    <TableContainer component={Paper}>
                        <Table aria-label="congress filings">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Member</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Filed</TableCell>
                                    <TableCell>Trades</TableCell>
                                    <TableCell>Disclosure</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.filings.map((f) => {
                                    const tradeSummary = summarizeTrades(f.trades ?? [])

                                    return (
                                        <TableRow key={f.doc_id} hover>
                                            <TableCell>{f.name}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    size="small"
                                                    color="primary"
                                                    label={f.filing_type === 'P' ? 'PTR' : f.filing_type}
                                                />
                                            </TableCell>
                                            <TableCell>{f.filing_date}</TableCell>
                                            <TableCell>
                                                {tradeSummary.lines.length > 0 ? (
                                                    <Box sx={{ display: 'grid', gap: 0.75 }}>
                                                        {tradeSummary.lines.map((line, index) => (
                                                            <Typography
                                                                key={`${f.doc_id}-${index}`}
                                                                variant="body2"
                                                            >
                                                                {line}
                                                            </Typography>
                                                        ))}
                                                        {tradeSummary.overflowCount > 0 && (
                                                            <Typography
                                                                variant="caption"
                                                                color="text.secondary"
                                                            >
                                                                +{tradeSummary.overflowCount} more trade
                                                                {tradeSummary.overflowCount === 1 ? '' : 's'} in
                                                                PDF
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                ) : (
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        Open PDF for trade details
                                                    </Typography>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <MuiLink
                                                    href={f.pdf_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    Open PDF
                                                </MuiLink>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                                {data.filings.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5}>
                                            <Box sx={{ py: 2 }}>No filings yet.</Box>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Container>
        </div>
    )
}

export default CongressFilings
