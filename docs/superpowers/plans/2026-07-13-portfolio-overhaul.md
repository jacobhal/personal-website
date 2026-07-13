# Personal Website Portfolio Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the stale portfolio gallery with a polished responsive 3×3 product grid and add accurate branded landing pages for HitQuiz and Dagens Ord.

**Architecture:** Keep the existing React Router and MUI stack. Add a reusable app-landing shell driven by page-specific theme/content data, and replace the portfolio’s image-only hover gallery with semantic project cards that use real app icons and focused project metadata. Preserve existing legal, data, resume, contact, and compatibility routes.

**Tech Stack:** React 18, TypeScript, React Router 6, MUI, Sass, React Helmet, Vitest, Testing Library, Vite.

---

## File map

Create:

- `client/src/components/AppLandingPage.tsx` — shared app marketing layout with hero, CTA, feature grid, how-it-works section, and footer.
- `client/src/components/AppLandingPage.scss` — shared landing-page motion/accessibility helpers.
- `client/src/views/HitQuiz/HitQuiz.tsx` and `client/src/views/HitQuiz/index.ts` — HitQuiz content/theme wrapper.
- `client/src/views/DagensOrd/DagensOrd.tsx` and `client/src/views/DagensOrd/index.ts` — Dagens Ord content/theme wrapper.
- `client/src/views/Portfolio/components/ProjectCard.tsx` — semantic card for curated work.
- `client/src/views/Portfolio/portfolioData.ts` — typed project data and card variants.
- `client/src/views/Portfolio/portfolioData.test.ts` — content regression tests for the curated set.
- `client/src/assets/images/hitquiz_icon.png` — copied from the HitQuiz repository.
- `client/src/assets/images/dagens_ord_icon.png` — copied from the Dagens Ord repository.

Modify:

- `client/src/routes.tsx` — register `/hitquiz` and `/dagens-ord`.
- `client/src/views/Portfolio/Portfolio.tsx` — use curated data and new card grid.
- `client/src/styles/portfolio.scss` — replace old hover-grid styles with the new responsive product-studio grid.
- `client/src/styles/index.scss` — import shared landing styles only if Sass import order requires it.

Leave unchanged:

- Existing Skarp/Krydda pages and legal pages.
- Existing Congress data fetching and formatting.
- Existing `/stockpredictor` route for old-link compatibility, even though it leaves the visible portfolio.

## Task 1: Add real app icon assets

**Files:**

- Create: `client/src/assets/images/hitquiz_icon.png`
- Create: `client/src/assets/images/dagens_ord_icon.png`

- [ ] Copy `assets/icon/app_icon.png` from `/Users/jacob/Git/hitquiz-app` into the personal-website asset directory.
- [ ] Copy `assets/icon/app_icon.png` from `/Users/jacob/Git/daily-words-app` into the personal-website asset directory as `dagens_ord_icon.png`.
- [ ] Verify both files are readable PNGs and retain their source dimensions.

Run:

```bash
sips -g pixelWidth -g pixelHeight client/src/assets/images/hitquiz_icon.png client/src/assets/images/dagens_ord_icon.png
```

Expected: both files report square app-icon dimensions without conversion errors.

## Task 2: Build the shared landing-page shell

**Files:**

- Create: `client/src/components/AppLandingPage.tsx`
- Create: `client/src/components/AppLandingPage.scss`

- [ ] Define exported types for `AppLandingPageProps`, `AppFeature`, and `AppStep`.
- [ ] Implement a page shell that accepts `theme` tokens (`background`, `surface`, `border`, `accent`, `secondaryAccent`, `text`, `muted`), app identity, hero copy, CTA URL/label, feature list, and step list.
- [ ] Render `NavBar noImage`, `Helmet`, an icon-led hero, one primary external CTA, feature cards, a three-step “How it works” section, and a footer with Portfolio/Contact links.
- [ ] Apply `target="_blank"` and `rel="noopener noreferrer"` to App Store links.
- [ ] Add `prefers-reduced-motion` handling for reveal/hover transitions.
- [ ] Keep heading hierarchy semantic: one `h1`, section headings as `h2`, feature titles as `h3`.

The component’s key interface should be:

```tsx
export interface AppLandingPageProps {
    appName: string
    icon: string
    eyebrow: string
    title: string
    description: string
    appStoreUrl: string
    appStoreLabel: string
    theme: AppLandingTheme
    features: AppFeature[]
    steps: AppStep[]
}
```

The visual language should be dark/editorial rather than generic MUI defaults: large display heading, restrained borders, strong color field behind the icon, staggered but subtle section entrance, and visible focus states.

## Task 3: Add HitQuiz landing page

**Files:**

- Create: `client/src/views/HitQuiz/HitQuiz.tsx`
- Create: `client/src/views/HitQuiz/index.ts`

