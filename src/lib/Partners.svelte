<script>
  import SectionHead from './SectionHead.svelte';
  import Icon from './Icon.svelte';
  import { SPONSORS } from './content.js';
  import { FEST_DETAILS } from './event-details.js';
</script>

<section id="partners" class="sec" aria-labelledby="partners-title">
  <SectionHead
    id="partners-title"
    n="05"
    kicker="partners / powered by"
    title="Partners"
    blurb="The people backing Cerebro ’26. Their names are on every poster; this is where they get the whole sheet."
  />

  <ul class="plates">
    {#each SPONSORS as sponsor, i}
      <li>
        <a
          class="plate"
          href={sponsor.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span class="eyebrow">Sponsor · {String(i + 1).padStart(2, '0')}</span
          >
          <span class="logo">
            <!-- Logos print in the current ink, from each brand's own SVG. -->
            {#if sponsor.id === 'unstop'}
              <svg viewBox="0 0 2000 796" role="img" aria-label="Unstop">
                <path
                  fill-rule="evenodd"
                  d="M1008.9,342.7c-0.6-28.8-20.4-43-59.9-43c-28.8,0-48.1,11.9-48.1,29.4c0,13,5.7,17.5,28.8,24.9l105.2,30 c41.8,12.4,62.8,39,62.8,80.3c0,31.1-14.1,61.1-37.9,79.7c-23.8,18.7-57.7,28.3-101.8,28.3c-97.3,0-148.7-36.2-151-106.3h81.4 c3.4,17,7.4,23.8,15.8,30c10.7,7.9,27.1,11.3,49.2,11.3c38.5,0,61.6-11.9,61.6-31.1c0-13-7.4-19.2-27.7-26l-99-30.5 c-31.1-10.2-40.7-15.3-52-26.6c-11.3-12.4-17.5-30.5-17.5-52c0-65.6,50.3-106.3,131.8-106.3c86,0,138,40.7,139.1,108L1008.9,342.7z"
                />
                <path
                  fill-rule="evenodd"
                  d="M1297.3,300.9h-46.4v173.6c0,28.3,5.1,35.1,27.1,35.1c6.8,0,10.7-0.6,19.2-1.7v57.7 c-15.3,4.5-28.8,6.2-48.1,6.2c-54.3,0-81.4-24.9-81.4-75.2V300.3H1127v-54.9h40.7V160h83.1v85.4h46.4v55.5H1297.3z"
                />
                <path
                  fill-rule="evenodd"
                  d="M1647.4,405.5c0,102.9-60.5,166.8-158.4,166.8c-98.4,0-158.3-63.9-158.3-169.1c0-104.6,59.9-169.1,157.8-169.1 C1589.1,234.1,1647.4,297.5,1647.4,405.5L1647.4,405.5z M1413.8,403.2c0,61.6,30,102.4,75.2,102.4c44.7,0,75.2-41.3,75.2-101.2 c0-62.8-29.4-103.5-75.2-103.5C1444.3,300.9,1413.8,342.1,1413.8,403.2z"
                />
                <path
                  fill-rule="evenodd"
                  d="M1777.2,286.7c20.4-35.6,48.6-52.6,88.8-52.6c38.5,0,78,20.4,99.5,50.3c21.5,29.4,34.5,74.6,34.5,119.3 c0,96.7-57.1,169.1-134,169.1c-40.2,0-69-16.4-88.8-52v166.8h-83.1V239.8h83.1V286.7L1777.2,286.7z M1777.2,403.8 c0,59.4,27.7,99.5,70.1,99.5c41.3,0,70.1-40.2,70.1-98.4c0-61.6-27.7-101.8-70.1-101.8C1804.9,303.7,1777.2,343.8,1777.2,403.8z"
                />
                <path
                  fill-rule="evenodd"
                  d="M397.6,0.4C178.6,0.4,0,179,0,398s178.6,397.6,397.6,397.6S795.2,617,795.2,398C795.1,179,616.5,0.4,397.6,0.4 z M357.7,559h-82.6v-37.3c-23.8,36.2-52.6,51.5-96.1,51.5c-69,0-107.5-39.6-107.5-110.3V240.6h83.1v204.7 c0,38.5,17.5,57.1,53.2,57.1c40.7,0,66.7-24.9,66.7-62.8V240h83.1v319H357.7z M640.5,559V362.2c0-37.9-17.5-57.1-53.2-57.1 c-40.7,0-66.7,24.9-66.7,62.8V559h-83.1V240h82.6v0.6v45.8c23.8-36.2,52.6-51.5,96.1-51.5c69,0,107.5,39.6,107.5,110.3V559H640.5z"
                />
              </svg>
            {:else}
              <span class="cc" role="img" aria-label="CodeCrafters">
                <svg viewBox="0 0 27.3211 18.7013" aria-hidden="true">
                  <path
                    d="M27.3153 10.961C27.3397 11.0764 27.2859 11.1948 27.1842 11.2535L14.8243 18.3902C14.1052 18.805 13.2189 18.805 12.4988 18.3902L0.13697 11.2525C0.035226 11.1938 -0.0185809 11.0754 0.0058768 10.96C0.116425 10.4376 0.257301 9.92689 0.42557 9.42795C0.480355 9.26458 0.672103 9.19218 0.821784 9.27827L13.3187 16.4933C13.53 16.6156 13.7912 16.6156 14.0025 16.4933L26.4984 9.27827C26.6481 9.19218 26.8398 9.2636 26.8946 9.42795C27.0629 9.92689 27.2038 10.4376 27.3143 10.96L27.3153 10.961Z"
                  />
                  <path
                    d="M25.5671 7.13087L15.8496 12.7414C15.3937 13.0046 14.8233 12.6759 14.8233 12.1496V0.273918C14.8233 0.110541 14.9652 -0.0146822 15.1266 0.00194902C15.647 0.0557559 16.1597 0.138912 16.6615 0.248482C16.7868 0.275875 16.8748 0.387402 16.8748 0.51556V9.78012L24.4508 5.40611C24.5692 5.33763 24.7218 5.36698 24.805 5.47655C25.1141 5.88548 25.4008 6.31104 25.6639 6.75324C25.7422 6.88531 25.6991 7.05554 25.5671 7.13184V7.13087Z"
                  />
                  <path
                    d="M10.4465 0.531246V9.78015L2.86953 5.40517C2.75115 5.33668 2.59854 5.36603 2.51538 5.4756C2.20623 5.88454 1.91959 6.3101 1.65643 6.75229C1.57816 6.88436 1.62121 7.05459 1.75328 7.1309L11.4718 12.7415C11.9277 13.0046 12.498 12.6759 12.498 12.1496V0.292539C12.498 0.12427 12.3474 -0.00388765 12.182 0.0225266L10.6774 0.260255C10.5443 0.280799 10.4465 0.39624 10.4465 0.530267V0.531246Z"
                  />
                </svg>CodeCrafters
              </span>
            {/if}
          </span>
          <span class="note">{sponsor.note}</span>
          <span class="go"
            >{new URL(sponsor.url).host}<Icon name="diagonal" size={14} /><span
              class="sr"
            >
              (opens in a new tab)</span
            ></span
          >
        </a>
      </li>
    {/each}
  </ul>

  <p class="fest">
    <a href={FEST_DETAILS.url} target="_blank" rel="noopener noreferrer"
      >See every Cerebro ’26 event on Unstop<Icon
        name="diagonal"
        size={14}
      /><span class="sr"> (opens in a new tab)</span></a
    >
  </p>
</section>

<style>
  .plates {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 340px), 1fr));
    gap: clamp(16px, 2.4vw, 32px);
  }
  .plate {
    display: grid;
    gap: 18px;
    height: 100%;
    padding: clamp(20px, 3vw, 36px);
    border: 2px solid var(--ink);
    background: var(--paper-hi);
    box-shadow: 7px 7px 0 var(--red);
    text-decoration: none;
    transition:
      transform 0.2s var(--ease),
      box-shadow 0.2s var(--ease),
      background 0.2s;
  }
  .plate:hover,
  .plate:focus-visible {
    background: var(--gold);
    transform: translate(-3px, -3px);
    box-shadow: 10px 10px 0 var(--red);
  }
  .eyebrow {
    color: var(--red);
  }
  .plate:hover .eyebrow,
  .plate:focus-visible .eyebrow {
    color: var(--ink);
  }
  .logo {
    display: flex;
    align-items: center;
    min-height: clamp(64px, 8vw, 96px);
    color: var(--ink);
  }
  .logo > svg {
    height: clamp(48px, 6vw, 72px);
    width: auto;
    fill: currentColor;
  }
  /* the CodeCrafters lockup: their mark, then the name set beside it */
  .cc {
    display: inline-flex;
    align-items: center;
    gap: 0.3em;
    font-size: clamp(30px, 4vw, 50px);
    font-weight: 800;
    letter-spacing: -0.04em;
    line-height: 1;
  }
  .cc svg {
    height: 0.9em;
    width: auto;
    fill: currentColor;
  }
  .note {
    color: var(--dim);
    max-width: 40ch;
  }
  .plate:hover .note,
  .plate:focus-visible .note {
    color: var(--ink);
  }
  .go {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    border-top: 1px dashed var(--hair);
    padding-top: 14px;
  }
  .fest {
    margin: clamp(28px, 4vw, 48px) 0 0;
  }
  .fest a {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-weight: 700;
    color: var(--red);
  }
  .fest a:hover {
    color: var(--ink);
  }
</style>
