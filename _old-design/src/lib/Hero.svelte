<script>
  import Icon from './Icon.svelte';
  import { cursorTrail, fitHeadline } from './interaction.js';
  import { eventArt, catalog, dateLabel } from './events.js';
  import { FEST_DETAILS } from './event-details.js';
  let { onopen } = $props();
  const picks = ['robo-race', 'tech-hunt', 'trio-codejam'].map((id) =>
    catalog.find((event) => event.id === id),
  );
  const venueLabel = FEST_DETAILS.location || 'Gandhinagar, India';
  const cerebroDates = FEST_DETAILS.startDate
    ? dateLabel(FEST_DETAILS.startDate + 'T00:00:00+05:30') +
      (FEST_DETAILS.endDate
        ? ' – ' + dateLabel(FEST_DETAILS.endDate + 'T00:00:00+05:30')
        : '')
    : 'cerebro dates to be announced';
</script>

<section class="hero" id="top" aria-labelledby="hero-title">
  <div class="edition eyebrow">
    <span>IIIT Vadodara presents</span><span class="edition-center"
      >A gathering of curious minds</span
    ><span>{venueLabel} ↗</span>
  </div>
  <div class="mast" use:cursorTrail={picks.map(eventArt)}>
    <h1 id="hero-title" use:fitHeadline>
      CEREBRO<span class="year"
        >’26<span class="asterisk" aria-hidden="true">✳</span></span
      >
    </h1>
    <div class="under-title eyebrow">
      <span>The annual technical cerebro</span><span>Beyond the horizon</span>
    </div>
  </div>
  <div class="hero-stage">
    <div class="intro">
      <p class="eyebrow red">
        <span class="signal"></span> For the relentlessly curious
      </p>
      <h2>technical fest organized by technical comittee<br />Leave with a <em>story.</em></h2>
      <p class="hero-copy">
        Build a bot. Break a cipher. Find your people.<br /> Nine challenges. One
        shared obsession with what’s next.
      </p>
      <div class="actions">
        <a class="button" href="#events"
          >Find your challenge <Icon name="diagonal" /></a
        ><a class="text-link" href="#schedule"
          >Plan your visit <Icon name="arrow" size={17} /></a
        >
      </div>
      <div class="hero-note">
        <span class="note-line"></span><span
          >Code / Robotics / Finance / Design / Quiz / CTF</span
        >
      </div>
    </div>
    <div class="poster-stage">
      <span class="stage-label eyebrow">Your next “I was there” moment.</span>
      <div class="poster-deck">
        {#each picks as event, i}
          <button
            class="hero-poster"
            style="--i: {i}"
            aria-label="Explore {event.name}"
            onclick={() => onopen(event.id)}
          >
            <img
              src={eventArt(event)}
              alt=""
              width="800"
              height="1000"
              fetchpriority={i === 1 ? 'high' : 'auto'}
            />
            <span class="poster-caption"
              ><span>{event.name}</span><Icon name="diagonal" size={18} /></span
            >
          </button>
        {/each}
      </div>
      <span class="deck-hint">Pick a poster. Meet your challenge. ↗</span>
    </div>
  </div>
  <div class="cerebro-strip">
    <span class="strip-count"
      ><strong>09</strong><span>Events to<br />make your own</span></span
    ><span class="strip-date"
      ><Icon name="calendar" size={19} />{cerebroDates}</span
    ><a href="#about">Meet Cerebro <Icon name="arrow" size={18} /></a>
  </div>
</section>

<style>
  .hero {
    padding: 0 var(--gutter);
  }
  .edition {
    display: flex;
    justify-content: space-between;
    padding: 24px 0 13px;
    font-size: 9px;
  }
  .mast {
    position: relative;
    border-bottom: 1px solid var(--ink);
  }
  h1 {
    font-family: var(--type);
    font-size: clamp(118px, 20.3vw, 358px);
    font-weight: 700;
    line-height: 0.87;
    letter-spacing: -0.035em;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0 0;
  }
  .year {
    color: var(--red);
    position: relative;
    padding-right: 0.025em;
  }
  .asterisk {
    font-family: Arial, sans-serif;
    position: absolute;
    font-size: 0.18em;
    right: 0.06em;
    top: -0.08em;
    line-height: 1;
    animation: turn 28s linear infinite;
  }
  .under-title {
    display: flex;
    justify-content: space-between;
    padding: 20px 0 16px;
    font-size: 9px;
  }
  .hero-stage {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 36px;
    align-items: center;
    padding: 40px 0 35px;
  }
  .red {
    color: var(--red);
  }
  .intro .eyebrow {
    font-size: 9px;
    margin-bottom: 23px;
    display: flex;
    align-items: center;
    gap: 9px;
  }
  .signal {
    width: 6px;
    height: 6px;
    background: var(--red);
    border-radius: 50%;
    box-shadow: 0 0 0 4px #bd392517;
  }
  h2 {
    font-family: var(--type);
    font-size: clamp(46px, 5.2vw, 85px);
    line-height: 0.96;
    font-weight: 500;
    margin: 0;
    letter-spacing: -0.015em;
  }
  h2 em {
    color: var(--red);
  }
  .hero-copy {
    font-size: 12px;
    line-height: 1.8;
    margin: 23px 0;
  }
  .actions {
    display: flex;
    gap: 24px;
    align-items: center;
    flex-wrap: wrap;
  }
  .hero-note {
    display: flex;
    gap: 10px;
    align-items: center;
    margin-top: 30px;
    font-size: 9px;
    color: var(--dim);
  }
  .note-line {
    width: 28px;
    height: 1px;
    background: var(--red);
  }
  .poster-stage {
    position: relative;
    min-width: 0;
    padding: 20px 0 10px;
  }
  .stage-label {
    display: block;
    text-align: right;
    font-size: 8px;
    color: var(--dim);
  }
  .poster-deck {
    position: relative;
    height: clamp(300px, 30vw, 480px);
    margin: 20px 20px 0;
    isolation: isolate;
  }
  .hero-poster {
    position: absolute;
    width: 44%;
    left: calc(2% + var(--i) * 25%);
    top: calc(10px + var(--i) * 7px);
    padding: 7px;
    border: 1px solid #22221f44;
    background: var(--paper-hi);
    transform: rotate(calc((var(--i) - 1) * 12deg));
    box-shadow: 0 12px 20px #22221f18;
    transition:
      transform 0.55s var(--ease),
      box-shadow 0.55s;
  }
  .hero-poster:nth-child(2) {
    z-index: 2;
    top: 0;
  }
  .hero-poster:hover,
  .hero-poster:focus-visible {
    z-index: 4;
    transform: translateY(-15px) rotate(0deg);
    box-shadow: 0 22px 32px #22221f2b;
  }
  .hero-poster img {
    width: 100%;
    height: auto;
    aspect-ratio: 4/5;
    object-fit: cover;
  }
  .poster-caption {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 5px 5px;
    font-family: var(--type);
    font-size: 26px;
    text-align: left;
  }
  .deck-hint {
    display: block;
    text-align: right;
    font-size: 9px;
    color: var(--dim);
    margin-top: 15px;
  }
  .cerebro-strip {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 18px;
    border-top: 1px solid var(--ink);
    border-bottom: 1px solid var(--ink);
    padding: 15px 0;
    font-size: 10px;
  }
  .strip-count,
  .strip-date,
  .cerebro-strip a {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .strip-count strong {
    font-family: var(--type);
    font-size: 42px;
    line-height: 1;
    font-weight: 500;
  }
  .strip-count span {
    font-size: 9px;
    line-height: 1.4;
  }
  .cerebro-strip a {
    text-decoration: none;
  }
  @keyframes turn {
    to {
      transform: rotate(360deg);
    }
  }
  @media (min-width: 1600px) {
    .poster-deck {
      height: 530px;
    }
  }
  @media (max-width: 1050px) {
    .edition-center {
      display: none;
    }
    .hero-stage {
      gap: 20px;
    }
    .poster-deck {
      height: 350px;
      margin-left: 0;
      margin-right: 0;
    }
    .hero-note {
      display: none;
    }
    .poster-caption {
      font-size: 21px;
    }
    .hero-copy br {
      display: none;
    }
  }
  @media (max-width: 760px) {
    .hero-stage {
      grid-template-columns: 1fr;
      gap: 25px;
      padding-top: 30px;
    }
    h2 {
      font-size: clamp(53px, 9vw, 75px);
    }
    .intro {
      max-width: 580px;
    }
    .hero-copy {
      margin: 18px 0;
    }
    .poster-stage {
      padding: 0 12px;
      max-width: 550px;
      width: 100%;
      justify-self: center;
    }
    .poster-deck {
      height: clamp(230px, 62vw, 370px);
      margin-top: 20px;
    }
    .stage-label {
      text-align: left;
    }
    .deck-hint {
      margin-top: 12px;
    }
    .hero-poster {
      width: 43%;
    }
    .cerebro-strip {
      flex-wrap: wrap;
    }
    .strip-date {
      font-size: 9px;
    }
    .cerebro-strip > a {
      display: none;
    }
  }
  @media (max-width: 600px) {
    h1 {
      font-size: 21vw;
      padding-top: 15px;
    }
    .under-title {
      font-size: 7px;
      padding: 14px 0;
    }
    .edition {
      font-size: 7px;
    }
    .actions {
      gap: 18px;
    }
    .poster-caption {
      font-size: 21px;
      padding: 8px 2px 2px;
    }
    .hero-poster {
      padding: 5px;
    }
  }
</style>
