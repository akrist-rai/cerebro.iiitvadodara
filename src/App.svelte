<script>
  import { onMount } from 'svelte';
  import TopBar from './lib/TopBar.svelte';
  import Hero from './lib/Hero.svelte';
  import Ticker from './lib/Ticker.svelte';

  import Tracks from './lib/Tracks.svelte';
  import Events from './lib/Events.svelte';
  import Schedule from './lib/Schedule.svelte';
  import Partners from './lib/Partners.svelte';

  import Footer from './lib/Footer.svelte';
  import EventDialog from './lib/EventDialog.svelte';
  import Palette from './lib/Palette.svelte';
  import Duotone from './lib/Duotone.svelte';
  import { catalog, readPlan, writePlan, PLAN_KEY } from './lib/events.js';
  import { asciiTrail } from './lib/interaction.js';

  let selected = $state(null);
  let hub = $state(false);
  let registration = $state(false);
  let saved = $state([]);
  let message = $state('');
  let planOnly = $state(false);
  let palette;
  let toastTimer;
  let returnHash = '#events';

  function notify(text) {
    message = text;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (message = ''), 5000);
  }
  function openEvent(id, register = false) {
    const event = catalog.find((item) => item.id === id);
    if (!event) return;
    if (!selected && !hub) returnHash = location.hash || '#events';
    selected = event;
    registration = register;
    hub = false;
    history.pushState(null, '', '#event/' + id);
  }
  function openRegistration() {
    if (!selected && !hub) returnHash = location.hash || '#events';
    selected = null;
    hub = true;
    history.pushState(null, '', '#register');
  }
  function closeDialog() {
    selected = null;
    hub = false;
    registration = false;
    if (location.hash.startsWith('#event/') || location.hash === '#register')
      history.replaceState(null, '', returnHash);
  }
  function toggleSaved(id) {
    saved = saved.includes(id)
      ? saved.filter((item) => item !== id)
      : [...saved, id];
    let persisted = false;
    try {
      persisted = writePlan(localStorage, saved);
    } catch {
      /* Storage can be unavailable in private browsing. */
    }
    const name = catalog.find((item) => item.id === id)?.name;
    notify(
      (saved.includes(id)
        ? name + ' saved to your plan.'
        : name + ' removed from your plan.') +
        (persisted
          ? ''
          : ' Browser storage is unavailable; changes last for this visit.'),
    );
  }
  function syncHash() {
    const match = location.hash.match(/^#event\/([a-z0-9-]+)$/);
    if (match) {
      const event = catalog.find((item) => item.id === match[1]);
      if (event) {
        selected = event;
        hub = false;
        registration = false;
        return;
      }
    }
    selected = null;
    hub = location.hash === '#register';
    registration = false;
  }
  function openPlan() {
    planOnly = true;
    document.getElementById('schedule')?.scrollIntoView({ block: 'start' });
    history.pushState(null, '', '#schedule');
  }
  function onkey(e) {
    const typing =
      /^(input|textarea|select)$/i.test(e.target?.tagName || '') ||
      e.target?.isContentEditable;
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      palette?.show();
    } else if (
      e.key === '/' &&
      !typing &&
      !e.ctrlKey &&
      !e.metaKey &&
      !e.altKey
    ) {
      e.preventDefault();
      palette?.show();
    }
  }

  onMount(() => {
    try {
      saved = readPlan(localStorage);
    } catch {
      saved = [];
    }
    syncHash();
    const storage = (e) => {
      if (e.key === PLAN_KEY || e.key === null) {
        try {
          saved = readPlan(localStorage);
        } catch {
          /* Keep in-memory state. */
        }
      }
    };
    const stopTrail = asciiTrail();
    window.addEventListener('hashchange', syncHash);
    window.addEventListener('popstate', syncHash);
    window.addEventListener('storage', storage);
    window.addEventListener('keydown', onkey);
    return () => {
      clearTimeout(toastTimer);
      stopTrail();
      window.removeEventListener('hashchange', syncHash);
      window.removeEventListener('popstate', syncHash);
      window.removeEventListener('storage', storage);
      window.removeEventListener('keydown', onkey);
    };
  });
</script>

<Duotone />
<a class="skip" href="#events">Skip to events</a>
<div class="page-shell">
  <TopBar
    savedCount={saved.length}
    onregister={openRegistration}
    onplan={openPlan}
    onpalette={() => palette?.show()}
  />
  <main>
    <Hero />
    <Ticker />

    <Tracks onopen={openEvent} />
    <Events {saved} onopen={openEvent} ontoggle={toggleSaved} />
    <Schedule
      {saved}
      onopen={openEvent}
      ontoggle={toggleSaved}
      bind:savedOnly={planOnly}
    />
    <Partners />
  </main>
  <Footer onregister={openRegistration} />
</div>
<EventDialog
  event={selected}
  {hub}
  {registration}
  {saved}
  onclose={closeDialog}
  onopen={openEvent}
  ontoggle={toggleSaved}
  onnotify={notify}
/>
<Palette
  bind:this={palette}
  onopen={openEvent}
  onregister={openRegistration}
  onplan={openPlan}
/>
<div class="toast" class:shown={!!message} role="status" aria-live="polite">
  {message}
</div>

<style>
  .skip {
    position: fixed;
    z-index: 100;
    top: -100px;
    left: 16px;
    background: var(--ink);
    color: var(--gold);
    padding: 12px 18px;
    font-weight: 800;
  }
  .skip:focus {
    top: 10px;
  }
  .toast {
    position: fixed;
    bottom: 22px;
    left: 50%;
    transform: translate(-50%, 20px);
    background: var(--ink);
    color: var(--gold);
    border: 2px solid var(--gold);
    padding: 12px 18px;
    z-index: 100;
    font-size: 13px;
    line-height: 1.5;
    box-shadow: 5px 5px 0 var(--red);
    max-width: calc(100% - 32px);
    width: max-content;
    opacity: 0;
    pointer-events: none;
    transition:
      opacity 0.2s,
      transform 0.2s;
  }
  .toast::before {
    content: '> ' / '';
  }
  .toast.shown {
    opacity: 1;
    transform: translate(-50%, 0);
  }
</style>
