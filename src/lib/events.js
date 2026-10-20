import { EVENTS, plain } from './content.js';
import { EVENT_DETAILS } from './event-details.js';

export const TIME_ZONE = 'Asia/Kolkata';
export const PLAN_KEY = 'cerebro26.plan.v1';
export const catalog = EVENTS.map((event) => ({
  ...event,
  ...EVENT_DETAILS[event.id],
}));
// The directory lists competitions and zones; the ceremony only appears on
// the schedule.
export const directory = catalog.filter((event) => event.kind !== 'ceremony');
export const competitions = catalog.filter((event) => event.kind === 'event');

// Schedule receipts, in print order.
export const SLOTS = [
  {
    id: 'online',
    label: 'Online window',
    range: '26 – 30 Oct',
    note: 'Play from anywhere',
  },
  {
    id: 'd1',
    label: 'Finals · Day 1',
    range: '31 Oct',
    note: 'Gandhinagar Campus',
  },
  {
    id: 'd2',
    label: 'Finals · Day 2',
    range: '1 Nov',
    note: 'Gandhinagar Campus',
  },
  {
    id: 'leagues',
    label: 'Arcadia leagues',
    range: '31 Oct & 1 Nov',
    note: 'Online · slots to be announced',
  },
];
export const inSlot = (event, slot) => (event.slots || []).includes(slot);
export const byStart = (a, b) =>
  (validDate(a.startsAt) ? Date.parse(a.startsAt) : Infinity) -
  (validDate(b.startsAt) ? Date.parse(b.startsAt) : Infinity);
export const pendingText = (value) => value ?? 'To be announced';
export const safeUrl = (value) => {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
};
export const validDate = (value) =>
  typeof value === 'string' &&
  /T.*(?:Z|[+-]\d{2}:\d{2})$/.test(value) &&
  Number.isFinite(Date.parse(value));
export function dateLabel(value, options = {}) {
  return validDate(value)
    ? new Intl.DateTimeFormat('en-IN', {
        timeZone: TIME_ZONE,
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        ...options,
      }).format(new Date(value))
    : 'Date to be announced';
}
// A plain date for display, honouring a hand-written `dateText`.
export const whenLabel = (event) => event.dateText || dateLabel(event.startsAt);
export function timeLabel(event) {
  if (event.timeText) return event.timeText;
  if (!validDate(event.startsAt)) return 'Time to be announced';
  const format = (value) =>
    new Intl.DateTimeFormat('en-IN', {
      timeZone: TIME_ZONE,
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(value));
  return `${format(event.startsAt)}${validDate(event.endsAt) ? ` – ${format(event.endsAt)}` : ''} IST`;
}
// '2026-10-31T21:00:00+05:30' -> '21:00' in IST, for the receipts.
export function clock(value) {
  if (!validDate(value)) return '--:--';
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(new Date(value));
}
export function registrationState(event, now = Date.now()) {
  const registration = event.registration || {};
  if (
    registration.status === 'closed' ||
    (validDate(registration.deadline) &&
      Date.parse(registration.deadline) <= now) ||
    (validDate(event.startsAt) && Date.parse(event.startsAt) <= now)
  )
    return { key: 'closed', label: 'Registration closed', url: null };
  if (registration.status === 'full')
    return { key: 'full', label: 'All spots filled', url: null };
  const url = safeUrl(registration.url);
  if (registration.status === 'open' && url)
    return { key: 'open', label: 'Registration open', url };
  return { key: 'upcoming', label: 'Registration opening soon', url: null };
}
export function filterEvents(
  events,
  {
    query = '',
    track = 'All',
    mode = 'All',
    savedOnly = false,
    saved = [],
  } = {},
) {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return events.filter((event) => {
    const text = [
      event.name,
      event.track,
      event.club,
      event.room,
      event.venue,
      event.teamSize,
      plain(event.lede),
      ...event.organizers.map((p) => `${p.name} ${p.role}`),
    ]
      .join(' ')
      .toLowerCase();
    return (
      (track === 'All' || event.track === track) &&
      (mode === 'All' || event.mode === mode) &&
      (!savedOnly || saved.includes(event.id)) &&
      terms.every((term) => text.includes(term))
    );
  });
}
export function readPlan(storage) {
  try {
    const value = JSON.parse(storage.getItem(PLAN_KEY));
    return Array.isArray(value)
      ? [...new Set(value.filter((id) => catalog.some((e) => e.id === id)))]
      : [];
  } catch {
    return [];
  }
}
export function writePlan(storage, ids) {
  try {
    storage.setItem(PLAN_KEY, JSON.stringify(ids));
    return true;
  } catch {
    return false;
  }
}
export function calendarContent(event, now = new Date()) {
  if (
    !validDate(event.startsAt) ||
    !validDate(event.endsAt) ||
    Date.parse(event.endsAt) <= Date.parse(event.startsAt)
  )
    return null;
  const escape = (text) =>
    String(text)
      .replaceAll('\\', '\\\\')
      .replace(/\r?\n/g, '\\n')
      .replaceAll(';', '\\;')
      .replaceAll(',', '\\,');
  const stamp = (value) =>
    new Date(value)
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\.\d{3}/, '');
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Cerebro//Events 2026//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${event.id}-2026@cerebro.iiitv`,
    `DTSTAMP:${stamp(now)}`,
    `DTSTART:${stamp(event.startsAt)}`,
    `DTEND:${stamp(event.endsAt)}`,
    `SUMMARY:${escape(`${event.name} · Cerebro ’26`)}`,
    `LOCATION:${escape([event.venue, event.room].filter(Boolean).join(' · '))}`,
    `DESCRIPTION:${escape(plain(event.lede))}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  // RFC 5545 lines fold at 75 UTF-8 octets, without splitting a code point.
  return (
    lines
      .map((line) => {
        let result = '',
          bytes = 0;
        for (const char of line) {
          const size = new TextEncoder().encode(char).length;
          if (bytes + size > 75) {
            result += '\r\n ';
            bytes = 1;
          }
          result += char;
          bytes += size;
        }
        return result;
      })
      .join('\r\n') + '\r\n'
  );
}
export function downloadCalendar(event) {
  const content = calendarContent(event);
  if (!content) return false;
  const url = URL.createObjectURL(
    new Blob([content], { type: 'text/calendar;charset=utf-8' }),
  );
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `cerebro-${event.id}.ics`;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return true;
}
