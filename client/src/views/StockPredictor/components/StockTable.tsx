import React from 'react'

import StockTableItem from './StockTableItem'
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material'

interface StockTableProps {
    data: any
}

const StockTable: React.FC<StockTableProps> = (props) => {
    const searchResults = props.data['DATA']['bestMatches']
    const companies = searchResults.map((company: any) => (
        <StockTableItem
            key={company['1. symbol']}
            name={company['2. name']}
            symbol={company['1. symbol']}
            region={company['4. region']}
            matchScore={company['9. matchScore']}
        />
    ))
    return (
        <TableContainer component={Paper} sx={{ mt: 4 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Stock symbol</TableCell>
                        <TableCell>Region</TableCell>
                        <TableCell>Match score</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>{companies}</TableBody>
            </Table>
        </TableContainer>
    )
}

export default StockTable
