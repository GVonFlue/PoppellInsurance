/* ============================================================================
   POPPELL INSURANCE AGENCY — main.js
   Hydrates the page from window.SITE (assets/js/config.js), draws the
   ridgeline signature, and runs the scroll reveals.

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

  /* -------------------------------------------------- NEEDS marker
     Unverified values render as a visible amber flag rather than
     collapsing to nothing. */
  function needs(field) {
    return '<span class="needs">Needs ' + field + '</span>';
  }
  function fill(sel, value, field) {
    $$(sel).forEach(function (el) {
      if (value) { el.textContent = value; }
      else { el.innerHTML = needs(field); }
    });
  }

  /* ══════════════════════════════════════════ 1. TEXT + LINKS */

  var A = S.agent, C = S.carrier;

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

  // Quote buttons point at the carrier quote URL when there is one,
  // otherwise they scroll to the on-page form.
  $$('a[href="#quote"]').forEach(function (el) {
    el.dataset.carrierQuote = C.quoteUrl || '';
  });

  /* ── licensed-in line */
  var li = $('[data-licensed-in]');
  if (li) {
    li.innerHTML = (A.licensedIn && A.licensedIn.length)
      ? 'Licensed in ' + A.licensedIn.join(', ')
      : needs('licensed states');
  }

  /* ── address */
  var addr = $('[data-address]');
  if (addr) {
    var ad = A.address;
    if (ad && ad.street) {
      addr.innerHTML =
        ad.street + '<br>' +
        (ad.unit ? ad.unit + '<br>' : '') +
        ad.city + ', ' + ad.state + ' ' + ad.zip +
        (ad.mapUrl ? '<br><a href="' + ad.mapUrl + '" target="_blank" rel="noopener">Get directions</a>' : '');
    } else {
      addr.innerHTML = needs('office address');
    }
  }

  /* ── hours */
  var hrs = $('[data-hours]');
  if (hrs) {
    hrs.innerHTML = A.hours
      ? A.hours.map(function (h) { return '<div>' + h + '</div>'; }).join('')
      : needs('office hours');
  }

  /* ── bio */
  var bio = $('[data-bio]');
  if (bio) {
    bio.innerHTML = A.bio
      ? A.bio.map(function (p) { return '<p>' + p + '</p>'; }).join('')
      : '<p>' + needs('about copy — 2\u20133 paragraphs in her own voice') + '</p>';
  }

  /* ── portrait */
  var port = $('[data-portrait]');
  if (port) {
    port.innerHTML = A.portrait
      ? '<img src="' + A.portrait + '" alt="' + A.name + '" width="800" height="1000">'
      : needs('headshot');
  }

  /* ── creed, split into its three claims */
  var cl = $('[data-creed-list]');
  if (cl && A.creed) {
    cl.innerHTML = A.creed.split('.').map(function (s) { return s.trim(); })
      .filter(Boolean)
      .map(function (s) { return '<li>' + s + '.</li>'; }).join('');
  }

  /* ── carrier logo (footer only) */
  var clogo = $('[data-carrier-logo]');
  if (clogo && C.logo) {
    clogo.innerHTML = '<img src="' + C.logo + '" alt="' + C.name + '" loading="lazy">';
  }

  /* ── disclosures */
  var dis = $('[data-disclosures]');
  if (dis) {
    dis.innerHTML = (C.disclosures && C.disclosures.length)
      ? C.disclosures.map(function (p) { return '<p>' + p + '</p>'; }).join('')
      : '<p>' + needs('carrier disclosures') + '</p>';
  }

  /* ══════════════════════════════════════════ 2. COVERAGE CARDS */

  // Icons redrawn as strokes so they can inherit brand color and animate.
  // Motifs follow her card: house, pickup, heart, boots.
  var ICON = {
    property: '<svg viewBox="0 0 64 52"><path d="M4 26 32 5l28 21"/><path d="M11 22v25h42V22"/><path d="M26 47V33h12v14"/><path d="M44 12V6h6v11"/></svg>',
    auto:     '<svg viewBox="0 0 76 44"><path d="M4 31V19h14l7-11h16l3 11h28v12"/><path d="M18 19v-8"/><circle cx="19" cy="33" r="6"/><circle cx="57" cy="33" r="6"/><path d="M25 33h26"/><path d="M4 31h9M63 31h9"/></svg>',
    life:     '<svg viewBox="0 0 60 52"><path d="M30 45S8 32 8 19a11 11 0 0 1 22-4 11 11 0 0 1 22 4c0 13-22 26-22 26z"/><path d="M14 43c-4 2-7 5-9 8M46 43c4 2 7 5 9 8"/></svg>',
    business: '<svg viewBox="0 0 62 50"><path d="M4 21v25h54V21"/><path d="M2 21 8 4h46l6 17z"/><path d="M24 46V31h14v15"/><path d="M13 29h6v8h-6z"/><path d="M43 29h6v8h-6z"/></svg>'
  };

  var grid = $('[data-coverage]');
  if (grid) {
    grid.innerHTML = S.coverage.map(function (c, i) {
      return '' +
        '<article class="card reveal" data-d="' + (i % 4) + '">' +
          '<div class="card__icon">' + (ICON[c.id] || '') + '</div>' +
          '<h3 class="card__label">' + c.label + '</h3>' +
          '<span class="card__heart">\u2665</span>' +
          '<p class="card__lede">' + c.lede + '</p>' +
          '<p class="card__body">' + c.body + '</p>' +
        '</article>';
    }).join('');
  }

  /* ══════════════════════════════════════════ 3. JOTFORM */

  var jf = $('[data-jotform]');
  if (jf) {
    if (S.jotformUrl) {
      jf.innerHTML = '<iframe title="Request a quote" src="' + S.jotformUrl +
        '" height="820" scrolling="no" allow="geolocation; microphone; camera"></iframe>';
      // Jotform posts its rendered height; resize to match so there's no
      // inner scrollbar.
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

  /* ══════════════════════════════════════════ 4. THE RIDGELINE
     Signature element. A hand-authored Colorado ridgeline derived from the
     mountain motif in her logo. It draws itself on load, then reappears as
     every section divider — the structure of the page is the skyline. */

  // A fixed-aspect emblem flanked by hairline rules — the same
  // rule / mark / rule rhythm her business card uses between coverage
  // items, scaled up and given her mountains as the mark.
  function ridgeSVG() {
    // baseline y = 54, four peaks stepping up to the right, three pines
    // at the range's foot — the arrangement in her logo.
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
      '<path d="' + behind + '"/>' +
      '<path d="' + range + '"/>' +
      pines +
      '<path class="glyph" d="M80 3c-1.6-2.4-5.4-1.5-5.4 1.4 0 2.3 3.1 4.4 5.4 6 2.3-1.6 5.4-3.7 5.4-6 0-2.9-3.8-3.8-5.4-1.4z"/>' +
    '</svg>';
  }

  $$('[data-ridge]').forEach(function (el) {
    el.innerHTML =
      '<span class="ridge__rule"></span>' +
      '<span class="ridge__star">\u2726</span>' +
      ridgeSVG() +
      '<span class="ridge__star">\u2726</span>' +
      '<span class="ridge__rule"></span>';

    // Measure each path so the dash animation is exact rather than guessed.
    $$('path', el).forEach(function (p) {
      if (p.classList.contains('glyph')) { return; }
      var len = 0;
      try { len = p.getTotalLength(); } catch (e) { len = 400; }
      p.style.setProperty('--len', Math.ceil(len));
    });
  });

  /* ══════════════════════════════════════════ 5. SCROLL BEHAVIOUR */

  if (REDUCED || !('IntersectionObserver' in window)) {
    $$('.reveal').forEach(function (el) { el.classList.add('is-in'); });
    $$('[data-ridge]').forEach(function (el) { el.classList.add('is-drawn'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) { return; }
        e.target.classList.add(e.target.hasAttribute('data-ridge') ? 'is-drawn' : 'is-in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    $$('.reveal, [data-ridge]').forEach(function (el) { io.observe(el); });
  }

  /* ── sticky header */
  var hdr = $('#hdr');
  var onScroll = function () {
    hdr.classList.toggle('is-stuck', window.scrollY > 40);
  };
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
