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

import { PageFavicon } from '../../components/PageFavicon'
import { AppMarketingBar } from '../../components/AppMarketingBar'
import { PhoneShowcase } from '../../components/PhoneShowcase'
import type { Locale } from '../../i18n/locale'
import { useLocale } from '../../i18n/useLocale'
import { useStoreLinks } from '../../hooks/useStoreLinks'
import owl from '../../assets/images/skarp_owl.png'
import {
    SKARP_APP_STORE_URL,
    SKARP_PLAY_STORE_URL,
} from '../../config/appStores'
import { SKARP_COPY } from './skarpContent'

const colors = {
    bg: '#0E0E14',
    surface: '#1A1A28',
    border: '#2A2A40',
    accent: '#5C6BC0',
    gold: '#F9A825',
    text: '#ECECF2',
    muted: '#A0A0B4',
}

/** A still is either one file for both languages, or one per language. */
type LocalizedMedia = string | Record<Locale, string>

const forLocale = (media: LocalizedMedia, locale: Locale): string =>
    typeof media === 'string' ? media : media[locale]

interface ShowcaseMedia {
    image: LocalizedMedia
    alt: Record<Locale, string>
    /** Flips the copy/phone order so the sections alternate down the page. */
    reverse?: boolean
}

/**
 * Stills for the alternating "show, don't tell" sections, in the same order as
 * `SKARP_COPY.showcases`. Only the words live in `skarpContent`.
 *
 * Captured from the real app on a booted simulator by
 * `integration_test/site_shots_test.dart` in the quiz-app repo, so these are
 * the current build rather than mock-ups.
 *
 * Replacements get a new path rather than overwriting the old one: images are
 * served `immutable, max-age=31536000`, so reusing a filename would leave every
 * returning visitor on the old frame for a year.
 */
const showcaseMedia: readonly ShowcaseMedia[] = [
    {
        image: {
            sv: '/skarp-media/live-sv-v1.jpg',
            en: '/skarp-media/live-en-v1.jpg',
        },
        alt: {
            sv: 'Ett livequizrum skapas i Skarp',
            en: 'Creating a live quiz room in Skarp',
        },
    },
    {
        image: {
            sv: '/skarp-media/solo-sv-v1.jpg',
            en: '/skarp-media/solo-en-v1.jpg',
        },
        alt: {
            sv: 'En fråga under en solorunda i Skarp',
            en: 'A question during a solo round in Skarp',
        },
        reverse: true,
    },
    {
        image: {
            sv: '/skarp-media/duel-sv-v1.jpg',
            en: '/skarp-media/duel-en-v1.jpg',
        },
        alt: {
            sv: 'En duell mot en vän i Skarp',
            en: 'A head-to-head duel in Skarp',
        },
    },
    {
        image: {
            sv: '/skarp-media/leaderboard-sv-v1.jpg',
            en: '/skarp-media/leaderboard-en-v1.jpg',
        },
        alt: {
            sv: 'Topplistan i Skarp',
            en: 'The Skarp leaderboard',
        },
        reverse: true,
    },
]

const CANONICAL = 'https://jacobhal.se/skarp'
const OG_IMAGE = 'https://jacobhal.se/app-social/skarp-og.png'

