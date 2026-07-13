# Personal Website Site-Wide Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Refresh the four legacy navbar pages into a cohesive, minimal dark editorial personal website.

**Architecture:** Add one shared `PersonalPageShell` and one shared stylesheet for page-level tokens, hero structure, cards, links, and responsive behavior. Keep page-specific copy and functional behavior inside Home, Resume, About, and Contact. Update the navbar with consistent semantics and active/focus affordances without changing route destinations.

**Tech Stack:** React 18, TypeScript, React Router 6, MUI, Sass, React Helmet, Vitest.

---

### Task 1: Lock the refreshed page contract with tests

**Files:**

- Create: `client/src/views/personalPages.test.tsx`

- [ ] Add static-render tests asserting Home exposes `See selected work`, Resume exposes both CV download labels, About preserves GitHub/LinkedIn/thesis URLs, and Contact renders `contact-form` with the message field.
- [ ] Run `npm test -- --run src/views/personalPages.test.tsx` and confirm the new copy assertions fail against the legacy pages.

### Task 2: Build the shared personal page shell

**Files:**

- Create: `client/src/components/PersonalPageShell.tsx`
- Create: `client/src/styles/personalPages.scss`

- [ ] Define shell props for `eyebrow`, `title`, `description`, optional `actions`, and page children.
- [ ] Render `NavBar noImage`, a semantic `main`, a compact hero section with the decorative grid, and a consistent footer.
- [ ] Add shared classes for page cards, accent labels, link buttons, field surfaces, focus states, responsive two-column layouts, and reduced motion.

### Task 3: Refresh Home

**Files:**

- Modify: `client/src/views/Home/Home.tsx`

- [ ] Replace the old `MainJumbotron` and dense tool inventory with a personal intro, two links, a current-project signal card, and three concise focus cards.
- [ ] Keep the language grounded in app/web development and curiosity without adding unsupported professional claims.

### Task 4: Refresh Resume

**Files:**

- Modify: `client/src/views/Resume/Resume.tsx`

- [ ] Replace the full-screen escalator hero with a compact CV introduction and two accessible PDF download cards.
- [ ] Preserve the existing Swedish and English PDF imports and download filenames.

### Task 5: Refresh About

**Files:**

- Modify: `client/src/views/About/About.tsx`

- [ ] Replace the three giant buttons with a first-person introduction, three principles, and organized external-link cards.
- [ ] Preserve the existing GitHub, LinkedIn, and KTH thesis URLs with safe external link attributes.

### Task 6: Refresh Contact without changing submission behavior

**Files:**

- Modify: `client/src/views/Contact/Contact.tsx`

- [ ] Keep the current axios submission, loading state, success state, and error state.
- [ ] Move the form into a polished surface beside a short invitation and “good fit” notes.
- [ ] Preserve required fields, helper text, and the `contact-form` identifier.

### Task 7: Make the shared navigation feel intentional

**Files:**

- Modify: `client/src/components/NavBar/NavBar.tsx`
- Modify: `client/src/components/NavBar/NavBar.scss`

- [ ] Add a shared navbar class, accessible menu button label, active route treatment, and visible keyboard focus treatment.
- [ ] Keep every existing navbar destination unchanged.

### Task 8: Verify the refresh

- [ ] Run `npm test -- --run` from `client`.
- [ ] Run `npm run build` from `client`.
- [ ] Check `/`, `/resume`, `/about`, `/portfolio`, and `/contact` return 200 from the local Vite server.
- [ ] Run `git diff --check` and scan changed source text for mojibake markers.
- [ ] Confirm no horizontal overflow or missing assets at desktop and mobile widths using the running localhost app.
- [ ] Do not stage, commit, push, branch, or alter unrelated worktree changes.
