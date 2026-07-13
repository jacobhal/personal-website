import React from 'react'
import { Helmet } from 'react-helmet'
import { Box, Container, Link, Stack, Typography } from '@mui/material'

import { NavBar } from '../../components/NavBar'
import ProjectCard from './components/ProjectCard'
import { portfolioProjects } from './portfolioData'

import '../../styles/portfolio.scss'

const Portfolio: React.FC = () => {
    return (
        <Box className="portfolio-page">
            <Helmet>
                <title>Jacob Hallman — Selected work</title>
                <meta
                    name="description"
                    content="A selection of apps, web products, experiments, and open-source projects by Jacob Hallman."
                />
            </Helmet>
            <NavBar noImage />

            <main>
                <Box component="section" className="portfolio-hero">
                    <Container maxWidth="lg">
                        <Box className="portfolio-hero-grid">
                            <Box className="portfolio-hero-copy">
                                <Typography component="p" className="portfolio-eyebrow">
                                    Independent builder · Stockholm
                                </Typography>
                                <Typography component="h1" className="portfolio-hero-title">
                                    Things I’ve built
                                    <em> and kept around.</em>
                                </Typography>
                                <Typography component="p" className="portfolio-hero-description">
                                    I build apps and web tools for small problems I keep running
                                    into, from daily words and music games to data interfaces and
                                    simple automations.
                                </Typography>
                                <Stack direction="row" spacing={3} className="portfolio-hero-links">
                                    <Link href="#selected-work" className="portfolio-hero-link">
                                        ↓ Explore the work
                                    </Link>
                                    <Link href="/contact" className="portfolio-hero-link portfolio-hero-link-muted">
                                        Start a conversation ↗
                                    </Link>
                                </Stack>
                            </Box>
                            <Box className="portfolio-hero-index" aria-label="Portfolio summary">
                                <Box className="portfolio-hero-index-orbit" aria-hidden="true" />
                                <Typography component="p" className="portfolio-index-label">
                                    Selected / 2026
                                </Typography>
                                <Typography component="p" className="portfolio-index-count">
                                    {String(portfolioProjects.length).padStart(2, '0')}
                                </Typography>
                                <Typography component="p" className="portfolio-index-caption">
                                    projects worth a closer look
                                </Typography>
                                <Box className="portfolio-index-rule" />
                                <Typography component="p" className="portfolio-index-note">
                                    Apps · data · experiments
                                </Typography>
                            </Box>
                        </Box>
                    </Container>
                </Box>

                <Box
                    component="section"
                    className="portfolio-showcase"
                    id="selected-work"
                    aria-labelledby="selected-work-heading"
                >
                    <Container maxWidth="lg">
                        <Box className="portfolio-section-heading">
                            <Box>
                                <Typography component="p" className="portfolio-kicker">
                                    Selected work
                                </Typography>
                                <Typography component="h2" id="selected-work-heading">
                                    Built to be useful.
                                </Typography>
                            </Box>
                            <Typography component="p" className="portfolio-section-description">
                                A current snapshot of the products and side projects I’m most
                                interested in right now.
                            </Typography>
                        </Box>
                        <Box className="portfolio-grid">
                            {portfolioProjects.map((project, index) => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    index={index}
                                />
                            ))}
                        </Box>
                    </Container>
                </Box>
            </main>

            <Box component="footer" className="portfolio-footer">
                <Container maxWidth="lg">
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                        spacing={2}
                    >
                        <Typography component="p" className="portfolio-footer-copy">
                            Jacob Hallman · selected work and experiments
                        </Typography>
                        <Stack direction="row" spacing={3}>
                            <Link href="/about" className="portfolio-footer-link">
                                About
                            </Link>
                            <Link href="/resume" className="portfolio-footer-link">
                                Resume
                            </Link>
                            <Link href="/contact" className="portfolio-footer-link">
                                Contact
                            </Link>
                        </Stack>
                    </Stack>
                </Container>
            </Box>
        </Box>
    )
}

export default Portfolio
