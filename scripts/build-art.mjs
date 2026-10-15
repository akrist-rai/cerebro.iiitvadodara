// Rebuilds public/art and src/lib/art-meta.json from the source folders.
//
//   npm i --no-save sharp
//   ART_NEW="./new images" ART_GOOD="D:/path/to/good stuff" node scripts/build-art.mjs
//
// scripts/art-picks.json lists what goes on the site: { id, set, file, kind }.
// `id` is what src/lib/art.js refers to; `set` is "new images" or "good stuff".
//
//   stamp   dark backdrop cut away so it works as a sticker on any colour
//           (`keepBackdrop: true` for a stamp whose own body is black)
//   receipt trimmed to the paper
//   poster  resized to 640px wide (900 when `big`) and saved as WebP
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.error('This script needs sharp:  npm i --no-save sharp');
  process.exit(1);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dirs = {
  'new images': process.env.ART_NEW || path.join(root, 'new images'),
  'good stuff': process.env.ART_GOOD,
};
if (!dirs['good stuff']) {
  console.error('Set ART_GOOD to the "good stuff" folder.');
  process.exit(1);
}
const picks = JSON.parse(
  fs.readFileSync(path.join(root, 'scripts/art-picks.json'), 'utf8'),
);
const out = path.join(root, 'public/art');
fs.mkdirSync(out, { recursive: true });

// Make a dark backdrop transparent: flood from the borders through near-black
// pixels, then keep only the biggest opaque island (drops caption specks).
// Returns null when the image does not sit on a dark backdrop.
async function cutout(png) {
  const { data, info } = await sharp(png)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const lum = (i) =>
    0.2126 * data[i * 4] + 0.7152 * data[i * 4 + 1] + 0.0722 * data[i * 4 + 2];
  const corners = [0, W - 1, (H - 1) * W, H * W - 1].map(lum);
  if (Math.max(...corners) > 40) return null;
  const bg = new Uint8Array(W * H);
  const queue = [];
  const push = (i) => {
    if (!bg[i] && lum(i) < 46) {
      bg[i] = 1;
      queue.push(i);
    }
  };
  for (let x = 0; x < W; x++) (push(x), push((H - 1) * W + x));
  for (let y = 0; y < H; y++) (push(y * W), push(y * W + W - 1));
  while (queue.length) {
    const i = queue.pop();
    const x = i % W;
    const y = (i / W) | 0;
    if (x > 0) push(i - 1);
    if (x < W - 1) push(i + 1);
    if (y > 0) push(i - W);
    if (y < H - 1) push(i + W);
  }
  const label = new Int32Array(W * H);
  let best = 0;
  let bestSize = 0;
  let n = 0;
  for (let start = 0; start < W * H; start++) {
    if (bg[start] || label[start]) continue;
    n++;
    let size = 0;
    const stack = [start];
    label[start] = n;
    while (stack.length) {
      const i = stack.pop();
      size++;
      const x = i % W;
      const y = (i / W) | 0;
      for (const j of [
        x > 0 ? i - 1 : -1,
        x < W - 1 ? i + 1 : -1,
        y > 0 ? i - W : -1,
        y < H - 1 ? i + W : -1,
      ]) {
        if (j >= 0 && !bg[j] && !label[j]) {
          label[j] = n;
          stack.push(j);
        }
      }
    }
    if (size > bestSize) ((bestSize = size), (best = n));
  }
  for (let i = 0; i < W * H; i++)
    if (bg[i] || label[i] !== best) data[i * 4 + 3] = 0;
  return sharp(data, { raw: { width: W, height: H, channels: 4 } })
    .trim({ threshold: 1 })
    .webp({ quality: 82, alphaQuality: 95, effort: 5 })
    .toBuffer({ resolveWithObject: true });
}

const meta = {};
let bytes = 0;
for (const pick of picks) {
  const file = path.join(dirs[pick.set], pick.file);
  try {
    let image = sharp(file, { failOn: 'none' }).rotate();
    const trim = pick.kind === 'stamp' || pick.kind === 'receipt';
    if (trim) image = sharp(await image.toBuffer()).trim({ threshold: 18 });
    const width = trim ? 560 : pick.big ? 900 : 640;
    const resize = trim
      ? { width }
      : { width, height: Math.round(width * 1.55) };
    let { data, info } = await sharp(await image.toBuffer())
      .resize({ ...resize, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: pick.big ? 76 : 70, effort: 5 })
      .toBuffer({ resolveWithObject: true });
    let alpha = 0;
    if (pick.kind === 'stamp' && !pick.keepBackdrop) {
      const cut = await cutout(await sharp(data).png().toBuffer());
      if (cut) (({ data, info } = cut), (alpha = 1));
    }
    fs.writeFileSync(path.join(out, pick.id + '.webp'), data);
    bytes += data.length;
    const stats = await sharp(data).stats();
    const [r, g, b] = stats.channels.map((c) => Math.round(c.mean));
    meta[pick.id] = {
      w: info.width,
      h: info.height,
      c: '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join(''),
      l: Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b),
      k: pick.kind,
      a: alpha,
    };
  } catch (error) {
    console.warn('skipped', pick.id, pick.file, '-', error.message);
  }
}
fs.writeFileSync(
  path.join(root, 'src/lib/art-meta.json'),
  JSON.stringify(meta, null, 2) + '\n',
);
console.log(
  `${Object.keys(meta).length} images, ${(bytes / 1e6).toFixed(1)} MB → public/art`,
);
