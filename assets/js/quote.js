/* ============================================================================
   QUOTE FORM — client
   ----------------------------------------------------------------------------
   Validates, then posts to /api/lead with formType 'quote' so the Apps Script
   writes it to the Quote Requests tab rather than mixing it in with chat
   leads.

   Consent is a hard gate. The submit is blocked without it, and the exact
   wording shown on screen is sent along with the answer — "they consented"
   is worth nothing in a year's time without a record of what to.
   ==========================================================================*/
(function () {
  'use strict';

  var form = document.querySelector('[data-quote]');
  if (!form) { return; }

  var $  = function (s, r) { return (r || form).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || form).querySelectorAll(s)); };

  var PHONE = '719-563-9712', TEL = '+17195639712';
  var status  = $('[data-quote-status]');
  var consent = $('[data-consent]');
  var done    = document.querySelector('[data-quote-done]');
  var btn     = $('[data-quote-send]');
  var sending = false;

  function fail(el, msg) {
    var wrap = el.closest('.qf__f') || el.closest('.qf__consent');
    if (!wrap) { return; }
    wrap.classList.add('is-bad');
    if (msg) {
      var e = wrap.querySelector('.qf__err');
      if (e) { e.textContent = msg; }
    }
  }
  function clear(el) {
    var wrap = el.closest('.qf__f') || el.closest('.qf__consent');
    if (wrap) { wrap.classList.remove('is-bad'); }
  }

  $$('[data-key]').forEach(function (el) {
    el.addEventListener('input', function () { clear(el); });
  });
  $$('input[type=checkbox]').forEach(function (el) {
    el.addEventListener('change', function () {
      var g = el.closest('[data-group]');
      if (g) { g.classList.remove('is-bad'); }
      if (el === consent) { form.querySelector('.qf__err--consent').classList.remove('is-on'); }
    });
  });

  function validate() {
    var first = null;

    $$('[data-req][data-key]').forEach(function (el) {
      var v = el.value.trim();
      var bad = !v;
      if (!bad && el.type === 'email') { bad = !/^\S+@\S+\.\S+$/.test(v); }
      // Ten digits, however they typed it. Rejecting brackets and dashes is
      // the fastest way to make someone give up on a form.
      if (!bad && el.type === 'tel') { bad = v.replace(/\D/g, '').length < 10; }
      if (!bad && el.name === 'zip') { bad = !/^\d{5}(-\d{4})?$/.test(v); }
      if (bad) {
        fail(el, el.type === 'email' ? 'That email does not look right.'
              : el.type === 'tel' ? 'We need all ten digits.'
              : el.name === 'zip' ? 'Five digits, please.'
              : 'We need this one.');
        if (!first) { first = el; }
      }
    });

    $$('[data-group][data-req]').forEach(function (g) {
      if (!g.querySelector('input:checked')) {
        g.classList.add('is-bad');
        if (!first) { first = g; }
      }
    });

    if (!consent.checked) {
      form.querySelector('.qf__err--consent').classList.add('is-on');
      if (!first) { first = consent; }
    }

    if (first) {
      (first.closest('.qf__f') || first.closest('.qf__consent') || first)
        .scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (first.focus) { try { first.focus({ preventScroll: true }); } catch (e) {} }
    }
    return !first;
  }

  function collect() {
    var d = {};
    $$('[data-key]').forEach(function (el) { d[el.name] = el.value.trim(); });
    var picks = $$('input[name="coverage"]:checked').map(function (c) { return c.value; });
    d.coverage = picks.join(', ');

    // Store the consent answer AND the sentence it answered.
    d.consent = 'Yes';
    d.consentText = (consent.closest('label').querySelector('span') || {}).textContent || '';
    d.consentAt = new Date().toISOString();
    return d;
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (sending) { return; }
    status.textContent = '';
    if (!validate()) { return; }

    sending = true;
    btn.disabled = true;
    btn.textContent = 'Sending…';

    var d = collect();
    try {
      var r = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          formType: 'quote',
          lead: {
            name: (d.firstName + ' ' + d.lastName).trim(),
            phone: d.phone, email: d.email,
            interest: d.coverage, notes: d.notes,
            source: 'Poppell — website quote form',
            page: location.pathname,
            fields: d
          }
        })
      });
      var j = await r.json();
      if (!j || !j.ok) { throw new Error('not ok'); }

      form.hidden = true;
      done.hidden = false;
      done.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (!j.delivered) { console.warn('[quote] accepted but not delivered —', j.note); }
    } catch (err) {
      // Never blame the visitor and never wipe the form. Everything they
      // typed is still here.
      status.innerHTML = 'That did not send. Nothing you typed is lost — try ' +
        'again, or call <a href="tel:' + TEL + '">' + PHONE + '</a> and we will ' +
        'take it over the phone.';
      status.classList.add('is-bad');
      btn.disabled = false;
      btn.textContent = 'Try again';
      sending = false;
    }
  });
})();
