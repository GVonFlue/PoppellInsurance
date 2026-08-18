#!/usr/bin/env node
/* ============================================================================
   BUILD
   ----------------------------------------------------------------------------
   Renders every page from src/ into the repo root as plain static HTML.
   Vercel runs this on deploy. What ships is still ordinary HTML — no runtime
   templating, no framework, no hydration.

   Why it exists: ten pages sharing a header and footer with no build step
   means a nav change is ten edits and one of them gets missed. Now it's one.

   Run locally with:  node build/build.js
   ==========================================================================*/
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const { AGENT, TEAM, BOT } = require('../src/site.js');
const { COVERAGE, SPECIALTY } = require('../src/content.js');
const { head, header, footer, contact, V } = require('../src/partials/shell.js');
const { ally } = require('../src/partials/ally.js');

const ALL = COVERAGE.concat(SPECIALTY);

/* ── structured data ──────────────────────────────────────────────────── */
function businessLD() {
  const a = AGENT.address;
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'InsuranceAgency',
    name: AGENT.agency,
    description: 'Insurance agency based in Colorado Springs serving clients throughout Colorado. Home, auto, life, business, umbrella, recreational, condo and renters coverage.',
    image: '/assets/brand/poppell-banner.jpg',
    telephone: '+1-' + AGENT.phone,
    email: AGENT.email,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: a.street + ', ' + a.unit,
      addressLocality: a.city, addressRegion: a.state,
      postalCode: a.zip, addressCountry: 'US'
    },
    hasMap: a.mapUrl,
    openingHoursSpecification: [{
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'],
      opens: '08:00', closes: '17:00'
    }],
    // Saturday is "by appointment". schema.org has no value for that, and
    // inventing hours would tell search engines she is open when she may not
    // be — so Saturday is deliberately absent rather than guessed.
    areaServed: { '@type': 'State', name: 'Colorado', alternateName: 'CO' },
    founder: {
      '@type': 'Person', name: AGENT.legalName, jobTitle: AGENT.title,
      telephone: '+1-719-657-1212', email: AGENT.email,
      image: '/assets/brand/alyssa-poppell.jpg'
    },
    employee: TEAM.map(m => ({
      '@type': 'Person', name: m.name,
      jobTitle: m.title || undefined, telephone: '+1-' + m.phone
    })),
    hasOfferCatalog: {
      '@type': 'OfferCatalog', name: 'Insurance coverage',
      itemListElement: ALL.map(c => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: c.navLabel + ' insurance in Colorado' }
      }))
    }
  }, null, 2);
}

function breadcrumbLD(items) {
  return JSON.stringify({
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem', position: i + 1, name: it.name, item: it.url
    }))
  });
}

/* ── page wrapper ─────────────────────────────────────────────────────── */
function page(p, body, extraLD) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
${head(p)}
<script type="application/ld+json" id="ld-business">
${businessLD()}
</script>${extraLD ? `\n<script type="application/ld+json">${extraLD}</script>` : ''}
</head>
<body${p.bodyClass ? ` class="${p.bodyClass}"` : ''}>

${header(p.path)}

<main id="main">
${body}
</main>

${footer()}
</body>
</html>
`;
}

/* ── shared blocks ────────────────────────────────────────────────────── */
function coverageRows() {
  return `      <div class="rows">
${COVERAGE.map(c => `
        <a class="row reveal" href="/${c.slug}">
          <div class="row__icon" data-icon="${c.id}"></div>
          <div class="row__head">
            <h3 class="row__label">${c.label}</h3>
            <p class="row__lede">${c.lede}</p>
          </div>
          <div class="row__copy"><p class="row__body">${c.short}</p></div>
          <span class="row__go" aria-hidden="true">&rarr;</span>
        </a>`).join('')}
      </div>`;
}

function specialtyBand() {
  return `  <section class="band panel" id="specialty">
    <div class="wrap">
      <p class="eyebrow eyebrow--inv reveal"><span class="star">&#10022;</span> Beyond the basics</p>
      <h2 class="h2 h2--inv reveal" data-d="1">The coverage most<br>people never ask about.</h2>
      <div class="spec">
