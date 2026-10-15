<script>
  import { onMount } from 'svelte';
  import { artFor } from './events.js';
  import { drawingTrail } from './interaction.js';
  let section;
  let active = $state(0);
  let progress = $state(0);
  const stories = [
    {
      track: 'Robotics',
      heading: 'Built by you.\nTested here.',
      copy: 'From obstacle tracks to robotic football, bring your engineering off the drawing board and into the arena.',
    },
    {
      track: 'Code',
      heading: 'A little pressure.\nA lot of possibility.',
      copy: 'Algorithms, front-end prototypes, and a capture-the-flag mystery. This is where a late-night idea meets its next challenge.',
    },
    {
      track: 'Design',
      heading: 'Make something\nworth talking about.',
      copy: 'Cerebro brings students across disciplines together. Compete with a team, discover a new field, and meet your next collaborator.',
    },
  ];
  onMount(() => {
    const media = matchMedia(
      '(prefers-reduced-motion: reduce), (max-width: 760px)',
    );
    let frame;
    function sync() {
      frame = null;
      if (media.matches) return;
      const rect = section.getBoundingClientRect();
      const p = Math.max(
        0,
        Math.min(1, -rect.top / Math.max(1, rect.height - innerHeight)),
      );
      progress = p;
      active = Math.min(2, Math.floor(p * 3));
    }
    function scroll() {
      if (!frame) frame = requestAnimationFrame(sync);
    }
    window.addEventListener('scroll', scroll, { passive: true });
    window.addEventListener('resize', scroll);
    media.addEventListener('change', scroll);
    sync();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', scroll);
      window.removeEventListener('resize', scroll);
      media.removeEventListener('change', scroll);
    };
  });
</script>

<section
  id="about"
  class="experience"
  bind:this={section}
  aria-labelledby="about-title"
>
  <div class="sticky" use:drawingTrail>
    <div class="story">
      <p class="eyebrow">02 / More than a competition</p>
      <h2 id="about-title">Beyond the<br /><em>horizon.</em></h2>
      <p class="about-copy">
        The national-level technical cerebro of IIIT Vadodara. Made for the
        ones who ask “what if?” — and then go build it.
      </p>
      <div class="story-copy">
        <span class="story-count eyebrow">0{active + 1} / 03</span>
        <h3>{stories[active].heading}</h3>
        <p>{stories[active].copy}</p>
      </div>
      <div class="story-nav" aria-label="Explore the cerebro">
        {#each stories as story, i}<button
            class:active={active === i}
            aria-pressed={active === i}
            onclick={() => (active = i)}
            ><span>0{i + 1}</span> {story.track}</button
          >{/each}
      </div>
      <div class="progress" aria-hidden="true">
        <span style:transform="scaleX({progress})"></span>
      </div>
    </div>
    <div class="gallery" aria-label="cerebro illustrations">
      <span class="corner eyebrow">Field notes / Cerebro ’26</span
      >{#each stories as story, i}<img
          class:current={active === i}
          src={artFor(story.track)}
          alt={active === i ? story.track + ' event illustration' : ''}
          aria-hidden={active !== i}
          width="800"
          height="1000"
          loading="lazy"
        />{/each}<span class="image-caption eyebrow"
        >Curiosity looks good on you. ↗</span
      >
    </div>
  </div>
</section>

<style>
  .experience {
    height: 190vh;
    min-height: 1000px;
    background: var(--ink);
    color: var(--paper);
    position: relative;
  }
  .sticky {
    position: sticky;
    top: 0;
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1.05fr 1fr;
    gap: 10%;
    padding: 115px var(--gutter) 60px;
    overflow: hidden;
  }
  .story {
    max-width: 570px;
    position: relative;
    z-index: 4;
    pointer-events: none;
  }
  .story-nav {
    pointer-events: auto;
  }
  h2 {
    font-family: var(--type);
    font-weight: 500;
    font-size: clamp(85px, 10vw, 160px);
    line-height: 0.82;
    letter-spacing: -0.02em;
    margin: 30px 0;
  }
  h2 em {
    color: #f27b62;
  }
  .eyebrow {
    color: #c3bcae;
    font-size: 10px;
  }
  .about-copy {
    font-size: 13px;
    max-width: 365px;
    color: #bdb9ae;
  }
  .story-copy {
    margin-top: 38px;
    border-top: 1px solid #ffffff30;
    padding-top: 22px;
    display: grid;
    grid-template-columns: 50px 1fr;
    column-gap: 15px;
  }
  .story-count {
    padding-top: 5px;
    font-size: 9px;
  }
  h3 {
    font-family: var(--type);
    font-weight: 500;
    font-size: 37px;
    line-height: 1;
    white-space: pre-line;
    margin-bottom: 10px;
  }
  .story-copy p {
    grid-column: 2;
    font-size: 12px;
    color: #bdb9ae;
    max-width: 350px;
    min-height: 60px;
  }
  .story-nav {
    display: flex;
    gap: 22px;
    margin-top: 15px;
  }
  .story-nav button {
    background: none;
    border: 0;
    border-bottom: 1px solid transparent;
    padding: 12px 0;
    color: #bdb9ae;
    font-size: 11px;
    display: flex;
    gap: 8px;
  }
  .story-nav button.active {
    color: #f27b62;
    border-bottom-color: #f27b62;
  }
  .story-nav span {
    font-size: 8px;
  }
  .progress {
    height: 2px;
    background: #ffffff20;
    margin-top: 20px;
  }
  .progress span {
    display: block;
    height: 100%;
    background: #f27b62;
    transform-origin: left;
  }
  .gallery {
    position: relative;
    align-self: center;
    aspect-ratio: 4/5;
    max-height: 70vh;
    width: 100%;
    transform: rotate(3deg);
  }
  .gallery img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    clip-path: inset(0 0 100% 0);
    filter: brightness(0.7);
    transition:
      clip-path 0.8s var(--ease),
      filter 0.8s;
    z-index: 1;
  }
  .gallery img.current {
    clip-path: inset(0);
    filter: brightness(1);
    z-index: 2;
  }
  .corner {
    position: absolute;
    top: -28px;
    left: 0;
  }
  .image-caption {
    position: absolute;
    bottom: -28px;
    right: 0;
  }
  .gallery .eyebrow {
    font-size: 8px;
  }
  @media (max-width: 1050px) {
    .sticky {
      gap: 5%;
      padding-top: 110px;
    }
    h2 {
      font-size: 110px;
    }
    .story-copy {
      margin-top: 25px;
    }
    .story-nav {
      gap: 15px;
    }
  }
  @media (max-width: 760px) {
    .experience {
      height: auto;
      min-height: 0;
    }
    .sticky {
      position: relative;
      grid-template-columns: 1fr;
      padding: 70px var(--gutter);
      gap: 50px;
      min-height: 0;
    }
    .story {
      max-width: none;
    }
    h2 {
      font-size: 105px;
    }
    .story-copy p {
      min-height: 70px;
    }
    .gallery {
      width: 80%;
      max-height: none;
      margin: 0 auto 20px;
    }
    .progress {
      display: none;
    }
    .story-nav {
      justify-content: space-between;
    }
    .about-copy {
      max-width: 100%;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .experience {
      height: auto;
      min-height: 0;
    }
    .sticky {
      position: relative;
      min-height: 0;
    }
    .progress {
      display: none;
    }
    .gallery img {
      transition: none;
    }
  }
</style>
