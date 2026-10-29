# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Littlewood (https://littlewood.io; the site is branded only “Littlewood” since 2026-10-29, the old name 小木块 is gone from pages, OG images and logo.svg) — a static Chinese science site: “impossible”-looking science questions, answered with a few figures (tagline “奇怪的答案，只是少画了一张图”). Two 图解 articles plus one 3D 示意 page (`/riemann-hypothesis`, three.js, self-hosted under `public/vendor/`). 图解 01 "为什么 1 千克的薄层水，仍可能让挡板承受 1000 吨力？" (hydrostatic pressure paradox) and 图解 02 "在太空失重，还会恐高吗？" (EVA height vertigo / visual reorientation).

- Plain static files in `public/`, no build step. Self-hosted libraries are fine (put them under `public/`, load only on the page that needs them, keep the CSP in `_headers` at `self`; the only outside hosts are Cloudflare Web Analytics, which Cloudflare injects: `static.cloudflareinsights.com` in script-src, `cloudflareinsights.com` in connect-src). Shared code lives in a few files (2026-09-07, replaced the old "every page self-contained" rule):
  - `site.css` — tokens, board background, fonts, focus, reduced-motion. Every page links it.
  - `article.css` + `article.js` — everything the 图解 pages share (topbar, hero/conflict block, h2 numbering, figbox, formula, key, demo controls, compact-details, footer, scroll reveal). Articles link both (`article.css?v=3`, `article.js?v=2`); page-specific colors and demo logic stay in the page's own `<style>`/`<script>`. Simplified 2026-10-29: no quicknav, reading progress, back-to-top, mascot bubble, article meta, layer-break or 误解排雷 section any more — don't add them back.
  - `mark.svg` — the logo mark as `<symbol id="mark">`; pages draw it with `<svg viewBox="10 12 82 74"><use href="./mark.svg#mark"/></svg>` (404 uses the absolute `/mark.svg` because it serves at any path). Figures/SVG stay inline in the page.
  - Shared files are cached 7 days via `_headers`; bump the `?v=N` on the `<link>`/`<script>` tags in all pages when a shared file changes.
- `public/index.html` — landing page (2026-10-29 redesign): deliberately minimal — a full-viewport hero holding only the brand name and the one-line tagline (no topbar, no sub-copy, no buttons) over a 2D-canvas dot-field terrain that echoes the Riemann page (valley = critical line, gold points in it; inline script, no three.js, pauses when hidden/off-screen, one static frame under reduced-motion), then a 3-column `.grid` of article cards (`a.card.glass`: SVG thumb + series tag + the question as `h3`, nothing else), no footer. Don't add sections, hooks, durations or links back; the question titles are the copy. A new article = a new `public/<english-slug>.html` + a card here (newest first).
- `public/hydrostatic-paradox.html`, `public/space-acrophobia.html` — the articles (both use `article.css`/`article.js`; new article = copy 02's HTML, keep the `<link>`/`<script>` tags).
- `public/404.html`, `robots.txt`, `sitemap.xml`, `_headers`, `og-*.png` (1200×630 social previews) — add a sitemap entry + OG image for each new article.
- `wrangler.toml` — Cloudflare Worker static-assets config serving `public/`, custom domain littlewood.io.

## Commands

- Deploy: push to `main` — Cloudflare auto-deploys from the GitHub repo (`npx wrangler deploy` also works but needs auth)
- Preview locally: `npx wrangler dev` (internal links are extensionless — `/hydrostatic-paradox` — because Cloudflare 307-redirects `.html`; opening files directly in a browser works per page but cross-page links won't resolve)

## Conventions

- Keep kg (mass) vs kgf (force) strictly separated in copy — the hydrostatic article's whole point is not confusing them.
- Force-arrow colors are semantic and consistent across every figure: orange F原 `#ff7a2f`, purple F新 `#9775fa`, green gravity `#3fcf6a`, teal normal force `#22c3dd`, blue pressure distribution `#4dabf7`. Don't reassign them.
- Article 02 (perception) uses its own set: green real gravity (same meaning), teal vestibular signal, blue visual cue, red "大脑认定的下", orange fear/alarm. Astronaut is the `#astro` / `#astro-stand` `<symbol>`-style groups in the page's hidden defs SVG.
- Dark theme (2026-10-29, replaced the chalkboard): page ground is deep navy-black `#050510` with two faint radial glows (mint top-left, lavender bottom-right); panels are glass — `rgba(8,8,20,.75)` + `blur(8px)` + 1px `rgba(120,140,255,.25)` border (`.glass` in `site.css`; `article.css` applies it to `.card/.figbox/...`). Text is lavender white `#e0e0ff` (muted `#b8c0e0`, dim `#8899cc`), headings `#aaccff`, accents gold `#ffd966` (titles, CTA, numbers) and mint `#66ffcc` (links, series tag, answers). Token names in `site.css` kept their old chalkboard names (`--chalk`, `--yellow`, `--board`) so pages didn't change. SVG figures are drawn on the dark panel too (`.figbox svg` / `.item svg.thumb` background `--panel-solid` `#0d0d24`): paper `#0d0d24`, ink text `#e0e0ff`, greys `#a3acbd`/`#9aa4b8`/`#8f9bb3`, light objects (astronaut, boards, cards) stay light, and the semantic colors are the brightened set — green `#3fcf6a`, teal `#22c3dd`, blue `#4dabf7`, red `#ff6b6b`, orange `#ff7a2f`, purple `#9775fa`, water `#4aa3ff` / `rgba(74,163,255,x)`. Use these in new figures and legend swatches. No tape corners, no dashed rules, no rotation — clean panels like the Riemann page.
- Logo (2026-10-29): a dark rounded tile (`#0d0d24`, lavender border) with a gold slope and the small wood block (#d9a05e/#a86f32). Same mark in favicon.svg, icon-*.png, logo.svg, index cover, 404 (tile with a chalk-grey face) and OG images; bump `favicon.svg?v=N` + `.png?v=N` when it changes. The wood-block mascot bubble was removed from the articles on 2026-10-29. OG PNGs are rendered from HTML with the headless shell (1200×630): dark bg, glass panel, mint eyebrow, gold headline, lavender subtitle.
- Copy no longer says “用中学知识” (dropped 2026-10-29): the site tagline is “奇怪的答案，只是少画了一张图” (2026-10-29; the word 反直觉 was dropped from all copy too); don't reintroduce the middle-school framing or 反直觉 in titles, meta or OG images.
- Numbers on the page are labeled "概念示例" (conceptual examples); don't present them as measured values.

## Editorial principles (site review, 2026-09)

- Question site, not knowledge site: every article opens with an "impossible" question and answers it; knowledge is the tool, never the topic. Titles are questions, not textbook entries.
- One layer only (2026-10-29): hero question + 猜猜/答案, 2–3 numbered sections with the figures that carry the logic, the interactive demo (☆), then 最后只记住这两行 (∑). The deeper explanations, misconception lists and most `<details>` were cut; keep new articles at this length (~5 figures).
- Figures carry the story: figures + captions alone should convey ~70% of an article; one figure answers exactly one question; formulas support figures, not prose.
- Interactives stay deliberately simple: 1–2 variables, purpose is understanding, not simulation.
- Keep the 图解 NN series numbering and English-slug URLs (e.g. /hydrostatic-paradox); every page carries `<link rel=canonical>` + OG tags.
