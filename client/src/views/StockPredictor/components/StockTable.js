import React from 'react';

import StockTableItem from './StockTableItem';

const StockTable = (props) => {
/*
1. symbol, 2. name, 3. type, 4. region, 5. marketOpen, 6. marketClose, 7. timezone, 8. currency, 9. matchScore 
*/
    const searchResults = props.data['DATA']['bestMatches'];
    const companies = searchResults.map((company) =>
        <StockTableItem 
            key={company['1. symbol']}
            name={company['2. name']}
            symbol={company['1. symbol']}
            region={company['4. region']}
            matchScore={company['9. matchScore']} 
        />
    );
    return (
        <div>
            
            <table className="table">
                <thead>
                    <tr>
                        <td className="has-text-weight-bold">Name</td>
                        <td className="has-text-weight-bold">Stock symbol</td>
                        <td className="has-text-weight-bold">Region</td>
                        <td className="has-text-weight-bold">Match score</td>
                    </tr>
                </thead>
                <tbody>
                    {companies}
                </tbody>
            </table>
        </div>
    );
}

export default StockTable;