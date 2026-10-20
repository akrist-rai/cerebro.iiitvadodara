<script>
  import SectionHead from './SectionHead.svelte';
  import AsciiScene from './AsciiScene.svelte';
  import Icon from './Icon.svelte';
  import Art from './Art.svelte';
  import { trackArt } from './art.js';
  import { TRACKS, TRACK_BLURB } from './content.js';
  import { directory } from './events.js';
  import { reveal } from './interaction.js';

  let { onopen } = $props();
  let active = $state('Robotics');
  const tracks = TRACKS.map((name, i) => ({
    name,
    n: String(i + 1).padStart(2, '0'),
    events: directory.filter((e) => e.track === name),
    plate: trackArt(name),
  }));
</script>

<section id="tracks" class="sec sec--ink" aria-labelledby="tracks-title">
  <SectionHead
    id="tracks-title"
    n="02"
    kicker="tracks / ls -la"
    title="Tracks"
    blurb="Seven disciplines, fifteen events. Open a track to see what is inside."
  />

  <div class="contact" aria-hidden="true">
    {#each tracks as t}
      <button
        tabindex="-1"
        class:on={active === t.name}
        onpointerenter={(e) => {
          if (e.pointerType === 'mouse') active = t.name;
        }}
        onclick={() => (active = t.name)}
      >
        <Art
          id={t.plate.id}
          tone={t.plate.tone}
          pos={t.plate.pos}
          ratio="3 / 4"
          dots={0.4}
        />
        <span class="eyebrow">{t.n}</span>
      </button>
    {/each}
  </div>

  <ul class="rows" use:reveal>
    {#each tracks as track}
      {@const open = active === track.name}
      <li class:open>
        <button
          class="head"
          aria-expanded={open}
          aria-controls="track-{track.name}"
          onpointerenter={(e) => {
            if (e.pointerType === 'mouse') active = track.name;
          }}
          onfocus={() => (active = track.name)}
          onclick={() => (active = track.name)}
        >
          <span class="n">{track.n}</span>
          <span class="name">{track.name}</span>
          <span class="count"
            >{track.events.length}
            {track.events.length === 1 ? 'event' : 'events'}</span
          >
          <span class="plus" aria-hidden="true"
            ><Icon name={open ? 'minus' : 'plus'} size={18} /></span
          >
        </button>
        <div class="body" id="track-{track.name}" inert={!open}>
          <div class="inner">
            <div class="copy">
              <p class="blurb">{TRACK_BLURB[track.name]}</p>
              <ul class="evs">
                {#each track.events as e}
                  <li>
                    <button onclick={() => onopen(e.id)}>
                      <span class="en">{e.name}</span>
                      <span class="dots" aria-hidden="true"></span>
                      <span class="ed">{e.mode}</span>
                    </button>
                  </li>
                {/each}
              </ul>
            </div>
            <div class="art-wrap" aria-hidden="true">
              <div class="plate">
                <Art
                  id={track.plate.id}
                  tone={track.plate.tone}
                  pos={track.plate.pos}
                  ratio="48 / 46"
                  dots={0.5}
                  ghost
                />
                <div class="over">
                  <AsciiScene
                    id={undefined}
                    event={{ id: '', track: track.name }}
                    cols={48}
                    rows={23}
                    animate={open}
                  />
                </div>
                <span class="tag eyebrow">plate {track.n} / {track.name}</span>
              </div>
            </div>
          </div>
        </div>
      </li>
    {/each}
  </ul>
</section>

<style>
  /* a contact sheet of the seven plates, top right of the section */
  .contact {
    position: absolute;
    top: clamp(64px, 8vw, 116px);
    right: var(--gutter);
    width: min(520px, 42vw);
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 8px;
  }
  .contact button {
    position: relative;
    padding: 0;
    border: 2px solid var(--paper);
    background: var(--ink);
    transition:
      transform 0.25s var(--ease),
      box-shadow 0.25s var(--ease);
  }
  .contact button.on {
    transform: translateY(-10px);
    box-shadow: 4px 6px 0 var(--lime);
    border-color: var(--lime);
  }
  .contact :global(.art) {
    width: 100%;
  }
  .contact .eyebrow {
    position: absolute;
    left: 0;
    bottom: 0;
    background: var(--ink);
    color: var(--lime);
    font-size: 8px;
    padding: 1px 4px;
  }
  .contact button.on .eyebrow {
    background: var(--lime);
    color: var(--ink);
  }
  @media (max-width: 980px) {
    .contact {
      display: none;
    }
  }
  .rows {
    border-top: 2px solid var(--paper);
  }
  .rows > li {
    border-bottom: 2px solid var(--paper);
  }
  .head {
    width: 100%;
    display: grid;
    grid-template-columns: 56px 1fr auto 28px;
    align-items: center;
    gap: 12px;
    padding: 14px 0;
    background: none;
    border: 0;
    text-align: left;
    color: var(--paper);
  }
  .n {
    font-family: var(--pixel);
    font-size: 12px;
    color: var(--red);
  }
  .name {
    font-size: clamp(26px, 5.2vw, 68px);
    font-weight: 800;
    letter-spacing: -0.05em;
    text-transform: uppercase;
    line-height: 1;
  }
  .count {
    font-family: var(--pixel);
    font-size: 10px;
    text-transform: uppercase;
    color: var(--dim);
  }
  .open .head,
  .head:hover {
    color: var(--lime);
  }
  .body {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.45s var(--ease);
  }
  .open .body {
    grid-template-rows: 1fr;
  }
  .inner {
    overflow: hidden;
    min-height: 0;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 0.9fr);
    gap: clamp(16px, 3vw, 48px);
    align-items: center;
  }
  .open .inner {
    padding-bottom: 28px;
  }
  .copy {
    padding-left: 68px;
  }
  .blurb {
    font-size: clamp(15px, 1.6vw, 20px);
    margin: 0 0 16px;
    color: var(--paper);
  }
  .evs li {
    border-top: 1px dashed var(--hair);
  }
  .evs button {
    width: 100%;
    display: flex;
    gap: 10px;
    align-items: baseline;
    padding: 9px 0;
    background: none;
    border: 0;
    color: inherit;
    text-align: left;
  }
  .en {
    font-weight: 700;
  }
  .dots {
    flex: 1;
    border-bottom: 2px dotted var(--hair);
    transform: translateY(-3px);
  }
  .ed {
    color: var(--dim);
    font-size: 12px;
  }
  .evs button:hover {
    color: var(--lime);
  }
  .art-wrap {
    color: var(--lime);
    max-width: 440px;
    justify-self: end;
    width: 100%;
    padding: 0 10px 10px 0;
  }
  /* the poster is the plate; the ASCII scene is struck over it in lime */
  .plate {
    position: relative;
    border: 2px solid var(--paper);
    box-shadow: 9px 9px 0 var(--red);
    background: var(--ink);
  }
  .over {
    position: absolute;
    inset: 0;
    overflow: hidden;
    mix-blend-mode: screen;
    color: var(--lime);
    display: grid;
    align-items: center;
    opacity: 0.9;
  }
  .tag {
    position: absolute;
    left: 0;
    bottom: 0;
    background: var(--lime);
    color: var(--ink);
    padding: 3px 8px;
    font-size: 9px;
  }
  @media (max-width: 760px) {
    .head {
      grid-template-columns: 38px 1fr 24px;
    }
    .count {
      display: none;
    }
    .inner {
      grid-template-columns: 1fr;
    }
    .copy {
      padding-left: 0;
    }
    .art-wrap {
      justify-self: start;
      max-width: 340px;
    }
  }
</style>
