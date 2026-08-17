/* ============================================================================
   POPPELL INSURANCE AGENCY — main.js
   Hydrates the page from window.SITE (assets/js/config.js), builds the
   signature artwork, and orchestrates the motion.

   No carrier-specific string appears in this file. All of it comes from
   config.js so a carrier change never touches code.
   ==========================================================================*/
(function () {
  'use strict';

  var S = window.SITE;
  if (!S) { console.error('config.js did not load'); return; }

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var A = S.agent, C = S.carrier;

  /* -------------------------------------------------- NEEDS marker
     Unverified values render as a visible amber flag rather than
     collapsing to nothing. */
  function needs(field) { return '<span class="needs">Needs ' + field + '</span>'; }
  function fill(sel, value, field) {
    $$(sel).forEach(function (el) {
      if (value) { el.textContent = value; } else { el.innerHTML = needs(field); }
    });
  }

  /* ══════════════════════════════════════════ 1. TEXT + LINKS */

  fill('[data-phone]', A.phone, 'phone');
  fill('[data-email]', A.email, 'email');
  fill('[data-agent-name]', A.name, 'name');
  fill('[data-agent-legal]', A.legalName || A.name, 'legal name');
  fill('[data-agent-title]', A.title, 'title');
  fill('[data-tagline]', A.tagline, 'tagline');
  fill('[data-creed]', A.creed, 'creed');
  fill('[data-license]', A.license, 'license number');
  fill('[data-year]', String(S.site.year), 'year');

  $$('[data-phone-label]').forEach(function (el) {
    el.textContent = A.phone ? 'Call ' + A.phone : 'Call';
  });
  $$('[data-tel]').forEach(function (el) {
    if (A.phone) { el.setAttribute('href', 'tel:+1' + A.phone.replace(/\D/g, '')); }
    else { el.removeAttribute('href'); }
  });
  $$('[data-mail]').forEach(function (el) {
    if (A.email) { el.setAttribute('href', 'mailto:' + A.email); }
    else { el.removeAttribute('href'); }
  });

  var li = $('[data-licensed-in]');
  if (li) {
    li.innerHTML = (A.licensedIn && A.licensedIn.length)
      ? 'Licensed in ' + A.licensedIn.join(', ') : needs('licensed states');
  }

  var addr = $('[data-address]');
  if (addr) {
    var ad = A.address;
    addr.innerHTML = (ad && ad.street)
      ? ad.street + '<br>' + (ad.unit ? ad.unit + '<br>' : '') +
        ad.city + ', ' + ad.state + ' ' + ad.zip +
        (ad.mapUrl ? '<br><a href="' + ad.mapUrl + '" target="_blank" rel="noopener">Get directions</a>' : '')
      : needs('office address');
  }

  var hrs = $('[data-hours]');
  if (hrs) {
    hrs.innerHTML = A.hours
      ? A.hours.map(function (h) { return '<div>' + h + '</div>'; }).join('')
      : needs('office hours');
  }

  var about = $('[data-about]');
  if (about) {
    about.innerHTML = S.about
      ? S.about.map(function (p) { return '<p>' + p + '</p>'; }).join('')
      : '<p>' + needs('about copy \u2014 a real paragraph in her voice') + '</p>';
  }

  var codes = $('[data-agency-codes]');
  if (codes) {
    if (C.agencyCodes) { codes.textContent = 'Agency ' + C.agencyCodes; }
    else { codes.remove(); }
  }

  var port = $('[data-portrait]');
  if (port) {
    port.innerHTML = A.portrait
      ? '<img src="' + A.portrait + '" alt="' + A.name + '" width="800" height="800">'
      : needs('headshot');
  }

  var cl = $('[data-creed-list]');
  if (cl && A.creed) {
    cl.innerHTML = A.creed.split('.').map(function (s) { return s.trim(); })
      .filter(Boolean).map(function (s) { return '<li>' + s + '.</li>'; }).join('');
  }

  var clogo = $('[data-carrier-logo]');
  if (clogo && C.logo) {
    clogo.innerHTML = '<img src="' + C.logo + '" alt="' + C.name + '" loading="lazy">';
  }

  var dis = $('[data-disclosures]');
  if (dis) {
    dis.innerHTML = (C.disclosures && C.disclosures.length)
      ? C.disclosures.map(function (p) { return '<p>' + p + '</p>'; }).join('')
      : '<p>' + needs('carrier disclosures') + '</p>';
  }

  /* ══════════════════════════════════════════ 2. COVERAGE ROWS */

  // Icons redrawn as open strokes so they inherit brand colour and can be
  // drawn on. Motifs follow her card: house, pickup, heart, storefront.
  var ICON = {
    property: '<svg viewBox="0 0 64 52"><path d="M4 26 32 5l28 21"/><path d="M11 22v25h42V22"/><path d="M26 47V33h12v14"/><path d="M44 12V6h6v11"/></svg>',
    auto:     '<svg viewBox="0 0 76 44"><path d="M4 31V19h14l7-11h16l3 11h28v12"/><path d="M18 19v-8"/><circle cx="19" cy="33" r="6"/><circle cx="57" cy="33" r="6"/><path d="M25 33h26"/><path d="M4 31h9M63 31h9"/></svg>',
    life:     '<svg viewBox="0 0 60 52"><path d="M30 45S8 32 8 19a11 11 0 0 1 22-4 11 11 0 0 1 22 4c0 13-22 26-22 26z"/><path d="M14 43c-4 2-7 5-9 8M46 43c4 2 7 5 9 8"/></svg>',
    business: '<svg viewBox="0 0 62 50"><path d="M4 21v25h54V21"/><path d="M2 21 8 4h46l6 17z"/><path d="M24 46V31h14v15"/><path d="M13 29h6v8h-6z"/><path d="M43 29h6v8h-6z"/></svg>'
  };

  var rows = $('[data-coverage]');
  if (rows) {
    rows.innerHTML = S.coverage.map(function (c) {
      return '' +
        '<article class="row reveal">' +
          '<div class="row__icon">' + (ICON[c.id] || '') + '</div>' +
          '<div class="row__head">' +
            '<h3 class="row__label">' + c.label + '</h3>' +
            '<p class="row__lede">' + c.lede + '</p>' +
          '</div>' +
          '<div class="row__copy"><p class="row__body">' + c.body + '</p></div>' +
        '</article>';
    }).join('');

    // Measure each shape so the draw-on is exact rather than guessed, then
    // replay it whenever the reader enters the row.
    $$('.row', rows).forEach(function (row) {
      $$('.row__icon svg *', row).forEach(function (s) {
        var len = 320;
        try { len = s.getTotalLength(); } catch (e) {}
        s.style.strokeDasharray = Math.ceil(len);
        s.style.setProperty('--len', Math.ceil(len));
      });
      if (REDUCED) { return; }
      row.addEventListener('mouseenter', function () {
        row.classList.remove('is-drawing');
        void row.offsetWidth;             // force reflow so the animation restarts
        row.classList.add('is-drawing');
      });
    });
  }

  /* ══════════════════════════════════════════ 2b. SPECIALTY */

  var spec = $('[data-specialty]');
  if (spec && S.specialty) {
    spec.innerHTML = S.specialty.map(function (s, i) {
      return '<article class="spec__item reveal" data-d="' + (i + 1) + '">' +
        '<h3 class="spec__label">' + s.label + '</h3>' +
        '<p class="spec__body">' + s.body + '</p>' +
      '</article>';
    }).join('');
  }

  /* ══════════════════════════════════════════ 2c. TEAM
     A direct line per person is the whole argument of the page, so a
     missing title fails loudly — a name floating above a phone number
     with no role is worse than an obvious gap. */

  var crew = $('[data-team]');
  if (crew && S.team) {
    crew.innerHTML = S.team.map(function (m, i) {
      var tel = m.phone ? 'tel:+1' + m.phone.replace(/\D/g, '') : null;
      return '' +
      '<article class="mate reveal" data-d="' + (i + 1) + '">' +
        '<div class="mate__arch">' +
          (m.portrait
            ? '<img src="' + m.portrait + '" alt="' + m.name + '" width="800" height="800" loading="lazy">'
            : '<span class="mate__ph">' + needs('headshot') + '</span>') +
        '</div>' +
        '<h3 class="mate__name">' + m.name + '</h3>' +
        '<p class="mate__title">' + (m.title || needs('job title')) + '</p>' +
        (tel
          ? '<a class="mate__tel" href="' + tel + '">' + m.phone + '</a>'
          : '<span class="mate__tel">' + needs('direct line') + '</span>') +
        (m.email
          ? '<a class="mate__mail" href="mailto:' + m.email + '">' + m.email + '</a>'
          : '') +
      '</article>';
    }).join('');
  }

  /* ══════════════════════════════════════════ 3. MARQUEE
     Her creed set running, straight off the bottom rule of her card.
     Duplicated once so the -50% translate loops seamlessly. */

  var mq = $('[data-marquee]');
  if (mq && A.creed) {
    var unit = '<span class="marquee__item">' + A.creed + '<i>\u2726</i></span>';
    var run = '';
    for (var i = 0; i < 6; i++) { run += unit; }
    mq.innerHTML = run + run;
  }

  /* ══════════════════════════════════════════ 4. THE ARCH SUN
     The sun disc from her banner, turning slowly behind the portrait. */

  var sun = $('[data-sun]');
  if (sun) {
    var rays = '';
    for (var r = 0; r < 24; r++) {
      var a1 = (r / 24) * Math.PI * 2;
      var x1 = 100 + Math.cos(a1) * 78, y1 = 100 + Math.sin(a1) * 78;
      var x2 = 100 + Math.cos(a1) * (r % 2 ? 86 : 92), y2 = 100 + Math.sin(a1) * (r % 2 ? 86 : 92);
      rays += '<path d="M' + x1.toFixed(1) + ' ' + y1.toFixed(1) +
              ' L' + x2.toFixed(1) + ' ' + y2.toFixed(1) + '"/>';
    }
    sun.innerHTML = '<svg viewBox="0 0 200 200" role="presentation" focusable="false">' +
      '<circle class="disc" cx="100" cy="100" r="62"/>' +
      '<circle cx="100" cy="100" r="72"/>' +
      '<circle cx="100" cy="100" r="78"/>' + rays + '</svg>';
  }

  /* ══════════════════════════════════════════ 5. THE RIDGELINE
     Signature. A hand-authored Colorado range with pines and a heart, drawn
     from the mountains in her logo, flanked by the rule / mark / rule rhythm
     her business card uses between coverage items. */

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

  /* ══════════════════════════════════════════ 6. SPLIT HEADLINE
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
      s.style.transitionDelay = (0.28 + i * 0.045).toFixed(3) + 's';
    });
  });

  /* ══════════════════════════════════════════ 7. JOTFORM */

  var jf = $('[data-jotform]');
  if (jf) {
    if (S.jotformUrl) {
      jf.classList.add('is-loading');
      jf.innerHTML = '<p class="formwrap__wait">Loading the quote form\u2026</p>' +
        '<iframe title="Request a quote" src="' + S.jotformUrl +
        '" height="760" scrolling="no" allow="geolocation; microphone; camera"></iframe>';

      jf.querySelector('iframe').addEventListener('load', function () {
        jf.classList.remove('is-loading');
      });
      // If the embed never loads (blocked, offline, form deleted), fall back
      // to the phone rather than leaving a dead box on the page.
      setTimeout(function () {
        if (!jf.classList.contains('is-loading')) { return; }
        jf.innerHTML = '<div class="ph"><p>The quote form is not loading right now. Call ' +
          '<a href="tel:+1' + (A.phone || '').replace(/\D/g, '') + '">' +
          (A.phone || 'the office') + '</a> and we will take it over the phone.</p></div>';
        jf.classList.remove('is-loading');
      }, 8000);

      window.addEventListener('message', function (e) {
        if (typeof e.data !== 'string' || e.data.indexOf('setHeight') === -1) { return; }
        var h = parseInt(e.data.split(':')[1], 10);
        var f = jf.querySelector('iframe');
        if (f && h > 0) { f.style.height = h + 'px'; }
      });
    } else {
      jf.innerHTML = '<div class="ph">' + needs('Jotform URL') +
        '<p>Paste the form URL into <code>jotformUrl</code> in config.js.</p></div>';
    }
  }

  /* ══════════════════════════════════════════ 8. SCROLL ORCHESTRATION */

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
  var onScroll = function () { hdr.classList.toggle('is-stuck', window.scrollY > 40); };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── hero parallax: the banner drifts at 0.22x while the copy holds still */
  var art = $('#heroArt img');
  if (art && !REDUCED) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) { return; }
      ticking = true;
      requestAnimationFrame(function () {
        var y = Math.min(window.scrollY, 700);
        art.style.transform = 'translate3d(0,' + (y * 0.22) + 'px,0)';
        ticking = false;
      });
    }, { passive: true });
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
