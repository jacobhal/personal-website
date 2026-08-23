import { useCallback, useEffect, useMemo } from 'react'

import {
    appStoreUrl,
    playStoreUrl,
    readCampaign,
    type StoreCampaign,
} from '../config/storeCampaign'
import { recordAcquisitionEvent } from '../services/acquisitionStore'
import type { Locale } from '../i18n/locale'
import {
    captureLandingView,
    captureStoreClick,
    recordAcquisitionBreadcrumb,
    setAcquisitionCampaign,
    type AcquisitionApp,
    type AcquisitionStore,
} from '../services/acquisitionTelemetry'

export interface UseStoreLinksInput {
    app: AcquisitionApp
    appStoreUrl: string
    playStoreUrl: string
    /** Set on the invite pages, where the code rides along in the referrer. */
    referralCode?: string
    /** Landing views are only counted on the marketing pages, so the invite
     *  pages do not inflate the campaign denominator. */
    countLandingView?: boolean
    /** Recorded with each event, to compare Swedish and English creative. */
    locale: Locale
}

export interface UseStoreLinksResult {
    campaign: StoreCampaign
    appStoreHref: string
    playStoreHref: string
    /** Attach to both store buttons so each click is attributable. */
    trackStoreClick: (store: AcquisitionStore) => void
}

/**
 * Campaign-tagged store links plus per-store click tracking.
 *
 * The pages have no analytics beyond Sentry, so the click breadcrumb is the
 * only record of App Store versus Google Play split per campaign. It is
 * deliberately fired on click rather than on navigation: the page is gone the
 * moment the store opens.
 */
export const useStoreLinks = ({
    app,
    appStoreUrl: appStoreBase,
    playStoreUrl: playStoreBase,
    referralCode,
    countLandingView = false,
    locale,
}: UseStoreLinksInput): UseStoreLinksResult => {
    const campaign = useMemo(
        () =>
            readCampaign(
                typeof window === 'undefined' ? '' : window.location.search
            ),
        []
    )

    useEffect(() => {
        setAcquisitionCampaign(campaign)
    }, [campaign])

    useEffect(() => {
        if (!countLandingView) return
        captureLandingView({ app, campaign })
        void recordAcquisitionEvent({
            app,
            event: 'landing_view',
            campaign,
            locale,
        })
        // `locale` is deliberately absent from the dependencies: toggling the
        // language must not count as a second visit.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [app, campaign, countLandingView])

    const trackStoreClick = useCallback(
        (store: AcquisitionStore) => {
            recordAcquisitionBreadcrumb({
                app,
                stage: 'store_navigation',
                outcome: 'started',
                store,
                campaign,
            })
            captureStoreClick({ app, store, campaign })
            void recordAcquisitionEvent({
                app,
                event: 'store_click',
                store,
                campaign,
                locale,
            })
        },
        [app, campaign, locale]
    )

    return {
        campaign,
        appStoreHref: appStoreUrl(appStoreBase, campaign),
        playStoreHref: playStoreUrl(playStoreBase, campaign, referralCode),
        trackStoreClick,
    }
}
