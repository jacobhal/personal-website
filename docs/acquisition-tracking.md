# Acquisition tracking — where downloads come from

No SDK, no MMP, no cookie banner. Everything below is free and already live once
this is deployed.

There are three independent records of the same visit. Use them together: the
first tells you who clicked, the other two tell you who actually installed.

| Record | Where you read it | Answers |
|---|---|---|
| **jacobhal.se/stats** | The dashboard, passphrase-gated | Page views and store clicks per campaign, split by app and by store |
| Sentry events | sentry.io, project `jacobhal-se` | The same numbers, plus the error context when something breaks |
| App Store Connect | App Analytics → Campaigns | Installs from a campaign, iOS |
| Google Play Console | Acquisition → Traffic sources | Installs from a campaign, Android |

---

## 1. Tag every link you post

The whole system keys off UTM parameters on the landing URL. A link with none
is still counted, just as `organic`.

```
https://jacobhal.se/skarp?utm_source=tiktok&utm_medium=paid&utm_campaign=rush_launch
https://jacobhal.se/krydda?utm_source=instagram&utm_medium=bio&utm_campaign=profile
```

| Parameter | Use it for | Example |
|---|---|---|
| `utm_source` | The platform | `tiktok`, `instagram`, `reddit` |
| `utm_medium` | How it was placed | `paid`, `organic`, `bio`, `dm` |
| `utm_campaign` | The specific push | `rush_launch`, `week34` |
| `utm_content` | Which creative, when several run at once | `owl_hook`, `duel_hook` |

`?lang=sv` or `?lang=en` additionally pins the page language, which is worth
doing when the ad creative is in one language and you want the page to match
regardless of the visitor's phone settings.

**Keep the values lowercase and stable.** They are grouped as literal strings,
so `TikTok` and `tiktok` become two different rows.

### One creative per `utm_content`

The point of tracking is to kill the losers. If three clips point at the same
URL you learn nothing about which clip worked, so give each its own
`utm_content` and keep `utm_campaign` shared.

---

## 2. What the site does with the tag

On landing, `src/hooks/useStoreLinks.ts` reads the UTM parameters once and:

1. **Tags the Sentry session** — `campaign_source`, `campaign_medium`,
   `campaign_name`, `campaign_content`.
2. **Sends `acquisition.landing_view`** — one countable event per page view.
   This is the denominator.
3. **Rewrites both store buttons** so the campaign survives the jump to the
   store (see below).
4. **Sends `acquisition.store_click`** on each button click, tagged with
   `store: app_store | google_play`. This is the numerator.

Landing views are only counted on `/skarp` and `/krydda`, not on the invite
pages, so referral traffic does not inflate the campaign denominator.

> Both are `Sentry.captureMessage`, not breadcrumbs. Breadcrumbs only reach
> Sentry attached to an error or a sampled transaction, and `tracesSampleRate`
> is `0.02` — 98% of clicks would have been invisible.

### What lands on the store URL

**App Store** gets a `ct` parameter, which App Store Connect reports as
"Campaign":

```
https://apps.apple.com/app/id6763050250?ct=tiktok_rush_launch
```

Apple truncates it at 40 characters, so the code clamps it there rather than
letting Apple cut it somewhere unpredictable.

**Google Play** gets everything packed into the single `referrer` parameter it
allows:

```
https://play.google.com/store/apps/details?id=se.jacobhallman.quizapp&referrer=utm_source%3Dtiktok%26utm_campaign%3Drush_launch
```

On an invite link the referral code keeps the front of that value
(`referral_code=ABC234XYZ789&utm_source=tiktok`) because the app parses it out
of the install referrer.

Neither store URL pins a storefront or a language any more. `/se/…?l=en-GB` and
`&hl=en` used to force a Swedish visitor onto an English store page.

---

## 3. Reading it on /stats

`https://jacobhal.se/stats` — not linked from anywhere, `Disallow`ed in
robots.txt, and gated by a passphrase you type once.

Shows, for 7 / 30 / 90 days and for either app or both:

- total views, clicks and click-through rate per app, split iOS vs Android
- one row per `source / medium / campaign / creative`, sorted by traffic

### First-time setup

1. Apply `supabase/migrations/20260823190000_web_acquisition_events.sql` to the
   Supabase project that will hold the data.
2. Set the passphrase, once, in the SQL editor:

   ```sql
   select private.set_web_stats_token('<a long passphrase>');
   ```

   Only the sha256 hash is stored. The passphrase never appears in the client
   bundle — the page prompts for it and keeps it in `localStorage`.
