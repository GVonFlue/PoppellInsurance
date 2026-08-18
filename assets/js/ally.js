/* ============================================================================
   ALLY — client
   ----------------------------------------------------------------------------
   Drives the inline widget on the homepage and a floating panel everywhere
   else, both off the same code. The thread lives in memory only; it is never
   written to storage. A visitor's conversation is their business.
   ==========================================================================*/
(function () {
  'use strict';

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var PHONE = '719-563-9712', TEL = '+17195639712';
  var GREETING = "Hi — I'm Ally. Ask me about home, auto, life, business or umbrella coverage and I'll give you a straight answer. If you'd rather talk to a person, say so and I'll point you at the office.";
  var CHIPS = [
    'What does umbrella insurance actually do?',
    'What should I bring to a policy review?',
    "What's not covered by renters insurance?",
    'I want someone to call me'
  ];

  var thread = [];      // [{role, content}] — memory only
  var busy = false;
  var captured = false;

  function esc(t) {
    return String(t).replace(/[&<>"']/g, function (c) {
      return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c];
    });
  }

  /* Linkify phone numbers only. Nothing else from the model is trusted as
     markup — everything is escaped first. */
  function render(text) {
    return esc(text)
      .replace(/(\d{3}-\d{3}-\d{4})/g, '<a href="tel:+1$1">$1</a>'.replace('$1', '$1'))
      .split('\n').filter(Boolean).map(function (p) { return '<p>' + p + '</p>'; }).join('');
  }

  /* ── the capture step machine ───────────────────────────────────────
     Deliberately deterministic. The model decides WHEN someone has agreed
     to be contacted; these steps collect WHAT they typed. A model that
     drops a digit from a phone number or "corrects" an email is worse than
     no capture at all, so it never handles those values. */
  var STEPS = [
    { key: 'name',  ask: "Great — what's your first name?",
      ok: function (v) { return v.length > 1 && v.length < 60; },
      no: "Sorry, I didn't catch that — what should I call you?" },
    { key: 'phone', ask: function (d) { return 'Thanks ' + d.name + '. Best number to reach you on?'; },
      ok: function (v) { return (v.replace(/\D/g, '').length >= 10); },
      no: "That doesn't look like a full number — could you give me all ten digits?" },
    { key: 'email', ask: 'And an email? Type skip if you\'d rather not.',
      ok: function (v) { return /^\S+@\S+\.\S+$/.test(v) || /^skip$/i.test(v); },
      no: "That doesn't look like an email — try again, or type skip." }
  ];

  function Widget(root) {
    var log   = $('[data-ally-log]', root);
    var chips = $('[data-ally-chips]', root);
    var form  = $('[data-ally-form]', root);
    var input = $('[data-ally-input]', root);
    if (!log || !form) { return null; }

    var cap = null;          // {step, data} while collecting, else null

    function bubble(who, html, cls) {
      var d = document.createElement('div');
      d.className = 'msg msg--' + who + (cls ? ' ' + cls : '');
      d.innerHTML = html;
      log.appendChild(d);
      log.scrollTop = log.scrollHeight;
      return d;
    }

    function say(text) {
      bubble('ally', render(text));
      thread.push({ role: 'assistant', content: text });
    }

    function drawChips(list) {
      if (!chips) { return; }
      var use = (list && list.length) ? list : CHIPS;
      chips.innerHTML = use.map(function (c) {
        return '<button class="chip" type="button">' + esc(c) + '</button>';
      }).join('');
      $$('.chip', chips).forEach(function (b) {
        b.addEventListener('click', function () { handle(b.textContent); });
      });
    }
    function hideChips() { if (chips) { chips.innerHTML = ''; } }

    /* ── capture ── */
    function beginCapture(ctx) {
      cap = { step: 0, data: { interest: ctx.interest || '', notes: ctx.notes || '' } };
      hideChips();
      setTimeout(function () { askStep(); }, 450);
    }
    function askStep() {
      var st = STEPS[cap.step];
      say(typeof st.ask === 'function' ? st.ask(cap.data) : st.ask);
      input.placeholder = 'Type your ' + st.key + '…';
    }
    function captureNext(text) {
      var st = STEPS[cap.step];
      if (!st.ok(text)) { say(st.no); return; }
      cap.data[st.key] = /^skip$/i.test(text) ? '' : text;
      cap.step++;
      if (cap.step < STEPS.length) { askStep(); return; }

      input.placeholder = 'Ask about coverage…';
      var d = cap.data;
      cap = null;
      deliver(d);
      say("That's everything — someone from the office will be in touch. " +
          "If you'd rather not wait, call " + PHONE + ".");
      drawChips(['Anything I should have ready?', 'What areas do you cover?']);
    }

    function deliver(d) {
      // Fire and forget. A delivery failure is never shown to the visitor —
      // telling them something went wrong loses the lead entirely.
      var summary = thread.map(function (m) {
        return (m.role === 'user' ? 'Visitor: ' : 'Ally: ') + m.content;
      }).join('\n');
      fetch('/api/lead', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ lead: {
          name: d.name, phone: d.phone, email: d.email,
          interest: d.interest, notes: d.notes,
          source: 'Poppell — Ally chat',
          summary: summary, page: location.pathname
        } })
      }).catch(function () {});
    }

    /* ── routing ── */
    function handle(text) {
      text = (text || '').trim();
      if (!text || busy) { return; }
      input.value = '';
      bubble('you', '<p>' + esc(text) + '</p>');
      if (cap) {
        // While collecting, the text never reaches the model. It is the
        // visitor's own contact data and has no business in a prompt.
        captureNext(text);
        return;
      }
      thread.push({ role: 'user', content: text });
      send();
    }

    async function send() {
      busy = true;
      hideChips();
      var typing = bubble('ally', '<span class="dots"><i></i><i></i><i></i></span>', 'is-typing');
      try {
        var r = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ messages: thread })
        });
        var data = await r.json();
        typing.remove();
        say(data.reply || 'Call ' + PHONE + ' and you will get a person straight away.');
        if (data.capture && !captured) { captured = true; beginCapture(data.capture); }
        else { drawChips(data.chips); }
      } catch (e) {
        typing.remove();
        bubble('ally', '<p>I could not reach my end just now. Call <a href="tel:' +
          TEL + '">' + PHONE + '</a> and you will get a person straight away.</p>');
        drawChips();
      }
      busy = false;
      input.focus();
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      handle(input.value);
    });

    bubble('ally', render(GREETING));
    thread.push({ role: 'assistant', content: GREETING });
    drawChips();

    return { focus: function () { input.focus(); } };
  }

  /* ── sun rings behind her, in the same language as the ridgeline ──── */
  var sunEl = document.querySelector('[data-ally-sun]');
  if (sunEl) {
    var rays = '';
    for (var i = 0; i < 32; i++) {
      var t = (i / 32) * Math.PI * 2;
      var r1 = 74, r2 = i % 2 ? 80 : 86;
      rays += '<path d="M' + (100 + Math.cos(t) * r1).toFixed(1) + ' ' + (100 + Math.sin(t) * r1).toFixed(1) +
              ' L' + (100 + Math.cos(t) * r2).toFixed(1) + ' ' + (100 + Math.sin(t) * r2).toFixed(1) + '"/>';
    }
    sunEl.insertAdjacentHTML('beforeend',
      '<svg viewBox="0 0 200 200" aria-hidden="true" focusable="false">' +
        '<circle cx="100" cy="100" r="62" stroke-width="1"/>' +
        '<circle cx="100" cy="100" r="70" stroke-width="1"/>' + rays + '</svg>');
  }

  /* ── inline widget (homepage) ─────────────────────────────────────── */
  var inlineRoot = $('#ally .ally__box');
  var inline = inlineRoot ? Widget(inlineRoot) : null;

  /* ── nav triggers ─────────────────────────────────────────────────── */
  $$('[data-ally-open]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var onPage = $('#ally');
      if (onPage) {
        e.preventDefault();
        // Aim at the chat panel, not the section. The section starts far
        // above the box (heading column, plus the room Alyssa rises into),
        // so scrolling to its top buries the panel header off-screen.
        // Computed rather than scrollIntoView + scroll-margin, which was
        // landing 48px past the top of the panel.
        var box = $('.ally__box', onPage) || onPage;
        var y = box.getBoundingClientRect().top + window.pageYOffset - 96;
        window.scrollTo({ top: Math.max(y, 0), behavior: 'smooth' });
        setTimeout(function () { if (inline) { inline.focus({ preventScroll: true }); } }, 800);
      }
      // On pages without the inline widget the link is a normal /#ally
      // navigation home. Simple beats a second widget instance to keep in sync.
    });
  });
})();
