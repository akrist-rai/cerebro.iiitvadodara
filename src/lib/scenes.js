// One drawn-in-code ASCII illustration per event. Each scene is a function
// (scene, t) painting into a 100×100 space; `t` is seconds, so the same
// drawing sits still at t = 0 and moves when it is fed a clock.
import { Scene, RAMP } from './ascii.js';

const S = Math.sin;
const C = Math.cos;
const TAU = Math.PI * 2;
const polar = (cx, cy, r, a) => [cx + C(a) * r, cy + S(a) * r];

const bezier = (p0, p1, p2, p3, u) => {
  const k = 1 - u;
  const f = (i) =>
    k * k * k * p0[i] +
    3 * k * k * u * p1[i] +
    3 * k * u * u * p2[i] +
    u * u * u * p3[i];
  return [f(0), f(1)];
};

export const SCENES = {
  'robo-race'(s, t) {
    // chequered flag, waving
    const w = S(t * 3) * 2;
    for (let r = 0; r < 3; r++)
      for (let c = 0; c < 5; c++)
        if ((r + c) % 2 === 0)
          s.box(64 + c * 6.5, 10 + r * 6.5 + w * (c / 5), 6.5, 6.5, 1);
    s.line(60, 4, 60, 34, 3.2, 1);
    // road, dashes sliding backwards
    s.box(50, 92, 110, 18, 0.28);
    for (let k = -1; k < 9; k++) {
      const x = ((k * 14 - t * 46) % 126) + 4;
      s.box(x, 92, 8, 2.2, 0.95);
    }
    // cones
    s.poly(
      [
        [92, 78],
        [86, 84],
        [98, 84],
      ],
      1,
    );
    // the car
    const x = 44 + S(t * 1.6) * 4;
    const y = 60;
    for (let i = 0; i < 4; i++)
      s.line(
        x - 32 - i * 3,
        y - 8 + i * 7,
        x - 46 - i * 9,
        y - 8 + i * 7,
        2,
        0.55,
      );
    s.box(x, y, 56, 17, 0.9);
    s.box(x + 4, y - 13, 28, 11, 1);
    s.box(x + 7, y - 13, 14, 6, 0.05);
    s.box(x + 26, y - 5, 5, 4, 0.1);
    for (const wx of [x - 17, x + 17]) {
      s.disc(wx, y + 12, 11, 1);
      s.disc(wx, y + 12, 5, 0.1);
      const a = t * 9;
      s.line(wx, y + 12, ...polar(wx, y + 12, 5, a), 2, 1);
      s.line(wx, y + 12, ...polar(wx, y + 12, 5, a + Math.PI), 2, 1);
    }
  },

  'robo-soccer'(s, t) {
    s.line(0, 86, 100, 86, 2.6, 1);
    // goal and net
    s.path(
      [
        [72, 86],
        [72, 40],
        [96, 40],
        [96, 86],
      ],
      3.4,
      1,
    );
    for (let k = 1; k < 5; k++) {
      s.line(72, 40 + k * 9.2, 96, 40 + k * 9.2, 1.2, 0.45);
      s.line(72 + k * 4.8, 40, 72 + k * 4.8, 86, 1.2, 0.45);
    }
    // robot
    const kick = S(t * 3);
    s.box(20, 70, 34, 14, 0.9);
    s.disc(10, 82, 7, 1);
    s.disc(30, 82, 7, 1);
    s.disc(10, 82, 3, 0.1);
    s.disc(30, 82, 3, 0.1);
    s.line(20, 63, 20, 46, 3, 1);
    s.disc(20, 43, 5, 1);
    s.line(36, 72, 46 + kick * 5, 80, 4.4, 1);
    // ball
    const u = (t * 0.45) % 1;
    const bx = 52 + u * 22;
    const by = 74 - Math.abs(S(u * Math.PI * 3)) * 26;
    s.disc(bx, by, 11, 0.12);
    s.ring(bx, by, 11, 2.6, 1);
    s.poly(
      [0, 1, 2, 3, 4].map((i) =>
        polar(bx, by, 4.6, -Math.PI / 2 + (i * TAU) / 5),
      ),
      1,
    );
    for (let i = 0; i < 5; i++) {
      const a = -Math.PI / 2 + (i * TAU) / 5;
      s.line(...polar(bx, by, 4.6, a), ...polar(bx, by, 11, a), 1.6, 1);
    }
  },

  'retro-market'(s, t) {
    s.path(
      [
        [7, 8],
        [7, 90],
        [97, 90],
      ],
      2.2,
      0.9,
    );
    const k = (S(t * 1.8) + 1) / 2;
    const candles = [
      [0.4, 0.55, 0.62, 0.34],
      [0.55, 0.42, 0.6, 0.36],
      [0.42, 0.6, 0.66, 0.4],
      [0.6, 0.5, 0.68, 0.45],
      [0.5, 0.7, 0.76, 0.46],
      [0.7, 0.82 + k * 0.06, 0.92 + k * 0.04, 0.66],
    ];
    const Y = (v) => 86 - v * 74;
    const pts = [];
    candles.forEach(([o, c, h, l], i) => {
      const x = 20 + i * 14.5;
      s.line(x, Y(h), x, Y(l), 2.6, 1);
      const top = Y(Math.max(o, c));
      const bot = Y(Math.min(o, c));
      s.box(x, (top + bot) / 2, 11, bot - top, 1);
      if (c > o) s.box(x, (top + bot) / 2, 5, Math.max(bot - top - 5, 0.1), 0);
      pts.push([x, Y(c)]);
    });
    s.path(pts, 1.6, 0.5);
    // a paper slip
    s.box(86, 22, 20, 26, 0.2, -8);
    for (let i = 0; i < 3; i++)
      s.line(78, 13 + i * 7, 94, 13 + i * 7 + 1.4, 2, 0.95);
  },

  prudentia(s, t) {
    const jig = (i) => S(t * 1.3 + i * 1.7) * 2.2;
    const base = [
      [8, 72],
      [20, 62],
      [31, 67],
      [43, 48],
      [55, 55],
      [67, 33],
      [79, 40],
      [92, 16],
    ];
    const pts = base.map(([x, y], i) => [x, y + jig(i)]);
    s.line(8, 88, 96, 88, 1.4, 0.9);
    for (let k = 1; k < 4; k++)
      s.line(8, 88 - k * 19, 96, 88 - k * 19, 0.6, 0.25);
    s.poly([...pts, [92, 88], [8, 88]], (x, y) =>
      Math.max(0.06, (y - 14) / 130),
    );
    s.path(pts, 2.4, 1);
    pts.forEach(([x, y]) => s.disc(x, y, 2.2, 1));
    const u = ((t * 0.18) % 1) * (pts.length - 1);
    const i = Math.min(pts.length - 2, Math.floor(u));
    const f = u - i;
    const mx = pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f;
    const my = pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f;
    s.ring(mx, my, 6.5, 1.6, 1);
    s.disc(mx, my, 3.6, 1);
    s.text('+12%', 8, 6, 2.3, 1);
  },

  'tech-hunt'(s, t) {
    s.ring(40, 46, 27, 7, 1);
    s.disc(40, 46, 24, 0.1);
    const row = (str, y, off) => s.text(str, 17 + off, y, 2.5, 0.85);
    const sh = (t * 6) % 6;
    row('1011', 24, -sh * 0.0);
    row('0110', 44, 0);
    row('1101', 64, 0);
    // sweeping glare
    const g = ((t * 0.5) % 1) * 90 - 10;
    s.paint(
      (x, y) =>
        Math.hypot(x - 40, y - 46) -
        23 +
        (Math.abs(x + y * 0.5 - g) > 5 ? 99 : 0),
      0.05,
    );
    s.line(60, 66, 88, 94, 11, 1);
    s.line(76, 82, 90, 96, 14, 0.85);
    // flag
    const wave = S(t * 4) * 3;
    s.line(76, 6, 76, 34, 2.4, 1);
    s.poly(
      [
        [77, 6],
        [97, 12 + wave],
        [77, 22],
      ],
      1,
    );
  },

  equinox(s, t) {
    s.disc(50, 50, 37, 1);
    s.box(75, 50, 50, 90, 0);
    s.ring(50, 50, 37, 2.6, 1);
    s.line(50, 8, 50, 92, 1.2, (x) => (x < 50 ? 0 : 1));
    const pts = [];
    for (let x = 6; x <= 94; x += 2)
      pts.push([x, 50 + S((x / 94) * TAU * 1.5 + t * 2) * 13]);
    s.path(pts, 2.4, (x) => (x < 50 ? 0 : 1));
    // tick marks on the horizon
    for (let k = 0; k < 9; k++)
      s.line(10 + k * 10, 49, 10 + k * 10, 51, 1, (x) => (x < 50 ? 0 : 0.9));
  },

  'matiks-mania'(s, t) {
    s.text('7+3=?', 3.5, 6, 3.1, 1);
    const r = 31 + S(t * 3) * 3;
    s.ring(50, 64, r, 1.6, 0.45);
    s.poly(
      [
        [60, 30],
        [34, 62],
        [48, 62],
        [40, 94],
        [70, 54],
        [54, 54],
        [68, 30],
      ],
      1,
    );
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * TAU + t;
      s.line(...polar(50, 64, r + 4, a), ...polar(50, 64, r + 9, a), 1.6, 0.9);
    }
  },

  'trio-codejam'(s, t) {
    const N = [
      [50, 24],
      [20, 74],
      [80, 74],
    ];
    for (let i = 0; i < 3; i++) {
      const a = N[i];
      const b = N[(i + 1) % 3];
      s.line(a[0], a[1], b[0], b[1], 1.8, 0.55);
    }
    const u = (t * 0.55) % 3;
    const e = Math.floor(u);
    const f = u - e;
    const a = N[e];
    const b = N[(e + 1) % 3];
    N.forEach(([x, y], i) => {
      const hot = i === e;
      s.disc(x, y, 12, 1);
      if (hot) s.ring(x, y, 16 + S(t * 8) * 1.2, 1.6, 1);
      s.text(String(i + 1), x - 6, y - 8.4, 2.4, 0);
    });
    const px = a[0] + (b[0] - a[0]) * f;
    const py = a[1] + (b[1] - a[1]) * f;
    s.disc(px, py, 4.4, 1);
    s.ring(px, py, 7.5, 1.4, 0.7);
  },

  codeclash(s, t) {
    const swing = S(t * 3) * 3;
    // two blades
    s.line(12, 10 + swing, 80, 78 + swing, 5, 1);
    s.line(88, 10 - swing, 20, 78 - swing, 5, 1);
    // guards and pommels
    s.line(54, 76, 74, 56, 4.4, 1);
    s.line(46, 76, 26, 56, 4.4, 1);
    s.disc(86, 90, 5.4, 1);
    s.disc(14, 90, 5.4, 1);
    s.line(80, 78, 86, 90, 4, 1);
    s.line(20, 78, 14, 90, 4, 1);
    // clash
    s.disc(50, 44, 7 + S(t * 9) * 1.6, 0);
    s.ring(50, 44, 9, 2, 1);
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * TAU + t * 0.8;
      s.line(
        ...polar(50, 44, 13, a),
        ...polar(50, 44, 19 + (i % 2) * 7, a),
        1.8,
        1,
      );
    }
  },

  d2d(s, t) {
    const P0 = [10, 70];
    const P1 = [26, 8 + S(t * 1.4) * 8];
    const P2 = [64, 96 - S(t * 1.1) * 8];
    const P3 = [90, 26];
    const pts = [];
    for (let i = 0; i <= 40; i++) pts.push(bezier(P0, P1, P2, P3, i / 40));
    s.line(...P0, ...P1, 1.1, 0.5);
    s.line(...P3, ...P2, 1.1, 0.5);
    s.path(pts, 2.6, 1);
    s.box(...P0, 6.4, 6.4, 1);
    s.box(...P3, 6.4, 6.4, 1);
    s.disc(...P1, 3, 1);
    s.disc(...P2, 3, 1);
    s.text('</>', 52, 80, 2.2, 1);
    s.ring(18, 22, 8, 2, 0.8);
    s.disc(18, 22, 2.2, 1);
  },

  'clue-to-canvas'(s, t) {
    s.box(50, 38, 66, 50, 1);
    s.box(50, 38, 60, 44, 0);
    const open = 3 + 8 * Math.abs(C(t * 0.9));
    s.ellipse(50, 38, 21, open, 1);
    s.ellipse(50, 38, 18, Math.max(open - 3, 0.1), 0);
    const ix = 50 + S(t * 1.2) * 4;
    if (open > 5) {
      s.disc(ix, 38, Math.min(7, open - 1), 1);
      s.disc(ix, 38, 2.4, 0);
    }
    for (let k = -2; k <= 2; k++)
      s.line(50 + k * 9, 38 - open, 50 + k * 10, 38 - open - 7, 1.6, 0.9);
    s.box(50, 66, 74, 3.4, 1);
    s.line(30, 68, 20, 96, 3.2, 1);
    s.line(70, 68, 80, 96, 3.2, 1);
    s.line(50, 68, 50, 96, 3.2, 0.7);
  },

  valorant(s, t) {
    const pulse = 3 + (S(t * 3) + 1) * 2;
    s.ring(50, 50, 27, 2.6, 1);
    for (let a = 0; a < 4; a++) {
      const ang = (a * Math.PI) / 2;
      s.line(...polar(50, 50, 6 + pulse, ang), ...polar(50, 50, 31, ang), 3, 1);
    }
    s.disc(50, 50, 2.4, 1);
    const L = 14;
    s.path(
      [
        [6, 6 + L],
        [6, 6],
        [6 + L, 6],
      ],
      3,
      1,
    );
    s.path(
      [
        [94 - L, 6],
        [94, 6],
        [94, 6 + L],
      ],
      3,
      1,
    );
    s.path(
      [
        [6, 94 - L],
        [6, 94],
        [6 + L, 94],
      ],
      3,
      1,
    );
    s.path(
      [
        [94 - L, 94],
        [94, 94],
        [94, 94 - L],
      ],
      3,
      1,
    );
    s.line(14, 50, 30, 50, 1, 0.4);
    s.line(70, 50, 86, 50, 1, 0.4);
  },

  bgmi(s, t) {
    const cx = 50 + S(t * 1.2) * 5;
    s.ellipse(14, 20, 12, 4, 0.28);
    s.ellipse(88, 60, 10, 3.4, 0.28);
    s.disc(cx, 38, 31, 1);
    s.box(cx, 68, 90, 60, 0);
    s.line(cx - 31, 38, cx + 31, 38, 2.4, 1);
    s.line(cx, 7, cx - 13, 38, 1.4, 0);
    s.line(cx, 7, cx + 13, 38, 1.4, 0);
    for (const dx of [-30, -10, 10, 30])
      s.line(cx + dx, 39, cx + dx * 0.12, 74, 1.1, 0.8);
    s.box(cx, 80, 15, 13, 1);
    s.line(cx - 7, 80, cx + 7, 80, 1.4, 0);
    s.line(cx, 74, cx, 86, 1.4, 0);
    s.line(0, 97, 100, 97, 1.4, 0.45);
  },

  codm(s, t) {
    s.ring(50, 52, 36, 3, 1);
    const spin = S(t * 2) * 0.12;
    const star = [];
    for (let i = 0; i < 10; i++)
      star.push(
        polar(
          50,
          27,
          i % 2 ? 5.5 : 13,
          -Math.PI / 2 + (i * Math.PI) / 5 + spin,
        ),
      );
    s.poly(star, 1);
    s.path(
      [
        [27, 52],
        [50, 66],
        [73, 52],
      ],
      6,
      1,
    );
    s.path(
      [
        [27, 68],
        [50, 82],
        [73, 68],
      ],
      6,
      1,
    );
    s.path(
      [
        [27, 36],
        [38, 42],
      ],
      4,
      0.6,
    );
    s.path(
      [
        [73, 36],
        [62, 42],
      ],
      4,
      0.6,
    );
  },

  'clash-royale'(s, t) {
    const shine = (x, y) =>
      1 - 0.6 * Math.exp(-((x + y * 0.4 - 6 - ((t * 28) % 130)) ** 2 / 30));
    s.poly(
      [
        [22, 72],
        [16, 34],
        [34, 52],
        [50, 24],
        [66, 52],
        [84, 34],
        [78, 72],
      ],
      shine,
    );
    s.box(50, 79, 62, 13, shine);
    for (const [x, y, r] of [
      [16, 30, 5.2],
      [50, 20, 6],
      [84, 30, 5.2],
    ])
      s.disc(x, y, r, 1);
    for (const x of [31, 50, 69]) s.disc(x, 79, 3.4, 0);
    s.box(50, 68, 4, 4, 0, 45);
    s.line(14, 92, 86, 92, 1.4, 0.5);
  },

  'arcade-corner'(s, t) {
    const sway = S(t * 2) * 7;
    s.text('PLAY', 20, 4, 2.6, 1);
    s.box(50, 90, 66, 12, 1);
    s.line(50, 88, 50 + sway, 50, 6.4, 0.85);
    s.disc(50 + sway, 40, 13, 1);
    s.disc(46 + sway, 35, 3.6, 0.1);
    for (const [x, o] of [
      [20, 0],
      [80, 1],
    ]) {
      const press = S(t * 4 + o * 3) > 0.7 ? 2 : 0;
      s.disc(x, 76 + press, 7, 1);
      s.ring(x, 76 + press, 7, 1.4, 0.1);
    }
    s.box(50, 90, 30, 2, 0);
  },

  'treasure-of-code'(s, t) {
    s.text('<<', 6, 6, 3, 1);
    // a dashed trail across the map, five stages to the X
    const P = [
      [12, 88],
      [22, 30],
      [66, 100],
      [76, 32],
    ];
    for (let i = 0; i <= 48; i++)
      if (i % 4 < 2) s.disc(...bezier(...P, i / 48), 1.4, 0.75);
    for (let k = 0; k < 5; k++) s.disc(...bezier(...P, k / 5), 3.2, 1);
    const [mx, my] = bezier(...P, (t * 0.2) % 1);
    s.ring(mx, my, 6, 1.6, 1);
    // X marks the spot
    const r = 9 + S(t * 4) * 1.2;
    s.line(76 - r, 32 - r, 76 + r, 32 + r, 4, 1);
    s.line(76 + r, 32 - r, 76 - r, 32 + r, 4, 1);
  },

  inauguration(s, t) {
    const R = 24;
    s.ring(50, 50, R, 3, 1);
    for (let k = 0; k < 16; k++) {
      const a = (k / 16) * TAU + t * 0.25;
      s.line(
        ...polar(50, 50, R + 7, a),
        ...polar(50, 50, R + 14 + (k % 2) * 8, a),
        2.4,
        1,
      );
    }
    s.text('26', 31, 38, 3.4, 1);
  },
};

const TRACK_SCENE = {
  Robotics: 'robo-race',
  Code: 'trio-codejam',
  Design: 'd2d',
  Finance: 'prudentia',
  Math: 'equinox',
  Gaming: 'clash-royale',
  CTF: 'tech-hunt',
  Ceremony: 'inauguration',
};
export const sceneId = (idOrEvent) => {
  const id = typeof idOrEvent === 'string' ? idOrEvent : idOrEvent.id;
  if (SCENES[id]) return id;
  return TRACK_SCENE[idOrEvent.track] || 'inauguration';
};

// Render a named scene to a string of `rows` lines.
export function drawScene(id, cols = 40, rows = 20, t = 0, ramp = RAMP) {
  const s = new Scene(cols, rows);
  (SCENES[id] || SCENES.inauguration)(s, t);
  return s.toString(ramp);
}
