/* ============================================================================
   COVERAGE CONTENT
   ----------------------------------------------------------------------------
   `short` feeds the homepage rows. `page` builds the service page.

   The Colorado sections are the reason these pages deserve to exist. A page
   that just restates the homepage blurb is a thin doorway page and search
   engines treat it as one. Hail, wildfire and the Front Range are things only
   a Colorado agent should be writing about.

   COMPLIANCE, applies to every word here:
     · no premium figures, no price estimates, no savings claims
     · nothing that states what a specific policy will or will not pay
     · no carrier product copy — all of this is original
     · educational framing only; the call is always "let's look at yours"
   ==========================================================================*/

const COVERAGE = [
  {
    slug: 'home-insurance',
    id: 'property',
    label: 'Property',
    navLabel: 'Home & property',
    lede: 'Home, condo, renters and landlord insurance',
    short: 'Your house is likely the largest thing you own, and the coverage on it is usually the least examined. We go through what is actually protected, what is not, and where the gap sits between the two.',
    title: 'Home Insurance in Colorado — Poppell Insurance Agency',
    description: 'Homeowners, condo, renters and landlord insurance across Colorado. Roof and hail coverage explained plainly by a Colorado Springs agent.',
    h1: 'Home insurance in Colorado.',
    intro: 'Colorado is one of the hardest states in the country to insure a roof in. That single fact shapes more homeowners policies here than anything else, and most people never hear about it until the adjuster is standing in their driveway.',
    sections: [
      {
        h: 'The roof is the whole conversation',
        p: [
          'The Front Range sits in one of the most active hail corridors in North America. Insurers know it, and they have spent the last decade changing how roofs are covered rather than refusing to cover them.',
          'The change that catches people is the shift from replacement cost to actual cash value on older roofs. Replacement cost pays what it takes to put a new roof on. Actual cash value pays that figure minus depreciation for the years the roof has already lived. On a roof with a few seasons left, those two numbers are very far apart, and which one applies to you is written in your policy right now.',
          'Cosmetic damage exclusions are the other one. Hail can dent a metal roof or scar shingles without breaching anything. Some policies treat that as damage. Others exclude it by name.'
        ]
      },
      {
        h: 'Wildfire, and how insurers score your address',
        p: [
          'Carriers use wildfire risk models that score individual properties, not just zip codes. Defensible space, roof material, deck construction and the vegetation around your home all move that score, and the score moves availability and terms.',
          'This is one of the few areas where work you do on your own property changes what an insurer will offer. It is worth knowing where you stand before you need to.'
        ]
      },
      {
        h: 'What we actually go through',
        p: [
          'Dwelling limit against what rebuilding would genuinely cost today, which is rarely what you paid. Personal property, and whether yours is scheduled or lumped. Loss of use, which people forget exists until they need somewhere to live. Liability limits, and whether they are anywhere near what you have to lose.',
          'Then the deductible, which on a hail-exposed home is often a percentage of the dwelling limit rather than a flat number — a distinction that surprises people at exactly the wrong moment.'
        ]
      }
    ],
    also: ['Condo (HO-6) and renters coverage', 'Landlord and rental dwelling policies', 'Scheduled personal property for jewellery, firearms and collections', 'Water backup and sump failure']
  },

  {
    slug: 'auto-insurance',
    id: 'auto',
    label: 'Auto',
    navLabel: 'Auto',
    lede: 'Cars, trucks, motorcycles, RVs and boats',
    short: 'Liability limits, deductibles, uninsured motorist coverage. Plain answers on what each one does, and an honest read on whether you are carrying too much or not nearly enough.',
    title: 'Auto Insurance in Colorado — Poppell Insurance Agency',
    description: 'Car, truck and motorcycle insurance across Colorado. Liability limits, uninsured motorist and hail coverage explained by a Colorado Springs agent.',
    h1: 'Auto insurance in Colorado.',
    intro: 'Most people can tell you their monthly payment and almost nobody can tell you their liability limit. The second number is the one that matters if something goes badly wrong.',
    sections: [
      {
        h: 'Liability is the number to know',
        p: [
          'Colorado requires you to carry liability coverage, and the state minimum is exactly that — a legal floor, not a recommendation. If you cause a serious accident and the costs run past your limit, the difference does not disappear. It follows you.',
          'The right limit is not a number anyone can hand you off a chart. It depends on what you own, what you earn, and what a court could reach. That is a ten-minute conversation and most people have never had it.'
        ]
      },
      {
        h: 'Uninsured and underinsured motorist',
        p: [
          'This is the coverage that pays when the other driver caused it and cannot cover it. It is optional in Colorado and it is the coverage people are most often glad they kept.',
          'Underinsured is the quieter half. The other driver has insurance, just nowhere near enough, and this is what closes that gap.'
        ]
      },
      {
        h: 'Hail, again',
        p: [
          'Comprehensive is what covers hail damage to a vehicle, and along the Front Range that is not a hypothetical. A single storm can total a parking lot. If a car lives outside here, comprehensive is doing real work.',
          'Glass is worth asking about separately — how your policy treats a windshield varies more than people expect.'
        ]
      }
    ],
    also: ['Motorcycles and off-road', 'Classic and collector vehicles', 'RVs, motor homes and travel trailers', 'Roadside assistance and rental reimbursement']
  },

  {
    slug: 'life-insurance',
    id: 'life',
    label: 'Life',
    navLabel: 'Life',
    lede: 'Term, whole and universal life insurance',
    short: 'The one people put off. A short conversation now about who depends on your income, and what happens to them if it stops, is worth more than a policy you never got around to buying.',
    title: 'Life Insurance in Colorado — Poppell Insurance Agency',
    description: 'Term, whole and universal life insurance in Colorado. A plain conversation about who depends on your income, from a Colorado Springs agent.',
    h1: 'Life insurance in Colorado.',
    intro: 'Life insurance is the only coverage you buy that you will never use yourself. That is exactly why it gets postponed, and exactly why postponing it is expensive — the two things that set the price are your age and your health, and both move in one direction.',
    sections: [
      {
        h: 'Term versus permanent, without the sales pitch',
        p: [
          'Term covers a set number of years. It is the simplest and least expensive way to cover a defined obligation — the years until a mortgage is paid, or until the youngest child is through school.',
          'Permanent coverage, whole or universal, lasts as long as the policy is funded and builds cash value over time. It costs more for the same death benefit because it is doing more than one job.',
          'Which one fits is a question about what you are trying to protect and for how long. Anyone who tells you one is simply better than the other is selling, not advising.'
        ]
      },
      {
        h: 'The question underneath it',
        p: [
          'Not how much life insurance should I have. Who depends on my income, and what happens to them the month after it stops.',
          'That usually means the mortgage, everyday costs for a defined stretch, any debt that would not die with you, and whatever you had planned to fund but have not yet. Work through that and the number comes out on its own.'
        ]
      },
      {
        h: 'What we do not do',
        p: [
          'Nothing on this site is investment advice, and no conversation about life insurance here will turn into one. If your situation calls for that, you get pointed to a licensed professional in that field rather than sold something adjacent.'
        ]
      }
    ],
    also: ['Term life', 'Whole life', 'Universal life', 'Reviewing coverage you already have']
  },

  {
    slug: 'business-insurance',
    id: 'business',
    label: 'Business',
    navLabel: 'Business',
    lede: 'Liability, commercial auto, property, workers\u2019 comp',
    short: 'You know your operation better than any insurer does. Our job is to translate it into coverage that holds up when something goes sideways, without paying for protection you will never use.',
    title: 'Business Insurance in Colorado — Poppell Insurance Agency',
    description: 'Commercial liability, property, commercial auto and workers compensation for Colorado businesses. Colorado Springs based, statewide.',
    h1: 'Business insurance in Colorado.',
    intro: 'Most small business coverage is bought once, at the point somebody demanded a certificate, and never revisited. Then the business changes — a truck, an employee, a second location — and the policy quietly stops matching the operation.',
    sections: [
      {
        h: 'The pieces, and what each one is actually for',
        p: [
          'General liability covers harm your business causes to other people or their property. Commercial property covers your building, equipment and inventory. The two are often bundled, and the bundle is often where the gaps hide.',
          'Commercial auto is the one that catches people. A personal auto policy can exclude a vehicle used for business. If your work happens out of a truck, that distinction matters enormously.',
          'Workers compensation is generally required in Colorado once you have employees, and the rules around who counts as an employee are less obvious than they look.'
        ]
      },
      {
        h: 'The parts nobody asks about until they need them',
        p: [
          'Business interruption, which covers the income you lose while you cannot operate. Cyber liability, which matters to any business holding customer data, including very small ones. Employment practices liability. Professional liability, if you give advice for a living.'
        ]
      },
      {
        h: 'How the conversation goes',
        p: [
          'You describe what you actually do, day to day, including the parts that feel too small to mention. The vehicle that is technically personal. The contractor who is technically not an employee. The equipment you take off-site. Those details are usually where the exposure lives.'
        ]
      }
    ],
    also: ['General liability', 'Commercial property', 'Commercial auto and fleet', 'Workers compensation', 'Business owner policies']
  }
];

