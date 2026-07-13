# Personal Website Refresh Design

## Goal

Bring the Home, Resume, About, and Contact pages up to the same standard as the refreshed portfolio while keeping the site minimal, personal, and easy to navigate.

## Direction

Use a quiet dark editorial system: warm near-black surfaces, a restrained lime accent, mono labels for structure, and large but controlled headings. Replace the older full-screen stock-photo jumbotrons with purposeful page layouts that show context before asking the visitor to click.

The portfolio remains the visual anchor. The four supporting pages reuse its tone and navigation without duplicating the portfolio grid.

## Page changes

- Home: personal introduction, selected focus areas, current products, and direct portfolio/contact actions.
- Resume: clear introduction plus Swedish and English PDF download cards with concise supporting context.
- About: short first-person story, working principles, and organized links for GitHub, LinkedIn, and the thesis.
- Contact: friendly invitation, useful context beside the form, and the existing mail submission behavior preserved.

## Shared system

Create a `PersonalPageShell` for the non-portfolio pages. It owns the page background, navigation, hero grid, responsive content container, decorative grid, and footer. Page content remains in each route so the shell stays presentational and easy to reuse.

Use CSS variables for background, surface, border, text, muted text, and accent colors. Keep visible focus states, semantic headings, mobile stacking, and reduced-motion behavior.

## Guardrails

- Preserve all existing routes, PDF assets, external URLs, and contact submission logic.
- Do not invent employment history, client claims, availability, or contact details.
- Keep the older `MainJumbotron` available for compatibility pages outside the main navbar.
- Verify full tests, production build, route health, diff whitespace, and changed source encoding.
