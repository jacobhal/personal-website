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
import { NavBar } from '../../components/NavBar'
import owl from '../../assets/images/skarp_owl.png'
import {
    SKARP_APP_STORE_URL,
    SKARP_PLAY_STORE_URL,
} from '../../config/appStores'

const colors = {
    bg: '#0E0E14',
    surface: '#1A1A28',
    border: '#2A2A40',
    accent: '#5C6BC0',
    gold: '#F9A825',
    text: '#ECECF2',
    muted: '#A0A0B4',
}

const features = [
    {
        title: 'Learn what matters',
        body: 'A curated bank of high-quality questions across history, science, art, geography and more — built for genuine learning, not disposable trivia.',
    },
    {
        title: 'Challenge your friends',
        body: 'Go head-to-head in real-time multiplayer battles. Answer the same questions independently and see who comes out on top.',
    },
    {
        title: 'Climb and progress',
        body: 'Track skill progression per difficulty, rise from Novice to Master, and climb the global leaderboard.',
    },
    {
        title: 'Make it yours',
        body: 'Earn coins through play and unlock avatars, frames, titles and reactions to customize your profile.',
    },
]

const Skarp: React.FC = () => {
    return (
        <Box
            sx={{
                backgroundColor: colors.bg,
                minHeight: '100vh',
                color: colors.text,
            }}
        >
            <Helmet>
                <title>Skarp — Learn through play</title>
                <meta
                    name="description"
                    content="Skarp is an educational trivia quiz app. Challenge friends, track your progress, and learn the topics that make a well-rounded mind. Available in Swedish and English."
                />
            </Helmet>
            <NavBar noImage />

            {/* Hero */}
            <Box
                sx={{
                    background: `radial-gradient(1200px 600px at 50% -10%, rgba(92,107,192,0.35), transparent 60%), ${colors.bg}`,
                    pt: { xs: 10, md: 14 },
                    pb: { xs: 8, md: 12 },
                }}
            >
                <Container maxWidth="md">
                    <Stack alignItems="center" textAlign="center" spacing={3}>
                        <Box
                            component="img"
                            src={owl}
                            alt="Skarp"
                            sx={{
                                width: { xs: 120, md: 160 },
                                height: { xs: 120, md: 160 },
                                borderRadius: 6,
                                boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
                            }}
                        />
                        <Typography
                            variant="h2"
                            fontWeight={900}
                            sx={{ fontSize: { xs: 36, md: 56 } }}
                        >
                            Skarp
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{ color: colors.muted, maxWidth: 560 }}
                        >
                            The educational trivia quiz that makes you sharper.
                            Challenge friends, climb the leaderboard, and learn
                            the topics worth knowing — in Swedish and English.
                        </Typography>
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={2}
                            sx={{ pt: 1 }}
                        >
                            <Button
                                variant="contained"
                                size="large"
                                href={SKARP_APP_STORE_URL}
                                sx={{
                                    backgroundColor: colors.accent,
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    px: 4,
                                    '&:hover': { backgroundColor: '#4d5bb0' },
                                }}
                            >
                                Download on the App Store
                            </Button>
                            <Button
                                variant="outlined"
                                size="large"
                                href={SKARP_PLAY_STORE_URL}
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
                                <Typography
                                    variant="h6"
                                    fontWeight={800}
                                    sx={{ mb: 1, color: colors.gold }}
                                >
                                    {f.title}
                                </Typography>
                                <Typography sx={{ color: colors.muted }}>
                                    {f.body}
                                </Typography>
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
                            Skarp · by Jacob Hallman
                        </Typography>
                        <Stack direction="row" spacing={3}>
                            <Link
                                href="/skarp/privacy"
                                underline="hover"
                                sx={{ color: colors.muted, fontSize: 14 }}
                            >
                                Privacy
                            </Link>
                            <Link
                                href="/skarp/terms"
                                underline="hover"
                                sx={{ color: colors.muted, fontSize: 14 }}
                            >
                                Terms
                            </Link>
                            <Link
                                href="/skarp/delete-account"
                                underline="hover"
                                sx={{ color: colors.muted, fontSize: 14 }}
                            >
                                Delete account
                            </Link>
                            <Link
                                href="/contact"
                                underline="hover"
                                sx={{ color: colors.muted, fontSize: 14 }}
                            >
                                Contact
                            </Link>
                        </Stack>
                    </Stack>
                </Container>
            </Box>
        </Box>
    )
}

export default Skarp
