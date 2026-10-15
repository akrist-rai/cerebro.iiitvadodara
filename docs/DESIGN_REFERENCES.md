# Design: printed in ASCII

The site was redesigned around one idea: **everything is type**. Illustrations, headings, charts, barcodes and portraits are drawn from characters (or CSS blocks that stand in for block glyphs), and the pages borrow the physical objects in `new images/`.

## What the reference folder contributed

| Reference in `new images/`                                      | What it became                                                                                                                 |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Japanese postage-stamp sheets (Gojira, Atom, Kyoto, Suzuka GP…) | The **event directory**: every event is a perforated stamp with a denomination (its top prize), a number and a drawn picture.  |
| Thermal-paper receipts (AC/DC, Nirvana, Pink Floyd)             | The **schedule** (one receipt per day, dotted leaders, barcode, "thank you"), the countdown and the prize breakdown.           |
| Two-colour riso posters (red, cobalt, cream, acid green)        | The palette: paper `#f1ecdf`, ink `#14130f`, red `#e5391f`, cobalt `#2535ff`, lime `#d6f23a`, with a dithered misprint shadow. |
| Manga and comic panel grids                                     | Hard-edged boxes, offset shadows and the framed picture on every stamp.                                                        |

`1.jpeg.png`, `3.png`, `canvas.png` and `canvas2.png` are blank white canvases, so they informed nothing.

## The ASCII engine (`src/lib/ascii.js`, `scenes.js`)

- **Bitmap font** (5×7) drives the block headings. Solid runs and the shadow are CSS blocks sized in `ch`, so they never depend on a font having `█` or `░`.
- **Scene rasteriser** paints discs, boxes, lines, polygons and text into a 100×100 space and maps coverage to a character ramp (`' .:-=+*#%@'`). Each event has its own scene in `scenes.js`; passing a clock `t` animates it.
- **Generators**: barcodes (`Barcode.svelte`), ASCII portraits for the crew (`face()`), text scramble (`decode`).
- **Hero**: a live character field with the wordmark composited over it. The pointer sends ripples through the field.

## Interaction

- Hover or focus a stamp to animate its picture. Tracks expand like a table of contents.
- `Ctrl/⌘ K` or `/` opens a command palette (events, sections, shortcuts).
- A short character trail follows a fine pointer.
- All motion stops for `prefers-reduced-motion`; the pointer-only effects never run on touch. Every decorative `<pre>` is `aria-hidden` and real headings/labels carry the text.

## Fonts

JetBrains Mono (variable) for text and Silkscreen for small labels, both under the SIL Open Font License; see `public/FONT-LICENSES.txt`. Scenes use only ASCII and Latin-1 characters so rendering is identical on every system.

## Previous design

The earlier paper-and-ink design (Svelte sources, tests, validator) is kept in `_old-design/`. It is not part of the build and can be deleted.
