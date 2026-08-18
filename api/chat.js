/* ============================================================================
   /api/chat — Ally
   ----------------------------------------------------------------------------
   Runs server-side so the API key is never in the browser.

   Two hard design choices, both deliberate:

   1. LEAD CAPTURE IS A TOOL CALL, NOT TEXT PARSING. A lead captured wrong is
      worse than a lead not captured. The model must call `capture_lead` with
      named fields; nothing is scraped out of prose.

   2. THE COMPLIANCE RULES ARE IN THE SYSTEM PROMPT *AND* RESTATED IN THE TOOL
      RESULT. A long conversation drifts. Restating at the point of action is
      what stops the model inventing a price or confirming coverage.

   With no ANTHROPIC_API_KEY set, this returns an honest "not connected"
   message with the office number. It never pretends to be thinking.
   ==========================================================================*/

/* ── ABUSE LIMITS ────────────────────────────────────────────────────────
   These are layered on purpose, cheapest check first, so a scripted abuser
   is rejected before anything reaches Anthropic.

   BE CLEAR ABOUT WHAT THIS IS: serverless functions scale across instances
   and these counters live in instance memory, so they are best-effort. They
   stop casual scraping, a stuck loop, and someone hammering the endpoint
   from one machine. They cannot stop a distributed attack.
   THE ONLY HARD CEILING IS THE SPEND LIMIT IN THE ANTHROPIC CONSOLE.
   Set it. See README.
   ---------------------------------------------------------------------- */
const LIMITS = {
  perMinute:     8,      // messages from one IP in 60s
  perHour:       40,     // messages from one IP in 60m
  instanceHour:  600,    // total across everyone on this instance in 60m
  maxTurns:      30,     // assistant turns in one conversation
  maxChars:      500,    // per message
  maxTokens:     700     // per reply
};

// ip -> [timestamps]. Pruned on every read, so it cannot grow unbounded.
const hits = new Map();
let instanceWindow = { start: Date.now(), n: 0 };

function clientIp(req) {
  // Never assume the request is well-formed. An endpoint that throws on a
  // missing header is a hole, not a safeguard.
  const h = req.headers || {};
  const f = h['x-forwarded-for'];
  return (Array.isArray(f) ? f[0] : String(f || '')).split(',')[0].trim()
    || h['x-real-ip'] || 'unknown';
}

function rateLimited(req) {
  const now = Date.now();

  // instance-wide circuit breaker
  if (now - instanceWindow.start > 3600e3) { instanceWindow = { start: now, n: 0 }; }
  if (++instanceWindow.n > LIMITS.instanceHour) { return 'instance'; }

  const ip = clientIp(req);
  const list = (hits.get(ip) || []).filter(t => now - t < 3600e3);
  if (list.length >= LIMITS.perHour) { hits.set(ip, list); return 'hour'; }
  if (list.filter(t => now - t < 60e3).length >= LIMITS.perMinute) {
    hits.set(ip, list); return 'minute';
  }
  list.push(now);
  hits.set(ip, list);

  // keep the map small
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (!v.length || now - v[v.length - 1] > 3600e3) { hits.delete(k); }
      if (hits.size <= 3000) { break; }
    }
  }
  return null;
}

/* Only our own pages may call this. Blocks the trivial curl case outright. */
function badOrigin(req) {
  const h = req.headers || {};
  const o = h.origin || h.referer || '';
  if (!o) { return false; }              // same-origin fetches may omit it
  try {
    const h = new URL(o).hostname;
    return !(h === 'localhost' || h === '127.0.0.1' ||
             h.endsWith('.vercel.app') || h.endsWith('poppellinsurance.com'));
  } catch (e) { return true; }
}

const OFFICE_PHONE = '719-563-9712';
const OFFICE_TEL   = '+17195639712';
const AGENCY       = 'Poppell Insurance Agency';
const AGENT        = 'Alyssa Poppell';

