<script>
  import Icon from './Icon.svelte';
  import { catalog, validDate, dateLabel, timeLabel } from './events.js';
  import { reveal } from './interaction.js';
  let { saved = [], onopen, ontoggle, savedOnly = $bindable(false) } = $props();
  let day = $state('All');
  const dates = [
    ...new Set(
      catalog
        .filter((e) => validDate(e.startsAt))
        .map((e) => dateLabel(e.startsAt)),
    ),
  ];
  const events = $derived(
    catalog
      .filter(
        (e) =>
          (!savedOnly || saved.includes(e.id)) &&
          (day === 'All' || dateLabel(e.startsAt) === day),
      )
      .toSorted(
        (a, b) =>
          (validDate(a.startsAt) ? Date.parse(a.startsAt) : Infinity) -
          (validDate(b.startsAt) ? Date.parse(b.startsAt) : Infinity),
      ),
  );
</script>

<section
  id="schedule"
  class="section schedule"
  aria-labelledby="schedule-title"
>
  <div class="section-top" use:reveal>
    <div>
      <p class="eyebrow">04 / Make a little room for everything</p>
      <h2 class="section-heading" id="schedule-title">
        .<br /><em>schedule</em>
      </h2>
    </div>
    <p>
      Keep your favourites close. Save events to your plan and find their dates,
      times, and allotted rooms here. All times are in IST.
    </p>
  </div>
  <div class="schedule-tools">
    <div class="views">
      <button
        class:active={!savedOnly}
        aria-pressed={!savedOnly}
        onclick={() => (savedOnly = false)}>All events</button
      ><button
        class:active={savedOnly}
        aria-pressed={savedOnly}
        onclick={() => (savedOnly = true)}
        ><Icon name="bookmark" size={14} /> My plan ({saved.length})</button
      >
    </div>
    {#if dates.length}<label
        ><span class="sr">Filter schedule by day</span><select bind:value={day}
          ><option value="All">All dates</option>{#each dates as date}<option
              >{date}</option
            >{/each}</select
        ></label
      >{/if}<span class="timezone">India Standard Time · UTC +05:30</span>
  </div>
  {#if !dates.length}<p class="schedule-note">
      <Icon name="clock" size={16} /><span
        >The timetable is on its way. Confirmed dates, time slots, and rooms
        will appear here.</span
      >
    </p>{/if}
  <div class="table-head eyebrow" aria-hidden="true">
    <span>Date &amp; time</span><span>The event</span><span
      >Venue / allotted room</span
    ><span>Organizing club</span><span>Save</span>
  </div>
  <div class="schedule-list" aria-live="polite">
    {#each events as event}
      <article class="schedule-row">
        <div class="time">
          <span
            >{validDate(event.startsAt)
              ? dateLabel(event.startsAt)
              : 'Date TBA'}</span
          ><small
            >{validDate(event.startsAt)
              ? timeLabel(event)
              : 'Time TBA'}{event.duration ? ' · ' + event.duration : ''}</small
          >
        </div>
        <button class="event-title" onclick={() => onopen(event.id)}
          ><span class="eyebrow">{event.track}</span><span>{event.name}</span
          ></button
        >
        <div class="location">
          <Icon name="pin" size={14} />
          <div>
            {event.venue || 'Venue TBA'}<small
              >{event.room ||
                (event.mode === 'Online'
                  ? 'Online event · joining details TBA'
                  : 'Room TBA')}</small
            >
          </div>
        </div>
        <span class="club">{event.club || 'Club TBA'}</span><button
          class="icon-button"
          aria-label="{saved.includes(event.id)
            ? 'Remove'
            : 'Save'} {event.name}{saved.includes(event.id)
            ? ' from'
            : ' to'} schedule"
          aria-pressed={saved.includes(event.id)}
          onclick={() => ontoggle(event.id)}
          ><Icon
            name="bookmark"
            size={16}
            filled={saved.includes(event.id)}
          /></button
        >
      </article>
    {/each}
  </div>
  {#if !events.length}<div class="empty">
      <h3>A little space for your favourites.</h3>
      <p>Bookmark events in the directory to see them in your plan.</p>
      <a class="button light" href="#events"
        >Find an event <Icon name="arrow" /></a
      >
    </div>{/if}
  <p class="footnote">
    Your plan is saved in this browser. Saving an event does not register you
    for it.
  </p>
</section>

<style>
  .schedule {
    background: #e4e0d5;
  }
  .schedule-tools {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    border-bottom: 1px solid var(--ink);
  }
  .views {
    display: flex;
    gap: 28px;
  }
  .views button {
    border: 0;
    border-bottom: 2px solid transparent;
    background: none;
    padding: 16px 0;
    display: flex;
    gap: 8px;
    align-items: center;
    font-size: 12px;
    color: var(--dim);
  }
  .views button.active {
    color: var(--ink);
    border-bottom-color: var(--ink);
    font-weight: 600;
  }
  .timezone {
    font-size: 9px;
    color: var(--dim);
  }
  select {
    background: transparent;
    border: 1px solid var(--hair);
    padding: 10px;
    font-size: 11px;
  }
  .schedule-note {
    display: flex;
    gap: 10px;
    align-items: center;
    font-size: 11px;
    padding: 15px 0;
    color: var(--dim);
    margin-bottom: 8px;
  }
  .table-head,
  .schedule-row {
    display: grid;
    grid-template-columns: 1.15fr 1.65fr 1.8fr 1.05fr 44px;
    gap: 20px;
    align-items: center;
  }
  .table-head {
    padding: 18px 0;
    font-size: 8px;
    color: var(--dim);
    border-bottom: 1px solid var(--hair);
  }
  .schedule-row {
    padding: 22px 0;
    border-bottom: 1px solid var(--hair);
  }
  .time {
    font-size: 12px;
    font-weight: 500;
  }
  small {
    font-size: 10px;
    color: var(--dim);
    display: block;
    margin-top: 6px;
    line-height: 1.5;
    font-weight: 400;
  }
  .event-title {
    text-align: left;
    border: 0;
    background: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .event-title .eyebrow {
    font-size: 8px;
    color: var(--red);
  }
  .event-title > span:last-child {
    font-family: var(--type);
    font-size: 34px;
    font-weight: 600;
  }
  .event-title:hover {
    color: var(--red);
  }
  .location {
    display: flex;
    gap: 10px;
    align-items: start;
    font-size: 11px;
    line-height: 1.4;
  }
  .location :global(svg) {
    margin-top: 2px;
  }
  .club {
    font-size: 10px;
    color: var(--dim);
  }
  .footnote {
    font-size: 10px;
    color: var(--dim);
    margin: 20px 0 0;
  }
  @media (max-width: 900px) {
    .club,
    .table-head span:nth-child(4) {
      display: none;
    }
    .table-head,
    .schedule-row {
      grid-template-columns: 1.1fr 1.5fr 1.5fr 44px;
      gap: 15px;
    }
  }
  @media (max-width: 600px) {
    .timezone,
    .table-head {
      display: none;
    }
    .schedule-row {
      grid-template-columns: 1fr 44px;
      gap: 14px 10px;
      position: relative;
      padding: 23px 0;
    }
    .event-title {
      grid-row: 1;
      grid-column: 1;
    }
    .schedule-row > .icon-button {
      grid-row: 1;
      grid-column: 2;
    }
    .time {
      grid-row: 2;
      grid-column: 1;
    }
    .location {
      grid-row: 3;
      grid-column: 1/-1;
    }
    .time small {
      display: inline;
      margin-left: 12px;
    }
    .location small {
      display: inline;
      margin-left: 8px;
    }
    .views {
      gap: 22px;
    }
    .views button {
      font-size: 11px;
    }
    .schedule-note {
      font-size: 11px;
      align-items: start;
    }
  }
</style>
