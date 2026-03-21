import React from 'react'
import { Grid } from '@mui/material'

interface CardDeckProps {
    children: React.ReactNode
}

const CardDeck: React.FC<CardDeckProps> = ({ children }) => {
    return (
        <Grid container spacing={3} justifyContent="center">
            {React.Children.map(children, (child) => (
                <Grid item xs={12} md={4}>
                    {child}
                </Grid>
            ))}
        </Grid>
    )
}

export default CardDeck
