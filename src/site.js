/* ============================================================================
   POPPELL INSURANCE — SITE DATA
   ----------------------------------------------------------------------------
   Single source of truth for anything that appears on more than one page.
   The build reads this and writes static HTML into the repo root, so what
   ships is still plain HTML with no runtime templating.

   Change the nav here once and every page gets it.
   ==========================================================================*/

const BOT = {
  name: 'Ally',
  // Her own name is inside it, and an ally is exactly what an agent is
  // supposed to be. The line is used in the nav tooltip and the chat header.
  tagline: 'Your ally, on call',
  navLabel: 'Chat with Ally'
};

const AGENT = {
  agency: 'Poppell Insurance Agency',
  name: 'Alyssa Poppell',
  legalName: 'Alyssa L Poppell',
  title: 'Owner',
  license: '640903',
  tagline: 'Protect what matters.',
  creed: 'Local service. Real relationships. Reliable protection.',

  // MAIN OFFICE. Matches her carrier agent page, which is why the NAP is
  // finally consistent. Direct lines live on the team cards only.
  phone: '719-563-9712',
  telHref: '+17195639712',

  // WARNING: carrier-domain address, dies on transition. One place to change.
  email: 'apoppell@farmersagent.com',

  address: {
    street: '611 N Weber St.',
    unit: 'Ste. 202',
    city: 'Colorado Springs',
    state: 'CO',
    zip: '80903',
    mapUrl: 'https://maps.google.com/maps?cid=2630466317143634927'
  },
  hours: [
    ['Monday – Friday', '8:00 AM – 5:00 PM'],
    ['Saturday', 'By appointment'],
    ['Sunday', 'Closed']
  ]
};

const TEAM = [
  { name: 'Alyssa Poppell', title: 'Owner', phone: '719-657-1212',
    tel: '+17196571212', email: 'apoppell@farmersagent.com',
    portrait: '/assets/brand/alyssa-poppell.jpg' },
  // First names only — that is how she submitted them, and it matches how a
  // small agency actually answers the phone.
  { name: 'Charlene', title: 'Insurance Advisor', phone: '719-679-5050',
    tel: '+17196795050', email: 'Charlene.apoppell@farmersagent.com',
    portrait: '/assets/brand/charlene.jpg' },
  { name: 'Jean', title: 'Client Care Specialist', phone: '719-657-1201',
    tel: '+17196571201', email: 'Jean.apoppell@farmersagent.com',
    portrait: '/assets/brand/jean.jpg' }
];

/* Social — from onboarding. */
const SOCIAL = [
  { label: 'Facebook',  url: 'https://www.facebook.com/share/1J3CWdPjt2/' },
  { label: 'Instagram', url: 'https://www.instagram.com/poppellagency' },
  { label: 'LinkedIn',  url: 'https://www.linkedin.com/in/alyssapoppell' },
  { label: 'Google',    url: 'https://agents.farmers.com/co/colorado-springs/alyssa-poppell/' }
];

/* Nav. Order matters. `chat` gets the accent treatment. */
const NAV = [
  { label: 'Coverage',  href: '/coverage' },
  { label: 'Specialty', href: '/#specialty' },
  { label: 'Team',      href: '/team' },
  { label: 'About',     href: '/about' },
  { label: BOT.navLabel, href: '/#ally', chat: true }
];

/* ---------------------------------------------------------------------
   ABOUT — edited down from her onboarding answer.
   Her submission ran ~350 words. This keeps every fact and the whole arc
   and cuts the repetition, because a website is read standing up.
   Facts preserved exactly: career started 2020, helped build an agency in
   2024, became Poppell Agency in August 2026.
   ------------------------------------------------------------------ */
const ABOUT = [
  'Poppell Agency didn\u2019t start overnight. It grew out of years of experience, a lot of relationships, and a genuine love for helping people.',
  'I started my insurance career in 2020 and worked out quickly that this job is about far more than policies and premiums. It is about being someone people can call when life changes, when something goes wrong, or when they just need help understanding what they are actually protecting.',
  'In 2024 I got the chance to help launch and build an agency from the ground up \u2014 customer relationships, a book of business, a team, and a culture built around taking care of people. In August 2026 all of that came under one name.',
  'We are trying to do this a little differently: build real relationships, educate instead of sell, show up for our community, and make sure our customers always feel like people rather than policy numbers.',
  'The name is new. The experience and the relationships are not.'
];

/* Who she loves working with — from onboarding, trimmed. */
const IDEAL = {
  heading: 'Who we love working with',
  body: [
    'People who want more than a quote \u2014 someone they can actually call, ask questions, and trust to help them understand their coverage.',
    'Families buying their first home. Growing households with more to protect. Established homeowners. Local business owners. Anyone who would rather deal with an agency that knows their name.',
    'Whether it is your first car, your forever home, the business you built, or the people you love most \u2014 we want to be the agency you know you can call.'
  ]
};

module.exports = { BOT, AGENT, TEAM, SOCIAL, ABOUT, IDEAL, NAV };
