import React from 'react'
import { Helmet } from 'react-helmet'
import { PageFavicon } from '../../components/PageFavicon'
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
import { PhoneShowcase } from '../../components/PhoneShowcase'
import icon from '../../assets/images/krydda_icon.png'
import {
    KRYDDA_APP_STORE_URL,
    KRYDDA_PLAY_STORE_URL,
} from '../../config/appStores'

const colors = {
    bg: '#14110E',
    surface: '#211B15',
    border: '#2C241B',
    accent: '#E2671C',
    gold: '#F4A93D',
    text: '#EFE7DD',
    muted: '#A89B8C',
}

/**
 * The alternating "show, don't tell" sections.
 *
 * Each has a still today and gains a video the moment one is recorded into
 * public/krydda — no code change needed beyond adding the `video` field. The
 * first two are the differentiators: no competitor can show a recipe arriving
 * from a web page or an Instagram post in three seconds.
 */
interface Showcase {
    eyebrow: string
    title: string
    body: string
    image: string
    alt: string
    /** Drop a recording into public/krydda and point at it here; the section
     *  upgrades from still to video with no other change. */
    video?: string
    /** Mirrors the layout so the page alternates rather than marching. */
    reverse?: boolean
}

const showcases: Showcase[] = [
    {
        eyebrow: 'Save from anywhere',
        title: 'Any recipe page.\nOne tap.',
        body: 'Open a recipe in Krydda’s own browser and tap once. Ingredients, steps, times and the photo come across — no AI, no copying, no retyping. Tested against the biggest recipe sites in Sweden and abroad.',
        image: '/krydda-media/web-import-poster.jpg',
        video: '/krydda-media/web-import.mp4',
        alt: 'Saving a recipe from a website inside Krydda',
    },
    {
        eyebrow: 'Instagram and TikTok',
        title: 'Share a post.\nGet a real recipe.',
        body: 'Found dinner in a Reel? Share the post to Krydda and its caption becomes a proper recipe with an ingredient list you can take to the shop — and a link back to the creator.',
        image: '/krydda-media/social.jpg',
        alt: 'Sharing an Instagram post into Krydda',
        reverse: true,
    },
    {
        eyebrow: 'Weekly planning',
        title: 'A week of dinners,\nplanned in seconds.',
        body: 'Tell Krydda what you like and it builds a full week from your own recipes — then turns the whole plan into one shopping list, sorted and de-duplicated.',
        image: '/krydda-media/weekly.jpg',
        alt: 'Krydda generating a weekly meal plan',
    },
    {
        eyebrow: 'Cooking, not admin',
        title: 'One list for\nthe whole week.',
        body: 'Every ingredient from every planned meal, combined into a single list. Check things off as you shop, keep a pantry, and share the list with the household.',
        image: '/krydda-media/groceries.jpg',
        alt: 'Krydda shopping list',
        reverse: true,
    },
]

const features = [
    {
        title: 'Switch in one go',
        body: 'Import a whole Paprika, Recipe Keeper, Crouton or Mela export at once. Nothing is left behind, and nothing is retyped.',
    },
    {
        title: 'Instant, even offline',
        body: 'Recipes live on your phone. Search thousands of them in a tap, on the train, in the shop, with no signal.',
    },
    {
        title: 'Cook hands-free',
        body: 'A cook mode built for messy hands: big steps, timers that keep ringing, and a screen that stays awake.',
    },
    {
        title: 'One cookbook for the household',
        body: 'Share a library with your family so the same recipes are on everyone’s phone — no screenshots, no forwarding.',
    },
]

