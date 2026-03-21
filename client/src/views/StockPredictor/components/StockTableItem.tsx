import React from 'react'
import { TableCell, TableRow } from '@mui/material'

interface StockTableItemProps {
    name: string
    symbol: string
    region: string
    matchScore: string
}

const StockTableItem: React.FC<StockTableItemProps> = (props) => {
    return (
        <TableRow>
            <TableCell>
                <p className="stocks-table-name">{props.name}</p>
            </TableCell>
            <TableCell>{props.symbol}</TableCell>
            <TableCell>{props.region}</TableCell>
            <TableCell>{props.matchScore}</TableCell>
        </TableRow>
    )
}

export default StockTableItem