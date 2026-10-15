<script>
  import SectionHead from './SectionHead.svelte';
  import Icon from './Icon.svelte';
  import Barcode from './Barcode.svelte';
  import Art from './Art.svelte';
  import {
    catalog,
    SLOTS,
    inSlot,
    byStart,
    clock,
    validDate,
  } from './events.js';
  import { reveal } from './interaction.js';

  let { saved = [], onopen, ontoggle, savedOnly = $bindable(false) } = $props();
  let day = $state('All');

  const receipts = $derived(
    SLOTS.filter((slot) => day === 'All' || day === slot.id)
      .map((slot) => ({
        ...slot,
        items: catalog
          .filter(
            (e) => inSlot(e, slot.id) && (!savedOnly || saved.includes(e.id)),
          )
          .toSorted(byStart),
      }))
      .filter((r) => r.items.length),
  );
  const total = $derived(receipts.reduce((n, r) => n + r.items.length, 0));

  // 09:00 → 24:00 on a 30-column bar, half an hour a column.
  function bar(e) {
    if (!validDate(e.startsAt) || !validDate(e.endsAt)) return null;
    const hm = (iso) => {
      const [h, m] = clock(iso).split(':').map(Number);
      return h + m / 60;
    };
    const a = hm(e.startsAt);
    let b = hm(e.endsAt);
    if (b <= a) b += 24;
    const from = Math.max(0, Math.floor((a - 9) * 2));
    const to = Math.min(30, Math.max(from + 1, Math.ceil((b - 9) * 2)));
    return [(from / 30) * 100, ((to - from) / 30) * 100];
  }
  function stamp(e, slot) {
    if (slot === 'leagues') return 'TBA';
    if (slot === 'online') return '26–30 Oct';
    return validDate(e.startsAt)
      ? `${clock(e.startsAt)}–${clock(e.endsAt)}`
      : 'TBA';
  }
</script>

