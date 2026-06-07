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
import icon from '../../assets/images/krydda_icon.png'

export type Lang = 'sv' | 'en'

export type LegalSection = {
    title: string
    paragraphs?: string[]
    bullets?: string[]
}

type Copy = {
    appLabel: Record<Lang, string>
    byline: Record<Lang, string>
    updated: string
    lastUpdatedLabel: Record<Lang, string>
    contactLabel: Record<Lang, string>
}

type Props = {
    pageTitle: { sv: string; en: string }
    pageDescription: { sv: string; en: string }
    copy: Copy
    sections: Record<Lang, LegalSection[]>
}

const colors = {
    bg: '#14110E',
    surface: '#211B15',
    border: '#2C241B',
    accent: '#E2671C',
    gold: '#F4A93D',
    text: '#EFE7DD',
    muted: '#A89B8C',
}

const EMAIL = 'jacobhallman94@gmail.com'

const LegalCard: React.FC<{ section: LegalSection }> = ({ section }) => {
    return (
        <Box
            sx={{
                backgroundColor: colors.surface,
                border: `1px solid ${colors.border}`,
                borderRadius: 4,
                p: { xs: 3, md: 4 },
            }}
        >
            <Typography variant="h6" fontWeight={800} sx={{ mb: 1.5, color: colors.gold }}>
                {section.title}
            </Typography>
            <Stack spacing={1.5}>
                {section.paragraphs?.map((paragraph) => (
                    <Typography key={paragraph} sx={{ color: colors.text }}>
                        {paragraph}
                    </Typography>
                ))}
                {section.bullets && (
                    <Box component="ul" sx={{ m: 0, pl: 3, color: colors.muted }}>
                        {section.bullets.map((bullet) => (
                            <Box component="li" key={bullet} sx={{ mb: 1 }}>
                                <Typography component="span" sx={{ color: colors.text }}>
                                    {bullet}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                )}
            </Stack>
        </Box>
    )
}

const KryddaLegalLayout: React.FC<Props> = ({
    pageTitle,
    pageDescription,
    copy,
    sections,
}) => {
    const [lang, setLang] = useState<Lang>('sv')

    useEffect(() => {
        const p = new URLSearchParams(window.location.search).get('lang')
        if (p === 'en' || p === 'sv') {
            setLang(p)
        } else if ((navigator.language || '').toLowerCase().startsWith('en')) {
            setLang('en')
        }
    }, [])

    const title = pageTitle[lang]
    const description = pageDescription[lang]

    return (
        <Box sx={{ backgroundColor: colors.bg, minHeight: '100vh', color: colors.text }}>
            <Helmet>
                <html lang={lang} />
                <title>
                    {title} - Krydda
                </title>
                <meta name="description" content={description} />
            </Helmet>
            <NavBar noImage />

            <Box
                sx={{
                    background: `radial-gradient(1000px 520px at 50% -10%, rgba(226,103,28,0.32), transparent 60%), ${colors.bg}`,
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
                                    alt="Krydda"
                                    sx={{
                                        width: 64,
                                        height: 64,
                                        borderRadius: 3,
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
                                    }}
                                />
                                <Box>
                                    <Typography variant="h5" fontWeight={800}>
                                        {copy.appLabel[lang]}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: colors.muted }}>
                                        {copy.byline[lang]}
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
                                        color: '#fff !important',
                                    },
                                }}
                            >
                                <ToggleButton value="sv">Svenska</ToggleButton>
                                <ToggleButton value="en">English</ToggleButton>
                            </ToggleButtonGroup>
                        </Stack>

                        <Box>
                            <Typography variant="h3" fontWeight={900} sx={{ mb: 1.5 }}>
                                {title}
                            </Typography>
                            <Typography sx={{ color: colors.muted, maxWidth: 760 }}>
                                {description}
                            </Typography>
                        </Box>

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                            <Chip
                                label={`${copy.lastUpdatedLabel[lang]}: ${copy.updated}`}
                                sx={{
                                    width: 'fit-content',
                                    backgroundColor: 'rgba(244,169,61,0.12)',
                                    border: `1px solid ${colors.border}`,
                                    color: colors.text,
                                }}
                            />
                            <Chip
                                label={`${copy.contactLabel[lang]}: ${EMAIL}`}
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
                        <LegalCard key={section.title} section={section} />
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
                            Krydda · Jacob Hallman
                        </Typography>
                        <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
                            <Link href="/krydda" underline="hover" sx={{ color: colors.muted, fontSize: 14 }}>
                                Krydda
                            </Link>
                            <Link
                                href={`mailto:${EMAIL}`}
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

export default KryddaLegalLayout
