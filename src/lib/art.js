// The poster archive. Source files live in public/art as WebP, resized and
// trimmed by a one-off script; art-meta.json carries each one's size, mean
// colour (used as the placeholder while it loads) and kind.
//
//   n…  "new images"  – stamps, thermal receipts, riso posters
//   g…  "good stuff"  – the poster library
import meta from './art-meta.json';

const BASE = import.meta.env.BASE_URL;

export function art(id) {
  const m = meta[id];
  if (!m) throw new Error('Unknown art id: ' + id);
  return { id, src: `${BASE}art/${id}.webp`, ...m };
}

// Two-ink separations. [shadow, highlight] — the same inks the rest of the
// site is printed with, so a photo reads as one more plate on the press.
export const INKS = {
  ink: '#14130f',
  paper: '#f1ecdf',
  paperHi: '#fbf8ef',
  red: '#e5391f',
  blue: '#2535ff',
  lime: '#d6f23a',
};
export const DUOTONES = {
  'ink-lime': ['ink', 'lime'],
  'ink-paper': ['ink', 'paperHi'],
  'ink-red': ['ink', 'red'],
  'ink-blue': ['ink', 'blue'],
  'blue-paper': ['blue', 'paperHi'],
  'blue-lime': ['blue', 'lime'],
  'red-paper': ['red', 'paperHi'],
  'red-lime': ['red', 'lime'],
  'blue-red': ['blue', 'red'],
};

// One event, one poster. The gaming leagues keep their native red/blue
// plates (they are already two-colour); the rest get an ink separation.
export const EVENT_ART = {
  equinox: ['g101', 'blue-lime', '50% 12%'],
  'retro-market': ['n35', 'red-paper', '50% 0%'],
  prudentia: ['n44', 'ink-paper', '50% 0%'],
  'robo-race': ['n68', 'ink-red', '50% 30%'],
  'tech-hunt': ['n28', 'ink-lime', '50% 50%'],
  'robo-soccer': ['g68', 'ink-red', '50% 20%'],
  'trio-codejam': ['n65', 'ink-lime', '50% 50%'],
  codeclash: ['g23', 'ink-lime', '50% 30%'],
  d2d: ['n9', 'blue-paper', '50% 10%'],
  'matiks-mania': ['g243', 'blue-lime', '50% 30%'],
  'clue-to-canvas': ['n59', 'blue-paper', '50% 20%'],
  valorant: ['g33', '', '50% 20%'],
  bgmi: ['g190', '', '50% 20%'],
  codm: ['g229', '', '50% 20%'],
  'clash-royale': ['g238', '', '50% 30%'],
  'arcade-corner': ['n55', 'ink-red', '50% 50%'],
};

// The tracks stage, one plate per discipline.
export const TRACK_ART = {
  Robotics: ['g8', 'ink-red', '50% 40%'],
  Code: ['g15', 'ink-lime', '50% 30%'],
  Design: ['n20', 'blue-paper', '50% 20%'],
  Finance: ['n42', 'red-paper', '50% 40%'],
  Math: ['g195', 'blue-lime', '50% 30%'],
  Gaming: ['g244', 'red-lime', '50% 30%'],
  CTF: ['g199', 'ink-paper', '50% 30%'],
};

export const eventArt = (event) => {
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
