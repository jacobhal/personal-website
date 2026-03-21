import React from 'react'
import { Box, Button, Container, Typography } from '@mui/material'

const NotFound: React.FC = () => {
    return (
        <Container sx={{ mt: 12, textAlign: 'center' }}>
            <Typography variant="h1" sx={{ fontSize: '200px' }}>
                Oops!
            </Typography>
            <Typography variant="h5">
                We can't seem to find the page you are looking for.
            </Typography>
            <Typography sx={{ mt: 2 }}>Error code: 404</Typography>
            <Box sx={{ mt: 3 }}>
                <Button variant="contained" size="large" href="/">
                    Home Page
                </Button>
            </Box>
        </Container>
    )
}

export default NotFound
