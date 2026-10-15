<script>
  import { EVENT, EVENTS, GROWTH } from './content.js';
  import { lines, rise } from './motion.js';

  // The tagline as a page of type: each word as big as its line allows,
  // stepped across the grid, the middle one reversed out of a black block.
  const [w1, w2, w3] = EVENT.tagline.split(' ');
  const last = GROWTH[GROWTH.length - 1];
</script>

<section class="collage" aria-label={EVENT.tagline}>
  <p class="big w a" aria-hidden="true" use:lines>{w1}</p>
  <p class="note n1" use:rise>{EVENTS.length} inter-college events, from robot races to a capture-the-flag.</p>

  <div class="blk" aria-hidden="true"><span class="big w" use:lines>{w2}</span></div>
  <p class="note n2" use:rise>{last.n.toLocaleString('en-US')} participants in {last.year}, from across India.</p>

  <p class="big w c" aria-hidden="true" use:lines>{w3}.</p>
</section>

<style>
  .collage {
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    gap: clamp(16px, 2vw, 30px);
    align-items: end;
    padding: clamp(72px, 9vw, 140px) var(--gutter) 0;
  }

  .w {
    margin: 0;
    font-size: clamp(96px, 19vw, 370px);
    line-height: 0.8;
    white-space: nowrap;
  }

  .a {
    grid-column: 1 / span 9;
  }

  .note {
    margin: 0;
    padding-top: 12px;
    border-top: 1px solid var(--ink);
    font-size: clamp(22px, 1.9vw, 32px);
    font-weight: 300;
    line-height: 1.05;
  }

  .n1 {
    grid-column: 10 / span 3;
  }

  /* THE: reversed out of a black block that runs off the right edge. */
  .blk {
    grid-column: 5 / span 8;
    overflow: hidden;
    margin-right: calc(-1 * var(--gutter));
    padding: 0.04em 0 0 0.1em;
    background: var(--ink);
    color: var(--paper);
    font-size: clamp(96px, 19vw, 370px);
  }

  .blk .w {
    display: block;
    padding-top: 0.06em;
    font-size: 1em;
    color: var(--paper);
  }

  .n2 {
    grid-column: 1 / span 4;
    grid-row: 2;
  }

  .c {
    grid-column: 1 / -1;
    text-align: right;
    color: var(--red);
  }

  @media (max-width: 900px) {
    .a,
    .n1,
    .blk,
    .n2,
    .c {
      grid-column: 1 / -1;
      grid-row: auto;
      text-align: left;
    }
    .w,
    .blk {
      font-size: 27vw;
    }
  }
</style>
