<script>
  import { art as lookup } from './art.js';
  import { print } from './interaction.js';

  // One print. `tone` separates it into two inks (see Duotone.svelte); the
  // native colour comes back on hover/focus, or whenever an ancestor has
  // `.hot`. `dots` lays a halftone screen over it; `ghost` adds a
  // misregistered red plate; `draw` prints it in line by line on scroll.
  let {
    id,
    tone = '',
    pos = '50% 20%',
    fit = 'cover',
    ratio = '',
    dots = 0,
    ghost = false,
    draw = false,
    eager = false,
    still = false,
    cut = false,
    label = '',
  } = $props();

  const img = $derived(lookup(id));
</script>

<span
  class="art"
  class:toned={!!tone}
  class:still
  class:cut
  class:contain={fit === 'contain'}
  style:--bg={img.c}
  style:--src="url({img.src})"
  style:--pos={pos}
  style:--ratio={ratio || `${img.w} / ${img.h}`}
  style:--dots={dots}
  role={label ? 'img' : undefined}
  aria-label={label || undefined}
  aria-hidden={label ? undefined : 'true'}
  use:print={draw}
>
  <img
    src={img.src}
    alt=""
    width={img.w}
    height={img.h}
    loading={eager ? 'eager' : 'lazy'}
    decoding="async"
    draggable="false"
  />
  {#if ghost}<span class="ghost"></span>{/if}
  {#if tone}<span class="duo" style:filter="url(#duo-{tone})"></span>{/if}
  {#if dots}<span class="dots"></span>{/if}
</span>

<style>
  .art {
    position: relative;
    display: block;
    overflow: hidden;
    aspect-ratio: var(--ratio);
    background: var(--bg);
    isolation: isolate;
  }
  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: var(--pos);
    user-select: none;
  }
  .contain img {
    object-fit: contain;
  }
  /* a die-cut sticker: no plate behind it, no clipping */
  .cut {
    background: none;
    overflow: visible;
    filter: drop-shadow(4px 4px 0 var(--ink));
  }
  .duo,
  .ghost,
  .dots {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  .duo,
  .ghost {
    background: var(--src) var(--pos) / cover no-repeat;
  }
  .contain .duo,
  .contain .ghost {
    background-size: contain;
  }
  /* the separation sits over the native print and lifts away on hover */
  .duo {
    transition: opacity 0.4s var(--ease);
    background-color: var(--bg);
  }
  .art:hover .duo,
  .art:focus-within .duo,
  :global(.hot) .duo {
    opacity: 0;
  }
  .still:hover .duo,
  .still:focus-within .duo {
    opacity: 1;
  }
  /* a second plate, a hair out of register */
  .ghost {
    mix-blend-mode: multiply;
    filter: url(#duo-red-paper);
    transform: translate(5px, 3px);
    opacity: 0.55;
    transition: transform 0.5s var(--ease);
  }
  .art:hover .ghost {
    transform: none;
  }
  /* halftone: dots grow toward the bottom edge, like a screened gradient */
  .dots {
    background: radial-gradient(
        circle at 50% 50%,
        var(--ink) 0 30%,
        transparent 34%
      )
      0 0 / 5px 5px;
    mix-blend-mode: multiply;
    opacity: calc(var(--dots) * 0.9);
    -webkit-mask: linear-gradient(to bottom, transparent 30%, #000);
    mask: linear-gradient(to bottom, transparent 30%, #000);
  }
</style>
