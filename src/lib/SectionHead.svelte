<script>
  import BigText from './BigText.svelte';
  import { bigText } from './ascii.js';
  import { reveal } from './interaction.js';
  let { n, kicker, title, blurb = '', id, children, artWidth = 440 } = $props();

  // The title is set in block letters at up to 17px a cell; the collage only
  // shows when the header is wide enough to hold both without touching.
  let width = $state(0);
  const titlePx = $derived(bigText(title, { kx: 2, ky: 1 }).w * 0.6 * 17);
  const room = $derived(width >= titlePx + artWidth + 8);
</script>

<header class="shead" use:reveal bind:clientWidth={width}>
  <div class="shead-rule"><span>§ {n}</span><span>{kicker}</span></div>
  <h2 {id} class="shead-title">
    <BigText text={title} label={title} />
  </h2>
  {#if blurb}<p class="shead-blurb">{blurb}</p>{/if}
  {#if children && room}<div
      class="shead-art"
      aria-hidden="true"
      style:width="{artWidth}px"
    >
      {@render children()}
    </div>{/if}
</header>

<style>
  .shead {
    position: relative;
  }
  /* a collage that sits in the empty half of the header, beside the title */
  .shead-art {
    position: absolute;
    top: 30px;
    right: 0;
    bottom: 0;
    pointer-events: none;
  }
  .shead-art :global(*) {
    pointer-events: auto;
  }
  @media (max-width: 960px) {
    .shead-art {
      display: none;
    }
  }
  .shead-title {
    margin: 18px 0 14px;
    font-size: inherit;
  }
</style>
