import React, { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Box, Button, Container, Stack, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'

import { AppMarketingBar } from './AppMarketingBar'
import { useLocale } from '../i18n/useLocale'
import { useStoreLinks } from '../hooks/useStoreLinks'
import {
    captureAcquisitionFailure,
    recordAcquisitionBreadcrumb,
    setAcquisitionApp,
    type AcquisitionApp,
    type AcquisitionStore,
} from '../services/acquisitionTelemetry'

export interface AppInviteConfig {
    app: AcquisitionApp
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
    border: string
}

const REFERRAL_CODE = /^[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{12}$/

export const normalizeReferralCode = (value: string | undefined) => {
    const normalized = value?.trim().toUpperCase() ?? ''
    return REFERRAL_CODE.test(normalized) ? normalized : null
}

interface StoreDestination {
    href: string | null
    error: unknown | null
}

/** Validates a built store URL before it is put on an anchor. */
const storeDestination = (url: string): StoreDestination => {
    try {
        const storeUrl = new URL(url)
        if (storeUrl.protocol !== 'https:') {
            throw new TypeError('Store destination must use HTTPS')
        }
        return { href: storeUrl.toString(), error: null }
    } catch (error) {
        return { href: null, error }
    }
}

interface AppInvitePageProps {
    config: AppInviteConfig
}

const AppInvitePage: React.FC<AppInvitePageProps> = ({ config }) => {
    const { code: rawCode } = useParams<{ code: string }>()
    const code = normalizeReferralCode(rawCode)
    const { locale, setLocale } = useLocale()
    const [copyStatus, setCopyStatus] = useState<string | null>(null)
    // Campaign-tagged links, so an invite opened from an ad is still
    // attributable. The referral code keeps its place at the front of the Play
    // `referrer` value; the campaign is appended to the same parameter.
    const { appStoreHref, playStoreHref, trackStoreClick } = useStoreLinks({
        app: config.app,
        appStoreUrl: config.appStoreUrl,
        playStoreUrl: config.playStoreUrl,
        referralCode: code ?? undefined,
        locale,
    })
    const appStore = useMemo(
        () => storeDestination(appStoreHref),
        [appStoreHref]
    )
    const playStore = useMemo(
        () =>
            code === null
                ? { href: null, error: null }
                : storeDestination(playStoreHref),
        [code, playStoreHref]
    )

    useEffect(() => {
        setAcquisitionApp(config.app)
        recordAcquisitionBreadcrumb({
            app: config.app,
            stage: 'landing',
            outcome: code === null ? 'invalid' : 'valid',
        })
    }, [code, config.app])

    useEffect(() => {
        const failures: Array<{
            destination: StoreDestination
            store: AcquisitionStore
        }> = [
            { destination: appStore, store: 'app_store' },
            { destination: playStore, store: 'google_play' },
        ]
        for (const { destination, store } of failures) {
            if (destination.error === null) continue
            recordAcquisitionBreadcrumb({
                app: config.app,
                stage: 'store_navigation',
                outcome: 'failed',
                store,
            })
            captureAcquisitionFailure(destination.error, {
                app: config.app,
                stage: 'store_navigation',
                store,
            })
        }
    }, [appStore, config.app, playStore])

    const copyCode = async () => {
        if (!code) return

        recordAcquisitionBreadcrumb({
            app: config.app,
            stage: 'clipboard',
            outcome: 'started',
        })
        try {
            if (!navigator.clipboard?.writeText)
                throw new Error('Clipboard unavailable')
            await navigator.clipboard.writeText(code)
            setCopyStatus('Code copied')
            recordAcquisitionBreadcrumb({
                app: config.app,
                stage: 'clipboard',
                outcome: 'succeeded',
            })
        } catch (error) {
            setCopyStatus(
                'Could not copy automatically. Select the code and copy it manually.'
            )
            recordAcquisitionBreadcrumb({
                app: config.app,
                stage: 'clipboard',
                outcome: 'failed',
            })
            captureAcquisitionFailure(error, {
                app: config.app,
                stage: 'clipboard',
            })
        }
    }

    const startStoreNavigation = (
        event: React.MouseEvent<HTMLAnchorElement>,
        store: AcquisitionStore,
        destination: StoreDestination
    ) => {
        if (destination.href === null) {
            event.preventDefault()
            return
        }
        trackStoreClick(store)
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
                <AppMarketingBar
                    appName={config.appName}
                    appIcon={config.appIcon}
                    homePath={config.marketingPath}
                    accent={config.accent}
                    text={config.text}
                    muted={config.muted}
                    border={config.border}
                    locale={locale}
                    onLocaleChange={setLocale}
                />
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
            <AppMarketingBar
                    appName={config.appName}
                    appIcon={config.appIcon}
                    homePath={config.marketingPath}
                    accent={config.accent}
                    text={config.text}
                    muted={config.muted}
                    border={config.border}
                    locale={locale}
                    onLocaleChange={setLocale}
                />
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
                            href={appStore.href ?? '#'}
                            aria-disabled={appStore.href === null}
                            onClick={(event) =>
                                startStoreNavigation(
                                    event,
                                    'app_store',
                                    appStore
                                )
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="contained"
                            className="app-invite-store-button app-invite-store-button-primary"
                        >
                            Download on the App Store
                        </Button>
                        <Button
                            component="a"
                            href={playStore.href ?? '#'}
                            aria-disabled={playStore.href === null}
                            onClick={(event) =>
                                startStoreNavigation(
                                    event,
                                    'google_play',
                                    playStore
                                )
                            }
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
