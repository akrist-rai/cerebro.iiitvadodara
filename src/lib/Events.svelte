<script>
  import SectionHead from './SectionHead.svelte';
  import AsciiScene from './AsciiScene.svelte';
  import Icon from './Icon.svelte';
  import Art from './Art.svelte';
  import { eventArt } from './art.js';
  import { TRACKS, plain } from './content.js';
  import {
    directory,
    filterEvents,
    registrationState,
    whenLabel,
    clock,
    validDate,
  } from './events.js';

  let { saved = [], ontoggle, onopen } = $props();
  let query = $state('');
  let track = $state('All');
  let mode = $state('All');
  let savedOnly = $state(false);
  let hot = $state('');

  const filtered = $derived(
    filterEvents(directory, { query, track, mode, savedOnly, saved }),
  );
  function reset() {
    query = '';
    track = 'All';
    mode = 'All';
    savedOnly = false;
  }

  // "31 Oct · 10:00–12:00", or the hand-written date when there is one.
  function when(e) {
    if (e.dateText) return e.dateText.replace(/ 2026$/, '');
    const day = whenLabel(e).replace(/ 2026$/, '');
    return validDate(e.startsAt) && validDate(e.endsAt)
      ? `${day} · ${clock(e.startsAt)}–${clock(e.endsAt)}`
      : day;
  }
</script>

