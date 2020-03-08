import React from 'react';
import { Heading} from 'react-bulma-components/full';

const StockOverview = (props) => {
/*
actions, balance_sheet, calendar, cashflow, dividends, 
                        earnings, financials, info, institutional_holders, isin, major_holders,
                        options, quarterly_balance_sheet, quarterly_cashflow, quarterly_earnings, quarterly_financials,
                        recommendations, splits, sustainability
*/
    const info = props.data['DATA']['INFO'];
    const error = props.data['DATA']['ERROR'];
    // const apiErrorMessage = props.data['DATA']['Error message'];

    let htmlOutput;

    if (info !== undefined) {
        htmlOutput = <div>
                        <Heading size={4} style={{ 
                            borderTop: '2px solid #dbdbdb', 
                            marginTop: '20px', 
                            paddingTop: '10px'}}>
                            {info['longName']}
                        </Heading>
                        <Heading subtitle size={5}>
                            {info['industry']}
                        </Heading>
                        <div>{info['longBusinessSummary']}</div>
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