${SPECIALTY.map((s, i) => `        <a class="spec__item reveal" data-d="${i + 1}" href="/${s.slug}">
          <h3 class="spec__label">${s.label}</h3>
          <p class="spec__body">${s.short}</p>
          <span class="spec__go" aria-hidden="true">&rarr;</span>
        </a>`).join('\n')}
      </div>
    </div>
  </section>`;
}

function teamGrid() {
  return `      <div class="crew">
${TEAM.map((m, i) => `        <article class="mate reveal" data-d="${i + 1}">
          <div class="mate__arch">${m.portrait
            ? `<img src="${m.portrait}" alt="${m.name}, ${m.title || 'Poppell Insurance Agency'}" width="800" height="800" loading="lazy">`
            : `<span class="mate__ph"><span class="needs">Needs headshot</span></span>`}</div>
          <h3 class="mate__name">${m.name}</h3>
          <p class="mate__title">${m.title || '<span class="needs">Needs job title</span>'}</p>
          <a class="mate__tel" href="tel:${m.tel}">${m.phone}</a>
          <a class="mate__mail" href="mailto:${m.email}">${m.email}</a>
        </article>`).join('\n')}
      </div>`;
}

function ridge() { return `    <div class="ridge" data-ridge aria-hidden="true"></div>`; }

/* ── HOME ─────────────────────────────────────────────────────────────── */
function home() {
  const body = `
  <!-- The hero is NOT in the stack. Its content runs taller than a viewport
       at most desktop sizes, and a pinned panel only ever shows its top
       100vh — which cut off the lede and both CTA buttons. It scrolls
       normally with its parallax instead, and Coverage slides up over it. -->
  <section class="hero" id="hero">
    <div class="hero__art" id="heroArt">
      <div class="hero__sky" data-sky aria-hidden="true"></div>
      <div class="hero__scene" id="heroScene">
        <picture>
          <source srcset="/assets/brand/hero-plate.webp" type="image/webp">
          <img src="/assets/brand/poppell-banner.jpg"
               alt="Poppell Insurance Agency, Colorado — Protect what matters."
               width="1942" height="809" fetchpriority="high">
        </picture>
        <!-- Sheared, not translated: displacement is zero at the seam and
             grows with height, so the cut cannot show. -->
        <div class="hero__sway" aria-hidden="true"></div>
      </div>
      <div class="hero__motes" data-motes aria-hidden="true"></div>
    </div>
    <div class="hero__body">
      <h1 class="hero__h1" data-split>Colorado Springs insurance you can <em>actually get someone</em> on the phone about.</h1>
      <p class="hero__lede reveal" data-d="2">
        Poppell Insurance Agency covers homes, vehicles, families and
        businesses with a local team, direct lines to real people, and a
        straight answer about what your policy actually does.
      </p>
      <p class="hero__reach reveal" data-d="2">
        Based in Colorado Springs. Licensed and serving clients across all of Colorado.
      </p>
      <div class="hero__acts reveal" data-d="3">
        <a class="btn btn--solid" href="#quote">Get a quote</a>
        <a class="btn btn--ghost" href="#ally" data-ally-open>${BOT.navLabel}</a>
      </div>
    </div>
  </section>

  <div class="marquee" aria-hidden="true"><div class="marquee__track" data-marquee></div></div>
  <p class="sr-only">${AGENT.creed}</p>

  <div class="stack">
  <section class="sec panel" id="coverage">
    <div class="wrap">
      <div class="sec__head">
        <p class="eyebrow reveal"><span class="star">&#10022;</span> What we cover</p>
        <h2 class="h2 reveal" data-d="1">Protect what's<br>important to you.</h2>
        <p class="sec__lede reveal" data-d="2">
          Most people find out what their policy does at the worst possible
          moment. The point of sitting down together — in the office, over the
          phone, or on a video call — is that you already know.
        </p>
      </div>
