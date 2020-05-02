import React from 'react';
import { Heading } from 'react-bulma-components/full';
import InfoRow from './InfoRow';

const StockOverview = (props) => {
/*
actions, balance_sheet, calendar, cashflow, dividends, 
                        earnings, financials, info, institutional_holders, isin, major_holders,
                        options, quarterly_balance_sheet, quarterly_cashflow, quarterly_earnings, quarterly_financials,
                        recommendations, splits, sustainability
*/
const info = props.data['DATA']['INFO'];
const error = props.data['DATA']['ERROR'];
    //currentCountryCoronaData[Object.keys(currentCountryCoronaData).length - 1];
    // const apiErrorMessage = props.data['DATA']['Error message'];
    
    const parseDate = (date) => {
        const dateInt = parseInt(date);
        
        const dateObject = new Date(dateInt);
        
        const humanDateFormat = dateObject.toLocaleString();
        return humanDateFormat;
    } 

    let htmlOutput;

    if (info !== undefined) {      
        const beta = info.beta;
        const dayHigh = info.dayHigh;
        const dayLow = info.dayLow;
        const fiftyDayAverage = info.fiftyDayAverage;
        const fiftyTwoDayHigh = info.fiftyTwoDayHigh;
        const fiftyTwoDayLow = info.fiftyTwoDayLow;
        const twoHundredDayAverage = info.twoHundredDayAverage;
        const industry = info.industry;
        const sector = info.sector;
        const regularMarketOpen = info.regularMarketOpen;
        const regularMarketPreviousClose = info.regularMarketPreviousClose;
        const open = info.open;
        const previousClose = info.previousClose;
        const fiveYearAvgDividendYield = info.fiveYearAvgDividendYield;
        const forwardPE = info.forwardPE; // Predicted P/E future, higher than current means decreased expected earnings.
        const forwardEps = info.forwardEps;
        const trailingPE = info.trailingPE;
        const trailingEps = info.trailingEps;
        const dividendYield = info.dividendYield;
        const dividendRate = info.dividendRate;
        const pegRatio = info.pegRatio;
        const earningsQuarterlyGrowth = info.earningsQuarterlyGrowth;
        const ask = info.ask;
        const bid = info.bid;

        const recommendations = props.data.DATA.RECOMMENDATIONS;
        htmlOutput = <div>
                        <Heading size={4} style={{ 
                            borderTop: '2px solid #dbdbdb', 
                            marginTop: '20px', 
                            paddingTop: '10px'}}>
                            {info['longName']}
                        </Heading>
                        <Heading subtitle size={5}>
                            {sector} ({industry})
                        </Heading>
                        {/* <div>{info['longBusinessSummary']}</div> */}
                        
                        <InfoRow label="Previous close" value={previousClose}></InfoRow>
                        <InfoRow label="Open" value={open}></InfoRow>
                        <InfoRow label="Ask (what buyers are willing to pay)" value={ask}></InfoRow>
                        <InfoRow label="Bid (what sellers are willing to sell for)" value={bid}></InfoRow>
                        <InfoRow label={"Latest recommendation (" + parseDate(recommendations.Date[Object.keys(recommendations.Date).length - 1]) + ")"} 
                            value={recommendations['To Grade'][Object.keys(recommendations['To Grade']).length - 1]}></InfoRow>
                        <InfoRow label="Trailing P/E vs Forward P/E (higher forward than trailing means decreased expected earnings)" value={trailingPE + " / " + forwardPE}></InfoRow>
                        <InfoRow label="Trailing EPS vs Forward EPS (higher forward than trailing means earnings per share is expected to increase)" value={trailingEps + " / " + forwardEps}></InfoRow>
                        <InfoRow label="beta" value={beta}></InfoRow>
                        <InfoRow label="Dividend rate" value={dividendRate}></InfoRow>                        
                        <InfoRow label="Dividend yield" value={dividendYield}></InfoRow>                        
                        
                    </div>
    } else if (error !== undefined) {
        htmlOutput = <div>
                        <Heading subtitle size={4} style={{ 
                            borderTop: '2px solid #dbdbdb', 
                            marginTop: '20px', 
                            paddingTop: '10px'}}>
                            {error}
                        </Heading>
                    </div>
    }
    return (
        <div>{htmlOutput}</div>     
    );
}

export default StockOverview;