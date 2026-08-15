# Poppell Insurance Agency — V1

Personal-brand site for Alyssa Poppell, Colorado Springs. Static HTML, no build
step, no dependencies. GitHub → Vercel, same pattern as GetProyTech.

```
index.html
vercel.json              cleanUrls, asset caching
assets/
  css/styles.css
  js/config.js           ← every client + carrier fact lives here
  js/main.js             ← hydration, ridgeline, scroll behaviour
  brand/                 her banner + business card
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

Everything else stays quiet: one accent colour, hairline grid on the coverage
cards, no shadows, no gradients.

## Motion

Page-load hero settle, scroll-triggered reveals, hero parallax at 0.22x,
ridgeline stroke draw, card hover with the heart beating once. All of it is
disabled under `prefers-reduced-motion`.

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

| Item | Where |
|---|---|
| **Jotform URL** | `jotformUrl` — paste the form URL, not the embed script |
| **About copy** — 2–3 paragraphs in her voice | `agent.bio` (array of strings) |
| **Headshot** | `agent.portrait` — don't hotlink the Farmers CDN copy |
| **Office hours** | `agent.hours` (array of strings) |
| **Domain** | `site.domain` |
| **Phone number** | two conflicting numbers on file — see BRANDING-SWAP.md |
| **Email** | currently a carrier address that dies on transition |

Her Farmers About section is carrier boilerplate with Education, Awards and
Licenses all blank, so there is nothing there worth reusing. The bio has to
come from her.

## Not in V1

Coverage sub-pages, blog, testimonials/reviews, LocalBusiness JSON-LD,
sitemap, OG image, analytics. All straightforward additions once the content
gaps above are closed.