${coverageRows()}
    </div>
  </section>

${ally('panel')}

${specialtyBand()}
  </div><!-- /stack -->

  <section class="sec" id="team">
    <div class="wrap">
      <div class="sec__head">
        <p class="eyebrow reveal"><span class="star">&#10022;</span> Meet the team</p>
        <h2 class="h2 reveal" data-d="1">Every one of us<br>has a direct line.</h2>
        <p class="sec__lede reveal" data-d="2">
          Not an extension, not a queue. The number below each name rings that
          person's desk. Insurance agencies almost never publish these.
        </p>
      </div>
${teamGrid()}
    </div>
${ridge()}
  </section>

  <section class="sec sec--about" id="about">
    <div class="wrap about">
      <figure class="arch reveal">
        <div class="arch__sun" data-sun aria-hidden="true"></div>
        <div class="arch__frame">
          <div class="arch__img">
            <img src="/assets/brand/alyssa-poppell.jpg" alt="Alyssa L Poppell, Owner of Poppell Insurance Agency" width="800" height="800" loading="lazy">
          </div>
        </div>
        <figcaption class="arch__cap"><span>Alyssa Poppell</span><i class="dot">&#10022;</i><span>Owner</span></figcaption>
      </figure>
      <div class="about__txt">
        <p class="eyebrow reveal"><span class="star">&#10022;</span> Who you're working with</p>
        <h2 class="h2 reveal" data-d="1">The team,<br>not the call center.</h2>
        <div class="prose reveal" data-d="2">
          <p>Most people buy insurance once, file it away, and never look at it again until something goes wrong. That is usually the worst possible time to find out what a policy actually covers.</p>
          <p>We work the other way around. We go through what you own, what you owe, and who depends on you, then tell you plainly where you are covered and where you are exposed. Sometimes that means adding coverage. Sometimes it means telling you that you are paying for something you do not need.</p>
          <p>And wherever in Colorado you are calling from, you reach the person you meant to reach. Every one of us has a direct line published on this site.</p>
        </div>
        <p class="signature" data-sign><span>${AGENT.tagline}</span></p>
      </div>
    </div>
    <div class="wrap">
      <ul class="creed">${AGENT.creed.split('.').filter(Boolean).map(s => `<li>${s.trim()}.</li>`).join('')}</ul>
    </div>
${ridge()}
  </section>

  <section class="sec sec--quote" id="quote">
    <div class="wrap wrap--narrow">
      <p class="eyebrow reveal"><span class="star">&#10022;</span> Start here</p>
      <h2 class="h2 reveal" data-d="1">Tell us what you need covered.</h2>
      <p class="sec__lede reveal" data-d="2">
        A few questions, then a real conversation. No auto-dialer, no drip
        sequence, no one else calling you afterward.
      </p>
      <p class="howmeet reveal" data-d="2"><span class="star">&#10022;</span> In person, by phone, or on video — your call.</p>
      <div class="formwrap reveal" data-d="3" data-jotform></div>
    </div>
  </section>

${svcSection()}

