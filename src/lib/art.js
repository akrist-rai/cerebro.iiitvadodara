// The poster archive. Source files live in public/art as WebP, resized and
// trimmed by a one-off script; art-meta.json carries each one's size, mean
// colour (used as the placeholder while it loads) and kind.
//
//   n…  "new images"  – stamps, thermal receipts, riso posters
//   g…  "good stuff"  – the poster library
//   p…  posters/      – the events' own Figma posters (poster-meta.json,
//                       built by scripts/build-posters.mjs)
import artMeta from './art-meta.json';
import posterMeta from './poster-meta.json';

const meta = { ...artMeta, ...posterMeta };

const BASE = import.meta.env.BASE_URL;

export function art(id) {
  const m = meta[id];
  if (!m) throw new Error('Unknown art id: ' + id);
  return { id, src: `${BASE}art/${id}.webp`, ...m };
}

// Two-ink separations. [shadow, highlight] — the same inks the rest of the
// site is printed with, so a photo reads as one more plate on the press.
export const INKS = {
  ink: '#161619',
  paper: '#f1e3dd',
  paperHi: '#faf2ee',
  red: '#f3252b',
  crimson: '#b01a20',
  gold: '#e8b860',
};
export const DUOTONES = {
  'ink-gold': ['ink', 'gold'],
  'ink-paper': ['ink', 'paperHi'],
  'ink-red': ['ink', 'red'],
  'ink-crimson': ['ink', 'crimson'],
  'crimson-paper': ['crimson', 'paperHi'],
  'crimson-gold': ['crimson', 'gold'],
  'red-paper': ['red', 'paperHi'],
  'red-gold': ['red', 'gold'],
  'crimson-red': ['crimson', 'red'],
};

// One event, one poster. The gaming leagues keep their native red/blue
// plates (they are already two-colour); the rest get an ink separation.
export const EVENT_ART = {
  equinox: ['g101', 'crimson-gold', '50% 12%'],
  'retro-market': ['n35', 'red-paper', '50% 0%'],
  prudentia: ['n44', 'ink-paper', '50% 0%'],
  'robo-race': ['n68', 'ink-red', '50% 30%'],
  'tech-hunt': ['n28', 'ink-gold', '50% 50%'],
  'robo-soccer': ['g68', 'ink-red', '50% 20%'],
  'trio-codejam': ['n65', 'ink-gold', '50% 50%'],
  codeclash: ['g23', 'ink-gold', '50% 30%'],
  d2d: ['n9', 'crimson-paper', '50% 10%'],
  'matiks-mania': ['g243', 'crimson-gold', '50% 30%'],
  'clue-to-canvas': ['n59', 'crimson-paper', '50% 20%'],
  valorant: ['g33', '', '50% 20%'],
  bgmi: ['g190', '', '50% 20%'],
  codm: ['g229', '', '50% 20%'],
  'clash-royale': ['g238', '', '50% 30%'],
  'arcade-corner': ['n55', 'ink-red', '50% 50%'],
};

// The tracks stage, one plate per discipline.
export const TRACK_ART = {
  Robotics: ['g8', 'ink-red', '50% 40%'],
  Code: ['g15', 'ink-gold', '50% 30%'],
  Design: ['n20', 'crimson-paper', '50% 20%'],
  Finance: ['n42', 'red-paper', '50% 40%'],
  Math: ['g195', 'crimson-gold', '50% 30%'],
  Gaming: ['g244', 'red-gold', '50% 30%'],
  CTF: ['g199', 'ink-paper', '50% 30%'],
};

export const eventArt = (event) => {
  // An event's own Figma poster wins, printed as designed.
  if (posterMeta['p-' + event?.id])
    return { ...art('p-' + event.id), tone: '', pos: '50% 35%', own: true };
  const e = EVENT_ART[event?.id];
  const t = TRACK_ART[event?.track];
  const [id, tone, pos] = e || t || ['g33', '', '50% 20%'];
  return { ...art(id), tone, pos };
};
export const trackArt = (track) => {
  const [id, tone, pos] = TRACK_ART[track] || TRACK_ART.Code;
  return { ...art(id), tone, pos };
};

// Poster-wall rows. `tone` '' keeps the native print.
export const WALL_TOP = [
  ['g33', ''],
  ['n1', ''],
  ['g192', ''],
  ['n21', ''],
  ['g8', 'ink-red'],
  ['g99', ''],
  ['n25', ''],
  ['g193', ''],
  ['n19', 'ink-paper'],
  ['g236', ''],
  ['g98', ''],
  ['n29', ''],
  ['g190', ''],
  ['n27', ''],
];
export const WALL_BOTTOM = [
  ['n30', ''],
  ['g194', ''],
  ['g100', ''],
  ['n41', ''],
  ['g229', ''],
  ['n39', ''],
  ['g116', ''],
  ['n40', ''],
  ['g228', ''],
  ['n64', ''],
  ['g235', ''],
  ['n38', ''],
  ['g97', ''],
  ['n45', ''],
];
