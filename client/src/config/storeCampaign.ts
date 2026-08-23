/**
 * Campaign attribution for the store buttons, without an SDK or an MMP.
 *
 * Neither store tells us which ad produced an install unless the outbound link
 * carries a campaign token, so the UTM parameters that brought a visitor to
 * `/skarp` or `/krydda` are forwarded to the store link they click:
 *
 *  - App Store: `ct` shows up as "Campaign" in App Store Connect App Analytics.
 *    Apple truncates it, so it is clamped here rather than silently cut.
 *  - Google Play: the whole campaign is packed into the single `referrer`
 *    parameter, which Play Console reports on and the installed app can read
 *    back from the Install Referrer API.
 *
 * This measures *store arrivals per campaign*, not installs-to-purchase. That
 * needs an MMP; this is the free tier of the same question.
 */

/** Apple truncates the campaign token in App Analytics beyond this. */
export const APP_STORE_CAMPAIGN_MAX_LENGTH = 40

export interface StoreCampaign {
    source?: string
    medium?: string
    campaign?: string
    content?: string
    term?: string
}

const UTM_KEYS = [
    ['utm_source', 'source'],
    ['utm_medium', 'medium'],
    ['utm_campaign', 'campaign'],
    ['utm_content', 'content'],
    ['utm_term', 'term'],
] as const

/** Reads UTM parameters off a query string. Unknown parameters are ignored. */
export const readCampaign = (search: string): StoreCampaign => {
    const params = new URLSearchParams(search)
    const campaign: StoreCampaign = {}
    for (const [param, key] of UTM_KEYS) {
        const value = params.get(param)?.trim()
        if (value) campaign[key] = value
    }
    return campaign
}

export const hasCampaign = (campaign: StoreCampaign): boolean =>
    Object.keys(campaign).length > 0

/**
 * Flat `utm_*` string. Used as the Play `referrer` payload and as the App Store
 * fallback token, so both stores report the same campaign names.
 */
const campaignQuery = (campaign: StoreCampaign): string => {
    const params = new URLSearchParams()
    for (const [param, key] of UTM_KEYS) {
        const value = campaign[key]
        if (value) params.set(param, value)
    }
    return params.toString()
}

/**
 * Parses a store URL, or returns null if it is not one.
 *
 * A malformed configured URL must not throw out of a render. The caller passes
 * the untouched string through instead, so the existing validation in
 * `AppInvitePage.storeDestination` still reports it to Sentry and disables the
 * button — one place decides what a broken store link means.
 */
const parseStoreUrl = (value: string): URL | null => {
    try {
        return new URL(value)
    } catch {
        return null
    }
}

/**
 * The token shown as "Campaign" in App Store Connect. Prefers the campaign
 * name and falls back to the source so an untagged-but-sourced click is still
 * distinguishable from organic traffic.
 */
export const appStoreCampaignToken = (
    campaign: StoreCampaign
): string | null => {
    const parts = [campaign.source, campaign.campaign, campaign.content].filter(
        (part): part is string => Boolean(part)
    )
    if (parts.length === 0) return null
    return parts.join('_').slice(0, APP_STORE_CAMPAIGN_MAX_LENGTH)
}

/**
 * Adds the campaign token to an App Store URL.
 *
 * Deliberately does not set a storefront or an `l=` language: Apple resolves
 * both from the visitor, and pinning them showed a Swedish visitor an English
 * page on the wrong storefront.
 */
export const appStoreUrl = (
    baseUrl: string,
    campaign: StoreCampaign = {}
): string => {
    const url = parseStoreUrl(baseUrl)
    if (url === null) return baseUrl
    const token = appStoreCampaignToken(campaign)
    if (token) url.searchParams.set('ct', token)
    return url.toString()
}

/**
 * Adds the campaign, and an optional referral code, to a Play Store URL.
 *
 * Play accepts exactly one `referrer` parameter, so the referral code and the
 * campaign share it. The referral code stays first because the app parses it
 * out of the install referrer string.
 */
export const playStoreUrl = (
    baseUrl: string,
    campaign: StoreCampaign = {},
    referralCode?: string
): string => {
    const url = parseStoreUrl(baseUrl)
    if (url === null) return baseUrl
    const parts = [
        referralCode ? `referral_code=${referralCode}` : '',
        campaignQuery(campaign),
    ].filter(Boolean)
    if (parts.length > 0) url.searchParams.set('referrer', parts.join('&'))
    return url.toString()
}
