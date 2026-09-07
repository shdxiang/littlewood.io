# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

小木块/Littlewood (https://littlewood.io) — a static Chinese science site: counterintuitive questions explained with middle-school knowledge. Two articles so far: 图解 01 "为什么 1 千克的薄层水，仍可能让挡板承受 1000 吨力？" (hydrostatic pressure paradox) and 图解 02 "在太空失重，还会恐高吗？" (EVA height vertigo / visual reorientation).

- Every page is one self-contained HTML file in `public/` with all CSS, JS, and SVG inline. No build step, no dependencies, no external fonts/CDN — keep it that way (hard requirement from the original brief).
- `public/index.html` — landing page: site header, cover, 最新图解 cards, 我们怎么画 principles. A new article = a new `public/<english-slug>.html` + a card here.
- `public/hydrostatic-paradox.html`, `public/space-acrophobia.html` — the articles (02 was built by copying 01's head/CSS/JS scaffolding; keep them in sync when touching shared chrome like topbar/quicknav/reveal).
- `public/404.html`, `robots.txt`, `sitemap.xml`, `_headers`, `og-*.png` (1200×630 social previews) — add a sitemap entry + OG image for each new article.
- `wrangler.toml` — Cloudflare Worker static-assets config serving `public/`, custom domain littlewood.io.

## Commands

- Deploy: push to `main` — Cloudflare auto-deploys from the GitHub repo (`npx wrangler deploy` also works but needs auth)
- Preview locally: `npx wrangler dev` (internal links are extensionless — `/hydrostatic-paradox` — because Cloudflare 307-redirects `.html`; opening files directly in a browser works per page but cross-page links won't resolve)

## Conventions

- Keep kg (mass) vs kgf (force) strictly separated in copy — the hydrostatic article's whole point is not confusing them.
- Force-arrow colors are semantic and consistent across every figure: orange F原, purple F新, green gravity, teal normal force, blue pressure distribution. Don't reassign them.
- Article 02 (perception) uses its own set: green real gravity (same meaning), teal vestibular signal, blue visual cue, red "大脑认定的下", orange fear/alarm. Astronaut is the `#astro` / `#astro-stand` `<symbol>`-style groups in the page's hidden defs SVG.
- Chalkboard theme (2026-09): page ground is a green board (soft vignette, no frame); figures/cards are light "paper panels" pinned on it (soft shadow + tape corners on .figbox) and keep the original semantic colors. Anything drawn directly on the board is chalk-colored (text #f2efe4, yellow #e8c86a accents).
- Logo (2026-09): a figure sheet taped to the board — paper #f7f2e9, two yellow tape corners, an ink slope with a small wood block (#d9a05e/#a86f32). Same mark in favicon.svg, icon-*.png, logo.svg, index cover, 404 (blank sheet) and OG images; bump `favicon.svg?v=N` when it changes. The article's "小木块说" bubble keeps the wood-block-head character (chalk-white face).
- Numbers on the page are labeled "概念示例" (conceptual examples); don't present them as measured values.

## Editorial principles (site review, 2026-09)

- Question site, not knowledge site: every article opens with an "impossible" question and answers it; knowledge is the tool, never the topic. Titles are questions, not textbook entries.
- Two-layer articles: 快速理解 first (core logic + the interactive demo), then a `.layer-break` divider ("已经理解了？…") before the deeper half.
- Figures carry the story: figures + captions alone should convey ~70% of an article; one figure answers exactly one question; formulas support figures, not prose.
- Interactives stay deliberately simple: 1–2 variables, purpose is understanding, not simulation.
- Keep the 图解 NN series numbering and English-slug URLs (e.g. /hydrostatic-paradox); every page carries `<link rel=canonical>` + OG tags.
