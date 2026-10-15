<script>
  import { tick } from 'svelte';
  import { EVENT, SECTIONS, CONTACT } from './content.js';
  import { gsap, lockScroll, scrollToId } from './motion.js';
  import { reducedMotion } from './fx.js';

  // The index: a black sheet drops over the page and the sections stand up
  // in billboard type. The one you're reading is struck through in red.
  let { open = $bindable(false), active = 'top' } = $props();

  let sheet = $state();
  let shown = $state(false);
  let opener = null;
  const desk = CONTACT.groups.flatMap((g) => g.people);

  // A torn edge: the sheet's border is a ragged line, redrawn as it travels,
  // so the black looks ripped across the page rather than wiped.
  const N = 56;
  const rag = Array.from({ length: N + 1 }, (_, i) => Math.sin(i * 1.9) * 1.1 + Math.sin(i * 0.53) * 1.6 + ((i * 7919) % 13) / 13 - 0.5);
  // Visible from the top down to p% (edge = 'bottom'), or from p% to the
  // bottom (edge = 'top').
  function torn(p, edge = 'bottom') {
    const line = rag.map((j, i) => `${((i / N) * 100).toFixed(2)}% ${(p + j * 1.4).toFixed(2)}%`);
    return edge === 'bottom'
      ? `polygon(0% -5%, 100% -5%, ${line.reverse().join(', ')})`
      : `polygon(${line.join(', ')}, 100% 105%, 0% 105%)`;
  }
  function tear(from, to, edge, duration, ease) {
    const o = { p: from };
    return gsap.to(o, { p: to, duration, ease, onUpdate: () => (sheet.style.clipPath = torn(o.p, edge)) });
  }

  $effect(() => {
    if (open && !shown) show();
    else if (!open && shown) hide();
  });

  async function show() {
    opener = document.activeElement;
    shown = true;
    lockScroll(true);
    await tick();
    sheet.querySelector('a')?.focus({ preventScroll: true });
    if (reducedMotion()) return;
    sheet.style.clipPath = torn(-6);
    gsap
      .timeline()
      .add(tear(-6, 108, 'bottom', 0.85, 'expo.inOut'))
      .add(() => (sheet.style.clipPath = ''))
      .from(sheet.querySelectorAll('.go span'), { yPercent: 110, duration: 0.9, ease: 'expo.out', stagger: 0.06 }, '-=0.3')
      .fromTo(sheet.querySelectorAll('.go.on i'), { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'expo.out', clearProps: 'transform' }, '-=0.5')
      .from(sheet.querySelectorAll('.foot, .top'), { autoAlpha: 0, duration: 0.5 }, '-=0.6');
  }

  function hide(then) {
    const done = () => {
      shown = false;
      lockScroll(false);
      if (then) then();
      else opener?.focus?.({ preventScroll: true });
    };
    if (reducedMotion()) return done();
    gsap
      .timeline({ onComplete: done })
      .to(sheet.querySelectorAll('.go span'), { yPercent: -110, duration: 0.45, ease: 'expo.in', stagger: 0.03 })
      .add(tear(-6, 108, 'top', 0.7, 'expo.inOut'), '-=0.15');
  }

  function go(e, id) {
    e.preventDefault();
    open = false;
    shown && hide(() => scrollToId(id));
  }

  function onKey(e) {
    if (!shown) return;
    if (e.key === 'Escape') open = false;
    // Keep Tab inside the sheet while it's up.
    if (e.key === 'Tab') {
      const f = [...sheet.querySelectorAll('a, button')];
      const i = f.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) (e.preventDefault(), f[f.length - 1].focus());
      else if (!e.shiftKey && i === f.length - 1) (e.preventDefault(), f[0].focus());
    }
  }
</script>

<svelte:window onkeydown={onKey} />

{#if shown}
  <div class="sheet" id="menu" role="dialog" aria-modal="true" aria-label="Menu" bind:this={sheet}>
    <div class="top">
      <span class="masthead">Cerebro {EVENT.year}</span>
      <button class="x" type="button" aria-label="Close menu" onclick={() => (open = false)}>
        <i></i><i></i>
      </button>
    </div>

    <nav aria-label="Sections">
      <a class="go" class:on={active === 'top'} href="#top" onclick={(e) => go(e, 'top')}><span class="big">Front page</span><i></i></a>
      {#each SECTIONS as s}
        <a class="go" class:on={active === s.id} href="#{s.id}" aria-current={active === s.id ? 'location' : undefined} onclick={(e) => go(e, s.id)}>
          <span class="big">{s.label}</span><i></i>
        </a>
      {/each}
    </nav>

    <div class="foot">
      {#each desk as p, i}{#if i}<b aria-hidden="true">•</b>{/if}<span class="person">{p.name}</span>{/each}
    </div>
  </div>
{/if}

<style>
  .sheet {
    position: fixed;
    inset: 0;
    z-index: 80;
    display: grid;
    grid-template-rows: var(--bar) 1fr auto;
    background: var(--ink);
    color: var(--paper);
  }

  .top {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    padding: 0 var(--gutter);
  }

  .top .masthead {
    grid-column: 2;
    font-size: 30px;
  }

  .x {
    justify-self: end;
    position: relative;
    width: 44px;
    height: 44px;
    padding: 0;
    border: none;
    background: none;
  }

  .x i {
    position: absolute;
    left: 8px;
    top: 21px;
    width: 28px;
    height: 2px;
    background: var(--paper);
    transform: rotate(45deg);
  }

  .x i + i {
    transform: rotate(-45deg);
  }

  nav {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.04em;
    font-size: clamp(54px, 10.4vh, 132px);
  }

  .go {
    position: relative;
    display: block;
    overflow: hidden;
    padding: 0.04em 0.06em 0;
    text-decoration: none;
    line-height: 0.92;
  }

  .go span {
    display: block;
    transition: color 0.2s;
  }

  .go:hover span {
    color: var(--paper-hi);
  }

  /* The strike: a red rule through the middle of the word. */
  .go i {
    position: absolute;
    left: -0.04em;
    right: -0.04em;
    top: 44%;
    height: 0.07em;
    background: var(--red);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.45s var(--ease);
  }

  .go.on i,
  .go:hover i {
    transform: scaleX(1);
  }

  .foot {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 6px 14px;
    padding: 18px var(--gutter) 26px;
    font-size: 15px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .person {
    opacity: 0.8;
  }
</style>
