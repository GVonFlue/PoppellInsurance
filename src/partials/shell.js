/* Shared chrome. One definition, every page. */
const { AGENT, NAV, BOT } = require('../site.js');

const V = 10;   // cache-bust token, bumped by the build

function head(p) {
  const title = p.title;
  const desc  = p.description;
  const img   = p.ogImage || '/assets/brand/poppell-banner.jpg';
  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>${title}</title>
<meta name="description" content="${desc}">

<!-- CANONICAL — uncomment and set once the domain is live. A wrong canonical
     is worse than none, so it ships commented.
<link rel="canonical" href="https://REPLACE-WITH-DOMAIN${p.path}">
-->

<meta property="og:type" content="website">
<meta property="og:site_name" content="${AGENT.agency}">
<meta property="og:locale" content="en_US">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="${img}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${desc}">
<meta name="twitter:image" content="${img}">
<meta name="geo.region" content="US-CO">
<meta name="geo.placename" content="Colorado Springs">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,600;0,6..96,700;1,6..96,400&family=Jost:wght@300;400;500;600&family=Parisienne&display=swap" rel="stylesheet">

<link rel="stylesheet" href="/assets/css/styles.css?v=${V}">`;
}

function header(current) {
  const links = NAV.map(n => {
    const active = n.href === current ? ' aria-current="page"' : '';
    if (n.chat) {
      return `<a class="hdr__chat" href="${n.href}" data-ally-open title="${BOT.tagline}">
        <span class="hdr__chatdot" aria-hidden="true"></span>${n.label}</a>`;
    }
    return `<a href="${n.href}"${active}>${n.label}</a>`;
  }).join('\n      ');

  const mlinks = NAV.map(n => {
    if (n.chat) return `<a href="${n.href}" data-ally-open>${n.label}</a>`;
    return `<a href="${n.href}">${n.label}</a>`;
  }).join('\n    ');

  return `<a class="skip" href="#main">Skip to content</a>

<header class="hdr" id="hdr">
  <div class="hdr__in">
    <a class="hdr__mark" href="/">
      <span class="hdr__name">Poppell</span>
      <span class="hdr__sub">Insurance Agency</span>
    </a>
    <nav class="hdr__nav" aria-label="Main">
      ${links}
    </nav>
    <a class="hdr__cta" href="tel:${AGENT.telHref}">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .57 3.6 1 1 0 0 1-.25 1z"/></svg>
      <span>${AGENT.phone}</span>
    </a>
    <button class="hdr__burger" id="burger" aria-expanded="false" aria-controls="mnav" aria-label="Open menu">
      <span></span><span></span>
    </button>
  </div>
  <nav class="mnav" id="mnav" aria-label="Mobile">
    ${mlinks}
    <a href="tel:${AGENT.telHref}">Call ${AGENT.phone}</a>
  </nav>
</header>`;
}

function contact() {
  const a = AGENT.address;
  return `  <section class="sec sec--contact" id="contact">
    <div class="wrap contact">
      <div class="contact__lead reveal">
        <p class="lbl">The office</p>
        <a class="phone" href="tel:${AGENT.telHref}">${AGENT.phone}</a>
        <p class="contact__note">Or call anyone on the team direct — <a href="/team">see the numbers</a>.</p>
      </div>
      <div class="contact__grid">
        <div class="reveal" data-d="1">
          <p class="lbl">Office</p>
          <address>
            ${AGENT.agency}<br>
            ${a.street}<br>${a.unit}<br>
            ${a.city}, ${a.state} ${a.zip}<br>
            <a href="${a.mapUrl}" target="_blank" rel="noopener">Get directions</a>
          </address>
        </div>
        <div class="reveal" data-d="2">
          <p class="lbl">Hours</p>
          <div>${AGENT.hours.map(h => `<div>${h[0]} · ${h[1]}</div>`).join('\n            ')}</div>
        </div>
        <div class="reveal" data-d="3">
          <p class="lbl">Service area</p>
          <p class="contact__area">The office is in Colorado Springs and we
          write coverage throughout Colorado. If you are anywhere in the state,
          you can work with us by phone or on video.</p>
        </div>
      </div>
    </div>
  </section>`;
}

function footer() {
  return `<footer class="ftr">
  <div class="wrap">
    <div class="ftr__top">
      <div>
        <p class="ftr__mark">Poppell <em>Insurance Agency</em></p>
        <p class="ftr__script">${AGENT.tagline}</p>
      </div>
      <div class="ftr__meta">
        <p><a href="/coverage">Coverage</a> · <a href="/team">Team</a> · <a href="/about">About</a> · <a href="/contact">Contact</a></p>
        <p>${AGENT.legalName} &middot; License #${AGENT.license}</p>
        <p>Licensed in Colorado</p>
        <div data-carrier-logo></div>
      </div>
    </div>
    <div class="ftr__legal" data-disclosures></div>
    <p class="ftr__copy">&copy; <span data-year>2026</span> ${AGENT.agency}. All rights reserved.</p>
  </div>
</footer>

<script src="/assets/js/config.js?v=${V}"></script>
<script src="/assets/js/main.js?v=${V}"></script>
<script src="/assets/js/ally.js?v=${V}"></script>`;
}

module.exports = { head, header, footer, contact, V };
