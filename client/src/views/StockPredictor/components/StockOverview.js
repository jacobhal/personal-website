import React from 'react'
import { Table, Accordion, Card, Row, Col } from 'react-bootstrap'
import InfoRow from './InfoRow'

const StockOverview = (props) => {
    /*
actions, balance_sheet, calendar, cashflow, dividends, 
                        earnings, financials, info, institutional_holders, isin, major_holders,
                        options, quarterly_balance_sheet, quarterly_cashflow, quarterly_earnings, quarterly_financials,
                        recommendations, splits, sustainability
*/
    const info = props.data['DATA']['INFO']
    const error = props.data['DATA']['ERROR']
    //currentCountryCoronaData[Object.keys(currentCountryCoronaData).length - 1];
    // const apiErrorMessage = props.data['DATA']['Error message'];

    const parseDate = (date) => {
        const dateInt = parseInt(date)

        const dateObject = new Date(dateInt)

        const humanDateFormat = dateObject.toLocaleString()
        return humanDateFormat
    }

    let htmlOutput

    if (info !== undefined) {
        const beta = info.beta
        // const dayHigh = info.dayHigh;
        // const dayLow = info.dayLow;
        // const fiftyDayAverage = info.fiftyDayAverage;
        // const fiftyTwoDayHigh = info.fiftyTwoDayHigh;
        // const fiftyTwoDayLow = info.fiftyTwoDayLow;
        // const twoHundredDayAverage = info.twoHundredDayAverage;
        // const industry = info.industry;
        // const sector = info.sector;
        // const regularMarketOpen = info.regularMarketOpen;
        // const regularMarketPreviousClose = info.regularMarketPreviousClose;
        const open = info.open
        const previousClose = info.previousClose
        // const fiveYearAvgDividendYield = info.fiveYearAvgDividendYield;
        const forwardPE = info.forwardPE // Predicted P/E future, higher than current means decreased expected earnings.
        const forwardEps = info.forwardEps
        const trailingPE = info.trailingPE
        const trailingEps = info.trailingEps
        const dividendYield = info.dividendYield
        const dividendRate = info.dividendRate
        const pegRatio = info.pegRatio
        // const earningsQuarterlyGrowth = info.earningsQuarterlyGrowth;
        const ask = info.ask
        const bid = info.bid

        const recommendations = props.data.DATA.RECOMMENDATIONS
        var hashMap = {}
        Object.values(recommendations['To Grade']).forEach((e, i) => {
            if (e.toUpperCase() in hashMap) {
                hashMap[e.toUpperCase()] += 1
            } else if (e) {
                hashMap[e.toUpperCase()] = 1
            }
        })
        var hashMapSum = 0

        Object.entries(hashMap).forEach(([recommendation, count]) => {
            hashMapSum += count
        })

        var hashMapDataTips = {
            OVERWEIGHT:
                'If a stock is recommended to be overweight, the analyst opines that the stock is better value for money than others. <br/>' +
                'If a particular stock is selling for $500 and the analyst feels that the stock is worth $600, the analyst would be declaring the stock to be overweight.',
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
                'If an investment is underperforming, it is not keeping pace with other securities.' +
                'In a rising market, for example, a stock is underperforming if it is not experiencing gains equal to or greater to the advance in the S&P 500 Index.',
            UNDERWEIGHT:
                'If a stock is deemed underweight, the analyst is saying they consider the investor should reduce their holding, so that it should "weigh" less',
        }
        htmlOutput = (
            <>
                <Accordion className="mt-4">
                    <Card>
                        <Card.Header>
                            <Accordion.Toggle as={Card.Header} eventKey="0">
                                Business summary
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>{info['longBusinessSummary']}</Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>

                <Row className="mt-4">
                    <Col className="text-center">
                        <div>
                            <p>Previous close</p>
                            <h3>{previousClose}</h3>
                        </div>
                    </Col>
                    <Col className="text-center">
                        <div>
                            <p>Open</p>
                            <h3>{open}</h3>
                        </div>
                    </Col>
                    <Col className="text-center">
                        <div>
                            <p data-tip="The price buyers are willing to pay">
                                Ask
                            </p>
                            <h3>{ask}</h3>
                        </div>
                    </Col>
                    <Col className="text-center">
                        <div>
                            <p data-tip="The price sellers are willing to sell for">
                                Bid
                            </p>
                            <h3>{bid}</h3>
                        </div>
                    </Col>
                </Row>

                {/* <InfoRow label="Previous close" value={previousClose}></InfoRow>
                        <InfoRow label="Open" value={open}></InfoRow>
                        <InfoRow dataTip="The price buyers are willing to pay" label="Ask" value={ask}></InfoRow>
                        <InfoRow dataTip="The price sellers are willing to sell for" label="Bid" value={bid}></InfoRow> */}
                <Table striped bordered hover variant="dark" className="mt-4">
                    <thead>
                        <tr>
                            <th className="text-center">Stock metric</th>
                            <th className="text-center">Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        <InfoRow
                            label={
                                'Latest recommendation (' +
                                parseDate(
                                    recommendations.Date[
                                        Object.keys(recommendations.Date)
                                            .length - 1
                                    ]
                                ) +
                                ')'
                            }
                            value={
                                recommendations['To Grade'][
                                    Object.keys(recommendations['To Grade'])
                                        .length - 1
                                ]
                            }
                        ></InfoRow>
                        <InfoRow
                            dataTip="Trailing = last 12 months, forward = next 12 months. Higher forward than trailing means decreased expected earnings"
                            label="Trailing P/E vs Forward P/E"
                            value={trailingPE + ' / ' + forwardPE}
                        ></InfoRow>
                        <InfoRow
                            dataTip="Higher forward EPS than trailing EPS means earnings per share is expected to increase"
                            label="Trailing EPS vs Forward EPS"
                            value={trailingEps + ' / ' + forwardEps}
                        ></InfoRow>
                        <InfoRow
                            dataTip="A stock with a beta of 1 is moving at the same volatility as the market. <br/> A stock with a beta greater than 1 is moving with greater volatility than the average, 
                                and a stock with a beta less than 1 has less volatility than the average."
                            label="beta"
                            value={beta}
                        ></InfoRow>
                        <InfoRow
                            dataTip="The price/earnings to growth ratio (PEG ratio) is a stock's price-to-earnings (P/E) ratio divided by the growth rate of its earnings for a specified time period.
                                <br/> The PEG ratio is used to determine a stock's value while also factoring in the company's expected earnings growth, and is thought to provide a more complete picture than the more standard P/E ratio."
                            label="PEG ratio"
                            value={pegRatio}
                        ></InfoRow>
                        <InfoRow
                            label="Dividend rate"
                            value={dividendRate}
                        ></InfoRow>
                        <InfoRow
                            label="Dividend yield (%)"
                            value={dividendYield * 100 + ' %'}
                        ></InfoRow>
                    </tbody>
                </Table>
                <Table striped bordered hover variant="dark" className="mt-4">
                    <thead>
                        <tr>
                            <th className="text-center">Recommendation</th>
                            <th className="text-center">Percentage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(hashMap)
                            .sort(([, val1], [, val2]) => val2 - val1)
                            .map(([recommendation, count]) => {
                                return (
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
                                    ></InfoRow>
                                )
                            })}
                    </tbody>
                </Table>
            </>
        )
    } else if (error !== undefined) {
        htmlOutput = <div></div>
    }
    return <>{htmlOutput}</>
}

export default StockOverview
