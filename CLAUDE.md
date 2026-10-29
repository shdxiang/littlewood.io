# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

小木块/Littlewood (https://littlewood.io) — a static Chinese science site: counterintuitive questions explained with middle-school knowledge. Two 图解 articles plus one 3D 示意 page (`/riemann-hypothesis`, three.js, self-hosted under `public/vendor/`). 图解 01 "为什么 1 千克的薄层水，仍可能让挡板承受 1000 吨力？" (hydrostatic pressure paradox) and 图解 02 "在太空失重，还会恐高吗？" (EVA height vertigo / visual reorientation).

- Plain static files in `public/`, no build step. Self-hosted libraries are fine (put them under `public/`, load only on the page that needs them, keep the CSP in `_headers` at `self`; the only outside hosts are Cloudflare Web Analytics, which Cloudflare injects: `static.cloudflareinsights.com` in script-src, `cloudflareinsights.com` in connect-src). Shared code lives in a few files (2026-09-07, replaced the old "every page self-contained" rule):
  - `site.css` — tokens, board background, fonts, focus, reduced-motion. Every page links it.
  - `article.css` + `article.js` — everything the 图解 pages share (topbar, hero, quicknav, figbox, demo controls, reveal/progress/backtop). Articles link both; page-specific colors and demo logic stay in the page's own `<style>`/`<script>`.
  - `mark.svg` — the logo mark as `<symbol id="mark">`; pages draw it with `<svg viewBox="10 12 82 74"><use href="./mark.svg#mark"/></svg>` (404 uses the absolute `/mark.svg` because it serves at any path). Figures/SVG stay inline in the page.
  - Shared files are cached 7 days via `_headers`; bump the `?v=N` on the `<link>`/`<script>` tags in all pages when a shared file changes.
- `public/index.html` — landing page: site header, cover, 最新图解 cards, 我们怎么画 principles. A new article = a new `public/<english-slug>.html` + a card here.
- `public/hydrostatic-paradox.html`, `public/space-acrophobia.html` — the articles (both use `article.css`/`article.js`; new article = copy 02's HTML, keep the `<link>`/`<script>` tags).
- `public/404.html`, `robots.txt`, `sitemap.xml`, `_headers`, `og-*.png` (1200×630 social previews) — add a sitemap entry + OG image for each new article.
- `wrangler.toml` — Cloudflare Worker static-assets config serving `public/`, custom domain littlewood.io.

## Commands

- Deploy: push to `main` — Cloudflare auto-deploys from the GitHub repo (`npx wrangler deploy` also works but needs auth)
- Preview locally: `npx wrangler dev` (internal links are extensionless — `/hydrostatic-paradox` — because Cloudflare 307-redirects `.html`; opening files directly in a browser works per page but cross-page links won't resolve)

## Conventions

- Keep kg (mass) vs kgf (force) strictly separated in copy — the hydrostatic article's whole point is not confusing them.
- Force-arrow colors are semantic and consistent across every figure: orange F原, purple F新, green gravity, teal normal force, blue pressure distribution. Don't reassign them.
- Article 02 (perception) uses its own set: green real gravity (same meaning), teal vestibular signal, blue visual cue, red "大脑认定的下", orange fear/alarm. Astronaut is the `#astro` / `#astro-stand` `<symbol>`-style groups in the page's hidden defs SVG.
- Dark theme (2026-10-29, replaced the chalkboard): page ground is deep navy-black `#050510` with two faint radial glows (mint top-left, lavender bottom-right); panels are glass — `rgba(8,8,20,.75)` + `blur(8px)` + 1px `rgba(120,140,255,.25)` border (`.glass` in `site.css`; `article.css` applies it to `.card/.figbox/...`). Text is lavender white `#e0e0ff` (muted `#b8c0e0`, dim `#8899cc`), headings `#aaccff`, accents gold `#ffd966` (titles, CTA, numbers) and mint `#66ffcc` (links, series tag, answers). Token names in `site.css` kept their old chalkboard names (`--chalk`, `--yellow`, `--board`) so pages didn't change. SVG figures keep their light paper (`.figbox svg` / `.item svg.thumb` get `--fig-paper` `#f3f1ec` behind them) and their original semantic colors; a thumbnail that paints its own dark background gets `class="thumb dark"`. No tape corners, no dashed rules, no rotation — clean panels like the Riemann page.
- Logo (2026-10-29): a dark rounded tile (`#0d0d24`, lavender border) with a gold slope and the small wood block (#d9a05e/#a86f32). Same mark in favicon.svg, icon-*.png, logo.svg, index cover, 404 (tile with a chalk-grey face) and OG images; bump `favicon.svg?v=N` + `.png?v=N` when it changes. The article's "小木块说" bubble keeps the wood-block-head character. OG PNGs are rendered from HTML with the headless shell (1200×630): dark bg, glass panel, mint eyebrow, gold headline, lavender subtitle.
- Numbers on the page are labeled "概念示例" (conceptual examples); don't present them as measured values.

## Editorial principles (site review, 2026-09)

- Question site, not knowledge site: every article opens with an "impossible" question and answers it; knowledge is the tool, never the topic. Titles are questions, not textbook entries.
- Two-layer articles: 快速理解 first (core logic + the interactive demo), then a `.layer-break` divider ("已经理解了？…") before the deeper half.
- Figures carry the story: figures + captions alone should convey ~70% of an article; one figure answers exactly one question; formulas support figures, not prose.
- Interactives stay deliberately simple: 1–2 variables, purpose is understanding, not simulation.
- Keep the 图解 NN series numbering and English-slug URLs (e.g. /hydrostatic-paradox); every page carries `<link rel=canonical>` + OG tags.
