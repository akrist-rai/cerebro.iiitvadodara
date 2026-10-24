<script>
  import { onMount } from 'svelte';
  import Icon from './Icon.svelte';
  import { bigText, bigTextHTML } from './ascii.js';
  import Barcode from './Barcode.svelte';
  import Art from './Art.svelte';
  import { ticker, reducedMotion } from './interaction.js';
  import { FACTS } from './content.js';
  import { FEST_DETAILS } from './event-details.js';
  import { competitions, dateLabel } from './events.js';

  const WORD = 'CEREBRO’26';
  const FIELD = ' ··:;+=*#';
  const MILESTONES = [
    ['The online window opens', '2026-10-26T00:00:00+05:30'],
    ['The offline finals begin', '2026-10-31T09:00:00+05:30'],
    ['The final bell', '2026-11-01T18:00:00+05:30'],
  ];

  let host = $state();
  let pre = $state();
  let wm = $state();
  let now = $state(Date.now());
  let stop;

  // field geometry, set by layout()
  let cols = 0;
  let rows = 0;
  let art = null;
  let wmX = 0;
  let wmY = 0;
  let px = -1;
  let py = -1;

  const next = $derived(MILESTONES.find(([, iso]) => Date.parse(iso) > now));
  const left = $derived(next ? Math.max(0, Date.parse(next[1]) - now) : 0);
  const parts = $derived.by(() => {
    const s = Math.floor(left / 1000);
    const two = (n) => String(n).padStart(2, '0');
    return [
      two(Math.floor(s / 86400)),
      two(Math.floor((s % 86400) / 3600)),
      two(Math.floor((s % 3600) / 60)),
      two(s % 60),
    ];
  });
  const clockArt = $derived(
    bigTextHTML(bigText(parts.join(':'), { kx: 1, ky: 1, shadow: false })),
  );
  const clockLabel = $derived(
    `${Number(parts[0])} days, ${Number(parts[1])} hours, ${Number(parts[2])} minutes`,
  );
  // the plates printed under the ASCII field, and the stack beside the clock
  const BACK = ['n21', 'g8', 'n1', 'g15', 'n25', 'g199', 'n27', 'g101', 'n19'];
  const STACK = [
    {
      id: 'g33',
      pos: '50% 18%',
      style: 'left:0;top:14%;width:47%;--rot:-6deg;z-index:1',
    },
    {
      id: 'n21',
      pos: '50% 40%',
      style: 'right:0;top:0;width:46%;--rot:7deg;z-index:1',
    },
    {
      id: 'g192',
      pos: '50% 22%',
      style: 'left:25%;top:26%;width:50%;--rot:2deg;z-index:2',
    },
  ];
  const STAMPS = [
    { id: 'n13', style: 'right:20%;top:-6%;width:132px;--rot:-9deg' },
    { id: 'n24', style: 'right:0;top:4%;width:148px;--rot:6deg' },
    { id: 'n32', style: 'right:30%;top:40%;width:128px;--rot:5deg' },
    { id: 'n3', style: 'right:2%;top:50%;width:176px;--rot:-4deg' },
  ];
  const venue = FEST_DETAILS.location;
  const span = `${dateLabel(FEST_DETAILS.startDate + 'T00:00:00+05:30', { year: undefined })} – ${dateLabel(FEST_DETAILS.endDate + 'T00:00:00+05:30')}`;

  function layout() {
    if (!host || !pre) return;
    const w = host.clientWidth;
    const h = host.clientHeight;
    const fs = Math.max(7.5, Math.min(11, w / 128));
    pre.style.fontSize = fs + 'px';
    cols = Math.floor(w / (fs * 0.6));
    rows = Math.floor(h / (fs * 1.2));
    let pick = null;
    for (const k of [1, 2, 3, 4, 6, 8]) {
      const a = bigText(WORD, { kx: k, ky: Math.max(1, Math.round(k / 2)) });
      if (a.w <= cols * 0.94 && a.h <= rows - 2) pick = a;
    }
    art = pick || bigText(WORD, { kx: 1, ky: 1 });
    wmX = Math.max(0, Math.floor((cols - art.w) / 2));
    wmY = Math.max(0, Math.floor((rows - art.h) / 2));
    wm.innerHTML = bigTextHTML(art);
    wm.style.left = wmX * fs * 0.6 + 'px';
    wm.style.top = wmY * fs * 1.2 + 'px';
    wm.style.fontSize = fs + 'px';
    frame(0.8);
  }

  function frame(t) {
    if (!pre || !cols) return;
    const out = new Array(rows);
    for (let y = 0; y < rows; y++) {
      let row = '';
      for (let x = 0; x < cols; x++) row += cell(x, y, t);
      out[y] = row;
    }
    pre.textContent = out.join('\n');
  }

  function cell(x, y, t) {
    let v =
      0.5 +
      0.5 *
        Math.sin(x * 0.065 + Math.sin(y * 0.16 + t * 0.55) * 1.7 + t * 0.45) *
        Math.cos(y * 0.21 - t * 0.35 + x * 0.015);
    v = v * v * 0.95;
    if (px >= 0) {
      const dx = x - px;
      const dy = (y - py) * 2;
      const d2 = dx * dx + dy * dy;
      v +=
        Math.exp(-d2 / 150) *
        (0.55 + 0.45 * Math.sin(Math.sqrt(d2) * 0.7 - t * 7));
    }
    return FIELD[Math.min(FIELD.length - 1, Math.floor(v * FIELD.length))];
  }

  function point(e) {
    const r = host.getBoundingClientRect();
    const fs = parseFloat(pre.style.fontSize) || 10;
    px = (e.clientX - r.left) / (fs * 0.6);
    py = (e.clientY - r.top) / (fs * 1.2);
    if (reducedMotion()) frame(0.8);
  }
  function leave() {
    px = py = -1;
    if (reducedMotion()) frame(0.8);
  }

  onMount(() => {
    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(host);
    document.fonts?.ready.then(layout);
    stop = ticker(host, frame, { fps: 18 });
    const clock = setInterval(() => (now = Date.now()), 1000);
    return () => {
      ro.disconnect();
      stop?.();
      clearInterval(clock);
    };
  });
