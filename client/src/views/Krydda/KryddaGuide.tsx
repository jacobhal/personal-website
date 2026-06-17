import React from 'react'
import { Helmet } from 'react-helmet'
import { Box, Container, Stack, Typography } from '@mui/material'
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

type Step = { title: string; body: string }

type Copy = {
    docTitle: string
    title: string
    subtitle: string
    steps: Step[]
    buttonNote: string
    tipLabel: string
    tip: string
}

const COPY: Record<'sv' | 'en', Copy> = {
    sv: {
        docTitle: 'Krydda — Klipp ut recept från webben',
        title: 'Klipp ut recept från webben',
        subtitle: 'Spara vilket recept som helst — i tre steg.',
        steps: [
            {
                title: 'Hitta receptet 🔎',
                body: 'Sök efter en maträtt eller skriv adressen till en receptsida (t.ex. ica.se eller en matblogg) i fältet högst upp.',
            },
            {
                title: 'Öppna receptsidan 📖',
                body: 'Tryck på själva receptet så att du ser ingredienser och steg på skärmen.',
            },
            {
                title: 'Tryck på Klipp ut recept ✂️',
                body: 'Krydda läser sidan och fyller i receptet åt dig. Kontrollera och spara — klart!',
            },
        ],
        buttonNote: 'Knappen Klipp ut recept sitter längst ner på skärmen medan du surfar.',
        tipLabel: 'Tips:',
        tip: 'Hittar Krydda inget recept? Se till att du är på själva receptsidan, inte en lista med många recept.',
    },
    en: {
        docTitle: 'Krydda — Clip recipes from the web',
        title: 'Clip recipes from the web',
        subtitle: 'Save any recipe — in three steps.',
        steps: [
            {
                title: 'Find the recipe 🔎',
                body: 'Search for a dish or type the address of a recipe site (e.g. a food blog) in the field at the top.',
            },
            {
                title: 'Open the recipe page 📖',
                body: 'Tap the recipe itself so you can see the ingredients and steps on screen.',
            },
            {
                title: 'Tap Clip recipe ✂️',
                body: 'Krydda reads the page and fills in the recipe for you. Check it and save — done!',
            },
        ],
        buttonNote: 'The Clip recipe button sits at the bottom of the screen while you browse.',
        tipLabel: 'Tip:',
        tip: "Krydda didn't find a recipe? Make sure you're on the recipe page itself, not a list of many recipes.",
    },
}

/** Picks the language from `?lang=`, then the browser, defaulting to Swedish. */
function resolveLang(): 'sv' | 'en' {
    const param = new URLSearchParams(window.location.search)
        .get('lang')
        ?.toLowerCase()
    if (param === 'sv' || param === 'en') return param
    const nav =
        typeof navigator !== 'undefined' ? navigator.language.toLowerCase() : ''
    return nav.startsWith('sv') ? 'sv' : 'en'
}

const KryddaGuide: React.FC = () => {
    const copy = COPY[resolveLang()]

    return (
        <Box
            sx={{
                backgroundColor: colors.bg,
                minHeight: '100vh',
                color: colors.text,
                py: { xs: 5, sm: 7 },
            }}
        >
            <Helmet>
                <title>{copy.docTitle}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Helmet>
            <Container maxWidth="sm" sx={{ px: 3 }}>
                {/* Header */}
                <Stack alignItems="center" spacing={1.5} sx={{ mb: 4, textAlign: 'center' }}>
                    <Box
                        component="img"
                        src={icon}
                        alt="Krydda"
                        sx={{
                            width: 44,
                            height: 44,
                            borderRadius: 2.5,
                        }}
                    />
                    <Typography variant="h5" sx={{ color: colors.gold, fontWeight: 700 }}>
                        {copy.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.muted }}>
                        {copy.subtitle}
                    </Typography>
                </Stack>

                {/* Steps */}
                <Stack spacing={2.5}>
                    {copy.steps.map((step, i) => (
                        <Stack key={i} direction="row" spacing={2} alignItems="flex-start">
                            <Box
                                sx={{
                                    flex: '0 0 auto',
                                    width: 30,
                                    height: 30,
                                    borderRadius: '50%',
                                    backgroundColor: colors.accent,
                                    color: '#fff',
                                    fontWeight: 700,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                {i + 1}
                            </Box>
                            <Box>
                                <Typography sx={{ fontWeight: 600 }}>{step.title}</Typography>
                                <Typography variant="body2" sx={{ color: colors.muted }}>
                                    {step.body}
                                </Typography>
                            </Box>
                        </Stack>
                    ))}
                </Stack>

                {/* Where's the button */}
                <Box
                    sx={{
                        mt: 3,
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: colors.surface,
                        border: `1px solid ${colors.border}`,
                    }}
                >
                    <Typography variant="body2" sx={{ color: colors.muted }}>
                        {copy.buttonNote}
                    </Typography>
                </Box>

                {/* Tip */}
                <Box
                    sx={{
                        mt: 2,
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: 'rgba(244,169,61,0.08)',
                    }}
                >
                    <Typography variant="body2" sx={{ color: colors.muted }}>
                        <Box component="span" sx={{ color: colors.text, fontWeight: 700 }}>
                            💡 {copy.tipLabel}{' '}
                        </Box>
                        {copy.tip}
                    </Typography>
                </Box>
            </Container>
        </Box>
    )
}

export default KryddaGuide
