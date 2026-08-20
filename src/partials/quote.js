/* ============================================================================
   QUOTE FORM
   ----------------------------------------------------------------------------
   Replaces the Jotform embed. Same shape, but it is ours: no third-party
   iframe, no embed that can fail to load, and it writes straight to the
   Quote Requests tab of her sheet.

   FIELDS ARE A CONFIG. Add, remove or reorder here and the markup, the
   validation and the sheet header all follow. `key` becomes the column
   name, so changing one renames the column — append rather than rename if
   there is already data in the sheet.
   ==========================================================================*/
const { AGENT } = require('../site.js');

/* The legal entity, which is NOT the same string as the site's display name.
   Consent has to name the entity that will actually be doing the contacting. */
const LEGAL_ENTITY = 'Poppell Agency LLC';

const CONSENT = 'I agree to be contacted by ' + LEGAL_ENTITY +
  ' regarding my insurance inquiry.';

const FIELDS = [
  { key: 'firstName', label: 'First name', type: 'text',  req: true,  half: true,  auto: 'given-name' },
  { key: 'lastName',  label: 'Last name',  type: 'text',  req: true,  half: true,  auto: 'family-name' },
  { key: 'phone',     label: 'Phone',      type: 'tel',   req: true,  half: true,  auto: 'tel' },
  { key: 'email',     label: 'Email',      type: 'email', req: true,  half: true,  auto: 'email' },
  { key: 'zip',       label: 'ZIP code',   type: 'text',  req: true,  half: true,  auto: 'postal-code',
    help: 'So we know which of your rules apply — rates and coverage vary by county.' },
  { key: 'currentCarrier', label: 'Who are you with now?', type: 'text', half: true,
    help: 'Optional. Helps us see what you already have.' },
  { key: 'coverage', label: 'What do you need covered?', type: 'checks', req: true,
    options: ['Home', 'Auto', 'Life', 'Business', 'Umbrella', 'Condo or renters',
              'Recreational (boat, ATV, RV, motorcycle)', 'Landlord / rental', 'Flood',
              'Something else'] },
  { key: 'bestTime', label: 'Best time to reach you', type: 'select',
    options: ['Anytime', 'Morning', 'Afternoon', 'Evening'] },
  { key: 'notes', label: 'Anything we should know?', type: 'textarea',
    help: 'A renewal date, a claim you are dealing with, a deadline — whatever matters.' }
];

function field(f) {
  const req = f.req ? ' <span class="req">*</span>' : '';
  const help = f.help ? `<span class="qf__help">${f.help}</span>` : '';
  const cls = 'qf__f' + (f.half ? ' qf__f--half' : '');
  const id = 'q_' + f.key;

  if (f.type === 'checks') {
    return `      <fieldset class="${cls}" data-group="${f.key}"${f.req ? ' data-req' : ''}>
        <legend class="qf__lab">${f.label}${req}</legend>
        ${help}
        <div class="qf__checks">
${f.options.map(o => `          <label class="qf__opt"><input type="checkbox" name="${f.key}" value="${o}"><span>${o}</span></label>`).join('\n')}
        </div>
        <p class="qf__err">Pick at least one so we know where to start.</p>
      </fieldset>`;
  }
  if (f.type === 'select') {
    return `      <div class="${cls}">
        <label class="qf__lab" for="${id}">${f.label}${req}</label>${help}
        <select id="${id}" name="${f.key}" data-key="${f.key}"${f.req ? ' data-req' : ''}>
${f.options.map(o => `          <option value="${o}">${o}</option>`).join('\n')}
        </select>
      </div>`;
  }
  if (f.type === 'textarea') {
    return `      <div class="${cls}">
        <label class="qf__lab" for="${id}">${f.label}${req}</label>${help}
        <textarea id="${id}" name="${f.key}" data-key="${f.key}"${f.req ? ' data-req' : ''} rows="4"></textarea>
        <p class="qf__err">We need this one.</p>
      </div>`;
  }
  return `      <div class="${cls}">
        <label class="qf__lab" for="${id}">${f.label}${req}</label>${help}
        <input type="${f.type}" id="${id}" name="${f.key}" data-key="${f.key}"${f.req ? ' data-req' : ''}${f.auto ? ` autocomplete="${f.auto}"` : ''}>
        <p class="qf__err">We need this one.</p>
      </div>`;
}

function quoteForm() {
  return `      <form class="qf" data-quote novalidate>
        <div class="qf__grid">
${FIELDS.map(field).join('\n')}
        </div>

        <!-- Consent is required and unchecked by default. A pre-ticked box is
             not consent, and this is the record that we were permitted to
             call. The submitted value and its exact wording are both written
             to the sheet, because "they agreed" is worth nothing without
             what they agreed to. -->
        <label class="qf__consent" data-consent-wrap>
          <input type="checkbox" id="q_consent" data-consent required>
          <span>${CONSENT}</span>
        </label>
        <p class="qf__err qf__err--consent">Please tick this so we know we may contact you.</p>

        <div class="qf__foot">
          <button class="btn btn--solid" type="submit" data-quote-send>Send it over</button>
          <span class="qf__note">Or call <a href="tel:${AGENT.telHref}">${AGENT.phone}</a>.</span>
        </div>

        <p class="qf__status" data-quote-status role="status" aria-live="polite"></p>
      </form>

      <div class="qf__done" data-quote-done hidden>
        <div class="qf__tick">✓</div>
        <h3>Got it.</h3>
        <p>Someone from the office will be in touch. If you would rather not
        wait, call <a href="tel:${AGENT.telHref}">${AGENT.phone}</a>.</p>
      </div>`;
}

module.exports = { quoteForm, FIELDS, CONSENT, LEGAL_ENTITY };
