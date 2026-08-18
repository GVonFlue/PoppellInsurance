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
CARRIERS.md         carrier list, adding carriers, compliance holds
```

## SEO — what's in and what isn't

**Content is static HTML.** It used to be generated at runtime from
`config.js`. That made the carrier swap a one-file edit, but the served
document was an empty shell — Google renders JS on a delayed second pass, and
most citation scrapers, directory crawlers and social bots never run it at
all. NAP data is exactly what those exist to harvest. A non-JS fetch of this
page now returns **691 words** including every phone number, the full
address, all team members and every coverage term.

**In place:**

| Item | Detail |
|---|---|
| `InsuranceAgency` JSON-LD | Static in `<head>`. NAP, hours, `areaServed`, `hasMap` via the Google CID, three employees, 7-item offer catalog, `knowsAbout` |
| Title & description | Service and city front-loaded, not brand-first |
| H1 | Carries "Colorado insurance" naturally |
| Service area | Statewide Colorado in copy and schema; Colorado Springs kept as the physical anchor |
| Section copy | Location and service terms woven into ledes, not stuffed |
| Open Graph + Twitter | Full set; absolute URLs injected once `site.domain` is set |
| `robots.txt` | Allows all |
| `sitemap.xml` | Template — **contains `REPLACE-WITH-DOMAIN`, must be edited before submitting** |
| Semantics | One H1, `<address>`, `<article>`, real heading hierarchy |

**On the statewide change.** She is licensed across Colorado, and the copy
and schema now say so — `areaServed` is the State of Colorado, not the city.
But Colorado Springs was deliberately kept as the physical anchor in the
title, the address, the JSON-LD locality and the contact block. Local ranking
is driven by the verified address and searcher proximity; scrubbing the city
to sound bigger tends to lose the local rankings you had without winning the
statewide ones you wanted. Statewide is the service area, layered on top of
the local anchor, not a replacement for it.

**Deliberately omitted:** a `geo` block. Precise coordinates were never
supplied and inventing them is worse than omitting them — search engines
geocode from `address` and `hasMap`.

**Still missing, in priority order:**

1. **Service pages.** One page ranks for roughly one query. Six real pages —
   home, auto, life, business, umbrella, renters — each targeting a distinct
   service query. Now that she is statewide these should target
   service-plus-Colorado, with Colorado Springs as a secondary term, rather
   than city-only. Largest remaining gap.
2. **Canonical.** Commented out in `index.html` — uncomment once the domain
   is live.
3. **Search Console + Bing Webmaster.** Submit the sitemap.
4. **NAP reconciliation.** See below. This is off-site and it outranks
   everything above.

### The thing that matters more than this website

For local insurance the map pack drives most calls, and that is her **Google
Business Profile**, not this page. The site supports the profile; it does not
replace it.

Her name/address/phone is currently inconsistent across the web: the site
publishes 719-657-1212, her business card says 719-306-1894, her carrier
agent page publishes 719-563-9712. Search engines cross-reference these and
mismatches reduce confidence in the listing. **Reconciling the phone number
across her Google profile, carrier page and printed material will move her
ranking more than anything else on this list.**

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
| **Phone number** | Two conflicting numbers on file. See CARRIERS.md. |
| **Email** | Still a carrier address that dies on transition. See CARRIERS.md. |

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

## Staged but NOT live

| Item | State | To enable |
|---|---|---|
| **Life insurance statement** | Markup written, wrapped in an HTML comment in `index.html` | **Get Alyssa's written approval first.** The wording is a reconstruction of her dictation, not her verbatim words. Then delete the two comment markers. |
| **Reviews section** | Component built, CSS written, `hidden` | Set `reviews.enabled: true` and populate `reviews.items` in config |
| **Payment / claims links** | Tiles render, degrade to a phone link, show NEEDS markers | Add `customer.paymentUrl` and `customer.claimsUrl` in config |

## Open with Alyssa

1. **Approve the life insurance wording** before it ships. It is staged in
   `index.html` behind a comment. Publishing a reconstructed quote on a life
   insurance page is not something to guess at.
2. **Payment and claims URLs.** Those run on the carrier's systems and must
   never be rebuilt here — an agent site handling either directly is a
   compliance problem as much as a technical one. The URLs may be
   agent-specific.
3. Carrier agent website/marketing guidelines — does the site need approval?
4. Is she a registered rep? Does anything need broker-dealer sign-off?
5. **Phone — mostly resolved.** The main number is now 719-563-9712, which
   matches her carrier agent page. That NAP inconsistency is fixed and it was
   the highest-ROI item on the SEO list. Still outstanding: her **business
   card** prints 719-306-1894, a number that appears nowhere else. Confirm it
   forwards or reprint.
6. **Email.** Carrier-domain addresses are published and indexed. All three die on transition. A domain with three forwarding
   addresses fixes this permanently.
7. Last names and job titles for Charlene and Jean; headshots for both.
8. Confirm the specialty list — inferred from her appointments, not her words.
9. A real paragraph in her voice for About. Her carrier bio is the identical
   boilerplate every agent on that platform gets, and her Education,
   Licenses and Awards fields are all empty.
