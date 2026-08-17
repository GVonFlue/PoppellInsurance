/* ============================================================================
   POPPELL INSURANCE AGENCY — SITE CONFIG  (v2)
   ----------------------------------------------------------------------------
   THIS IS THE ONLY FILE THAT CHANGES WHEN ALYSSA LEAVES FARMERS.

   No component, no HTML file, and no stylesheet anywhere in this project
   contains the word "Farmers". Every carrier-specific string lives in the
   `carrier` object below. To switch carriers: edit that block, drop the new
   logo into assets/brand/, redeploy. See BRANDING-SWAP.md.

   NULL POLICY: any value we have not verified is `null`. A null renders a
   visible amber "NEEDS <field>" marker on the page instead of silently
   disappearing. A missing legal disclosure that quietly collapses to nothing
   is how a licensee gets in trouble, so it fails loudly.
   ==========================================================================*/

window.SITE = {

  /* ---------------------------------------------------------------------
     CARRIER — the swappable block
     ------------------------------------------------------------------ */
  carrier: {
    name: 'Farmers',
    legalName: 'Farmers Insurance Exchange and its affiliates',
    eyebrow: null,

    // HOLD — do not add a carrier logo until Alyssa supplies the carrier's
    // agent marketing guidelines. Logo use, the registered mark, colour
    // usage and how the agency name is written are all governed, and many
    // carriers require review before an agent site launches.
    logo: null,

    // Agency codes from her agent page.
    agencyCodes: '0706L4 / 0706JL',

    quoteUrl: 'https://agents.farmers.com/co/colorado-springs/alyssa-poppell/',

    // REPLACE ENTIRELY ON CARRIER SWITCH. Each string renders as its own
    // paragraph in the footer.
    disclosures: [
      'Insurance underwritten by Farmers Insurance Exchange, Fire Insurance Exchange, Truck Insurance Exchange, Mid-Century Insurance Company, Civic Property and Casualty Company, Exact Property and Casualty Company, Neighborhood Spirit Property and Casualty Company, or affiliates. Home office, Los Angeles, CA.',
      'Life insurance issued by Farmers New World Life Insurance Company, 12822 SE 32nd St., Ste. 2, Bellevue, WA 98005. Products and features may not be available to all applicants or in all states and may vary by state. Restrictions, exclusions, limits, and conditions apply.',
      'Each insurer has sole financial responsibility for its own insurance. Not all insurers are authorized in all states. Not all products, coverages, features and discounts are available in every state and may vary by state.'
    ]

    /* ── OMITTED ON PURPOSE: FARMERS FINANCIAL SOLUTIONS ─────────────────
       She is appointed for Farmers Financial Solutions, LLC (member FINRA
       & SIPC). Securities content is governed by FINRA advertising rules,
       which generally require broker-dealer principal pre-approval before
       publication — a stricter regime than insurance marketing.

       Nothing on this site references financial or investment services.
       Do NOT add it until her broker-dealer has approved specific copy.

       ── ALSO PROHIBITED SITE-WIDE ───────────────────────────────────────
       No comparative or savings claims anywhere: no "best rates", no "we
       shop the market", no "save up to". The carrier's own savings claims
       carry survey methodology footnotes; an agent site cannot make them.

       Do not lift carrier product copy. Their marketing language is
       version-controlled and carries form numbers. All copy on this site
       is original.
       ------------------------------------------------------------------ */
  },

  /* ---------------------------------------------------------------------
     PRINCIPAL — stays true across a carrier change
     ------------------------------------------------------------------ */
  agent: {
    name: 'Alyssa Poppell',
    legalName: 'Alyssa L Poppell',
    title: 'Owner',
    agency: 'Poppell Insurance Agency',
    tagline: 'Protect what matters.',
    creed: 'Local service. Real relationships. Reliable protection.',

    // Her direct line. See `team` below for the full published set.
    //
    // UNRESOLVED — there are now FOUR numbers associated with her:
    //   719-657-1212  her direct line (this one, from Logan's call)
    //   719-679-5050  Charlene's direct line
    //   719-657-1201  Jean's direct line
    //   719-306-1894  printed on her BUSINESS CARD — not on Logan's list
    //   719-563-9712  published on her carrier agent page — explicitly not used
    // The card number is physically in circulation. Get an answer on whether
    // it forwards, is dead, or is a fourth line.
    phone: '719-657-1212',

    // WARNING: carrier-domain address. Dies the day she leaves. All three
    // team addresses have the same problem — see the note on `team`.
    email: 'apoppell@farmersagent.com',

    license: '640903',
    licensedIn: ['Colorado'],

    address: {
      street: '611 N Weber St.',
      unit: 'Ste. 202',
      city: 'Colorado Springs',
      state: 'CO',
      zip: '80903',
      mapUrl: 'https://maps.google.com/maps?cid=2630466317143634927'
    },

    // Source: her Google Business Profile (CID above), 2026-08-15. Her
    // carrier agent page leaves this field empty, so GBP is the only source.
    // GBP is often stale — worth one confirmation from her.
    hours: [
      'Monday – Friday · 8:30 AM – 5:30 PM',
      'Saturday & Sunday · Closed'
    ],

    // Studio grey knocked out and replaced with brand blush. Do NOT swap in
    // the carrier-hosted CDN copy — that URL is their infrastructure and can
    // change without notice.
    portrait: '/assets/brand/alyssa-poppell.jpg',

    social: { facebook: null, instagram: null, linkedin: null, google: null }
  },

  /* ---------------------------------------------------------------------
     TEAM — the whole argument of the site
     ---------------------------------------------------------------------
     Publishing a direct line for every person is the differentiator.
     Agencies almost never do it. Titles are what make it usable — "who do
     I call for what" — so a missing title renders a NEEDS marker rather
     than quietly leaving a name floating with a phone number.

     EMAIL WARNING: all three addresses are on the carrier's domain. v1 put
     one carrier address on the page; this puts three, plus builds them into
     her search footprint. If she is building a personal brand ahead of a
     move, a domain with three forwarding addresses fixes this permanently
     and costs almost nothing. Flagged, not blocked.
     ------------------------------------------------------------------ */
  team: [
    {
      name: 'Alyssa L Poppell',
      title: 'Owner',
      phone: '719-657-1212',
      email: 'apoppell@farmersagent.com',
      portrait: '/assets/brand/alyssa-poppell.jpg'
    },
    {
      // NEEDS: last name
      name: 'Charlene',
      title: null,                    // NEEDS: job title
      phone: '719-679-5050',
      email: 'Charlene.apoppell@farmersagent.com',
      portrait: null                  // NEEDS: headshot
    },
    {
      // NEEDS: last name
      name: 'Jean',
      title: null,                    // NEEDS: job title
      phone: '719-657-1201',
      email: 'Jean.apoppell@farmersagent.com',
      portrait: null                  // NEEDS: headshot
    }
  ],

  /* ---------------------------------------------------------------------
     CORE COVERAGE
     ------------------------------------------------------------------ */
  coverage: [
    {
      id: 'property',
      label: 'Property',
      lede: 'Home, condo, renters, landlord.',
      body: 'Your house is likely the largest thing you own, and the coverage on it is usually the least examined. We go through what is actually protected, what is not, and where the gap sits between the two.'
    },
    {
      id: 'auto',
      label: 'Auto',
      lede: 'Cars, trucks, motorcycles, RVs, boats.',
      body: 'Liability limits, deductibles, uninsured motorist coverage. Plain answers on what each one does, and an honest read on whether you are carrying too much or not nearly enough.'
    },
    {
      id: 'life',
      label: 'Life',
      lede: 'Term, whole, and universal life.',
      body: 'The one people put off. A short conversation now about who depends on your income, and what happens to them if it stops, is worth more than a policy you never got around to buying.'
    },
    {
      id: 'business',
      label: 'Business',
      lede: 'Liability, commercial auto, property, workers\u2019 comp.',
      body: 'You know your operation better than any insurer does. Our job is to translate it into coverage that holds up when something goes sideways, without paying for protection you will never use.'
    }
  ],

  /* ---------------------------------------------------------------------
     SPECIALTY
     ---------------------------------------------------------------------
     UNCONFIRMED — inferred from her carrier appointment list, not from her
     own words. Being wrong about what coverage an agency offers is worse
     than omitting it. Confirm before this stays up.
     Financial services deliberately excluded — see the carrier block.
     ------------------------------------------------------------------ */
  specialty: [
    {
      id: 'umbrella',
      label: 'Umbrella',
      body: 'Liability limits on a home or auto policy stop somewhere. An umbrella picks up above them and covers what you have built and what you are still going to earn.'
    },
    {
      id: 'recreational',
      label: 'Recreational',
      body: 'Boats, ATVs, RVs, motor homes, personal watercraft, motorcycles. The things that spend most of the year parked and are rarely covered the way owners assume.'
    },
    {
      id: 'condorenters',
      label: 'Condo & Renters',
      body: 'The building is insured. Everything inside it is your problem. Renters coverage in particular costs less than most people guess and is the easiest gap in this list to close.'
    }
  ],

  /* ---------------------------------------------------------------------
     ABOUT THE TEAM
     ---------------------------------------------------------------------
     DRAFT — deliberately contains NO facts: no years in business, no
     founding story, no hometown, no headcount history. Approach only, so
     nothing in it can be wrong.

     Her carrier bio is the identical boilerplate paragraph every agent on
     that platform receives, and her Education, Licenses and Awards fields
     are all empty. A real paragraph in her voice is the single biggest
     differentiator available against every other agent page in the city.
     Push for it and replace this.
     ------------------------------------------------------------------ */
  about: [
    'Most people buy insurance once, file it away, and never look at it again until something goes wrong. That is usually the worst possible time to find out what a policy actually covers.',
    'We work the other way around. We go through what you own, what you owe, and who depends on you, then tell you plainly where you are covered and where you are exposed. Sometimes that means adding coverage. Sometimes it means telling you that you are paying for something you do not need.',
    'And when you call, you reach the person you meant to reach. Every one of us has a direct line published on this page. No queue, no routing, no explaining your file from the beginning to somebody new.'
  ],

  /* ---------------------------------------------------------------------
     QUOTE FORM
     ------------------------------------------------------------------ */
  // utm_id stripped — those params were dashboard tracking and would have
  // tagged every site visitor as arriving from that campaign.
  jotformUrl: 'https://form.jotform.com/261545367737063',

  /* ---------------------------------------------------------------------
     SITE META
     ------------------------------------------------------------------ */
  site: {
    domain: null,   // NEEDS: domain, for canonical + OG tags
    year: new Date().getFullYear()
  }
};