${contact()}`;

  return page({
    path: '/',
    title: 'Colorado Insurance Agency — Poppell Insurance, Colorado Springs',
    description: 'Home, auto, life, business and umbrella insurance across Colorado. Based in Colorado Springs, licensed statewide. Every person on the team publishes a direct line.'
  }, body);
}

/* ── existing-customer block ──────────────────────────────────────────── */
function svcSection() {
  const mail = (subj, fields) =>
    `mailto:${AGENT.email}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(fields)}`;
  const F = 'Name:\nPolicy number:\nPhone:\n\nDetails:\n';
  return `  <section class="svc" id="customers">
    <div class="wrap">
      <div class="svc__head">
        <p class="eyebrow reveal"><span class="star">&#10022;</span> Already a customer?</p>
        <h2 class="h2 reveal" data-d="1">Handle it here.</h2>
      </div>
      <div class="svc__grid">
        <div class="svc__item reveal" data-d="1">
          <span class="svc__label">Call or text the office</span>
          <span class="svc__meta">
            <a href="tel:${AGENT.telHref}">Call ${AGENT.phone}</a>
            <a href="sms:${AGENT.telHref}">Text</a>
          </span>
        </div>
        <div class="svc__item reveal" data-d="2" data-svc="payment">
          <span class="svc__label">Make a payment</span>
        </div>
        <div class="svc__item reveal" data-d="2" data-svc="claims">
          <span class="svc__label">File a claim</span>
        </div>
        <a class="svc__item reveal" data-d="3" href="${mail('Policy change request', F)}">
          <span class="svc__label">Request a policy change</span>
          <span class="svc__meta">Email the office</span>
        </a>
        <a class="svc__item reveal" data-d="3" href="${mail('ID card request', F)}">
          <span class="svc__label">Request an ID card</span>
          <span class="svc__meta">Email the office</span>
        </a>
        <a class="svc__item reveal" data-d="4" href="${mail('Policy review request', F)}">
          <span class="svc__label">Schedule a policy review</span>
          <span class="svc__meta">Email the office</span>
        </a>
      </div>
    </div>
  </section>`;
}

/* ── SERVICE PAGE ─────────────────────────────────────────────────────── */
function servicePage(c) {
  const crumbs = breadcrumbLD([
    { name: 'Home', url: '/' },
    { name: 'Coverage', url: '/coverage' },
    { name: c.navLabel, url: '/' + c.slug }
  ]);
  const body = `
  <section class="lede-sec">
    <div class="wrap">
      <nav class="crumbs" aria-label="Breadcrumb">
        <a href="/">Home</a> <span aria-hidden="true">/</span>
        <a href="/coverage">Coverage</a> <span aria-hidden="true">/</span>
        <span aria-current="page">${c.navLabel}</span>
      </nav>
      <h1 class="h1 reveal">${c.h1}</h1>
      <p class="lede-sec__intro reveal" data-d="1">${c.intro}</p>
      <div class="lede-sec__acts reveal" data-d="2">
        <a class="btn btn--solid" href="/#quote">Get a quote</a>
        <a class="btn btn--ghost" href="tel:${AGENT.telHref}">${AGENT.phone}</a>
      </div>
    </div>
  </section>

${ridge()}

  <article class="sec article">
    <div class="wrap wrap--narrow">
${c.sections.map(s => `      <h2 class="article__h reveal">${s.h}</h2>
${s.p.map(t => `      <p class="reveal">${t}</p>`).join('\n')}`).join('\n\n')}

      <h2 class="article__h reveal">Also written here</h2>
      <ul class="ticks reveal">
${c.also.map(x => `        <li>${x}</li>`).join('\n')}
      </ul>

      <aside class="callout reveal">
        <p><strong>None of the above is a coverage determination.</strong> What
        your policy does or does not cover is decided by the policy language
        and the facts of the situation, not by a web page. Call
        <a href="tel:${AGENT.telHref}">${AGENT.phone}</a> and we'll look at yours.</p>
      </aside>
    </div>
  </article>

${ridge()}

  <section class="sec">
    <div class="wrap">
      <p class="eyebrow reveal"><span class="star">&#10022;</span> Other coverage</p>
      <h2 class="h2 reveal" data-d="1">While you're here.</h2>
      <div class="tiles">
${ALL.filter(o => o.slug !== c.slug).map((o, i) => `        <a class="tile reveal" data-d="${(i % 3) + 1}" href="/${o.slug}">
          <span class="tile__label">${o.navLabel}</span>
          <span class="tile__go" aria-hidden="true">&rarr;</span>
        </a>`).join('\n')}
      </div>
    </div>
  </section>

