import React from 'react'
import { Helmet } from 'react-helmet'
import { Box, Button, Container, Link, Typography } from '@mui/material'

import PersonalPageShell from '../../components/PersonalPageShell'

const currentProjects = [
    { name: 'HitQuiz', type: 'Music game', route: '/hitquiz' },
    { name: 'Dagens Ord', type: 'Daily words', route: '/dagens-ord' },
    { name: 'Skarp', type: 'Trivia app', route: '/skarp' },
    { name: 'Krydda', type: 'Recipe app', route: '/krydda' },
]

const Home: React.FC = () => {
    return (
        <Box>
            <Helmet>
                <title>Jacob Hallman — Personal projects</title>
                <meta
                    name="description"
                    content="A collection of personal apps, web tools, and experiments by Jacob Hallman."
                />
            </Helmet>
            <PersonalPageShell
                eyebrow="Jacob Hallman / personal projects"
                title={
                    <>
                        I make things for myself
                        <em> and see where they go.</em>
                    </>
                }
                description="Most projects start with a problem I’m having myself. Some stay small, some become polished apps, and a few might turn into something more."
                actions={
                    <>
                        <Button
                            component="a"
                            href="/portfolio"
                            className="personal-page-primary-action"
                        >
                            Browse projects
                        </Button>
                        <Button
                            component="a"
                            href="/about"
                            className="personal-page-secondary-action"
                        >
                            About the projects
                        </Button>
                    </>
                }
                heroAside={
                    <Box className="personal-page-signal">
                        <Typography component="p" className="personal-page-label">
                            Current projects
                        </Typography>
                        <Typography component="h2" className="personal-page-signal-title">
                            Things I’m making now.
                        </Typography>
                        <Box className="personal-page-signal-list">
                            {currentProjects.map((project) => (
                                <Box className="personal-page-signal-item" key={project.name}>
                                    <Link href={project.route}>{project.name}</Link>
                                    <Typography component="span">{project.type}</Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                }
            >
                <Container maxWidth="lg">
                    <Box
                        component="section"
                        className="personal-page-section"
                        aria-labelledby="home-focus-heading"
                    >
                        <Box className="personal-page-section-heading">
                            <Box>
                                <Typography component="p" className="personal-page-kicker">
                                    Why I build things
                                </Typography>
                                <Typography component="h2" id="home-focus-heading">
                                    Personal first. Curious always.
                                </Typography>
                            </Box>
                            <Typography component="p" className="personal-page-section-intro">
                                I care about the small problems that are interesting enough to
                                keep working on.
                            </Typography>
                        </Box>
                        <Box className="personal-page-card-grid">
                            <Box className="personal-page-card">
                                <Typography component="span" className="personal-page-card-index">
                                    01 / Problems
                                </Typography>
                                <Typography component="h3">Solve my own problems</Typography>
                                <Typography component="p">
                                    The best starting point is usually something I wish existed
                                    already.
                                </Typography>
                            </Box>
                            <Box className="personal-page-card">
                                <Typography component="span" className="personal-page-card-index">
                                    02 / Craft
                                </Typography>
                                <Typography component="h3">Make it feel right</Typography>
                                <Typography component="p">
                                    I enjoy the parts that are easy to overlook: the flow, the
                                    feedback, and the moment something feels obvious.
                                </Typography>
                            </Box>
                            <Box className="personal-page-card">
                                <Typography component="span" className="personal-page-card-index">
                                    03 / Possibilities
                                </Typography>
                                <Typography component="h3">See where it goes</Typography>
                                <Typography component="p">
                                    Some projects stay personal. Some grow into something that
                                    might be worth sharing.
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Box component="section" className="personal-page-section">
                        <Box className="personal-page-note">
                            <Typography component="p" className="personal-page-label">
                                If you’re curious
                            </Typography>
                            <Typography component="h2" className="personal-page-note-title">
                                Take a look around.
                            </Typography>
                            <Typography component="p" className="personal-page-copy-text">
                                Browse the projects or read a little about what I’m working on and
                                why.
                            </Typography>
                            <Box className="personal-page-inline-links">
                                <Link href="/portfolio">Browse the projects ↗</Link>
                                <Link href="/about">About the projects ↗</Link>
                            </Box>
                        </Box>
                    </Box>
                </Container>
            </PersonalPageShell>
        </Box>
    )
}

export default Home
