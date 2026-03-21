import React from 'react'
import pdf from '../../assets/CV_swedish.pdf'
import pdf_english from '../../assets/CV_english.pdf'

import MainJumbotron from '../.././components/MainJumbotron'

import { Box, Button } from '@mui/material'
import { Helmet } from 'react-helmet'

const Resume: React.FC = () => {
    return (
        <div>
            <Helmet>
                <title>Jacob Hallman - Resume</title>
                <meta
                    name="description"
                    content="Check out my resume in either english or swedish."
                />
            </Helmet>
            <MainJumbotron
                title="FIND OUT MORE"
                subtitle="Discover what I have done in my past"
                backgroundClass="has-bg-img-escalator"
                isFullHeight={true}
            >
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ mt: 2, display: { xs: 'none', md: 'flex' } }}
                >
                    <Button
                        variant="outlined"
                        color="inherit"
                        href={pdf}
                        download="CV_swedish.pdf"
                        className="main-button"
                    >
                        DOWNLOAD SWEDISH RESUME
                    </Button>
                </Box>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ mt: 2, display: { xs: 'none', md: 'flex' } }}
                >
                    <Button
                        variant="outlined"
                        color="inherit"
                        href={pdf_english}
                        download="CV_english.pdf"
                        className="main-button"
                    >
                        DOWNLOAD ENGLISH RESUME
                    </Button>
                </Box>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ mt: 2, display: { xs: 'flex', md: 'none' } }}
                >
                    <Button
                        variant="outlined"
                        color="inherit"
                        href={pdf}
                        download="CV_swedish.pdf"
                        className="main-button"
                    >
                        SWEDISH RESUME
                    </Button>
                </Box>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ mt: 2, display: { xs: 'flex', md: 'none' } }}
                >
                    <Button
                        variant="outlined"
                        color="inherit"
                        href={pdf_english}
                        download="CV_english.pdf"
                        className="main-button"
                    >
                        ENGLISH RESUME
                    </Button>
                </Box>
            </MainJumbotron>
        </div>
    )
}

export default Resume
