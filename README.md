# Poppell Insurance Agency

Personal-brand site for Alyssa Poppell, Colorado Springs. 12 static pages,
built from `src/` by a Node script Vercel runs on deploy. Two serverless
functions. No framework, no client-side routing, no hydration.

```
build/build.js        renders every page into the repo root
src/site.js           nav, agent facts, team — change once, every page updates
src/content.js        coverage copy, incl. the Colorado-specific sections
src/partials/         shell (head/header/footer/contact) + the Ally widget
api/chat.js           Ally. Anthropic tool-use loop, server-side key
api/lead.js           one delivery path for every capture surface
deploy/poppell-leads.gs   Apps Script: Sheet + email. Paste whole, never merge
assets/               css, js, brand images
*.html                BUILD OUTPUT — never edit these by hand
```

**Never edit the HTML files.** They are generated. Edit `src/` and run
`node build/build.js`.

## Pages

`/` · `/coverage` · `/team` · `/about` · `/contact` · `/home-insurance` ·
`/auto-insurance` · `/life-insurance` · `/business-insurance` ·
`/umbrella-insurance` · `/renters-insurance` · `/recreational-insurance`

Each service page carries Colorado-specific substance — hail and roof
depreciation, wildfire scoring, HOA master-policy seams — because a page that
restates the homepage blurb is a thin doorway page and search engines treat it
as one.

## Ally — the chat assistant

Named for Alyssa, and because an ally is what an agent is supposed to be.
Sits after the coverage section on the homepage; the nav link scrolls to it.

The section is deliberately the loudest on the page — a warm blush field
with paper grain and a rising sun, and Alyssa cut out to transparency
standing behind the panel from the top right. The panel edge is tuned to
land at her collar: cutting a face at the mouth reads as a mistake rather
than a crop.

**Ally never claims to be Alyssa.** A persistent, non-dismissible line under
the widget says she is an AI assistant, not a licensed agent. Alyssa is a
licensed producer — a visitor who believes they are talking to her and acts on
something wrong is a real exposure.

**Hard prohibitions, in the system prompt and re-stated in the tool result:**
no premiums or prices, no statement that anything is or is not covered, no
claims advice, no binding coverage, no comparative or savings claims, nothing
touching securities or financial services, no legal or tax advice, no implying
licensure outside Colorado, no discussing anyone's existing policy, no
characterising who lives anywhere. When a question crosses a line she refuses
completely and hands off — a half-answer on coverage is worse than none.

**Capture is a hybrid, and the split is the point.** The model decides *when*
someone has agreed to be contacted and calls `request_contact_details`. That
tool's schema deliberately has **no name, phone or email fields** — the site
then collects those itself with a plain JavaScript step machine, validating
each one before moving on.

Why: a model that drops a digit from a phone number or tidies an email into
something that doesn't exist produces a lead that looks fine and can never be
contacted. It never touches those values, so it can't. It passes only the
context the conversation actually gave it — interest and a note.

While capture is running, the visitor's typing **never reaches the model at
all.** Their contact details have no business in a prompt.

Pattern follows Ask Chris / Ace. She answers the question first, offers a
follow-up only after genuinely helping, and if declined drops it entirely.

**Chips are dynamic.** The model appends `CHIPS: a | b | c` and the server
strips it out. Parsed defensively — a missing or mangled line falls back to
the client's own defaults rather than showing anything broken.

**With no `ANTHROPIC_API_KEY` set she says so honestly** and gives the office
number. She never pretends to be thinking.

`node /tmp/test-chat.js` style harness: 27 assertions covering the tool loop,
every prohibition, the disconnected path, and thread bounding.

## Abuse and cost limits

Layered, cheapest check first, so a scripted abuser is rejected before
anything reaches Anthropic.

