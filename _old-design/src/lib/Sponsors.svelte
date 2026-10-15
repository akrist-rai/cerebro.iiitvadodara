<script>
  import { TIERS, GROWTH, CONTACT, tel } from './content.js';
  import { gsap, lines, rise, press } from './motion.js';
  import { reducedMotion } from './fx.js';

  // Sponsorship: the stage with its empty banner, then the four tiers as an
  // index you open one at a time.
  const reach = GROWTH[GROWTH.length - 1];
  const leads = CONTACT.groups.find((g) => g.label === 'Sponsorships')?.people ?? [];
  let openId = $state(TIERS[0].id);

  function toggle(id) {
    openId = openId === id ? null : id;
  }

  // A tier opens by height, so the list below glides instead of jumping.
  function grow(node) {
    if (reducedMotion()) return;
    const tw = gsap.from(node, { height: 0, duration: 0.7, ease: 'expo.out', clearProps: 'height' });
    gsap.from(node.children, { autoAlpha: 0, y: 16, duration: 0.6, ease: 'power3.out', stagger: 0.05, delay: 0.15 });
    return { destroy: () => tw.kill() };
  }
</script>

<section class="block" id="sponsor">
  <div class="intro">
    <h2 class="big title" use:lines>Partner with us!</h2>
    <p class="light deck" use:rise>Put your brand in front of {reach.n.toLocaleString('en-US')} participants from across India.</p>
  </div>

  <figure class="ad">
    <p class="label">Advertisement</p>
    <div class="space coupon" use:press><span class="big">Your brand here</span><span class="light">This space is reserved for Cerebro ’26 sponsors.</span></div>
  </figure>

  <div class="split">
    <div class="side">
      <p class="cap copy" use:rise>On stage, online, and in every hacker’s hands. Four ways in, from naming the fest to filling its goodie bags — pick one and talk to the sponsorship desk.</p>
      {#if leads.length}
        <p class="desk" use:rise={{ delay: 0.1 }}>
          <span class="label">Sponsorship desk</span>
          {#each leads as p}<a href={tel(p.phone)}><b>{p.name}</b> {p.phone}</a>{/each}
        </p>
      {/if}
    </div>

    <ol class="tiers">
      {#each TIERS as t, i (t.id)}
        {@const on = openId === t.id}
        <li class="tier" class:on>
          <h3>
            <button type="button" aria-expanded={on} aria-controls="tier-{t.id}" onclick={() => toggle(t.id)}>
              <span class="nm big">{t.name}</span>
              <span class="pr">${t.price}</span>
              <i class="chev" aria-hidden="true"></i>
            </button>
          </h3>
          {#if on}
            <div class="body" id="tier-{t.id}" use:grow>
              <p class="pitch">{t.pitch}</p>
              <p class="price"><span>{t.terms}</span><b class="big">${t.price}</b></p>
              <div class="perks">
                <span class="label">What will you get in return?</span>
                <ul>
                  {#each t.perks as p}<li>{p}</li>{/each}
                </ul>
              </div>
              <a class="btn" href="#contact">Enquire <span aria-hidden="true">→</span></a>
            </div>
          {/if}
        </li>
      {/each}
    </ol>
  </div>
</section>

<style>
  .intro {
    display: flex;
    flex-wrap: wrap;
    align-items: end;
    justify-content: space-between;
    gap: 10px 40px;
    margin-bottom: clamp(24px, 3vw, 44px);
  }

  .title {
    margin: 0;
    font-size: clamp(72px, 10vw, 190px);
  }

  .deck {
    max-width: 20ch;
    margin: 0;
    font-size: clamp(26px, 2.4vw, 42px);
    text-align: right;
  }

  .label {
    display: block;
    font-size: 15px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--dim);
  }

  .ad {
    margin: 0;
  }

  .ad .label {
    margin: 0 0 8px;
    text-align: center;
    letter-spacing: 0.3em;
  }

  /* The empty ad slot: a dashed coupon with the offer in billboard type. */
  .space {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
    min-height: clamp(260px, 30vw, 440px);
    margin: 6px;
    padding: 24px;
    text-align: center;
  }

  .space .big {
    font-size: clamp(64px, 11vw, 210px);
    color: var(--red);
  }

  .space .light {
    font-size: clamp(22px, 2vw, 34px);
  }

  .split {
    display: grid;
    grid-template-columns: minmax(0, 4fr) minmax(0, 8fr);
    gap: clamp(28px, 4vw, 72px);
    margin-top: clamp(40px, 5vw, 80px);
    align-items: start;
  }

  .copy {
    margin: 0;
    font-size: clamp(20px, 1.6vw, 25px);
    line-height: 1.16;
  }

  .desk {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin: 26px 0 0;
    padding-top: 14px;
    border-top: 1px solid var(--ink);
    font-size: 22px;
  }

  .desk a {
    text-decoration: none;
  }

  .desk a b {
    font-weight: 800;
    text-transform: uppercase;
  }

  .desk a:hover {
    color: var(--red);
  }

  /* ---- the tiers ---- */
  .tiers {
    margin: 0;
    padding: 0;
    list-style: none;
    border-top: 1px solid var(--ink);
  }

  .tier {
    border-bottom: 1px solid var(--ink);
  }

  h3 {
    margin: 0;
  }

  h3 button {
    display: grid;
    grid-template-columns: 1fr auto auto;
    align-items: center;
    gap: 20px;
    width: 100%;
    padding: 18px 0 14px;
    border: none;
    background: none;
    text-align: left;
  }

  .nm {
    font-size: clamp(40px, 4.4vw, 80px);
  }

  .pr {
    font-size: clamp(22px, 2vw, 32px);
    font-weight: 300;
  }

  /* A chevron in a ring, turning as its tier opens. */
  .chev {
    position: relative;
    width: 34px;
    height: 34px;
    border: 1.5px solid var(--ink);
    border-radius: 50%;
    transition:
      transform 0.5s var(--ease),
      background 0.2s;
  }

  .chev::after {
    content: '';
    position: absolute;
    left: 11px;
    top: 9px;
    width: 9px;
    height: 9px;
    border-right: 1.5px solid currentColor;
    border-bottom: 1.5px solid currentColor;
    transform: rotate(45deg);
  }

  .on .chev {
    transform: rotate(180deg);
    background: var(--ink);
    color: var(--paper);
  }

  h3 button:hover .nm {
    color: var(--red);
  }

  .body {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 18px 36px;
    overflow: hidden;
    padding: 4px 0 28px;
  }

  .pitch {
    grid-column: 1 / -1;
    max-width: 52ch;
    margin: 0;
    font-size: clamp(21px, 1.7vw, 27px);
    font-weight: 300;
    line-height: 1.12;
  }

  .price {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin: 0;
  }

  .price span {
    font-size: 16px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--dim);
  }

  .price b {
    font-size: clamp(80px, 8vw, 150px);
    color: var(--red);
  }

  ul {
    margin: 8px 0 0;
    padding: 0;
    list-style: none;
  }

  li li {
    padding: 7px 0 6px 22px;
    border-bottom: 1px solid rgba(27, 27, 25, 0.25);
    font-size: 20px;
    line-height: 1.15;
    position: relative;
  }

  li li::before {
    content: '✶';
    position: absolute;
    left: 0;
    top: 7px;
    font-size: 14px;
    color: var(--red);
  }

  .btn {
    justify-self: start;
  }

  @media (max-width: 960px) {
    .split {
      grid-template-columns: minmax(0, 1fr);
    }
    .deck {
      text-align: left;
    }
  }

  @media (max-width: 640px) {
    .body {
      grid-template-columns: minmax(0, 1fr);
    }
    .pr {
      display: none;
    }
  }
</style>
