/**
 * Canonical store links.
 *
 * No storefront segment and no `l=`/`hl=` parameter: both stores resolve the
 * visitor's own country and language from the request, and the previous
 * `/se/…?l=en-GB` and `&hl=en` forms overrode that — a Swedish visitor from a
 * Swedish-language ad landed on an English store page.
 *
 * Campaign parameters are added at click time by `config/storeCampaign`, not
 * baked in here.
 */
export const SKARP_APP_STORE_URL = 'https://apps.apple.com/app/id6763050250'
export const SKARP_PLAY_STORE_URL =
    'https://play.google.com/store/apps/details?id=se.jacobhallman.quizapp'

export const KRYDDA_APP_STORE_URL = 'https://apps.apple.com/app/id6777108071'
export const KRYDDA_PLAY_STORE_URL =
    'https://play.google.com/store/apps/details?id=se.jacobhallman.krydda'