const Skarp: React.FC = () => {
    const { locale, setLocale } = useLocale()
    const copy = SKARP_COPY[locale]
    const { appStoreHref, playStoreHref, trackStoreClick } = useStoreLinks({
        app: 'skarp',
        appStoreUrl: SKARP_APP_STORE_URL,
        playStoreUrl: SKARP_PLAY_STORE_URL,
        countLandingView: true,
        locale,
    })

    const footerLinks = [
        { href: '/skarp/privacy', label: copy.footerPrivacy },
        { href: '/skarp/terms', label: copy.footerTerms },
        { href: '/skarp/delete-account', label: copy.footerDelete },
        { href: '/contact', label: copy.footerContact },
    ]

    const storeButtons = (
        <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ pt: 1 }}
        >
            <Button
                component="a"
                variant="contained"
                size="large"
                href={appStoreHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackStoreClick('app_store')}
                sx={{
                    backgroundColor: colors.accent,
                    textTransform: 'none',
                    fontWeight: 700,
                    px: 4,
                    '&:hover': { backgroundColor: '#4d5bb0' },
                }}
            >
                {copy.appStore}
            </Button>
            <Button
                component="a"
                variant="outlined"
                size="large"
                href={playStoreHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackStoreClick('google_play')}
                sx={{
                    color: colors.text,
                    borderColor: colors.border,
                    textTransform: 'none',
                    fontWeight: 700,
                    px: 4,
                    '&:hover': { borderColor: colors.accent },
                }}
            >
                {copy.playStore}
            </Button>
        </Stack>
    )

    return (
        <Box
            sx={{
                backgroundColor: colors.bg,
                minHeight: '100vh',
                color: colors.text,
            }}
        >
            <PageFavicon
                icon32="/app-icons/skarp-32.png"
                icon180="/app-icons/skarp-180.png"
                manifest="/app-icons/skarp.webmanifest"
            />
            <Helmet>
                <html lang={locale} />
                <title>{copy.metaTitle}</title>
                <meta name="description" content={copy.metaDescription} />
                {/* Link previews. These URLs are pasted into DMs, ad
                    destinations and store listings, so the card must be Skarp
                    — never the personal site's default title and monogram. */}
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="Skarp" />
                <meta property="og:locale" content={
                    locale === 'sv' ? 'sv_SE' : 'en_GB'
                } />
                <meta property="og:title" content={copy.ogTitle} />
                <meta
                    property="og:description"
                    content={copy.ogDescription}
                />
                <meta property="og:url" content={CANONICAL} />
                <meta property="og:image" content={OG_IMAGE} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={copy.ogTitle} />
                <meta
                    name="twitter:description"
                    content={copy.ogDescription}
                />
                <meta name="twitter:image" content={OG_IMAGE} />
                <link rel="canonical" href={CANONICAL} />
                <meta name="apple-itunes-app" content="app-id=6763050250" />
            </Helmet>

            <AppMarketingBar
                appName="Skarp"
                appIcon={owl}
                homePath="/skarp"
                accent={colors.accent}
                text={colors.text}
                muted={colors.muted}
                border={colors.border}
                locale={locale}
                onLocaleChange={setLocale}
            />

            {/* Hero */}
            <Box
                sx={{
                    background: `radial-gradient(1200px 600px at 50% -10%, rgba(92,107,192,0.35), transparent 60%), ${colors.bg}`,
                    pt: { xs: 8, md: 12 },
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
                            component="h1"
                            fontWeight={900}
                            sx={{
                                fontSize: { xs: 36, md: 56 },
                                lineHeight: 1.05,
                                letterSpacing: '-0.02em',
                            }}
                        >
                            {copy.headlineLead}
                            <Box component="span" sx={{ color: colors.accent }}>
                                {' '}
                                {copy.headlineTail}
                            </Box>
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{ color: colors.muted, maxWidth: 560 }}
                        >
                            {copy.tagline}
                        </Typography>
                        {storeButtons}
                        <Typography
                            sx={{
                                color: colors.muted,
                                fontSize: 14,
                                opacity: 0.85,
                                pt: 0.5,
                            }}
                        >
                            {copy.trustLine}
                        </Typography>
                    </Stack>
                </Container>
            </Box>

            {/* Show, don't tell — alternating copy and phone */}
            <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
                {copy.showcases.map((sc, index) => {
                    const media = showcaseMedia[index]
                    if (!media) return null
                    return (
                        <Grid
                            container
                            key={sc.title}
                            spacing={{ xs: 4, md: 8 }}
                            alignItems="center"
                            direction={{
                                xs: 'column-reverse',
                                md: media.reverse ? 'row-reverse' : 'row',
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
                                    {sc.eyebrow}
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
                                    {sc.title}
                                </Typography>
                                <Typography
                                    sx={{
                                        color: colors.muted,
                                        fontSize: { xs: 16, md: 18 },
                                        maxWidth: 460,
                                    }}
                                >
                                    {sc.body}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <PhoneShowcase
                                    image={forLocale(media.image, locale)}
                                    alt={media.alt[locale]}
                                />
                            </Grid>
                        </Grid>
                    )
                })}
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
                    {copy.featuresHeading}
                </Typography>
                <Grid container spacing={3}>
                    {copy.features.map((f) => (
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
                    background: `radial-gradient(900px 420px at 50% 120%, rgba(92,107,192,0.28), transparent 62%), ${colors.bg}`,
                    borderTop: `1px solid ${colors.border}`,
                }}
            >
                <Container maxWidth="sm" sx={{ py: { xs: 7, md: 10 } }}>
                    <Stack alignItems="center" textAlign="center" spacing={2}>
                        <Typography
                            component="h2"
                            fontWeight={900}
                            sx={{
                                fontSize: { xs: 28, md: 38 },
                                letterSpacing: '-0.02em',
                            }}
                        >
                            {copy.closingTitle}
                        </Typography>
                        <Typography
                            sx={{
                                color: colors.muted,
                                fontSize: { xs: 16, md: 18 },
                                maxWidth: 420,
                                pb: 1,
                            }}
                        >
                            {copy.closingBody}
                        </Typography>
                        {storeButtons}
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
                            Skarp
                        </Typography>
                        <Stack
                            direction="row"
                            spacing={3}
                            flexWrap="wrap"
                            justifyContent="center"
                        >
                            {footerLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    underline="hover"
                                    sx={{ color: colors.muted, fontSize: 14 }}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </Stack>
                    </Stack>
                </Container>
            </Box>
        </Box>
    )
}

export default Skarp
