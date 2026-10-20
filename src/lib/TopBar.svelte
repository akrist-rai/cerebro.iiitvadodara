<script>
  import Icon from './Icon.svelte';
  import { decode } from './interaction.js';
  let {
    savedCount = 0,
    onregister = () => {},
    onplan = () => {},
    onpalette = () => {},
  } = $props();
  let menu = $state();
  let opened = $state(false);
  const links = [
    ['about', 'About'],
    ['tracks', 'Tracks'],
    ['events', 'Events'],
    ['schedule', 'Schedule'],
    ['partners', 'Partners'],
  ];
  function close() {
    menu.close();
    opened = false;
  }
</script>

<header class="bar">
  <a class="brand" href="#top" aria-label="Cerebro 26 home">
    <span class="mark" aria-hidden="true"></span><span
      >CEREBRO<sup>’26</sup></span
    >
  </a>
  <nav class="desktop" aria-label="Main navigation">
    {#each links as [id, label], i}
      <a href="#{id}"
        ><span class="n">{String(i + 1).padStart(2, '0')}</span><span
          use:decode={{ hover: true, duration: 380 }}>{label}</span
        ></a
      >
    {/each}
  </nav>
  <div class="right">
   
    <button
      class="plan-link"
      onclick={onplan}
      aria-label="My schedule, {savedCount} saved events"
    >
      <Icon name="bookmark" size={16} /><span
        >{String(savedCount).padStart(2, '0')}</span
      >
    </button>
    <button class="register" onclick={onregister}>Register</button>
    <button
      class="menu-button"
      aria-label="Open navigation"
      aria-expanded={opened}
      aria-controls="mobile-menu"
      onclick={() => {
        menu.showModal();
        opened = true;
      }}><span></span><span></span><span></span></button
    >
  </div>
</header>

<dialog
  id="mobile-menu"
  class="mobile-menu"
  bind:this={menu}
  onclose={() => (opened = false)}
>
  <div class="menu-head">
    <span class="eyebrow">cerebro/26 &gt; index</span>
    <button class="icon-button" aria-label="Close navigation" onclick={close}
      ><Icon name="close" /></button
    >
  </div>
  <nav aria-label="Mobile navigation">
    {#each links as [id, label], i}
      <a href="#{id}" onclick={close}
        ><span class="eyebrow">{String(i + 1).padStart(2, '0')}</span
        >{label}<Icon name="diagonal" size={22} /></a
      >
    {/each}
  </nav>
  <button
    class="btn red"
    onclick={() => {
      close();
      onregister();
    }}>Find your event <Icon name="arrow" /></button
  >
  <p class="eyebrow foot">Beyond the horizon · IIIT Vadodara</p>
</dialog>

<style>
  .bar {
    position: sticky;
    top: 0;
    z-index: 30;
    height: var(--bar);
    padding: 0 var(--gutter);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    border-bottom: 2px solid var(--ink);
    background: var(--paper);
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 9px;
    font-weight: 800;
    font-size: 17px;
    letter-spacing: -0.03em;
    text-decoration: none;
    white-space: nowrap;
  }
  .mark {
    width: 16px;
    height: 16px;
    background: var(--red);
    box-shadow: 4px 4px 0 var(--ink);
    margin-right: 4px;
  }
  .brand sup {
    font-size: 10px;
    color: var(--red);
    margin-left: 3px;
    vertical-align: top;
    position: relative;
    top: 2px;
  }
  .desktop {
    display: flex;
    gap: 22px;
  }
  .desktop a {
    display: flex;
    gap: 6px;
    align-items: baseline;
    font-size: 12px;
    text-decoration: none;
    font-weight: 600;
    padding: 12px 0;
    text-transform: lowercase;
  }
  .desktop .n {
    font-family: var(--pixel);
    font-size: 9px;
    color: var(--red);
  }
  .desktop a:hover {
    background: var(--ink);
    color: var(--lime);
    margin: 0 -6px;
    padding: 12px 6px;
  }
  .right {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .cmd,
  .plan-link {
    display: flex;
    align-items: center;
    gap: 7px;
    height: 32px;
    padding: 0 9px;
    background: none;
    border: 2px solid var(--ink);
    font-size: 11px;
    font-weight: 700;
  }
  .cmd kbd {
    font: inherit;
    font-size: 10px;
    color: var(--dim);
  }
  .cmd:hover,
  .plan-link:hover {
    background: var(--ink);
    color: var(--lime);
  }
  .register {
    height: 32px;
    padding: 0 12px;
    border: 2px solid var(--ink);
    background: var(--red);
    color: var(--paper-hi);
    font-weight: 800;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    box-shadow: 3px 3px 0 var(--ink);
  }
  .register::before {
    content: '[ ' / '';
  }
  .register::after {
    content: ' ]' / '';
  }
  .register:hover {
    background: var(--ink);
    color: var(--lime);
  }
  .menu-button {
    display: none;
    width: 40px;
    height: 36px;
    background: none;
    border: 2px solid var(--ink);
    place-content: center;
    gap: 4px;
  }
  .menu-button span {
    width: 18px;
    height: 2px;
    background: var(--ink);
  }
  .mobile-menu {
    width: 100%;
    max-width: none;
    height: 100dvh;
    max-height: none;
    padding: 20px var(--gutter);
    margin: 0;
    border: 0;
    background: var(--paper);
  }
  .mobile-menu::backdrop {
    background: var(--ink);
  }
  .menu-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .mobile-menu nav {
    margin: 36px 0;
  }
  .mobile-menu nav a {
    font-size: 34px;
    font-weight: 800;
    letter-spacing: -0.04em;
    display: flex;
    align-items: center;
    gap: 16px;
    border-bottom: 2px solid var(--ink);
    padding: 12px 0;
    text-decoration: none;
    text-transform: lowercase;
  }
  .mobile-menu nav a :global(svg) {
    margin-left: auto;
  }
  .mobile-menu nav .eyebrow {
    color: var(--red);
  }
  .foot {
    margin: 28px 0 0;
    color: var(--dim);
  }
  @media (max-width: 1080px) {
    .desktop {
      gap: 14px;
    }
    .cmd kbd {
      display: none;
    }
  }
  @media (max-width: 900px) {
    .desktop {
      display: none;
    }
    .menu-button {
      display: grid;
    }
    .cmd {
      display: none;
    }
  }
</style>
