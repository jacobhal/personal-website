import React from 'react';

const StockTableItem = props => {
    return (
            <tr>
                <td><a className="stocks-table-name">{props.name}</a></td>
                <td>{props.symbol}</td>
                <td>{props.region}</td>
                <td>{props.matchScore}</td>
            </tr>
    );
}

export default StockTableItem;