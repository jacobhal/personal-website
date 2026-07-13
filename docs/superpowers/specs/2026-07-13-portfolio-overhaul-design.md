# Personal Website Portfolio Overhaul

## Goal

Turn `/portfolio` from an old image-hover gallery into a curated, product-focused portfolio that presents Jacob Hallman's current apps and web projects professionally on desktop and mobile.

## Approved visual direction

Use a dark editorial product-studio treatment for the portfolio page while leaving unrelated site routes intact. The portfolio hero should introduce selected work with concise copy, then lead into a responsive 3-column card grid on desktop, 2 columns on tablet, and 1 column on mobile.

Cards should use the real product icon or project artwork as the visual anchor, with a layered color wash, readable project metadata, and an explicit action. Hover/focus states should lift the card, reveal the description, and preserve keyboard-visible focus. The design should feel intentional without relying on the current hover-only “VIEW” overlay.

## Portfolio content

The visible curated grid contains nine items:

1. Skarp
2. Krydda
3. HitQuiz
4. Dagens Ord
5. Congress Filings
6. React Playground
7. Corona Dashboard
8. Restocker
9. Complete Git Guide

Stock Predictor and Game Review are removed from the visible grid because their current destinations are stale or broken. Existing routes are not deleted in this pass, preserving compatibility with old links.

## New app pages

### `/hitquiz`

Dark, music-focused visual language using the HitQuiz icon, green/gold accents, and the App Store CTA. Content covers the party format, host-led play, artist/title/year scoring, closest-year scoring, duels, free song bundles, and the one-time expansion pack. Link only to the provided iOS App Store listing because that is the current public release surface.

### `/dagens-ord`

Warm editorial visual language using the Dagens Ord icon, cream typography, amber surfaces, and the App Store CTA. Content covers one unusual Swedish word per day, word class, definition, synonyms, example sentence, history, daily quiz, progress, and the home-screen widget. Link only to the provided iOS App Store listing.

Both pages use a shared app-landing structure: hero, primary CTA, feature grid, “how it works” strip, and a restrained footer linking back to the portfolio and contact page. App-specific color tokens keep the pages distinct.

## Assets

Copy the current HitQuiz and Dagens Ord app icons from their local repositories into the personal website asset directory. Use existing personal-website assets for older projects. Do not invent app screenshots; the new pages remain polished and accurate using icons, typography, color, and feature content until screenshots are explicitly selected.

## Technical shape

- Add a reusable `AppLandingPage`/feature section pattern for the two new app pages.
- Add routes and route exports for `/hitquiz` and `/dagens-ord`.
- Replace the existing portfolio data and grid presentation with a typed curated project model.
- Add a portfolio-specific stylesheet/tokens rather than changing global styling for the whole website.
- Keep MUI and the existing React Router setup.
- Use external App Store links with `target="_blank"` and `rel="noopener noreferrer"`.

## Acceptance criteria

- Portfolio has a polished 3×3 desktop grid and responsive tablet/mobile layouts.
- New cards visibly use the HitQuiz and Dagens Ord icons and link to their landing pages.
- Congress Filings gets a deliberate visual treatment instead of a placeholder/random asset.
- Stock Predictor and Game Review are no longer presented as current portfolio projects.
- `/hitquiz` and `/dagens-ord` render with accurate copy and working App Store CTAs.
- Existing Skarp, Krydda, Congress, legal, Resume, About, Contact, and old compatibility routes continue to build and route.
- `npm run build` passes in `client`.
- Existing Vitest tests remain passing or any affected assertions are updated narrowly.
- No git commit or staging is performed by the agent.
