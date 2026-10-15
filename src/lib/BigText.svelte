<script>
  import { bigText, bigTextHTML } from './ascii.js';
  // Block letters, set from the 5×7 bitmap font. Two scales are rendered and
  // CSS picks one by viewport, so a long word still fits a phone.
  let { text, wide = 2, narrow = 1, max = 17, label = '' } = $props();
  const big = $derived(bigText(text, { kx: wide, ky: Math.max(1, wide / 2) }));
  const small = $derived(
    bigText(text, { kx: narrow, ky: Math.max(1, narrow / 2) }),
  );
</script>

<span class="bt" style="--max: {max}px">
  {#if label}<span class="sr">{label}</span>{/if}
  <pre
    class="art wide"
    aria-hidden="true"
    style="--cols: {big.w}">{@html bigTextHTML(big)}</pre>
  <pre
    class="art narrow"
    aria-hidden="true"
    style="--cols: {small.w}">{@html bigTextHTML(small)}</pre>
</span>

<style>
  .bt {
    display: block;
    container-type: inline-size;
  }
  .art {
    font-size: min(calc(100cqw / (var(--cols) * 0.6)), var(--max));
    color: currentColor;
  }
  .narrow {
    display: none;
  }
  @media (max-width: 760px) {
    .wide {
      display: none;
    }
    .narrow {
      display: block;
    }
  }
</style>
