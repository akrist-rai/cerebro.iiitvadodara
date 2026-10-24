# Event posters

Export each event's poster from the Ephemeral ’26 Figma file (PNG, 2x) into
this folder, named after the event id, then run:

    npm i --no-save sharp
    node scripts/build-posters.mjs

Names: `equinox`, `retro-market`, `prudentia`, `robo-race`, `tech-hunt`,
`robo-soccer`, `trio-codejam`, `codeclash`, `d2d`, `matiks-mania`,
`clue-to-canvas`, `valorant`, `bgmi`, `codm`, `clash-royale`, `arcade-corner`
(e.g. `robo-race.png`). Events without a file keep their library poster.
