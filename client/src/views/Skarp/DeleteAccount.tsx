import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import {
    Box,
    Chip,
    Container,
    Link,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from '@mui/material'
import { NavBar } from '../../components/NavBar'
import owl from '../../assets/images/skarp_owl.png'

type Lang = 'sv' | 'en'

const colors = {
    bg: '#0E0E14',
    surface: '#1A1A28',
    border: '#2A2A40',
    accent: '#5C6BC0',
    gold: '#F9A825',
    text: '#ECECF2',
    muted: '#A0A0B4',
    danger: '#ff8a80',
}

const copy = {
    sv: {
        title: 'Radera ditt Skarp-konto',
        intro:
            'Den här sidan beskriver hur du raderar ditt konto i appen Skarp samt vilka uppgifter som tas bort respektive sparas.',
        stepsHeading: 'Så raderar du kontot i appen',
        steps: [
            'Öppna Skarp och logga in.',
            'Gå till fliken Profil.',
            'Tryck på Radera konto längst ned.',
            'Bekräfta. Kontot och tillhörande data raderas omedelbart.',
        ],
        emailHeading: 'Har du inte längre tillgång till appen?',
        emailBody1: 'Om du har avinstallerat appen kan du begära radering via e-post. Mejla ',
        emailBody2:
            ' från den e-postadress som är kopplad till kontot, med ämnet ”Radera mitt konto”. Vi behandlar begäran inom 30 dagar.',
        tableHeading: 'Vilka uppgifter raderas och vad sparas',
        colData: 'Uppgift',
        colStatus: 'Status',
        deleted: 'Raderas',
        kept: 'Sparas anonymiserat',
        rows: [
            ['Konto, profil och användarnamn', 'del'],
            ['Avatar, ramar, titlar och övriga kosmetiska föremål', 'del'],
            ['Mynt, ädelstenar och Battle Pass-framsteg', 'del'],
            ['Statistik, nivåer och kunskapsframsteg', 'del'],
            ['Vänner och vänförfrågningar', 'del'],
            ['Pushnotis-tokens och köphistorik', 'del'],
            ['Matchhistorik i flerspelarläge', 'keep'],
        ] as [string, 'del' | 'keep'][],
        anonNote:
            'Anonymiserad matchhistorik: i matcher du spelat mot andra tas din identitet bort, men själva matchresultatet finns kvar så att din motståndare behåller sin spelhistorik. Uppgifterna kan inte längre kopplas till dig.',
        retentionHeading: 'Lagringstid och säkerhetskopior',
        retentionBody:
            'Radering sker omedelbart i vår databas. Rester i krypterade säkerhetskopior rensas inom 30 dagar.',
        refundHeading: 'Köp och återbetalning',
        refundBody:
            'Att radera kontot ger ingen återbetalning för köp i appen. Återbetalning begärs via Google Play eller App Store enligt deras regler.',
        footer: 'Skarp · Utvecklare: Jacob Hallman · Kontakt: ',
    },
    en: {
        title: 'Delete your Skarp account',
        intro:
            'This page explains how to delete your account in the Skarp app, and which data is removed or retained.',
        stepsHeading: 'Delete your account in the app',
        steps: [
            'Open Skarp and sign in.',
            'Go to the Profile tab.',
            'Tap Delete account at the bottom.',
            'Confirm. Your account and associated data are deleted immediately.',
        ],
        emailHeading: 'No longer have access to the app?',
        emailBody1: 'If you have uninstalled the app, you can request deletion by email. Email ',
        emailBody2:
            ' from the address linked to your account, with the subject “Delete my account”. We process requests within 30 days.',
        tableHeading: 'What data is deleted and what is kept',
        colData: 'Data',
        colStatus: 'Status',
        deleted: 'Deleted',
        kept: 'Kept anonymized',
        rows: [
            ['Account, profile and username', 'del'],
            ['Avatar, frames, titles and other cosmetics', 'del'],
            ['Coins, gems and Battle Pass progress', 'del'],
            ['Stats, levels and knowledge progression', 'del'],
            ['Friends and friend requests', 'del'],
            ['Push notification tokens and purchase records', 'del'],
            ['Multiplayer match history', 'keep'],
        ] as [string, 'del' | 'keep'][],
        anonNote:
            'Anonymized match history: in matches you played against others, your identity is removed but the match result remains so your opponent keeps their game record. The data can no longer be linked to you.',
        retentionHeading: 'Retention and backups',
        retentionBody:
            'Deletion happens immediately in our database. Any remnants in encrypted backups are purged within 30 days.',
        refundHeading: 'Purchases and refunds',
        refundBody:
            'Deleting your account does not refund in-app purchases. Refunds must be requested through Google Play or the App Store under their respective policies.',
        footer: 'Skarp · Developer: Jacob Hallman · Contact: ',
    },
}

const EMAIL = 'jacobhallman94@gmail.com'

const DeleteAccount: React.FC = () => {
    const [lang, setLang] = useState<Lang>('sv')
    const t = copy[lang]

    useEffect(() => {
        const p = new URLSearchParams(window.location.search).get('lang')
        if (p === 'en' || p === 'sv') {
            setLang(p)
        } else if ((navigator.language || '').toLowerCase().startsWith('en')) {
            setLang('en')
        }
    }, [])

    const mailSubject =
        lang === 'sv' ? 'Radera mitt Skarp-konto' : 'Delete my Skarp account'

    return (
        <Box sx={{ backgroundColor: colors.bg, minHeight: '100vh', color: colors.text }}>
            <Helmet>
                <html lang={lang} />
                <title>{t.title} — Skarp</title>
                <meta name="description" content={t.intro} />
            </Helmet>
            <NavBar noImage />

            <Container maxWidth="md" sx={{ pt: 6, pb: 10 }}>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    flexWrap="wrap"
                    gap={2}
                    sx={{ mb: 4 }}
                >
                    <Stack direction="row" alignItems="center" gap={2}>
                        <Box
                            component="img"
                            src={owl}
                            alt="Skarp"
                            sx={{
                                width: 64,
                                height: 64,
                                borderRadius: 3,
                                boxShadow: '0 6px 20px rgba(0,0,0,0.5)',
                            }}
                        />
                        <Box>
                            <Typography variant="h5" fontWeight={800}>
                                Skarp
                            </Typography>
                            <Typography variant="body2" sx={{ color: colors.muted }}>
                                {lang === 'sv' ? 'av Jacob Hallman' : 'by Jacob Hallman'}
                            </Typography>
                        </Box>
                    </Stack>
                    <ToggleButtonGroup
                        size="small"
                        exclusive
                        value={lang}
                        onChange={(_, v) => v && setLang(v)}
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

                <Typography variant="h4" fontWeight={800} sx={{ mb: 1 }}>
                    {t.title}
                </Typography>
                <Typography sx={{ color: colors.muted, mb: 4 }}>{t.intro}</Typography>

                <SectionTitle>{t.stepsHeading}</SectionTitle>
                <Card>
                    <Stack spacing={1.5}>
                        {t.steps.map((step, i) => (
                            <Stack key={i} direction="row" alignItems="flex-start" gap={1.5}>
                                <Box
                                    sx={{
                                        flexShrink: 0,
                                        width: 28,
                                        height: 28,
                                        borderRadius: '50%',
                                        backgroundColor: colors.accent,
                                        color: '#fff',
                                        display: 'grid',
                                        placeItems: 'center',
                                        fontWeight: 700,
                                        fontSize: 14,
                                    }}
                                >
                                    {i + 1}
                                </Box>
                                <Typography sx={{ pt: 0.3 }}>{step}</Typography>
                            </Stack>
                        ))}
                    </Stack>
                </Card>

                <SectionTitle>{t.emailHeading}</SectionTitle>
                <Typography sx={{ color: colors.text }}>
                    {t.emailBody1}
                    <Link
                        href={`mailto:${EMAIL}?subject=${encodeURIComponent(mailSubject)}`}
                        sx={{ color: colors.gold, fontWeight: 600 }}
                    >
                        {EMAIL}
                    </Link>
                    {t.emailBody2}
                </Typography>

                <SectionTitle>{t.tableHeading}</SectionTitle>
                <TableContainer
                    component={Box}
                    sx={{
                        backgroundColor: colors.surface,
                        border: `1px solid ${colors.border}`,
                        borderRadius: 3,
                    }}
                >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ color: colors.muted, borderColor: colors.border }}>
                                    {t.colData}
                                </TableCell>
                                <TableCell
                                    align="right"
                                    sx={{ color: colors.muted, borderColor: colors.border }}
                                >
                                    {t.colStatus}
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {t.rows.map(([label, kind], i) => (
                                <TableRow key={i}>
                                    <TableCell sx={{ color: colors.text, borderColor: colors.border }}>
                                        {label}
                                    </TableCell>
                                    <TableCell align="right" sx={{ borderColor: colors.border }}>
                                        <Chip
                                            label={kind === 'del' ? t.deleted : t.kept}
                                            size="small"
                                            sx={{
                                                fontWeight: 700,
                                                color: kind === 'del' ? colors.danger : colors.gold,
                                                backgroundColor:
                                                    kind === 'del'
                                                        ? 'rgba(198,40,40,0.15)'
                                                        : 'rgba(249,168,37,0.15)',
                                            }}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Typography sx={{ color: colors.muted, mt: 2 }}>{t.anonNote}</Typography>

                <SectionTitle>{t.retentionHeading}</SectionTitle>
                <Typography sx={{ color: colors.muted }}>{t.retentionBody}</Typography>

                <SectionTitle>{t.refundHeading}</SectionTitle>
                <Typography sx={{ color: colors.muted }}>{t.refundBody}</Typography>

                <Box
                    sx={{
                        mt: 6,
                        pt: 3,
                        borderTop: `1px solid ${colors.border}`,
                        color: colors.muted,
                        fontSize: 13,
                    }}
                >
                    {t.footer}
                    <Link href={`mailto:${EMAIL}`} sx={{ color: colors.accent }}>
                        {EMAIL}
                    </Link>
                </Box>
            </Container>
        </Box>
    )
}

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Typography variant="h6" fontWeight={700} sx={{ mt: 4, mb: 1.5 }}>
        {children}
    </Typography>
)

const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Box
        sx={{
            backgroundColor: colors.surface,
            border: `1px solid ${colors.border}`,
            borderRadius: 3,
            p: 3,
        }}
    >
        {children}
    </Box>
)

export default DeleteAccount