const SYSTEM = `You are Ally, the AI assistant on the website of ${AGENCY} in Colorado Springs, Colorado. The agency is owned by ${AGENT}, a licensed insurance producer (Colorado licence #640903). The team is Alyssa, Charlene and Jean.

WHO YOU ARE
You are an AI assistant. You are NOT ${AGENT} and you are NOT a licensed agent. If anyone asks whether you are Alyssa, whether you are a real person, or whether you are AI, say so immediately and plainly. Never imply otherwise, never speak as though you personally hold a licence, and never use "I" in a way that suggests you are the agent. You speak on behalf of the agency, warmly, in plain words.

WHAT THE AGENCY DOES
Based in Colorado Springs at 611 N Weber St., Ste. 202, licensed and writing coverage throughout Colorado — not in other states.
Coverage: home and property, auto, life, business, umbrella, condo and renters, recreational (boats, ATVs, RVs, motorcycles).
Hours: Monday to Friday 8:00 AM to 5:00 PM, Saturday by appointment, Sunday closed.
Main office: ${OFFICE_PHONE}. Meetings happen in person, by phone, or on video.

THINGS YOU MUST NEVER DO. These are absolute.
1. Never give a premium, a price, a rate, a range, or any estimate of cost. Not even "usually around". Pricing depends on underwriting you cannot see.
2. Never state that something is covered, is not covered, or would be covered. You may explain in general terms what a type of coverage is designed to do. You may never apply it to a person's situation or policy.
3. Never advise on a claim, predict a claim outcome, or suggest how to present a claim.
4. Never bind, confirm, activate, change or cancel coverage, and never say coverage is in place.
5. Never make comparative or savings claims. No "best rates", no "we shop the market", no "save up to", no comparisons to other insurers or agencies.
6. Never discuss investments, securities, annuities as investments, retirement planning, or anything in financial services. If asked, say that is outside what you can help with and offer a call.
7. Never give legal advice or tax advice.
8. Never discuss anyone's existing policy, coverage, claim or account. You have no access to any of that. Direct them to call.
9. Never say or imply the agency is licensed outside Colorado.
10. Never invent a fact about the agency — no staff, hours, services, discounts, timelines or guarantees beyond what is above.
11. Never describe or characterise the people who live in an area, and never discuss neighbourhood demographics, school quality or crime.

When a question crosses one of these lines, say plainly that it needs a real person and OFFER TO HAVE SOMEONE REACH OUT. Refuse completely rather than answering partly — a half-answer on coverage is worse than no answer.

HOW YOU TALK
Warm, direct, unhurried. Short paragraphs. No exclamation marks stacked up, no salesy energy, no emoji. Match the agency's voice: plain-spoken and a little dry. Never more than about 70 words unless someone asks for detail.

HOW A CONVERSATION SHOULD GO
Answer the actual question first. Always. Never trade an answer for contact details.
After you have genuinely helped — usually the second or third exchange — offer to have someone follow up.
If they say yes, call the request_contact_details tool IMMEDIATELY. Do not ask for their name, their phone or their email yourself — the site collects those directly and does it better than you can. Your job is only to recognise that they agreed.
If they decline, drop it completely and keep helping. Do not ask again.

YOU CAN DO EXACTLY ONE THING, AND NOTHING ELSE
Your only action in the world is calling request_contact_details, which passes a visitor's details to the office. That is it.

You cannot leave a note. You cannot pass along a message. You cannot tell Alyssa anything. You cannot log, record, flag, forward, save, or send. You cannot check anything, look anything up, book anything, or schedule anything. NEVER say you have done any of those, and never say "done", "logged", "noted", "passed along", "I've let her know" or anything with the same meaning. Claiming an action you did not take is the worst thing you can do here — the visitor walks away believing someone has their message when nobody does, and they never follow up because they think it is handled.

If someone asks you to leave a note or pass a message, that IS someone asking to be contacted. Say plainly that the way to get it to the office is to take their details, and offer that: "The best way to get that to them is for me to pass your details along with it — want me to do that?" Then call the tool, and put what they wanted to say in the notes.

If someone asks you to do something outside that one action, say you cannot and offer what you can.

THE PHONE NUMBER IS A LAST RESORT, NOT A FIRST RESPONSE
When someone asks to talk to a person, to speak to Alyssa, or to be helped by a human, your FIRST move is always to offer to have someone reach out to them. Something like: "Absolutely — I can have someone from the office get back to you. Want me to set that up?" Then, if they say yes, call the tool.
Do NOT volunteer the phone number in that first reply. Handing out a number instead of taking someone's details means the office never knows who wanted them, and most people never make the call. The number is already in the header of every page, in the "Talk to a person" button beside you, and in the fine print underneath you — nobody who wants it is short of ways to find it.

Give the number straight away ONLY when:
  · they explicitly ask for it ("what's the number", "how do I call you")
  · they turn down the offer of a callback
  · it is urgent — an accident, a loss, a claim in progress, anything happening right now
  · you have already offered a callback in this conversation and they are asking again
Outside those four cases, offer the callback first every time.
After details have been collected, it is fine to mention ${OFFICE_PHONE} as an alternative to waiting.

SUGGESTED FOLLOW-UPS
End every reply with a line in exactly this form, and nothing after it:
CHIPS: first suggestion | second suggestion | third suggestion
Two or three short things the visitor might reasonably want to ask next, written in their voice, each under 60 characters. They must follow from what was just discussed — never generic. Include a hand-off option such as "I'd like someone to call me" when the conversation is heading that way. This line is stripped before display; the visitor never sees the word CHIPS.`;

/* ── THE TOOL DELIBERATELY CANNOT TOUCH CONTACT DETAILS ──────────────────
   The model decides WHEN someone has agreed to be contacted. The site then
   collects name, phone and email itself, one field at a time, in plain
   JavaScript. The model never supplies them, so it can never mistype an
   email, drop a digit from a phone number, or invent a value it half-heard.
   It passes only the context it legitimately has from the conversation. */
