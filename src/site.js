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
  { name: 'Alyssa L Poppell', title: 'Owner', phone: '719-657-1212',
    tel: '+17196571212', email: 'apoppell@farmersagent.com',
    portrait: '/assets/brand/alyssa-poppell.jpg' },
  { name: 'Charlene', title: null, phone: '719-679-5050',
    tel: '+17196795050', email: 'Charlene.apoppell@farmersagent.com',
    portrait: null },
  { name: 'Jean', title: null, phone: '719-657-1201',
    tel: '+17196571201', email: 'Jean.apoppell@farmersagent.com',
    portrait: null }
];

/* Nav. Order matters. `chat` gets the accent treatment. */
const NAV = [
  { label: 'Coverage',  href: '/coverage' },
  { label: 'Specialty', href: '/#specialty' },
  { label: 'Team',      href: '/team' },
  { label: 'About',     href: '/about' },
  { label: BOT.navLabel, href: '/#ally', chat: true }
];

module.exports = { BOT, AGENT, TEAM, NAV };
