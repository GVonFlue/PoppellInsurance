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
  const f = req.headers['x-forwarded-for'];
  const ip = (Array.isArray(f) ? f[0] : String(f || '')).split(',')[0].trim() || 'unknown';
  const list = (leadHits.get(ip) || []).filter(t => now - t < 3600e3);
  if (list.length >= 6) { leadHits.set(ip, list); return true; }   // 6 leads/hour/IP
  list.push(now); leadHits.set(ip, list);
  if (leadHits.size > 5000) { leadHits.clear(); }
  return false;
}
function badOrigin(req) {
  const o = req.headers.origin || req.headers.referer || '';
  if (!o) { return false; }
  try {
    const h = new URL(o).hostname;
    return !(h === 'localhost' || h === '127.0.0.1' ||
             h.endsWith('.vercel.app') || h.endsWith('poppellinsurance.com'));
  } catch (e) { return true; }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') { return res.status(405).json({ error: 'Method not allowed' }); }
  if (badOrigin(req)) { return res.status(403).json({ ok: false }); }
  // Silently accept and drop. Telling a spammer they were blocked just tells
  // them to change tactics.
  if (limited(req)) { return res.status(200).json({ ok: true, delivered: false }); }

  let lead;
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    lead = body && body.lead;
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
    page:      String(lead.page || '/').slice(0, 200)
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
    const t = setTimeout(() => ctl.abort(), 8000);
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      signal: ctl.signal
    });
    clearTimeout(t);
    if (!r.ok) { console.log('LEAD delivery non-200:', r.status, JSON.stringify(payload)); }
    return res.status(200).json({ ok: true, delivered: r.ok });
  } catch (e) {
    console.log('LEAD delivery failed:', JSON.stringify(payload));
    return res.status(200).json({ ok: true, delivered: false });
  }
};
