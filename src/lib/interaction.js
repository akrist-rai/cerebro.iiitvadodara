// Small, self-cleaning interaction helpers. Everything decorative bails out
// for reduced motion and coarse pointers; none of it hides content.
import { scrambler } from './ascii.js';

export const reducedMotion = () =>
  typeof matchMedia === 'function' &&
  matchMedia('(prefers-reduced-motion: reduce)').matches;

const finePointer = () =>
  typeof matchMedia === 'function' &&
  matchMedia('(hover: hover) and (pointer: fine)').matches;

// Fade a block in once as it scrolls into view.
export function reveal(node) {
  if (reducedMotion() || !('IntersectionObserver' in window)) return;
  node.classList.add('will-reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        node.classList.add('revealed');
        observer.disconnect();
      }
    },
    { threshold: 0.06 },
  );
  observer.observe(node);
  return { destroy: () => observer.disconnect() };
}

// Type that decodes out of noise. Runs once when scrolled to, or, with
// `hover`, whenever the pointer enters the element.
export function decode(node, { hover = false, duration = 700 } = {}) {
  if (reducedMotion()) return;
  const final = node.textContent;
  if (!final.trim()) return;
  let frame = 0;
  let live = true;
  const run = () => {
    cancelAnimationFrame(frame);
    const frameFn = scrambler(final, final.length);
    const start = performance.now();
    const tick = (now) => {
      if (!live) return;
      const p = Math.min(1, (now - start) / duration);
      node.textContent = p >= 1 ? final : frameFn(p);
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
  };
  let observer;
  if (hover) {
    node.addEventListener('pointerenter', run);
  } else if ('IntersectionObserver' in window) {
    node.textContent = scrambler(final, final.length)(0);
    observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        observer.disconnect();
        run();
      }
    });
    observer.observe(node);
  }
  return {
    destroy() {
      live = false;
      cancelAnimationFrame(frame);
      observer?.disconnect();
      node.removeEventListener('pointerenter', run);
      node.textContent = final;
    },
  };
}

// A short-lived scatter of characters behind the pointer.
export function asciiTrail() {
  if (!finePointer() || reducedMotion()) return () => {};
  const chars = '01<>/{}[]#$%*+=~';
  let last = null;
  let n = 0;
  const live = new Set();
  function move(e) {
    if (e.target.closest?.('dialog, input, select, textarea')) return;
    if (last && Math.hypot(e.clientX - last.x, e.clientY - last.y) < 34) return;
    last = { x: e.clientX, y: e.clientY };
    const el = document.createElement('span');
    el.className = 'trail';
    el.setAttribute('aria-hidden', 'true');
    el.textContent = chars[n++ % chars.length];
    el.style.left = e.clientX + 'px';
    el.style.top = e.clientY + 'px';
    el.style.setProperty('--dx', (Math.random() * 30 - 15).toFixed(0) + 'px');
    document.body.append(el);
    live.add(el);
    if (live.size > 18) {
      const old = live.values().next().value;
      old.remove();
      live.delete(old);
    }
    el.addEventListener(
      'animationend',
      () => {
        el.remove();
        live.delete(el);
      },
      { once: true },
    );
  }
  window.addEventListener('pointermove', move, { passive: true });
  return () => {
    window.removeEventListener('pointermove', move);
    live.forEach((el) => el.remove());
    live.clear();
  };
}

// Run `draw(seconds)` at ~`fps` while `node` is on screen and `active()`.
export function ticker(node, draw, { fps = 14, active = () => true } = {}) {
  if (reducedMotion() || !('IntersectionObserver' in window)) return () => {};
  let raf = 0;
  let visible = false;
  let last = 0;
  const t0 = performance.now();
  const loop = (now) => {
    raf =
      visible && active() && !document.hidden ? requestAnimationFrame(loop) : 0;
    if (now - last < 1000 / fps) return;
    last = now;
    draw((now - t0) / 1000);
  };
  const kick = () => {
    if (!raf && visible) raf = requestAnimationFrame(loop);
  };
  const io = new IntersectionObserver((entries) => {
    visible = entries.some((e) => e.isIntersecting);
    kick();
  });
  io.observe(node);
  return Object.assign(
    () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    },
    { kick },
  );
}

// Thermal-printer reveal: the image is struck in top to bottom, in steps,
// as it scrolls into view. Without motion (or JS) it is simply there.
// The *parent* is what gets observed: a clip-path on the target itself makes
// IntersectionObserver treat it as fully clipped, so it would never fire.
export function print(node, enabled = true) {
  if (!enabled || reducedMotion() || !('IntersectionObserver' in window))
    return;
  const watch = node.parentElement || node;
  node.classList.add('will-print');
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        node.classList.add('printed');
        observer.disconnect();
      }
    },
    { threshold: 0.1 },
  );
  observer.observe(watch);
  return { destroy: () => observer.disconnect() };
}
