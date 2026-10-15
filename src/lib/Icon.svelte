<script>
  // Square-cut line icons to sit with the monospace type.
  let { name = 'arrow', size = 18, filled = false } = $props();
  const paths = {
    arrow: 'M4 12h16M14 6l6 6-6 6',
    diagonal: 'M6 18 18 6M7 6h11v11',
    calendar: 'M4 5h16v15H4zM4 10h16M8 3v4M16 3v4',
    clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2',
    pin: 'M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11zM12 8v4',
    trophy:
      'M7 4h10v6a5 5 0 0 1-10 0zM7 6H3v2a4 4 0 0 0 4 4M17 6h4v2a4 4 0 0 1-4 4M12 15v4M8 20h8',
    people:
      'M3 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM17 14a4 4 0 0 1 4 4v2M16 4.3a3.5 3.5 0 0 1 0 6.4',
    search: 'M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM15.5 15.5 21 21',
    bookmark: 'M6 3h12v18l-6-4-6 4z',
    close: 'M5 5l14 14M19 5 5 19',
    check: 'M4 12l5 5L20 6',
    plus: 'M12 4v16M4 12h16',
    minus: 'M4 12h16',
    share: 'M12 15V3M7 8l5-5 5 5M5 13v8h14v-8',
    terminal: 'M3 5h18v14H3zM7 10l3 2-3 2M12 15h5',
  };
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill={filled ? 'currentColor' : 'none'}
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="square"
  stroke-linejoin="miter"
  aria-hidden="true"><path d={paths[name] || paths.arrow} /></svg
>
