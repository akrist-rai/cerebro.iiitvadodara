# Editing event information

Event copy lives in `src/lib/content.js`. Event operations live in `src/lib/event-details.js`, keyed by the same stable event IDs. Edit these files and rebuild; no backend or CMS is required.

The content was filled from **CERBRO 2026-27 OFFICIAL PROPOSAL** (the master schedule and annexures A–P). Anything the proposal does not state is `null` or an empty list and is shown as "To be announced". Never infer a value.

## Per-event fields (`event-details.js`)

| Field                                             | Value                                                                                               |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `startsAt`, `endsAt`                              | ISO timestamps with an explicit offset, e.g. `2026-10-31T10:00:00+05:30`, or `null`.                |
| `dateText`, `timeText`                            | Hand-written date/time shown instead of the formatted range (multi-day or unannounced slots).       |
| `slots`                                           | Which schedule receipts list it: `online`, `d1`, `d2`, `leagues`.                                   |
| `venue`, `room`                                   | Campus/platform and the allotted room.                                                              |
| `mode`                                            | `In person`, `Online`, `Hybrid`, or `null`.                                                         |
| `club`                                            | Organizing club.                                                                                    |
| `organizers`                                      | `{ name, role, email?, phone? }`. Only publish confirmed public contact details.                    |
| `prizes`, `prizeTotal`                            | `{ title, amount, extra? }` rows; the total must equal the sum (validated). Omit it if it does not. |
| `objective`, `details`, `rules`, `notes`          | Briefing copy: objective, titled bullet groups (phases, specs…), numbered rules, practical notes.   |
| `fee`                                             | INR number, `0` for free, or `null`.                                                                |
| `teamSize`, `eligibility`, `capacity`, `duration` | Human-readable strings or `null`.                                                                   |
| `registration.status`                             | `upcoming`, `open`, `full`, or `closed`; `registration.url` is the official HTTP(S) form.           |

`kind` in `content.js` is `event`, `zone` (Arcade Corner) or `ceremony` (the inauguration). Only events and zones appear in the directory; the ceremony only appears on the schedule.

## Where the proposal contradicts itself

The **master schedule table** is treated as authoritative. Check these with the organizers before publishing:

| Item                  | Master schedule                    | Annexure says                     |
| --------------------- | ---------------------------------- | --------------------------------- |
| Equinox               | 31 Oct, 10:00–12:00                | 30 Oct, 2 hrs                     |
| Tech Hunt             | 31 Oct, 12:00–18:00                | 30 Oct, 2:00–7:00 PM              |
| D2D                   | 31 Oct, 13:00–14:00                | 30 Oct, three phases              |
| Robo Race             | 31 Oct, 16:00–18:00                | 30 Oct, 04:00–06:00               |
| Robo Soccer           | 1 Nov, 15:00–18:00                 | 31 Oct                            |
| Trio-Codejam          | 1 Nov, 11:00–13:00                 | 31 Oct                            |
| CodeClash end time    | `12:00 PM` after a `9:00 PM` start | 3 hours, so shown as 00:00        |
| Gaming leagues        | "Both days", no times              | "Last week of October", online    |
| CodeClash prize total | ₹9,750                             | Rows sum to ₹8,550; total omitted |
| Robo Race format      | Deck: knockout                     | Proposal: one timed run each      |

Other things to verify: the Robo Soccer annexure repeats Aditya Vikram's number for Ojas Naringe (Robo Race's number is used); Tanishq Singhal has two different contacts across annexures, so none is published; two organizer emails are malformed in the PDF and were left out.

Sponsor tier amounts are not published: the deck gives bare numbers with no unit, and Annexure I (the brochure) is not in the proposal.

## Registration

Registration uses an external official form. Set an event's `registration.status` to `open` and supply its `registration.url`. The UI then enables **Register for [event]**. A missing or unsafe URL always stays pending. Deadlines and event start times close registration automatically.

## Schedule and personal plans

All times use Asia/Kolkata (IST). Bookmarks store only event IDs under `cerebro26.plan.v1` in localStorage. Event deep links use `#event/<id>`; the registration desk is `#register`.

## Checks

Run `npm run check:content`, `npm test`, `npm run build` and `npm run test:e2e` before publishing. The validator rejects invalid dates, unsafe links, unknown statuses, negative fees, malformed prize rows and totals that do not add up.
