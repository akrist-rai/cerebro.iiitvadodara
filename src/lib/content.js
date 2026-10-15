export const EVENT = {
  name: 'CEREBRO',
  year: '’26',
  tagline: 'Beyond the horizon',
  host: 'Technical Committee',
  institute: 'IIIT Vadodara',
};

export const SECTIONS = [
  { id: 'about', key: '1', label: 'About' },
  { id: 'tracks', key: '2', label: 'Tracks' },
  { id: 'events', key: '3', label: 'Events' },
  { id: 'schedule', key: '4', label: 'Schedule' },
  { id: 'partners', key: '5', label: 'Partners' },
  { id: 'contact', key: '6', label: 'Crew' },
];

export const ABOUT =
  'Founded in 2013 by MHRD, *IIIT Vadodara (IIIT-V)* is an Institute of National Importance. Currently operating from GEC Gandhinagar, it organizes *Cerebro*, an annual nationwide hybrid tech fest featuring workshops, talks, exhibitions, literary events, and gaming competitions.';

export const CEREBRO =
  'Cerebro is the annual technical festival of IIIT Vadodara, a national-level hybrid fest that brings students from across India together for inter-college technical events. It is a platform for technophiles to show their talent, wit, and intelligence.';

// What the 2026-27 proposal commits to.
export const FACTS = {
  events: 15,
  participants: 3500,
  days: 7,
  mode: 'Hybrid',
  online: { from: '26 Oct', to: '30 Oct' },
  finals: { from: '31 Oct', to: '1 Nov' },
  split: [
    ['Coding', 2],
    ['Design', 2],
    ['Gaming', 4],
    ['Finance', 2],
    ['Mathematics', 2],
    ['Robotics', 2],
    ['Flagship', 1],
  ],
};

// Participants per edition, exactly as the deck's chart gives them.
export const GROWTH = [
  { year: '2019-20', n: 700 },
  { year: '2020-21', n: 1000 },
  { year: '2021-22', n: 1500 },
  { year: '2022-23', n: 2500 },
  { year: '2023-24', n: 3600 },
  { year: '2025-26', n: 4600 },
];

