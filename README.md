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

## Caching — why `vercel.json` looks the way it does

This site has **no build step**, so filenames never change. There is no
`app.a3f9c2.js`; `config.js` is always `config.js`. That makes long immutable
caching actively dangerous on code files — a returning visitor would keep the
old copy and never see a deploy.

| Path | Policy | Why |
|---|---|---|
| `/assets/brand/*` | 1 year, immutable | Images genuinely don't change under the same name |
| `/assets/css/*`, `/assets/js/*` | `max-age=0, must-revalidate` | Stable filenames — must be rechecked every load |
| `*.html` | `max-age=0, must-revalidate` | Entry point; must always be fresh |

Belt and braces: `index.html` loads its CSS and JS with a `?v=` query string.
Bump it on every CSS or JS change. See GO-LIVE.md.

**Do not add comment keys to `vercel.json`.** JSON has no comments, and
Vercel validates the file against a strict schema that rejects unknown
properties — a stray `"comment"` fails the whole deploy with
`headers[0] should NOT have additional property`. Notes go here instead.

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

**v2 (Aug 17)** — team framing replaces one-agent framing, Meet the Team
section added with a published direct line per person, specialty band added
(umbrella / recreational / condo & renters), coverage headline changed to
"Protect what's important to you.", verified carrier data wired in.

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

## Compliance holds — read before adding anything

She is a **captive agent**. Three constraints are load-bearing:

1. **Financial services are deliberately absent.** She is appointed for the
   carrier's securities arm. FINRA advertising rules generally require
   broker-dealer principal pre-approval before publication — stricter than
   insurance marketing. Nothing on this site references financial or
   investment services. Do not add any until her BD approves specific copy.
2. **No comparative or savings claims.** No "best rates", no "we shop the
   market", no "save up to". The carrier's own savings claims carry survey
   methodology footnotes; an agent site cannot make them.
3. **No carrier logo, and no lifted carrier copy.** `carrier.logo` stays
   `null` until Alyssa supplies the carrier's agent marketing guidelines.
   Their product copy is version-controlled and carries form numbers — every
   word on this site is original.

## Not in V1

Coverage sub-pages, blog, testimonials/reviews, LocalBusiness JSON-LD,
sitemap, OG image, analytics, anything financial-services. All but the last
are straightforward additions once the content gaps above are closed.

## Open with Alyssa

1. Carrier agent website/marketing guidelines — does the site need approval?
2. Is she a registered rep? Does anything need broker-dealer sign-off?
3. **Phone reconciliation.** Four numbers now exist: her direct line
   (719-657-1212), Charlene's, Jean's, the number printed on her **business
   card** (719-306-1894, not on the team list), and the one her carrier page
   publishes (719-563-9712). The card is physically in circulation. Also
   worth updating the carrier profile and Google listing to match the site —
   a name/address/phone mismatch across listings weakens local search.
4. **Email.** Three carrier-domain addresses are now published and will be
   indexed. All three die on transition. A domain with three forwarding
   addresses fixes this permanently.
5. Last names and job titles for Charlene and Jean; headshots for both.
6. Confirm the specialty list — it is inferred from her appointments, not
   her words.
7. A real paragraph in her voice for About. Her carrier bio is the identical
   boilerplate every agent on that platform gets, and her Education,
   Licenses and Awards fields are all empty.
