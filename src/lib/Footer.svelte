<script>
  import BigText from './BigText.svelte';
  import Icon from './Icon.svelte';
  import Art from './Art.svelte';
  let { onregister } = $props();
</script>

<footer>
  <div class="closing">
    <div class="window" aria-hidden="true">
      <span class="pane reg"
        ><Art id="g262" ratio="3 / 4" pos="50% 40%" dots={0.5} ghost /></span
      >
      <span class="stk a"><Art id="n24" cut /></span>
      <span class="stk b"><Art id="n52" cut /></span>
    </div>
    <p class="eyebrow">$ ./cerebro --join</p>
    <div class="big" aria-hidden="true">
      <BigText text="SEE YOU ON THE" wide={1} narrow={1} max={30} />
      <BigText text="OTHER SIDE" wide={1} narrow={1} max={30} />
    </div>
    <p class="sr">See you on the other side.</p>
    <button class="btn" onclick={onregister}
      >Find your event <Icon name="diagonal" /></button
    >
  </div>
  <div class="foot">
    <span>© 2026 Cerebro · Technical Committee, IIIT Vadodara</span>
    <nav aria-label="Footer">
      <a href="#events">Events</a><a href="#schedule">Schedule</a><a href="#top"
        >Top ↑</a
      >
    </nav>
  </div>
 
</footer>

<style>
  footer {
    background: var(--ink);
    color: var(--paper);
    --shade: var(--red);
    --dim: #a9a09c;
    overflow: hidden;
  }
  .closing {
    position: relative;
    padding: clamp(48px, 7vw, 96px) var(--gutter) 40px;
  }
  /* a window onto the other side */
  .window {
    position: absolute;
    right: var(--gutter);
    top: clamp(48px, 7vw, 96px);
    width: clamp(180px, 20vw, 290px);
  }
  .pane {
    display: block;
    border: 2px solid var(--paper);
    box-shadow: 8px 8px 0 var(--red);
    transform: rotate(2.5deg);
    color: var(--paper);
  }
  .stk {
    position: absolute;
    display: block;
  }
  .stk.a {
    width: 46%;
    left: -26%;
    bottom: -4%;
    transform: rotate(-9deg);
  }
  .stk.b {
    width: 40%;
    right: -12%;
    top: -7%;
    transform: rotate(8deg);
  }
  .stk :global(.art) {
    filter: drop-shadow(4px 4px 0 var(--red));
  }
  .closing > :not(.window) {
    position: relative;
    max-width: calc(100% - clamp(220px, 24vw, 340px));
  }
  @media (max-width: 760px) {
    .window {
      position: relative;
      right: auto;
      top: auto;
      width: min(240px, 64%);
      margin: 0 0 28px auto;
    }
    .stk.b {
      right: -3%;
    }
    .closing > :not(.window) {
      max-width: none;
    }
  }
  .eyebrow {
    color: var(--gold);
    margin-bottom: 18px;
  }
  .big {
    display: grid;
    gap: 14px;
    margin-bottom: 36px;
    color: var(--paper);
  }
  .btn {
    background: var(--paper);
    color: var(--ink);
    border-color: var(--paper);
    box-shadow: 4px 4px 0 var(--red);
  }
  .btn:hover {
    background: var(--gold);
    box-shadow: 6px 6px 0 var(--red);
  }
  .foot {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
    padding: 18px var(--gutter);
    border-top: 2px solid var(--paper);
    font-size: 12px;
  }
  nav {
    display: flex;
    gap: 18px;
  }
  nav a {
    text-decoration: none;
    font-weight: 700;
  }
  nav a:hover {
    background: var(--gold);
    color: var(--ink);
  }
  .exit {
    margin: 0;
    padding: 0 var(--gutter) 18px;
    color: var(--dim);
    font-size: 12px;
  }
</style>