${contact()}`;

  return page({
    path: '/' + c.slug, title: c.title, description: c.description
  }, body, crumbs);
}

/* ── COVERAGE INDEX ───────────────────────────────────────────────────── */
function coverageIndex() {
  const body = `
  <section class="lede-sec">
    <div class="wrap">
      <nav class="crumbs" aria-label="Breadcrumb">
        <a href="/">Home</a> <span aria-hidden="true">/</span>
        <span aria-current="page">Coverage</span>
      </nav>
      <h1 class="h1 reveal">Everything we write in Colorado.</h1>
      <p class="lede-sec__intro reveal" data-d="1">
        Seven kinds of coverage, each with its own page and its own plain
        explanation. Based in Colorado Springs, licensed across the state.
      </p>
    </div>
  </section>

${ridge()}

  <section class="sec">
    <div class="wrap">
      <div class="rows">
${ALL.map(c => `        <a class="row reveal" href="/${c.slug}">
          <div class="row__icon" data-icon="${c.id}"></div>
          <div class="row__head">
            <h2 class="row__label">${c.label}</h2>
            <p class="row__lede">${c.lede || c.navLabel + ' insurance'}</p>
          </div>
          <div class="row__copy"><p class="row__body">${c.short}</p></div>
          <span class="row__go" aria-hidden="true">&rarr;</span>
        </a>`).join('\n')}
      </div>
    </div>
  </section>

${contact()}`;
  return page({
    path: '/coverage',
    title: 'Insurance Coverage in Colorado — Poppell Insurance Agency',
    description: 'Home, auto, life, business, umbrella, condo and renters, and recreational insurance across Colorado. Colorado Springs based.'
  }, body);
}

/* ── TEAM ─────────────────────────────────────────────────────────────── */
function teamPage() {
  const body = `
  <section class="lede-sec">
    <div class="wrap">
      <nav class="crumbs" aria-label="Breadcrumb">
        <a href="/">Home</a> <span aria-hidden="true">/</span>
        <span aria-current="page">Team</span>
      </nav>
      <h1 class="h1 reveal">Every one of us has a direct line.</h1>
      <p class="lede-sec__intro reveal" data-d="1">
        Not an extension, not a queue. The number below each name rings that
        person's desk. Insurance agencies almost never publish these, which is
        exactly why we do.
      </p>
    </div>
  </section>

${ridge()}

  <section class="sec">
    <div class="wrap">
${teamGrid()}
    </div>
  </section>

${contact()}`;
  return page({
    path: '/team',
    title: 'Our Team — Poppell Insurance Agency, Colorado Springs',
    description: 'Meet the team at Poppell Insurance Agency in Colorado Springs. Every person publishes a direct line.'
  }, body);
}

/* ── ABOUT ────────────────────────────────────────────────────────────── */
function aboutPage() {
  const body = `
  <section class="lede-sec">
    <div class="wrap">
      <nav class="crumbs" aria-label="Breadcrumb">
        <a href="/">Home</a> <span aria-hidden="true">/</span>
        <span aria-current="page">About</span>
      </nav>
      <h1 class="h1 reveal">The team, not the call center.</h1>
    </div>
  </section>

  <section class="sec sec--about">
    <div class="wrap about">
      <figure class="arch reveal">
        <div class="arch__sun" data-sun aria-hidden="true"></div>
        <div class="arch__frame">
          <div class="arch__img">
            <img src="/assets/brand/alyssa-poppell.jpg" alt="Alyssa L Poppell, Owner of Poppell Insurance Agency" width="800" height="800" loading="lazy">
          </div>
        </div>
        <figcaption class="arch__cap"><span>Alyssa Poppell</span><i class="dot">&#10022;</i><span>Owner</span></figcaption>
      </figure>
      <div class="about__txt">
        <div class="prose reveal" data-d="1">
          <p>Most people buy insurance once, file it away, and never look at it again until something goes wrong. That is usually the worst possible time to find out what a policy actually covers.</p>
          <p>We work the other way around. We go through what you own, what you owe, and who depends on you, then tell you plainly where you are covered and where you are exposed. Sometimes that means adding coverage. Sometimes it means telling you that you are paying for something you do not need.</p>
          <p>The office is in Colorado Springs and we write coverage throughout Colorado. Whether that happens across a desk, over the phone, or on a video call is entirely up to you.</p>
          <p>And wherever you are calling from, you reach the person you meant to reach. No queue, no routing, no explaining your file from the beginning to somebody new.</p>
        </div>
        <p class="signature" data-sign><span>${AGENT.tagline}</span></p>
      </div>
    </div>
    <div class="wrap">
      <ul class="creed">${AGENT.creed.split('.').filter(Boolean).map(s => `<li>${s.trim()}.</li>`).join('')}</ul>
    </div>
  </section>

