/* ============================================================================
   POPPELL INSURANCE AGENCY — main.js

   This file no longer generates page content. All copy, the team, the
   address, phones and hours are static in index.html so they exist in the
   served document for crawlers that do not execute JavaScript.

   What remains here:
     1. Carrier hydration  — disclosures from every carrier she represents
     1b. Customer actions  — payment/claims link-outs, with safe fallbacks
     1c. Reviews           — off until switched on in config
     2. Domain injection   — url/@id into JSON-LD, absolute OG URLs
     3. Jotform embed
     4. Signature artwork  — ridgeline, arch sun, coverage icons
     5. Motion             — split headline, marquee, reveals, parallax
   ==========================================================================*/
(function () {
  'use strict';

  var S = window.SITE || {};

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function needs(field) { return '<span class="needs">Needs ' + field + '</span>'; }

  /* ══════════════════════════════════════════ 1. CARRIERS
     Disclosures from every carrier she represents, concatenated in array
     order. Adding a carrier is a config edit; nothing here changes. */

  var CARRIERS = (S.carriers && S.carriers.length) ? S.carriers : [];

  var clogo = $('[data-carrier-logo]');
  if (clogo) {
    var logos = CARRIERS.filter(function (c) { return c.logo; });
    if (logos.length) {
      clogo.innerHTML = logos.map(function (c) {
        return '<img src="' + c.logo + '" alt="' + (c.name || '') + '" loading="lazy">';
      }).join('');
    }
  }

  // Disclosures fail loudly. A legal block that quietly collapses to nothing
  // is how a licensee gets in trouble.
  var dis = $('[data-disclosures]');
  if (dis) {
    var paras = CARRIERS.reduce(function (acc, c) {
      return acc.concat(c.disclosures || []);
    }, []);
    dis.innerHTML = paras.length
      ? paras.map(function (p) { return '<p>' + p + '</p>'; }).join('')
      : '<p>' + needs('carrier disclosures') + '</p>';
  }

  var yr = $('[data-year]');
  if (yr && S.site && S.site.year) { yr.textContent = String(S.site.year); }

  /* ══════════════════════════════════════════ 1b. CUSTOMER ACTIONS
     Payment and claims route to the carrier's own systems and are never
     rebuilt here. With no URL yet, each tile degrades to a phone link so a
     customer is never stranded, and carries a NEEDS marker so the section
     cannot quietly ship half-finished. */

  var CUST = S.customer || {};
  var custPhone = (CUST.fallbackPhone || '').replace(/\D/g, '');

  [['payment', CUST.paymentUrl, 'carrier payment URL', 'Pay online'],
   ['claims',  CUST.claimsUrl,  'carrier claims URL',  'Start a claim']
  ].forEach(function (cfg) {
    var el = $('[data-svc="' + cfg[0] + '"]');
    if (!el) { return; }
    var label = el.querySelector('.svc__label');
    var labelText = label ? label.textContent : '';

    if (cfg[1]) {
      var a = document.createElement('a');
      a.className = el.className;
      a.setAttribute('href', cfg[1]);
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener');
      a.innerHTML = '<span class="svc__label">' + labelText + '</span>' +
                    '<span class="svc__meta">' + cfg[3] + '</span>';
      el.parentNode.replaceChild(a, el);
    } else {
      el.innerHTML = '<span class="svc__label">' + labelText + '</span>' +
        (custPhone
          ? '<span class="svc__meta"><a href="tel:+1' + custPhone + '">Call ' +
            CUST.fallbackPhone + '</a></span>'
          : '') +
        '<span class="svc__needs">' + needs(cfg[2]) + '</span>';
    }
  });

  /* ══════════════════════════════════════════ 1c. REVIEWS
     Renders nothing at all unless switched on in config and populated. */

  var rv = $('[data-reviews]');
  var RV = S.reviews || {};
  if (rv && RV.enabled && RV.items && RV.items.length) {
    rv.removeAttribute('hidden');
    rv.innerHTML =
      '<div class="wrap">' +
        '<p class="eyebrow reveal"><span class="star">\u2726</span> Reviews</p>' +
        '<h2 class="h2 reveal" data-d="1">' + (RV.heading || 'What clients say') + '</h2>' +
        '<div class="revs">' +
          RV.items.map(function (r, i) {
            return '<figure class="rev reveal" data-d="' + ((i % 3) + 1) + '">' +
              '<blockquote class="rev__q">' + r.quote + '</blockquote>' +
              '<figcaption class="rev__a">' + r.author +
                (r.context ? '<span class="rev__c">' + r.context + '</span>' : '') +
              '</figcaption>' +
            '</figure>';
          }).join('') +
        '</div>' +
      '</div>';
  }

  /* ══════════════════════════════════════════ 2. DOMAIN
     Absolute URLs matter for Open Graph (relative image paths are ignored
     by most scrapers) and for the JSON-LD identity. Both are skipped
     entirely until a real domain exists — a wrong absolute URL is worse
     than a missing one. */

  var domain = S.site && S.site.domain;
  if (domain) {
    var origin = 'https://' + String(domain).replace(/^https?:\/\//, '').replace(/\/$/, '');

    var ld = $('#ld-business');
    if (ld) {
      try {
        var data = JSON.parse(ld.textContent);
        data.url = origin + '/';
        data['@id'] = origin + '/#agency';
        if (data.image && data.image.charAt(0) === '/') { data.image = origin + data.image; }
        if (data.founder && data.founder.image && data.founder.image.charAt(0) === '/') {
          data.founder.image = origin + data.founder.image;
        }
        ld.textContent = JSON.stringify(data);
      } catch (e) { console.error('JSON-LD parse failed', e); }
    }

    [['meta[property="og:image"]', 'content'],
     ['meta[name="twitter:image"]', 'content']].forEach(function (pair) {
      var el = $(pair[0]);
      if (el && el.getAttribute(pair[1]).charAt(0) === '/') {
        el.setAttribute(pair[1], origin + el.getAttribute(pair[1]));
      }
    });

    var ogUrl = document.createElement('meta');
    ogUrl.setAttribute('property', 'og:url');
    ogUrl.setAttribute('content', origin + '/');
    document.head.appendChild(ogUrl);
  }

  /* ══════════════════════════════════════════ 3. JOTFORM */

  var jf = $('[data-jotform]');
  if (jf) {
    if (S.jotformUrl) {
      jf.classList.add('is-loading');
      jf.innerHTML =
        '<p class="formwrap__wait">Loading the quote form\u2026</p>' +
        '<iframe title="Request an insurance quote" src="' + S.jotformUrl +
        '" height="760" scrolling="no" allow="geolocation; microphone; camera"></iframe>' +
        '<p class="formwrap__alt">Trouble with the form? ' +
        '<a href="' + S.jotformUrl + '" target="_blank" rel="noopener">Open it in a new tab</a>' +
        ' or call <a href="tel:+17195639712">719-563-9712</a>.</p>';

      var frame = jf.querySelector('iframe');
      var revealed = false;

      // NEVER destroy the iframe. An earlier version replaced it after a
      // timeout, which meant a merely-slow form was killed before it could
      // appear. The timers below only ever reveal or annotate.
      function reveal() {
        if (revealed) { return; }
        revealed = true;
        jf.classList.remove('is-loading');
        var w = jf.querySelector('.formwrap__wait');
        if (w) { w.remove(); }
      }

      frame.addEventListener('load', function () {
        reveal();
        clearTimeout(slowTimer);
        var n = jf.querySelector('.formwrap__slow');
        if (n) { n.remove(); }
      });

      // Show it regardless after 4s so a slow form renders progressively
      // instead of sitting behind a spinner.
      setTimeout(reveal, 4000);

      // Non-destructive nudge if it is really dragging.
      var slowTimer = setTimeout(function () {
        if (jf.querySelector('.formwrap__slow')) { return; }
        var d = document.createElement('p');
        d.className = 'formwrap__slow';
        d.innerHTML = 'This is taking longer than it should. You can ' +
          '<a href="' + S.jotformUrl + '" target="_blank" rel="noopener">open the form in a new tab</a>' +
          ' or call <a href="tel:+17195639712">719-563-9712</a> and we will take it over the phone.';
        jf.insertBefore(d, jf.firstChild);
      }, 12000);

      window.addEventListener('message', function (e) {
        if (typeof e.data !== 'string' || e.data.indexOf('setHeight') === -1) { return; }
        var h = parseInt(e.data.split(':')[1], 10);
        var f = jf.querySelector('iframe');
        if (f && h > 0) { f.style.height = h + 'px'; }
      });
    } else {
      jf.innerHTML = '<div class="ph">' + needs('Jotform URL') + '</div>';
    }
  }

  /* ══════════════════════════════════════════ 4. COVERAGE ICONS
     Open strokes so they inherit brand colour and can be drawn on. Motifs
     follow her business card: house, pickup, heart, storefront. */

  var ICON = {
    property: '<svg viewBox="0 0 64 52"><path d="M4 26 32 5l28 21"/><path d="M11 22v25h42V22"/><path d="M26 47V33h12v14"/><path d="M44 12V6h6v11"/></svg>',
    auto:     '<svg viewBox="0 0 76 44"><path d="M4 31V19h14l7-11h16l3 11h28v12"/><path d="M18 19v-8"/><circle cx="19" cy="33" r="6"/><circle cx="57" cy="33" r="6"/><path d="M25 33h26"/><path d="M4 31h9M63 31h9"/></svg>',
    life:     '<svg viewBox="0 0 60 52"><path d="M30 45S8 32 8 19a11 11 0 0 1 22-4 11 11 0 0 1 22 4c0 13-22 26-22 26z"/><path d="M14 43c-4 2-7 5-9 8M46 43c4 2 7 5 9 8"/></svg>',
    business: '<svg viewBox="0 0 62 50"><path d="M4 21v25h54V21"/><path d="M2 21 8 4h46l6 17z"/><path d="M24 46V31h14v15"/><path d="M13 29h6v8h-6z"/><path d="M43 29h6v8h-6z"/></svg>'
  };

  $$('[data-icon]').forEach(function (slot) {
    var svg = ICON[slot.getAttribute('data-icon')];
    if (!svg) { return; }
    slot.innerHTML = svg;

    var row = slot.closest('.row');
    $$('svg *', slot).forEach(function (s) {
      var len = 320;
      try { len = s.getTotalLength(); } catch (e) {}
      s.style.strokeDasharray = Math.ceil(len);
      s.style.setProperty('--len', Math.ceil(len));
    });
    if (REDUCED || !row) { return; }
    row.addEventListener('mouseenter', function () {
      row.classList.remove('is-drawing');
      void row.offsetWidth;                 // force reflow so it restarts
      row.classList.add('is-drawing');
    });
  });

  /* ══════════════════════════════════════════ 4b. LIVING SKY
     Her banner's cream ground is keyed transparent in the .webp, so these
     layers read as sky behind her artwork. The artwork itself is never cut
     apart — the logo lockup stays one image and is never distorted. */

  var sky = $('[data-sky]');
  if (sky) {
    // Sun glow sits where her painted sun already is, ~93% across, ~23% down.
    var birds = '';
    // Scale is in viewBox units on a 200-wide canvas — a bird at scale 1
    // would be 7% of the hero's width. These are distant birds.
    var flock = [
      { y: 13, s: 0.22, dur: 78,  delay: 0 },
      { y:  9, s: 0.16, dur: 96,  delay: -26 },
      { y: 18, s: 0.13, dur: 116, delay: -54 }
    ];
    flock.forEach(function (b) {
      birds +=
        '<g class="bird-g" style="animation-duration:' + b.dur + 's;' +
        'animation-delay:' + b.delay + 's">' +
          '<g transform="translate(0,' + b.y + ') scale(' + b.s + ')">' +
            '<g class="bird-flap" style="animation-delay:' + (b.delay / 7) + 's">' +
              '<path class="bird" d="M0 4 L3.4 0 L6.8 4"/>' +
              '<path class="bird" d="M9 6.4 L11.6 3.2 L14.2 6.4"/>' +
            '</g>' +
          '</g>' +
        '</g>';
    });

    sky.innerHTML =
      '<svg viewBox="0 0 200 84" preserveAspectRatio="xMidYMid slice" role="presentation" focusable="false">' +
        '<defs>' +
          '<radialGradient id="sunGlow">' +
            '<stop offset="0%"  stop-color="#E8C7A6" stop-opacity=".85"/>' +
            '<stop offset="55%" stop-color="#E8C7A6" stop-opacity=".28"/>' +
            '<stop offset="100%" stop-color="#E8C7A6" stop-opacity="0"/>' +
          '</radialGradient>' +
        '</defs>' +
        '<circle class="sky__glow" cx="186" cy="19" r="26" fill="url(#sunGlow)"/>' +
        // No second ridgeline. Her banner already has a mountain range and
        // a competing one behind the wordmark reads as a stray line, not depth.
        birds +
      '</svg>';
  }

  /* ── drifting motes, in front of the artwork */
  var motes = $('[data-motes]');
  if (motes && !REDUCED) {
    var m = '';
    for (var k = 0; k < 16; k++) {
      var sz = (1.5 + Math.random() * 2.4).toFixed(1);
      m += '<span class="mote" style="' +
        'left:' + (Math.random() * 100).toFixed(1) + '%;' +
        'top:' + (35 + Math.random() * 60).toFixed(1) + '%;' +
        'width:' + sz + 'px;height:' + sz + 'px;' +
        'animation-duration:' + (9 + Math.random() * 11).toFixed(1) + 's;' +
        'animation-delay:' + (-Math.random() * 18).toFixed(1) + 's"></span>';
    }
    motes.innerHTML = m;
  }

  /* ══════════════════════════════════════════ 5. MARQUEE
     Her creed set running, straight off the bottom rule of her card.
     Duplicated so the -50% translate loops seamlessly. The accessible copy
     of this text is a static .sr-only paragraph in the HTML. */

  var mq = $('[data-marquee]');
  if (mq) {
    var unit = '<span class="marquee__item">Local service. Real relationships. Reliable protection.<i>\u2726</i></span>';
    var run = '';
    for (var i = 0; i < 6; i++) { run += unit; }
    mq.innerHTML = run + run;
  }

  /* ══════════════════════════════════════════ 6. ARCH SUN
     The sun disc from her banner, turning slowly behind the portrait. */

  var sun = $('[data-sun]');
  if (sun) {
    var rays = '';
    for (var r = 0; r < 24; r++) {
      var a = (r / 24) * Math.PI * 2;
      var x1 = 100 + Math.cos(a) * 78, y1 = 100 + Math.sin(a) * 78;
      var rad = r % 2 ? 86 : 92;
      var x2 = 100 + Math.cos(a) * rad, y2 = 100 + Math.sin(a) * rad;
      rays += '<path d="M' + x1.toFixed(1) + ' ' + y1.toFixed(1) +
              ' L' + x2.toFixed(1) + ' ' + y2.toFixed(1) + '"/>';
    }
    sun.innerHTML = '<svg viewBox="0 0 200 200" role="presentation" focusable="false">' +
      '<circle class="disc" cx="100" cy="100" r="62"/>' +
      '<circle cx="100" cy="100" r="72"/><circle cx="100" cy="100" r="78"/>' +
      rays + '</svg>';
  }

  /* ══════════════════════════════════════════ 7. RIDGELINE
     Signature. A hand-authored Colorado range with pines and a heart, drawn
     from the mountains in her logo, flanked by the rule / mark / rule
     rhythm her business card uses between coverage items. */

  function ridgeSVG() {
    var range = 'M2 54 L32 28 L50 40 L80 12 L104 38 L124 24 L146 54';
    var behind = 'M92 54 L118 36 L136 46 L152 32 L172 54';
    var pines = '';
    [180, 190, 200].forEach(function (x, i) {
      var ht = 17 - (i === 1 ? 0 : 4);
      pines += '<path class="tree" d="M' + x + ' 54 V' + (54 - ht) +
               ' M' + (x - 4.5) + ' ' + (54 - ht * 0.34) +
               ' L' + x + ' ' + (54 - ht * 0.64) +
               ' L' + (x + 4.5) + ' ' + (54 - ht * 0.34) + '"/>';
    });
    return '<svg class="ridge__peaks" viewBox="0 0 208 60" role="presentation" focusable="false">' +
      '<path d="' + behind + '"/><path d="' + range + '"/>' + pines +
      '<path class="glyph" d="M80 3c-1.6-2.4-5.4-1.5-5.4 1.4 0 2.3 3.1 4.4 5.4 6 2.3-1.6 5.4-3.7 5.4-6 0-2.9-3.8-3.8-5.4-1.4z"/></svg>';
  }

  $$('[data-ridge]').forEach(function (el) {
    el.innerHTML = '<span class="ridge__rule"></span><span class="ridge__star">\u2726</span>' +
      ridgeSVG() + '<span class="ridge__star">\u2726</span><span class="ridge__rule"></span>';
    $$('path', el).forEach(function (p) {
      if (p.classList.contains('glyph')) { return; }
      var len = 400;
      try { len = p.getTotalLength(); } catch (e) {}
      p.style.setProperty('--len', Math.ceil(len));
    });
  });

  /* ══════════════════════════════════════════ 8. SPLIT HEADLINE
     Each word rides up out of its own mask. Kept to the h1 only — doing it
     to every heading is what makes a page feel machine-made. */

  $$('[data-split]').forEach(function (el) {
    var walk = function (node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (tok) {
            if (!tok) { return; }
            if (/^\s+$/.test(tok)) { frag.appendChild(document.createTextNode(' ')); return; }
            var w = document.createElement('span');
            w.className = 'word';
            var inner = document.createElement('span');
            inner.textContent = tok;
            w.appendChild(inner);
            frag.appendChild(w);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1) { walk(n); }
      });
    };
    walk(el);
    $$('.word > span', el).forEach(function (s, i) {
      s.style.transitionDelay = (0.28 + i * 0.04).toFixed(3) + 's';
    });
  });

  /* ══════════════════════════════════════════ 9. SCROLL ORCHESTRATION */

  var SPLIT = $$('[data-split]');
  var SIGN  = $$('[data-sign]');

  if (REDUCED || !('IntersectionObserver' in window)) {
    $$('.reveal').forEach(function (el) { el.classList.add('is-in'); });
    $$('[data-ridge]').forEach(function (el) { el.classList.add('is-drawn'); });
    SPLIT.forEach(function (el) { el.classList.add('is-split-in'); });
    SIGN.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) { return; }
        var t = e.target;
        if (t.hasAttribute('data-ridge')) { t.classList.add('is-drawn'); }
        else if (t.hasAttribute('data-split')) { t.classList.add('is-split-in'); }
        else { t.classList.add('is-in'); }
        io.unobserve(t);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    $$('.reveal, [data-ridge], [data-split], [data-sign]').forEach(function (el) { io.observe(el); });

    // The h1 is above the fold — fire it on load rather than waiting.
    requestAnimationFrame(function () {
      SPLIT.forEach(function (el) { el.classList.add('is-split-in'); });
    });
  }

  /* ── sticky header */
  var hdr = $('#hdr');
  if (hdr) {
    var onScroll = function () { hdr.classList.toggle('is-stuck', window.scrollY > 40); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ── hero depth
     Three rates on scroll, plus a few pixels of pointer parallax on
     devices that actually have a pointer. The banner moves LEAST of the
     three — her artwork is the anchor; the environment moves around it. */
  var art    = $('#heroArt img');
  var skyEl  = $('[data-sky]');
  var moteEl = $('[data-motes]');

  if (!REDUCED && (art || skyEl)) {
    var sY = 0, pX = 0, pY = 0, queued = false;

    function place() {
      queued = false;
      if (skyEl)  { skyEl.style.transform  = 'translate3d(' + (pX * -14) + 'px,' + (sY * 0.10 + pY * -8) + 'px,0)'; }
      if (art)    { art.style.transform    = 'translate3d(' + (pX * 4)   + 'px,' + (sY * 0.22 + pY * 3) + 'px,0)'; }
      if (moteEl) { moteEl.style.transform = 'translate3d(' + (pX * 22)  + 'px,' + (sY * 0.34 + pY * 12) + 'px,0)'; }
    }
    function schedule() { if (!queued) { queued = true; requestAnimationFrame(place); } }

    window.addEventListener('scroll', function () {
      sY = Math.min(window.scrollY, 700);
      schedule();
    }, { passive: true });

    if (window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
      window.addEventListener('mousemove', function (e) {
        pX = (e.clientX / window.innerWidth) - 0.5;
        pY = (e.clientY / window.innerHeight) - 0.5;
        schedule();
      }, { passive: true });
    }
  }

  /* ── mobile nav */
  var burger = $('#burger'), mnav = $('#mnav');
  if (burger && mnav) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!open));
      burger.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
      mnav.classList.toggle('is-open', !open);
    });
    $$('a', mnav).forEach(function (a) {
      a.addEventListener('click', function () {
        burger.setAttribute('aria-expanded', 'false');
        mnav.classList.remove('is-open');
      });
    });
  }
})();
