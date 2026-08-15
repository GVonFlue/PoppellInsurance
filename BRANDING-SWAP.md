# Switching carriers

Alyssa is expected to move off Farmers. This site was built so that move is a
config edit, not a rebuild.

## The rule

**`assets/js/config.js` is the only file that ever mentions a carrier.**

Verify this at any time:

```bash
grep -ril "farmers" . --include="*.html" --include="*.css" --include="*.js"
```

The only result should be `./assets/js/config.js`. If any other file appears,
that's a bug — move the string into config before shipping.

## The switch, start to finish

1. **Edit the `carrier` block** in `assets/js/config.js`:
   - `name` — display name used in body copy
   - `legalName` — the entity named in the footer
   - `eyebrow` — the line under her name, or `null` to hide it
   - `logo` — path to the new logo in `assets/brand/`, or `null`
   - `quoteUrl` — where "Get a quote" points
   - `disclosures` — **replace the array entirely.** Every carrier's required
     language is different. Do not adapt the old strings; get the new ones
     from the new carrier's compliance team.

2. **Drop the new logo** into `assets/brand/`.

3. **Check `agent.license`.** Her personal license (#640903) follows her, but
   confirm it hasn't changed with the appointment.

4. **Check `agent.email`.** If it's still a carrier-domain address at that
   point, it dies with the appointment. See the warning below.

5. Commit, push. Vercel redeploys automatically. No build step.

## Two things that must be fixed before the first launch

**The email address.** `apoppell@farmersagent.com` belongs to Farmers. Every
business card, listing and inbound reply pointing at it goes dead the day she
leaves. She needs a domain address — `alyssa@poppellinsurance.com` or
similar — forwarding wherever she wants today. This is the single highest-cost
item to defer.

**The phone number.** Two numbers are in play:

| Source | Number |
|---|---|
| Business card | 719-306-1894 |
| Farmers agent page | 719-563-9712 |

Config uses the card number as the later, client-authored value. Confirm with
her before launch. If the Farmers number is a carrier-provisioned line, it
goes away with the appointment and should never be the number on this site.

## Carrier compliance

Captive carriers usually require review of agent-created marketing sites.
Confirm Farmers' process before this goes public. If they require specific
disclosure language, it goes in `carrier.disclosures` — nowhere else.

## Her artwork

`assets/brand/poppell-banner.jpg` and `poppell-card.png` are Alyssa's own
brand assets and contain no carrier marks. They survive the switch untouched.
