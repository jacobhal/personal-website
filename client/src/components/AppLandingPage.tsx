import React from 'react'
import { Helmet } from 'react-helmet'
import {
    Box,
    Button,
    Container,
    Grid,
    Link,
    Stack,
    Typography,
} from '@mui/material'

import { NavBar } from './NavBar'

import './AppLandingPage.scss'

export interface AppLandingTheme {
    background: string
    surface: string
    border: string
    accent: string
    secondaryAccent: string
    text: string
    muted: string
}

export interface AppFeature {
    title: string
    body: string
}

export interface AppStep {
    title: string
    body: string
}

export interface AppLandingPageProps {
    appName: string
    icon: string
    eyebrow: string
    title: string
    description: string
    appStoreUrl: string
    appStoreLabel: string
    theme: AppLandingTheme
    features: AppFeature[]
    steps: AppStep[]
}

const AppLandingPage: React.FC<AppLandingPageProps> = ({
    appName,
    icon,
    eyebrow,
    title,
    description,
    appStoreUrl,
    appStoreLabel,
    theme,
    features,
    steps,
}) => {
    const cssVariables = {
        '--app-background': theme.background,
        '--app-surface': theme.surface,
        '--app-border': theme.border,
        '--app-accent': theme.accent,
        '--app-secondary-accent': theme.secondaryAccent,
        '--app-text': theme.text,
        '--app-muted': theme.muted,
    } as React.CSSProperties

    return (
        <Box className="app-landing-page" style={cssVariables}>
            <Helmet>
                <title>{appName} — {eyebrow}</title>
                <meta name="description" content={description} />
            </Helmet>
            <NavBar noImage />

            <main>
                <Box component="section" className="app-landing-hero">
                    <Container maxWidth="lg">
                        <Grid
                            container
                            spacing={{ xs: 6, md: 8 }}
                            alignItems="center"
                        >
                            <Grid item xs={12} md={7}>
                                <Stack spacing={3} className="app-landing-reveal">
                                    <Typography
                                        component="p"
                                        className="app-landing-eyebrow"
                                    >
                                        <span className="app-landing-eyebrow-mark" />
                                        {eyebrow}
                                    </Typography>
                                    <Typography
                                        component="h1"
                                        className="app-landing-title"
                                    >
                                        {title}
                                    </Typography>
                                    <Typography
                                        component="p"
                                        className="app-landing-description"
                                    >
                                        {description}
                                    </Typography>
                                    <Stack
                                        direction={{ xs: 'column', sm: 'row' }}
                                        spacing={2}
                                        alignItems={{ xs: 'stretch', sm: 'center' }}
                                        sx={{ pt: 1 }}
                                    >
                                        <Button
                                            component="a"
                                            href={appStoreUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            variant="contained"
                                            className="app-landing-primary-button"
                                        >
                                            {appStoreLabel}
                                        </Button>
                                        <Link
                                            href="/portfolio"
                                            className="app-landing-text-link"
                                        >
                                            Back to selected work
                                        </Link>
                                    </Stack>
                                    <Typography
                                        component="p"
                                        className="app-landing-availability"
                                    >
                                        Available on iPhone and iPad · by Jacob Hallman
                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={5}>
                                <Box className="app-landing-icon-stage app-landing-reveal app-landing-reveal-delay">
                                    <Box className="app-landing-icon-orbit" />
                                    <Box
                                        component="img"
                                        src={icon}
                                        alt={`${appName} app icon`}
                                        className="app-landing-icon"
                                    />
                                    <Box className="app-landing-icon-caption">
                                        <span>01</span>
                                        <span>{appName}</span>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>

                <Box
                    component="section"
                    className="app-landing-section"
                    aria-labelledby="features-heading"
                >
                    <Container maxWidth="lg">
                        <Box className="app-landing-section-heading">
                            <Typography component="p" className="app-landing-kicker">
                                Why it works
                            </Typography>
                            <Typography component="h2" id="features-heading">
                                Small details, better sessions.
                            </Typography>
                        </Box>
                        <Grid container spacing={2}>
                            {features.map((feature, index) => (
                                <Grid item xs={12} sm={6} key={feature.title}>
                                    <Box className="app-landing-feature-card">
                                        <Box className="app-landing-feature-number">
                                            {String(index + 1).padStart(2, '0')}
                                        </Box>
                                        <Typography component="h3">
                                            {feature.title}
                                        </Typography>
                                        <Typography component="p">
                                            {feature.body}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                </Box>

                <Box
                    component="section"
                    className="app-landing-section app-landing-steps-section"
                    aria-labelledby="steps-heading"
                >
                    <Container maxWidth="lg">
                        <Box className="app-landing-section-heading">
                            <Typography component="p" className="app-landing-kicker">
                                The rhythm
                            </Typography>
                            <Typography component="h2" id="steps-heading">
                                Designed to get out of the way.
                            </Typography>
                        </Box>
                        <Grid container spacing={2}>
                            {steps.map((step, index) => (
                                <Grid item xs={12} md={4} key={step.title}>
                                    <Box className="app-landing-step">
                                        <Typography component="p" className="app-landing-step-index">
                                            0{index + 1}
                                        </Typography>
                                        <Typography component="h3">
                                            {step.title}
                                        </Typography>
                                        <Typography component="p">
                                            {step.body}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                </Box>
            </main>

            <Box component="footer" className="app-landing-footer">
                <Container maxWidth="lg">
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                        spacing={2}
                    >
                        <Typography component="p" className="app-landing-footer-copy">
                            {appName} · an independent project by Jacob Hallman
                        </Typography>
                        <Stack direction="row" spacing={3}>
                            <Link href="/portfolio" className="app-landing-footer-link">
                                Portfolio
                            </Link>
                            <Link href="/contact" className="app-landing-footer-link">
                                Contact
                            </Link>
                        </Stack>
                    </Stack>
                </Container>
            </Box>
        </Box>
    )
}

export default AppLandingPage
