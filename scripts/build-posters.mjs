// Turns the Figma event posters into site art.
//
//   npm i --no-save sharp
//   node scripts/build-posters.mjs
//
// Export each event's poster from the Ephemeral ’26 Figma file (PNG, 2x) into
// posters/, named after its event id in src/lib/content.js, e.g.
// posters/robo-race.png. Each becomes public/art/p-<id>.webp plus an entry in
// src/lib/poster-meta.json, and art.js then prints it for that event, in its
// own colours, in place of the library poster. Delete a file and rerun to drop
// it. This is kept apart from build-art.mjs, which rewrites art-meta.json.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { EVENTS } from '../src/lib/content.js';

let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.error('This script needs sharp:  npm i --no-save sharp');
  process.exit(1);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'posters');
const out = path.join(root, 'public/art');
const ids = new Set(EVENTS.map((event) => event.id));
const WIDTH = 900;
fs.mkdirSync(out, { recursive: true });

// Old outputs go first, so a removed poster stops being served.
for (const file of fs.readdirSync(out))
  if (/^p-.+\.webp$/.test(file)) fs.unlinkSync(path.join(out, file));

const meta = {};
let bytes = 0;
const files = fs.existsSync(src) ? fs.readdirSync(src) : [];
for (const file of files.sort()) {
  const { name, ext } = path.parse(file);
  if (!/^\.(png|jpe?g|webp)$/i.test(ext)) continue;
  if (!ids.has(name)) {
    console.warn('skipped', file, '- not an event id in content.js');
    continue;
  }
  let source = await sharp(path.join(src, file), { failOn: 'none' })
    .rotate()
    .toBuffer();
  // A poster cut from a screenshot is far below print width. Rather than let
  // the browser stretch it soft, enlarge it here in 2x Lanczos steps, each
  // followed by an unsharp mask, up to 4x or the 900px target.
  let { width } = await sharp(source).metadata();
  const target = Math.min(WIDTH, width * 4);
  while (width < target) {
    width = Math.min(width * 2, target);
    source = await sharp(source)
      .resize({ width, kernel: 'lanczos3' })
      .sharpen({ sigma: width < target ? 0.8 : 1.4, m1: 0.6, m2: 3 })
      .toBuffer();
  }
  const { data, info } = await sharp(source)
    .resize({ width: WIDTH, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 86, effort: 5 })
    .toBuffer({ resolveWithObject: true });
  const id = 'p-' + name;
  fs.writeFileSync(path.join(out, id + '.webp'), data);
  bytes += data.length;
  const stats = await sharp(data).stats();
  const [r, g, b] = stats.channels.map((c) => Math.round(c.mean));
  meta[id] = {
    w: info.width,
    h: info.height,
    c: '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join(''),
    l: Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b),
    k: 'poster',
    a: 0,
  };
}

fs.writeFileSync(
  path.join(root, 'src/lib/poster-meta.json'),
  JSON.stringify(meta, null, 2) + '\n',
);
const missing = [...ids].filter((id) => !meta['p-' + id]);
console.log(
  `${Object.keys(meta).length} posters, ${(bytes / 1e6).toFixed(1)} MB → public/art`,
);
if (missing.length) console.log('No poster yet for:', missing.join(', '));
