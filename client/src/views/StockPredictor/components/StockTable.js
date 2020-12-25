import React from 'react'

import StockTableItem from './StockTableItem'
import { Table } from 'react-bootstrap'

const StockTable = (props) => {
    /*
1. symbol, 2. name, 3. type, 4. region, 5. marketOpen, 6. marketClose, 7. timezone, 8. currency, 9. matchScore 
*/
    const searchResults = props.data['DATA']['bestMatches']
    const companies = searchResults.map((company) => (
        <StockTableItem
            key={company['1. symbol']}
            name={company['2. name']}
            symbol={company['1. symbol']}
            region={company['4. region']}
            matchScore={company['9. matchScore']}
        />
    ))
    return (
        <Table striped bordered hover className="mt-4">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Stock symbol</th>
                    <th>Region</th>
                    <th>Match score</th>
                </tr>
            </thead>
            <tbody>{companies}</tbody>
        </Table>
    )
}

export default StockTable
