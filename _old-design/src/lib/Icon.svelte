<script>
  let { name = 'arrow', size = 20, filled = false } = $props();
  const paths = {
    arrow: 'M5 12h14M12 5l7 7-7 7',
    diagonal: 'M5 19 19 5M5 5h14v14',
    calendar: 'M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2Z',
    clock: 'M12 8v5l3 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z',
    pin: 'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
    trophy:
      'M8 3h8v8a4 4 0 0 1-8 0V3Zm0 2H4v3a4 4 0 0 0 4 4m8-7h4v3a4 4 0 0 1-4 4m-4 3v6m-5 0h10',
    people:
      'M16 21v-3a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v3m20 0v-3a4 4 0 0 0-4-4M13 6a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm5-3a4 4 0 0 1 0 8',
    search: 'm21 21-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z',
    bookmark: 'M5 3h14v19l-7-5-7 5V3Z',
    close: 'm6 6 12 12M6 18 18 6',
    check: 'm4 12 5 5L20 6',
    plus: 'M12 4v16M4 12h16',
    share: 'M12 16V3m-5 5 5-5 5 5M5 13v8h14v-8',
  };
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill={filled ? 'currentColor' : 'none'}
  stroke="currentColor"
  stroke-width="1.5"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"><path d={paths[name] || paths.arrow} /></svg
>