const Krydda: React.FC = () => {
    return (
        <Box
            sx={{
                backgroundColor: colors.bg,
                minHeight: '100vh',
                color: colors.text,
            }}
        >
            <PageFavicon icon32="/app-icons/krydda-32.png" icon180="/app-icons/krydda-180.png" />
            <Helmet>
                <title>
                    Krydda — every recipe you love, in one place
                </title>
                <meta
                    name="description"
                    content="Save recipes from any website or an Instagram post, plan the week, and shop from one list. Krydda keeps your collection on your phone — fast, offline and yours. Swedish and English."
                />
                {/* Link previews. Outreach lives or dies on how the link looks
                    when a creator pastes it into a DM or a Slack thread. */}
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="Krydda" />
                <meta
                    property="og:title"
                    content="Krydda — every recipe you love, in one place"
                />
                <meta
                    property="og:description"
                    content="Save recipes from any website or an Instagram post, plan the week, and shop from one list."
                />
                <meta
                    property="og:url"
                    content="https://jacobhal.se/krydda"
                />
                <meta
                    property="og:image"
                    content="https://jacobhal.se/krydda-media/og-image.jpg"
                />
                <meta name="twitter:card" content="summary_large_image" />
                <meta
                    name="twitter:title"
                    content="Krydda — every recipe you love, in one place"
                />
                <meta
                    name="twitter:description"
                    content="Save recipes from any website or an Instagram post, plan the week, and shop from one list."
                />
                <meta
                    name="twitter:image"
                    content="https://jacobhal.se/krydda-media/og-image.jpg"
                />
                <link rel="canonical" href="https://jacobhal.se/krydda" />
            </Helmet>
            <NavBar noImage />

            {/* Hero */}
            <Box
                sx={{
                    background: `radial-gradient(1100px 520px at 50% -12%, rgba(226,103,28,0.30), transparent 62%), ${colors.bg}`,
                    pt: { xs: 9, md: 13 },
                    pb: { xs: 7, md: 10 },
                }}
            >
                <Container maxWidth="md">
                    <Stack alignItems="center" textAlign="center" spacing={3}>
                        <Box
                            component="img"
                            src={icon}
                            alt="Krydda"
                            sx={{
                                width: { xs: 84, md: 96 },
                                height: { xs: 84, md: 96 },
                                borderRadius: 5,
                                boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
                            }}
                        />
                        <Typography
                            component="h1"
                            fontWeight={900}
                            sx={{
                                fontSize: { xs: 40, sm: 54, md: 68 },
                                lineHeight: 1.02,
                                letterSpacing: '-0.03em',
                                maxWidth: 780,
                            }}
                        >
                            Every recipe you love.
                            <Box component="span" sx={{ color: colors.muted }}>
                                {' '}
                                In one place.
                            </Box>
                        </Typography>
                        <Typography
                            sx={{
                                color: colors.muted,
                                maxWidth: 560,
                                fontSize: { xs: 17, md: 19 },
                                lineHeight: 1.5,
                            }}
                        >
                            Save from any website or an Instagram post, plan the
                            week, and shop from one list. Your recipes stay on
                            your phone — fast, offline, and yours.
                        </Typography>
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={2}
                            sx={{ pt: 1 }}
                        >
                            <Button
                                variant="contained"
                                size="large"
                                href={KRYDDA_APP_STORE_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                    backgroundColor: colors.accent,
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    fontSize: 16,
                                    px: 4,
                                    py: 1.4,
                                    borderRadius: 2.5,
                                    '&:hover': { backgroundColor: '#c8571a' },
                                }}
                            >
                                Download on the App Store
                            </Button>
                            <Button
                                variant="outlined"
                                size="large"
                                href={KRYDDA_PLAY_STORE_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                    color: colors.text,
                                    borderColor: colors.border,
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    fontSize: 16,
                                    px: 4,
                                    py: 1.4,
                                    borderRadius: 2.5,
                                    '&:hover': {
                                        borderColor: colors.accent,
                                        backgroundColor: 'rgba(226,103,28,0.06)',
                                    },
                                }}
                            >
                                Get it on Google Play
                            </Button>
                        </Stack>
                        <Typography
                            sx={{
                                color: colors.muted,
                                fontSize: 14,
                                opacity: 0.85,
                                pt: 0.5,
                            }}
                        >
                            Free to use · No account needed to start · Swedish
                            and English
                        </Typography>
                    </Stack>
                </Container>
            </Box>

            {/* Show, don't tell — alternating copy and phone */}
            <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
                {showcases.map((s) => (
                    <Grid
                        container
                        key={s.title}
                        spacing={{ xs: 4, md: 8 }}
                        alignItems="center"
                        direction={{
                            xs: 'column-reverse',
                            md: s.reverse ? 'row-reverse' : 'row',
                        }}
                        sx={{ py: { xs: 6, md: 10 } }}
                    >
                        <Grid item xs={12} md={6}>
                            <Typography
                                sx={{
                                    color: colors.accent,
                                    fontWeight: 800,
                                    letterSpacing: 1.2,
                                    textTransform: 'uppercase',
                                    fontSize: 13,
                                    mb: 1.5,
                                }}
                            >
                                {s.eyebrow}
                            </Typography>
                            <Typography
                                variant="h3"
                                fontWeight={900}
                                sx={{
                                    fontSize: { xs: 30, md: 44 },
                                    lineHeight: 1.1,
                                    whiteSpace: 'pre-line',
                                    mb: 2,
                                }}
                            >
                                {s.title}
                            </Typography>
                            <Typography
                                sx={{
                                    color: colors.muted,
                                    fontSize: { xs: 16, md: 18 },
                                    maxWidth: 460,
                                }}
                            >
                                {s.body}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <PhoneShowcase
                                image={s.image}
                                video={s.video}
                                alt={s.alt}
                            />
                        </Grid>
                    </Grid>
                ))}
            </Container>

            {/* Features */}
            <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
                <Typography
                    component="h2"
                    fontWeight={900}
                    sx={{
                        fontSize: { xs: 28, md: 38 },
                        letterSpacing: '-0.02em',
                        textAlign: 'center',
                        mb: { xs: 4, md: 6 },
                    }}
                >
                    And the everyday things, done properly
                </Typography>
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

            {/* Closing call to action */}
            <Box
                sx={{
                    background: `radial-gradient(900px 420px at 50% 120%, rgba(226,103,28,0.28), transparent 62%), ${colors.bg}`,
                    borderTop: `1px solid ${colors.border}`,
                }}
            >
                <Container maxWidth="sm" sx={{ py: { xs: 8, md: 12 } }}>
                    <Stack alignItems="center" textAlign="center" spacing={3}>
                        <Typography
                            component="h2"
                            fontWeight={900}
                            sx={{
                                fontSize: { xs: 30, md: 42 },
                                letterSpacing: '-0.02em',
                                lineHeight: 1.1,
                            }}
                        >
                            Start with one recipe.
                        </Typography>
                        <Typography
                            sx={{ color: colors.muted, fontSize: { xs: 16, md: 18 } }}
                        >
                            Save the next thing you want to cook. The rest of
                            your collection can follow whenever you like.
                        </Typography>
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={2}
                            sx={{ pt: 1 }}
                        >
                            <Button
                                variant="contained"
                                size="large"
                                href={KRYDDA_APP_STORE_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                    backgroundColor: colors.accent,
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    fontSize: 16,
                                    px: 4,
                                    py: 1.4,
                                    borderRadius: 2.5,
                                    '&:hover': { backgroundColor: '#c8571a' },
                                }}
                            >
                                Download on the App Store
                            </Button>
                            <Button
                                variant="outlined"
                                size="large"
                                href={KRYDDA_PLAY_STORE_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                    color: colors.text,
                                    borderColor: colors.border,
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    fontSize: 16,
                                    px: 4,
                                    py: 1.4,
                                    borderRadius: 2.5,
                                    '&:hover': {
                                        borderColor: colors.accent,
                                        backgroundColor: 'rgba(226,103,28,0.06)',
                                    },
                                }}
                            >
                                Get it on Google Play
                            </Button>
                        </Stack>
                    </Stack>
                </Container>
            </Box>

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
                            <Link
                                href="/krydda/delete-account"
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

export default Krydda
