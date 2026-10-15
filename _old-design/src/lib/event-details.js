// The operational source of truth. Null means the organizing team has not
// supplied a confirmed value. Never infer a club, venue, prize or deadline.
// See docs/EVENT_CONTENT.md for the schema and publication checklist.
const pending = () => ({
  startsAt: null,
  endsAt: null,
  venue: null,
  room: null,
  club: null,
  organizers: [],
  prize: null,
  fee: null,
  eligibility: null,
  capacity: null,
  rulesUrl: null,
  registration: { status: 'upcoming', url: null, deadline: null },
});

export const EVENT_DETAILS = {
  enigma: { ...pending(), mode: null, teamSize: '2 members', duration: null },
  'retro-market': {
    ...pending(),
    mode: 'offline',
    teamSize: 'solo',
    duration: '2hr',
  },
  prudentia: { ...pending(), mode: null, teamSize: null, duration: null },
  'robo-race': {
    ...pending(),
    mode: 'offline',
    teamSize: 'quads',
    duration: '2hr',
    capacity: '10 teams',
  },
  'tech-hunt': { ...pending(), mode: null, teamSize: null, duration: null },
  'robo-soccer': {
    ...pending(),
    mode: 'offline',
    teamSize: 'solo',
    duration: '2hr',
    capacity: '15 teams',
  },
  'trio-codejam': {
    ...pending(),
    mode: 'offline',
    teamSize: '3 members',
    duration: '2hr',
    venue: 'IIIT Vadodara · Gandhinagar Campus',
  },
  codeclash: {
    ...pending(),
    mode: 'Online',
    teamSize: null,
    duration: '3 hours',
    venue: 'Codeforces',
  },
  d2d: { ...pending(), mode: 'offline', teamSize: '3 members', duration: '2hr' },
};

export const FEST_DETAILS = {
  startDate: null,
  endDate: null,
  location: 'IIIT Vadodara · Gandhinagar Campus',
};
