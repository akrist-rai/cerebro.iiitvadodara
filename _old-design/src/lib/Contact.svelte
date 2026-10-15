<script>
  import { CONTACT } from './content.js';
  import { catalog } from './events.js';
  import { reveal } from './interaction.js';
  const people = CONTACT.groups.flatMap((group) =>
    group.people.map((person) => ({
      ...person,
      group: group.label,
      name: person.name.replace(/\b\w/g, (c) => c.toUpperCase()),
    })),
  );
  let active = $state(0);
  const person = $derived(people[active]);
  const assignments = $derived(
    catalog.filter((event) =>
      event.organizers.some(
        (p) => p.name.toLowerCase() === person.name.toLowerCase(),
      ),
    ),
  );
</script>

<section id="contact" class="section people" aria-labelledby="people-title">
  <div class="section-top" use:reveal>
    <div>
      <p class="eyebrow">05 / The people who make it happen</p>
      <h2 id="people-title" class="section-heading">
        Many minds.<br /><em>One cerebro.</em>
      </h2>
    </div>
    <p>
      The crew behind Cerebro. Meet the organizers, developers, and logistics
      team bringing it all together.
    </p>
  </div>
  <div class="member-grid" use:reveal>
    {#each people as member, i}<button
        class="member"
        class:active={active === i}
        aria-pressed={active === i}
        onpointerenter={(e) => {
          if (e.pointerType === 'mouse') active = i;
        }}
        onfocus={() => (active = i)}
        onclick={() => (active = i)}
        ><div
          class="portrait"
          style:--tone={['#d4d8c1', '#dcc9b9', '#c6ccd4', '#d8c6c1', '#c9cec2'][
            i
          ]}
        >
          <span class="member-no eyebrow">0{i + 1} / CREW</span>
          <div class="portrait-lines" aria-hidden="true"></div>
          <span class="initials" aria-hidden="true"
            >{member.name
              .split(' ')
              .map((n) => n[0])
              .join('')}</span
          ><span class="member-group eyebrow">{member.group}</span>
        </div>
        <div class="name-line">
          <span>{member.name}</span><span class="plus" aria-hidden="true"
            >↗</span
          >
        </div>
        <span class="role">{member.group}</span></button
      >{/each}
  </div>
  <div class="member-focus">
    <span class="eyebrow">Behind the scenes<br />/ {person.group}</span>
    <p class="hover-name">{person.name}</p>
    <div class="assignment">
      <span class="eyebrow">Event assignments</span>
      <p>
        {assignments.length
          ? assignments.map((event) => event.name).join(' · ')
          : 'To be announced'}
      </p>
    </div>
  </div>
  <p class="team-note">
    Event-specific organizers, roles, clubs, and contact details will appear in
    each event briefing once confirmed.
  </p>
</section>

<style>
  .member-grid {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 17px;
  }
  .member {
    min-width: 0;
    border: 0;
    text-align: left;
    padding: 0;
    background: none;
  }
  .portrait {
    position: relative;
    aspect-ratio: 4/5;
    background: var(--tone);
    overflow: hidden;
    transition: background 0.4s;
  }
  .member-no {
    position: absolute;
    top: 16px;
    left: 14px;
    font-size: 8px;
  }
  .portrait-lines {
    position: absolute;
    width: 115%;
    height: 80%;
    border: 1px solid #2223;
    border-radius: 50%;
    left: -7%;
    top: 13%;
    transform: rotate(35deg);
    transition: transform 0.7s var(--ease);
  }
  .portrait-lines::after,
  .portrait-lines::before {
    content: '';
    position: absolute;
    inset: 15px;
    border: 1px solid #2223;
    border-radius: 50%;
  }
  .portrait-lines::after {
    inset: 30px;
  }
  .initials {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    font-family: var(--type);
    font-weight: 500;
    font-size: clamp(65px, 8vw, 140px);
    letter-spacing: -0.035em;
    transition: transform 0.7s var(--ease);
  }
  .member-group {
    position: absolute;
    bottom: 15px;
    left: 14px;
    right: 14px;
    font-size: 8px;
    transform: translateY(38px);
    transition: transform 0.5s var(--ease);
  }
  .member.active .portrait {
    background: var(--accent);
  }
  .member.active .initials {
    transform: translateY(-12px) scale(1.05);
  }
  .member.active .portrait-lines {
    transform: rotate(70deg);
  }
  .member.active .member-group {
    transform: none;
  }
  .name-line {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    font-family: var(--type);
    font-size: 30px;
    font-weight: 600;
    margin: 13px 0 3px;
  }
  .plus {
    font-family: var(--body);
    font-size: 17px;
    align-self: center;
    transition: transform 0.3s;
  }
  .member.active .plus {
    transform: rotate(45deg);
  }
  .role {
    font-size: 9px;
    text-transform: capitalize;
    color: var(--dim);
  }
  .member-focus {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    border-top: 1px solid var(--ink);
    border-bottom: 1px solid var(--ink);
    padding: 30px 0;
    margin-top: 43px;
  }
  .member-focus > .eyebrow {
    font-size: 8px;
    color: var(--dim);
    line-height: 1.8;
  }
  .hover-name {
    font-family: var(--type);
    font-size: clamp(54px, 6.5vw, 105px);
    font-weight: 500;
    line-height: 0.95;
    margin: 0;
    color: var(--red);
    text-align: center;
  }
  .assignment .eyebrow {
    font-size: 8px;
  }
  .assignment p {
    font-size: 11px;
    color: var(--dim);
    margin: 6px 0 0;
  }
  .team-note {
    font-size: 10px;
    color: var(--dim);
    margin: 20px 0 0;
  }
  @media (max-width: 900px) {
    .member-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 25px 16px;
    }
    .initials {
      font-size: 110px;
    }
    .member-focus {
      flex-wrap: wrap;
    }
    .assignment {
      width: 100%;
      text-align: right;
    }
  }
  @media (max-width: 520px) {
    .member-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 25px 14px;
    }
    .initials {
      font-size: 100px;
    }
    .name-line {
      font-size: 29px;
    }
    .member-group {
      transform: none;
      font-size: 7px;
    }
    .member-focus {
      display: block;
    }
    .hover-name {
      text-align: left;
      font-size: 67px;
      margin-top: 18px;
    }
    .assignment {
      text-align: left;
      margin-top: 20px;
    }
  }
</style>