<section id="schedule" class="sec sec--paper2" aria-labelledby="schedule-title">
  <SectionHead
    id="schedule-title"
    n="04"
    kicker="schedule / printed receipts"
    title="Schedule"
    artWidth={320}
    blurb="Online play runs 26–30 October; the offline finals fill 31 October and 1 November on the Gandhinagar Campus. Save events to build your own plan. All times are IST."
  >
    <div class="line">
      {#each [['n44', -4, 0], ['n0', 2, 22], ['n35', -2, 6]] as [id, rot, dy], i}
        <span class="slip" style="--rot:{rot}deg;--dy:{dy}px;--i:{i}"
          ><Art {id} pos="50% 0%" /></span
        >
      {/each}
    </div>
  </SectionHead>

  <div class="tools">
    <div class="views">
      <button
        class:active={!savedOnly}
        aria-pressed={!savedOnly}
        onclick={() => (savedOnly = false)}>All events</button
      >
      <button
        class:active={savedOnly}
        aria-pressed={savedOnly}
        onclick={() => (savedOnly = true)}
      >
        <Icon name="bookmark" size={14} /> My plan ({saved.length})
      </button>
    </div>
    <label class="day">
      <span class="sr">Filter schedule by day</span>
      <select bind:value={day}>
        <option value="All">All days</option>
        {#each SLOTS as slot}<option value={slot.id}
            >{slot.label} · {slot.range}</option
          >{/each}
      </select>
    </label>
    <span class="timezone">India Standard Time · UTC +05:30</span>
  </div>

  <div class="receipts" aria-live="polite">
    {#each receipts as slot (slot.id)}
      <article
        class="receipt"
        use:reveal
        aria-label="{slot.label}, {slot.range}"
      >
        <header>
          <p class="eyebrow">
            Cerebro ’26 · {slot.id === 'online'
              ? 'online'
              : slot.id === 'leagues'
                ? 'arcadia'
                : 'finals'}
          </p>
          <h3>{slot.label}</h3>
          <p class="range">{slot.range} · {slot.note}</p>
        </header>
        <ul>
          {#each slot.items as event (event.id)}
            {@const isSaved = saved.includes(event.id)}
            <li class="schedule-row">
              <span class="time">{stamp(event, slot.id)}</span>
              <div class="line">
                <button class="event-title" onclick={() => onopen(event.id)}
                  >{event.name}</button
                >
                <span class="dots" aria-hidden="true"></span>
                <span class="room"
                  >{event.room ||
                    (event.mode === 'Online' ? 'Online' : 'TBA')}</span
                >
              </div>
              <button
                class="save"
                class:on={isSaved}
                aria-label="{isSaved ? 'Remove' : 'Save'} {event.name}{isSaved
                  ? ' from'
                  : ' to'} schedule"
                aria-pressed={isSaved}
                onclick={() => ontoggle(event.id)}
                ><Icon name={isSaved ? 'check' : 'plus'} size={14} /></button
              >
              <p class="sub">
                {event.club || 'Organizing club TBA'}{event.mode
                  ? ' · ' + event.mode
                  : ''}
              </p>
              {#if (slot.id === 'd1' || slot.id === 'd2') && bar(event)}
                {@const [at, len] = bar(event)}
                <span class="tl" aria-hidden="true"
                  ><i style="left:{at}%;width:{len}%"></i></span
                >
              {/if}
            </li>
          {/each}
        </ul>
        <footer>
          <p>
            <span>ITEMS</span><span class="dots" aria-hidden="true"></span><span
              >{String(slot.items.length).padStart(2, '0')}</span
            >
          </p>
          <div class="code">
            <Barcode seed={slot.id + 'cerebro26'} bars={24} />
          </div>
          <p class="thanks">*** thank you for playing ***</p>
        </footer>
      </article>
    {/each}
  </div>

  {#if !total}
    <div class="empty">
      <h3>A little space for your favourites.</h3>
      <p>Bookmark events in the directory to see them in your plan.</p>
      <a class="btn" href="#events">Find an event <Icon name="arrow" /></a>
    </div>
  {/if}
  <p class="footnote">
    Your plan is saved in this browser. Saving an event does not register you
    for it. The master timetable can still shift; the four league slots are yet
    to be announced.
  </p>
</section>

<style>
  /* three real thermal receipts on a line */
  .line {
    position: relative;
    height: 100%;
    border-top: 2px dashed var(--ink);
    margin-top: 6px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding-right: 4%;
  }
  .slip {
    position: relative;
    display: block;
    width: 94px;
    margin-top: calc(var(--dy) + 8px);
    transform-origin: 50% 0;
    transform: rotate(var(--rot));
    box-shadow: 4px 5px 0 var(--ink);
    border: 2px solid var(--ink);
    align-self: flex-start;
    max-height: 240px;
    overflow: hidden;
    transition: transform 0.4s var(--ease);
  }
  .slip:hover {
    transform: rotate(0) translateY(6px);
  }
  .slip::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    width: 18px;
    height: 12px;
    transform: translateX(-50%);
    background: var(--red);
    border: 2px solid var(--ink);
    z-index: 2;
  }
  .tools {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
    border-bottom: 2px solid var(--ink);
    padding-bottom: 12px;
    margin-bottom: 36px;
  }
  .views {
    display: flex;
    gap: 8px;
  }
  .views button {
    padding: 8px 12px;
    border: 2px solid var(--ink);
    background: none;
    display: flex;
    gap: 8px;
    align-items: center;
    font-weight: 700;
    font-size: 12px;
    text-transform: uppercase;
  }
  .views button.active {
    background: var(--ink);
    color: var(--lime);
  }
  .day select {
    background: var(--paper-hi);
    border: 2px solid var(--ink);
    min-height: 40px;
    padding: 0 12px;
    font-weight: 700;
    border-radius: 0;
  }
  .timezone {
    font-family: var(--pixel);
    font-size: 10px;
    color: var(--dim);
    text-transform: uppercase;
  }

  .receipts {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 270px), 1fr));
    gap: 34px 26px;
    align-items: start;
  }
  .receipt {
    --z: 10px;
    background: var(--paper-hi);
    background-image: repeating-linear-gradient(
      transparent 0 23px,
      color-mix(in srgb, var(--ink) 5%, transparent) 23px 24px
    );
    padding: 26px 20px 38px;
    filter: drop-shadow(
      4px 5px 0 color-mix(in srgb, var(--ink) 80%, transparent)
    );
    -webkit-mask:
      conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg)
        50% / var(--z) 51% repeat-x bottom,
      conic-gradient(from 135deg at top, #0000, #000 1deg 89deg, #0000 90deg)
        50% / var(--z) 51% repeat-x top;
    mask:
      conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg)
        50% / var(--z) 51% repeat-x bottom,
      conic-gradient(from 135deg at top, #0000, #000 1deg 89deg, #0000 90deg)
        50% / var(--z) 51% repeat-x top;
  }
  .receipt header {
    text-align: center;
    border-bottom: 2px dashed var(--ink);
    padding-bottom: 14px;
    margin-bottom: 14px;
  }
  .receipt header .eyebrow {
    margin: 0 0 4px;
    color: var(--red);
  }
  .receipt h3 {
    margin: 0;
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.03em;
    text-transform: uppercase;
  }
  .range {
    margin: 4px auto 0;
    font-size: 12px;
    color: var(--dim);
  }
  .schedule-row {
    display: grid;
    grid-template-columns: 1fr 30px;
    gap: 0 8px;
    padding: 9px 0;
    border-bottom: 1px dashed var(--hair);
  }
  .time {
    grid-column: 1 / -1;
    font-family: var(--pixel);
    font-size: 10px;
    color: var(--red);
  }
  .line {
    display: flex;
    align-items: baseline;
    gap: 8px;
    min-width: 0;
  }
  .event-title {
    background: none;
    border: 0;
    padding: 0;
    font-weight: 800;
    font-size: 14px;
    text-transform: uppercase;
    text-align: left;
    letter-spacing: -0.01em;
  }
  .event-title:hover {
    background: var(--ink);
    color: var(--lime);
  }
  .dots {
    flex: 1;
    border-bottom: 2px dotted var(--hair);
    min-width: 12px;
    transform: translateY(-3px);
  }
  .room {
    font-size: 12px;
    white-space: nowrap;
  }
  .save {
    grid-row: 2 / span 2;
    grid-column: 2;
    align-self: center;
    width: 28px;
    height: 28px;
    border: 2px solid var(--ink);
    background: none;
    display: grid;
    place-items: center;
    padding: 0;
  }
  .save:hover {
    background: var(--lime);
  }
  .save.on {
    background: var(--ink);
    color: var(--lime);
  }
  .sub {
    grid-column: 1;
    margin: 2px 0 0;
    font-size: 11px;
    color: var(--dim);
  }
  .tl {
    grid-column: 1 / -1;
    position: relative;
    height: 8px;
    margin-top: 6px;
    background: linear-gradient(var(--hair), var(--hair)) center / 100% 1px
      no-repeat;
  }
  .tl i {
    position: absolute;
    top: 1px;
    bottom: 1px;
    min-width: 3px;
    background: var(--red);
  }
  .receipt footer {
    margin-top: 14px;
    border-top: 2px dashed var(--ink);
    padding-top: 12px;
    text-align: center;
  }
  .receipt footer p {
    display: flex;
    gap: 8px;
    font-weight: 800;
    margin: 0 0 12px;
    max-width: none;
  }
  .receipt footer .thanks {
    justify-content: center;
    font-weight: 500;
    font-size: 11px;
    color: var(--dim);
    margin: 12px 0 0;
  }
  .code {
    display: flex;
    justify-content: center;
  }
  .footnote {
    margin: 36px 0 0;
    font-size: 12px;
    color: var(--dim);
  }
  @media (max-width: 600px) {
    .timezone {
      display: none;
    }
  }
</style>