- [ ] Pass the HitQuiz icon and App Store URL `https://apps.apple.com/se/app/hitquiz/id6761611878` into `AppLandingPage`.
- [ ] Use the HitQuiz theme: near-black background, Spotify green primary accent, gold scoring accent, muted slate surfaces.
- [ ] Use accurate hero copy: `The party music game where everyone shouts the answer.`
- [ ] Add features for host-led play, artist/title/year scoring, closest-year bonus, random duels, and free song bundles with optional expansion pack.
- [ ] Add steps: `Play a clip`, `Shout the answer`, `Score the room`.
- [ ] Set Helmet title/description specific to HitQuiz and mention 2–12 player party play only where it matches the current listing.

## Task 4: Add Dagens Ord landing page

**Files:**

- Create: `client/src/views/DagensOrd/DagensOrd.tsx`
- Create: `client/src/views/DagensOrd/index.ts`

- [ ] Pass the Dagens Ord icon and App Store URL `https://apps.apple.com/se/app/dagens-ord/id6761329508` into `AppLandingPage`.
- [ ] Use the Dagens Ord theme: deep brown background, cream typography, amber/gold primary accent, dark cocoa surfaces.
- [ ] Use accurate hero copy: `One unusual Swedish word. Every day.`
- [ ] Add features for daily word selection, word class/definition/synonyms/example sentence, synonym quiz, history/progress, and home-screen widget.
- [ ] Add steps: `Meet today’s word`, `Guess the synonym`, `Build your vocabulary`.
- [ ] Set Helmet title/description specific to Dagens Ord and keep language claims accurate to the current App Store listing.

## Task 5: Replace portfolio gallery with curated project grid

**Files:**

- Create: `client/src/views/Portfolio/portfolioData.ts`
- Create: `client/src/views/Portfolio/components/ProjectCard.tsx`
- Create: `client/src/views/Portfolio/portfolioData.test.ts`
- Modify: `client/src/views/Portfolio/Portfolio.tsx`
- Modify: `client/src/styles/portfolio.scss`

- [ ] Define a typed `PortfolioProject` model with `id`, `title`, `kind`, `description`, `route`, `image`, `accent`, `status`, and optional `external` flag.
- [ ] Add exactly nine visible projects in this order: Skarp, Krydda, HitQuiz, Dagens Ord, Congress Filings, React Playground, Corona Dashboard, Restocker, Complete Git Guide.
- [ ] Remove Stock Predictor and Game Review from this data set without deleting their old route/component files.
- [ ] Use app icons for Skarp, Krydda, HitQuiz, and Dagens Ord; use existing artwork for the remaining projects; use a deliberate finance/data artwork for Congress rather than a random placeholder.
- [ ] Render cards as links/buttons with the title, type label, short description, and action label visible without hover.
- [ ] Make the desktop grid three columns, tablet two columns, and mobile one column. Keep equal card heights within each row.
- [ ] Add visual depth: per-card accent glow, icon treatment, gradient wash, hover lift, and a modest reveal of secondary metadata. Keep all functionality available to keyboard focus and touch users.
- [ ] Update the portfolio hero copy to present selected work as current products and experiments, not “projects and courses” with a stale Udemy alert.
- [ ] Keep Complete Git Guide as the final card with a course label rather than treating it as an active product.

Regression tests must assert the curated list and ensure stale entries are absent:

```ts
expect(projects.map((project) => project.title)).toEqual([
    'Skarp',
    'Krydda',
    'HitQuiz',
    'Dagens Ord',
    'Congress Filings',
    'React Playground',
    'Corona Dashboard',
    'Restocker',
    'Complete Git Guide',
])
expect(projects.some((project) => project.title === 'Stock predictor')).toBe(false)
expect(projects.some((project) => project.title === 'Game review website')).toBe(false)
```

## Task 6: Register routes and verify integration

**Files:**

- Modify: `client/src/routes.tsx`
- Modify: `client/src/views/appLegalLinks.test.tsx` only if route-level assertions need extension.

- [ ] Import `HitQuiz` and `DagensOrd` from their index files.
- [ ] Register `/hitquiz` and `/dagens-ord` before the catch-all route.
- [ ] Verify existing `/skarp`, `/krydda`, `/congress`, `/resume`, `/about`, `/contact`, and old `/stockpredictor` route behavior remains unchanged.
- [ ] Confirm external card links use a new tab while internal app pages use React Router-compatible navigation or normal internal hrefs consistent with the existing site.

## Task 7: Run quality checks and browser evidence

- [ ] Run `npm test -- --run` from `client`.
- [ ] Run `npm run build` from `client`.
- [ ] Run `npm start` from `client` and inspect `/portfolio`, `/hitquiz`, and `/dagens-ord` at desktop and mobile widths.
- [ ] Capture screenshots for the portfolio desktop 3×3 grid, portfolio mobile layout, HitQuiz hero/features, and Dagens Ord hero/features.
- [ ] Check keyboard focus, external CTA behavior, readable contrast, reduced-motion behavior, and no horizontal overflow.
- [ ] Run `git diff --check` and scan changed text files for mojibake markers (`Ã`, `Â`, `â`, `�`).
- [ ] Do not stage, commit, push, or alter unrelated existing worktree changes.
