# Poppell Insurance Agency — V1

Personal-brand site for Alyssa Poppell, Colorado Springs. Static HTML, no build
step, no dependencies. GitHub → Vercel, same pattern as GetProyTech.

```
index.html
vercel.json              cleanUrls, asset caching
assets/
  css/styles.css
  js/config.js           ← every client + carrier fact lives here
  js/main.js             ← hydration, artwork, motion
  brand/                 her banner, card, and treated headshot
GO-LIVE.md               19 steps to GitHub + Vercel + domain
BRANDING-SWAP.md         read this before the carrier change
```

## Deploy

1. New GitHub repo, push this folder.
2. Vercel → Import → framework preset **Other**, no build command, output
   directory `.`.
3. Add the domain in Vercel, point DNS.

There is no build step. Editing `config.js` and pushing is the whole update
loop.

## Design

Palette sampled pixel-by-pixel from her banner and card, not guessed:

| Token | Hex | Where it came from |
|---|---|---|
| `--paper` | `#F5F1EC` | the cream ground of both assets |
| `--sage` | `#697061` | the icon circles and logo band |
| `--ink` | `#2F352B` | the POPPELL wordmark |
| `--clay` | `#A97B52` | the "OWNER" text, darkened for contrast |
| `--blush` | `#E4D3C4` | the script and floral tones |

Type: Bodoni Moda (display, matches her distressed Scotch wordmark), Jost
(body, 1920s geometric that sits with the vintage-western feel), Parisienne
(the script accent, used once in the footer).

**Signature element: the ridgeline.** A hand-authored Colorado range with three
pines and a heart, drawn from the mountains in her logo, flanked by hairline
rules and stars — the same `rule / mark / rule` rhythm her business card uses
between coverage items. It draws itself stroke by stroke as each section
enters view, so the structure of the page is the skyline she works under.

**The portrait is an arch, not a rectangle.** The rounded doorway shape runs
through adobe and mission architecture across the Front Range, and it puts her
photo in her own region's vocabulary rather than in a stock headshot box. The
sun from her banner turns slowly behind it on a 90-second cycle.

**Coverage is editorial rows, not a card grid.** Four cards in a row is the
most templated pattern on the web. Full-width rows with oversized display type
read like a printed index, and the icon draws itself when the reader enters
the row, so the artwork responds to a person rather than sitting there.

## Motion

| Where | What |
|---|---|
| Hero headline | Each word rides up out of its own mask, staggered 45ms |
| Hero banner | Settles from 1.06 scale on load, then parallaxes at 0.22x |
| Creed band | Infinite marquee, pauses on hover |
| Coverage rows | Tint sweeps from the left, clay rule grows, label shifts, icon strokes redraw on every entry |
| Ridgeline | Peaks draw, then pines, then the heart fades in; the flanking rules scale out from the centre |
| Arch | Clips upward from its own base; sun turns continuously behind |
| Signature | "Protect what matters." writes itself left to right |
| Buttons | Clay fill wipes up from the bottom edge |

All of it is disabled under `prefers-reduced-motion` — verified, not assumed.

**One trap worth knowing.** The signature's reveal clip lives on an inner
`<span>`, never on the `<p>` the IntersectionObserver watches. A fully
clipped element reports zero intersection area, so it can never trigger the
class that would unclip it. That deadlock cost a debugging pass; don't
reintroduce it by moving the clip up a level.

## Quality floor

- Responsive to 375px
- Visible keyboard focus on every interactive element
- Skip link, semantic landmarks, 44px+ tap targets
- `prefers-reduced-motion` honoured globally
- No console errors (the Google Fonts 403 seen in a sandboxed container does
  not occur on Vercel)

## Open items — needed from the client

Anything unverified renders a visible amber **NEEDS** marker on the page rather
than silently disappearing. Current markers:

| Item | Status |
|---|---|
| Jotform URL | **Done.** `utm_id` stripped — those params were dashboard tracking and would have tagged every visitor to that campaign. |
| Headshot | **Done.** Studio grey knocked out, replaced with brand blush. Source kept at `assets/brand/`. |
| About copy | **Draft in place.** Contains zero biographical facts by design — approach only, so nothing can be wrong. Needs her approval or rewrite. |
| Office hours | **Done.** Mon–Fri 8:30–5:30, weekends closed. Source: her Farmers page, 2026-08-15. |
| **Domain** | Still open — `site.domain`. |
| **Phone number** | Two conflicting numbers on file. See BRANDING-SWAP.md. |
| **Email** | Still a carrier address that dies on transition. See BRANDING-SWAP.md. |

Her Farmers About section is carrier boilerplate with Education, Awards and
Licenses all blank, so there was nothing there worth reusing.

## Not in V1

Coverage sub-pages, blog, testimonials/reviews, LocalBusiness JSON-LD,
sitemap, OG image, analytics. All straightforward additions once the content
gaps above are closed.
