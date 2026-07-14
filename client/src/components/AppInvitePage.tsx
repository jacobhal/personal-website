import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { Box, Button, Container, Stack, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'

import { NavBar } from './NavBar'

export interface AppInviteConfig {
    appName: string
    appIcon: string
    appStoreUrl: string
    playStoreUrl: string
    marketingPath: string
    eyebrow: string
    headline: string
    description: string
    codeLabel: string
    accent: string
    background: string
    surface: string
    text: string
    muted: string
}

const REFERRAL_CODE = /^[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{12}$/

export const normalizeReferralCode = (value: string | undefined) => {
    const normalized = value?.trim().toUpperCase() ?? ''
    return REFERRAL_CODE.test(normalized) ? normalized : null
}

const playStoreUrlWithReferrer = (url: string, code: string) => {
    const storeUrl = new URL(url)
    storeUrl.searchParams.set('referrer', `referral_code=${code}`)
    return storeUrl.toString()
}

interface AppInvitePageProps {
    config: AppInviteConfig
}

const AppInvitePage: React.FC<AppInvitePageProps> = ({ config }) => {
    const { code: rawCode } = useParams<{ code: string }>()
    const code = normalizeReferralCode(rawCode)
    const [copyStatus, setCopyStatus] = useState<string | null>(null)

    const copyCode = async () => {
        if (!code) return

        try {
            if (!navigator.clipboard?.writeText)
                throw new Error('Clipboard unavailable')
            await navigator.clipboard.writeText(code)
            setCopyStatus('Code copied')
        } catch {
            setCopyStatus(
                'Could not copy automatically. Select the code and copy it manually.'
            )
        }
    }

    const pageStyle = {
        '--invite-accent': config.accent,
        '--invite-background': config.background,
        '--invite-surface': config.surface,
        '--invite-text': config.text,
        '--invite-muted': config.muted,
    } as React.CSSProperties

    if (!code) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    backgroundColor: config.background,
                    color: config.text,
                }}
            >
                <Helmet>
                    <title>Invalid {config.appName} invite</title>
                </Helmet>
                <NavBar noImage />
                <Container
                    maxWidth="sm"
                    sx={{ py: { xs: 12, md: 18 }, textAlign: 'center' }}
                >
                    <Stack spacing={3} alignItems="center">
                        <Box
                            component="img"
                            src={config.appIcon}
                            alt=""
                            sx={{ width: 96, borderRadius: 5 }}
                        />
                        <Typography
                            component="h1"
                            variant="h3"
                            fontWeight={900}
                        >
                            This invite link is not valid
                        </Typography>
                        <Typography sx={{ color: config.muted }}>
                            It may be incomplete or mistyped. You can still
                            learn about {config.appName}.
                        </Typography>
                        <Button
                            component="a"
                            href={config.marketingPath}
                            variant="contained"
                            sx={{
                                backgroundColor: config.accent,
                                textTransform: 'none',
                                fontWeight: 700,
                            }}
                        >
                            Visit the {config.appName} page
                        </Button>
                    </Stack>
                </Container>
            </Box>
        )
    }

    return (
        <Box className="app-invite-page" style={pageStyle}>
            <Helmet>
                <title>You have been invited to {config.appName}</title>
                <meta
                    name="description"
                    content={`Use invite code ${code} after installing ${config.appName}.`}
                />
            </Helmet>
            <NavBar noImage />
            <Container maxWidth="sm" className="app-invite-container">
                <Stack spacing={3} alignItems="center" textAlign="center">
                    <Box
                        component="img"
                        src={config.appIcon}
                        alt={`${config.appName} app icon`}
                        className="app-invite-icon"
                    />
                    <Typography component="p" className="app-invite-eyebrow">
                        {config.eyebrow}
                    </Typography>
                    <Typography component="h1" className="app-invite-title">
                        {config.headline}
                    </Typography>
                    <Typography
                        component="p"
                        className="app-invite-description"
                    >
                        {config.description}
                    </Typography>

                    <Box className="app-invite-code-card">
                        <Typography
                            component="p"
                            className="app-invite-code-label"
                        >
                            {config.codeLabel}
                        </Typography>
                        <Typography
                            component="code"
                            className="app-invite-code"
                        >
                            {code}
                        </Typography>
                        <Button
                            type="button"
                            variant="outlined"
                            onClick={copyCode}
                            aria-label="Copy invite code"
                            className="app-invite-copy-button"
                        >
                            Copy code
                        </Button>
                        {copyStatus && (
                            <Typography
                                component="p"
                                role="status"
                                className="app-invite-copy-status"
                            >
                                {copyStatus}
                            </Typography>
                        )}
                    </Box>

                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                        width="100%"
                    >
                        <Button
                            component="a"
                            href={config.appStoreUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="contained"
                            className="app-invite-store-button app-invite-store-button-primary"
                        >
                            Download on the App Store
                        </Button>
                        <Button
                            component="a"
                            href={playStoreUrlWithReferrer(
                                config.playStoreUrl,
                                code
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="outlined"
                            className="app-invite-store-button"
                        >
                            Get it on Google Play
                        </Button>
                    </Stack>
                </Stack>
            </Container>
        </Box>
    )
}

export default AppInvitePage
