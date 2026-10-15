<script>
  import { marks } from './content.js';

  // Copy with the deck's `*marked*` phrases set as highlighter.
  let { text } = $props();
</script>

{#each marks(text) as [t, hot]}{#if hot}<b>{t}</b>{:else}{t}{/if}{/each}
