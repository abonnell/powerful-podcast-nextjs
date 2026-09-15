# powerful. the power metal podcast — Next.js frontend

A Next.js site for a power-metal podcast: episode listings driven by the show's RSS feed, per-episode YouTube embeds or audio players, and blog posts authored in a Strapi CMS and published with on-demand (ISR) revalidation.

## What this is

The frontend half of a two-repo podcast project. This app serves the public site for [powerful. the power metal podcast](https://www.powerful-podcast.com): it pulls episodes from the show's RSS feed (via [Simplecast](https://feeds.simplecast.com/sfBNnckU)), matches them to video uploads on the show's YouTube channel, and renders editorial blog posts from a Strapi backend. The content backend lives in the companion repo [powerful-podcast-strapi](https://github.com/abonnell/powerful-podcast-strapi).

It started as a personal/learning project to practice the App Router, ISR, CMS integration, and client-side UI patterns end to end, and grew into the site the show actually uses.

## Tech stack

- **Next.js 15.2.8** with the App Router, React 19, and the `src/` directory layout
- **Tailwind CSS v4** (via `@tailwindcss/postcss`; design tokens in `src/app/globals.css`)
- **ESLint 9** flat config (`eslint.config.mjs`, `next/core-web-vitals`)
- **JavaScript / JSX** with `jsconfig.json` path aliases (`@/*`, `@public/*`, `@components/*`)
- **Yarn** (`yarn.lock`)
- Data libraries: `rss-parser` (RSS parsing with `itunes:*` custom fields), `@tiptap/html` + TipTap extensions (rich-text rendering), `sanitize-html` (show-note sanitization), and the YouTube Data API v3 (video matching)

A note on dependencies: `strapi-sdk-js`, `happy-dom`, and `lorem-ipsum` are declared in `package.json` but are not yet imported anywhere in `src/`.

## Features

- **Home page** — recent episodes and blog posts, styled with the show's branding (`src/app/page.js`, `export const revalidate = 14400`)
- **Episode listings** — `/episodes` grid with client-side sort by date/title/duration (`src/components/EpisodeGrid`)
- **Blog listings** — `/blog` grid with sort by date/author and an author filter that syncs to the URL query string (`src/components/BlogGrid`, `src/components/SortableGrid`)
- **Episode pages** — embedded YouTube player when a video is matched, an HTML5 `<audio>` fallback otherwise, sanitized show notes, and Spotify / Apple / YouTube links (`src/app/episodes/[slug]/page.js`)
- **Blog pages** — TipTap JSON content from Strapi rendered to HTML, with `next/image` cover art and OpenGraph/Twitter metadata (`src/app/blog/[slug]/page.js`, `src/lib/tiptap-renderer.js`)
- **Dark mode** — persisted toggle and mobile menu in the shared navbar (`src/components/Navbar`)
- **Content APIs** — `GET /api/blogs` (transformed blog JSON), `GET /api/rss` (RSS proxy), and `POST /api/revalidate` (on-demand revalidation)
- **Share button** — copies the current URL to the clipboard (`src/components/ShareButton`)

## Architecture

- **`src/` layout** with `src/app` (routes) and `src/components`, `src/lib` organized by role; path aliases defined in `jsconfig.json`.
- **Centralized data layer** — `src/lib/data.js` is the single entry point for fetching and transforming content. It routes blog data through the Strapi client and episode data through the RSS/YouTube pipeline, so pages share one consistent shape for cards, slugs, and metadata.
- **Strapi client** — `src/lib/strapi.js` wraps Strapi's REST API with a Bearer token and a 4-hour fetch-level revalidate.
- **RSS pipeline** — `src/lib/rss.js` parses the feed with `rss-parser`, extracts per-item artwork from the raw XML, and derives stable slugs from episode titles/numbers.
- **YouTube matching** — `src/lib/youtube.js` pulls the channel's uploads playlist and matches videos to episodes by episode number, trying the title's episode number, an adjusted offset, and the feed's raw count; both slug generation (`src/lib/rss.js`) and matching apply the same offset to reconcile the feed's numbering with the show's written episode numbers. Match failures degrade gracefully to the feed artwork and audio fallback.
- **ISR + on-demand revalidation** — static pages revalidate every 4 hours, and a Strapi webhook (or Strapi lifecycle hook) calls `POST /api/revalidate` with a shared secret to regenerate `/`, `/blog`, the affected `/blog/[slug]`, and the gallery path instantly. Full setup is documented in **[REVALIDATION_SETUP.md](REVALIDATION_SETUP.md)**.
- **Hardening** — episode show notes are sanitized with `sanitize-html` before rendering; the revalidation endpoint checks a shared secret and applies a per-IP rate limit; cover/logo image errors fall back to the site logo; null/absent author fields are handled in both data transformation and sorting.

## Getting started

Prerequisites: Node.js 18.18+ and Yarn.

```bash
# 1. Install dependencies
yarn install

# 2. Configure environment variables
cp .env.example .env
# Fill in the values (see comments in .env.example, including how to
# generate the REVALIDATION_SECRET).

# 3. Run the development server
yarn dev
# -> http://localhost:3000

# 4. Production build and start
yarn build
yarn start
```

```bash
# Lint
yarn lint
```

The app fetches from Strapi, the RSS feed, and the YouTube API at build and revalidation time, so those endpoints must be reachable and the env vars set. To wire Strapi to trigger revalidation on publish/update, follow [REVALIDATION_SETUP.md](REVALIDATION_SETUP.md).

## Roadmap / known limitations

- `/about` and both `/gallery/*` routes are still the default "Under Construction" placeholders.
- The revalidation rate limiter is a simple in-memory map (max 10 requests/minute per IP), which is single-instance only — the code comments note swapping in a Redis-based limiter for production scale.
- Episode-number↔YouTube matching relies on title heuristics and a fixed offset; it is best-effort and degrades to the feed artwork/audio fallback when no match is found.
- Unused dependencies (see above) are candidates for removal.

## AI-assisted development disclosure

Parts of this codebase were produced with AI assistance and then reviewed, corrected, and integrated by hand. Hand-hardening includes: the null/absent-author edge cases in author extraction and sorting (`src/lib/strapi.js`, commit history), the `data-align`/`data-asset-id` image extension in the TipTap renderer, OpenGraph/Twitter metadata and bylines per page, the rate-limited and secret-protected revalidation endpoint, HTML sanitization before rendering show notes, image-error fallbacks in the `<Blog>`/`<Episode>` cards, and verifying every documented command and feature against the running code.