// `kind` is 'event' (a competition), 'zone' (a drop-in space) or 'ceremony'.
// `lede` opens the entry, `more` carries the rest, `num` is the running order.
export const EVENTS = [
  {
    id: 'inauguration',
    num: 0,
    kind: 'ceremony',
    name: 'Inauguration Ceremony',
    track: 'Ceremony',
    meta: ['Offline', 'Finals day 1'],
    lede: 'The *offline finals* of Cerebro ’26 open with the inauguration ceremony.',
    more: [],
  },
  {
    id: 'equinox',
    num: 1,
    kind: 'event',
    name: 'Equinox',
    track: 'Math',
    meta: ['2-member teams', 'Buzzer rounds'],
    lede: '*Equinox* is a multi-round buzzer competition for two-member teams, built around a wide spread of mathematical problems and a fast-moving scoreboard.',
    more: [
      'Rounds cover everything from basic mathematics and algebra to calculus, combinatorics, probability, geometry, discrete mathematics and linear algebra, with *buzzer rounds testing reflexes* under pressure.',
      'The team with the highest point total when the final round ends is crowned champion.',
    ],
  },
  {
    id: 'retro-market',
    num: 2,
    kind: 'event',
    name: 'Retro Market',
    track: 'Finance',
    meta: ['Offline', 'Open outcry'],
    lede: 'Test Your *Trading Skills* Offline! Step into a mock trading ring and buy and sell fictional stocks using paper slips, loud bids and handwritten deal confirmations.',
    more: [
      'No laptops, no apps: just old-fashioned yelling, scribbling and sealing deals on paper, in the spirit of the Bombay Stock Exchange floor. Exclusive to first-year students.',
    ],
  },
  {
    id: 'prudentia',
    num: 3,
    kind: 'event',
    name: 'Prudentia',
    track: 'Finance',
    meta: ['₹10 lakh virtual portfolio', '5 days · online'],
    lede: 'Dive into the Thrill of Mock Stock Market Competition! Manage 10 lakhs of *virtual money*, strategize investments, and navigate market fluctuations.',
    more: [
      'An individual, five-day online trading simulation that tests chart reading, news interpretation, risk management and emotional control. Rankings come from the final leaderboard.',
    ],
  },
  {
    id: 'robo-race',
    num: 4,
    kind: 'event',
    name: 'Robo Race',
    track: 'Robotics',
    meta: ['Teams of up to 4', 'Timed track run'],
    lede: '*Navigate. Control. Conquer.* Teams build a robotic vehicle and send it around a challenging track of turns, obstacles and slopes against the clock.',
    more: [
      'Each team gets an official attempt on the course, and the fastest completion time, after any penalties, wins. It rewards speed, stability, control and manoeuvrability.',
      'No prior experience is needed: mentorship sessions run before the event.',
    ],
  },
  {
    id: 'tech-hunt',
    num: 5,
    kind: 'event',
    name: 'Tech-Hunt',
    track: 'CTF',
    flagship: true,
    meta: ['13 challenges', 'Capture the flag'],
    lede: 'Tech-Hunt is *a flagship immersive Capture The Flag (CTF)* competition that combines technology, problem-solving, storytelling, and suspense into one unforgettable experience.',
    more: [
      'Built around a gripping detective narrative, participants journey through 13 interconnected challenges involving cryptography, binary decoding, reverse engineering, web security, hidden clues, physical challenges, and logical puzzles. Each challenge unlocks a new chapter in the mysterious disappearance of Anaya.',
      'As the investigation unfolds, the story transforms into a psychological mystery filled with obsession, secrets, and unexpected revelations, culminating in a powerful final twist that redefines the entire investigation.',
      'With its unique blend of cybersecurity, coding, puzzle-solving, and immersive storytelling, Tech-Hunt is designed to attract technology enthusiasts, programmers, cybersecurity learners, and problem-solvers.',
    ],
  },
  {
    id: 'robo-soccer',
    num: 6,
    kind: 'event',
    name: 'Robo Soccer',
    track: 'Robotics',
    meta: ['Teams of 4', 'Round-robin + knockout'],
    lede: 'Where robotics meets the beautiful game! Teams battle it out in an intense robotic soccer tournament, showcasing their bots’ agility, precision, control, strategy, and engineering.',
    more: [
      'Teams pass inspection, play round-robin groups, and the best advance to single-elimination knockouts. Every match is a test of smart programming, mechanical design, quick decision-making, and teamwork.',
      '*One field. One champion.*',
    ],
  },
  {
    id: 'trio-codejam',
    num: 7,
    kind: 'event',
    name: 'Trio-Codejam',
    track: 'Code',
    meta: ['Teams of 3', '25 minutes each'],
    lede: 'Trio-Codejam brings together three minds and one baton. Each teammate gets a *25-minute window* to crack a run of coding puzzles, building on whatever the last teammate left behind, with no talking allowed.',
    more: [
      'Hosted in person at IIIT Vadodara - Gandhinagar Campus on an ACM-style ranking. It tests individual coding skill and, just as much, how well a team can collaborate in silence.',
    ],
  },
  {
    id: 'codeclash',
    num: 8,
    kind: 'event',
    name: 'CodeClash',
    track: 'Code',
    meta: ['3 hours', 'Codeforces · ICPC format'],
    lede: 'CodeClash is an intense, *3-hour competitive programming contest* hosted on Codeforces, run as a team of three under the ICPC format.',
    more: [
      'It tests algorithmic speed, data-structure knowledge and precision on a dynamic leaderboard, with a single round deciding the winners.',
    ],
  },
  {
    id: 'd2d',
    num: 9,
    kind: 'event',
    name: 'D2D',
    track: 'Design',
    meta: ['3-member teams', 'Figma → front-end'],
    lede: 'Design to Develop: a comprehensive platform for showing skills across the *entire design and development lifecycle*, run by DOT and the Coding Club.',
    more: [
      'Teams design a Figma prototype for a problem statement they choose, present their UX decisions, and then build the front-end for it with hard-coded data. Backend work is optional and considered a plus.',
      'It is an opportunity to *encourage creativity, innovation, and practical application of design principles* while fostering collaboration and presentation skills.',
    ],
  },
  {
    id: 'matiks-mania',
    num: 10,
    kind: 'event',
    name: 'Matiks Mania',
    track: 'Math',
    meta: ['Solo', 'Real-time maths games'],
    lede: '*Matiks Mania* is a fast-paced mathematical competition played live on the Matiks platform, where players go head to head across rounds that reward speed, accuracy and nerve.',
    more: [
      'Expect Sprint Duels (rapid-fire problems), Cross Maths (a crossword-style calculation puzzle) and Mind Snap (memorise a pattern, then reproduce it once it disappears). Points add up across rounds and the highest score wins.',
    ],
  },
  {
    id: 'clue-to-canvas',
    num: 11,
    kind: 'event',
    name: 'Clue to Canvas',
    track: 'Design',
    meta: ['Teams of 2', 'Pure graphic design'],
    lede: '*Clue to Canvas* is a pure graphic-design battle on a Think → Interpret → Create format: each team is handed an abstract clue, no explanation, and must turn it into one complete piece of visual art.',
    more: [
      'Round 1 asks for a poster or illustration that interprets a conceptual prompt. Shortlisted teams then face a surprise constraint, such as the Three-Color Challenge or a random object + emotion + technology mash-up, and design a fresh response against the clock.',
      'There is no single correct answer. Judges reward how intelligently and creatively you read the clue.',
    ],
  },
  {
    id: 'valorant',
    num: 12,
    kind: 'event',
    name: 'Valorant League',
    track: 'Gaming',
    meta: ['5v5', 'Online knockout'],
    lede: 'The *Cerebro Valorant League* is a fast-paced, online-only 5v5 tournament where college teams fight through a knockout bracket to a grand finale.',
    more: [
      'Early rounds are best-of-1; semi-finals and finals are best-of-3. Strategy, coordination and reflexes decide the champions, with referees watching every match.',
    ],
  },
  {
    id: 'bgmi',
    num: 13,
    kind: 'event',
    name: 'BGMI League',
    track: 'Gaming',
    meta: ['Squads of 4', 'Online battle royale'],
    lede: 'The *Cerebro BGMI League* is a high-intensity, online battle royale where squads from different colleges compete to be the last team standing across official BGMI maps.',
    more: [
      'Survival, coordination and tactical awareness are the keys to victory, with referees and observers present to keep every match fair.',
    ],
  },
  {
    id: 'codm',
    num: 14,
    kind: 'event',
    name: 'CODM League',
    track: 'Gaming',
    meta: ['5v5', 'Online ranked'],
    lede: 'The *Cerebro CODM League* is a fast-paced, online-only Call of Duty: Mobile tournament: 5v5 ranked multiplayer across official maps, played as a knockout.',
    more: [
      'Early rounds are best-of-1, semi-finals and finals best-of-3. Strategy, coordination and sharp reflexes determine the champions.',
    ],
  },
  {
    id: 'clash-royale',
    num: 15,
    kind: 'event',
    name: 'Clash Royale League',
    track: 'Gaming',
    meta: ['1v1', 'Online knockout'],
    lede: 'The *Cerebro Clash Royale League* is a head-to-head, online 1v1 tournament testing deck-building, decision-making and real-time tactics.',
    more: [
      'A single-elimination knockout: early rounds are best-of-3, semi-finals and finals best-of-5. Open to IIIT Vadodara undergraduates.',
    ],
  },
  {
    id: 'arcade-corner',
    num: 16,
    kind: 'zone',
    name: 'Arcade Corner',
    track: 'Gaming',
    meta: ['Drop-in zone', 'Both days'],
    lede: 'The *Arcade Corner* is a drop-in gaming zone run by Arcadia Gaming Club: consoles, controllers and a racing wheel set up for both days of the finals.',
    more: [
      'Wander over between rounds, challenge a stranger, and soak up the atmosphere. It is a casual, social space alongside the serious competition.',
    ],
  },
];

