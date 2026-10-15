<script>
  import { TRACKS, plain } from './content.js';
  import {
    catalog,
    eventArt,
    filterEvents,
    dateLabel,
    registrationState,
  } from './events.js';
  import { reveal } from './interaction.js';
  import Icon from './Icon.svelte';
  let { saved = [], ontoggle, onopen } = $props();
  let query = $state('');
  let track = $state('All');
  let mode = $state('All');
  let savedOnly = $state(false);
  const filtered = $derived(
    filterEvents(catalog, { query, track, mode, savedOnly, saved }),
  );
  function reset() {
    query = '';
    track = 'All';
    mode = 'All';
    savedOnly = false;
  }
</script>

<section id="events" class="section" aria-labelledby="events-title">
  <div class="section-top" use:reveal>
    <div>
      <p class="eyebrow">03 / The event directory</p>
      <h2 id="events-title" class="section-heading">
        Find your <em>thing.</em>
      </h2>
    </div>
    <p>
      All the challenges, in one place. Get the details, build your plan, and be
      ready when registration opens.
    </p>
  </div>
  <div class="tools">
    <label class="search"
      ><Icon name="search" size={18} /><span class="sr"
        >Search events, clubs, or rooms</span
      ><input
        type="search"
        bind:value={query}
        placeholder="Search events, clubs, or rooms…"
      /></label
    ><label class="mode"
      ><span class="sr">Event mode</span><select bind:value={mode}
        ><option value="All">All formats</option><option>In person</option
        ><option>Online</option><option>Hybrid</option></select
      ></label
    ><button
      class="saved-filter"
      class:selected={savedOnly}
      aria-pressed={savedOnly}
      onclick={() => (savedOnly = !savedOnly)}
      ><Icon name="bookmark" filled={savedOnly} size={16} /> My plan
      <span>{saved.length}</span></button
    >
  </div>
  <div class="filters" aria-label="Filter events by track">
    {#each ['All', ...TRACKS] as item}<button
        class:chosen={track === item}
        aria-pressed={track === item}
        onclick={() => (track = item)}
        >{item === 'All' ? 'All events' : item}<span
          >{item === 'All'
            ? catalog.length
            : catalog.filter((e) => e.track === item).length}</span
        ></button
      >{/each}
  </div>
  <div class="results-bar">
    <p aria-live="polite">
      {String(filtered.length).padStart(2, '0')}
      {filtered.length === 1 ? 'event' : 'events'} to explore
    </p>
    <span>Event details, from start to finish</span>
  </div>
  <div class="cards">
    {#each filtered as event (event.id)}
      {@const state = registrationState(event)}
      <article class="event-card" data-event-id={event.id}>
        <div class="poster">
          <button
            class="poster-open"
            aria-label="View {event.name}"
            onclick={() => onopen(event.id)}
            ><img
              src={eventArt(event)}
              alt=""
              width="800"
              height="1000"
              loading="lazy"
            /><span class="poster-number"
              >{String(event.num).padStart(2, '0')}</span
            ><span class="poster-arrow"><Icon name="diagonal" /></span></button
          ><button
            class="save"
            class:bookmarked={saved.includes(event.id)}
            aria-label="{saved.includes(event.id)
              ? 'Remove'
              : 'Save'} {event.name}{saved.includes(event.id)
              ? ' from'
              : ' to'} my plan"
            aria-pressed={saved.includes(event.id)}
            onclick={() => ontoggle(event.id)}
            ><Icon
              name="bookmark"
              size={18}
              filled={saved.includes(event.id)}
            /></button
          ><span class="poster-track eyebrow"
            >{event.track}{event.flagship ? ' / Flagship' : ''}</span
          >
        </div>
        <div class="card-copy">
          <div class="status-row">
            <span class="eyebrow">{event.mode || 'Format TBA'}</span><span
              class="status"
              class:open={state.key === 'open'}
              ><i></i>{state.key === 'upcoming'
                ? 'Opening soon'
                : state.label}</span
            >
          </div>
          <h3>
            <button onclick={() => onopen(event.id)}>{event.name}</button>
          </h3>
          <p class="description">{plain(event.lede)}</p>
          <div class="event-meta">
            {#each event.meta as fact}<span>{fact}</span>{/each}
          </div>
          <div class="card-facts">
            {#if event.startsAt}<span
                ><Icon name="calendar" size={14} />{dateLabel(
                  event.startsAt,
                )}</span
              >{/if}
            {#if event.room || event.venue}<span
                ><Icon name="pin" size={14} />{event.room || event.venue}</span
              >{/if}
            {#if event.prize}<span
                ><Icon name="trophy" size={14} />{event.prize}</span
              >{/if}
            {#if event.club}<span
                ><Icon name="people" size={14} />{event.club}</span
              >{/if}
            {#if !event.startsAt}<span class="pending-note"
                ><span class="pending-dot"></span>Schedule & final details
                coming soon</span
              >{/if}
          </div>
          <div class="card-bottom">
            <button class="details" onclick={() => onopen(event.id)}
              >Event details <Icon name="arrow" size={16} /></button
            ><button class="register" onclick={() => onopen(event.id, true)}
              >Register <Icon name="diagonal" size={14} /></button
            >
          </div>
        </div>
      </article>
    {/each}
  </div>
  {#if !filtered.length}<div class="empty">
      <h3>
        {savedOnly && !saved.length
          ? 'Your next adventure starts here.'
          : 'No events found.'}
      </h3>
      <p>
        {savedOnly && !saved.length
          ? 'Use the bookmark on any event to build your personal cerebro plan.'
          : 'Try another keyword, track, or format.'}
      </p>
      <button class="button light" onclick={reset}
        >Show all events <Icon name="arrow" /></button
      >
    </div>{/if}
</section>

<style>
  .tools {
    display: flex;
    gap: 14px;
    padding-bottom: 22px;
  }
  .search {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    border-bottom: 1px solid var(--ink);
    min-width: 0;
  }
  .search input {
    background: none;
    border: 0;
    width: 100%;
    padding: 13px 2px;
    min-height: 48px;
    font-size: 12px;
    outline-offset: 0;
  }
  .mode select {
    background: transparent;
    border: 1px solid var(--hair);
    padding: 13px 35px 13px 14px;
    min-height: 48px;
    font-size: 11px;
    color: var(--ink);
    max-width: 100%;
  }
  .saved-filter {
    background: none;
    border: 1px solid var(--hair);
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    font-size: 11px;
  }
  .saved-filter span {
    font-size: 10px;
    color: var(--dim);
  }
  .saved-filter.selected {
    background: var(--ink);
    color: var(--paper);
  }
  .saved-filter.selected span {
    color: var(--paper);
  }
  .filters {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding-bottom: 26px;
    border-bottom: 1px solid var(--ink);
  }
  .filters button {
    padding: 11px 16px;
    border: 1px solid var(--hair);
    border-radius: 100px;
    background: none;
    font-size: 11px;
    display: flex;
    gap: 15px;
    align-items: center;
  }
  .filters button span {
    font-size: 8px;
    opacity: 0.7;
  }
  .filters button.chosen {
    background: var(--ink);
    color: var(--paper);
    border-color: var(--ink);
  }
  .filters button:hover {
    border-color: var(--ink);
  }
  .results-bar {
    display: flex;
    justify-content: space-between;
    font-size: 10px;
    color: var(--dim);
    padding: 20px 0;
  }
  .results-bar p {
    margin: 0;
  }
  .cards {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 44px 26px;
  }
  .event-card {
    display: flex;
    flex-direction: column;
    min-width: 0;
    border-bottom: 1px solid var(--ink);
  }
  .poster {
    position: relative;
    overflow: hidden;
  }
  .poster-open {
    display: block;
    width: 100%;
    border: 0;
    background: var(--paper-2);
    padding: 0;
    position: relative;
    overflow: hidden;
    text-align: left;
  }
  .poster img {
    width: 100%;
    height: 310px;
    object-fit: cover;
    object-position: center 47%;
    transition: transform 0.7s var(--ease);
  }
  .event-card:hover .poster img {
    transform: scale(1.045);
  }
  .poster-number {
    position: absolute;
    top: 16px;
    left: 18px;
    color: var(--paper-hi);
    mix-blend-mode: difference;
    font-size: 11px;
    font-weight: 600;
  }
  .poster-arrow {
    position: absolute;
    right: 16px;
    bottom: 16px;
    border-radius: 50%;
    padding: 8px;
    display: flex;
    background: var(--paper);
    opacity: 0;
    transform: translate(-7px, 7px);
    transition:
      opacity 0.3s,
      transform 0.3s;
  }
  .poster-open:hover .poster-arrow,
  .poster-open:focus-visible .poster-arrow {
    opacity: 1;
    transform: none;
  }
  .save {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 36px;
    height: 36px;
    border: 0;
    border-radius: 50%;
    background: var(--paper-hi);
    display: grid;
    place-items: center;
  }
  .save.bookmarked {
    background: var(--ink);
    color: var(--paper);
  }
  .poster-track {
    position: absolute;
    bottom: 16px;
    left: 18px;
    background: var(--paper-hi);
    font-size: 8px;
    padding: 6px 9px;
    pointer-events: none;
  }
  .card-copy {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 19px 0 0;
  }
  .status-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 5px;
  }
  .status-row .eyebrow {
    font-size: 8px;
    color: var(--dim);
  }
  .status {
    font-size: 9px;
    display: flex;
    gap: 5px;
    align-items: center;
    color: var(--dim);
  }
  .status i {
    height: 5px;
    width: 5px;
    background: #938777;
    border-radius: 50%;
  }
  .status.open {
    color: #246039;
  }
  .status.open i {
    background: #246039;
  }
  h3 {
    font-family: var(--type);
    font-size: 48px;
    font-weight: 600;
    line-height: 1;
    margin: 14px 0 10px;
  }
  h3 button {
    font: inherit;
    background: none;
    border: 0;
    padding: 0;
    text-align: left;
  }
  .description {
    font-size: 12px;
    color: var(--dim);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: 40px;
    margin-bottom: 19px;
  }
  .event-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin: 15px 0;
  }
  .event-meta span {
    font-size: 9px;
    padding: 6px 9px;
    border: 1px solid var(--hair);
    border-radius: 3px;
  }
  .pending-note {
    color: var(--dim);
    font-size: 9px;
  }
  .pending-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--red);
  }
  .card-facts {
    border-top: 1px solid var(--hair);
    padding: 15px 0;
    display: grid;
    gap: 9px;
    font-size: 10px;
  }
  .card-facts span {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .card-facts :global(svg) {
    color: var(--dim);
  }
  .card-bottom {
    margin-top: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid var(--hair);
    padding: 7px 0;
  }
  .card-bottom button {
    border: 0;
    background: none;
    padding: 12px 0;
    display: flex;
    gap: 12px;
    align-items: center;
    font-size: 11px;
    font-weight: 600;
  }
  .register {
    color: var(--red);
  }
  .card-bottom button:hover {
    color: var(--red);
  }
  @media (max-width: 1050px) {
    .cards {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  @media (max-width: 600px) {
    .cards {
      grid-template-columns: 1fr;
      gap: 30px;
    }
    .poster img {
      height: 290px;
    }
    .tools {
      flex-wrap: wrap;
      gap: 10px;
    }
    .search {
      flex-basis: 100%;
    }
    .mode {
      flex: 1;
    }
    .mode select {
      width: 100%;
    }
    .filters {
      gap: 6px;
      padding-top: 5px;
    }
    .filters button {
      font-size: 10px;
      padding: 9px 13px;
      gap: 11px;
    }
    .results-bar span {
      display: none;
    }
    h3 {
      font-size: 50px;
    }
    .event-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin: 15px 0;
    }
    .event-meta span {
      font-size: 9px;
      padding: 6px 9px;
      border: 1px solid var(--hair);
      border-radius: 3px;
    }
    .pending-note {
      color: var(--dim);
      font-size: 9px;
    }
    .pending-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: var(--red);
    }
    .card-facts {
      font-size: 11px;
    }
    .description {
      font-size: 13px;
    }
  }
</style>
