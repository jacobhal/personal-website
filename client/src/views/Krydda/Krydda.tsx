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
import { useLocale } from '../../i18n/useLocale'
import type { Locale } from '../../i18n/locale'
import { useStoreLinks } from '../../hooks/useStoreLinks'
import icon from '../../assets/images/krydda_icon.png'
import {
    KRYDDA_APP_STORE_URL,
    KRYDDA_PLAY_STORE_URL,
} from '../../config/appStores'
import { KRYDDA_COPY } from './kryddaContent'

const colors = {
    bg: '#14110E',
    surface: '#211B15',
    border: '#2C241B',
    accent: '#E2671C',
    gold: '#F4A93D',
    text: '#EFE7DD',
    muted: '#A89B8C',
}

const CANONICAL = 'https://jacobhal.se/krydda'
const OG_IMAGE = 'https://jacobhal.se/krydda-media/og-image.jpg'

/**
 * A media path that is identical in both languages, or one path per language.
 *
 * Most stills show no app chrome worth translating, so they stay a single
 * path. A screen recording does show the interface, and an English visitor
 * being shown a Swedish app is a credibility leak, so recordings are
 * per-language wherever both have been captured.
 */
type LocalizedMedia = string | Record<Locale, string>

const forLocale = (media: LocalizedMedia, locale: Locale): string =>
    typeof media === 'string' ? media : media[locale]

interface ShowcaseMedia {
    /** Poster/still frame. Always present, so a section without a recording
     *  still reads correctly. */
    image: LocalizedMedia
    /** Optional screen recording. A section upgrades from still to video the
     *  moment a path is filled in. */
    video?: LocalizedMedia
    alt: Record<Locale, string>
    /** Flips the copy/phone order so the sections alternate down the page. */
    reverse?: boolean
}

/**
 * Media for the alternating "show, don't tell" sections.
 *
 * Kept separate from the copy: only the words live in `kryddaContent`.
 *
 * Replacements get a new path rather than overwriting the old one. `.htaccess`
 * serves images as `immutable, max-age=31536000`, so reusing a poster filename
 * would leave every returning visitor on the old frame for a year.
 */
const showcaseMedia: readonly ShowcaseMedia[] = [
    {
        image: {
            sv: '/krydda-media/web-import-poster.jpg',
            en: '/krydda-media/web-import-en-v2-poster.jpg',
        },
        video: {
            sv: '/krydda-media/web-import.mp4',
            en: '/krydda-media/web-import-en-v2.mp4',
        },
        alt: {
            sv: 'Ett recept sparas från en webbsida i Krydda',
            en: 'Saving a recipe from a website inside Krydda',
        },
    },
    {
        image: '/krydda-media/social.jpg',
        alt: {
            sv: 'Ett Instagram-inlägg delas till Krydda',
            en: 'Sharing an Instagram post into Krydda',
        },
        reverse: true,
    },
    {
        image: '/krydda-media/weekly.jpg',
        alt: {
            sv: 'Krydda skapar en veckoplan',
            en: 'Krydda generating a weekly meal plan',
        },
    },
    {
        image: '/krydda-media/groceries.jpg',
        alt: { sv: 'Kryddas inköpslista', en: 'Krydda shopping list' },
        reverse: true,
    },
]

const Krydda: React.FC = () => {
    const { locale, setLocale } = useLocale()
    const copy = KRYDDA_COPY[locale]
    const { appStoreHref, playStoreHref, trackStoreClick } = useStoreLinks({
        app: 'krydda',
        appStoreUrl: KRYDDA_APP_STORE_URL,
        playStoreUrl: KRYDDA_PLAY_STORE_URL,
        countLandingView: true,
        locale,
    })

    const footerLinks = [
        { href: '/krydda/privacy', label: copy.footerPrivacy },
        { href: '/krydda/terms', label: copy.footerTerms },
        { href: '/krydda/delete-account', label: copy.footerDelete },
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
                    fontSize: 16,
                    px: 4,
                    py: 1.4,
                    borderRadius: 2.5,
                    '&:hover': { backgroundColor: '#c8571a' },
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
                icon32="/app-icons/krydda-32.png"
                icon180="/app-icons/krydda-180.png"
                manifest="/app-icons/krydda.webmanifest"
            />
            <Helmet>
                <html lang={locale} />
                <title>{copy.metaTitle}</title>
                <meta name="description" content={copy.metaDescription} />
                {/* Link previews. Outreach lives or dies on how the link looks
                    when a creator pastes it into a DM or a Slack thread. */}
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="Krydda" />
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
                <meta name="apple-itunes-app" content="app-id=6777108071" />
            </Helmet>

            <AppMarketingBar
                appName="Krydda"
                appIcon={icon}
                homePath="/krydda"
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
                    background: `radial-gradient(1100px 520px at 50% -12%, rgba(226,103,28,0.30), transparent 62%), ${colors.bg}`,
                    pt: { xs: 7, md: 11 },
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
                            {copy.headlineLead}
                            <Box
                                component="span"
                                sx={{
                                    color: colors.muted,
                                    display: 'block',
                                }}
                            >
                                {copy.headlineTail}
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
                            {copy.subheading}
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
                {copy.showcases.map((s, index) => {
                    const media = showcaseMedia[index]
                    return (
                        <Grid
                            container
                            key={s.title}
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
                                    image={forLocale(media.image, locale)}
                                    video={
                                        media.video
                                            ? forLocale(media.video, locale)
                                            : undefined
                                    }
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
                            {copy.closingTitle}
                        </Typography>
                        <Typography
                            sx={{
                                color: colors.muted,
                                fontSize: { xs: 16, md: 18 },
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
                            Krydda
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

export default Krydda
