/* ============================================================================
   POPPELL INSURANCE AGENCY — SITE CONFIG
   ----------------------------------------------------------------------------
   THIS IS THE ONLY FILE THAT CHANGES WHEN ALYSSA LEAVES FARMERS.

   No component, no HTML file, and no stylesheet anywhere in this project
   contains the word "Farmers". Every carrier-specific string — the carrier
   name, the quote link, the license number, every legal disclosure — lives
   in the `carrier` object below.

   To switch carriers: edit the `carrier` block, drop the new logo into
   assets/brand/, redeploy. Nothing else. See BRANDING-SWAP.md.

   NULL POLICY: any value we have not verified with the client is `null`.
   A null value renders a visible amber "NEEDS <field>" marker on the page
   instead of silently disappearing. A missing legal disclosure that quietly
   collapses to nothing is how a licensee gets in trouble, so it fails loudly.
   ==========================================================================*/

window.SITE = {

  /* ---------------------------------------------------------------------
     CARRIER — the swappable block
     ------------------------------------------------------------------ */
  carrier: {
    // Display name used in body copy, e.g. "as your local {name} agent"
    name: 'Farmers',

    // Full legal name used in the footer disclosure line
    legalName: 'Farmers Insurance Exchange and its affiliates',

    // Shown next to her name in the header eyebrow. Set to null to hide.
    eyebrow: 'Independent agent · Farmers Insurance',

    // Path to carrier logo in the footer. null = no logo rendered.
    logo: null, // NEEDS: carrier logo file, if she's permitted to display one

    // Where the "Start a quote" buttons point.
    quoteUrl: 'https://agents.farmers.com/co/colorado-springs/alyssa-poppell/',

    // Footer legal text. Each string renders as its own paragraph.
    // REPLACE ENTIRELY ON CARRIER SWITCH.
    disclosures: [
      'Insurance underwritten by Farmers Insurance Exchange, Fire Insurance Exchange, Truck Insurance Exchange, Mid-Century Insurance Company, Civic Property and Casualty Company, Exact Property and Casualty Company, Neighborhood Spirit Property and Casualty Company, or affiliates. Home office, Los Angeles, CA.',
      'Life insurance issued by Farmers New World Life Insurance Company, 12822 SE 32nd St., Ste. 2, Bellevue, WA 98005. Products and features may not be available to all applicants or in all states and may vary by state. Restrictions, exclusions, limits, and conditions apply.',
      'Each insurer has sole financial responsibility for its own insurance. Not all insurers are authorized in all states. Not all products, coverages, features and discounts are available in every state and may vary by state.'
    ]
  },

  /* ---------------------------------------------------------------------
     AGENT — stays true across a carrier change
     ------------------------------------------------------------------ */
  agent: {
    name: 'Alyssa Poppell',
    legalName: 'Alyssa L Poppell',
    title: 'Owner',
    agency: 'Poppell Insurance Agency',
    tagline: 'Protect what matters.',
    creed: 'Local service. Real relationships. Reliable protection.',

    // CONFLICT — resolve before launch.
    //   Business card:  719-306-1894
    //   Farmers page:   719-563-9712
    // Using the card number as the later, client-authored value.
    phone: '719-306-1894',

    // WARNING: this address dies the day she leaves Farmers. It should be
    // replaced with a domain address (e.g. alyssa@poppellinsurance.com)
    // before launch, forwarding wherever she wants today.
    email: 'apoppell@farmersagent.com',

    license: '640903',
    licensedIn: ['Colorado'],

    address: {
      street: '611 North Weber St.',
      unit: 'Unit 202',
      city: 'Colorado Springs',
      state: 'CO',
      zip: '80903',
      mapUrl: 'https://maps.google.com/maps?cid=2630466317143634927'
    },

    // NEEDS: office hours from the client. Farmers page has them blank.
    hours: null,

    // DRAFT — for Alyssa to approve, edit, or replace.
    // Deliberately contains NO biographical facts: no years in business, no
    // hometown, no family, no education, no awards. Everything here is about
    // approach only, so nothing can be wrong. Once she sends real details,
    // this should be rewritten in her actual voice.
    bio: [
      'Most people buy insurance once, file it away, and never look at it again until something goes wrong. That is usually the worst possible time to find out what a policy actually covers.',
      'I work the other way around. We go through what you own, what you owe, and who depends on you, and I tell you plainly where you are covered and where you are exposed. Sometimes that means adding coverage. Sometimes it means telling you that you are paying for something you do not need.',
      'When you call this office, you get me. Not a queue, not a different rep every time, not someone reading your file for the first time.'
    ],

    // Studio grey backdrop knocked out and replaced with the brand blush
    // so she sits on the page rather than in a grey box.
    portrait: '/assets/brand/alyssa-poppell.jpg',

    social: {
      facebook: null,
      instagram: null,
      linkedin: null,
      google: null
    }
  },

  /* ---------------------------------------------------------------------
     COVERAGE — the four from her card
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
      body: 'You know your operation better than any insurer does. My job is to translate it into coverage that holds up when something goes sideways, without paying for protection you will never use.'
    }
  ],

  /* ---------------------------------------------------------------------
     QUOTE FORM
     ------------------------------------------------------------------ */
  // utm_id stripped from the URL she supplied — those params were from the
  // Jotform dashboard link, not the form itself, and would have logged every
  // site visitor as arriving from that campaign.
  jotformUrl: 'https://form.jotform.com/261545367737063',

  /* ---------------------------------------------------------------------
     SITE META
     ------------------------------------------------------------------ */
  site: {
    // NEEDS: domain. Used for canonical + OG tags.
    domain: null,
    year: new Date().getFullYear()
  }
};