// Seven tracks, in the order the proposal groups them.
export const TRACKS = [
  'Robotics',
  'Code',
  'Design',
  'Finance',
  'Math',
  'Gaming',
  'CTF',
];

export const TRACK_BLURB = {
  Robotics: 'Bots built by you, tested on a real track and a real pitch.',
  Code: 'Algorithms, teamwork under silence, and three hours of pure contest.',
  Design: 'From abstract clues to working front-ends.',
  Finance: 'Paper slips, loud bids and a ₹10 lakh virtual portfolio.',
  Math: 'Buzzers, speed duels and problems that bite back.',
  Gaming: 'Four online leagues and a drop-in arcade.',
  CTF: 'One detective story, thirteen locked chapters.',
};

// The sponsorship tiers from the deck. Amounts are left out on purpose: the
// brochure (Annexure I) carries them, and their unit is not stated in the deck.
export const TIERS = [
  {
    id: 'title',
    name: 'Title Sponsor',
    pitch:
      'Front-row access to the next generation of builders. Own the spotlight, shape the conversation & make your brand impossible to ignore on stage, online & everywhere in between.',
    terms: 'Top tier',
    perks: [
      'Event title naming rights',
      'Seminar / interactive session',
      'Logo on selected goodies',
      'Main stage + entry branding',
      'Dedicated branded stall',
      'Digital & offline promotions',
      'Press + post-event recognition',
    ],
  },
  {
    id: 'event',
    name: 'Event Sponsor',
    pitch:
      'High-impact visibility without sharing the throne. Be everywhere that matters and remembered long after the event ends.',
    terms: 'Second tier',
    perks: [
      'Selected flagship events will be hosted in collaboration with your brand',
    ],
  },
  {
    id: 'experience',
    name: 'Experience Centre Sponsor',
    pitch:
      'Strong presence. Solid recall. Real impact. Perfect for brands that want visibility without overdoing it.',
    terms: 'Third tier',
    perks: [
      'Stage / banner branding',
      'Digital promotions',
      'Social media shout-outs',
      'Stalls like graffiti walls, photo booths, gaming arcade etc will be hosted in collaboration with your entity',
    ],
  },
  {
    id: 'goodies',
    name: 'Goodies Sponsor',
    pitch:
      'As the goodies sponsor, put your brand in every hacker’s hands, and earn instant clout for backing the brightest tech minds.',
    terms: 'Fourth tier',
    perks: [
      'Prominent website logo placement',
      'Full poster and social media visibility',
      'Exclusive main-banner recognition at Cerebro',
    ],
  },
];

