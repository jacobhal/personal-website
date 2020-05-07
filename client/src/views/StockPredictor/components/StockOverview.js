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

        console.log(props.data.DATA)

        const recommendations = props.data.DATA.RECOMMENDATIONS;
        var hashMap = new Object();
        Object.values(recommendations['To Grade']).map((e, i) => {
            if (e.toUpperCase() in hashMap) {
                hashMap[e.toUpperCase()] += 1;
            } else {
                hashMap[e.toUpperCase()] = 1;
            }
        })
        var hashMapSum = 0;
        {Object.entries(hashMap).map(([recommendation, count]) => {
            hashMapSum += count;
        })}     
        var hashMapDataTips = {
            "OVERWEIGHT": 'If a stock is recommended to be overweight, the analyst opines that the stock is better value for money than others. <br/>' +
                'If a particular stock is selling for $500 and the analyst feels that the stock is worth $600, the analyst would be declaring the stock to be overweight.',
            "HOLD": "Recommendation is to hold on to this stock.",
            "NEUTRAL": "Neutral recommendation.",
            "BUY": "Recommendation is to buy.",
            "SECTOR PERFORM": "The stock is performing in its sector.",
            "OUTPERFORM": "In financial news media Outperform is commonly used as a rating given by analysts who publicly research and recommend securities.",
            "EQUAL-WEIGHT": "Equal value for your money as other stocks.",
            "MARKET PERFORM": "Market perform is an investment rating used by analysts when the expectation for a given stock or investment is that it will provide returns in line with those of the S&P 500 or other leading market averages.",
            "SELL": "The recommendation is to sell this stock.",
            "PERFORM": "The stock is likely to perform average.",
            "UNDERPERFORM": "If an investment is underperforming, it is not keeping pace with other securities." +
                "In a rising market, for example, a stock is underperforming if it is not experiencing gains equal to or greater to the advance in the S&P 500 Index.",
            "UNDERWEIGHT": 'If a stock is deemed underweight, the analyst is saying they consider the investor should reduce their holding, so that it should "weigh" less'

        }
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
                        <InfoRow dataTip="The price buyers are willing to pay" label="Ask" value={ask}></InfoRow>
                        <InfoRow dataTip="The price sellers are willing to sell for" label="Bid" value={bid}></InfoRow>
                        <InfoRow label={"Latest recommendation (" + parseDate(recommendations.Date[Object.keys(recommendations.Date).length - 1]) + ")"} 
                            value={recommendations['To Grade'][Object.keys(recommendations['To Grade']).length - 1]}></InfoRow>
                        <InfoRow dataTip="Trailing = last 12 months, forward = next 12 months. Higher forward than trailing means decreased expected earnings"
                            label="Trailing P/E vs Forward P/E" value={trailingPE + " / " + forwardPE}></InfoRow>
                        <InfoRow dataTip="Higher forward EPS than trailing EPS means earnings per share is expected to increase" label="Trailing EPS vs Forward EPS" value={trailingEps + " / " + forwardEps}></InfoRow>
                        <InfoRow dataTip="A stock with a beta of 1 is moving at the same volatility as the market. <br/> A stock with a beta greater than 1 is moving with greater volatility than the average, 
                            and a stock with a beta less than 1 has less volatility than the average."label="beta" value={beta}></InfoRow>
                        <InfoRow dataTip="The price/earnings to growth ratio (PEG ratio) is a stock's price-to-earnings (P/E) ratio divided by the growth rate of its earnings for a specified time period.
                            <br/> The PEG ratio is used to determine a stock's value while also factoring in the company's expected earnings growth, and is thought to provide a more complete picture than the more standard P/E ratio."
                            label="PEG ratio" value={pegRatio}></InfoRow>
                        <InfoRow label="Dividend rate" value={dividendRate}></InfoRow>                        
                        <InfoRow label="Dividend yield (%)" value={dividendYield*100 + ' %'}></InfoRow>      

                        {Object.entries(hashMap).map(([recommendation, count]) => {
                            return <InfoRow dataTip={hashMapDataTips[recommendation]} key={recommendation} label={recommendation} value={count + '  (' + ((count/hashMapSum)*100).toFixed(2) + ' %)'}></InfoRow>
                        })}                  
                        
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