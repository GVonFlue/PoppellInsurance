/* ============================================================================
   POPPELL INSURANCE AGENCY — CARRIER CONFIG
   ----------------------------------------------------------------------------
   WHAT LIVES WHERE (this changed — read it once)

     index.html    All page content. Headings, coverage copy, the team,
                   address, phone numbers, hours, About, and the JSON-LD
                   structured data block.

     THIS FILE     Carriers she represents (an array — she is adding, not
                   replacing), existing-customer link-outs, the reviews
                   switch, the quote form URL, and the domain.

   WHY THE SPLIT. Content used to be generated here at runtime. That made the
   carrier swap a one-file edit, but it also meant the served HTML was an
   empty shell — her name, address and phone existed only after JavaScript
   ran. Google renders JS on a delayed second pass; most citation scrapers,
   directory crawlers and social bots never run it at all, and NAP data is
   precisely what those exist to harvest. Content moved into the HTML so it
   is in the document every crawler receives.

   The trade: a carrier change now touches two files instead of one. See
   CARRIERS.md for the exact list. Worth it — the entire point of this site
   is that she gets found.
   ==========================================================================*/

window.SITE = {

  /* ---------------------------------------------------------------------
     CARRIERS — an array, on purpose
     ---------------------------------------------------------------------
     Alyssa is not leaving Farmers. She is ADDING brokers alongside it. That
     is a different shape of problem from a swap, so this is a list rather
     than a single object.

     To add a carrier: append an entry. Its disclosures append to the footer
     automatically, in array order. Nothing else in the codebase needs to
     know how many carriers exist.

     The site's identity is Poppell Insurance Agency. A carrier is something
     she represents, never the brand of the page. No carrier name appears in
     any heading, any body copy, or any stylesheet — only in disclosures,
     and in the email addresses in index.html.
     ------------------------------------------------------------------ */
  carriers: [
    {
      id: 'farmers',
      name: 'Farmers',
      legalName: 'Farmers Insurance Exchange and its affiliates',

      // HOLD — no carrier logo until Alyssa supplies the carrier's agent
      // marketing guidelines. Logo use, the registered mark, colour usage
      // and how the agency name is written are all governed, and many
      // carriers require review before an agent site launches.
      logo: null,

      disclosures: [
        'Insurance underwritten by Farmers Insurance Exchange, Fire Insurance Exchange, Truck Insurance Exchange, Mid-Century Insurance Company, Civic Property and Casualty Company, Exact Property and Casualty Company, Neighborhood Spirit Property and Casualty Company, or affiliates. Home office, Los Angeles, CA.',
        'Life insurance issued by Farmers New World Life Insurance Company, 12822 SE 32nd St., Ste. 2, Bellevue, WA 98005. Products and features may not be available to all applicants or in all states and may vary by state. Restrictions, exclusions, limits, and conditions apply.',
        'Each insurer has sole financial responsibility for its own insurance. Not all insurers are authorized in all states. Not all products, coverages, features and discounts are available in every state and may vary by state.'
      ]
    }

    /* ── ADDING A SECOND CARRIER ──────────────────────────────────────────
       Copy the block above. Every carrier she appoints with brings its own
       required disclosure language — get it from that carrier, do not adapt
       Farmers' wording. Each string is one paragraph.
       ------------------------------------------------------------------ */
  ],

  /* ---------------------------------------------------------------------
     EXISTING-CUSTOMER ACTIONS
     ---------------------------------------------------------------------
     Payments and claims run on the carrier's own systems. An agent site
     must never rebuild either — it is a compliance problem as much as a
     technical one. These are link-outs only.

     While null, both tiles fall back to a phone link so a customer is never
     stranded, and render a NEEDS marker so the section cannot quietly ship
     half-finished. Ask Alyssa — the URLs may be agent-specific.
     ------------------------------------------------------------------ */
  customer: {
    paymentUrl: null,   // NEEDS: carrier payment portal URL
    claimsUrl: null,    // NEEDS: carrier claims URL
    fallbackPhone: '719-563-9712'
  },

  /* ---------------------------------------------------------------------
     REVIEWS — built, switched off
     ---------------------------------------------------------------------
     Flip `enabled` to true once there are reviews worth showing. The
     section renders nothing at all while this is false.

     Two things to settle first: whether these are pulled from her Google
     Business Profile (needs an API integration or a third-party embed, and
     display is subject to Google's terms) or entered by hand as
     testimonials; and whether the carrier has rules about displaying
     testimonials. Add that to the compliance list.
     ------------------------------------------------------------------ */
  reviews: {
    enabled: false,
    heading: 'What clients say',
    items: []   // { quote: '', author: '', context: '' }
  },

  /* The quote form is built into the site now — see src/partials/quote.js.
     The Jotform embed is gone: a third-party iframe that can fail to load,
     cannot be styled, and sends leads somewhere else was the weakest part
     of the page. */

  /* ---------------------------------------------------------------------
     SITE
     ---------------------------------------------------------------------
     Set `domain` the moment it exists — no protocol, no trailing slash,
     e.g. 'poppellinsurance.com'. It injects `url` and `@id` into the
     JSON-LD and absolute URLs into the Open Graph tags.

     Setting it here does NOT set the <link rel="canonical">. That one is
     commented out in index.html and must be uncommented by hand, because a
     canonical injected by JavaScript is unreliable and a wrong canonical is
     worse than none.
     ------------------------------------------------------------------ */
  site: {
    domain: null,
    year: new Date().getFullYear()
  },

  /* ---------------------------------------------------------------------
     UNRESOLVED — not blocking, but costing her money
     ---------------------------------------------------------------------
     PHONE. As of the v3 brief:
       719-563-9712  MAIN OFFICE — site-wide, and matches her carrier
                     agent page. This is the NAP-consistent number.
       719-657-1212  Alyssa's direct line — Team section only
       719-679-5050  Charlene's direct line — Team section only
       719-657-1201  Jean's direct line — Team section only
       719-306-1894  printed on her BUSINESS CARD. Still unaccounted for.
                     Physical cards are in circulation pointing at a number
                     that appears nowhere else. Confirm it forwards, or
                     reprint.
     Search engines cross-reference name/address/phone across listings.
     Mismatches lower confidence in the Google Business Profile, which is
     what actually drives map-pack ranking. Reconciling these will move her
     ranking more than anything on this page.

     EMAIL. All three published addresses are on the carrier's domain and
     die on transition — and they are now in the HTML, the JSON-LD, and
     will be indexed. A domain with three forwarding addresses fixes this
     permanently and costs almost nothing.
     ------------------------------------------------------------------ */
};
