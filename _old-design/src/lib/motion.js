// Scroll and reveal motion. Lenis smooths the wheel; GSAP's ScrollTrigger
// plays each reveal once as it comes into view; SplitText sets headlines in
// line by line, like type being pressed.
//
// None of it runs for anyone who asked for reduced motion: every action
// below returns early and the page is complete without it.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { reducedMotion } from './fx.js';

gsap.registerPlugin(ScrollTrigger, SplitText);

const START = 'top 88%';
// Entrances marked `now` wait for the spin-in intro when it's running.
const INTRO = 1.5;
const wait = (now) => (now && document.documentElement.classList.contains('intro') ? INTRO : 0);
let lenis = null;

// Scroll to a section by id ('top' is the front page), then hand it focus so
// the next Tab continues from there, as a native anchor jump would. Both
// paths honour the CSS scroll-padding-top, so sections land under the bar.
export function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el);
  else el.scrollIntoView({ block: 'start' });
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
  history.replaceState(null, '', `#${id}`);
}

// Smooth scrolling, wired into ScrollTrigger. Returns a teardown.
export function startScroll() {
  if (reducedMotion()) return () => {};

  lenis = new Lenis({ lerp: 0.11 });
  lenis.on('scroll', ScrollTrigger.update);
  const tick = (t) => lenis.raf(t * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  // In-page links glide instead of jumping.
  const onClick = (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest?.('a[href^="#"]');
    const id = a?.getAttribute('href').slice(1);
    if (!id || !document.getElementById(id)) return;
    e.preventDefault();
    scrollToId(id);
  };
  document.addEventListener('click', onClick);

  // ASCII scenes draw lazily and the event filter reflows the page, so
  // every trigger's position goes stale; re-measure once things settle.
  let t;
  const ro = new ResizeObserver(() => {
    clearTimeout(t);
    t = setTimeout(() => ScrollTrigger.refresh(), 200);
  });
  ro.observe(document.body);

  return () => {
    ro.disconnect();
    clearTimeout(t);
    document.removeEventListener('click', onClick);
    gsap.ticker.remove(tick);
    lenis.destroy();
    lenis = null;
  };
}

const once = (trigger, start = START) => ({ trigger, start, once: true });

function kill(tw) {
  tw.scrollTrigger?.kill();
  tw.kill();
}

// Svelte actions. Each is a no-op under reduced motion.

// A headline set in line by line from below its own baseline.
export function lines(node, { delay = 0, start = START, now = false } = {}) {
  if (reducedMotion()) return;
  const split = SplitText.create(node, {
    type: 'lines',
    mask: 'lines',
    linesClass: 'line',
    autoSplit: true,
    // Returning the tween lets SplitText re-sync it when fonts land or the
    // column reflows and the lines are re-cut.
    onSplit: (self) =>
      gsap.from(self.lines, {
        yPercent: 115,
        duration: 1.15,
        ease: 'expo.out',
        stagger: 0.09,
        delay: delay + wait(now),
        scrollTrigger: now ? undefined : once(node, start),
      }),
  });
  return { destroy: () => split.revert() };
}

// A block (or, with `each`, its children in turn) rises into place.
export function rise(node, { y = 26, delay = 0, each = 0, start = START, now = false } = {}) {
  if (reducedMotion()) return;
  const tw = gsap.from(each ? [...node.children] : node, {
    y,
    autoAlpha: 0,
    duration: 0.95,
    ease: 'power3.out',
    delay: delay + wait(now),
    stagger: each,
    scrollTrigger: now ? undefined : once(node, start),
  });
  return { destroy: () => kill(tw) };
}

// A rule drawn across from the left.
export function draw(node, { delay = 0, start = START, now = false } = {}) {
  if (reducedMotion()) return;
  const tw = gsap.from(node, {
    scaleX: 0,
    duration: 1.3,
    ease: 'expo.out',
    delay: delay + wait(now),
    scrollTrigger: now ? undefined : once(node, start),
  });
  return { destroy: () => kill(tw) };
}

// A block printed top to bottom, the way a press rolls ink down the page.
// `dir: 'x'` wipes left to right instead (the masthead).
export function press(node, { delay = 0, dir = 'y', start = START, now = false } = {}) {
  if (reducedMotion()) return;
  const hidden = dir === 'x' ? 'inset(0% 100% 0% 0%)' : 'inset(0% 0% 100% 0%)';
  const tw = gsap.fromTo(
    node,
    { clipPath: hidden },
    {
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: dir === 'x' ? 1.5 : 1.3,
      ease: 'expo.inOut',
      delay: delay + wait(now),
      clearProps: 'clipPath',
      scrollTrigger: now ? undefined : once(node, start),
    }
  );
  return { destroy: () => kill(tw) };
}

// Hold the page still under an overlay (the menu), and let it go again.
export function lockScroll(on) {
  if (lenis) on ? lenis.stop() : lenis.start();
  document.documentElement.style.overflow = on ? 'hidden' : '';
}

// A figure that counts up from zero the first time it's seen. The real
// value is in the markup; this only animates what's shown.
export function count(node, { to, decimals = 0, suffix = '' } = {}) {
  if (reducedMotion()) return;
  const fmt = (v) => v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
  const o = { v: 0 };
  node.textContent = fmt(0);
  const tw = gsap.to(o, {
    v: to,
    duration: 1.8,
    ease: 'power3.out',
    onUpdate: () => (node.textContent = fmt(o.v)),
    scrollTrigger: once(node, 'top 92%'),
  });
  return { destroy: () => kill(tw) };
}

// Drift against the scroll: the node travels `y` px across its trigger's
// time on screen, and can ease in from a little larger (`scale`).
export function parallax(node, { y = 80, scale = 1, trigger } = {}) {
  if (reducedMotion()) return;
  const tw = gsap.fromTo(
    node,
    { y: -y / 2, scale },
    { y: y / 2, scale: 1, ease: 'none', scrollTrigger: { trigger: trigger ?? node.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }
  );
  return { destroy: () => kill(tw) };
}

export { gsap, ScrollTrigger };
