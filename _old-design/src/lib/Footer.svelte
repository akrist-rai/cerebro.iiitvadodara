<script>
  import Icon from './Icon.svelte';
  let { onregister } = $props();
</script>

<footer>
  <div class="closing">
    <p class="eyebrow">Curiosity is your entry point.</p>
    <div class="closing-row">
      <p>See you on<br />the <em>other side.</em></p>
      <button class="button accent" onclick={onregister}
        >Find your event <Icon name="diagonal" /></button
      >
    </div>
    <span class="footer-word" aria-hidden="true">CEREBRO ’26</span>
  </div>
  <div class="foot">
    <span>© 2026 Cerebro · Technical Committee, IIIT Vadodara</span>
    <nav aria-label="Footer">
      <a href="#events">Events</a><a href="#schedule">Schedule</a><a
        href="#contact">People</a
      ><a href="#top">Back to top ↑</a>
    </nav>
  </div>
  <div class="credits">
    Interaction inspiration: <a
      href="https://skiper-ui.com"
      target="_blank"
      rel="noopener noreferrer">Skiper UI ↗</a
    >
  </div>
</footer>

<style>
  footer {
    background: var(--ink);
    color: var(--paper);
    overflow: hidden;
  }
  .closing {
    padding: 70px var(--gutter) 0;
  }
  .closing > .eyebrow {
    color: #bcb7ab;
    font-size: 10px;
  }
  .closing-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 25px;
  }
  .closing-row > p {
    font-family: var(--type);
    font-size: clamp(72px, 8vw, 125px);
    line-height: 0.9;
    margin: 15px 0 50px;
  }
  .closing-row em {
    color: #f27b62;
  }
  .footer-word {
    display: block;
    font-family: var(--type);
    font-weight: 700;
    font-size: 21.8vw;
    white-space: nowrap;
    line-height: 0.83;
    letter-spacing: -0.03em;
    color: #343430;
    user-select: none;
    margin: 0 0 -15px;
  }
  .foot {
    border-top: 1px solid #ffffff30;
    padding: 25px var(--gutter);
    display: flex;
    justify-content: space-between;
    gap: 25px;
    font-size: 9px;
    position: relative;
    background: var(--ink);
  }
  nav {
    display: flex;
    gap: 23px;
  }
  nav a {
    text-decoration: none;
  }
  .credits {
    padding: 0 var(--gutter) 24px;
    color: #a8a498;
    font-size: 9px;
  }
  .credits a {
    text-decoration: none;
  }
  @media (min-width: 1800px) {
    .footer-word {
      font-size: 385px;
    }
  }
  @media (max-width: 760px) {
    .closing {
      padding-top: 55px;
    }
    .closing-row {
      flex-direction: column;
      align-items: start;
      margin-bottom: 45px;
    }
    .closing-row > p {
      font-size: 85px;
      margin-bottom: 5px;
    }
    .foot {
      flex-direction: column;
      font-size: 9px;
    }
    nav {
      gap: 22px;
    }
    .footer-word {
      font-size: 21vw;
      margin-bottom: -4px;
    }
  }
</style>