// The organising crew, from the proposal's leads and core-committee lists.
export const CREW = {
  intro:
    'For any inquiries, please feel free to contact us. We look forward to hearing from you.',
  leads: [
    { name: 'Pratham K. Vaghela', role: 'Convenor' },
    { name: 'Tirth Doshi', role: 'Co-convenor' },
    { name: 'Aryan Purbhe', role: 'Sponsorship lead' },
    { name: 'Ankit Rai', role: 'Development lead' },
    { name: 'Kashvi Khandelwal', role: 'PR & social lead' },
    { name: 'Damini Khushwaha', role: 'Design lead' },
    { name: 'Shikhar Singh', role: 'Logistics lead' },
    { name: 'Yash Bhosle', role: 'Logistics co-lead' },
    { name: 'Priyanshi Verma', role: 'Decor lead' },
  ],
  core: [
    'Ayush Anil',
    'Soham Agarwal',
    'Adeen J Nair',
    'Aghnivesh',
    'Jamil',
    'Priyanshu',
    'Divyam',
    'Ojas',
    'Suraj',
    'Aashu Raj',
    'Rohit Ranwa',
    'Prashant Sharma',
    'Himanshi',
    'Sai Praneeth',
    'Bhoomi Jaiswal',
    'Ayushi Singh',
    'Saanvi Bajaj',
    'Riyaziya Bano',
    'Shashwat Singh',
  ],
};

export const FAQ = [
  {
    q: 'How do I register for an event?',
    a: 'Open an event and press Register. Registration links are published by the organizing team closer to the date; once a link is live, the event briefing sends you to its official form. Until then you can save the event to your plan.',
  },
  {
    q: 'What is online and what is offline?',
    a: 'Prudentia, CodeClash and the four gaming leagues are online. Everything else is in person at IIIT Vadodara, Gandhinagar Campus, across the offline finals on 31 October and 1 November.',
  },
  {
    q: 'Who can take part?',
    a: 'It varies by event. Some are open to students from any accredited college, some only to IIIT Vadodara undergraduates, and Retro Market is for first-years only. Each event briefing lists its own eligibility and team size.',
  },
  {
    q: 'Can I enter more than one event?',
    a: 'Yes. Build a shortlist with My plan and check the schedule for clashes. Each event has its own registration, and saving to your plan is not a registration.',
  },
  {
    q: 'Are the times final?',
    a: 'The published timetable is the master schedule. The four gaming leagues are still waiting on their match slots, and rooms can change. Anything unconfirmed is marked as such. All times are IST.',
  },
  {
    q: 'What do the prizes look like?',
    a: 'Every event lists its prize breakdown in the briefing, including special prizes for IIIT Vadodara first-years where they apply. Prizes are to be generated from sponsorships.',
  },
];

// '*a* b' -> 'a b': the copy without its marks.
export const plain = (text) => text.replaceAll('*', '');

// '*a* b' -> [['a', true], [' b', false]]
export function marks(text) {
  return text
    .split('*')
    .map((t, i) => [t, i % 2 === 1])
    .filter(([t]) => t);
}
