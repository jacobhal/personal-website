import React from 'react';

const StockTableItem = props => {
    return (
            <tr>
                <td><p className="stocks-table-name">{props.name}</p></td>
                <td>{props.symbol}</td>
                <td>{props.region}</td>
                <td>{props.matchScore}</td>
            </tr>
    );
}

export default StockTableItem;