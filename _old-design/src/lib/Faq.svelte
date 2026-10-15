<script>
  import Icon from './Icon.svelte';
</script>

<section class="section faq" aria-labelledby="faq-title">
  <div>
    <p class="eyebrow">A few things worth knowing</p>
    <h2 class="section-heading" id="faq-title">
      Before you<br /><em>show up.</em>
    </h2>
  </div>
  <div class="questions">
    <details>
      <summary
        >How do I register for an event?<Icon name="plus" size={18} /></summary
      >
      <p>
        Choose an event and select Register. Once registration is open, the
        event briefing links to its official form. Submit that form and follow
        the organizer’s confirmation instructions. Until then, you can save the
        event to your plan.
      </p>
    </details>
    <details>
      <summary
        >Are the dates and rooms confirmed?<Icon
          name="plus"
          size={18}
        /></summary
      >
      <p>
        The final schedule is yet to be announced. Each event’s date, start and
        end time, venue, allotted room, and organizing club will appear in the
        directory and schedule as they are confirmed. All times are shown in
        IST.
      </p>
    </details>
    <details>
      <summary
        >Can I take part in more than one event?<Icon
          name="plus"
          size={18}
        /></summary
      >
      <p>
        Build a shortlist using My plan. Once the timetable and rules are
        published, check for time clashes and each event’s eligibility
        requirements before registering. Each event has its own registration.
      </p>
    </details>
    <details>
      <summary
        >What about teams, entry fees, and prizes?<Icon
          name="plus"
          size={18}
        /></summary
      >
      <p>
        Open the event briefing for the team size, entry fee, prize details,
        rules, and organizer contacts. Information that has not been confirmed
        is marked “To be announced.” Virtual trading funds are part of the
        finance competitions, not a cash prize.
      </p>
    </details>
    <details>
      <summary
        >Does saving an event reserve a place?<Icon
          name="plus"
          size={18}
        /></summary
      >
      <p>
        No. My plan is a personal shortlist stored in this browser. It does not
        send an entry to the organizers, reserve a place, or sync across
        devices. Complete the official registration separately.
      </p>
    </details>
  </div>
</section>

<style>
  .faq {
    display: grid;
    grid-template-columns: 1fr 1.3fr;
    gap: 10%;
    border-top: 1px solid var(--hair);
  }
  .questions {
    border-top: 1px solid var(--ink);
  }
  details {
    border-bottom: 1px solid var(--hair);
  }
  summary {
    font-size: 13px;
    font-weight: 500;
    list-style: none;
    cursor: pointer;
    padding: 23px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
  }
  summary::-webkit-details-marker {
    display: none;
  }
  summary :global(svg) {
    transition: transform 0.25s;
  }
  details[open] summary :global(svg) {
    transform: rotate(45deg);
  }
  details[open] summary {
    color: var(--red);
  }
  details p {
    font-size: 12px;
    color: var(--dim);
    padding: 0 35px 18px 0;
    margin: 0;
  }
  @media (max-width: 760px) {
    .faq {
      grid-template-columns: 1fr;
      gap: 35px;
    }
    summary {
      font-size: 12px;
      line-height: 1.6;
    }
  }
</style>
