<script>
  import { tick } from 'svelte';
  import Icon from './Icon.svelte';
  import Marked from './Marked.svelte';
  import {
    catalog,
    eventArt,
    registrationState,
    dateLabel,
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
  oncancel={(event) => {
    event.preventDefault();
    close();
  }}
>
  <div class="dialog-top">
    <span class="eyebrow"
      >Cerebro ’26 / {event ? 'The event briefing' : 'Registration desk'}</span
    >{#if event}<button
        class="registration-jump"
        onclick={() => {
          regSection?.querySelector('h3')?.focus({ preventScroll: true });
          regSection?.scrollIntoView({ block: 'start' });
        }}>Registration <Icon name="arrow" size={15} /></button
      >{/if}<button
      class="icon-button"
      aria-label="Close event details"
      onclick={close}><Icon name="close" /></button
    >
  </div>
  {#if event}
    <div class="detail-head">
      <div>
        <span class="pill"
          >{event.track}{event.flagship ? ' / Flagship' : ''}</span
        >
        <h2 id="detail-title" tabindex="-1" bind:this={heading}>
          {event.name}
        </h2>
        <p>{event.meta.join(' · ')}</p>
      </div>
      <img src={eventArt(event)} alt="" width="800" height="1000" />
    </div>
    <div class="detail-actions">
      <button
        class="button light"
        onclick={() => ontoggle(event.id)}
        aria-pressed={saved.includes(event.id)}
        ><Icon
          name="bookmark"
          filled={saved.includes(event.id)}
          size={16}
        />{saved.includes(event.id)
          ? 'Saved to my plan'
          : 'Save to my plan'}</button
      ><button
        class="icon-button"
        aria-label="Copy link to {event.name}"
        onclick={share}><Icon name="share" size={17} /></button
      >{#if calendarContent(event)}<button
          class="button light"
          onclick={() => downloadCalendar(event)}
          ><Icon name="calendar" size={16} /> Add to calendar</button
        >{/if}
    </div>
    <p class="small muted" role="status">{copyStatus}</p>
    {#if showLink}<label class="copy-fallback"
        >Copy this event link<input
          type="text"
          readonly
          value={copyLink}
          onfocus={(e) => e.target.select()}
        /></label
      >{/if}
    <div class="detail-body">
      <div class="overview">
        <h3>What’s the challenge?</h3>
        <div class="event-description">
          <p><Marked text={event.lede} /></p>
          {#each event.more as paragraph}<p>
              <Marked text={paragraph} />
            </p>{/each}
        </div>
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
          {#if safeUrl(event.rulesUrl)}<a
              class="text-link"
              href={safeUrl(event.rulesUrl)}
              target="_blank"
              rel="noopener noreferrer"
              >Read the official rulebook <Icon
                name="diagonal"
                size={15}
              /><span class="sr"> (opens in a new tab)</span></a
            >{:else}<p class="small muted">
              The detailed rulebook will be published by the organizing team.
            </p>{/if}
        </div>
        <div class="organizers">
          <h3>The people behind it</h3>
          <p class="small">
            <strong>Organizing club:</strong>
            {pendingText(event.club)}
          </p>
          {#if event.organizers.length}<ul>
              {#each event.organizers as person}<li>
                  <strong>{person.name}</strong><span
                    >{person.role || 'Event organizer'}</span
                  >{#if person.email}<a href={'mailto:' + person.email}
                      >{person.email}</a
                    >{/if}{#if person.phone}<a
                      href={'tel:' + person.phone.replace(/[^+\d]/g, '')}
                      >{person.phone}</a
                    >{/if}
                </li>{/each}
            </ul>{:else}<p class="small muted">
              Event organizers, their roles, and contact details will be
              announced here.
            </p>{/if}
        </div>
      </div>
      <aside class="practical">
        <h3>The essentials</h3>
        <dl>
          <div>
            <dt><Icon name="calendar" size={16} /> Date</dt>
            <dd>{dateLabel(event.startsAt)}</dd>
          </div>
          <div>
            <dt><Icon name="clock" size={16} /> Time</dt>
            <dd>{timeLabel(event)}</dd>
          </div>
          <div>
            <dt><Icon name="pin" size={16} /> Venue / platform</dt>
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
          <div>
            <dt><Icon name="trophy" size={16} /> Prizes</dt>
            <dd>{pendingText(event.prize)}</dd>
          </div>
          <div>
            <dt>Entry fee</dt>
            <dd>
              {event.fee === 0
                ? 'Free entry'
                : event.fee === null
                  ? 'To be announced'
                  : '₹' + event.fee.toLocaleString('en-IN')}
            </dd>
          </div>
        </dl>
        <p class="small muted">
          All event times are shown in India Standard Time (IST).
        </p>
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
                : 'this is where you register for the events'}
        </h3>
        <span class="pill" class:open={state.key === 'open'}
          ><span class="dot"></span>{state.label}</span
        >{#if validDate(event.registration.deadline)}<p class="small">
            Registration deadline: {dateLabel(event.registration.deadline)} · {timeLabel(
              { startsAt: event.registration.deadline },
            )}
          </p>{/if}
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
        {#if state.url}<a
            class="button"
            href={state.url}
            target="_blank"
            rel="noopener noreferrer"
            >Register for {event.name}<Icon name="diagonal" /><span class="sr">
              (opens in a new tab)</span
            ></a
          >{:else}<button class="button" disabled
            >{state.key === 'upcoming'
              ? 'Registration opening soon'
              : state.label}</button
          >{/if}<span>Saving to your plan is not a registration.</span>
      </div>
    </section>
  {:else if hub}
    <p class="eyebrow desk-label">Nine events. Find your starting line.</p>
    <h2 id="detail-title" tabindex="-1" bind:this={heading}>
      Make your <em>move.</em>
    </h2>
    <p class="hub-intro">
      Choose an event to see its registration status, team requirements, and
      entry details.
    </p>
    <div class="registration-list">
      {#each catalog as item}{@const registrationStatus =
          registrationState(item)}<button onclick={() => onopen(item.id, true)}
          ><img src={eventArt(item.track)} alt="" width="48" height="60" /><span
            ><strong>{item.name}</strong><small
              >{item.teamSize || 'Team size TBA'} · {item.track}</small
            ></span
          ><span class="hub-status">{registrationStatus.label}</span><Icon
            name="diagonal"
            size={18}
          /></button
        >{/each}
    </div>
  {/if}
</dialog>

<style>
  .event-dialog {
    width: min(1060px, calc(100% - 48px));
    max-height: 90dvh;
    border: 1px solid var(--ink);
    padding: 26px 36px 36px;
    background: var(--paper-hi);
    overscroll-behavior: contain;
    scroll-behavior: auto;
  }
  .event-dialog::backdrop {
    background: #191916bb;
    backdrop-filter: blur(6px);
  }
  .dialog-top {
    position: sticky;
    top: -26px;
    z-index: 8;
    padding-top: 12px;
    background: var(--paper-hi);
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--hair);
    padding-bottom: 18px;
  }
  .registration-jump {
    margin-left: auto;
    margin-right: 15px;
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 12px;
    background: var(--ink);
    color: var(--paper);
    border: 0;
    font-size: 10px;
  }
  @media (max-width: 600px) {
    .dialog-top > .eyebrow {
      max-width: 100px;
    }
    .registration-jump {
      margin-right: 8px;
      padding: 12px 9px;
    }
  }
  .dialog-top .eyebrow {
    font-size: 9px;
  }
  .dialog-top .icon-button {
    position: relative;
    z-index: 1;
    transform: none;
    flex-shrink: 0;
  }
  .detail-head {
    display: grid;
    grid-template-columns: 1fr 145px;
    gap: 22px;
    align-items: center;
    padding-top: 30px;
  }
  .detail-head img {
    height: 160px;
    width: 128px;
    object-fit: cover;
    transform: rotate(5deg);
    justify-self: center;
  }
  h2 {
    font-family: var(--type);
    font-size: clamp(64px, 8vw, 100px);
    line-height: 0.95;
    letter-spacing: -0.02em;
    font-weight: 600;
    margin: 18px 0 10px;
  }
  h2 em {
    color: var(--red);
    font-weight: 500;
  }
  h2:focus {
    outline: none;
  }
  .detail-head p {
    font-size: 11px;
    color: var(--dim);
    margin: 0;
  }
  .detail-actions {
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
    margin: 24px 0 32px;
  }
  .detail-actions .button {
    padding: 11px 15px;
    min-height: 42px;
    font-size: 10px;
  }
  .detail-body {
    display: grid;
    grid-template-columns: 1.6fr 1fr;
    gap: 40px;
  }
  h3 {
    font-family: var(--type);
    font-size: 34px;
    font-weight: 600;
    margin: 0 0 16px;
    line-height: 1.1;
  }
  .event-description {
    font-size: 12px;
    color: var(--dim);
  }
  .event-description :global(b) {
    color: var(--ink);
    font-weight: 600;
  }
  .practical {
    background: var(--paper-2);
    padding: 22px 24px;
    align-self: start;
  }
  .practical h3 {
    font-size: 31px;
  }
  dl {
    margin: 0;
  }
  dl > div {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    padding: 13px 0;
    border-bottom: 1px solid var(--hair);
    font-size: 11px;
  }
  dt {
    color: var(--dim);
    display: flex;
    gap: 7px;
    align-items: start;
  }
  dd {
    margin: 0;
    line-height: 1.55;
    overflow-wrap: anywhere;
  }
  .practical dl > div {
    grid-template-columns: 1fr;
  }
  .practical dd {
    font-weight: 500;
  }
  .practical > p {
    margin-top: 18px;
  }
  .small {
    font-size: 11px;
  }
  .rules,
  .organizers {
    border-top: 1px solid var(--hair);
    margin-top: 27px;
    padding-top: 22px;
  }
  .rules > p,
  .rules > a {
    margin-top: 20px;
  }
  .organizers ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .organizers li {
    display: flex;
    flex-direction: column;
    font-size: 11px;
    gap: 5px;
    padding: 12px 0;
  }
  .organizers li span {
    color: var(--dim);
  }
  .registration {
    background: var(--paper-2);
    border-top: 2px solid var(--ink);
    padding: 28px;
    margin-top: 35px;
    display: grid;
    grid-template-columns: 1.3fr 1fr;
    gap: 28px;
    scroll-margin-top: 85px;
  }
  .registration .eyebrow {
    font-size: 8px;
    color: var(--red);
  }
  .registration h3 {
    font-size: 44px;
    margin-bottom: 17px;
  }
  .registration-copy {
    font-size: 11px;
    color: var(--dim);
    margin: 16px 0 0;
  }
  .registration-action {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 13px;
  }
  .registration-action > span {
    font-size: 9px;
    text-align: center;
    color: var(--dim);
  }
  .registration .button {
    font-size: 11px;
  }
  .registration .button:disabled {
    opacity: 1;
    background: #d1ccbf;
    border-color: #aaa398;
    color: #59564f;
  }
  .desk-label {
    margin-top: 32px;
    color: var(--red);
  }
  .hub-intro {
    font-size: 13px;
    color: var(--dim);
    max-width: 500px;
  }
  .registration-list {
    margin-top: 30px;
  }
  .registration-list button {
    background: none;
    border: 0;
    border-top: 1px solid var(--hair);
    display: flex;
    align-items: center;
    gap: 18px;
    text-align: left;
    padding: 16px 0;
    width: 100%;
  }
  .registration-list button:hover strong {
    color: var(--red);
  }
  .registration-list img {
    width: 48px;
    height: 60px;
    object-fit: cover;
  }
  .registration-list strong {
    display: block;
    font-family: var(--type);
    font-size: 32px;
    font-weight: 600;
  }
  .registration-list small {
    display: block;
    margin-top: 4px;
    font-size: 10px;
    color: var(--dim);
  }
  .hub-status {
    margin-left: auto;
    font-size: 10px;
    color: var(--dim);
  }
  .copy-fallback {
    display: grid;
    gap: 9px;
    font-size: 11px;
    margin-bottom: 25px;
  }
  .copy-fallback input {
    padding: 12px;
    background: var(--paper);
    border: 1px solid var(--hair);
    width: 100%;
    font-size: 11px;
  }
  @media (max-width: 700px) {
    .event-dialog {
      max-width: none;
      width: 100%;
      max-height: 100dvh;
      height: 100dvh;
      margin: 0;
      padding: 20px;
      border: 0;
    }
    .detail-head {
      grid-template-columns: 1fr 75px;
    }
    .detail-head img {
      width: 68px;
      height: 85px;
    }
    h2 {
      font-size: 62px;
    }
    .detail-body {
      grid-template-columns: 1fr;
      gap: 24px;
    }
    .practical {
      grid-row: 1;
    }
    .practical dl {
      display: grid;
      grid-template-columns: 1fr 1fr;
      column-gap: 20px;
    }
    .practical h3 {
      font-size: 34px;
    }
    .registration {
      grid-template-columns: 1fr;
      padding: 24px 20px;
      gap: 18px;
    }
    .registration h3 {
      font-size: 41px;
    }
    .registration-list button {
      gap: 12px;
    }
    .hub-status {
      display: none;
    }
    .registration-list button > :global(svg) {
      margin-left: auto;
    }
    .registration-list strong {
      font-size: 30px;
    }
    .event-description {
      font-size: 13px;
    }
  }
</style>
