<script>
  import { DUOTONES, INKS } from './art.js';

  // #rrggbb → "r g b" in 0–1, as a feFuncX table wants it.
  const rgb = (hex) =>
    [1, 3, 5].map((i) => (parseInt(hex.slice(i, i + 2), 16) / 255).toFixed(4));
  const filters = Object.entries(DUOTONES).map(([name, [shadow, light]]) => {
    const [r0, g0, b0] = rgb(INKS[shadow]);
    const [r1, g1, b1] = rgb(INKS[light]);
    return { name, r: `${r0} ${r1}`, g: `${g0} ${g1}`, b: `${b0} ${b1}` };
  });
</script>

<!-- One luminance → two-ink map per pairing. `filter: url(#duo-…)` on any
     image prints it as a two-colour separation. -->
<svg class="duotone" aria-hidden="true" focusable="false">
  <defs>
    {#each filters as f}
      <filter id="duo-{f.name}" color-interpolation-filters="sRGB">
        <feColorMatrix
          type="matrix"
          values="0.2126 0.7152 0.0722 0 0
                  0.2126 0.7152 0.0722 0 0
                  0.2126 0.7152 0.0722 0 0
                  0      0      0      1 0"
        />
        <feComponentTransfer>
          <feFuncR type="linear" slope="1.45" intercept="-0.18" />
          <feFuncG type="linear" slope="1.45" intercept="-0.18" />
          <feFuncB type="linear" slope="1.45" intercept="-0.18" />
        </feComponentTransfer>
        <feComponentTransfer>
          <feFuncR type="table" tableValues={f.r} />
          <feFuncG type="table" tableValues={f.g} />
          <feFuncB type="table" tableValues={f.b} />
        </feComponentTransfer>
      </filter>
    {/each}
  </defs>
</svg>

<style>
  .duotone {
    position: absolute;
    width: 0;
    height: 0;
    overflow: hidden;
    pointer-events: none;
  }
</style>
