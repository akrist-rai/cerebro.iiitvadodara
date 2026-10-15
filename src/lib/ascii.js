// The ASCII engine: a 5×7 bitmap font, a tiny signed-distance rasteriser that
// turns shapes into character ramps, and the small generators (barcodes,
// faces, text scramble) the rest of the site leans on. Pure functions, no DOM.

// ───────────────────────── utilities ─────────────────────────
export const clamp = (x, a = 0, b = 1) => (x < a ? a : x > b ? b : x);

export function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Light to dark. Index 0 is paper, the last is solid ink.
export const RAMP = ' .:-=+*#%@';
export const RAMP_SOFT = ' ·:;+x#%@';
export const GLITCH = '01#%&@$*+=?/\\|<>[]{}';

// ───────────────────────── bitmap font ─────────────────────────
const F = {};
const def = (ch, rows) => (F[ch] = rows);
def('A', ['.###.', '#...#', '#...#', '#####', '#...#', '#...#', '#...#']);
def('B', ['####.', '#...#', '#...#', '####.', '#...#', '#...#', '####.']);
def('C', ['.####', '#....', '#....', '#....', '#....', '#....', '.####']);
def('D', ['####.', '#...#', '#...#', '#...#', '#...#', '#...#', '####.']);
def('E', ['#####', '#....', '#....', '####.', '#....', '#....', '#####']);
def('F', ['#####', '#....', '#....', '####.', '#....', '#....', '#....']);
def('G', ['.####', '#....', '#....', '#.###', '#...#', '#...#', '.####']);
def('H', ['#...#', '#...#', '#...#', '#####', '#...#', '#...#', '#...#']);
def('I', ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '#####']);
def('J', ['..###', '...#.', '...#.', '...#.', '...#.', '#..#.', '.##..']);
def('K', ['#...#', '#..#.', '#.#..', '##...', '#.#..', '#..#.', '#...#']);
def('L', ['#....', '#....', '#....', '#....', '#....', '#....', '#####']);
def('M', ['#...#', '##.##', '#.#.#', '#.#.#', '#...#', '#...#', '#...#']);
def('N', ['#...#', '##..#', '##..#', '#.#.#', '#..##', '#..##', '#...#']);
def('O', ['.###.', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.']);
def('P', ['####.', '#...#', '#...#', '####.', '#....', '#....', '#....']);
def('Q', ['.###.', '#...#', '#...#', '#...#', '#.#.#', '#..#.', '.##.#']);
def('R', ['####.', '#...#', '#...#', '####.', '#.#..', '#..#.', '#...#']);
def('S', ['.####', '#....', '#....', '.###.', '....#', '....#', '####.']);
def('T', ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '..#..']);
def('U', ['#...#', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.']);
def('V', ['#...#', '#...#', '#...#', '#...#', '#...#', '.#.#.', '..#..']);
def('W', ['#...#', '#...#', '#...#', '#.#.#', '#.#.#', '##.##', '#...#']);
def('X', ['#...#', '#...#', '.#.#.', '..#..', '.#.#.', '#...#', '#...#']);
def('Y', ['#...#', '#...#', '.#.#.', '..#..', '..#..', '..#..', '..#..']);
def('Z', ['#####', '....#', '...#.', '..#..', '.#...', '#....', '#####']);
def('0', ['.###.', '#...#', '#..##', '#.#.#', '##..#', '#...#', '.###.']);
def('1', ['..#..', '.##..', '..#..', '..#..', '..#..', '..#..', '.###.']);
def('2', ['.###.', '#...#', '....#', '...#.', '..#..', '.#...', '#####']);
def('3', ['####.', '....#', '....#', '.###.', '....#', '....#', '####.']);
def('4', ['...#.', '..##.', '.#.#.', '#..#.', '#####', '...#.', '...#.']);
def('5', ['#####', '#....', '####.', '....#', '....#', '#...#', '.###.']);
def('6', ['.###.', '#....', '#....', '####.', '#...#', '#...#', '.###.']);
def('7', ['#####', '....#', '...#.', '..#..', '.#...', '.#...', '.#...']);
def('8', ['.###.', '#...#', '#...#', '.###.', '#...#', '#...#', '.###.']);
def('9', ['.###.', '#...#', '#...#', '.####', '....#', '....#', '.###.']);
def("'", ['..#..', '..#..', '.#...', '.....', '.....', '.....', '.....']);
def('-', ['.....', '.....', '.....', '#####', '.....', '.....', '.....']);
def('.', ['.....', '.....', '.....', '.....', '.....', '.##..', '.##..']);
def(',', ['.....', '.....', '.....', '.....', '.##..', '..#..', '.#...']);
def(':', ['.....', '.##..', '.##..', '.....', '.##..', '.##..', '.....']);
def('/', ['....#', '....#', '...#.', '..#..', '.#...', '#....', '#....']);
def('+', ['.....', '..#..', '..#..', '#####', '..#..', '..#..', '.....']);
def('=', ['.....', '.....', '#####', '.....', '#####', '.....', '.....']);
def('?', ['.###.', '#...#', '....#', '...#.', '..#..', '.....', '..#..']);
def('!', ['..#..', '..#..', '..#..', '..#..', '..#..', '.....', '..#..']);
def('%', ['##..#', '##.#.', '...#.', '..#..', '.#...', '.#.##', '#..##']);
def('<', ['...#.', '..#..', '.#...', '#....', '.#...', '..#..', '...#.']);
def('>', ['.#...', '..#..', '...#.', '....#', '...#.', '..#..', '.#...']);
def('_', ['.....', '.....', '.....', '.....', '.....', '.....', '#####']);
def('*', ['.....', '#.#.#', '.###.', '#####', '.###.', '#.#.#', '.....']);
def(' ', ['...', '...', '...', '...', '...', '...', '...']);

export const GLYPH_H = 7;
const NORMAL = { '’': "'", '‘': "'", '–': '-', '—': '-' };
export const glyph = (ch) => F[(NORMAL[ch] || ch).toUpperCase()] || F['?'];
export const textWidth = (str) =>
  [...str].reduce((n, ch) => n + glyph(ch)[0].length + 1, -1);

// ───────────────────────── big text ─────────────────────────
// Cells: 0 empty, 1 solid, 2 shadow. kx columns and ky rows per font pixel;
// kx = 2·ky keeps letters upright, because a terminal cell is twice as tall
// as it is wide. `shadow` throws a one-cell drop shadow, ANSI-Shadow style.
export function bigText(text, { kx = 2, ky = 1, gap = 1, shadow = true } = {}) {
  const chars = [...text.toUpperCase()];
  const gw = gap * kx;
  let width = 0;
  const parts = chars.map((ch) => {
    const g = glyph(ch);
    const w = g[0].length * kx;
    const part = { g, x: width, w };
    width += w + gw;
    return part;
  });
  width = Math.max(0, width - gw);
  const height = GLYPH_H * ky;
  const sx = shadow ? Math.max(1, Math.round(kx / 2)) : 0;
  const sy = shadow ? 1 : 0;
  const W = width + sx;
  const H = height + sy;
  const cells = Array.from({ length: H }, () => new Uint8Array(W));
  for (const { g, x } of parts) {
    for (let r = 0; r < GLYPH_H; r++) {
      for (let c = 0; c < g[r].length; c++) {
        if (g[r][c] !== '#') continue;
        for (let dy = 0; dy < ky; dy++)
          for (let dx = 0; dx < kx; dx++) {
            const yy = r * ky + dy;
            const xx = x + c * kx + dx;
            if (shadow && cells[yy + sy][xx + sx] === 0)
              cells[yy + sy][xx + sx] = 2;
          }
      }
    }
  }
  for (const { g, x } of parts) {
    for (let r = 0; r < GLYPH_H; r++) {
      for (let c = 0; c < g[r].length; c++) {
        if (g[r][c] !== '#') continue;
        for (let dy = 0; dy < ky; dy++)
          for (let dx = 0; dx < kx; dx++)
            cells[r * ky + dy][x + c * kx + dx] = 1;
      }
    }
  }
  return { cells, w: W, h: H };
}

// Cells -> HTML. Solid and shadow runs are CSS blocks sized in `ch`, so the
// letters never depend on a font having the block-element glyphs.
export function bigTextHTML(art) {
  return art.cells
    .map((row) => {
      let out = '';
      let n = 0;
      let kind = 0;
      const flush = () => {
        if (!n) return;
        out +=
          kind === 0
            ? ' '.repeat(n)
            : '<i class="' +
              (kind === 1 ? 'f' : 's') +
              '" style="width:' +
              n +
              'ch"></i>';
        n = 0;
      };
      for (const c of row) {
        if (c !== kind) {
          flush();
          kind = c;
        }
        n++;
      }
      flush();
      return out;
    })
    .join('\n');
}

// ───────────────────────── scene rasteriser ─────────────────────────
// A Scene is a cols×rows field of ink density. Shapes are written in a
// 100×100 space that is stretched onto the cell grid, so a circle is a
// circle however many characters wide the scene is rendered.
export class Scene {
  constructor(cols, rows) {
    this.w = cols;
    this.h = rows;
    this.v = new Float32Array(cols * rows);
    this.px = 100 / cols; // a cell's width in scene units
  }
  clear() {
    this.v.fill(0);
    return this;
  }
  // Blend `value` (or value(x, y)) over every cell by the shape's coverage.
  paint(dist, value = 1) {
    const { w, h, v, px } = this;
    const fn = typeof value === 'function' ? value : null;
    for (let j = 0; j < h; j++) {
      const y = ((j + 0.5) / h) * 100;
      for (let i = 0; i < w; i++) {
        const x = ((i + 0.5) / w) * 100;
        const c = clamp(0.5 + 0.3 - dist(x, y) / px);
        if (c <= 0) continue;
        const k = j * w + i;
        const to = fn ? fn(x, y) : value;
        v[k] += (to - v[k]) * c;
      }
    }
    return this;
  }
  fill(value = 1) {
    return this.paint(() => -1, value);
  }
  disc(x, y, r, value = 1) {
    return this.paint((px, py) => Math.hypot(px - x, py - y) - r, value);
  }
  ring(x, y, r, t = 2, value = 1) {
    return this.paint(
      (px, py) => Math.abs(Math.hypot(px - x, py - y) - r) - t / 2,
      value,
    );
  }
  ellipse(x, y, rx, ry, value = 1) {
    const m = Math.min(rx, ry);
    return this.paint(
      (px, py) => (Math.hypot((px - x) / rx, (py - y) / ry) - 1) * m,
      value,
    );
  }
  // Centre x, y; optional rotation in degrees.
  box(x, y, w, h, value = 1, rot = 0) {
    const a = (-rot * Math.PI) / 180;
    const ca = Math.cos(a);
    const sa = Math.sin(a);
    return this.paint((px, py) => {
      const dx = px - x;
      const dy = py - y;
      const lx = dx * ca - dy * sa;
      const ly = dx * sa + dy * ca;
      return Math.max(Math.abs(lx) - w / 2, Math.abs(ly) - h / 2);
    }, value);
  }
  line(x0, y0, x1, y1, t = 2, value = 1) {
    const dx = x1 - x0;
    const dy = y1 - y0;
    const len2 = dx * dx + dy * dy || 1;
    return this.paint((px, py) => {
      const u = clamp(((px - x0) * dx + (py - y0) * dy) / len2);
      return Math.hypot(px - (x0 + u * dx), py - (y0 + u * dy)) - t / 2;
    }, value);
  }
  poly(pts, value = 1) {
    const n = pts.length;
    return this.paint((px, py) => {
      let inside = false;
      let best = Infinity;
      for (let i = 0, j = n - 1; i < n; j = i++) {
        const [xi, yi] = pts[i];
        const [xj, yj] = pts[j];
        if (
          yi > py !== yj > py &&
          px < ((xj - xi) * (py - yi)) / (yj - yi) + xi
        )
          inside = !inside;
        const ex = xi - xj;
        const ey = yi - yj;
        const u = clamp(
          ((px - xj) * ex + (py - yj) * ey) / (ex * ex + ey * ey || 1),
        );
        best = Math.min(
          best,
          Math.hypot(px - (xj + u * ex), py - (yj + u * ey)),
        );
      }
      return inside ? -best : best;
    }, value);
  }
  // Open polyline of segments `t` thick.
  path(pts, t = 2, value = 1) {
    for (let i = 1; i < pts.length; i++)
      this.line(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], t, value);
    return this;
  }
  // Bitmap text; `s` is the size of one font pixel in scene units.
  text(str, x, y, s = 2, value = 1) {
    let cx = x;
    for (const ch of [...str]) {
      const g = glyph(ch);
      for (let r = 0; r < GLYPH_H; r++)
        for (let c = 0; c < g[r].length; c++)
          if (g[r][c] === '#')
            this.box(cx + c * s + s / 2, y + r * s + s / 2, s, s, value);
      cx += (g[0].length + 1) * s;
    }
    return this;
  }
  textW(str, s = 2) {
    return textWidth(str) * s;
  }
  // Rows of characters; `ramp` maps density to glyphs.
  lines(ramp = RAMP) {
    const { w, h, v } = this;
    const n = ramp.length - 1;
    const out = [];
    for (let j = 0; j < h; j++) {
      let row = '';
      for (let i = 0; i < w; i++)
        row += ramp[Math.round(clamp(v[j * w + i]) * n)];
      out.push(row);
    }
    return out;
  }
  toString(ramp = RAMP) {
    return this.lines(ramp).join('\n');
  }
}

// ───────────────────────── generators ─────────────────────────
// A Code-39-flavoured barcode as [bar, gap] widths, from a seed.
export function barcode(seed, bars = 34) {
  const r = rng(hash(seed));
  return Array.from({ length: bars }, () => [
    1 + Math.floor(r() * 3),
    1 + Math.floor(r() * 2),
  ]);
}

const EYES = [
  'o o',
  '^ ^',
  '- -',
  '@ @',
  '• •',
  '> <',
  'x x',
  '° °',
  '$ $',
  '0 0',
];
const MOUTH = ['~', 'v', '===', 'w', 'o', '~~~', 'u', '___', '-', '3'];
const HAIR = [
  '/-/-/-/-',
  '||||||||',
  '.:.:.:.:',
  '~~~~~~~~',
  '########',
  '^^^^^^^^',
  '********',
  '<<<<>>>>',
  '++++++++',
];
const EARS = ['(', '[', '{', '<', '|'];
const EAR_R = { '(': ')', '[': ']', '{': '}', '<': '>', '|': '|' };

// A deterministic little portrait for a name, as an array of lines.
export function face(name) {
  const r = rng(hash(name));
  const pick = (a) => a[Math.floor(r() * a.length)];
  const hair = pick(HAIR);
  const eyes = pick(EYES);
  const mouth = pick(MOUTH);
  const ear = pick(EARS);
  const nose = pick(['·', ' ', '.', ',', '`']);
  const inner = 10;
  const pad = (s) => {
    const left = Math.floor((inner - s.length) / 2);
    return ' '.repeat(left) + s + ' '.repeat(inner - s.length - left);
  };
  const row = (s) => ear + pad(s) + EAR_R[ear];
  return [
    ' ' + hair.slice(0, inner) + ' ',
    '+' + '-'.repeat(inner) + '+',
    row(''),
    row(eyes),
    row(nose),
    row(mouth),
    '+' + '-'.repeat(inner) + '+',
  ];
}

// ───────────────────────── scramble ─────────────────────────
// Drives a text decode: returns a function(progress 0..1) -> string.
export function scrambler(final, seed = 7) {
  const r = rng(seed + final.length);
  const order = [...final].map((_, i) => ({ i, at: r() * 0.7 }));
  const chars = [...final];
  return (p) =>
    chars
      .map((ch, i) => {
        if (ch === ' ' || ch === '\n') return ch;
        const o = order[i];
        if (p >= o.at + 0.3) return ch;
        return GLITCH[Math.floor(r() * GLITCH.length)];
      })
      .join('');
}
