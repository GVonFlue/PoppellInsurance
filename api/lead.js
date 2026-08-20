/* ============================================================================
   /api/lead — one delivery path for every capture surface
   ----------------------------------------------------------------------------
   Ally and any future form both post here. Two capture surfaces writing to
   the Sheet through two code paths is how one of them quietly stops writing.

   Never surfaces a delivery failure to the visitor. If the Sheet is down,
   the lead is still logged here and the visitor is told they'll be contacted,
   because telling them "something went wrong" loses the lead entirely.
   ==========================================================================*/

/* Same abuse posture as /api/chat. This one writes to her Google Sheet, so
   an open endpoint is a spam-the-spreadsheet problem as well as a cost one. */
const leadHits = new Map();
function limited(req) {
  const now = Date.now();
  const f = (req.headers || {})['x-forwarded-for'];
  const ip = (Array.isArray(f) ? f[0] : String(f || '')).split(',')[0].trim() || 'unknown';
  const list = (leadHits.get(ip) || []).filter(t => now - t < 3600e3);
  if (list.length >= 6) { leadHits.set(ip, list); return true; }   // 6 leads/hour/IP
  list.push(now); leadHits.set(ip, list);
  if (leadHits.size > 5000) { leadHits.clear(); }
  return false;
}
function badOrigin(req) {
  const h = req.headers || {};
  const o = h.origin || h.referer || '';
  if (!o) { return false; }
  try {
    const h = new URL(o).hostname;
    return !(h === 'localhost' || h === '127.0.0.1' ||
             h.endsWith('.vercel.app') || h.endsWith('poppellinsurance.com'));
  } catch (e) { return true; }
}

/* GET /api/lead is a diagnostic. It reports whether the webhook is
   configured and what the Apps Script actually answers, so a silent delivery
   failure can be told apart from a missing env var or a permissions problem.
   It sends no lead data and reveals no secrets — only the hostname. */
async function diagnose(res) {
  const url = process.env.SHEETS_WEBHOOK_URL;
  if (!url) {
    return res.status(200).json({
      configured: false,
      problem: 'SHEETS_WEBHOOK_URL is not set on this deployment.',
      fix: 'Vercel > Settings > Environment Variables, then REDEPLOY. Env vars only apply at build time.'
    });
  }
  let host = 'unparseable';
  try { host = new URL(url).host; } catch (e) {}
  const out = { configured: true, host: host, endsWithExec: /\/exec\/?$/.test(url) };
  if (!out.endsWithExec) {
    out.problem = 'The URL does not end in /exec. A /dev URL only works while signed in as you.';
  }
  try {
    const r = await fetch(url, { method: 'GET', redirect: 'follow' });
    const text = (await r.text()).slice(0, 400);
    out.status = r.status;
    try {
      const j = JSON.parse(text);
      out.scriptReplied = j;
      out.verdict = j && j.ok
        ? 'Apps Script is reachable and responding. TEST_MODE is ' + (j.testMode ? 'ON.' : 'OFF.')
        : 'Reached something, but it is not the lead receiver.';
    } catch (e) {
      out.rawStart = text.slice(0, 200);
      out.verdict = /<html|accounts\.google|Sign in/i.test(text)
        ? 'Google returned a sign-in page. The web app Access is not set to "Anyone" — redeploy with that changed.'
        : 'Reached the URL but the reply was not JSON. Wrong URL, or the deployment is stale.';
    }
  } catch (e) {
    out.verdict = 'Could not reach the URL at all: ' + String(e);
  }
  return res.status(200).json(out);
}

module.exports = async function handler(req, res) {
  if (req.method === 'GET') { return diagnose(res); }
  if (req.method !== 'POST') { return res.status(405).json({ error: 'Method not allowed' }); }
  if (badOrigin(req)) { return res.status(403).json({ ok: false }); }
  // Silently accept and drop. Telling a spammer they were blocked just tells
  // them to change tactics.
  if (limited(req)) { return res.status(200).json({ ok: true, delivered: false }); }

  let lead, formType = 'chat';
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    lead = body && body.lead;
    if (body && body.formType === 'quote') { formType = 'quote'; }
  } catch (e) { lead = null; }
  if (!lead || !lead.name) { return res.status(400).json({ ok: false }); }

  const payload = {
    timestamp: new Date().toISOString(),
    source:    String(lead.source || 'Poppell — Ally chat').slice(0, 80),
    name:      String(lead.name || '').slice(0, 120),
    phone:     String(lead.phone || '').slice(0, 40),
    email:     String(lead.email || '').slice(0, 160),
    interest:  String(lead.interest || '').slice(0, 80),
    notes:     String(lead.notes || '').slice(0, 600),
    summary:   String(lead.summary || '').slice(0, 1500),
    page:      String(lead.page || '/').slice(0, 200),
    formType:  formType,
    // Free-form extras from the quote form. Capped so a crafted request
    // cannot post a novel into her spreadsheet.
    fields:    lead.fields && typeof lead.fields === 'object'
                 ? Object.keys(lead.fields).slice(0, 40).reduce(function (o, k) {
                     o[String(k).slice(0, 40)] = String(lead.fields[k] || '').slice(0, 1200);
                     return o;
                   }, {})
                 : null
  };

  const url = process.env.SHEETS_WEBHOOK_URL;
  if (!url) {
    // No endpoint configured. The lead survives as a log line — a net, not a
    // floor. Setting SHEETS_WEBHOOK_URL is the highest-value item on the build.
    console.log('LEAD (no SHEETS_WEBHOOK_URL set):', JSON.stringify(payload));
    return res.status(200).json({ ok: true, delivered: false });
  }

  try {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 9000);
    const r = await fetch(url, {
      method: 'POST',
      // Apps Script answers /exec with a 302 to googleusercontent.com. Node
      // follows it, but a 302 turns a POST into a GET and drops the body —
      // so doPost would never run and doGet would answer instead. Posting
      // as text/plain avoids a CORS preflight and Apps Script still reads
      // e.postData.contents exactly the same way.
      headers: { 'content-type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      redirect: 'follow',
      signal: ctl.signal
    });
    clearTimeout(t);
    const text = (await r.text()).slice(0, 500);

    // A 200 is NOT proof of delivery. A Google sign-in page is also a 200.
    // Only the script's own {ok:true} counts.
    let ok = false, note = text.slice(0, 200);
    try { const j = JSON.parse(text); ok = !!j.ok; note = JSON.stringify(j).slice(0, 200); }
    catch (e) { ok = false; }

    if (!ok) { console.log('LEAD NOT DELIVERED', r.status, note, JSON.stringify(payload)); }
    return res.status(200).json({ ok: true, delivered: ok, note: ok ? undefined : note });
  } catch (e) {
    console.log('LEAD delivery failed:', String(e), JSON.stringify(payload));
    return res.status(200).json({ ok: true, delivered: false, note: String(e) });
  }
};
