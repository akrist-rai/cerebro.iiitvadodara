<script>
  import { tick } from 'svelte';
  import Icon from './Icon.svelte';
  import Marked from './Marked.svelte';
  import AsciiScene from './AsciiScene.svelte';
  import Art from './Art.svelte';
  import { eventArt } from './art.js';
  import { FEST_DETAILS } from './event-details.js';
  import {
    directory,
    registrationState,
    dateLabel,
    whenLabel,
    timeLabel,
    pendingText,
    safeUrl,
    validDate,
    calendarContent,
    downloadCalendar,
  } from './events.js';

  let {
    event = null,
    hub = false,
    registration = false,
    saved = [],
    onclose,
    onopen,
    ontoggle,
    onnotify,
  } = $props();
  let dialog = $state();
  let heading = $state();
  let regSection = $state();
  let showLink = $state(false);
  let copyLink = $state('');
  let copyStatus = $state('');
  let now = $state(Date.now());
  const state = $derived(event ? registrationState(event, now) : null);
  // An event's own poster is never blown up past 1.5x its pixels.
  const ownPoster = $derived(event ? eventArt(event) : null);

  $effect(() => {
    if (!event && !hub) return;
    now = Date.now();
    const timer = setInterval(() => (now = Date.now()), 30000);
    return () => clearInterval(timer);
  });
  $effect(() => {
    const isOpen = !!event || hub;
    const wantsRegistration = registration;
    const currentId = event?.id;
    if (!dialog) return;
    if (isOpen) {
      if (!dialog.open) dialog.showModal();
      tick().then(() => {
        if (wantsRegistration && currentId) {
          regSection?.querySelector('h3')?.focus({ preventScroll: true });
          regSection?.scrollIntoView({ block: 'start' });
        } else {
          dialog?.scrollTo(0, 0);
          heading?.focus({ preventScroll: true });
        }
      });
    } else if (dialog.open) dialog.close();
  });
  $effect(() => {
    if (event?.id) {
      showLink = false;
      copyStatus = '';
    }
  });
  function close() {
    onclose();
  }
  async function share() {
    copyLink =
      location.origin +
      location.pathname +
      location.search +
      '#event/' +
      event.id;
    try {
      await navigator.clipboard.writeText(copyLink);
      copyStatus = 'Event link copied.';
      onnotify(copyStatus);
    } catch {
      showLink = true;
    }
  }
</script>

<dialog
  class="event-dialog"
  bind:this={dialog}
  aria-labelledby="detail-title"
  onclose={close}
  oncancel={(e) => {
    e.preventDefault();
    close();
  }}
