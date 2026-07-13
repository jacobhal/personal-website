import React from 'react'
import { Helmet } from 'react-helmet'
import { Box, Container, Link, Typography } from '@mui/material'

import PersonalPageShell from '../../components/PersonalPageShell'
import pdf from '../../assets/CV_swedish.pdf'
import pdfEnglish from '../../assets/CV_english.pdf'

const Resume: React.FC = () => {
    return (
        <Box>
            <Helmet>
                <title>Jacob Hallman — Resume</title>
                <meta
                    name="description"
                    content="Download Jacob Hallman’s resume in Swedish or English."
                />
            </Helmet>
            <PersonalPageShell
                eyebrow="Background / CV"
                title={
                    <>
                        The formal version
                        <em> if you’re curious.</em>
                    </>
                }
                description="The portfolio is the more honest version of what I spend time on. These PDFs contain the conventional overview, if that’s what you came looking for."
                heroAside={
                    <Box className="personal-page-stamp">
                        <Typography component="p" className="personal-page-label">
                            Two versions / PDF
                        </Typography>
                        <Typography component="p" className="personal-page-stamp-number">
                            02
                        </Typography>
                        <Typography component="p" className="personal-page-stamp-caption">
                            Pick a language
                        </Typography>
                    </Box>
                }
            >
                <Container maxWidth="lg">
                    <Box
                        component="section"
                        className="personal-page-section"
                        aria-labelledby="resume-download-heading"
                    >
                        <Box className="personal-page-section-heading">
                            <Box>
                                <Typography component="p" className="personal-page-kicker">
                                    Download
                                </Typography>
                                <Typography component="h2" id="resume-download-heading">
                                    Choose a version.
                                </Typography>
                            </Box>
                            <Typography component="p" className="personal-page-section-intro">
                                Both files are ready to download as PDFs and open in a new tab if
                                you’d rather read them first.
                            </Typography>
                        </Box>
                        <Box className="resume-download-grid">
                            <Link
                                href={pdf}
                                download="CV_swedish.pdf"
                                className="resume-download-card"
                            >
                                <Typography component="span" className="personal-page-link-meta">
                                    Svenska / PDF
                                </Typography>
                                <Typography component="h3">Swedish CV</Typography>
                                <Typography component="p">
                                    För dig som föredrar att läsa om min bakgrund på svenska.
                                </Typography>
                                <Box className="resume-download-action">
                                    <span>Download Swedish CV</span>
                                    <span aria-hidden="true">↗</span>
                                </Box>
                            </Link>
                            <Link
                                href={pdfEnglish}
                                download="CV_english.pdf"
                                className="resume-download-card"
                            >
                                <Typography component="span" className="personal-page-link-meta">
                                    English / PDF
                                </Typography>
                                <Typography component="h3">English CV</Typography>
                                <Typography component="p">
                                    For a quick overview of my background and experience in English.
                                </Typography>
                                <Box className="resume-download-action">
                                    <span>Download English CV</span>
                                    <span aria-hidden="true">↗</span>
                                </Box>
                            </Link>
                        </Box>
                    </Box>

                    <Box component="section" className="personal-page-section">
                        <Box className="personal-page-copy-grid">
                            <Box className="personal-page-copy">
                                <Typography component="p" className="personal-page-kicker">
                                    A little context
                                </Typography>
                                <Typography component="p">
                                    The CV is the formal version. The portfolio is where the work
                                    has room to breathe and where you can see what I’m building
                                    now.
                                </Typography>
                            </Box>
                            <Box className="personal-page-principles">
                                <Box className="personal-page-principle">
                                    <Typography component="h3">Build to learn</Typography>
                                    <Typography component="p">
                                        Side projects give me a practical reason to go deeper.
                                    </Typography>
                                </Box>
                                <Box className="personal-page-principle">
                                    <Typography component="h3">Keep it useful</Typography>
                                    <Typography component="p">
                                        I prefer small, finished ideas over impressive unfinished ones.
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Container>
            </PersonalPageShell>
        </Box>
    )
}

export default Resume
