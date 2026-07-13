import React from 'react'
import { Box, Container, Link, Stack, Typography } from '@mui/material'

import { NavBar } from './NavBar'

import '../styles/personalPages.scss'

export interface PersonalPageShellProps {
    eyebrow: React.ReactNode
    title: React.ReactNode
    description: React.ReactNode
    actions?: React.ReactNode
    heroAside?: React.ReactNode
    children: React.ReactNode
}

const PersonalPageShell: React.FC<PersonalPageShellProps> = ({
    eyebrow,
    title,
    description,
    actions,
    heroAside,
    children,
}) => {
    return (
        <Box className="personal-site-page">
            <NavBar noImage />
            <main>
                <Box component="section" className="personal-page-hero">
                    <Container maxWidth="lg">
                        <Box
                            className={`personal-page-hero-grid${
                                heroAside ? '' : ' personal-page-hero-grid-single'
                            }`}
                        >
                            <Box className="personal-page-hero-copy">
                                <Typography component="p" className="personal-page-kicker">
                                    <span className="personal-page-kicker-mark" />
                                    {eyebrow}
                                </Typography>
                                <Typography component="h1" className="personal-page-title">
                                    {title}
                                </Typography>
                                <Typography component="p" className="personal-page-description">
                                    {description}
                                </Typography>
                                {actions ? (
                                    <Stack
                                        direction={{ xs: 'column', sm: 'row' }}
                                        spacing={2}
                                        className="personal-page-actions"
                                    >
                                        {actions}
                                    </Stack>
                                ) : null}
                            </Box>
                            {heroAside ? (
                                <Box className="personal-page-hero-aside">
                                    {heroAside}
                                </Box>
                            ) : null}
                        </Box>
                    </Container>
                </Box>
                <Box component="section" className="personal-page-content">
                    {children}
                </Box>
            </main>
            <Box component="footer" className="personal-page-footer">
                <Container maxWidth="lg">
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                        spacing={2}
                    >
                        <Typography component="p" className="personal-page-footer-copy">
                            Jacob Hallman · apps, web tools, and experiments
                        </Typography>
                        <Stack direction="row" spacing={3}>
                            <Link href="/portfolio" className="personal-page-footer-link">
                                Portfolio
                            </Link>
                            <Link href="/contact" className="personal-page-footer-link">
                                Contact
                            </Link>
                        </Stack>
                    </Stack>
                </Container>
            </Box>
        </Box>
    )
}

export default PersonalPageShell
