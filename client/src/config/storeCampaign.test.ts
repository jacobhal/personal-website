import { describe, expect, test } from 'vitest'

import {
    APP_STORE_CAMPAIGN_MAX_LENGTH,
    appStoreCampaignToken,
    appStoreUrl,
    hasCampaign,
    playStoreUrl,
    readCampaign,
} from './storeCampaign'

const APP_STORE = 'https://apps.apple.com/app/id6763050250'
const PLAY = 'https://play.google.com/store/apps/details?id=se.example.app'

describe('readCampaign', () => {
    test('reads the UTM parameters it knows', () => {
        expect(
            readCampaign('?utm_source=tiktok&utm_campaign=rush&utm_medium=paid')
        ).toEqual({ source: 'tiktok', medium: 'paid', campaign: 'rush' })
    })

    test('ignores blank and unrelated parameters', () => {
        expect(readCampaign('?utm_source=&ref=friend')).toEqual({})
        expect(hasCampaign(readCampaign(''))).toBe(false)
    })
})

describe('appStoreUrl', () => {
    test('leaves the URL untouched without a campaign', () => {
        expect(appStoreUrl(APP_STORE)).toBe(APP_STORE)
    })

    test('adds the campaign token App Store Connect reports on', () => {
        expect(
            appStoreUrl(APP_STORE, { source: 'tiktok', campaign: 'rush' })
        ).toBe(`${APP_STORE}?ct=tiktok_rush`)
    })

    test('clamps the token to the length Apple keeps', () => {
        const token = appStoreCampaignToken({ campaign: 'x'.repeat(80) })
        expect(token).toHaveLength(APP_STORE_CAMPAIGN_MAX_LENGTH)
    })

    test('never pins a storefront language', () => {
        expect(appStoreUrl(APP_STORE, { source: 'tiktok' })).not.toContain('l=')
    })
})

describe('playStoreUrl', () => {
    test('leaves the URL untouched without a campaign or code', () => {
        expect(playStoreUrl(PLAY)).toBe(PLAY)
    })

    test('packs the campaign into the single referrer parameter', () => {
        expect(playStoreUrl(PLAY, { source: 'tiktok', campaign: 'rush' })).toBe(
            `${PLAY}&referrer=utm_source%3Dtiktok%26utm_campaign%3Drush`
        )
    })

    test('keeps the referral code first when both are present', () => {
        const url = new URL(
            playStoreUrl(PLAY, { source: 'tiktok' }, 'ABC234XYZ789')
        )
        expect(url.searchParams.get('referrer')).toBe(
            'referral_code=ABC234XYZ789&utm_source=tiktok'
        )
    })

    test('still carries a referral code with no campaign', () => {
        const url = new URL(playStoreUrl(PLAY, {}, 'ABC234XYZ789'))
        expect(url.searchParams.get('referrer')).toBe(
            'referral_code=ABC234XYZ789'
        )
    })
})
