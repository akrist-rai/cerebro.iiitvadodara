<script>
  import { barcode } from './ascii.js';
  let { seed, bars = 24, unit = 2 } = $props();
  const widths = $derived(barcode(seed, bars));
</script>

<span class="bc" aria-hidden="true">
  {#each widths as [bar, gap]}<i
      style="width:{bar * unit}px;margin-right:{gap * unit}px"
    ></i>{/each}
</span>
