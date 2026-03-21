import React from 'react'
import { TableCell, TableRow, Tooltip } from '@mui/material'

interface InfoRowProps {
    label: string
    value: string | number | null | undefined
    dataTip?: string
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value, dataTip }) => {
    return (
        <TableRow>
            <TableCell sx={{ textAlign: 'center' }}>
                {dataTip ? (
                    <Tooltip title={dataTip} arrow>
                        <span>{label}</span>
                    </Tooltip>
                ) : (
                    <span>{label}</span>
                )}
            </TableCell>
            <TableCell sx={{ textAlign: 'center' }}>
                {value ? value : 'N/A'}
            </TableCell>
        </TableRow>
    )
}

export default InfoRow
