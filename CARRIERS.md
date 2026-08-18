# Carriers

Alyssa is **not leaving Farmers.** Her words: *"Not anytime soon. Maybe never
if they don't mess with my pay plan. However I will be expanding with other
brokers in addition to Farmers."*

That is an **additive** problem, not a swap, and the code is built for it.

## The principle

The site's identity is **Poppell Insurance Agency**. A carrier is something
she represents — never the brand of the page. No carrier name appears in any
heading, any body copy, any nav item, or any stylesheet.

Carrier names survive in exactly two places:

| Where | What |
|---|---|
| `assets/js/config.js` | The `carriers` array — names, legal names, logos, disclosures |
| `index.html` | Email addresses only (`@farmersagent.com`, five occurrences) |

Audit at any time:

```bash
grep -rin "farmers" . --include="*.html" --include="*.css" --include="*.js"
```

If a carrier name shows up in a heading or in body copy, that's a bug.

## Adding a carrier

1. Open `assets/js/config.js` and append to the `carriers` array:

```js
{
  id: 'example',
  name: 'Example Mutual',
  legalName: 'Example Mutual Insurance Company',
  logo: null,
  disclosures: [
    'Their required language, one string per paragraph.'
  ]
}
```

2. **Get the disclosure language from that carrier.** Do not adapt Farmers'
   wording — every carrier's required text is different and it is a
   compliance document, not copy.
3. Bump `?v=` on the three asset links in `index.html`.
4. Commit and push.

Disclosures from every carrier concatenate into the footer in array order.
Nothing else in the codebase needs to know how many carriers exist.

## If she ever does leave a carrier

1. Remove that carrier's entry from the `carriers` array.
2. If its email domain was in use, find-and-replace in `index.html`. Verify
   with `grep -c "@thatdomain.com" index.html` — the count must reach zero.
   It appears in the team cards (link text and `mailto:` hrefs), the six
   `mailto:` links in the customer section, and the JSON-LD block.
3. Check the license number in the footer and JSON-LD.
4. Bump `?v=`.

## Standing compliance constraints

These hold regardless of how many carriers she adds:

1. **No financial services content.** She is appointed for Farmers Financial
   Solutions (member FINRA & SIPC). FINRA advertising rules generally require
   broker-dealer principal pre-approval before publication — stricter than
   insurance marketing. Nothing on this site touches it. Do not add any
   without her BD's written approval.
2. **No comparative or savings claims.** No "best rates", no "we shop the
   market", no "save up to". Carriers' own savings claims carry survey
   methodology footnotes; an agent site cannot make them. This gets *more*
   tempting as she adds carriers — resist it.
3. **No carrier logos** until she supplies each carrier's agent marketing
   guidelines.
4. **No lifted carrier copy.** Their product language is version-controlled
   and carries form numbers. Every word on this site is original.

## The email problem, still open

All published addresses sit on the carrier's domain and are now indexed. A
domain with forwarding addresses fixes this permanently and costs almost
nothing. It matters more now, not less — if she is adding brokers, an
address tied to one of them is the wrong public identity for her agency.

## The phone, still open

| Number | Where it lives |
|---|---|
| 719-563-9712 | Main office, site-wide. Matches her carrier agent page. |
| 719-657-1212 | Alyssa's direct line — Team section only |
| 719-679-5050 | Charlene's direct line — Team section only |
| 719-657-1201 | Jean's direct line — Team section only |
| **719-306-1894** | **Printed on her business card. Appears nowhere else.** |

Cards are in circulation pointing at a number the site does not use.
Confirm it forwards, or reprint.