const SPECIALTY = [
  {
    slug: 'umbrella-insurance',
    id: 'umbrella',
    label: 'Umbrella',
    navLabel: 'Umbrella',
    short: 'Liability limits on a home or auto policy stop somewhere. An umbrella picks up above them and covers what you have built and what you are still going to earn.',
    title: 'Umbrella Insurance in Colorado — Poppell Insurance Agency',
    description: 'Personal umbrella liability coverage in Colorado. Protection above your home and auto limits, from a Colorado Springs agent.',
    h1: 'Umbrella insurance in Colorado.',
    intro: 'Every liability limit you carry has a ceiling. An umbrella sits above all of them and keeps going after they run out.',
    sections: [
      {
        h: 'Who it is actually for',
        p: [
          'The instinct is that umbrella coverage is for wealthy people. The more useful way to think about it is that it is for anyone with more to lose than their liability limit covers — and that includes future earnings, not just current assets.',
          'A young professional with a long career ahead can be more exposed than someone with a paid-off house and no income left to garnish.'
        ]
      },
      {
        h: 'What tends to trigger it',
        p: [
          'A serious at-fault car accident is the common one. After that: a dog bite, a guest injured on your property, a teenage driver, a pool, a short-term rental. Anything that puts other people in contact with your household.'
        ]
      },
      {
        h: 'How it works with what you already have',
        p: [
          'An umbrella sits on top of your existing home and auto liability, which means those underlying policies usually have to carry certain limits before an umbrella will attach. Getting those right is part of the same conversation.'
        ]
      }
    ],
    also: ['Personal umbrella liability', 'Coordinating underlying home and auto limits', 'Landlord and rental property exposure']
  },
  {
    slug: 'renters-insurance',
    id: 'condorenters',
    label: 'Condo & Renters',
    navLabel: 'Condo & renters',
    short: 'The building is insured. Everything inside it is your problem. Renters coverage in particular costs less than most people guess and is the easiest gap in this list to close.',
    title: 'Renters & Condo Insurance in Colorado — Poppell Insurance Agency',
    description: 'Renters and condo (HO-6) insurance across Colorado. What your landlord or HOA policy does not cover, explained by a Colorado Springs agent.',
    h1: 'Renters and condo insurance in Colorado.',
    intro: 'The single most common misunderstanding in insurance: the building being insured has nothing to do with your things being insured.',
    sections: [
      {
        h: 'What the landlord policy actually covers',
        p: [
          'The structure. That is it. Your landlord insures the building because the building is theirs. Everything you moved in is yours to insure, and if it is destroyed the landlord policy does not replace it.',
          'Renters coverage also carries liability, which is the part people never think about — if something starting in your unit damages the units around it, that is pointed at you.'
        ]
      },
      {
        h: 'Condo owners have a seam to watch',
        p: [
          'An HOA master policy covers the building to some defined point, and your HO-6 covers from that point inward. Exactly where that line falls is written in the HOA documents and it is not standard from one association to the next.',
          'Reading the master policy before choosing your limits is the whole job. Guessing at that line is how people end up paying for drywall twice or not at all.'
        ]
      },
      {
        h: 'Loss assessment, the one nobody knows about',
        p: [
          'When an HOA has a loss bigger than its master policy covers, it can assess the owners for the difference. Loss assessment coverage on your HO-6 responds to that. It is inexpensive and most people have never heard of it.'
        ]
      }
    ],
    also: ['Renters (HO-4)', 'Condo (HO-6)', 'Loss assessment coverage', 'Scheduled valuables']
  },
  {
    slug: 'recreational-insurance',
    id: 'recreational',
    label: 'Recreational',
    navLabel: 'Recreational',
    short: 'Boats, ATVs, RVs, motor homes, personal watercraft, motorcycles. The things that spend most of the year parked and are rarely covered the way owners assume.',
    title: 'RV, Boat & Recreational Insurance in Colorado — Poppell Insurance',
    description: 'RV, motor home, boat, ATV and motorcycle insurance across Colorado. Colorado Springs based, statewide coverage.',
    h1: 'Recreational insurance in Colorado.',
    intro: 'Colorado owns a lot of toys. Most of them spend nine months parked and three months in places where help is a long way off, and that combination is not what a standard policy is built for.',
    sections: [
      {
        h: 'Parked is not the same as safe',
        p: [
          'A stored RV or boat is still exposed to hail, theft, fire and the slow damage of sitting. Owners often assume a homeowners policy picks that up. Coverage for a vehicle stored on your property is narrower than most people expect, and often capped well below what the thing is worth.'
        ]
      },
      {
        h: 'The RV question is really two questions',
        p: [
          'A motor home is a vehicle and a residence at once, and coverage has to answer both. Liability while driving is one thing. What happens when you are living in it, or when your possessions inside it are stolen, is another.',
          'Full-timers need something different again from someone who takes it out four weekends a year.'
        ]
      },
      {
        h: 'Where you use it matters',
        p: [
          'Boats and personal watercraft have navigational limits. Off-road vehicles have coverage that changes depending on whether you are on your own land, public trails, or a road. Worth knowing which side of those lines you spend your time on.'
        ]
      }
    ],
    also: ['Boats and personal watercraft', 'ATVs, UTVs and off-road', 'RVs, motor homes and travel trailers', 'Motorcycles', 'Classic and collector vehicles']
  }
];

module.exports = { COVERAGE, SPECIALTY };
