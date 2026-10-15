# CEREBRO ’26

The official promotional site for Cerebro ’26, the technical festival of IIIT Vadodara. A static Svelte + Vite app, designed entirely in ASCII.

```
npm install
npm run dev            # http://localhost:5173
npm run build          # outputs dist/
npm test               # unit tests
npm run check:content  # validate src/lib/event-details.js
npm run test:e2e       # browser tests (Playwright)
```

- Event copy: `src/lib/content.js`. Dates, rooms, rules, prizes, contacts: `src/lib/event-details.js`. See [docs/EVENT_CONTENT.md](docs/EVENT_CONTENT.md), including the list of places the proposal contradicts itself.
- Design notes and the ASCII engine: [docs/DESIGN_REFERENCES.md](docs/DESIGN_REFERENCES.md).
- `_old-design/` holds the previous design and can be deleted.

## Posters, stamps and receipts

The site is printed like a riso zine: every image goes through the same two-ink
press.

- `public/art/*.webp` are the prints, resized from the `new images/` and "good
  stuff" folders. `src/lib/art-meta.json` holds each one's size and mean colour.
- `src/lib/art.js` is the catalogue: which poster belongs to which event
  (`EVENT_ART`) or track (`TRACK_ART`), and what is on the poster wall.
- `Art.svelte` draws one print. `tone="ink-lime"` separates it into two inks
  (the filters are in `Duotone.svelte`; the pairings are `DUOTONES` in
  `art.js`); `dots` adds a halftone screen, `ghost` a misregistered plate,
  `cut` makes a die-cut sticker, `draw` prints it in on scroll.
- To change the picks, edit `scripts/art-picks.json` and rebuild the images:

  ```
  npm i --no-save sharp
  ART_GOOD="path/to/good stuff" node scripts/build-art.mjs
  ```