</script>

<section class="hero" id="top" aria-labelledby="hero-title">
  <div class="status eyebrow">
    <span><i class="dot blink"></i> Live</span>
    <span class="hide-sm">Technical Committee · IIIT Vadodara</span>
    <span>{span}</span>
  </div>

  <div
    class="field"
    bind:this={host}
    onpointermove={point}
    onpointerleave={leave}
    role="presentation"
  >
    <div class="back" aria-hidden="true">
      {#each BACK as id}<Art {id} tone="ink-gold" eager pos="50% 30%" />{/each}
    </div>
    <pre class="art fieldpre" bind:this={pre} aria-hidden="true"></pre>
    <pre class="art wm" bind:this={wm} aria-hidden="true"></pre>
  </div>
  <h1 id="hero-title" class="sr">Cerebro ’26 — Beyond the horizon</h1>

  <div class="grid">
    <div class="pitch">
      <div class="stickers" aria-hidden="true">
        {#each STAMPS as s}
          <span class="sticker" style={s.style}
            ><Art id={s.id} cut eager /></span
          >
        {/each}
      </div>
      <p class="eyebrow tag"><span class="cursor"></span> Beyond the horizon</p>
      <h2>
        15 events.<br />One fest.<br />
      </h2>
      <p class="copy">
        The annual technical festival of IIIT Vadodara. Code, robots, design,
        markets, maths, games and one detective hunt, played online from
        <b>26 to 30 October</b> and in person on
        <b>31 October and 1 November</b>.
      </p>
      <div class="actions">
        <a class="btn red" href="#events"
          >Browse events <Icon name="diagonal" size={16} /></a
        >
        <a class="btn" href="#schedule"
          >See the schedule <Icon name="arrow" size={16} /></a
        >
      </div>
    </div>

    <div class="side">
      <div class="stack" aria-hidden="true">
        {#each STACK as p, i}
          <figure class="print" style={p.style}>
            <Art id={p.id} pos={p.pos} ghost={i !== 2} dots={0.4} eager />
          </figure>
        {/each}
      </div>
      <aside class="receipt" aria-label="Countdown">
        <p class="eyebrow">T-minus</p>
        <p class="sr">
          {clockLabel} until {next ? next[0].toLowerCase() : 'the fest ends'}
        </p>
        {#if next}
          <pre class="art clock" aria-hidden="true">{@html clockArt}</pre>
          <p class="units" aria-hidden="true">
            <span>days</span><span>hrs</span><span>min</span><span>sec</span>
          </p>
          <p class="until">until {next[0].toLowerCase()}</p>
        {:else}
          <p class="until">Cerebro ’26 has wrapped. See you next year.</p>
        {/if}
        <p class="venue"><Icon name="pin" size={14} /> {venue}</p>
        <div class="code"><Barcode seed="cerebro-26" bars={26} /></div>
      </aside>
    </div>
  </div>

  
</section>

<style>
  .hero {
    padding: 0 var(--gutter) clamp(36px, 5vw, 64px);
  }
  .status {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    padding: 14px 0;
    border-bottom: 2px solid var(--ink);
    font-size: 10px;
  }
  .status .dot {
    color: var(--red);
  }
  .field {
    position: relative;
    height: clamp(300px, 54vh, 560px);
    overflow: hidden;
    border-bottom: 2px solid var(--ink);
    cursor: crosshair;
  }
  .back {
    position: absolute;
    inset: 0;
    display: flex;
    mix-blend-mode: multiply;
    opacity: 0.62;
  }
  .back :global(.art) {
    flex: 1 1 0;
    min-width: 0;
    height: 100%;
    aspect-ratio: auto;
    border-right: 2px solid var(--ink);
  }
  .fieldpre {
    position: absolute;
    inset: 0;
    color: color-mix(in srgb, var(--ink) 42%, transparent);
    overflow: hidden;
    padding-top: 0;
  }
  .wm {
    position: absolute;
    color: var(--red);
    --shade: var(--crimson);
    pointer-events: none;
  }
  .grid {
    display: grid;
    grid-template-columns: minmax(0, 1.35fr) minmax(280px, 0.65fr);
    gap: clamp(24px, 4vw, 64px);
    align-items: start;
    padding: clamp(28px, 4vw, 52px) 0;
  }
  .pitch {
    position: relative;
  }
  .stickers {
    position: absolute;
    inset: 0 0 0 auto;
    width: min(46%, 420px);
    pointer-events: none;
  }
  .sticker {
    position: absolute;
    transform: rotate(var(--rot));
    transition: transform 0.4s var(--ease);
  }
  @media (max-width: 1100px) {
    .stickers {
      display: none;
    }
  }
  .tag {
    color: var(--red);
    margin: 0 0 16px;
  }
  h2 {
    font-size: clamp(32px, 4.6vw, 68px);
    font-weight: 800;
    letter-spacing: -0.04em;
    line-height: 1;
    margin: 0 0 22px;
    text-transform: uppercase;
  }
  h2 em {
    font-style: normal;
    background: var(--ink);
    color: var(--gold);
    padding: 0 0.12em;
  }
  .copy {
    margin: 0 0 26px;
    max-width: 58ch;
  }
  .actions {
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
  }

  .side {
    position: relative;
    display: grid;
  }
  .stack {
    position: relative;
    height: clamp(250px, 25vw, 360px);
    margin-bottom: -46px;
  }
  /* a paper print, taped up: white margin, hard shadow, a bit of tilt */
  .print {
    position: absolute;
    margin: 0;
    padding: 6px 6px 22px;
    background: var(--paper-hi);
    border: 2px solid var(--ink);
    box-shadow: 5px 5px 0 var(--ink);
    transform: rotate(var(--rot));
    transition: transform 0.4s var(--ease);
  }
  .print::before {
    content: '';
    position: absolute;
    top: -11px;
    left: 50%;
    width: 64px;
    height: 20px;
    transform: translateX(-50%) rotate(-3deg);
    background: color-mix(in srgb, var(--gold) 82%, transparent);
    border: 1px solid color-mix(in srgb, var(--ink) 25%, transparent);
  }
  .print:hover {
    transform: rotate(0) scale(1.04);
    z-index: 4 !important;
  }
  .receipt {
    position: relative;
    z-index: 5;
    background: var(--paper-hi);
    padding: 20px 20px 34px;
    filter: drop-shadow(5px 5px 0 var(--ink));
    --z: 9px;
    -webkit-mask:
      conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg)
        50% / var(--z) 51% repeat-x bottom,
      linear-gradient(#000, #000) top / 100% 50.5% no-repeat;
    mask:
      conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg)
        50% / var(--z) 51% repeat-x bottom,
      linear-gradient(#000, #000) top / 100% 50.5% no-repeat;
  }
  .receipt .eyebrow {
    margin: 0 0 12px;
    border-bottom: 2px dashed var(--hair);
    padding-bottom: 10px;
  }
  .clock {
    font-size: min(calc(100cqw / (65 * 0.6)), 11px);
    color: var(--ink);
    margin: 4px 0 6px;
  }
  .receipt {
    container-type: inline-size;
  }
  .units {
    display: flex;
    justify-content: space-between;
    font-family: var(--pixel);
    font-size: 9px;
    text-transform: uppercase;
    color: var(--dim);
    margin: 0 0 14px;
    padding: 0 2px;
  }
  .until {
    margin: 0 0 12px;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 12px;
  }
  .venue {
    display: flex;
    gap: 8px;
    align-items: center;
    font-size: 12px;
    color: var(--dim);
    margin: 0 0 14px;
  }
  .code {
    color: var(--ink);
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    border: 2px solid var(--ink);
    margin: 0;
  }
  .stats > div {
    padding: 14px 16px;
    border-right: 2px solid var(--ink);
  }
  .stats > div:last-child {
    border-right: 0;
  }
  .stats dt {
    font-family: var(--pixel);
    font-size: 10px;
    text-transform: uppercase;
    color: var(--dim);
    letter-spacing: 0.06em;
  }
  .stats dd {
    margin: 4px 0 0;
    font-size: clamp(26px, 3.6vw, 48px);
    font-weight: 800;
    letter-spacing: -0.04em;
    line-height: 1;
  }

  @media (max-width: 900px) {
    .grid {
      grid-template-columns: 1fr;
    }
    .receipt {
      max-width: 420px;
    }
  }
  @media (max-width: 640px) {
    /* fewer, fainter plates under a wordmark that is set much smaller */
    .back {
      opacity: 0.4;
    }
    .back :global(.art:nth-child(n + 5)) {
      display: none;
    }
    .hide-sm {
      display: none;
    }
    .stats {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .stats > div:nth-child(2) {
      border-right: 0;
    }
    .stats > div:nth-child(-n + 2) {
      border-bottom: 2px solid var(--ink);
    }
  }
</style>
