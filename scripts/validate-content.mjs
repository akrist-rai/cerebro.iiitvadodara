import assert from 'node:assert/strict';
import { EVENTS } from '../src/lib/content.js';
import { EVENT_DETAILS, FEST_DETAILS } from '../src/lib/event-details.js';
import { safeUrl, validDate } from '../src/lib/events.js';
assert.deepEqual(
  Object.keys(EVENT_DETAILS).sort(),
  EVENTS.map((event) => event.id).sort(),
  'Every event must have exactly one operational record.',
);
for (const [id, event] of Object.entries(EVENT_DETAILS)) {
  const check = (condition, message) =>
    assert.ok(condition, id + ': ' + message);
  for (const key of ['startsAt', 'endsAt'])
    check(
      event[key] === null || validDate(event[key]),
      key + ' must be null or an ISO timestamp with an explicit timezone.',
    );
  check(
    !event.endsAt ||
      (event.startsAt && Date.parse(event.endsAt) > Date.parse(event.startsAt)),
    'end time must follow start time.',
  );
  check(
    [null, 'In person', 'Online', 'Hybrid'].includes(event.mode),
    'invalid mode.',
  );
  check(
    ['upcoming', 'open', 'closed', 'full'].includes(event.registration.status),
    'invalid registration status.',
  );
  check(
    !event.registration.url || safeUrl(event.registration.url),
    'unsafe registration URL.',
  );
  check(
    event.registration.status !== 'open' || safeUrl(event.registration.url),
    'an open event requires an official registration URL.',
  );
  check(
    !event.registration.deadline || validDate(event.registration.deadline),
    'deadline needs an explicit timezone.',
  );
  check(
    !event.registration.deadline ||
      !event.startsAt ||
      Date.parse(event.registration.deadline) <= Date.parse(event.startsAt),
    'registration deadline cannot be after event start.',
  );
  check(!event.rulesUrl || safeUrl(event.rulesUrl), 'unsafe rulebook URL.');
  check(Array.isArray(event.organizers), 'organizers must be an array.');
  check(
    Array.isArray(event.rules) && Array.isArray(event.details),
    'rules and details must be arrays.',
  );
  check(
    Array.isArray(event.slots) && event.slots.length > 0,
    'event must be on a schedule receipt.',
  );
  for (const group of event.details)
    check(
      group.title && Array.isArray(group.items) && group.items.length,
      'each detail group needs a title and items.',
    );
  for (const person of event.organizers) {
    check(
      typeof person.name === 'string' && person.name.trim(),
      'each organizer needs a name.',
    );
    check(
      !person.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(person.email),
      'invalid organizer email.',
    );
    check(
      !person.phone || /^\+?[\d\s()-]{7,20}$/.test(person.phone),
      'invalid organizer phone.',
    );
  }
}
console.log('Validated operational content for ' + EVENTS.length + ' events.');

for (const key of ['startDate', 'endDate']) {
  const value = FEST_DETAILS[key];
  assert.ok(
    value === null ||
      (typeof value === 'string' &&
        /^\d{4}-\d{2}-\d{2}$/.test(value) &&
        new Date(value + 'T00:00:00Z').toISOString().startsWith(value)),
    'cerebro ' + key + ' must be a valid YYYY-MM-DD date or null.',
  );
}
assert.ok(
  !FEST_DETAILS.endDate ||
    (FEST_DETAILS.startDate && FEST_DETAILS.endDate >= FEST_DETAILS.startDate),
  'cerebro end date cannot precede its start.',
);
