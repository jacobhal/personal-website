import React from 'react'
import { Grid, Tooltip, Typography } from '@mui/material'

interface InfoSectionProps {
    label?: string
    value?: string | number | null
    dataTip?: string
}

const InfoSection: React.FC<InfoSectionProps> = ({ label, value, dataTip }) => {
    return (
        <Grid container>
            <Grid item xs={6}>
                {dataTip ? (
                    <Tooltip title={dataTip} arrow>
                        <Typography fontWeight="bold">{label}</Typography>
                    </Tooltip>
                ) : (
                    <Typography fontWeight="bold">{label}</Typography>
                )}
            </Grid>
            <Grid item xs={6}>
                <Typography>{value ? value : 'N/A'}</Typography>
            </Grid>
        </Grid>
    )
}

export default InfoSection