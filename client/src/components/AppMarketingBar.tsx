import React from 'react'
import { Box, Button, Link, Stack } from '@mui/material'

import { LOCALES, type Locale } from '../i18n/locale'

export interface AppMarketingBarProps {
    /** Product name, used as the wordmark and the icon's accessible name. */
    appName: string
    appIcon: string
    /** Where the wordmark links, e.g. `/skarp`. */
    homePath: string
    accent: string
    text: string
    muted: string
    border: string
    locale: Locale
    onLocaleChange: (locale: Locale) => void
}

const LOCALE_LABEL: Record<Locale, string> = { sv: 'SV', en: 'EN' }
const LOCALE_NAME: Record<Locale, string> = { sv: 'Svenska', en: 'English' }

/**
 * The header for the product marketing pages.
 *
 * Deliberately not the site `NavBar`. These URLs are handed out in ads, App
 * Store listings and DMs, where the personal site's monogram and its
 * Resume/Portfolio/About links are noise at best and a credibility leak at
 * worst — a visitor who came for an app should see the app, not a CV.
 *
 * It carries the language toggle because that is the only chrome these pages
 * need: a Swede on an English handset, or the reverse, must be able to switch.
 */
export const AppMarketingBar: React.FC<AppMarketingBarProps> = ({
    appName,
    appIcon,
    homePath,
    accent,
    text,
    muted,
    border,
    locale,
    onLocaleChange,
}) => (
    <Box
        component="header"
        sx={{
            borderBottom: `1px solid ${border}`,
            backgroundColor: 'transparent',
        }}
    >
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
                maxWidth: 1152,
                mx: 'auto',
                px: { xs: 2, md: 3 },
                py: 1.5,
            }}
        >
            <Link
                href={homePath}
                underline="none"
                aria-label={appName}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.25,
                    color: text,
                    fontWeight: 800,
                    fontSize: 17,
                    letterSpacing: '-0.01em',
                }}
            >
                <Box
                    component="img"
                    src={appIcon}
                    alt=""
                    sx={{ width: 28, height: 28, borderRadius: 1.5 }}
                />
                {appName}
            </Link>

            <Stack
                direction="row"
                spacing={0.5}
                component="nav"
                aria-label={
                    locale === 'sv' ? 'Byt språk' : 'Change language'
                }
            >
                {LOCALES.map((option) => {
                    const active = option === locale
                    return (
                        <Button
                            key={option}
                            type="button"
                            size="small"
                            onClick={() => onLocaleChange(option)}
                            aria-current={active ? 'true' : undefined}
                            aria-label={LOCALE_NAME[option]}
                            sx={{
                                minWidth: 44,
                                px: 1,
                                textTransform: 'none',
                                fontWeight: 700,
                                fontSize: 13,
                                borderRadius: 1.5,
                                color: active ? text : muted,
                                backgroundColor: active
                                    ? `${accent}26`
                                    : 'transparent',
                                '&:hover': {
                                    backgroundColor: `${accent}1F`,
                                    color: text,
                                },
                            }}
                        >
                            {LOCALE_LABEL[option]}
                        </Button>
                    )
                })}
            </Stack>
        </Stack>
    </Box>
)

export default AppMarketingBar
