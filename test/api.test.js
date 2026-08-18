#!/usr/bin/env node
/* ============================================================================
   API TESTS — run with `npm test`
   ----------------------------------------------------------------------------
   No framework. Drives the two serverless handlers directly against a mock
   Anthropic endpoint and a mock Apps Script.

   These exist because the expensive failures here are silent ones: a lead
   that looks delivered and isn't, a model that invents a price, a bot that
   hands out a phone number instead of taking details. None of those throw.
   ==========================================================================*/
const path = require('path');
const chat = require(path.join(__dirname, '..', 'api', 'chat.js'));
const lead = require(path.join(__dirname, '..', 'api', 'lead.js'));

let pass = 0, fail = 0, group = '';
const G  = (n) => { group = n; console.log('\n' + n); };
const ck = (n, c) => { c ? pass++ : fail++; console.log('  ' + (c ? 'PASS' : 'FAIL') + '  ' + n); };
const res = () => { const r = {}; r.status = c => { r.code = c; return r; }; r.json = b => { r.body = b; return r; }; return r; };
const ORIGIN = 'https://poppell-insurance.vercel.app';
let ipn = 0;
const post = (msgs) => ({
  method: 'POST',
  headers: { origin: ORIGIN, 'x-forwarded-for': '10.0.' + (++ipn) + '.1' },
  body: { messages: msgs || [{ role: 'user', content: 'hi' }] }
});

