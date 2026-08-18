/* ============================================================================
   ALLY — the chat surface
   ----------------------------------------------------------------------------
   Deliberately the loudest section on the page. Everything around it is cream
   and quiet; this one is a warm blush field with a rising sun behind Alyssa,
   cut out and standing half behind the panel.

   The AI disclosure is permanent and visible, not a dismissible modal. Alyssa
   is a licensed producer; a visitor who believes they are talking to her and
   acts on something wrong is a real exposure. Her likeness is here for warmth
   — the line under the panel says plainly what this is.
   ==========================================================================*/
const { BOT, AGENT } = require('../site.js');

function ally(extraClass) {
  return `  <section class="ally${extraClass ? ' ' + extraClass : ''}" id="ally">
    <div class="ally__field" aria-hidden="true">
      <div class="ally__sun" data-ally-sun></div>
      <div class="ally__grain"></div>
    </div>

    <div class="wrap ally__grid">

      <div class="ally__intro">
        <p class="eyebrow reveal"><span class="star">&#10022;</span> ${BOT.tagline}</p>
        <h2 class="h2 reveal" data-d="1">Ask ${BOT.name}<br>anything.</h2>
        <p class="sec__lede reveal" data-d="2">
          Coverage questions, what a term actually means, what to bring to a
          review. ${BOT.name} answers in plain words — and the moment you want
          a person, she hands you straight to us.
        </p>
        <ul class="ally__pts reveal" data-d="3">
          <li>Answers first, no form to fill in</li>
          <li>Awake at 2am when you're reading your policy</li>
          <li>Passes you to a real direct line, not a queue</li>
        </ul>
      </div>

      <div class="ally__stage">
        <!-- Alyssa, cut out, standing behind the panel. Purely decorative —
             the accessible name of this section is the heading above. -->
        <img class="ally__her" src="/assets/brand/alyssa-cutout.webp"
             alt="" aria-hidden="true" width="950" height="908" loading="lazy">

        <div class="ally__box reveal" data-d="2">
          <div class="ally__bar">
            <span class="ally__id">
              <span class="ally__name">${BOT.name}</span>
              <span class="ally__role"><i class="ally__live"></i>AI assistant &middot; online</span>
            </span>
            <a class="ally__human" href="tel:${AGENT.telHref}">Talk to a person</a>
          </div>

          <div class="ally__log" data-ally-log role="log" aria-live="polite" aria-label="Conversation with ${BOT.name}"></div>
          <div class="ally__chips" data-ally-chips></div>

          <form class="ally__form" data-ally-form autocomplete="off">
            <label class="sr-only" for="allyInput">Message ${BOT.name}</label>
            <input class="ally__input" id="allyInput" data-ally-input type="text"
                   placeholder="Ask about coverage…" maxlength="500">
            <button class="ally__send" type="submit" aria-label="Send">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 20.5 21 12 3 3.5l3.2 7.1L15 12l-8.8 1.4z"/></svg>
            </button>
          </form>

          <p class="ally__fine">
            ${BOT.name} is an AI assistant — not ${AGENT.name.split(' ')[0]}, and not a licensed agent.
            She can't quote prices, confirm what a policy covers, or bind coverage.
            For anything that needs a real answer, call <a href="tel:${AGENT.telHref}">${AGENT.phone}</a>.
          </p>
        </div>
      </div>

    </div>
  </section>`;
}

module.exports = { ally };