3. Put the project's URL and **anon** key into the Azure `mainGroup` variable
   group as `WEB_SUPABASE_URL` and `WEB_SUPABASE_ANON_KEY`. The pipeline passes
   them to the build as `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`.

For local development put the same two `VITE_` values in `client/.env.local`
(gitignored). Without them the pages record nothing and `/stats` says so.

### Why the anon key in the bundle is safe here

- The events table is **insert-only** for `anon`. There is no select policy, so
  the key cannot read a single row back.
- Every column is `CHECK`-constrained, so the table cannot be filled with
  arbitrary text.
- Reads go through `web_acquisition_summary`, a `SECURITY DEFINER` function that
  compares the passphrase server-side and returns an empty set — not an error —
  when it does not match.
- The passphrase table lives in a `private` schema that PostgREST does not
  expose and `anon` has no `USAGE` on.

### What is deliberately not collected

No IP address, no user agent, no cookie, no device fingerprint, no session or
visitor id. Rows are anonymous and cannot be linked to each other or to a
person, which is why the pages carry no consent banner. **Adding any identifier
to that table changes its legal character — do not do it without revisiting
the privacy policy.**

---

## 4. Reading it in Sentry

Org `jacob-hallman`, region `https://de.sentry.io`, project `jacobhal-se`.

In **Discover**, or the Issues search box:

```
# Every store click last 14 days
message:"acquisition.store_click"

# One campaign only
message:"acquisition.store_click" campaign_source:tiktok campaign_name:rush_launch

# iOS versus Android split for that campaign
message:"acquisition.store_click" campaign_name:rush_launch store:app_store
message:"acquisition.store_click" campaign_name:rush_launch store:google_play

# The denominator
message:"acquisition.landing_view" campaign_name:rush_launch
```

Click-through rate for a campaign = `store_click` count ÷ `landing_view` count.

From the command line, using `SENTRY_AUTH_TOKEN` (never paste the value):

```bash
source .env.test   # or wherever the token lives
curl -s -G "https://de.sentry.io/api/0/organizations/jacob-hallman/events/" \
  --data-urlencode "field=campaign_source" \
  --data-urlencode "field=campaign_name" \
  --data-urlencode "field=store" \
  --data-urlencode "field=count()" \
  --data-urlencode "query=message:\"acquisition.store_click\"" \
  --data-urlencode "statsPeriod=14d" \
  --data-urlencode "project=-1" \
  --data-urlencode "sort=-count" \
  -H "Authorization: Bearer $SENTRY_AUTH_TOKEN"
```

### Quota

Two events per converting visitor. At a few thousand visits a month this sits
inside the free tier comfortably; if a campaign ever goes big, drop
`captureLandingView` first — the store click is the one that matters.

---

## 5. Reading it in the stores

These are the ones that prove an **install**, which Sentry cannot see.

**App Store Connect** → your app → App Analytics → Acquisition → Campaigns.
Rows are the `ct` values. Expect a 1–2 day lag, and note Apple only shows a
campaign once it clears a privacy threshold of daily users.

**Google Play Console** → your app → Grow → Acquisition reports → Traffic
sources → "UTM tagged". Rows are the `utm_source` / `utm_campaign` pairs from
the `referrer` value. Also 1–2 days behind.

### What none of this can tell you

Whether an install turned into a purchase. That needs an MMP (AppsFlyer,
Adjust, Singular, Branch), which RevenueCat integrates with directly. Worth
adding only once a channel is proven to deliver installs at an acceptable cost.

---

## 6. Where the code lives

| File | Role |
|---|---|
| `client/src/config/storeCampaign.ts` | Reads UTM parameters, builds `ct` and `referrer` |
| `client/src/hooks/useStoreLinks.ts` | Wires campaign → links → telemetry on both landing and invite pages |
| `client/src/services/acquisitionTelemetry.ts` | `captureLandingView`, `captureStoreClick`, Sentry tags, PII redaction |
| `client/src/config/appStores.ts` | Canonical store URLs, no forced locale |
| `client/src/services/acquisitionStore.ts` | Writes events to Supabase, reads the summary for /stats |
| `client/src/views/Stats/` | The dashboard page and its aggregation |
| `supabase/migrations/20260823190000_web_acquisition_events.sql` | Table, RLS, and the passphrase-gated summary function |

Redaction is in `redactTelemetryString`: invite URLs, referral codes, emails and
UUIDs are stripped before anything is sent. UTM values are plain strings and are
deliberately kept.