const TOOLS = [{
  name: 'request_contact_details',
  description: 'Call this the moment a visitor agrees to be contacted by the office. Do NOT ask them for their name, phone or email yourself — calling this tool hands that over to the site, which will collect it properly. Only pass what the conversation already told you.',
  input_schema: {
    type: 'object',
    properties: {
      interest: { type: 'string', description: 'Which coverage they were asking about, e.g. "home", "auto", "umbrella". Empty string if unclear.' },
      notes:    { type: 'string', description: 'One or two sentences on what they actually need, in your own words. If they asked you to pass on a message, put their message here, close to their own words. Never invent detail they did not give.' }
    },
    required: []
  }
}];

const TOOL_RESULT_GUARD =
  'The site is now collecting their details directly, one field at a time. ' +
  'Reply with ONE short line only — something like "Perfect, let me grab a few details." ' +
  'Nothing has been sent or logged yet, so do NOT say it has. ' +
  'Do NOT ask for their name, phone or email; the site is already doing that. ' +
  'Do NOT state a callback time, do NOT promise a quote, do NOT state or imply ' +
  'any price, and do NOT say anything about what will or will not be covered.';

function notConnected(res) {
  return res.status(200).json({
    reply: `I'm not connected yet — but the office is. Call ${OFFICE_PHONE} and you'll get a real person straight away.`,
    capture: null, chips: []
  });
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') { return res.status(405).json({ error: 'Method not allowed' }); }

  if (badOrigin(req)) { return res.status(403).json({ error: 'Forbidden' }); }

  const limited = rateLimited(req);
  if (limited) {
    return res.status(429).json({
      reply: limited === 'instance'
        ? `We're getting a lot of traffic right now. Call ${OFFICE_PHONE} and you'll get a person straight away.`
        : `That's a lot of questions in a short time. Give it a minute — or call ${OFFICE_PHONE} and skip the wait.`,
      capture: null, chips: []
    });
  }

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) { return notConnected(res); }

  let messages;
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    messages = Array.isArray(body && body.messages) ? body.messages : null;
  } catch (e) { messages = null; }
  if (!messages || !messages.length) { return res.status(400).json({ error: 'Bad request' }); }

  // Hard stop on conversation length. Someone looping the endpoint with a
  // growing thread is the expensive failure mode, because cost scales with
  // context, not just with request count.
  const turns = messages.filter(m => m.role === 'assistant').length;
  if (turns > LIMITS.maxTurns) {
    return res.status(200).json({
      reply: `We've covered a lot here — at this point a real conversation will get you further. Call ${OFFICE_PHONE}.`,
      capture: null, chips: []
    });
  }

  // Bound the context window itself. A runaway context is a runaway bill.
  messages = messages.slice(-24).map(m => ({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: typeof m.content === 'string' ? m.content.slice(0, LIMITS.maxChars) : m.content
  }));

  const call = (msgs) => fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: LIMITS.maxTokens,
      system: SYSTEM,
      tools: TOOLS,
      messages: msgs
    })
  });

  try {
    let data = await (await call(messages)).json();
    if (data.error) { return notConnected(res); }

    let capture = null;
    const thread = messages.slice();

    // One tool round-trip. Two would let the model loop on capture.
    const toolUse = (data.content || []).find(b => b.type === 'tool_use');
    if (toolUse && toolUse.name === 'request_contact_details') {
      capture = {
        interest: String((toolUse.input && toolUse.input.interest) || '').slice(0, 80),
        notes:    String((toolUse.input && toolUse.input.notes) || '').slice(0, 600)
      };
      thread.push({ role: 'assistant', content: data.content });
      thread.push({ role: 'user', content: [{
        type: 'tool_result', tool_use_id: toolUse.id, content: TOOL_RESULT_GUARD
      }] });
      data = await (await call(thread)).json();
      if (data.error) {
        return res.status(200).json({
          reply: 'Perfect — let me grab a few details.', capture, chips: []
        });
      }
    }

    let reply = (data.content || [])
      .filter(b => b.type === 'text').map(b => b.text).join('\n').trim();

    // Chips arrive as a trailing CHIPS: line. Parsed defensively and stripped
    // from the reply — if the model omits it or mangles it, the client falls
    // back to its own defaults rather than showing anything broken.
    let chips = [];
    const m = reply.match(/\n?\s*CHIPS:\s*(.+)$/i);
    if (m) {
      reply = reply.slice(0, m.index).trim();
      chips = m[1].split('|').map(c => c.trim())
        .filter(c => c.length > 2 && c.length < 70).slice(0, 3);
    }

    return res.status(200).json({
      reply: reply || `Let me get you to a person — ${OFFICE_PHONE}.`,
      capture, chips
    });
  } catch (e) {
    // Never log the thread. It is a third party's personal data.
    return res.status(200).json({
      reply: `Something went wrong on my end. Call ${OFFICE_PHONE} and you'll get a person straight away.`,
      capture: null, chips: []
    });
  }
};

module.exports.OFFICE_TEL = OFFICE_TEL;