<section id="events" class="sec sec--crimson" aria-labelledby="events-title">
  <SectionHead
    id="events-title"
    n="03"
    kicker="events / the stamp album"
    title="Events"
    blurb="Every challenge, collected as a stamp. Open one for its full briefing: format, rules and the people running it."
  >
    <div class="collage">
      {#each [['n52', 16, 8, 0, -7], ['n42', 11, 24, 70, 5], ['n57', 12, 38, 4, 10], ['n36', 13, 56, 52, -6], ['n75', 17, 68, -4, 4], ['n31', 11, 84, 58, -9]] as [id, w, l, t, r]}
        <span style="width:{w}%;left:{l}%;top:{t}px;--rot:{r}deg"
          ><Art {id} cut /></span
        >
      {/each}
    </div>
  </SectionHead>

  <div class="tools">
    <label class="search">
      <span class="prompt" aria-hidden="true">&gt;</span><span class="sr"
        >Search events, clubs, or rooms</span
      >
      <input
        type="search"
        bind:value={query}
        placeholder="search events, clubs, rooms…"
      />
    </label>
    <label class="mode">
      <span class="sr">Event mode</span>
      <select bind:value={mode}>
        <option value="All">All formats</option>
        <option>In person</option>
        <option>Online</option>
      </select>
    </label>
    <button
      class="saved-filter"
      class:selected={savedOnly}
      aria-pressed={savedOnly}
      onclick={() => (savedOnly = !savedOnly)}
    >
      <Icon name="bookmark" filled={savedOnly} size={16} /> My plan
      <span>{saved.length}</span>
    </button>
  </div>

  <div class="filters" aria-label="Filter events by track">
    {#each ['All', ...TRACKS] as item}
      <button
        class:chosen={track === item}
        aria-pressed={track === item}
        onclick={() => (track = item)}
      >
        {item === 'All' ? 'All events' : item}<span
          >{item === 'All'
            ? directory.length
            : directory.filter((e) => e.track === item).length}</span
        >
      </button>
    {/each}
  </div>

  <p class="results" aria-live="polite">
    <span aria-hidden="true">$ ls events | wc -l -></span>
    <b>{String(filtered.length).padStart(2, '0')}</b>
    {filtered.length === 1 ? 'stamp' : 'stamps'} to explore
  </p>

  <div class="sheet">
    {#each filtered as event (event.id)}
      {@const state = registrationState(event)}
      {@const isSaved = saved.includes(event.id)}
      <article
        class="stamp"
        data-event-id={event.id}
        onpointerenter={() => (hot = event.id)}
        onpointerleave={() => (hot = '')}
        onfocusin={() => (hot = event.id)}
        onfocusout={() => (hot = '')}
      >
        <div class="inner">
          <header class="top">
            <span class="num">No. {String(event.num).padStart(2, '0')}</span>
          </header>

          <button
            class="art-btn"
            aria-label="View {event.name}"
            onclick={() => onopen(event.id)}
          >
            <AsciiScene {event} cols={48} rows={23} hot={hot === event.id} />
            {#key event.id}
              {@const p = eventArt(event)}
              <span class="poster" class:own={p.own}
                ><Art
                  id={p.id}
                  tone={p.tone}
                  pos={p.pos}
                  ratio="48 / 46"
                  dots={p.own ? 0 : 0.4}
                  draw={!p.own}
                /></span
              >
            {/key}
            <span class="track eyebrow"
              >{event.track}{event.flagship ? ' / flagship' : ''}{event.kind ===
              'zone'
                ? ' / zone'
                : ''}</span
            >
          </button>

          <div class="status-row">
            <span class="eyebrow">{event.mode || 'Format TBA'}</span>
            <span class="status" class:open={state.key === 'open'}
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

          <ul class="card-facts">
            <li><Icon name="calendar" size={14} />{when(event)}</li>
            {#if event.room || event.venue}<li>
                <Icon name="pin" size={14} />{event.room
                  ? 'Room ' + event.room
                  : event.venue}
              </li>{/if}
            {#if event.club}<li>
                <Icon name="people" size={14} />{event.club}
              </li>{/if}
          </ul>

          <div class="card-bottom">
            <button class="details" onclick={() => onopen(event.id)}
              >Event details <Icon name="arrow" size={15} /></button
            >
            <button class="register" onclick={() => onopen(event.id, true)}
              >Register</button
            >
            <button
              class="save"
              class:bookmarked={isSaved}
              aria-label="{isSaved ? 'Remove' : 'Save'} {event.name}{isSaved
                ? ' from'
                : ' to'} my plan"
              aria-pressed={isSaved}
              onclick={() => ontoggle(event.id)}
              ><Icon name="bookmark" size={16} filled={isSaved} /></button
            >
          </div>
        </div>
      </article>
    {/each}
  </div>

  {#if !filtered.length}
    <div class="empty">
      <h3>
        {savedOnly && !saved.length
          ? 'Your next adventure starts here.'
          : 'No events found.'}
      </h3>
      <p>
        {savedOnly && !saved.length
          ? 'Use the bookmark on any event to build your personal plan.'
          : 'Try another keyword, track, or format.'}
      </p>
      <button class="btn" onclick={reset}
        >Show all events <Icon name="arrow" /></button
      >
    </div>
  {/if}
</section>

<style>
  .tools {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 16px;
  }
  .search {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1 1 280px;
    min-width: 0;
    background: var(--ink);
    color: var(--gold);
    border: 2px solid var(--paper);
    padding: 0 14px;
  }
  .prompt {
    font-weight: 800;
  }
  .search input {
    background: none;
    border: 0;
    width: 100%;
    min-height: 44px;
    color: var(--gold);
    font-size: 14px;
    outline: none;
  }
  .search:focus-within {
    outline: 3px solid var(--gold);
    outline-offset: 2px;
  }
  .search input::placeholder {
    color: color-mix(in srgb, var(--gold) 55%, transparent);
  }
  .mode select {
    background: var(--paper-hi);
    color: var(--ink);
    border: 2px solid var(--paper);
    min-height: 48px;
    padding: 0 14px;
    font-weight: 700;
    border-radius: 0;
  }
  .saved-filter {
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 0 16px;
    min-height: 48px;
    background: var(--paper-hi);
    color: var(--ink);
    border: 2px solid var(--paper);
    font-weight: 700;
  }
  .saved-filter.selected {
    background: var(--gold);
  }
  .filters {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .filters button {
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 8px 12px;
    border: 2px solid var(--paper);
    background: transparent;
    color: var(--paper-hi);
    font-weight: 700;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .filters button::before {
    content: '[ ]' / '';
    font-weight: 400;
    opacity: 0.8;
  }
  .filters button.chosen {
    background: var(--gold);
    color: var(--ink);
    border-color: var(--gold);
  }
  .filters button.chosen::before {
    content: '[x]' / '';
  }
  .filters button span {
    font-size: 10px;
    opacity: 0.7;
  }
  .results {
    margin: 22px 0 26px;
    color: var(--paper-hi);
  }
  .results b {
    background: var(--gold);
    color: var(--ink);
    padding: 0 6px;
  }

  .sheet {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
    gap: 34px 28px;
  }
  /* A stamp: paper, punched edge, a hard shadow under it. */
  .stamp {
    --r: 5px;
    --p: 18px;
    --dim: #5f5552;
    --hair: #bda59c;
    color: var(--ink);
    filter: drop-shadow(5px 6px 0 #4a0a0d);
    container-type: inline-size;
  }
  .inner {
    background: var(--paper-hi);
    padding: 20px 18px 8px;
    height: 100%;
    display: flex;
    flex-direction: column;
    -webkit-mask:
      radial-gradient(circle var(--r) at 50% 0, #0000 calc(100% - 0.5px), #000)
        calc(var(--p) / 2) 0 / var(--p) 100% repeat-x,
      radial-gradient(
          circle var(--r) at 50% 100%,
          #0000 calc(100% - 0.5px),
          #000
        )
        calc(var(--p) / 2) 0 / var(--p) 100% repeat-x,
      radial-gradient(circle var(--r) at 0 50%, #0000 calc(100% - 0.5px), #000)
        0 calc(var(--p) / 2) / 100% var(--p) repeat-y,
      radial-gradient(
          circle var(--r) at 100% 50%,
          #0000 calc(100% - 0.5px),
          #000
        )
        0 calc(var(--p) / 2) / 100% var(--p) repeat-y;
    -webkit-mask-composite: source-in;
    mask:
      radial-gradient(circle var(--r) at 50% 0, #0000 calc(100% - 0.5px), #000)
        calc(var(--p) / 2) 0 / var(--p) 100% repeat-x,
      radial-gradient(
          circle var(--r) at 50% 100%,
          #0000 calc(100% - 0.5px),
          #000
        )
        calc(var(--p) / 2) 0 / var(--p) 100% repeat-x,
      radial-gradient(circle var(--r) at 0 50%, #0000 calc(100% - 0.5px), #000)
        0 calc(var(--p) / 2) / 100% var(--p) repeat-y,
      radial-gradient(
          circle var(--r) at 100% 50%,
          #0000 calc(100% - 0.5px),
          #000
        )
        0 calc(var(--p) / 2) / 100% var(--p) repeat-y;
    mask-composite: intersect;
  }
  .top {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding-bottom: 8px;
  }
  .num {
    font-family: var(--pixel);
    font-size: 11px;
    color: var(--red);
  }
  .art-btn {
    position: relative;
    display: block;
    width: 100%;
    padding: 6px;
    border: 2px solid var(--ink);
    background: var(--paper-2);
    color: var(--ink);
    text-align: left;
    overflow: hidden;
  }
  .art-btn:hover,
  .art-btn:focus-visible {
    background: var(--gold);
  }
  /* the poster sits over the ASCII scene and dissolves into a dot screen
     on hover, which is what the scene was printed from */
  @property --s {
    syntax: '<length>';
    inherits: false;
    initial-value: 6px;
  }
  .poster {
    position: absolute;
    inset: 6px;
    --s: 6px;
    -webkit-mask: radial-gradient(
        circle at 50% 50%,
        #000 var(--s),
        #0000 calc(var(--s) + 0.6px)
      )
      0 0 / 8px 8px;
    mask: radial-gradient(
        circle at 50% 50%,
        #000 var(--s),
        #0000 calc(var(--s) + 0.6px)
      )
      0 0 / 8px 8px;
    transition: --s 0.6s var(--ease);
  }
  .poster :global(.art) {
    width: 100%;
    height: 100%;
    aspect-ratio: auto;
  }
  .art-btn:hover .poster,
  .art-btn:focus-visible .poster {
    --s: 0px;
  }
  /* an event's own poster is shown whole, as designed */
  .poster.own {
    -webkit-mask: none;
    mask: none;
  }
  .art-btn:hover .poster :global(.duo) {
    opacity: 1;
  }
  .track {
    position: absolute;
    left: 6px;
    bottom: 6px;
    background: var(--ink);
    color: var(--paper);
    padding: 2px 7px;
    font-size: 9px;
  }
  .status-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    margin-top: 12px;
    color: var(--dim);
  }
  .status {
    font-size: 11px;
    display: flex;
    gap: 6px;
    align-items: center;
  }
  .status i {
    width: 7px;
    height: 7px;
    background: var(--hair);
    display: inline-block;
  }
  .status.open {
    color: #0b5a2a;
  }
  .status.open i {
    background: #0b5a2a;
  }
  h3 {
    margin: 8px 0 8px;
    font-size: clamp(22px, 8cqw, 30px);
    font-weight: 800;
    letter-spacing: -0.04em;
    text-transform: uppercase;
    line-height: 1;
  }
  h3 button {
    font: inherit;
    letter-spacing: inherit;
    text-transform: inherit;
    background: none;
    border: 0;
    padding: 0;
    text-align: left;
  }
  h3 button:hover {
    background: var(--ink);
    color: var(--gold);
  }
  .description {
    margin: 0 0 12px;
    font-size: 12.5px;
    color: var(--dim);
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .event-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 12px;
  }
  .event-meta span {
    font-size: 10.5px;
    padding: 3px 7px;
    border: 1.5px solid var(--ink);
    font-weight: 600;
  }
  .card-facts {
    border-top: 2px dashed var(--hair);
    padding: 12px 0;
    display: grid;
    gap: 7px;
    font-size: 11.5px;
    margin-top: auto;
  }
  .card-facts li {
    display: flex;
    gap: 9px;
    align-items: center;
    min-width: 0;
  }
  .card-facts :global(svg) {
    color: var(--red);
  }
  .card-bottom {
    display: flex;
    align-items: center;
    gap: 6px;
    border-top: 2px solid var(--ink);
    padding: 6px 0 10px;
  }
  .card-bottom button {
    border: 0;
    background: none;
    padding: 8px 4px;
    display: flex;
    gap: 8px;
    align-items: center;
    font-size: 11.5px;
    font-weight: 800;
    text-transform: uppercase;
  }
  .card-bottom .register {
    color: var(--red);
    margin-left: auto;
  }
  .card-bottom .details:hover,
  .card-bottom .register:hover {
    background: var(--ink);
    color: var(--gold);
  }
  .card-bottom .save {
    width: 34px;
    height: 34px;
    justify-content: center;
    border: 2px solid var(--ink);
    padding: 0;
  }
  .card-bottom .save.bookmarked {
    background: var(--ink);
    color: var(--gold);
  }
  .empty,
  .empty p {
    color: var(--paper-hi);
  }
  .empty .btn {
    color: var(--ink);
  }
</style>
