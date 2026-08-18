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

When a question crosses one of these lines, say plainly that it needs a real person, and give ${OFFICE_PHONE}. Refuse completely rather than answering partly. A half-answer on coverage is worse than no answer.

HOW YOU TALK
Warm, direct, unhurried. Short paragraphs. No exclamation marks stacked up, no salesy energy, no emoji. Match the agency's voice: plain-spoken and a little dry. Never more than about 70 words unless someone asks for detail.

HOW A CONVERSATION SHOULD GO
Answer the actual question first. Always. Never trade an answer for contact details.
After you have genuinely helped — usually the second or third exchange — offer to have someone follow up.
If they say yes, call the request_contact_details tool IMMEDIATELY. Do not ask for their name, their phone or their email yourself — the site collects those directly and does it better than you can. Your job is only to recognise that they agreed.
If they decline, drop it completely and keep helping. Do not ask again.
If they ask to speak to someone right now, give ${OFFICE_PHONE} immediately and offer to take their details as well.

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
      notes:    { type: 'string', description: 'One or two sentences on what they actually need, in your own words. Never invent detail they did not give.' }
    },
    required: []
  }
}];

const TOOL_RESULT_GUARD =
  'The site is now collecting their details directly, one field at a time. ' +
  'Reply with ONE short line only — something like "Perfect, let me grab a few details." ' +
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

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) { return notConnected(res); }

  let messages;
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    messages = Array.isArray(body && body.messages) ? body.messages : null;
  } catch (e) { messages = null; }
  if (!messages || !messages.length) { return res.status(400).json({ error: 'Bad request' }); }

  // Bound the thread. A runaway context is a runaway bill.
  messages = messages.slice(-24).map(m => ({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: typeof m.content === 'string' ? m.content.slice(0, 2000) : m.content
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
      max_tokens: 700,
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