${ridge()}

${contact()}`;
  return page({
    path: '/about',
    title: 'About — Poppell Insurance Agency, Colorado Springs',
    description: 'Poppell Insurance Agency is a local team in Colorado Springs writing coverage across Colorado. In person, by phone, or on video.'
  }, body);
}

/* ── CONTACT ──────────────────────────────────────────────────────────── */
function contactPage() {
  const body = `
  <section class="lede-sec">
    <div class="wrap">
      <nav class="crumbs" aria-label="Breadcrumb">
        <a href="/">Home</a> <span aria-hidden="true">/</span>
        <span aria-current="page">Contact</span>
      </nav>
      <h1 class="h1 reveal">Get in touch.</h1>
      <p class="lede-sec__intro reveal" data-d="1">
        Call the office, message ${BOT.name}, or send the form and we'll come
        back to you. In person, by phone, or on video — your call.
      </p>
    </div>
  </section>

${contact()}

${ridge()}

  <section class="sec sec--quote" id="quote">
    <div class="wrap wrap--narrow">
      <p class="eyebrow reveal"><span class="star">&#10022;</span> Start here</p>
      <h2 class="h2 reveal" data-d="1">Tell us what you need covered.</h2>
      <div class="formwrap reveal" data-d="2" data-jotform></div>
    </div>
  </section>

${svcSection()}`;
  return page({
    path: '/contact',
    title: 'Contact — Poppell Insurance Agency, Colorado Springs',
    description: 'Call 719-563-9712 or visit Poppell Insurance Agency at 611 N Weber St., Ste. 202, Colorado Springs, CO.'
  }, body);
}

/* ── WRITE ────────────────────────────────────────────────────────────── */
const pages = [
  ['index.html', home()],
  ['coverage.html', coverageIndex()],
  ['team.html', teamPage()],
  ['about.html', aboutPage()],
  ['contact.html', contactPage()],
  ...ALL.map(c => [c.slug + '.html', servicePage(c)])
];

let n = 0;
for (const [file, html] of pages) {
  fs.writeFileSync(path.join(ROOT, file), html);
  n++;
}

/* sitemap, from the same list — it cannot drift out of sync with the pages */
const urls = pages.map(([f]) => f === 'index.html' ? '/' : '/' + f.replace(/\.html$/, ''));
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'),
`<?xml version="1.0" encoding="UTF-8"?>
<!-- Generated by build/build.js. Replace REPLACE-WITH-DOMAIN before submitting
     to Search Console — a sitemap of URLs that do not resolve is worse than
     no sitemap. -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>https://REPLACE-WITH-DOMAIN${u}</loc>
    <changefreq>monthly</changefreq>
    <priority>${u === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>
`);

console.log(`built ${n} pages + sitemap (asset v=${V})`);
console.log(urls.map(u => '  ' + u).join('\n'));
