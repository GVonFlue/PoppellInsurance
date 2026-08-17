# GO-LIVE — Poppell Insurance Agency

Nineteen steps, start to finish. Written to be followed on a phone if needed.
There is **no build step** — this is plain HTML, CSS and JavaScript. Vercel
serves the files exactly as they sit in the repo.

Budget about 25 minutes, most of it waiting on DNS.

---

## Part A — GitHub

**1.** Unzip `poppell-insurance-v1.zip`. You get a folder named `poppell`.

**2.** Go to github.com → **New repository**.
- Name: `poppell-insurance`
- **Private** (make it public later if you want; nothing here is secret)
- Do **not** add a README, .gitignore, or licence — the zip already has them.
- Create repository.

**3.** On the empty repo page click **uploading an existing file**.

**4.** Open the `poppell` folder and drag **everything inside it** into the
browser — `index.html`, `vercel.json`, `README.md`, `BRANDING-SWAP.md`,
`GO-LIVE.md`, and the whole `assets` folder.

> **Drag the contents, not the folder itself.** If you drag the `poppell`
> folder, GitHub nests everything one level deep, `index.html` ends up at
> `/poppell/index.html`, and Vercel serves a 404 at the root. This is the
> single most common way this step goes wrong.

**5.** Commit message: `Poppell Insurance V1`. Click **Commit changes**.

**6.** Confirm `index.html` is visible at the **top level** of the repo, not
inside a subfolder. If it is nested, delete everything and redo step 4.

---

## Part B — Vercel

**7.** vercel.com → **Add New** → **Project** → **Import Git Repository** →
pick `poppell-insurance`. Authorise GitHub access if prompted.

**8.** On the configure screen:

| Field | Value |
|---|---|
| Framework Preset | **Other** |
| Root Directory | `./` |
| Build Command | **leave empty** (toggle the override off) |
| Output Directory | **leave empty** |
| Install Command | **leave empty** |
| Environment Variables | none |

Vercel sometimes guesses a framework. If it does, change it to **Other**. A
build command on a static site will fail the deploy.

**9.** Click **Deploy**. It takes about 20 seconds.

**10.** Open the `.vercel.app` URL it gives you. Check:
- Her banner loads and the headline animates in word by word
- The green creed band scrolls
- Hovering a coverage row draws the icon and tints the row
- The arch portrait rises into view, sun turning behind it
- **The quote form loads** — this is the one that can only be tested live
- The mountains draw themselves at each section break

---

## Part C — Domain

**11a. SEO files that need the domain.** Three edits, all one line each:

- `index.html` — uncomment the `<link rel="canonical">` in `<head>` and set it
- `sitemap.xml` — replace `REPLACE-WITH-DOMAIN` with the real domain
- `robots.txt` — uncomment the `Sitemap:` line and set it
- `assets/js/config.js` — set `site.domain` (no protocol, no trailing slash).
  This injects absolute Open Graph URLs and the JSON-LD `url`/`@id`.

**11b.** After the domain resolves: add the property in **Google Search
Console** and **Bing Webmaster Tools**, and submit `sitemap.xml` in both.
Also run the homepage through Google's **Rich Results Test** to confirm the
`InsuranceAgency` structured data is picked up.

**11.** Buy the domain if you have not. `poppellinsurance.com` or
`poppellinsuranceagency.com`. Keep her name in it — that is the whole point of
building this before the carrier change.

**12.** Vercel → your project → **Settings** → **Domains** → add the apex
(`poppellinsurance.com`) **and** `www.poppellinsurance.com`.

**13.** Vercel shows a DNS card with the exact records. **Use the values on
that card** — they are per-project now, not the same for everyone.

Typically:

| Host | Type | Points to |
|---|---|---|
| `@` | A | the IP shown on the card |
| `www` | CNAME | the target shown on the card |

**14.** Add those at your registrar. Wait for Vercel to show **Valid
Configuration** and issue the SSL certificate. Usually minutes, occasionally
an hour.

**15.** Load `https://poppellinsurance.com` and confirm the padlock.

---

## Part D — Before you send it to her

**16.** **No amber boxes.** Every field is filled — scroll the whole page once
and confirm you see no dashed orange **NEEDS** markers anywhere. If one
appears, the matching value in `assets/js/config.js` went back to `null`.

Hours are set to Mon–Fri 8:30 AM – 5:30 PM, weekends closed, taken from her
Farmers page. If she actually takes Saturday appointments, add that line.

**17.** Resolve the two open decisions, both documented in
`BRANDING-SWAP.md`:
- **Phone** — card says 719-306-1894, her Farmers page says 719-563-9712
- **Email** — `apoppell@farmersagent.com` dies with the appointment; she needs
  a domain address forwarding wherever she wants today

**18.** Have her read the bio. The three paragraphs in config are a draft I
wrote that deliberately contains no biographical facts — no years in business,
no hometown, no family. Nothing in it can be wrong, but nothing in it is
specifically her either. Her own words will land harder.

**19.** **Carrier compliance.** Confirm what Farmers requires for an
agent-created site before this is publicly linked. If they need review first,
push the repo but do **not** add the custom domain yet — the `.vercel.app` URL
is unlisted and fine to share for approval.

---

## Updating it later

Edit the file on GitHub, commit, and Vercel redeploys in about 20 seconds.
For almost everything you will ever change — phones, emails, hours, team,
coverage copy, disclosures, carrier — the file is `assets/js/config.js`.

### After ANY change to CSS or JS, bump the version string

At the bottom and top of `index.html`:

```html
<link rel="stylesheet" href="/assets/css/styles.css?v=2">
<script src="/assets/js/config.js?v=2"></script>
<script src="/assets/js/main.js?v=2"></script>
```

Change all three `?v=2` to `?v=3`, then `?v=4`, and so on.

**Why this matters.** These filenames never change — there is no build step
producing hashed names like `app.a3f9c2.js`. Without a new query string, a
browser that already has `config.js` may keep serving its old copy and your
deploy simply will not appear. The `vercel.json` cache headers now force
revalidation, so this is belt and braces — but bump it anyway. It costs three
characters and it is the difference between "the deploy worked" and an hour
of confusion.

If a change still does not show up: hard refresh with **Cmd+Shift+R**.

## If something breaks

| Symptom | Cause |
|---|---|
| 404 at the root | Files got nested in a subfolder. Redo Part A step 4. |
| Page loads unstyled | `assets/` did not upload. Check the repo file tree. |
| Deploy fails | A build command is set. Clear it, set framework to Other. |
| Quote form is blank | Check the Jotform is published and not in draft. |
| Fonts look wrong | Bodoni Moda and Parisienne load from Google Fonts. Blocked networks fall back to a system serif — not a bug in the site. |
| **Deploy succeeded but the page looks unchanged** | Cached CSS/JS. Bump `?v=` in `index.html` and hard refresh (Cmd+Shift+R). |
| **Some content updated, some didn't** | Classic partial cache. `index.html` refreshed but `config.js` or `main.js` did not. Same fix as above. |
| Domain will not verify | Old A or CNAME records at the registrar. Delete them. |
| **Build Failed: `vercel.json` schema validation failed** | An unknown key in `vercel.json`. Vercel rejects anything outside its schema — including `"comment"`, since JSON has no comments. Remove the offending key. The error message names the exact path, e.g. `headers[0]`. |
