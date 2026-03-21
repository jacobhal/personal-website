import React from 'react'

import MainJumbotron from '../.././components/MainJumbotron'

import { Box, Button } from '@mui/material'
import { Helmet } from 'react-helmet'

const About: React.FC = () => {
    return (
        <div>
            <Helmet>
                <title>Jacob Hallman - About</title>
                <meta
                    name="description"
                    content="This page contains various links to social platforms such as LinkedInand Github as well as a link to my public master's thesis."
                />
            </Helmet>
            <MainJumbotron
                title="DIG A LITTLE DEEPER"
                subtitle="Visit my social accounts to find out more about my projects"
                backgroundClass="has-bg-img-ocean"
                isFullHeight={true}
            >
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ mt: 2 }}
                >
                    <Button
                        variant="outlined"
                        color="inherit"
                        href="https://github.com/jacobhal"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="main-button always-visible"
                        sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
                    >
                        GITHUB
                    </Button>
                </Box>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ mt: 2 }}
                >
                    <Button
                        variant="outlined"
                        color="inherit"
                        id="btn-linkedin"
                        href="https://www.linkedin.com/in/jacob-hallman-603829164/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="main-button always-visible"
                        sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
                    >
                        LINKEDIN
                    </Button>
                </Box>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ mt: 2 }}
                >
                    <Button
                        variant="outlined"
                        color="inherit"
                        id="btn-thesis"
                        href="http://kth.diva-portal.org/smash/record.jsf?dswid=-8603&pid=diva2%3A1383464&c=1&searchType=SIMPLE&language=sv&query=jacob+hallman&af=%5B%5D&aq=%5B%5B%5D%5D&aq2=%5B%5B%5D%5D&aqe=%5B%5D&noOfRows=50&sortOrder=author_sort_asc&sortOrder2=title_sort_asc&onlyFullText=false&sf=all"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="main-button always-visible"
                        sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
                    >
                        MASTER THESIS
                    </Button>
                </Box>
            </MainJumbotron>
        </div>
    )
}

export default About
