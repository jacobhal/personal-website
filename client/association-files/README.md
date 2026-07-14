# Android App Links association

`assetlinks.template.json` is source-only. Do not deploy it with placeholder
fingerprints.

Before enabling Android App Links:

1. In Google Play Console, open each app's **Setup → App integrity → App signing**.
2. Copy the SHA-256 fingerprint from the **App signing key certificate** (not the
   upload key).
3. Replace `__SKARP_PLAY_SHA256__` and `__KRYDDA_PLAY_SHA256__` in a copy of the
   template.
4. Save the completed file as `public/.well-known/assetlinks.json`.
5. Build, deploy, then verify
   `https://jacobhal.se/.well-known/assetlinks.json` returns the JSON directly
   over HTTPS with no redirect.

The iOS association file is publishable now because team ID and bundle IDs come
from the apps' checked-in Xcode project settings. It is served at both supported
locations: `/apple-app-site-association` and
`/.well-known/apple-app-site-association`.