| Layer | Limit | Where |
|---|---|---|
| Origin allowlist | Only this site's own pages | `/api/chat`, `/api/lead` |
| Per-IP burst | 8 messages / minute | `/api/chat` |
| Per-IP hourly | 40 messages / hour | `/api/chat` |
| Instance breaker | 600 requests / hour, everyone | `/api/chat` |
| Conversation cap | 30 assistant turns, then hand off | `/api/chat` |
| Message length | 500 chars, truncated server-side | `/api/chat` |
| Reply length | `max_tokens: 700` | `/api/chat` |
| Context window | last 24 turns only | `/api/chat` |
| Lead spam | 6 leads / hour / IP, silently dropped | `/api/lead` |

**Be clear about what this is.** Serverless functions scale across instances
and these counters live in instance memory, so they are best-effort. They
stop casual scraping, a stuck loop, and one machine hammering the endpoint.
They cannot stop a distributed attack.

**The only hard ceiling is the spend limit in the Anthropic Console.** Set it.
Everything above reduces the odds; that one makes the worst case finite.

Context length matters more than request count for cost — a long thread costs
far more per message than a short one, which is why the turn cap and the
24-turn window exist.

## Environment variables (Vercel → Settings → Environment Variables)

| Key | Effect if missing |
|---|---|
| `ANTHROPIC_API_KEY` | Ally says she isn't connected and gives the phone number |
| `SHEETS_WEBHOOK_URL` | Leads log to Vercel only — **a net, not a floor** |

## Lead flow

Ally → `/api/lead` → Apps Script → **Sheet first**, then email.
Sheet: *Poppell Insurance — Website Leads*, in her client folder.
`1uuUN91pnZ-v_3oF4hkeZWFDFXubiR3AUR2S7sHCWB00`

A failed email never fails the write. Losing a notification is recoverable;
losing the lead is not. The visitor is never shown a delivery failure.

## Stacking panels

**Coverage pins, Ally slides up over it, and the stack ends there.** Specialty
and everything after scroll normally. Desktop only (>860px), off under
`prefers-reduced-motion`.

**Ally is the last thing to arrive and nothing ever covers it.** A page
sliding over a chat panel makes it unusable — you cannot read a reply or hit
an input that is moving. So Ally rides up on a higher layer (`.stack__last`)
and is not sticky itself. Asserted in test, not assumed: with Ally on screen,
`document.elementFromPoint` over the chat input returns the input at rest and
through 600px of further scrolling.

**`--dwell` is the whole feel of it.** Each panel occupies `100vh + dwell` of
document height but only ever shows its top 100vh, because it is pinned. The
next panel's top edge sits at the bottom of that box, so you get `dwell` worth
of scrolling with the panel pinned and nothing sliding over it before the
handover starts. Currently 62vh — about 70% of a screen between handovers.
Set it to 0 and the next panel starts covering the instant you touch the
wheel, which reads as far too aggressive. One value, in `.stack`.

The nav link scrolls to the **chat panel**, not the section — the section
starts far above the box and scrolling to its top buried the panel header
off-screen. Position is computed directly; `scrollIntoView` plus
`scroll-margin-top` was landing 48px past.

**The hero is deliberately not a panel.** Its content runs ~1230px tall at a
900px viewport, and a pinned panel only ever shows its top 100vh — which cut
off the lede and both CTA buttons. It scrolls normally with its parallax and
Coverage slides up over it.

Two bugs found by measuring rather than looking:
- `.stack` is load-bearing. `position:sticky` scopes to its nearest scrolling
  ancestor; without the wrapper the last panel stays stuck and paints over
  every section below for the rest of the page.
- The sticky rules are written `.stack .panel`, not `.panel`. At equal
  specificity the later `.ally { position:relative }` was silently winning and
  Ally was never sticky at all.

## The living hero

Three files: `hero-plate.webp` (cream keyed transparent, planting removed),
`hero-sway.webp` (the cactus and pampas), `poppell-banner.jpg` (untouched
fallback). Sun glow, birds and motes animate in the transparent sky.

The planting is **sheared, never translated** — `skewX` about an origin on the
seam means displacement is exactly zero at the cut and grows with height, so
the join cannot show. The cut runs above the sage band, so nothing had to be
reconstructed.

The logo lockup is never split.

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
