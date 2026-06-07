import React from 'react'
import { Helmet } from 'react-helmet'
import { Box, Button, Container, Grid, Link, Stack, Typography } from '@mui/material'
import { NavBar } from '../../components/NavBar'
import icon from '../../assets/images/krydda_icon.png'

const colors = {
    bg: '#14110E',
    surface: '#211B15',
    border: '#2C241B',
    accent: '#E2671C',
    gold: '#F4A93D',
    text: '#EFE7DD',
    muted: '#A89B8C',
}

const features = [
    {
        title: 'Bring your whole library',
        body: 'Import your entire Paprika export in one go, or clip any recipe from the web with the built-in browser. Switching is effortless — your collection comes with you.',
    },
    {
        title: 'Fast, private, offline',
        body: 'Your recipes live on your device, so everything is instant — even with thousands of recipes. Full-text search finds anything in a tap, with no connection required.',
    },
    {
        title: 'Cook smarter with AI',
        body: 'Generate fresh recipe ideas from a prompt — or from the ingredients you already cook with. Turn any recipe into a smart shopping list in one tap.',
    },
    {
        title: 'Yours, everywhere',
        body: 'Optional cloud backup keeps your library safe and synced across devices. Share any recipe as text, and enjoy a clean, modern dark design — in Swedish and English.',
    },
]

// TODO: replace with the live store URLs once the listings are public.
const APP_STORE_URL = '#'
const PLAY_STORE_URL = '#'

const Krydda: React.FC = () => {
    return (
        <Box sx={{ backgroundColor: colors.bg, minHeight: '100vh', color: colors.text }}>
            <Helmet>
                <title>Krydda — Your recipes, beautifully organized</title>
                <meta
                    name="description"
                    content="Krydda is a fast, modern recipe keeper. Import your whole Paprika library or clip recipes from the web, build smart shopping lists, and generate new ideas with AI. Offline-first, in Swedish and English."
                />
            </Helmet>
            <NavBar noImage />

            {/* Hero */}
            <Box
                sx={{
                    background: `radial-gradient(1200px 600px at 50% -10%, rgba(226,103,28,0.35), transparent 60%), ${colors.bg}`,
                    pt: { xs: 10, md: 14 },
                    pb: { xs: 8, md: 12 },
                }}
            >
                <Container maxWidth="md">
                    <Stack alignItems="center" textAlign="center" spacing={3}>
                        <Box
                            component="img"
                            src={icon}
                            alt="Krydda"
                            sx={{
                                width: { xs: 120, md: 160 },
                                height: { xs: 120, md: 160 },
                                borderRadius: 6,
                                boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
                            }}
                        />
                        <Typography variant="h2" fontWeight={900} sx={{ fontSize: { xs: 36, md: 56 } }}>
                            Krydda
                        </Typography>
                        <Typography variant="h6" sx={{ color: colors.muted, maxWidth: 580 }}>
                            A fast, modern recipe keeper. Import your whole collection, cook from a
                            smart shopping list, and generate new ideas with AI — offline-first, in
                            Swedish and English.
                        </Typography>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 1 }}>
                            <Button
                                variant="contained"
                                size="large"
                                href={APP_STORE_URL}
                                sx={{
                                    backgroundColor: colors.accent,
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    px: 4,
                                    '&:hover': { backgroundColor: '#c8571a' },
                                }}
                            >
                                Download on the App Store
                            </Button>
                            <Button
                                variant="outlined"
                                size="large"
                                href={PLAY_STORE_URL}
                                sx={{
                                    color: colors.text,
                                    borderColor: colors.border,
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    px: 4,
                                    '&:hover': { borderColor: colors.accent },
                                }}
                            >
                                Get it on Google Play
                            </Button>
                        </Stack>
                    </Stack>
                </Container>
            </Box>

            {/* Features */}
            <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
                <Grid container spacing={3}>
                    {features.map((f) => (
                        <Grid item xs={12} sm={6} key={f.title}>
                            <Box
                                sx={{
                                    height: '100%',
                                    backgroundColor: colors.surface,
                                    border: `1px solid ${colors.border}`,
                                    borderRadius: 4,
                                    p: { xs: 3, md: 4 },
                                }}
                            >
                                <Typography variant="h6" fontWeight={800} sx={{ mb: 1, color: colors.gold }}>
                                    {f.title}
                                </Typography>
                                <Typography sx={{ color: colors.muted }}>{f.body}</Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Footer */}
            <Box sx={{ borderTop: `1px solid ${colors.border}` }}>
                <Container maxWidth="lg" sx={{ py: 4 }}>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={2}
                    >
                        <Typography sx={{ color: colors.muted, fontSize: 14 }}>
                            Krydda · by Jacob Hallman
                        </Typography>
                        <Stack direction="row" spacing={3}>
                            <Link
                                href="/krydda/privacy"
                                underline="hover"
                                sx={{ color: colors.muted, fontSize: 14 }}
                            >
                                Privacy
                            </Link>
                            <Link
                                href="/krydda/terms"
                                underline="hover"
                                sx={{ color: colors.muted, fontSize: 14 }}
                            >
                                Terms
                            </Link>
                            <Link href="/contact" underline="hover" sx={{ color: colors.muted, fontSize: 14 }}>
                                Contact
                            </Link>
                        </Stack>
                    </Stack>
                </Container>
            </Box>
        </Box>
    )
}

export default Krydda
