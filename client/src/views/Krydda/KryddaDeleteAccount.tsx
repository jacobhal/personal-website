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
import icon from '../../assets/images/krydda_icon.png'

type Lang = 'sv' | 'en'

const colors = {
    bg: '#14110E',
    surface: '#211B15',
    border: '#2C241B',
    accent: '#E2671C',
    gold: '#F4A93D',
    text: '#EFE7DD',
    muted: '#A89B8C',
    danger: '#ff8a80',
}

const copy = {
    sv: {
        title: 'Radera ditt Krydda-konto',
        intro:
            'Den här sidan beskriver hur du raderar ditt molnkonto i appen Krydda samt vilka uppgifter som tas bort respektive sparas.',
        stepsHeading: 'Så raderar du kontot i appen',
        steps: [
            'Öppna Krydda och logga in.',
            'Gå till Inställningar och leta upp avsnittet Konto.',
            'Tryck på Ta bort konto (markerat i rött).',
            'Bekräfta i dialogrutan. Ditt molnkonto och synkad molndata raderas omedelbart och du loggas ut.',
        ],
        emailHeading: 'Har du inte längre tillgång till appen?',
        emailBody1: 'Om du har avinstallerat appen kan du begära radering via e-post. Mejla ',
        emailBody2:
            ' från den e-postadress som är kopplad till kontot, med ämnet ”Radera mitt Krydda-konto”. Vi behandlar begäran inom 30 dagar.',
        tableHeading: 'Vilka uppgifter raderas och vad sparas',
        colData: 'Uppgift',
        colStatus: 'Status',
        deleted: 'Raderas',
        kept: 'Stannar på enheten',
        rows: [
            ['Molnkonto, e-postadress och profil (namn och användarnamn)', 'del'],
            ['Recept, bilder och data som synkats till molnet', 'del'],
            ['Prenumerations- och entitlementstatus som lagras i molnet', 'del'],
            ['Recept som ligger lokalt på din enhet', 'keep'],
        ] as [string, 'del' | 'keep'][],
        localNote:
            'Recept som finns lokalt på din enhet påverkas inte av att kontot raderas. De ligger kvar tills du tar bort dem eller avinstallerar appen, och du kan fortsätta använda Krydda lokalt utan konto.',
        retentionHeading: 'Lagringstid och säkerhetskopior',
        retentionBody:
            'Radering sker omedelbart i vår databas. Rester i krypterade säkerhetskopior rensas inom 30 dagar.',
        refundHeading: 'Köp och återbetalning',
        refundBody:
            'Att radera kontot avslutar inte och återbetalar inte en prenumeration. Prenumerationer hanteras av App Store eller Google Play och måste sägas upp eller återbetalas via dem enligt deras regler.',
        footer: 'Krydda · Utvecklare: Jacob Hallman · Kontakt: ',
    },
    en: {
        title: 'Delete your Krydda account',
        intro:
            'This page explains how to delete your cloud account in the Krydda app, and which data is removed or retained.',
        stepsHeading: 'Delete your account in the app',
        steps: [
            'Open Krydda and sign in.',
            'Go to Settings and find the Account section.',
            'Tap Delete account (shown in red).',
            'Confirm in the dialog. Your cloud account and synced cloud data are deleted immediately and you are signed out.',
        ],
        emailHeading: 'No longer have access to the app?',
        emailBody1: 'If you have uninstalled the app, you can request deletion by email. Email ',
        emailBody2:
            ' from the address linked to your account, with the subject “Delete my Krydda account”. We process requests within 30 days.',
        tableHeading: 'What data is deleted and what is kept',
        colData: 'Data',
        colStatus: 'Status',
        deleted: 'Deleted',
        kept: 'Kept on device',
        rows: [
            ['Cloud account, email address and profile (name and username)', 'del'],
            ['Recipes, images and data synced to the cloud', 'del'],
            ['Subscription and entitlement status stored in the cloud', 'del'],
            ['Recipes stored locally on your device', 'keep'],
        ] as [string, 'del' | 'keep'][],
        localNote:
            'Recipes stored locally on your device are not affected by deleting your account. They remain until you remove them or uninstall the app, and you can keep using Krydda locally without an account.',
        retentionHeading: 'Retention and backups',
        retentionBody:
            'Deletion happens immediately in our database. Any remnants in encrypted backups are purged within 30 days.',
        refundHeading: 'Purchases and refunds',
        refundBody:
            'Deleting your account does not cancel or refund a subscription. Subscriptions are managed by the App Store or Google Play and must be cancelled or refunded through them under their respective policies.',
        footer: 'Krydda · Developer: Jacob Hallman · Contact: ',
    },
}

const EMAIL = 'jacobhallman94@gmail.com'

const KryddaDeleteAccount: React.FC = () => {
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
        lang === 'sv' ? 'Radera mitt Krydda-konto' : 'Delete my Krydda account'

    return (
        <Box sx={{ backgroundColor: colors.bg, minHeight: '100vh', color: colors.text }}>
            <Helmet>
                <html lang={lang} />
                <title>{t.title} — Krydda</title>
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
                            src={icon}
                            alt="Krydda"
                            sx={{
                                width: 64,
                                height: 64,
                                borderRadius: 3,
                                boxShadow: '0 6px 20px rgba(0,0,0,0.5)',
                            }}
                        />
                        <Box>
                            <Typography variant="h5" fontWeight={800}>
                                Krydda
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
                                                        : 'rgba(244,169,61,0.15)',
                                            }}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Typography sx={{ color: colors.muted, mt: 2 }}>{t.localNote}</Typography>

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

export default KryddaDeleteAccount
