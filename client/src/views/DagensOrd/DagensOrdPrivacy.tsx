import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import {
    Box,
    Chip,
    Container,
    Link,
    Stack,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from '@mui/material'

import { NavBar } from '../../components/NavBar'
import icon from '../../assets/images/dagens_ord_icon.png'

type Lang = 'sv' | 'en'

type Section = {
    title: string
    paragraphs: string[]
}

/** Matches the theme the Dagens Ord landing page uses. */
const colors = {
    bg: '#17120F',
    surface: '#241B15',
    border: '#3B2B20',
    accent: '#F2B45C',
    text: '#F5EADD',
    muted: '#B9A99A',
}

const EMAIL = 'jacobhallman94@gmail.com'

const updated: Record<Lang, string> = {
    sv: '4 september 2026',
    en: '4 September 2026',
}

const pageTitle: Record<Lang, string> = {
    sv: 'Integritetspolicy',
    en: 'Privacy policy',
}

const pageDescription: Record<Lang, string> = {
    sv: 'Dagens Ord samlar inte in någon personlig information. All data stannar på din enhet.',
    en: 'Dagens Ord collects no personal information. Everything the app stores stays on your device.',
}

const labels = {
    byline: {
        sv: 'Ett svårt svenskt ord varje dag',
        en: 'One hard Swedish word every day',
    },
    lastUpdated: { sv: 'Senast uppdaterad', en: 'Last updated' },
    contact: { sv: 'Kontakt', en: 'Contact' },
    backToApp: { sv: 'Till appsidan', en: 'Back to the app page' },
}

const sections: Record<Lang, Section[]> = {
    sv: [
        {
            title: 'Sammanfattning',
            paragraphs: [
                'Dagens Ord samlar inte in någon personlig information. Ingen data om dig eller din användning skickas till oss eller till någon tredje part.',
            ],
        },
        {
            title: 'Uppgifter vi samlar in',
            paragraphs: [
                'Vi samlar inte in någon data. Appen kräver inget konto, ingen registrering och ingen internetanslutning.',
            ],
        },
        {
            title: 'Lokal lagring',
            paragraphs: [
                'All data som appen sparar, alltså visade ord, historik och inställningar, lagras uteslutande lokalt på din enhet med enhetens inbyggda lagring (SQLite och SharedPreferences). Den datan lämnar aldrig din enhet.',
            ],
        },
        {
            title: 'Tredjepartstjänster',
            paragraphs: [
                'Appen använder inga analysverktyg, reklamtjänster, spårningsbibliotek eller andra tredjepartstjänster som samlar in data.',
            ],
        },
        {
            title: 'Hemskärmswidget',
            paragraphs: [
                'Widgeten läser dagens ord från appens lokala lagring och visar det på hemskärmen. Ingen data skickas någonstans i samband med det.',
            ],
        },
        {
            title: 'Notiser',
            paragraphs: [
                'Om du slår på den dagliga påminnelsen schemaläggs notisen lokalt på din enhet. Ingenting skickas till någon server, och notisen innehåller ingen information om dig.',
            ],
        },
        {
            title: 'Barn',
            paragraphs: [
                'Appen samlar inte in någon information från någon användare, inklusive barn.',
            ],
        },
        {
            title: 'Ändringar',
            paragraphs: [
                'Om policyn uppdateras publiceras den nya versionen på den här sidan med ett nytt datum.',
            ],
        },
        {
            title: 'Kontakt',
            paragraphs: [
                `Har du frågor om den här policyn går det bra att mejla ${EMAIL}.`,
            ],
        },
    ],
    en: [
        {
            title: 'Summary',
            paragraphs: [
                'Dagens Ord collects no personal information. No data about you or your usage is sent to us or to any third party.',
            ],
        },
        {
            title: 'Data we collect',
            paragraphs: [
                'We collect nothing. The app needs no account, no registration and no internet connection.',
            ],
        },
        {
            title: 'Local storage',
            paragraphs: [
                'Everything the app saves, meaning the words you have seen, your history and your settings, is stored only on your device using its built-in storage (SQLite and SharedPreferences). That data never leaves your device.',
            ],
        },
        {
            title: 'Third-party services',
            paragraphs: [
                'The app uses no analytics, no advertising, no tracking libraries and no other third-party service that collects data.',
            ],
        },
        {
            title: 'Home screen widget',
            paragraphs: [
                'The widget reads the current word from the app’s local storage and shows it on your home screen. Nothing is sent anywhere in the process.',
            ],
        },
        {
            title: 'Notifications',
            paragraphs: [
                'If you turn on the daily reminder, the notification is scheduled locally on your device. Nothing is sent to a server, and the notification carries no information about you.',
            ],
        },
        {
            title: 'Children',
            paragraphs: [
                'The app collects no information from any user, children included.',
            ],
        },
        {
            title: 'Changes',
            paragraphs: [
                'If this policy is updated, the new version is published on this page with a new date.',
            ],
        },
        {
            title: 'Contact',
            paragraphs: [
                `Questions about this policy are welcome at ${EMAIL}.`,
            ],
        },
    ],
}

const PolicyCard: React.FC<{ section: Section }> = ({ section }) => (
    <Box
        sx={{
            backgroundColor: colors.surface,
            border: `1px solid ${colors.border}`,
            borderRadius: 4,
            p: { xs: 3, md: 4 },
        }}
    >
        <Typography
            variant="h6"
            fontWeight={800}
            sx={{ mb: 1.5, color: colors.accent }}
        >
            {section.title}
        </Typography>
        <Stack spacing={1.5}>
            {section.paragraphs.map((paragraph) => (
                <Typography key={paragraph} sx={{ color: colors.text }}>
                    {paragraph}
                </Typography>
            ))}
        </Stack>
    </Box>
)

const DagensOrdPrivacy: React.FC = () => {
    const [lang, setLang] = useState<Lang>('sv')

    useEffect(() => {
        const requested = new URLSearchParams(window.location.search).get(
            'lang'
        )
        if (requested === 'en' || requested === 'sv') {
            setLang(requested)
        } else if ((navigator.language || '').toLowerCase().startsWith('en')) {
            setLang('en')
        }
    }, [])

    return (
        <Box
            sx={{
                backgroundColor: colors.bg,
                minHeight: '100vh',
                color: colors.text,
            }}
        >
            <Helmet>
                <html lang={lang} />
                <title>{`${pageTitle[lang]} - Dagens Ord`}</title>
                <meta name="description" content={pageDescription[lang]} />
            </Helmet>
            <NavBar noImage />

            <Box
                sx={{
                    background: `radial-gradient(1000px 520px at 50% -10%, rgba(242,180,92,0.28), transparent 60%), ${colors.bg}`,
                    pt: { xs: 8, md: 10 },
                    pb: { xs: 5, md: 6 },
                }}
            >
                <Container maxWidth="md">
                    <Stack spacing={3}>
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            justifyContent="space-between"
                            alignItems={{ xs: 'flex-start', sm: 'center' }}
                            gap={2}
                        >
                            <Stack direction="row" alignItems="center" gap={2}>
                                <Box
                                    component="img"
                                    src={icon}
                                    alt="Dagens Ord"
                                    sx={{
                                        width: 64,
                                        height: 64,
                                        borderRadius: 3,
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
                                    }}
                                />
                                <Box>
                                    <Typography variant="h5" fontWeight={800}>
                                        Dagens Ord
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: colors.muted }}
                                    >
                                        {labels.byline[lang]}
                                    </Typography>
                                </Box>
                            </Stack>
                            <ToggleButtonGroup
                                size="small"
                                exclusive
                                value={lang}
                                onChange={(_, value) => value && setLang(value)}
                                sx={{
                                    '& .MuiToggleButton-root': {
                                        color: colors.muted,
                                        borderColor: colors.border,
                                        textTransform: 'none',
                                    },
                                    '& .Mui-selected': {
                                        backgroundColor: `${colors.accent} !important`,
                                        color: `${colors.bg} !important`,
                                    },
                                }}
                            >
                                <ToggleButton value="sv">Svenska</ToggleButton>
                                <ToggleButton value="en">English</ToggleButton>
                            </ToggleButtonGroup>
                        </Stack>

                        <Box>
                            <Typography
                                variant="h3"
                                fontWeight={900}
                                sx={{ mb: 1.5 }}
                            >
                                {pageTitle[lang]}
                            </Typography>
                            <Typography
                                sx={{ color: colors.muted, maxWidth: 760 }}
                            >
                                {pageDescription[lang]}
                            </Typography>
                        </Box>

                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={1.5}
                        >
                            <Chip
                                label={`${labels.lastUpdated[lang]}: ${updated[lang]}`}
                                sx={{
                                    width: 'fit-content',
                                    backgroundColor: 'rgba(242,180,92,0.12)',
                                    border: `1px solid ${colors.border}`,
                                    color: colors.text,
                                }}
                            />
                            <Chip
                                label={`${labels.contact[lang]}: ${EMAIL}`}
                                sx={{
                                    width: 'fit-content',
                                    backgroundColor: 'rgba(255,255,255,0.04)',
                                    border: `1px solid ${colors.border}`,
                                    color: colors.text,
                                }}
                            />
                        </Stack>
                    </Stack>
                </Container>
            </Box>

            <Container maxWidth="md" sx={{ pb: 10 }}>
                <Stack spacing={3}>
                    {sections[lang].map((section) => (
                        <PolicyCard key={section.title} section={section} />
                    ))}
                </Stack>
            </Container>

            <Box sx={{ borderTop: `1px solid ${colors.border}` }}>
                <Container maxWidth="md" sx={{ py: 4 }}>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                        spacing={2}
                    >
                        <Typography sx={{ color: colors.muted, fontSize: 14 }}>
                            Dagens Ord · Jacob Hallman
                        </Typography>
                        <Stack
                            direction="row"
                            spacing={3}
                            flexWrap="wrap"
                            useFlexGap
                        >
                            <Link
                                href="/dagens-ord"
                                underline="hover"
                                sx={{ color: colors.muted, fontSize: 14 }}
                            >
                                {labels.backToApp[lang]}
                            </Link>
                            <Link
                                href={`mailto:${EMAIL}`}
                                underline="hover"
                                sx={{ color: colors.muted, fontSize: 14 }}
                            >
                                {labels.contact[lang]}
                            </Link>
                        </Stack>
                    </Stack>
                </Container>
            </Box>
        </Box>
    )
}

export default DagensOrdPrivacy
