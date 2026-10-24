<script>
  import { tick } from 'svelte';
  import { SECTIONS } from './content.js';
  import { directory } from './events.js';
  import Icon from './Icon.svelte';

  // A command palette in the terminal idiom: jump to a section, open an
  // event, or run a shortcut. Opened with Ctrl/⌘ K or "/".
  let { onopen, onregister, onplan } = $props();
  let dialog = $state();
  let input = $state();
  let query = $state('');
  let index = $state(0);

  export async function show() {
    query = '';
    index = 0;
    if (!dialog.open) dialog.showModal();
    await tick();
    input?.focus();
  }

  const go = (id) => () => {
    document.getElementById(id)?.scrollIntoView({ block: 'start' });
    history.replaceState(null, '', '#' + id);
  };
  const all = [
    { label: 'Register', hint: 'registration desk', run: () => onregister() },
    { label: 'My plan', hint: 'saved events', run: () => onplan() },
    ...SECTIONS.map((s) => ({
      label: 'Go to ' + s.label,
      hint: '#' + s.id,
      run: go(s.id),
    })),
    ...directory.map((e) => ({
      label: e.name,
      hint:
        e.track.toLowerCase() + (e.mode ? ' · ' + e.mode.toLowerCase() : ''),
      run: () => onopen(e.id),
    })),
  ];
  const results = $derived.by(() => {
    const q = query.toLowerCase().trim();
    return (
      q
        ? all.filter((i) => (i.label + ' ' + i.hint).toLowerCase().includes(q))
        : all
    ).slice(0, 9);
  });
  $effect(() => {
    results;
    index = 0;
  });

  function run(item) {
    dialog.close();
    item?.run();
  }
  function key(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      index = (index + 1) % Math.max(1, results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      index = (index - 1 + results.length) % Math.max(1, results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      run(results[index]);
    }
  }
</script>

<dialog
  class="palette"
  bind:this={dialog}
  aria-label="Command palette"
  onclick={(e) => e.target === dialog && dialog.close()}
>
  <div class="win-bar">
    <i class="dot"></i><span>cerebro — command</span><span>esc to close</span>
  </div>
  <label class="prompt">
    <span aria-hidden="true">&gt;</span>
    <span class="sr">Type a command or event name</span>
    <input
      bind:this={input}
      bind:value={query}
      onkeydown={key}
      placeholder="type an event, a section, or “register”…"
      autocomplete="off"
      spellcheck="false"
      role="combobox"
      aria-expanded="true"
      aria-controls="palette-list"
      aria-activedescendant={results[index] ? 'p-' + index : undefined}
    />
  </label>
  <ul id="palette-list" role="listbox">
    {#each results as item, i}
      <li id="p-{i}" role="option" aria-selected={i === index}>
        <button
          class:on={i === index}
          tabindex="-1"
          onpointerenter={() => (index = i)}
          onclick={() => run(item)}
        >
          <span class="lab">{item.label}</span>
          <span class="hint">{item.hint}</span>
          <Icon name="arrow" size={14} />
        </button>
      </li>
    {:else}
      <li class="none">no match for “{query}”</li>
    {/each}
  </ul>
</dialog>

<style>
  .palette {
    width: min(620px, calc(100% - 32px));
    margin: 12vh auto auto;
    padding: 0;
    border: 2px solid var(--ink);
    background: var(--paper-hi);
    box-shadow: 8px 8px 0 var(--ink);
  }
  .palette::backdrop {
    background: #161619cc;
  }
  .prompt {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 16px;
    border-bottom: 2px solid var(--ink);
    font-weight: 800;
  }
  .prompt input {
    flex: 1;
    min-height: 52px;
    border: 0;
    background: none;
    outline: none;
    font-size: 15px;
  }
  ul {
    max-height: 52vh;
    overflow: auto;
  }
  button {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr auto 18px;
    gap: 12px;
    align-items: center;
    padding: 10px 16px;
    border: 0;
    background: none;
    text-align: left;
    font-size: 14px;
  }
  .lab {
    font-weight: 700;
  }
  .hint {
    color: var(--dim);
    font-size: 12px;
  }
  button.on {
    background: var(--ink);
    color: var(--gold);
  }
  button.on .hint {
    color: var(--paper);
  }
  .none {
    padding: 18px 16px;
    color: var(--dim);
  }
</style>
