<script>
  import { onMount } from 'svelte';
  import { EVENT } from './content.js';
  import { gsap, ScrollTrigger } from './motion.js';
  import { reducedMotion } from './fx.js';

  // The sign-off: the tagline running past, a black box to act on between
  // each pass. It drifts on its own and leans into the page's scroll.
  let track;

  onMount(() => {
    if (reducedMotion()) return;
    const half = () => track.scrollWidth / 2;
    const loop = gsap.to(track, { x: () => -half(), duration: 28, ease: 'none', repeat: -1 });
    let boost = 1;
    const st = ScrollTrigger.create({
      trigger: track,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        // Scrolling up runs it backwards; faster scrolling runs it faster.
        const v = self.getVelocity();
        boost = Math.max(1, Math.min(6, Math.abs(v) / 300));
        loop.timeScale(v < 0 ? -boost : boost);
        gsap.to(loop, { timeScale: v < 0 ? -1 : 1, duration: 1.2, ease: 'power2.out', overwrite: true });
      },
    });
    return () => {
      st.kill();
      loop.kill();
    };
  });
</script>

<div class="marquee">
  <div class="track" bind:this={track}>
    {#each [0, 1] as half}
      <div class="run" aria-hidden={half ? 'true' : undefined}>
        {#each [0, 1, 2] as _}
          <span class="light words">{EVENT.tagline}</span>
          <a class="btn big" href="#sponsor" tabindex={half ? -1 : undefined}>Sponsor us</a>
        {/each}
      </div>
    {/each}
  </div>
</div>

<style>
  .marquee {
    margin: clamp(72px, 9vw, 140px) var(--gutter) 0;
    padding: clamp(12px, 1.4vw, 22px) 0;
    overflow: hidden;
    border-top: 1px solid var(--ink);
    border-bottom: 1px solid var(--ink);
  }

  .track {
    display: flex;
    width: max-content;
  }

  .run {
    display: flex;
    align-items: center;
    gap: 0.4em;
    padding-right: 0.4em;
    font-size: clamp(56px, 7vw, 130px);
    white-space: nowrap;
  }

  .words {
    font-weight: 400;
    line-height: 1;
  }

  .btn {
    padding: 0.08em 0.16em 0;
    font-size: 0.86em;
    font-weight: 800;
    line-height: 0.92;
  }
</style>
