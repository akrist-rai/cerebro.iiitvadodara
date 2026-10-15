<script>
  import { drawScene, sceneId } from './scenes.js';
  import { ticker } from './interaction.js';
  // One event's illustration. It sits still until `animate` or `hot`
  // (hover/focus on its card) switches the clock on.
  let {
    event = null,
    id = null,
    cols = 40,
    rows = 20,
    animate = false,
    hot = false,
  } = $props();
  let pre = $state();
  let stop;
  const sid = $derived(id ?? sceneId(event));

  $effect(() => {
    if (pre) pre.textContent = drawScene(sid, cols, rows, 0.7);
  });
  $effect(() => {
    if (!pre) return;
    stop = ticker(
      pre,
      (t) => {
        pre.textContent = drawScene(sid, cols, rows, t);
      },
      { fps: 14, active: () => animate || hot },
    );
    return () => stop?.();
  });
  $effect(() => {
    if (animate || hot) stop?.kick?.();
  });
</script>

<div class="box">
  <pre
    class="art scene"
    aria-hidden="true"
    bind:this={pre}
    style="--cols: {cols}"></pre>
</div>

<style>
  .box {
    container-type: inline-size;
    width: 100%;
  }
  .scene {
    font-size: calc(100cqw / (var(--cols) * 0.6));
  }
</style>
