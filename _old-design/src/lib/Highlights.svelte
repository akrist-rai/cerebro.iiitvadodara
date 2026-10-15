<script>
  import { catalog, eventArt } from './events.js';
  import { reveal } from './interaction.js';
  import Icon from './Icon.svelte';
  let { onopen } = $props();
  const featured = ['tech-hunt', 'robo-race', 'trio-codejam', 'd2d'].map((id) =>
    catalog.find((event) => event.id === id),
  );
  let active = $state('tech-hunt');
</script>

<section class="section highlights" aria-labelledby="highlights-title">
  <div class="section-top" use:reveal>
    <div>
      <p class="eyebrow">01 / Find your competitive streak</p>
      <h2 id="highlights-title" class="section-heading">
        Pick your <em>playground.</em>
      </h2>
    </div>
    <a class="text-link" href="#events"
      >See all nine events <Icon name="diagonal" /></a
    >
  </div>
  <div class="panels" use:reveal>
    {#each featured as event, i}
      <article
        class:active={active === event.id}
        onpointerenter={(e) => {
          if (e.pointerType === 'mouse') active = event.id;
        }}
      >
        <button
          class="panel-select"
          aria-label="Preview {event.name}"
          aria-expanded={active === event.id}
          aria-controls="feature-{event.id}"
          onfocus={() => (active = event.id)}
          onclick={() => (active = event.id)}
          ><span class="eyebrow">0{i + 1} / {event.track}</span><span
            class="panel-name">{event.name}</span
          ><Icon name="plus" /></button
        >
        <img
          src={eventArt(event)}
          alt=""
          width="800"
          height="1000"
          loading="lazy"
        />
        <div
          class="panel-copy"
          id="feature-{event.id}"
          inert={active !== event.id}
        >
          <span class="pill"
            >{event.flagship ? 'Flagship event' : event.track}</span
          >
          <h3>{event.name}</h3>
          <p>{event.meta.join(' · ')}</p>
          <button class="button" onclick={() => onopen(event.id)}
            >Meet the challenge <Icon name="diagonal" size={18} /></button
          >
        </div>
      </article>
    {/each}
  </div>
  <div class="caption">
    <span>Big ideas. Real competition. Your next story.</span><span
      >Hover, tap, or tab to explore ↗</span
    >
  </div>
</section>

<style>
  .highlights {
    padding-bottom: 70px;
  }
  .panels {
    display: flex;
    gap: 12px;
    height: 465px;
  }
  .panels article {
    position: relative;
    flex: 1;
    min-width: 0;
    overflow: hidden;
    background: var(--paper-2);
    transition: flex 0.5s var(--ease);
  }
  .panels article.active {
    flex: 3.2;
  }
  .panel-select {
    position: absolute;
    inset: 0;
    border: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    background: linear-gradient(0deg, #000b, transparent 65%);
    color: #fff;
    text-align: left;
    display: flex;
    flex-direction: column;
    align-items: start;
    padding: 22px;
  }
  .panel-select .eyebrow {
    font-size: 9px;
    white-space: nowrap;
    text-shadow: 0 1px 4px #0008;
  }
  .panel-name {
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    font-family: var(--type);
    font-size: 52px;
    line-height: 1;
    margin-top: auto;
    transition: opacity 0.2s;
  }
  .panel-select :global(svg) {
    position: absolute;
    bottom: 24px;
    right: 20px;
  }
  .panels img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 50% 32%;
    transition:
      transform 0.65s var(--ease),
      filter 0.5s;
    filter: saturate(0.8);
  }
  .active img {
    transform: scale(1.04);
    filter: saturate(1);
  }
  .active .panel-select {
    height: 60px;
    background: none;
  }
  .active .panel-name,
  .active .panel-select :global(svg) {
    opacity: 0;
  }
  .panel-copy {
    position: absolute;
    bottom: 24px;
    left: 24px;
    right: 24px;
    color: var(--paper-hi);
    opacity: 0;
    transform: translateY(20px);
    transition:
      opacity 0.4s,
      transform 0.6s var(--ease);
    pointer-events: none;
    z-index: 3;
  }
  .active .panel-copy {
    opacity: 1;
    transform: none;
    pointer-events: auto;
  }
  .panel-copy::before {
    content: '';
    position: absolute;
    inset: -30px -24px -24px;
    z-index: -1;
    background: linear-gradient(0deg, #151513ee, #151513cc 68%, transparent);
  }
  .panel-copy .pill {
    font-size: 8px;
    border-color: #fff6;
  }
  .panel-copy h3 {
    font-family: var(--type);
    font-size: 64px;
    line-height: 0.95;
    font-weight: 500;
    margin: 12px 0;
  }
  .panel-copy p {
    font-size: 11px;
    margin-bottom: 18px;
  }
  .panel-copy .button {
    background: var(--paper);
    color: var(--ink);
    border-color: var(--paper);
  }
  .caption {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
    color: var(--dim);
    font-size: 10px;
  }
  .caption span:last-child {
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  @media (max-width: 760px) {
    .panels {
      flex-direction: column;
      height: 750px;
      gap: 8px;
    }
    .panels article {
      flex: 0 0 72px;
    }
    .panels article.active {
      flex: 1;
    }
    .panel-select {
      flex-direction: row;
      align-items: center;
      padding: 18px;
      gap: 18px;
    }
    .panel-name {
      writing-mode: initial;
      transform: none;
      font-size: 34px;
      margin: 0;
    }
    .panel-select .eyebrow {
      font-size: 8px;
    }
    .panel-select :global(svg) {
      bottom: 25px;
      right: 18px;
    }
    .active .panel-select {
      align-items: start;
    }
    .panel-copy h3 {
      font-size: 56px;
    }
    .caption span:last-child {
      display: none;
    }
    .highlights {
      padding-bottom: 60px;
    }
  }
</style>
