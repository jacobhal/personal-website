import React from 'react'
import { Helmet } from 'react-helmet'
import { Box, Container, Link, Typography } from '@mui/material'

import PersonalPageShell from '../../components/PersonalPageShell'

const thesisUrl =
    'http://kth.diva-portal.org/smash/record.jsf?dswid=-8603&pid=diva2%3A1383464&c=1&searchType=SIMPLE&language=sv&query=jacob+hallman&af=%5B%5D&aq=%5B%5B%5D%5D&aq2=%5B%5B%5D%5D&aqe=%5B%5D&noOfRows=50&sortOrder=author_sort_asc&sortOrder2=title_sort_asc&onlyFullText=false&sf=all'

const About: React.FC = () => {
    return (
        <Box>
            <Helmet>
                <title>Jacob Hallman — About</title>
                <meta
                    name="description"
                    content="Learn more about Jacob Hallman, his projects, and his master’s thesis."
                />
            </Helmet>
            <PersonalPageShell
                eyebrow="About / Jacob Hallman"
                title={
                    <>
                        I like making useful things
                        <em> and learning along the way.</em>
                    </>
                }
                description="Most of my projects begin with a small annoyance, a question, or an idea I can’t quite leave alone. I enjoy taking it from a rough thought to something people can actually use."
                heroAside={
                    <Box className="personal-page-note">
                        <Typography component="p" className="personal-page-label">
                            The short version
                        </Typography>
                        <Typography component="h2" className="personal-page-note-title">
                            Curious by default.
                        </Typography>
                        <Typography component="p" className="personal-page-copy-text">
                            Apps, web products, data interfaces, and the details that make them
                            feel good to use.
                        </Typography>
                    </Box>
                }
            >
                <Container maxWidth="lg">
                    <Box
                        component="section"
                        className="personal-page-section"
                        aria-labelledby="about-story-heading"
                    >
                        <Box className="personal-page-copy-grid">
                            <Box className="personal-page-copy">
                                <Typography component="p" className="personal-page-kicker">
                                    A little more
                                </Typography>
                                <Typography component="h2" id="about-story-heading" className="personal-page-subheading">
                                    How I work
                                </Typography>
                                <Typography component="p">
                                    These days, that means building apps and web tools that solve
                                    small, real problems. Some become products. Some become useful
                                    experiments. All of them teach me something.
                                </Typography>
                                <Typography component="p">
                                    I’m especially interested in the space between engineering and
                                    experience: making the data, logic, and interface work together
                                    so the finished thing feels simple.
                                </Typography>
                            </Box>
                            <Box className="personal-page-principles">
                                <Box className="personal-page-principle">
                                    <Typography component="h3">Make it clear</Typography>
                                    <Typography component="p">
                                        Good interfaces should explain themselves without getting in
                                        the way.
                                    </Typography>
                                </Box>
                                <Box className="personal-page-principle">
                                    <Typography component="h3">Stay curious</Typography>
                                    <Typography component="p">
                                        The next useful idea is often hiding in an unfamiliar tool
                                        or a strange question.
                                    </Typography>
                                </Box>
                                <Box className="personal-page-principle">
                                    <Typography component="h3">Finish the details</Typography>
                                    <Typography component="p">
                                        Small interactions are part of the work, not decoration after
                                        it.
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>

                    <Box
                        component="section"
                        className="personal-page-section"
                        aria-labelledby="about-links-heading"
                    >
                        <Box className="personal-page-section-heading">
                            <Box>
                                <Typography component="p" className="personal-page-kicker">
                                    Find the work behind the work
                                </Typography>
                                <Typography component="h2" id="about-links-heading">
                                    Further reading.
                                </Typography>
                            </Box>
                            <Typography component="p" className="personal-page-section-intro">
                                A few places to see the code, the professional background, and the
                                academic work.
                            </Typography>
                        </Box>
                        <Box className="personal-page-link-grid">
                            <Link
                                href="https://github.com/jacobhal"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="personal-page-link-card"
                            >
                                <Box className="personal-page-link-meta">
                                    <span>01 / Code</span>
                                    <span>↗</span>
                                </Box>
                                <Typography component="h3">GitHub</Typography>
                                <Typography component="p">
                                    Projects, experiments, and the work in progress.
                                </Typography>
                            </Link>
                            <Link
                                href="https://www.linkedin.com/in/jacob-hallman-603829164/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="personal-page-link-card"
                            >
                                <Box className="personal-page-link-meta">
                                    <span>02 / Work</span>
                                    <span>↗</span>
                                </Box>
                                <Typography component="h3">LinkedIn</Typography>
                                <Typography component="p">
                                    Professional background and experience.
                                </Typography>
                            </Link>
                            <Link
                                href={thesisUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="personal-page-link-card"
                            >
                                <Box className="personal-page-link-meta">
                                    <span>03 / Research</span>
                                    <span>↗</span>
                                </Box>
                                <Typography component="h3">Master’s thesis</Typography>
                                <Typography component="p">
                                    The academic project behind my master’s degree.
                                </Typography>
                            </Link>
                        </Box>
                    </Box>
                </Container>
            </PersonalPageShell>
        </Box>
    )
}

export default About
