/* ============================================================================
   POPPELL INSURANCE AGENCY — CARRIER CONFIG
   ----------------------------------------------------------------------------
   WHAT LIVES WHERE (this changed — read it once)

     index.html    All page content. Headings, coverage copy, the team,
                   address, phone numbers, hours, About, and the JSON-LD
                   structured data block.

     THIS FILE     Only the things that change when she switches carriers,
                   plus the quote form URL and the domain.

   WHY THE SPLIT. Content used to be generated here at runtime. That made the
   carrier swap a one-file edit, but it also meant the served HTML was an
   empty shell — her name, address and phone existed only after JavaScript
   ran. Google renders JS on a delayed second pass; most citation scrapers,
   directory crawlers and social bots never run it at all, and NAP data is
   precisely what those exist to harvest. Content moved into the HTML so it
   is in the document every crawler receives.

   The trade: a carrier switch now touches two files instead of one. See
   BRANDING-SWAP.md for the exact list. Worth it — the entire point of this
   site is that she gets found.
   ==========================================================================*/

window.SITE = {

  /* ---------------------------------------------------------------------
     CARRIER — the swappable block
     ------------------------------------------------------------------ */
  carrier: {
    name: 'Farmers',
    legalName: 'Farmers Insurance Exchange and its affiliates',

    // HOLD — no carrier logo until Alyssa supplies the carrier's agent
    // marketing guidelines. Logo use, the registered mark, colour usage and
    // how the agency name is written are all governed, and many carriers
    // require review before an agent site launches.
    logo: null,

    agencyCodes: '0706L4 / 0706JL',

    // REPLACE ENTIRELY ON CARRIER SWITCH. Each string is one paragraph.
    disclosures: [
      'Insurance underwritten by Farmers Insurance Exchange, Fire Insurance Exchange, Truck Insurance Exchange, Mid-Century Insurance Company, Civic Property and Casualty Company, Exact Property and Casualty Company, Neighborhood Spirit Property and Casualty Company, or affiliates. Home office, Los Angeles, CA.',
      'Life insurance issued by Farmers New World Life Insurance Company, 12822 SE 32nd St., Ste. 2, Bellevue, WA 98005. Products and features may not be available to all applicants or in all states and may vary by state. Restrictions, exclusions, limits, and conditions apply.',
      'Each insurer has sole financial responsibility for its own insurance. Not all insurers are authorized in all states. Not all products, coverages, features and discounts are available in every state and may vary by state.'
    ]

    /* ── OMITTED ON PURPOSE: FINANCIAL SERVICES ──────────────────────────
       She is appointed for the carrier's securities arm (member FINRA &
       SIPC). Securities content is governed by FINRA advertising rules,
       which generally require broker-dealer principal pre-approval before
       publication — stricter than insurance marketing.

       Nothing on this site references financial or investment services.
       Do NOT add any until her broker-dealer approves specific copy.

       ── PROHIBITED SITE-WIDE ────────────────────────────────────────────
       No comparative or savings claims: no "best rates", no "we shop the
       market", no "save up to". The carrier's own savings claims carry
       survey methodology footnotes; an agent site cannot make them.

       Do not lift carrier product copy — theirs is version-controlled and
       carries form numbers. Every word on this site is original.
       ------------------------------------------------------------------ */
  },

  /* ---------------------------------------------------------------------
     QUOTE FORM
     ------------------------------------------------------------------ */
  // utm_id stripped — those params were dashboard tracking and would have
  // tagged every site visitor as arriving from that campaign.
  jotformUrl: 'https://form.jotform.com/261545367737063',

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
     PHONE. Five numbers are associated with her:
       719-657-1212  her direct line — used site-wide
       719-679-5050  Charlene's direct line
       719-657-1201  Jean's direct line
       719-306-1894  printed on her BUSINESS CARD, not on the team list
       719-563-9712  published on her carrier agent page
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
