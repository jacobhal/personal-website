import React from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'

const DefaultLoader: React.FC = () => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
        >
            <Typography variant="h5" sx={{ pb: 3 }}>
                Loading...
            </Typography>
            <CircularProgress size={200} thickness={2} />
        </Box>
    )
}

export default DefaultLoader
