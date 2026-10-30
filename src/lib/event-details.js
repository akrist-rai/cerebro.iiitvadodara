// The operational source of truth, taken from the CEREBRO 2026-27 official
// proposal. Times and rooms follow the event timetable (Event_TimeTable), which
// supersedes the proposal's master schedule; where either disagrees with an
// event's own annexure, the timetable wins (see docs/EVENT_CONTENT.md). Null
// means the organizing team has not supplied a confirmed value; never infer one.
const CAMPUS = 'IIIT Vadodara · Gandhinagar Campus';
const at = (day, time) => `${day}T${time}:00+05:30`;
const D1 = '2026-10-31';
const D2 = '2026-11-01';

const pending = () => ({
  startsAt: null,
  endsAt: null,
  dateText: null, // shown instead of a formatted date when set
  timeText: null, // shown instead of a formatted time range when set
  slots: [], // which schedule receipts the event is printed on
  venue: null,
  room: null,
  club: null,
  organizers: [],
  eligibility: null,
  capacity: null,
  objective: null,
  details: [], // [{ title, items[] }] — formats, phases, specs, topics
  rules: [],
  notes: [],
  rulesUrl: null,
  links: [], // [{ label, url }] — other official pages, e.g. a partner sign-up
  registration: { status: 'upcoming', url: null, deadline: null },
});

// An open registration on the event's Unstop listing. The deadline is the
// listing's own registration end, so the site closes when Unstop does.
const unstop = (path, deadline = null) => ({
  status: 'open',
  url: `https://unstop.com/${path}`,
  deadline,
});

const person = (name, role, email, phone) => ({
  name,
  role,
  ...(email && { email: `${email}@iiitvadodara.ac.in` }),
  ...(phone && { phone }),
});

const arcadia = [
  person('Ayush Awasthi', 'Club Secretary, Arcadia', '202451027', '7985025515'),
  person(
    'Mayank Naharwal',
    'Club Joint Secretary, Arcadia',
    '20251501105',
    '9717266008',
  ),
  person(
    'Priyanshu Sahoo',
    'Club Joint Secretary, Arcadia',
    '20251503038',
    '9036010907',
  ),
];
const enigma = [
  person('Harshit Dubey', 'Club Secretary, Enigma', '202451074', '8770400363'),
  person(
    'Jaynil Parmar',
    'Club Joint Secretary, Enigma',
    '20251501124',
    '7069240371',
  ),
  person(
    'Aaban Khan',
    'Club Joint Secretary, Enigma',
    '20251501001',
    '8200854480',
  ),
];
const finance = [
  person(
    'Anand Gaikwad',
    'Club Joint Secretary, Finance & Consulting',
    '20251502003',
    '9325648054',
  ),
  person(
    'Man Patel',
    'Club Secretary, Finance & Consulting',
    '202451100',
    '8849295153',
  ),
];
const coding = [
  person(
    'Tarun Jain',
    'Club Secretary, Coding Club',
    '202451160',
    '9928082608',
  ),
  person(
    'Kalash Desai',
    'Club Joint Secretary, Coding Club',
    '20251501185',
    '9558431735',
  ),
];
const dot = [
  person('Jeet Thakare', 'Club Secretary, DOT', '20251501085', '9890411484'),
  person(
    'Bhatt Pooja',
    'Club Joint Secretary, DOT',
    '20251501046',
    '9328068303',
  ),
];

const gamingRules = [
  'Teams must submit valid proof of enrollment; failure to do so leads to elimination.',
  'Any use of cheats, hacks or third-party tools means immediate disqualification.',
  'Sportsmanship is expected: abusive chat, harassment or misconduct leads to disqualification.',
  'Organizers’ and referees’ decisions are final.',
];
const gamingNotes = [
  'Registration is on Unstop; check the listing there for the deadline.',
  'Referees and observers are present in all matches to ensure fair play.',
];
// From the 9-Bit Unstop listings; they apply to both robotics events.
const roboticsRules = [
  'Every member registers with their official college email; other email accounts are not considered.',
  'All registered participants must attend the event and any associated workshops; not showing up without notice may lead to disciplinary action.',
  'Instructions and updates go out in the official WhatsApp group, shared with shortlisted teams; not following them may lead to disqualification.',
];
const online = { mode: 'Online', venue: 'Online' };