>
  <div class="dialog-top">
    <span class="path"
      ><i aria-hidden="true" class="dot"></i> cerebro://{event
        ? 'events/' + event.id
        : 'register'}</span
    >{#if event}<button
        class="registration-jump"
        onclick={() => {
          regSection?.querySelector('h3')?.focus({ preventScroll: true });
          regSection?.scrollIntoView({ block: 'start' });
        }}>Registration <Icon name="arrow" size={14} /></button
      >{/if}<button
      class="icon-button"
      aria-label="Close event details"
      onclick={close}><Icon name="close" /></button
    >
  </div>

  {#if event}
    <div class="detail-head">
      <div class="titles">
        <span class="pill"
          >{event.track}{event.flagship ? ' / Flagship' : ''}{event.kind ===
          'zone'
            ? ' / Zone'
            : ''}</span
        >
        <h2 id="detail-title" tabindex="-1" bind:this={heading}>
          {event.name}
        </h2>
        <p class="meta">{event.meta.join(' · ')}</p>
        <div class="detail-actions">
          <button
            class="btn small"
            onclick={() => ontoggle(event.id)}
            aria-pressed={saved.includes(event.id)}
          >
            <Icon name="bookmark" filled={saved.includes(event.id)} size={15} />
            {saved.includes(event.id) ? 'Saved to my plan' : 'Save to my plan'}
          </button>
          <button
            class="btn small ghost"
            aria-label="Copy link to {event.name}"
            onclick={share}
          >
            <Icon name="share" size={15} /> Link
          </button>
          {#if calendarContent(event)}
            <button
              class="btn small ghost"
              onclick={() => downloadCalendar(event)}
            >
              <Icon name="calendar" size={15} /> Add to calendar
            </button>
          {/if}
        </div>
        <p class="small" role="status">{copyStatus}</p>
        {#if showLink}
          <label class="copy-fallback"
            >Copy this event link<input
              type="text"
              readonly
              value={copyLink}
              onfocus={(e) => e.target.select()}
            /></label
          >
        {/if}
      </div>
      <div
        class="scene"
        aria-hidden="true"
        style:max-width={ownPoster?.own ? `${ownPoster.w * 1.5}px` : null}
      >
        {#key event.id}
          {@const p = eventArt(event)}
          {#if p.own}
            <!-- the event's own poster, whole and in its own colours -->
            <Art id={p.id} eager />
          {:else}
            <Art
              id={p.id}
              tone={p.tone}
              pos={p.pos}
              ratio="56 / 52"
              dots={0.45}
              ghost
              eager
            />
            <div class="over">
              <AsciiScene {event} cols={56} rows={27} animate />
            </div>
          {/if}
        {/key}
      </div>
    </div>

    <div class="detail-body">
      <div class="overview">
        <h3>What’s the challenge?</h3>
        <div class="event-description">
          <p><Marked text={event.lede} /></p>
          {#each event.more as paragraph}<p>
              <Marked text={paragraph} />
            </p>{/each}
          {#if event.objective}<p class="objective">
              <span class="k">objective</span>
              {event.objective}
            </p>{/if}
        </div>

        {#each event.details as group}
          <div class="group">
            <h3>{group.title}</h3>
            <ul class="bullets">
              {#each group.items as item}<li>{item}</li>{/each}
            </ul>
          </div>
        {/each}

        {#if event.rules.length}
          <div class="group">
            <h3>Rules &amp; regulations</h3>
            <ol class="rules-list">
              {#each event.rules as rule}<li>{rule}</li>{/each}
            </ol>
          </div>
        {/if}

        <div class="rules">
          <h3>Before you enter</h3>
          <dl>
            <div>
              <dt>Team size</dt>
              <dd>{pendingText(event.teamSize)}</dd>
            </div>
            <div>
              <dt>Eligibility</dt>
              <dd>{pendingText(event.eligibility)}</dd>
            </div>
            <div>
              <dt>Capacity</dt>
              <dd>{pendingText(event.capacity)}</dd>
            </div>
            <div>
              <dt>Duration</dt>
              <dd>{pendingText(event.duration)}</dd>
            </div>
          </dl>
          {#each event.notes as note}<p class="small note">› {note}</p>{/each}
          {#if safeUrl(event.rulesUrl)}
            <a
              class="link"
              href={safeUrl(event.rulesUrl)}
              target="_blank"
              rel="noopener noreferrer"
              >Read the official rulebook <Icon
                name="diagonal"
                size={15}
              /><span class="sr"> (opens in a new tab)</span></a
            >
          {:else}
            <p class="small muted">
              The detailed rulebook will be published by the organizing team.
            </p>
          {/if}
          {#each event.links as link}
            {#if safeUrl(link.url)}
              <a
                class="link"
                href={safeUrl(link.url)}
                target="_blank"
                rel="noopener noreferrer"
                >{link.label}
                <Icon name="diagonal" size={15} /><span class="sr">
                  (opens in a new tab)</span
                ></a
              >
            {/if}
          {/each}
        </div>

        <div class="organizers">
          <h3>The people behind it</h3>
          <p class="small">
            <strong>Organizing club:</strong>
            {pendingText(event.club)}
          </p>
          {#if event.organizers.length}
            <ul>
              {#each event.organizers as person}
                <li>
                  <strong>{person.name}</strong><span
                    >{person.role || 'Event organizer'}</span
                  >
                  {#if person.email}<a href={'mailto:' + person.email}
                      >{person.email}</a
                    >{/if}
                  {#if person.phone}<a
                      href={'tel:' + person.phone.replace(/[^+\d]/g, '')}
                      >{person.phone}</a
                    >{/if}
                </li>
              {/each}
            </ul>
          {:else}
            <p class="small muted">
              Event organizers, their roles, and contact details will be
              announced here.
            </p>
          {/if}
        </div>
      </div>

      <aside class="side">
        <div class="practical">
          <h3>The essentials</h3>
          <dl>
            <div>
              <dt><Icon name="calendar" size={15} /> Date</dt>
              <dd>{whenLabel(event)}</dd>
            </div>
            <div>
              <dt><Icon name="clock" size={15} /> Time</dt>
              <dd>{timeLabel(event)}</dd>
            </div>
            <div>
              <dt><Icon name="pin" size={15} /> Venue / platform</dt>
              <dd>{pendingText(event.venue)}</dd>
            </div>
            <div>
              <dt>Allotted room</dt>
              <dd>
                {event.mode === 'Online'
                  ? 'Online event'
                  : pendingText(event.room)}
              </dd>
            </div>
            <div>
              <dt>Format</dt>
              <dd>{pendingText(event.mode)}</dd>
            </div>
          </dl>
          <p class="small muted">
            All event times are shown in India Standard Time (IST).
          </p>
        </div>
      </aside>
    </div>

    <section
      class="registration"
      id="event-registration"
      bind:this={regSection}
      aria-labelledby="registration-title"
    >
      <div>
        <p class="eyebrow">Your place at the starting line</p>
        <h3 id="registration-title" tabindex="-1">
          {state.key === 'open'
            ? 'Ready when you are.'
            : state.key === 'closed'
              ? 'See you at the next one.'
              : state.key === 'full'
                ? 'This one is fully booked.'
                : 'Registration opens soon.'}
        </h3>
        <span class="pill" class:open={state.key === 'open'}
          ><span class="dot"></span>{state.label}</span
        >
        {#if validDate(event.registration.deadline)}
          <p class="small">
            Registration deadline: {dateLabel(event.registration.deadline)} · {timeLabel(
              { startsAt: event.registration.deadline },
            )}
          </p>
        {/if}
        <p class="registration-copy">
          {state.key === 'open'
            ? 'Continue to the official registration form to submit your entry. Your registration is complete only when confirmed there.'
            : state.key === 'closed'
              ? 'The registration window for this event has ended. You can still browse the event information above.'
              : state.key === 'full'
                ? 'The available places for this event have been filled. Check back for any updates from the organizers.'
                : 'The organizing team hasn’t published the registration link yet. Save this event to your plan and check back for the opening date.'}
        </p>
      </div>
      <div class="registration-action">
        {#if state.url}
          <a
            class="btn red"
            href={state.url}
            target="_blank"
            rel="noopener noreferrer"
            >Register for {event.name}<Icon name="diagonal" /><span class="sr">
              (opens in a new tab)</span
            ></a
          >
        {:else}
          <button class="btn" disabled
            >{state.key === 'upcoming'
              ? 'Registration opening soon'
              : state.label}</button
          >
        {/if}
        <span>Saving to your plan is not a registration.</span>
      </div>
    </section>
  {:else if hub}
    <p class="eyebrow desk-label">Fifteen events. Find your starting line.</p>
    <h2 id="detail-title" tabindex="-1" bind:this={heading}>
      Make your <em>move.</em>
    </h2>
    <p class="hub-intro">
      Choose an event to see its registration status, team requirements, and
      entry details.
    </p>
    <a
      class="hub-fest"
      href={FEST_DETAILS.url}
      target="_blank"
      rel="noopener noreferrer"
      >All events on Unstop<Icon name="diagonal" size={14} /><span class="sr">
        (opens in a new tab)</span
      ></a
    >
    <ul class="registration-list">
      {#each directory as item}
        {@const registrationStatus = registrationState(item)}
        <li>
          <button onclick={() => onopen(item.id, true)}>
            <span class="no">{String(item.num).padStart(2, '0')}</span>
            <span class="who"
              ><strong>{item.name}</strong><small
                >{item.teamSize || 'Team size TBA'} · {item.track}</small
              ></span
            >
            <span class="hub-status">{registrationStatus.label}</span>
            <Icon name="diagonal" size={16} />
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</dialog>

<style>
  .event-dialog {
    width: min(1100px, calc(100% - 32px));
    max-height: 92dvh;
    border: 2px solid var(--ink);
    padding: 0 clamp(18px, 3vw, 36px) 36px;
    background: var(--paper-hi);
    box-shadow: 8px 8px 0 var(--ink);
    overscroll-behavior: contain;
    scroll-behavior: auto;
  }
  .event-dialog::backdrop {
    background: repeating-linear-gradient(
      135deg,
      #161619dd 0 6px,
      #161619ee 6px 7px
    );
  }
  .dialog-top {
    position: sticky;
    top: 0;
    z-index: 8;
    padding: 10px 0;
    background: var(--paper-hi);
    display: flex;
    gap: 10px;
    align-items: center;
    border-bottom: 2px solid var(--ink);
  }
  .path {
    font-family: var(--pixel);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .path .dot {
    color: var(--red);
    margin-right: 6px;
  }
  .registration-jump {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 9px 12px;
    background: var(--ink);
    color: var(--gold);
    border: 0;
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
  }
  .dialog-top .icon-button {
    flex-shrink: 0;
  }
  .dialog-top > :global(.icon-button:only-child),
  .path + .icon-button {
    margin-left: auto;
  }
  .detail-head {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 340px);
    gap: 24px;
    align-items: center;
    padding: 28px 0 22px;
  }
  /* the event's poster, with its ASCII scene struck over it in gold */
  .scene {
    position: relative;
    width: 100%;
    margin-inline: auto;
    border: 2px solid var(--ink);
    background: var(--ink);
    color: var(--gold);
    box-shadow: 7px 7px 0 var(--red);
  }
  .scene .over {
    position: absolute;
    inset: 0;
    overflow: hidden;
    display: grid;
    align-items: center;
    mix-blend-mode: screen;
    opacity: 0.92;
  }
  h2 {
    font-size: clamp(34px, 6vw, 76px);
    font-weight: 800;
    letter-spacing: -0.05em;
    text-transform: uppercase;
    line-height: 0.95;
    margin: 16px 0 10px;
    overflow-wrap: anywhere;
  }
  h2 em {
    font-style: normal;
    background: var(--ink);
    color: var(--gold);
    padding: 0 0.1em;
  }
  h2:focus {
    outline: none;
  }
  .meta {
    margin: 0;
    color: var(--dim);
  }
  .detail-actions {
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
    margin: 18px 0 4px;
  }
  .small {
    font-size: 12px;
    margin: 6px 0 0;
  }
  .muted {
    color: var(--dim);
  }
  .detail-body {
    display: grid;
    grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
    gap: clamp(24px, 3vw, 44px);
    align-items: start;
  }
  h3 {
    font-size: 15px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.02em;
    margin: 0 0 12px;
    padding-bottom: 8px;
    border-bottom: 2px solid var(--ink);
  }
  .event-description p {
    margin: 0 0 12px;
  }
  .event-description .objective {
    border-left: 4px solid var(--red);
    padding: 4px 0 4px 12px;
    color: var(--dim);
  }
  .k {
    font-family: var(--pixel);
    font-size: 10px;
    text-transform: uppercase;
    color: var(--red);
    margin-right: 6px;
  }
  .group,
  .rules,
  .organizers {
    margin-top: 28px;
  }
  .bullets li {
    padding: 4px 0 4px 20px;
    position: relative;
    border-bottom: 1px dashed var(--hair);
  }
  .bullets li::before {
    content: '›' / '';
    position: absolute;
    left: 4px;
    color: var(--red);
    font-weight: 800;
  }
  .rules-list {
    counter-reset: r;
    padding: 0;
    margin: 0;
    list-style: none;
  }
  .rules-list li {
    counter-increment: r;
    display: grid;
    grid-template-columns: 34px 1fr;
    padding: 6px 0;
    border-bottom: 1px dashed var(--hair);
  }
  .rules-list li::before {
    content: counter(r, decimal-leading-zero);
    font-family: var(--pixel);
    font-size: 10px;
    color: var(--red);
    padding-top: 4px;
  }
  dl {
    margin: 0;
  }
  dl > div {
    display: grid;
    grid-template-columns: 130px 1fr;
    gap: 10px;
    padding: 9px 0;
    border-bottom: 1px dashed var(--hair);
    font-size: 13px;
  }
  dt {
    color: var(--dim);
    display: flex;
    gap: 7px;
    align-items: start;
  }
  dd {
    margin: 0;
    overflow-wrap: anywhere;
    font-weight: 600;
  }
  .note {
    margin-top: 10px;
  }
  .rules > p,
  .rules > a {
    margin-top: 14px;
    display: block;
  }
  .organizers ul {
    display: grid;
    gap: 0;
  }
  .organizers li {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 10px 0;
    border-bottom: 1px dashed var(--hair);
    font-size: 13px;
  }
  .organizers li span {
    color: var(--dim);
  }
  .organizers li a {
    font-size: 12.5px;
    width: fit-content;
  }
  .side {
    display: grid;
    gap: 22px;
    position: sticky;
    top: 70px;
  }
  .practical {
    background: var(--paper-2);
    border: 2px solid var(--ink);
    padding: 18px;
  }
  .practical dl > div {
    grid-template-columns: 1fr;
    gap: 2px;
  }
  .registration {
    background: var(--paper-2);
    border: 2px solid var(--ink);
    padding: 24px;
    margin-top: 34px;
    display: grid;
    grid-template-columns: 1.3fr 1fr;
    gap: 28px;
    scroll-margin-top: 70px;
  }
  .registration .eyebrow {
    color: var(--red);
  }
  .registration h3 {
    font-size: clamp(20px, 3vw, 30px);
    text-transform: none;
    border: 0;
    margin: 6px 0 14px;
    padding: 0;
  }
  .registration h3:focus {
    outline: none;
    text-decoration: underline;
    text-decoration-thickness: 3px;
    text-underline-offset: 5px;
  }
  .registration-copy {
    font-size: 13px;
    color: var(--dim);
    margin: 14px 0 0;
  }
  .registration-action {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 12px;
  }
  .registration-action > span {
    font-size: 11px;
    text-align: center;
    color: var(--dim);
  }
  .registration .btn:disabled {
    opacity: 1;
    background: var(--paper);
    color: var(--dim);
    border-style: dashed;
    box-shadow: none;
  }
  .desk-label {
    margin-top: 26px;
    color: var(--red);
  }
  .hub-intro {
    color: var(--dim);
    max-width: 52ch;
  }
  .hub-fest {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 14px;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--red);
  }
  .hub-fest:hover {
    color: var(--ink);
  }
  .registration-list {
    margin-top: 24px;
    border-top: 2px solid var(--ink);
  }
  .registration-list button {
    background: none;
    border: 0;
    border-bottom: 1px dashed var(--hair);
    display: flex;
    align-items: center;
    gap: 16px;
    text-align: left;
    padding: 12px 6px;
    width: 100%;
  }
  .registration-list button:hover {
    background: var(--ink);
    color: var(--gold);
  }
  .registration-list .no {
    font-family: var(--pixel);
    font-size: 11px;
    color: var(--red);
    width: 24px;
  }
  .registration-list strong {
    display: block;
    font-size: 17px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: -0.02em;
  }
  .registration-list small {
    display: block;
    font-size: 11px;
    color: var(--dim);
  }
  .registration-list button:hover small,
  .registration-list button:hover .no {
    color: var(--paper);
  }
  .hub-status {
    margin-left: auto;
    font-size: 11px;
    color: var(--dim);
  }
  .copy-fallback {
    display: grid;
    gap: 8px;
    font-size: 12px;
    margin-top: 10px;
  }
  .copy-fallback input {
    padding: 10px;
    background: var(--paper);
    border: 2px solid var(--ink);
    width: 100%;
    font: inherit;
  }
  @media (max-width: 800px) {
    .event-dialog {
      width: 100%;
      max-width: none;
      max-height: 100dvh;
      height: 100dvh;
      margin: 0;
      border: 0;
      box-shadow: none;
    }
    .detail-head,
    .detail-body {
      grid-template-columns: 1fr;
    }
    .scene {
      order: -1;
    }
    .side {
      position: static;
    }
    .registration {
      grid-template-columns: 1fr;
      padding: 20px;
    }
    .hub-status {
      display: none;
    }
    .registration-list button > :global(svg) {
      margin-left: auto;
    }
  }
</style>
