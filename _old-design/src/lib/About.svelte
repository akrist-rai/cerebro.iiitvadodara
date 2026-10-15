<script>
  import Marked from './Marked.svelte';
  import { ABOUT, EVENT, EVENTS, TRACKS } from './content.js';
  import { lines, rise } from './motion.js';

  // The introduction: a plate and a paragraph under it on the left, and on
  // the right what Cerebro is, in four billboard lines.
  const HEAD = ['National-level', 'hybrid tech fest', `by ${EVENT.institute}.`, `${EVENTS.length} events, ${TRACKS.length} tracks.`];

  const FACTS = [
    ['Founded', '2013, by MHRD'],
    ['Status', 'Institute of National Importance'],
    ['Campus', 'GEC Gandhinagar'],
    ['Organizes', 'Cerebro, every year'],
  ];
</script>

<section class="block" id="about">
  <div class="split">
    <div class="side">
      <p class="cap copy" use:rise><Marked text={ABOUT} /></p>
    </div>

    <div class="main">
      <h2 class="big head" use:lines>
        {#each HEAD as l}<span>{l}</span>{/each}
      </h2>
      <dl class="facts" use:rise={{ each: 0.08 }}>
        {#each FACTS as [k, v]}
          <div><dt>{k}</dt><dd>{v}</dd></div>
        {/each}
      </dl>
    </div>
  </div>
</section>

<style>
  .split {
    display: grid;
    grid-template-columns: minmax(0, 4fr) minmax(0, 8fr);
    gap: clamp(28px, 4vw, 72px);
    align-items: start;
  }

  .copy {
    margin: 0;
    font-size: clamp(20px, 1.6vw, 25px);
    line-height: 1.16;
  }

  .copy :global(b) {
    font-weight: 700;
  }

  .head {
    margin: 0;
    font-size: clamp(54px, 8.2vw, 158px);
    line-height: 0.88;
  }

  .head span {
    display: block;
  }

  .facts {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    margin: clamp(30px, 4vw, 56px) 0 0;
    border-top: 1px solid var(--ink);
  }

  .facts div {
    padding: 14px 16px 0 0;
  }

  .facts div + div {
    padding-left: 16px;
    border-left: 1px solid var(--ink);
  }

  dt {
    font-size: 15px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--dim);
  }

  dd {
    margin: 4px 0 0;
    font-size: clamp(20px, 1.7vw, 26px);
    font-weight: 700;
    line-height: 1.05;
  }

  @media (max-width: 900px) {
    .split {
      grid-template-columns: minmax(0, 1fr);
    }
    .main {
      order: -1;
    }
    .facts {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .facts div:nth-child(3) {
      padding-left: 0;
      border-left: none;
    }
  }
</style>
