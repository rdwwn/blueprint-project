# Mark 11 — Landing + Mission + Search + Detail (current)

The live demo for Mark 11 is this folder. It's a full Next.js app — run it
directly.

## What Mark 11 is

The Blueprint Project's **home + mission + search + opportunity detail** site,
built from Mark 10 with a seventh round applied: search facets are now
**dynamic** (every category/field/cost/format count shrinks live as you filter,
Amazon-style), the desktop sidebar was replaced by a **top filter bar**, the
hero got the 21st.dev-style **rolling-word headline**, **dark mode was
removed** in favor of a single polished light theme, and the trust story was
expanded into a full **"Blueprint Promise"** section on both home and About.
Product spec: `../PRD.md` (v0.11).

## What changed vs Mark 10

- **Dynamic facet counts — search** — every filter option now shows a live
  count computed against the *current* pool, excluding that facet's own
  filter. Press **Online** and Certificates 88 → 72, Scholarships 32 → 11,
  Engineering 30 — the numbers all drop together. Pure client-side
  `useMemo` over the 514-record dataset.
- **Top filter bar (desktop)** — the sidebar is gone; a single bar above the
  results holds **Category** and **Field** dropdowns (with counts), **Cost /
  Format / Sort** segmented pills (with counts), and **Reset**. Full-width
  results. Mobile keeps the bottom sheet, now with the same live counts.
- **Top searches fixed + faceted** — the "no results" bug was a `matches()`
  query that wasn't lowercased, so capitalized tiles (Summer, Competition…)
  always returned 0. Fixed (query lowercased + word-boundary matching) and the
  tiles now deep-link to real facets: `?cat=Summer Program`, `?cost=free`,
  `?field=CS & Engineering`, `?sort=deadline`, `?q=…`. Dropped `1-on-1` and
  `Selective` (no data behind them).
- **Animated hero** — new `src/components/ui/animated-hero.tsx` (adapted from
  the 21st.dev `animated-hero` component by tommyjepsen): "Stop scrolling."
  + a spring-rolling stack of "Start **applying.** / interning. /
  competing. / researching. / learning." words, badge, subtext, and
  Browse / How-it-works CTAs. Runs on `motion/react` (no new deps) and is
  reduced-motion safe. Grid backdrop contrast bumped (primary-tinted, brighter).
- **Dark mode removed** — no toggle, no `next-themes`, no `.dark` variables,
  no `dark:` classes. One polished light theme (paper `#FAF9F4`, ink
  `#1B2A4A`, blue `#1E58D6`, teal `#0F766E`). `theme-provider.tsx` and
  `theme-toggle.tsx` deleted; `next-themes` dropped from dependencies.
- **Trust — "The Blueprint Promise"** — home `trust-strip` is now a 3-pillar
  block (Free forever / Verified by hand / Private always) linking to About;
  `/mission` promises expanded into 3 detailed cards with bullet points
  (Free forever · Unbiased algorithms · 100% data privacy).
- **Curated images** — the featured carousel picks photos by the program's
  actual field (space → earth-from-orbit, robotics → robot arm, finance →
  market, medicine → lab, law → capitol, journalism → press) via a
  `FIELD_IMAGES` map; bento cover swapped to a studying-students shot.
- **Search header** — a drafting-sheet block (grid + registration corners +
  `SHEET 02 · SEARCH` / `SCALE 1:1` labels) frames the search bar, with a
  **popular-fields quick-picks** row beneath it.

## Sections

Home: floating folding pill nav → centered hero (500+ badge, rolling
"Start applying…" headline, CTA row, vanish search bar, icon-tile top
searches, drafting-sheet backdrop) → gradient seam → 6-card magnified bento →
**dark showcase band** with wavy paper transition (real interactive calendar)
→ featured carousel (field-matched photos) → trust pillars → Programs across
the US (data-driven density map) → **teal contribute band** with waves →
footer.

Also: `/mission` (About, with the full Promise), `/search` (top filter bar +
live facet counts), and `/opportunity/<slug>` (detail pages for all 514
programs).

## How to run

```
cd ../Mark 11
npm run dev
```

Then open http://localhost:3000 (or pass `-p` for a custom port).

## Stack

Next.js 16 + React 19 + TypeScript + Tailwind v4 + `motion` (light-only
theme; no next-themes) + `@svg-maps/usa`. Data: 514 opportunities in
`src/data/opportunities.ts` generated from `../opp-research/merged3.json`.
Images via `images.unsplash.com`.

## Pending before public deploy

Terms of Service and Privacy Policy pages still need to be written and linked
from the footer (placeholder slots exist). The Contribute cards are stubs
("Coming soon"). The `/search` page is a live local filter but has no server
backend yet (static dataset; fine for launch). The **dashboard** (saved
roadmap, deadline countdowns, progress) is the next product phase — the
detail-page Save button is its data source (a "Soon" nav placeholder exists).
Auth/sign-up is deliberately held until the Supabase backend phase. Deferred:
richer detail-page tracking stats, real engagement numbers on the carousel,
and data-driven deadline chips in the bento (currently hardcoded).

*Mark 1 (../next-app), Mark 2, Mark 3, Mark 4, Mark 5, Mark 6, Mark 7, Mark 8,
Mark 9, and Mark 10 are prior iterations; Mark 11 is the current live design.*