(async () => {

  /* ══════════════════════════════ DEGRADATION ══════════════════════════ */
  G('Degradation — never pretend');
  delete process.env.ANTHROPIC_API_KEY;
  let r = res();
  await chat(post(), r);
  ck('no key → says so honestly', /not connected yet/.test(r.body.reply));
  ck('no key → hands over the office number', r.body.reply.includes('719-563-9712'));
  ck('no key → no capture signalled', r.body.capture === null);

  process.env.ANTHROPIC_API_KEY = 'test-key';
  global.fetch = async () => ({ json: async () => ({ error: { type: 'overloaded' } }) });
  r = res(); await chat(post(), r);
  ck('model error → still useful, no crash', r.body.reply.includes('719-563-9712'));

  r = res(); await chat({ method: 'POST', body: { messages: [{ role: 'user', content: 'hi' }] } }, r);
  ck('missing headers object does not throw', r.code !== undefined);

  /* ══════════════════════════════ SYSTEM PROMPT ════════════════════════ */
  G('System prompt — the hard prohibitions');
  let sys = null, sent = [];
  global.fetch = async (u, o) => {
    const b = JSON.parse(o.body); sys = b.system; sent.push(b);
    return { json: async () => ({ content: [{ type: 'text', text: 'ok' }] }) };
  };
  r = res(); await chat(post(), r);
  [
    ['is not the agent',          'NOT a licensed agent'],
    ['discloses AI when asked',   'say so immediately and plainly'],
    ['no premium or price',       'Never give a premium'],
    ['no coverage determination', 'Never state that something is covered'],
    ['no claims advice',          'Never advise on a claim'],
    ['no binding coverage',       'Never bind, confirm, activate'],
    ['no savings claims',         'Never make comparative or savings claims'],
    ['no securities',             'Never discuss investments, securities'],
    ['no legal or tax advice',    'Never give legal advice or tax advice'],
    ['no other-state licensing',  'licensed outside Colorado'],
    ['no fair-housing risk',      'never discuss neighbourhood demographics'],
    ['refuses fully, not partly', 'Refuse completely rather than answering partly']
  ].forEach(([n, needle]) => ck(n, sys.includes(needle)));

  /* ══════════════════════════════ LEAD-FIRST ORDERING ══════════════════ */
  G('Ordering — capture before the phone number');
  ck('phone is a last resort',            /LAST RESORT, NOT A FIRST RESPONSE/.test(sys));
  ck('offers a callback first',           /FIRST move is always to offer to have someone reach out/.test(sys));
  ck('forbidden to lead with the number', /Do NOT volunteer the phone number in that first reply/.test(sys));
  ck('urgent cases bypass that',          /it is urgent — an accident, a loss, a claim in progress/.test(sys));
  ck('explicit ask bypasses that',        /they explicitly ask for it/.test(sys));
  ck('a decline is not re-pushed',        /they turn down the offer of a callback/.test(sys));
  ck('refusals offer a callback too',     /OFFER TO HAVE SOMEONE REACH OUT/.test(sys));

  /* ══════════════════════════════ CAPTURE SPLIT ════════════════════════ */
  G('Capture — the model must not touch contact details');
  let calls = 0; sent = [];
  global.fetch = async (u, o) => {
    calls++; sent.push(JSON.parse(o.body));
    if (calls === 1) return { json: async () => ({ content: [
      { type: 'text', text: 'Sure.' },
      { type: 'tool_use', id: 't1', name: 'request_contact_details',
        input: { interest: 'umbrella', notes: 'Wants cover above home and auto.' } }] }) };
    return { json: async () => ({ content: [{ type: 'text', text: 'Perfect, let me grab a few details.' }] }) };
  };
  r = res(); await chat(post([{ role: 'user', content: 'have someone call me' }]), r);
  ck('capture is signalled', r.body.capture && r.body.capture.interest === 'umbrella');
  ck('exactly two model calls', calls === 2);
  const props = sent[0].tools[0].input_schema.properties;
  ck('tool schema has NO name field',  !('name'  in props));
  ck('tool schema has NO phone field', !('phone' in props));
  ck('tool schema has NO email field', !('email' in props));
  const tr = JSON.stringify(sent[1].messages);
  ck('tool result stops it asking for details', /Do NOT ask for their name, phone or email/.test(tr));
  ck('tool result forbids a price',             /do NOT state or imply\s*any price/i.test(tr.replace(/\\n/g, ' ')));
  ck('tool result forbids a coverage claim',    /will or will not be covered/i.test(tr));
  ck('tool result forbids a callback time',     /do NOT state a callback time/i.test(tr));

  /* ══════════════════════════════ CHIPS ════════════════════════════════ */
  G('Chips — parsed defensively');
  global.fetch = async () => ({ json: async () => ({ content: [{ type: 'text',
    text: 'Umbrella sits above your other limits.\nCHIPS: How much do I need? | Does it cover my teen? | Have someone call me' }] }) });
  r = res(); await chat(post(), r);
  ck('three chips parsed', r.body.chips.length === 3);
  ck('CHIPS line stripped from the reply', !/CHIPS/i.test(r.body.reply));
  ck('reply text left intact', r.body.reply === 'Umbrella sits above your other limits.');

  global.fetch = async () => ({ json: async () => ({ content: [{ type: 'text', text: 'No chips line here.' }] }) });
  r = res(); await chat(post(), r);
  ck('missing CHIPS line degrades safely',
     Array.isArray(r.body.chips) && r.body.chips.length === 0 && r.body.reply === 'No chips line here.');

  /* ══════════════════════════════ ABUSE LIMITS ═════════════════════════ */
  G('Abuse and cost limits');
  calls = 0;
  global.fetch = async (u, o) => { calls++; sent = [JSON.parse(o.body)];
    return { json: async () => ({ content: [{ type: 'text', text: 'ok' }] }) }; };

  r = res();
  await chat({ method: 'POST', headers: { origin: 'https://evil.example.com' }, body: { messages: [{ role: 'user', content: 'x' }] } }, r);
  ck('foreign origin → 403', r.code === 403);
  ck('foreign origin never reaches Anthropic', calls === 0);

  calls = 0; let blocked = 0;
  for (let i = 0; i < 12; i++) {
    const rr = res();
    await chat({ method: 'POST', headers: { origin: ORIGIN, 'x-forwarded-for': '11.11.11.11' }, body: { messages: [{ role: 'user', content: 'x' }] } }, rr);
    if (rr.code === 429) blocked++;
  }
  ck('per-IP burst cap fires', blocked > 0);
  ck('only 8 got through', calls === 8);

  r = res(); await chat(post(), r);
  ck('a different IP is unaffected', r.code !== 429);

  const long = []; for (let i = 0; i < 70; i++) long.push({ role: i % 2 ? 'assistant' : 'user', content: 'x' });
  calls = 0; r = res(); await chat(post(long), r);
  ck('conversation turn cap stops a long thread', calls === 0 && /real conversation/.test(r.body.reply));

  calls = 0; r = res(); await chat(post([{ role: 'user', content: 'z'.repeat(5000) }]), r);
  ck('message truncated to 500 chars', sent[0].messages[0].content.length === 500);
  ck('max_tokens capped at 700', sent[0].max_tokens === 700);

  /* ══════════════════════════════ LEAD DELIVERY ════════════════════════ */
  G('Lead delivery — a 200 is not proof');
  const lpost = (l) => ({ method: 'POST',
    headers: { origin: ORIGIN, 'x-forwarded-for': '12.0.' + (++ipn) + '.1' }, body: { lead: l } });

  delete process.env.SHEETS_WEBHOOK_URL;
  r = res(); await lead({ method: 'GET', headers: {} }, r);
  ck('diagnostic reports a missing env var', r.body.configured === false && /REDEPLOY/.test(r.body.fix));

  process.env.SHEETS_WEBHOOK_URL = 'https://script.google.com/macros/s/AK/exec';
  global.fetch = async () => ({ status: 200, text: async () => '<html>Sign in to continue to Google Drive' });
  r = res(); await lead({ method: 'GET', headers: {} }, r);
  ck('diagnostic spots a Google sign-in page', /Access is not set to "Anyone"/.test(r.body.verdict));

  r = res(); await lead(lpost({ name: 'A', phone: '1' }), r);
  ck('a sign-in page is NOT counted as delivered', r.body.delivered === false);

  process.env.SHEETS_WEBHOOK_URL = 'https://script.google.com/macros/s/AK/dev';
  global.fetch = async () => ({ status: 200, text: async () => '{"ok":true}' });
  r = res(); await lead({ method: 'GET', headers: {} }, r);
  ck('diagnostic flags a /dev URL', /does not end in \/exec/.test(r.body.problem || ''));

  process.env.SHEETS_WEBHOOK_URL = 'https://script.google.com/macros/s/AK/exec';
  let ct = null;
  global.fetch = async (u, o) => { ct = o.headers['content-type'];
    return { status: 200, text: async () => '{"ok":true,"row":5}' }; };
  r = res(); await lead(lpost({ name: 'A', phone: '1' }), r);
  ck('script ok:true counts as delivered', r.body.delivered === true);
  ck('posted as text/plain (no preflight, body survives)', /text\/plain/.test(ct));

  let n = 0;
  for (let i = 0; i < 9; i++) {
    const rr = res();
    await lead({ method: 'POST', headers: { origin: ORIGIN, 'x-forwarded-for': '13.13.13.13' }, body: { lead: { name: 'A' } } }, rr);
    if (rr.body.delivered) n++;
  }
  ck('lead spam capped at 6/hour/IP, silently', n === 6);

  console.log(`\n${pass} passed, ${fail} failed\n`);
  process.exit(fail ? 1 : 0);
})();
