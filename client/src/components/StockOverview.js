
import React from 'react';

const StockOverview = (props) => {
/*
actions, balance_sheet, calendar, cashflow, dividends, 
                        earnings, financials, info, institutional_holders, isin, major_holders,
                        options, quarterly_balance_sheet, quarterly_cashflow, quarterly_earnings, quarterly_financials,
                        recommendations, splits, sustainability
*/
    const info = props.data['DATA']['INFO'];
    return (
        <div>
            <h3 className="title is-3">{info['longName']}</h3>
            <h5 className="subtitle is-5">{info['industry']}</h5>
            <div>{info['longBusinessSummary']}</div>
        </div>
    );
}

export default StockOverview;