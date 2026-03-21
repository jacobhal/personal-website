import React from 'react'
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Tooltip,
    Typography,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import InfoRow from './InfoRow'

interface StockOverviewProps {
    data: any
}

const StockOverview: React.FC<StockOverviewProps> = (props) => {
    const info = props.data['DATA']['INFO']
    const error = props.data['DATA']['ERROR']

    const parseDate = (date: string) => {
        const dateInt = parseInt(date)
        const dateObject = new Date(dateInt)
        return dateObject.toLocaleString()
    }

    let htmlOutput

    if (info !== undefined) {
        const beta = info.beta
        const open = info.open
        const previousClose = info.previousClose
        const forwardPE = info.forwardPE
        const forwardEps = info.forwardEps
        const trailingPE = info.trailingPE
        const trailingEps = info.trailingEps
        const dividendYield = info.dividendYield
        const dividendRate = info.dividendRate
        const pegRatio = info.pegRatio
        const ask = info.ask
        const bid = info.bid

        const recommendations = props.data.DATA.RECOMMENDATIONS
        const hashMap: Record<string, number> = {}
        if (recommendations) {
            Object.values(recommendations['To Grade']).forEach((e: any) => {
                if (e.toUpperCase() in hashMap) {
                    hashMap[e.toUpperCase()] += 1
                } else if (e) {
                    hashMap[e.toUpperCase()] = 1
                }
            })
        }
        let hashMapSum = 0
        Object.values(hashMap).forEach((count) => {
            hashMapSum += count
        })

        const hashMapDataTips: Record<string, string> = {
            OVERWEIGHT:
                'If a stock is recommended to be overweight, the analyst opines that the stock is better value for money than others.',
            HOLD: 'Recommendation is to hold on to this stock.',
            NEUTRAL: 'Neutral recommendation.',
            BUY: 'Recommendation is to buy.',
            'SECTOR PERFORM': 'The stock is performing in its sector.',
            OUTPERFORM:
                'In financial news media Outperform is commonly used as a rating given by analysts who publicly research and recommend securities.',
            'EQUAL-WEIGHT': 'Equal value for your money as other stocks.',
            'MARKET PERFORM':
                'Market perform is an investment rating used by analysts when the expectation for a given stock or investment is that it will provide returns in line with those of the S&P 500 or other leading market averages.',
            SELL: 'The recommendation is to sell this stock.',
            PERFORM: 'The stock is likely to perform average.',
            UNDERPERFORM:
                'If an investment is underperforming, it is not keeping pace with other securities.',
            UNDERWEIGHT:
                'If a stock is deemed underweight, the analyst is saying they consider the investor should reduce their holding.',
        }
        htmlOutput = (
            <>
                <Accordion sx={{ mt: 4 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>Business summary</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>{info['longBusinessSummary']}</Typography>
                    </AccordionDetails>
                </Accordion>

                <Grid container spacing={2} sx={{ mt: 4, textAlign: 'center' }}>
                    <Grid item xs={3}>
                        <Typography>Previous close</Typography>
                        <Typography variant="h5">{previousClose}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography>Open</Typography>
                        <Typography variant="h5">{open}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Tooltip title="The price buyers are willing to pay" arrow>
                            <Typography>Ask</Typography>
                        </Tooltip>
                        <Typography variant="h5">{ask}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Tooltip title="The price sellers are willing to sell for" arrow>
                            <Typography>Bid</Typography>
                        </Tooltip>
                        <Typography variant="h5">{bid}</Typography>
                    </Grid>
                </Grid>

                <TableContainer component={Paper} sx={{ mt: 4 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ textAlign: 'center' }}>
                                    Stock metric
                                </TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>
                                    Value
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {recommendations ? (
                                <InfoRow
                                    label={
                                        'Latest recommendation (' +
                                        parseDate(
                                            recommendations.Date[
                                                Object.keys(
                                                    recommendations.Date
                                                ).length - 1
                                            ]
                                        ) +
                                        ')'
                                    }
                                    value={
                                        recommendations['To Grade'][
                                            Object.keys(
                                                recommendations['To Grade']
                                            ).length - 1
                                        ]
                                    }
                                />
                            ) : null}
                            <InfoRow
                                dataTip="Trailing = last 12 months, forward = next 12 months. Higher forward than trailing means decreased expected earnings"
                                label="Trailing P/E vs Forward P/E"
                                value={trailingPE + ' / ' + forwardPE}
                            />
                            <InfoRow
                                dataTip="Higher forward EPS than trailing EPS means earnings per share is expected to increase"
                                label="Trailing EPS vs Forward EPS"
                                value={trailingEps + ' / ' + forwardEps}
                            />
                            <InfoRow
                                dataTip="A stock with a beta of 1 is moving at the same volatility as the market. A stock with a beta greater than 1 is moving with greater volatility than the average."
                                label="beta"
                                value={beta}
                            />
                            <InfoRow
                                dataTip="The PEG ratio is a stock's P/E ratio divided by the growth rate of its earnings. It provides a more complete picture than the P/E ratio alone."
                                label="PEG ratio"
                                value={pegRatio}
                            />
                            <InfoRow
                                label="Dividend rate"
                                value={dividendRate}
                            />
                            <InfoRow
                                label="Dividend yield (%)"
                                value={
                                    dividendYield
                                        ? dividendYield * 100 + ' %'
                                        : undefined
                                }
                            />
                        </TableBody>
                    </Table>
                </TableContainer>

                {Object.keys(hashMap).length > 0 && (
                    <TableContainer component={Paper} sx={{ mt: 4 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ textAlign: 'center' }}>
                                        Recommendation
                                    </TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>
                                        Percentage
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Object.entries(hashMap)
                                    .sort(([, val1], [, val2]) => val2 - val1)
                                    .map(([recommendation, count]) => (
                                        <InfoRow
                                            dataTip={
                                                hashMapDataTips[recommendation]
                                            }
                                            key={recommendation}
                                            label={recommendation}
                                            value={
                                                count +
                                                '  (' +
                                                (
                                                    (count / hashMapSum) *
                                                    100
                                                ).toFixed(2) +
                                                ' %)'
                                            }
                                        />
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </>
        )
    } else if (error !== undefined) {
        htmlOutput = <div></div>
    }
    return <>{htmlOutput}</>
}

export default StockOverview
