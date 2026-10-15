<script>
  import Growth from './Growth.svelte';
  import Marked from './Marked.svelte';
  import { CEREBRO, GROWTH, EVENTS, TIERS } from './content.js';
  import { lines, rise, count, draw } from './motion.js';

  const first = GROWTH[0];
  const last = GROWTH[GROWTH.length - 1];
  const fmt = (n) => n.toLocaleString('en-US');
  const growth = last.n / first.n;

  // A row of figures, each with its label stacked beside it.
  const FIGS = [
    { a: 'Participants', b: last.year, v: fmt(last.n), to: last.n },
    { a: 'Growth since', b: first.year, v: `${growth.toFixed(1)}×`, to: growth, decimals: 1, suffix: '×' },
    { a: 'Inter-college', b: 'events', v: EVENTS.length, to: EVENTS.length },
    { a: 'Sponsorship', b: 'tiers', v: TIERS.length, to: TIERS.length },
  ];
</script>

<section class="block" id="cerebro">
  <i class="hair" use:draw></i>
  <div class="figs">
    {#each FIGS as f}
      <div class="fig">
        <span class="lbl">{f.a}<br />{f.b}</span>
        <b class="big"><span class="sr">{f.v}</span><span aria-hidden="true" use:count={{ to: f.to, decimals: f.decimals, suffix: f.suffix }}>{f.v}</span></b>
      </div>
    {/each}
  </div>
  <i class="hair" use:draw={{ delay: 0.1 }}></i>

  <div class="split">
    <div>
      <h2 class="big title" use:lines>The fest!</h2>
      <p class="light deck" use:rise>{fmt(first.n)} participants in {first.year}; {fmt(last.n)} in {last.year}.</p>
      <p class="cap copy" use:rise={{ delay: 0.1 }}><Marked text={CEREBRO} /></p>
    </div>
    <div use:rise={{ delay: 0.15 }}><Growth /></div>
  </div>
</section>

<style>
  .figs {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .fig {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14px;
    padding: 18px 10px 14px;
  }

  .fig + .fig {
    border-left: 1px solid var(--ink);
  }

  .lbl {
    font-size: clamp(16px, 1.3vw, 22px);
    line-height: 1;
    text-align: right;
    text-transform: uppercase;
  }

  .fig b {
    font-size: clamp(64px, 7vw, 132px);
    line-height: 0.8;
  }

  .split {
    display: grid;
    grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
    gap: clamp(28px, 5vw, 80px);
    align-items: end;
    margin-top: clamp(56px, 7vw, 110px);
  }

  .title {
    margin: 0;
    font-size: clamp(72px, 10vw, 190px);
  }

  .deck {
    margin: 14px 0 0;
    font-size: clamp(26px, 2.4vw, 42px);
  }

  .copy {
    margin: 24px 0 0;
    max-width: 44ch;
    font-size: clamp(20px, 1.6vw, 25px);
    line-height: 1.16;
  }

  .copy :global(b) {
    font-weight: 700;
  }

  @media (max-width: 960px) {
    .figs {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .fig:nth-child(3) {
      border-left: none;
    }
    .fig:nth-child(-n + 2) {
      border-bottom: 1px solid var(--ink);
    }
    .split {
      grid-template-columns: minmax(0, 1fr);
    }
  }
</style>
