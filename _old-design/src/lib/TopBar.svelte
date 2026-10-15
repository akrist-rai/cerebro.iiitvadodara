<script>
  import Icon from './Icon.svelte';
  let { savedCount = 0, onregister = () => {}, onplan = () => {} } = $props();
  let menu;
  let opened = $state(false);
  const links = [
    ['events', 'Events'],
    ['schedule', 'Schedule'],
    ['about', 'The cerebro'],
    ['contact', 'The people'],
  ];
  function close() {
    menu.close();
    opened = false;
  }
</script>

<header class="bar">
  <a class="brand" href="#top" aria-label="Cerebro 26 home"
    ><span class="brand-symbol" aria-hidden="true">✳</span><span
      >Cerebro<sup>’26</sup></span
    ></a
  >
  <nav class="desktop" aria-label="Main navigation">
    {#each links as [id, label]}<a href="#{id}">{label}</a>{/each}
  </nav>
  <div class="right">
    <button
      class="plan-link"
      onclick={onplan}
      aria-label="My schedule, {savedCount} saved events"
      ><Icon name="bookmark" size={16} /><span
        >{String(savedCount).padStart(2, '0')}</span
      ></button
    ><button class="button register" onclick={onregister}
      >Register <Icon name="diagonal" size={16} /></button
    ><button
      class="menu-button"
      class:opened
      aria-label="Open navigation"
      aria-expanded={opened}
      aria-controls="mobile-menu"
      onclick={() => {
        menu.showModal();
        opened = true;
      }}><span></span><span></span></button
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
    <span class="eyebrow">Cerebro ’26 / Index</span><button
      class="icon-button"
      aria-label="Close navigation"
      onclick={close}><Icon name="close" /></button
    >
  </div>
  <nav aria-label="Mobile navigation">
    {#each links as [id, label], i}<a href="#{id}" onclick={close}
        ><span class="eyebrow">0{i + 1}</span>{label}<Icon
          name="diagonal"
          size={30}
        /></a
      >{/each}
  </nav>
  <button
    class="button"
    onclick={() => {
      close();
      onregister();
    }}>Find your event <Icon name="arrow" /></button
  >
  <p class="eyebrow">Beyond the horizon. IIIT Vadodara.</p>
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
    gap: 24px;
    border-bottom: 1px solid var(--ink);
    background: var(--paper);
  }
  .brand {
    font-family: var(--type);
    font-weight: 700;
    font-size: 34px;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 11px;
    white-space: nowrap;
  }
  @media (max-width: 380px) {
    .brand-symbol {
      display: none;
    }
    .bar {
      gap: 8px;
    }
  }
  .brand-symbol {
    font-family: Arial, sans-serif;
    color: var(--red);
    font-size: 36px;
  }
  .brand sup {
    font-family: var(--body);
    font-size: 10px;
    margin-left: 5px;
    vertical-align: top;
    position: relative;
    top: 9px;
  }
  .desktop {
    display: flex;
    gap: 28px;
  }
  .desktop a {
    font-size: 11px;
    text-decoration: none;
    font-weight: 500;
    position: relative;
    padding: 14px 0;
  }
  .desktop a::after {
    content: '';
    position: absolute;
    bottom: 8px;
    left: 0;
    right: 0;
    height: 1px;
    background: var(--red);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s;
  }
  .desktop a:hover::after {
    transform: scaleX(1);
  }
  .right {
    display: flex;
    align-items: center;
    gap: 23px;
  }
  .register {
    min-height: 40px;
    padding: 10px 15px;
  }
  .plan-link {
    background: none;
    border: 0;
    padding: 10px 0;
    display: flex;
    gap: 7px;
    align-items: center;
    font-size: 10px;
    text-decoration: none;
  }
  .menu-button {
    display: none;
    width: 44px;
    height: 44px;
    background: none;
    border: 0;
    place-content: center;
    gap: 7px;
  }
  .menu-button span {
    width: 25px;
    height: 1px;
    background: var(--ink);
    transition: transform 0.3s;
  }
  .menu-button:hover span:first-child {
    transform: translateX(-4px);
  }
  .menu-button:hover span:last-child {
    transform: translateX(4px);
  }
  .mobile-menu {
    width: 100%;
    max-width: none;
    height: 100dvh;
    max-height: none;
    padding: 24px var(--gutter);
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
    margin: 55px 0;
  }
  .mobile-menu nav a {
    font-family: var(--type);
    font-size: 52px;
    display: flex;
    align-items: center;
    gap: 20px;
    border-bottom: 1px solid var(--hair);
    padding: 14px 0;
    text-decoration: none;
  }
  .mobile-menu nav a :global(svg) {
    margin-left: auto;
  }
  .mobile-menu > p {
    margin: 30px 0;
    color: var(--dim);
  }
  @media (max-width: 1000px) {
    .desktop {
      gap: 18px;
    }
    .right {
      gap: 14px;
    }
  }
  @media (max-width: 760px) {
    .desktop {
      display: none;
    }
    .menu-button {
      display: grid;
    }
    .register {
      display: flex;
      padding: 10px 11px;
      font-size: 10px;
      gap: 8px;
    }
    .right {
      gap: 8px;
    }
    .brand {
      font-size: 27px;
    }
  }
</style>