export const EVENT_DETAILS = {
  inauguration: {
    ...pending(),
    mode: 'In person',
    teamSize: null,
    duration: '1 hr 30 min',
    startsAt: at(D2, '10:30'),
    endsAt: at(D2, '12:00'),
    slots: ['d2'],
    venue: CAMPUS,
    room: '9001',
    club: 'Technical Committee',
    details: [
      {
        title: 'Programme',
        items: [
          '10:30–10:45: introduction to the event',
          '10:45–10:55: Technical Secretary’s speech',
          '10:55–11:05: Dean’s speech',
          '11:05–11:15: Director’s speech',
          '11:15–12:00: expert talk',
        ],
      },
    ],
  },

  equinox: {
    ...pending(),
    registration: unstop(
      'p/equinox-cerebro-2026-27-indian-institute-of-information-technology-vadodara-1773738',
      at('2026-10-30', '18:29'),
    ),
    mode: 'In person',
    teamSize: '2 members',
    duration: '2 hrs',
    startsAt: at(D1, '09:00'),
    endsAt: at(D1, '11:00'),
    slots: ['d1'],
    venue: CAMPUS,
    room: '9101',
    club: 'Enigma · The Mathematics Club',
    eligibility: 'All students of IIIT Vadodara.',
    objective:
      'Test mathematical proficiency and teamwork through a multi-round buzzer competition, with the highest-scoring team emerging as winner.',
    details: [
      {
        title: 'Topics covered',
        items: [
          'Basic mathematics',
          'Algebra',
          'Calculus',
          'Combinatorics',
          'Probability and statistics',
          'Geometry',
          'Discrete mathematics',
          'Linear algebra',
        ],
      },
    ],
    notes: ['Needs a separate classroom for the event to run smoothly.'],
    organizers: enigma,
  },

  'retro-market': {
    ...pending(),
    registration: unstop(
      'p/retro-market-cerebro-2026-27-indian-institute-of-information-technology-vadodara-1780975',
      at(D1, '04:00'),
    ),
    mode: 'In person',
    teamSize: 'Solo',
    duration: '2 hrs',
    startsAt: at(D2, '13:00'),
    endsAt: at(D2, '15:00'),
    slots: ['d2'],
    venue: CAMPUS,
    room: 'Courtyard',
    club: 'Finance & Consulting Club',
    eligibility:
      'Exclusively for first-year undergraduates of IIIT Vadodara, Gandhinagar campus.',
    objective:
      'Revive the loud, fast-paced floor trading of open outcry markets and give first-years a feel for trading instinct under pressure.',
    details: [
      {
        title: 'How it works',
        items: [
          'Each participant starts with ₹10,00,000 in virtual money.',
          'Fictitious companies are listed on the board, and their prices move throughout the event.',
          'Brokers on the floor handle every trade, written on a paper slip and on your own record sheet.',
        ],
      },
    ],
    rules: [
      'Individual event for first-year IIIT Vadodara (Gandhinagar) students.',
      'Trades must be written on official slips; verbal trades count only if documented.',
      'The slip-writing format is explained beforehand, and only valid slips are accepted.',
      'To trade, tell the broker the company and the quantity; shares trade only in bundles of 10.',
      'Short selling is not allowed: you may only sell shares you own.',
      'All trades must happen within the set time; late slips do not count.',
      'Final value includes booked trades and stock holdings at final prices; the highest profit wins.',
      'All slips must be submitted for evaluation.',
    ],
    notes: ['Needs a separate area to run the trading ring.'],
    organizers: [
      person('Ayush Vora', 'Convenor', null, '9106615489'),
      person('Arshit Dawra', 'Co-convenor', '20251502005', '9468817332'),
      ...finance,
    ],
  },

  prudentia: {
    ...pending(),
    registration: unstop(
      'competitions/prudentia-cerebro-2026-27-indian-institute-of-information-technology-vadodara-1773344',
    ),
    ...online,
    teamSize: 'Individual',
    duration: '5 days',
    startsAt: at('2026-10-26', '00:00'),
    endsAt: at('2026-10-30', '23:59'),
    dateText: '26 – 30 Oct 2026',
    timeText: 'Five-day online simulation',
    slots: ['online'],
    club: 'Finance & Consulting Club',
    eligibility:
      'All undergraduate students currently enrolled at an accredited institution.',
    objective:
      'Immerse participants in a simulated stock-trading contest: entering positions, managing targets and stop losses, and building a trader’s mindset.',
    details: [
      {
        title: 'What it tests',
        items: [
          'Chart reading',
          'News interpretation',
          'Risk management',
          'Emotional control under pressure',
        ],
      },
    ],
    rules: [
      'Individual competition; no team entries.',
      'Pre-event registration is required; one entry per participant.',
      'Trades must be made within specified market hours on the chosen platform.',
      'The event runs for multiple days; portfolios must be managed throughout.',
      'Rankings are based on the final leaderboard standing.',
      'Misconduct or rule violations lead to disqualification.',
      'Organizers may verify participant identity; their decisions are final.',
    ],
    organizers: [
      person('Sujal Shah', 'Convenor', '202452330', '9904241049'),
      person('Vishal Singh', 'Co-convenor', '20251501177', '9274984523'),
      ...finance,
    ],
  },

  'robo-race': {
    ...pending(),
    registration: unstop(
      'p/robo-race-cerebro-2026-27-indian-institute-of-information-technology-vadodara-1773606',
    ),
    mode: 'In person',
    teamSize: '4 members',
    duration: '2 hrs',
    startsAt: at(D1, '16:00'),
    endsAt: at(D1, '18:00'),
    slots: ['d1'],
    venue: CAMPUS,
    room: 'Courtyard, 9th Block',
    club: '9-Bit · The Robotics Club',
    capacity: '10 teams',
    eligibility:
      'Open to all B.Tech students at IIIT Vadodara. First-years are encouraged; no prior experience needed.',
    objective:
      'Apply theory to the design and build of a functional robotic vehicle, and build innovation, teamwork and practical problem-solving.',
    details: [
      {
        title: 'Technical specifications',
        items: [
          'Maximum robot size: 30 cm × 30 cm × 30 cm',
          'Maximum weight: 5 kg',
          'Power: maximum 12 V battery, no direct AC supply',
        ],
      },
      {
        title: 'The track',
        items: [
          'A predefined race track that may include turns, obstacles and slopes.',
          'Robots run individually; time to complete the course is recorded.',
        ],
      },
    ],
    rules: [
      'Each team has exactly 4 members, including at least 1 female member.',
      ...roboticsRules,
      'Teams build their own robot to the prescribed technical specifications.',
      'Report to the venue at least 30 minutes before the event starts.',
      'Each team gets one official attempt unless the organizers say otherwise.',
      'External assistance or intentional damage to the track or equipment leads to disqualification.',
      'The decision of the judges and organizing committee is final and binding.',
    ],
    notes: ['Mentorship sessions will be conducted before the event.'],
    organizers: [
      person('Aditya Vikram', 'Convenor', '20251504005', '8210110012'),
      person('Ojas Naringe', 'Co-convenor', '20251503034', '9405819180'),
      person('Tanishq Singhal', 'Club Secretary, 9-Bit'),
    ],
  },

  // Sanction, formerly TechHunt. Its copy, deadline, location, eligibility and
  // contacts come from its Unstop listing; times stay on the timetable.
  'tech-hunt': {
    ...pending(),
    registration: unstop(
      'p/sanctiontechhunt-cerebro-2026-27-indian-institute-of-information-technology-vadodara-1781442',
      at('2026-10-30', '24:00'),
    ),
    mode: 'In person',
    teamSize: '3 members',
    duration: '6 hrs',
    startsAt: at(D1, '12:00'),
    endsAt: at(D1, '18:00'),
    slots: ['d1'],
    venue: CAMPUS,
    room: '9001 & 9101 (9th & 8th Block)',
    club: 'Technical Committee',
    eligibility: 'All students of IIIT Vadodara.',
    objective:
      'Descend through three depths of cybersecurity puzzles and capture the final flag.',
    details: [
      {
        title: 'Challenges',
        items: [
          'Cryptography: encrypted messages',
          'Steganography: altered images',
          'Spectrogram analysis: unheard signals',
          'Logical challenges and scattered clues',
        ],
      },
    ],
    rules: ['Teams of exactly 3 members.'],
    notes: ['Results are declared on 1 Nov at 12:00 PM.'],
    organizers: [
      person('Ankit Rai', 'Convenor', '20251504008', '8302638070'),
      person('Soham Agarwal', 'Co-convenor', '202452332', '9650036655'),
      person('Jamil Ahmed Sayyed', null, '202451080', '7982881388'),
    ],
  },

  'robo-soccer': {
    ...pending(),
    registration: unstop(
      'p/robo-soccer-cerebro-2026-27-indian-institute-of-information-technology-vadodara-1773648',
      // Unstop's own window; it closed on 23 Oct after 75 minutes.
      at('2026-10-23', '20:15'),
    ),
    mode: 'In person',
    teamSize: '4 members',
    duration: '3 hrs',
    startsAt: at(D2, '15:00'),
    endsAt: at(D2, '18:00'),
    slots: ['d2'],
    venue: CAMPUS,
    room: 'Courtyard, 9th Block',
    club: '9-Bit · The Robotics Club',
    capacity: '15 teams',
    eligibility:
      'Open to all B.Tech students at IIIT Vadodara. First-years are encouraged; no prior experience needed.',
    objective:
      'Combine the excitement of football with robotics: design and drive robots that dribble, pass and score against an opponent.',
    details: [
      {
        title: 'Phases',
        items: [
          'Preparation & inspection: robots are checked for size, weight and rule compliance.',
          'Qualifying round: round-robin groups, with the top teams advancing.',
          'Finals: single-elimination matches until a champion is decided.',
        ],
      },
      {
        title: 'Format',
        items: [
          'Teams of exactly 4 members, including at least 1 female member.',
          'Robots may be manually controlled or semi-autonomous.',
          'Teams may use 1 or 2 robots per match, as per event guidelines.',
        ],
      },
      {
        title: 'Technical specifications',
        items: [
          'Maximum robot size: 30 cm × 30 cm × 30 cm',
          'Maximum weight: 5 kg',
          'Power: maximum 12 V battery, no direct AC supply',
          'No ball-catching mechanism that fully encloses the ball (partial possession is allowed).',
        ],
      },
    ],
    rules: [
      'Matches last 5–7 minutes, with a half-time break.',
      'Standard scoring: one goal is one point.',
      'Robots must not cause intentional damage to other robots or the field.',
      'No direct human interference with the ball during matches.',
      'Referee decisions are final and binding.',
      'Limited time-outs and repairs are allowed between halves.',
      ...roboticsRules,
    ],
    notes: [
      'Teams submit a technical sheet describing the components and mechanisms used.',
      'Mentorship sessions will be conducted before the event.',
    ],
    organizers: [
      person('Ojas Naringe', 'Convenor', '20251503034', '9405819180'),
      person('Aditya Vikram', 'Co-convenor', '20251504005', '8210110012'),
      person('Tanishq Singhal', 'Club Secretary, 9-Bit'),
    ],
  },

  'trio-codejam': {
    ...pending(),
    registration: unstop(
      'p/trio-code-jam-cerebro-2026-27-indian-institute-of-information-technology-vadodara-1781453',
      at('2026-10-30', '23:59'),
    ),
    mode: 'In person',
    teamSize: '3 members',
    duration: '2 hrs',
    startsAt: at(D1, '11:00'),
    endsAt: at(D1, '13:00'),
    slots: ['d1'],
    venue: CAMPUS,
    room: '9102 A/B',
    club: 'Coding Club',
    eligibility:
      'Only IIIT Vadodara students; teammates can be from different specializations.',
    objective:
      'Test individual coding skill while building seamless teamwork between members who must build on each other’s work without direct interaction.',
    details: [
      {
        title: 'How it runs',
        items: [
          'Each member gets a fixed time limit to work on a coding problem.',
          'When time is up, the next member takes over the existing code and continues from where the last one left off.',
          'The number of problems, individual time limits and total duration are announced by the organizers.',
          'No direct communication between teammates.',
          'ACM-style ranking.',
        ],
      },
      {
        title: 'Logistics',
        items: [
          'Bring one laptop, shared by the whole team.',
          'WiFi is provided.',
        ],
      },
    ],
    rules: [
      'Each team has exactly 3 members.',
      'AI tools and AI-powered coding assistants are strictly prohibited.',
      'Members code only during their allotted turns and hand over their progress when time expires.',
      'External assistance and plagiarism are strictly prohibited.',
      'Code templates, comments and mnemonic variable names are allowed.',
      'Any violation of the rules may lead to disqualification.',
      'The organizers’ decisions are final.',
    ],
    organizers: [
      person('Darshan Patel', 'Convenor', null, '9427117467'),
      person('Aryan Mehta', 'Co-convenor', '20251501108', '7495841168'),
      ...coding,
    ],
  },

  codeclash: {
    ...pending(),
    registration: unstop(
      'hackathons/code-clash-cerebro-2026-27-indian-institute-of-information-technology-vadodara-1775833',
      at('2026-10-30', '00:01'),
    ),
    ...online,
    teamSize: '3 members',
    duration: '3 hrs',
    startsAt: at('2026-10-30', '21:00'),
    endsAt: at(D1, '00:00'),
    slots: ['online'],
    venue: 'Online · Codeforces',
    club: 'Coding Club',
    eligibility:
      'Currently enrolled students; all members of a team must be from the same college.',
    objective:
      'Showcase programming skill, problem-solving and algorithmic thinking in a fun, competitive contest.',
    details: [
      {
        title: 'Format',
        items: [
          'A single round hosted on Codeforces under the ICPC format.',
          'Teams of three; winners are decided by ranking and performance.',
        ],
      },
    ],
    rules: [
      'A team must contain 3 members, all from the same institute.',
      'No AI assistance: AI tools may not be used to generate, debug or optimise code.',
      'Allowed languages: C++, Java and Python.',
      'Teams develop their solutions independently; collaboration between teams during the contest is prohibited.',
      'Copying code or submitting another team’s solutions is strictly prohibited and may lead to disqualification.',
      'All solutions are submitted through the official contest platform within its time and memory limits.',
      'Multiple attempts per problem are allowed, subject to the platform’s rules.',
      'Exploiting the judging system, gaining unauthorised access or any other unfair practice is prohibited.',
      'The organizers may disqualify teams that break the rules; their decisions on violations and disputes are final.',
    ],
    organizers: [
      person('Arpit Maheshwari', 'Convenor', '202451022', '9024236239'),
      person('Anant Kumar Gupta', 'Co-convenor', '20251503004'),
      ...coding,
    ],
  },

  d2d: {
    ...pending(),
    // Online design rounds, then the offline presentation, which is the slot
    // shown here; both come from the Unstop listing's rounds.
    registration: unstop(
      'competitions/design-to-develop-d2d-indian-institute-of-information-technology-vadodara-1773721',
      at('2026-10-29', '23:59'),
    ),
    mode: 'Hybrid',
    teamSize: '3 members',
    duration: '27 Oct – 1 Nov',
    startsAt: at(D2, '11:00'),
    endsAt: at(D2, '13:00'),
    slots: ['d2'],
    venue: CAMPUS,
    room: '9111',
    club: 'DOT · The Design Club × Coding Club',
    eligibility:
      'Undergraduate B.Tech students of any accredited institution; all three members must be from the same institute.',
    objective:
      'Provide a platform to demonstrate skill across the whole design and development lifecycle, from concept to a functional front-end prototype.',
    details: [
      {
        title: 'Three phases',
        items: [
          'Phase 1: build a Figma prototype for a problem statement of your choice.',
          'Phase 2: present the design, explain your UX decisions and design thinking.',
          'Phase 3: build the front-end with hard-coded data (a backend is optional and a plus).',
        ],
      },
      {
        title: 'Timeline',
        items: [
          'Online: submit the Figma design and a design prototyping video between 29 Oct, 12:00 PM and 31 Oct, 11:59 PM.',
          'Offline: present the project on 1 Nov, 11:00 AM – 1:00 PM, in 9111.',
        ],
      },
      {
        title: 'Format',
        items: [
          'Figma is mandatory for prototyping; any technology may be used for the front-end.',
          'Interdisciplinary teams are highly encouraged.',
        ],
      },
    ],
    rules: [
      'A team has exactly 3 members, no more and no fewer.',
      'Every team must submit proof of bonafide status from its institute, or the whole team is eliminated.',
      'Plagiarism leads to direct elimination.',
      'Projects and presentations must be submitted within the deadlines; missing one means elimination.',
      'Harassment, abuse or profanity in a submission is disqualified immediately.',
      'Every team must make a login page and a landing page, plus at least two more pages for the chosen problem statement.',
      'All decisions of the judges and organizers are final.',
    ],
    organizers: [...dot, ...coding],
  },

  'matiks-mania': {
    ...pending(),
    registration: unstop(
      'p/matiks-mania-indian-institute-of-information-technology-vadodara-1773752',
      at('2026-10-30', '18:29'),
    ),
    mode: 'In person',
    teamSize: 'Solo',
    duration: '2 hrs',
    startsAt: at(D2, '09:00'),
    endsAt: at(D2, '11:00'),
    slots: ['d2'],
    venue: CAMPUS,
    room: '9101',
    club: 'Enigma · The Mathematics Club',
    eligibility: 'All students of IIIT Vadodara.',
    objective:
      'Test mathematical speed, accuracy, logical thinking and decision-making through fast-paced, competitive maths games.',
    details: [
      {
        title: 'The games',
        items: [
          'Sprint Duels: a rapid-fire challenge to solve problems quickly and accurately.',
          'Cross Maths: a crossword-style game that needs calculation and logical reasoning.',
          'Mind Snap: memorise a displayed pattern and reproduce it after it disappears.',
        ],
      },
      {
        title: 'Matiks Megaweek · online, 28 Oct – 4 Nov',
        items: [
          'An online league run by Enigma with Matiks. Join with league code 64IKXPAM.',
          'Register with your official institute email ID only.',
          'The cash prize pool grows with participation: ₹2,500 for up to 250 participants, ₹4,500 for 251–450 and ₹6,500 for 451 or more.',
          'The top three share the pool in a 3:2:1 ratio.',
          'Bonus: winners at the offline Matiks Mania on 1 Nov receive exclusive Matiks merchandise.',
        ],
      },
    ],
    notes: [
      'Rounds are played on the Matiks platform; points accumulate across rounds.',
      'Needs a separate classroom for the event.',
    ],
    links: [
      {
        label: 'Join Matiks Megaweek',
        url: 'https://app.matiks.org/league-v2/6add9cbdfe61af49db3ab9c2/details?entry=direct&referrer=SK753095&referred_by=satish.on.matiks',
      },
    ],
    organizers: enigma,
  },

  'clue-to-canvas': {
    ...pending(),
    mode: 'In person',
    teamSize: '2 members',
    duration: '1 hr',
    startsAt: at(D2, '12:00'),
    endsAt: at(D2, '13:00'),
    slots: ['d2'],
    venue: CAMPUS,
    room: '9111',
    club: 'DOT · The Design Club',
    eligibility: 'All undergraduate students currently at IIIT Vadodara.',
    objective:
      'Test conceptual thinking and visual storytelling by turning an abstract prompt into a compelling piece of graphic design. No website or app UI is involved.',
    details: [
      {
        title: 'Two rounds',
        items: [
          'Round 1, interpretation: draw a conceptual prompt and create a complete poster or illustration for it within the time limit.',
          'Round 2, constraint challenge: shortlisted teams face a surprise constraint, such as the Three-Color Challenge, One-Word Challenge or a random object + emotion + technology mix, in a short fixed window.',
        ],
      },
    ],
    rules: [
      'Designs are created live during the event; no pre-made or pre-drawn artwork is accepted.',
      'Any visual medium may be used, digital tools such as Photoshop, Illustrator, Canva, Procreate or Figma included.',
      'Only standalone visual artwork (poster, illustration, campaign creative, infographic or cover) is permitted. Website, app or UI/UX designs are not.',
      'Plagiarized content or unauthorized AI-generated imagery is not permitted unless a round explicitly allows it.',
      'Harassment, abuse or profanity in a submission is disqualified immediately.',
      'Judging covers interpretation, creativity, visual communication and craftsmanship; there is no single correct reading.',
      'All decisions of the judges and organizers are final.',
    ],
    notes: [
      'Bring your own laptop, tablet or phone for your preferred medium.',
      'Registration details with deadlines will be shared closer to the event date.',
    ],
    organizers: dot,
  },

  valorant: {
    ...pending(),
    registration: unstop(
      'p/valorant-league-cerebro-2026-27-indian-institute-of-information-technology-vadodara-1773621',
      at('2026-10-27', '17:30'),
    ),
    ...online,
    teamSize: '5 players + up to 2 subs',
    duration: '4 days',
    dateText: '27 – 30 Oct 2026',
    timeText: 'Match slots to be announced',
    slots: ['leagues'],
    club: 'Arcadia Gaming Club',
    eligibility:
      'Undergraduate students from any accredited college or university in India.',
    objective:
      'A thrilling, audience-friendly event that adds excitement and variety to the fest alongside the technical competitions.',
    details: [
      {
        title: 'Format',
        items: [
          'Competitive 5v5 under standard Valorant rules.',
          'Knockout stages, then semi-finals and a grand final.',
          'Early rounds best-of-1; semi-finals and final best-of-3.',
        ],
      },
      {
        title: 'Team composition',
        items: [
          '5 players (mandatory) plus up to 2 substitutes.',
          'All players enrolled in the same college.',
          'Each team registers with a team name and a captain.',
        ],
      },
    ],
    rules: [
      'Every team must have exactly 5 players, and optionally up to 2 substitutes.',
      ...gamingRules,
    ],
    notes: gamingNotes,
    organizers: arcadia,
  },

  bgmi: {
    ...pending(),
    // 1774263 is a duplicate listing that was open for 23 seconds; the fest
    // page links this one.
    registration: unstop(
      'events/bgmi-league-cerebro-2026-27-indian-institute-of-information-technology-vadodara-1774269',
      at('2026-10-28', '12:00'),
    ),
    ...online,
    teamSize: '4 players + 1 sub',
    duration: '4 days',
    dateText: '27 – 30 Oct 2026',
    timeText: 'Match slots to be announced',
    slots: ['leagues'],
    club: 'Arcadia Gaming Club',
    eligibility:
      'Undergraduate students from any accredited college or university in India.',
    objective:
      'A competitive yet entertaining event that highlights teamwork, reflexes and survival skills.',
    details: [
      {
        title: 'Format',
        items: [
          'Battle royale, squad mode, 4 players per squad.',
          'A structured series of matches across official BGMI maps.',
        ],
      },
      {
        title: 'Team composition',
        items: [
          '4 players (mandatory) plus up to 1 substitute.',
          'All players enrolled in the same college.',
          'Each team registers with a team name and a captain.',
        ],
      },
    ],
    rules: [
      'Every team must have exactly 4 players, and optionally 1 substitute.',
      'Any use of emulators, cheats, hacks or third-party tools means immediate disqualification.',
      'Players must ensure stable internet connectivity during matches.',
      ...gamingRules,
    ],
    notes: [
      ...gamingNotes,
      'Teams must update their devices to the latest BGMI version before the event.',
    ],
    organizers: arcadia,
  },

  codm: {
    ...pending(),
    registration: unstop(
      'p/codm-league-cerebro-2026-27-indian-institute-of-information-technology-vadodara-1773718',
      at('2026-10-28', '12:00'),
    ),
    ...online,
    teamSize: '5 players + 1 sub',
    duration: '4 days',
    dateText: '27 – 30 Oct 2026',
    timeText: 'Match slots to be announced',
    slots: ['leagues'],
    club: 'Arcadia Gaming Club',
    eligibility:
      'Undergraduate students from any accredited college or university in India.',
    objective:
      'A competitive yet entertaining event that highlights teamwork, reflexes and tactical skill in Call of Duty: Mobile.',
    details: [
      {
        title: 'Format',
        items: [
          'Multiplayer ranked, 5v5 competitive.',
          'Knockout stages leading to semi-finals and finals.',
          'Early rounds best-of-1; semi-finals and finals best-of-3.',
        ],
      },
      {
        title: 'Team composition',
        items: [
          '5 players (mandatory) plus up to 1 substitute.',
          'All players enrolled in the same college.',
          'Each team registers with a team name and a captain.',
        ],
      },
    ],
    rules: [
      'Every team must have exactly 5 players, and optionally 1 substitute.',
      'Tablets, iPads and emulators are banned.',
      'Any use of cheats, hacks or third-party tools means immediate disqualification.',
      'Players must ensure stable internet connectivity during matches.',
      ...gamingRules,
    ],
    notes: [
      ...gamingNotes,
      'Teams must update their devices to the latest CODM version before the event.',
    ],
    organizers: arcadia,
  },

  'clash-royale': {
    ...pending(),
    registration: unstop(
      'p/clash-royale-league-cerebro-2026-27-indian-institute-of-information-technology-vadodara-1773719',
      at('2026-10-28', '12:00'),
    ),
    ...online,
    teamSize: 'Solo',
    duration: '4 days',
    dateText: '27 – 30 Oct 2026',
    timeText: 'Match slots to be announced',
    slots: ['leagues'],
    club: 'Arcadia Gaming Club',
    eligibility: 'Strictly students currently enrolled at IIIT Vadodara.',
    objective:
      'A fast-paced, strategic 1v1 mobile event that tests individual decision-making, deck-building and real-time tactics.',
    details: [
      {
        title: 'Format',
        items: [
          '1v1 Friendly Battles at Tournament Standard.',
          'Knockout stages leading to semi-finals and finals.',
          'Early rounds best-of-1; semi-finals and finals best-of-3.',
        ],
      },
      {
        title: 'Participation',
        items: [
          'Solo format, one player each.',
          'Register with your in-game name and player tag.',
        ],
      },
    ],
    rules: [
      'An individual competition; every match is strictly 1v1.',
      'Matches use the in-game Friendly Battle feature, which balances card levels to Tournament Standard.',
      'Any use of cheats, hacks or third-party tools means immediate disqualification.',
      'Players must ensure stable internet; disconnects do not warrant a rematch.',
      'Sportsmanship is expected: abusive chat, harassment (including excessive or toxic emote spamming) or misconduct leads to disqualification.',
      'Organizers’ and referees’ decisions are final.',
    ],
    notes: [
      'Registration is on Unstop; check the listing there for the deadline.',
      'Referees and observers are invited to the clan to spectate matches.',
      'Players must update to the latest Clash Royale version before the event.',
    ],
    organizers: arcadia,
  },

  'treasure-of-code': {
    ...pending(),
    registration: unstop(
      'p/treasure-of-code-indian-institute-of-information-technology-vadodara-1775907',
    ),
    mode: 'In person',
    teamSize: 'Solo',
    duration: '2 hrs',
    startsAt: at(D1, '12:00'),
    endsAt: at(D1, '14:00'),
    slots: ['d1'],
    venue: CAMPUS,
    room: '9102 A/B',
    club: 'cout << "Masters";',
    eligibility:
      'All students of IIIT Vadodara. Participation is strictly individual.',
    objective:
      'Practise programming and algorithmic thinking in a competitive setting, and build logical reasoning through riddles, clues and interconnected challenges.',
    details: [
      {
        title: 'Two rounds',
        items: [
          'Round 1, screening quiz (12:05–12:15): 20 questions at 30 seconds each on programming concepts, output prediction, aptitude and logical puzzles, played on your phone.',
          'Round 2, the hunt (12:25–13:55): five stages in strict sequence for those who qualify; no stage can be skipped.',
        ],
      },
      {
        title: 'How a stage works',
        items: [
          'Stage 1 starts from an input given on the coding platform.',
          'Use the input on the Treasure Map to unlock the stage’s riddle.',
          'Solve the coding problem with the same input; its output is the key.',
          'That output is the next stage’s input, and the Stage 5 key leads to the treasure.',
        ],
      },
      {
        title: 'Coding platform',
        items: [
          'Languages: C, C++, Java or Python.',
          'One browser only (Chrome recommended).',
          'Standard language libraries only; offline documentation is available.',
        ],
      },
      {
        title: 'Timeline',
        items: [
          '12:00–12:05: registration, seating and briefing',
          '12:05–12:15: Round 1, screening quiz',
          '12:15–12:25: evaluation and announcement of qualifiers',
          '12:25–13:55: Round 2, Treasure of Code',
          '13:55–14:00: closing',
        ],
      },
    ],
    rules: [
      'Carry a valid institute ID card and your own laptop, and report by 12:00 PM sharp.',
      'The quiz is strictly time-bound; answers submitted after the 10 minutes are not considered.',
      'Only participants announced as qualified after Round 1 take part in Round 2; quiz ties are broken by submission time.',
      'Mobile phones, smartwatches, internet access and any external storage are prohibited in Round 2.',
      'Pre-written code, notes and printed material may not be used.',
      'Every key must come from actually solving the problem; sharing or guessing keys earns only 10% of the points.',
      'Programs must run on the coding platform, and a coordinator may ask you to demonstrate your solution.',
      'Ranking is by stages cleared, then total time; each incorrect key and each hint adds a time penalty.',
      'Communicating with other participants, copying, or tampering with systems or clues means disqualification.',
      'Leave the lab only with permission. The organizers’ decision is final.',
    ],
    notes: [
      'Bring your laptop and accessories (charger, mouse), pens, blank white paper and a water bottle if needed.',
      'Charging points are provided. The quiz and coding-platform links are shared on the day.',
    ],
  },

  'arcade-corner': {
    ...pending(),
    mode: 'In person',
    teamSize: null,
    duration: '8 hrs a day',
    startsAt: at(D1, '10:00'),
    endsAt: at(D1, '18:00'),
    dateText: 'Both days · 31 Oct & 1 Nov',
    timeText: '10:00 AM – 6:00 PM IST',
    slots: ['d1', 'd2'],
    venue: CAMPUS,
    room: '9011 & 9105',
    club: 'Arcadia Gaming Club',
    objective:
      'A high-engagement recreational space for participants and spectators that adds a fun, social dimension to the festival.',
    details: [
      {
        title: 'On the floor',
        items: ['Xbox and PS5 consoles', 'Controllers', 'A racing wheel'],
      },
    ],
    organizers: arcadia,
  },
};

export const FEST_DETAILS = {
  startDate: '2026-10-26',
  endDate: '2026-11-01',
  location: CAMPUS,
  // The fest's Unstop page, which lists every event.
  url: 'https://unstop.com/college-fests/cerebro-2026-27-indian-institute-of-information-technology-iiit-vadodara-525150',
};
