# Player integrity panel

`https://jacobhal.se/skarp/integrity` — unlisted, `Disallow`ed in robots.txt,
and opened with its own passphrase. Read-only.

It answers one question: does this player's ranked record look different from
everybody else's, and by how much. It cannot restrict an account, and it is not
proof of anything on its own.

## What it shows

- **Header counts.** Ranked accounts tracked in the window, how many clear the
  40-answer floor the weekly email uses, how many the algorithm has flagged, and
  how many are currently restricted.
- **Review board.** One row per account with at least N comparable answers,
  most suspicious first. Band, answer count, accuracy against the accuracy the
  question difficulties predict, z score, median answer time, app exits during
  ranked questions, and whether the account is restricted.
- **Player card.** Every figure beside the population median for the same
  window, coloured by which side of it the player sits on, plus the sample sizes
  each figure rests on and the player's recent ranked answers with the share of
  other players who got each one right.

The 7 / 30 / 90 day window and the 1 / 5 / 10 / 40 answer floor are both
selectable. The 40-answer floor is what the **email** uses before it will band
anybody; it is not a visibility rule, and the panel goes down to a single
answer so a new account can still be looked at.

## Reading it honestly

`scored_answers` counts only answers whose question has been seen by at least
four ranked players, because a question nobody else has met carries no
difficulty estimate. At this app's volume that is a small fraction of what a
player actually saw, so the card shows both: *"16 comparable of 214 ranked
answers"*.

Every figure on the card names its own sample. A 100% slow-correct share
measured over one timed answer is not a habit, and the card says so rather than
leaving it to be misread.

Answer timings come from server receipt timestamps on `challenge_rounds`, so
rows answered before that trigger existed show no time at all.

## First-time setup

1. The functions ship with the Skarp app's own migrations, in the `quiz-app`
   repo: `supabase/migrations/20260904160000_web_integrity_review_panel.sql` and
   `20260904170000_web_integrity_overview.sql`. They are deployed with the
   normal test-then-production playbook, not applied by hand. This is on purpose
   and differs from `20260823190000_web_acquisition_events.sql`: these functions
   read tables the app owns, so a signature change must break at push time
   rather than silently in a browser.
2. Set the passphrase once per project, in the Supabase SQL editor:

   ```sql
   select private.set_web_integrity_token('<a long passphrase>');
   ```

   Only the sha256 hash is stored. This is a **different** secret from the
   `/stats` passphrase, deliberately: that one opens ad counts, this one opens
   usernames beside suspicion scores.
3. Nothing else. The page reuses `VITE_SUPABASE_SKARP_URL` and
   `VITE_SUPABASE_SKARP_ANON_KEY`, already set for the marketing pages.

## Why the anon key in the bundle is safe here

- Every read goes through a `SECURITY DEFINER` function that compares the
  passphrase server-side and returns an empty set, not an error, when it does
  not match.
- The passphrase table lives in the `private` schema, which PostgREST does not
  expose and `anon` has no `USAGE` on.
- The scoring internals (`player_integrity_scored`, `player_integrity_report`)
  are granted to `service_role` only. `anon` calling them directly gets
  `permission denied for function`.
- `web_integrity_overview` returns exactly one row for a valid passphrase and
  none for an invalid one, so the page can say "passphrase not accepted"
  instead of showing an empty board that looks like good news.

## Why there is no restrict button

The only authority behind this page is a shared passphrase carried by a public
key that anybody can read out of the bundle. That is enough to look at
aggregates and nowhere near enough to take somebody's ranked access away.

Restrictions run through `admin_set_ranked_restriction` and
`admin_lift_ranked_restriction`, which are `service_role` only. See
`docs/player_integrity_playbook.md` in the `quiz-app` repo. A button here would
need a real signed-in admin role first.

## Files

| File | Role |
|---|---|
| `client/src/views/Integrity/Integrity.tsx` | The page |
| `client/src/views/Integrity/present.ts` | Formatting, median comparison, sample-size caveats |
| `client/src/services/integrityStore.ts` | The four read RPCs |
| `quiz-app` `20260904160000_web_integrity_review_panel.sql` | Shared scoring, passphrase gate, board / search / player |
| `quiz-app` `20260904170000_web_integrity_overview.sql` | Header counts and the passphrase signal |
