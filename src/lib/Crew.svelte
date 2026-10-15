<script>
  import SectionHead from './SectionHead.svelte';
  import Art from './Art.svelte';
  import { CREW } from './content.js';
  import { face } from './ascii.js';
  import { reveal } from './interaction.js';

  const leads = CREW.leads.map((p, i) => ({
    ...p,
    no: String(i + 1).padStart(2, '0'),
    art: face(p.name).join('\n'),
  }));
  let active = $state(0);
</script>

<section id="contact" class="sec" aria-labelledby="crew-title">
  <SectionHead
    id="crew-title"
    n="06"
    kicker="crew / whoami"
    title="Crew"
    blurb={CREW.intro}
  >
    <div class="collage">
      <span class="taped" style="width:30%;right:30%;top:0;--rot:-4deg"
        ><Art id="n54" /></span
      >
      <span class="taped" style="width:24%;right:3%;top:24px;--rot:5deg"
        ><Art id="g54" tone="ink-paper" dots={0.5} ghost /></span
      >
      <span style="width:17%;right:22%;top:130px;--rot:8deg"
        ><Art id="n28" cut /></span
      >
    </div>
  </SectionHead>

  <ul class="badges" use:reveal>
    {#each leads as p, i}
      <li>
        <button
          class="badge"
          class:active={active === i}
          aria-pressed={active === i}
          onpointerenter={(e) => {
            if (e.pointerType === 'mouse') active = i;
          }}
          onfocus={() => (active = i)}
          onclick={() => (active = i)}
        >
          <span class="no eyebrow">crew no. {p.no}</span>
          <pre class="art face" aria-hidden="true">{p.art}</pre>
          <span class="name">{p.name}</span>
          <span class="role">{p.role}</span>
        </button>
      </li>
    {/each}
  </ul>

  <div class="core" use:reveal>
    <h3 class="eyebrow">
      core committee <span aria-hidden="true">/ ls -1</span>
    </h3>
    <ul>
      {#each CREW.core as name}<li>
          <span aria-hidden="true">›</span>
          {name}
        </li>{/each}
    </ul>
  </div>
</section>

<style>
  .badges {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 18px;
  }
  .badge {
    width: 100%;
    text-align: left;
    background: var(--paper-hi);
    border: 2px solid var(--ink);
    padding: 12px 14px 14px;
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-areas:
      'no no'
      'face name'
      'face role';
    gap: 0 14px;
    align-items: end;
    box-shadow: 4px 4px 0 var(--ink);
    transition:
      transform 0.15s var(--ease),
      box-shadow 0.15s var(--ease),
      background 0.15s;
  }
  .badge.active {
    background: var(--lime);
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0 var(--ink);
  }
  .no {
    grid-area: no;
    color: var(--red);
    border-bottom: 2px dashed var(--hair);
    margin-bottom: 10px;
    padding-bottom: 6px;
  }
  .face {
    grid-area: face;
    font-size: 12px;
    color: var(--ink);
  }
  .name {
    grid-area: name;
    font-weight: 800;
    font-size: 17px;
    letter-spacing: -0.03em;
    line-height: 1.15;
    align-self: end;
  }
  .role {
    grid-area: role;
    color: var(--dim);
    font-size: 12px;
    text-transform: lowercase;
    align-self: start;
  }
  .core {
    margin-top: clamp(32px, 5vw, 56px);
    border-top: 2px solid var(--ink);
    padding-top: 18px;
  }
  .core ul {
    columns: 4 180px;
    column-gap: 24px;
    margin-top: 12px;
  }
  .core li {
    break-inside: avoid;
    padding: 3px 0;
    font-size: 13px;
  }
  .core li span {
    color: var(--red);
    font-weight: 800;
  }
  @media (max-width: 900px) {
    .badges {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  @media (max-width: 560px) {
    .badges {
      grid-template-columns: 1fr;
    }
  }
</style>
