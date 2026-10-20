import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  catalog,
  filterEvents,
  registrationState,
  calendarContent,
  dateLabel,
  timeLabel,
  readPlan,
  writePlan,
  safeUrl,
  validDate,
  PLAN_KEY,
} from '../src/lib/events.js';
const base = catalog.find((e) => e.id === 'equinox');
const example = {
  ...base,
  startsAt: '2027-01-16T09:00:00+05:30',
  endsAt: '2027-01-16T11:00:00+05:30',
  registration: {
    status: 'open',
    url: 'https://example.org/register',
    deadline: '2027-01-15T23:59:00+05:30',
  },
};
const before = Date.parse('2027-01-01T00:00:00Z');
describe('event registration', () => {
  it('never enables registration without a real HTTP(S) URL', () => {
    for (const event of catalog)
      assert.equal(registrationState(event, before).url, null);
    for (const url of [
      null,
      '#',
      'javascript:alert(1)',
      'data:text/html,test',
      '/register',
    ])
      assert.equal(
        registrationState(
          { ...example, registration: { status: 'open', url } },
          before,
        ).url,
        null,
      );
    assert.equal(
      registrationState(example, before).url,
      'https://example.org/register',
    );
  });
  it('closes exactly at the deadline and never reopens full/closed events', () => {
    assert.equal(
      registrationState(example, Date.parse(example.registration.deadline)).key,
      'closed',
    );
    assert.equal(
      registrationState(
        {
          ...example,
          registration: { ...example.registration, deadline: null },
        },
        Date.parse(example.startsAt),
      ).key,
      'closed',
    );
    assert.equal(
      registrationState(
        {
          ...example,
          registration: { ...example.registration, status: 'full' },
        },
        before,
      ).key,
      'full',
    );
    assert.equal(
      registrationState(
        {
          ...example,
          registration: { ...example.registration, status: 'closed' },
        },
        before,
      ).key,
      'closed',
    );
  });
});
describe('discovery and saved plans', () => {
  it('combines search, track, format, and saved filters', () => {
    assert.deepEqual(
      filterEvents(catalog, {
        query: 'ROBO',
        track: 'Robotics',
        savedOnly: true,
        saved: ['robo-soccer'],
      }).map((e) => e.id),
      ['robo-soccer'],
    );
    assert.deepEqual(
      filterEvents(catalog, { mode: 'Online' }).map((e) => e.id),
      ['prudentia', 'codeclash', 'valorant', 'bgmi', 'codm', 'clash-royale'],
    );
    assert.equal(
      filterEvents(catalog, { query: 'nonexistent club' }).length,
      0,
    );
    assert.equal(filterEvents(catalog, { query: '  ' }).length, catalog.length);
    assert.equal(
      filterEvents(
        [
          {
            ...example,
            club: 'Robotics Society',
            room: 'B-201',
            organizers: [{ name: 'Example Organizer', role: 'Coordinator' }],
          },
        ],
        { query: 'society B-201 coordinator' },
      ).length,
      1,
    );
  });
  it('recovers from corrupt, stale and inaccessible storage', () => {
    assert.deepEqual(readPlan({ getItem: () => '{bad' }), []);
    assert.deepEqual(readPlan({ getItem: () => '{}' }), []);
    assert.deepEqual(
      readPlan({
        getItem: () => JSON.stringify(['equinox', 'equinox', 'unknown', 5]),
      }),
      ['equinox'],
    );
    assert.deepEqual(
      readPlan({
        getItem: () => {
          throw Error('blocked');
        },
      }),
      [],
    );
    assert.equal(
      writePlan(
        {
          setItem: () => {
            throw Error('blocked');
          },
        },
        ['equinox'],
      ),
      false,
    );
    const storage = {
      setItem(key, value) {
        assert.equal(key, PLAN_KEY);
        this.value = value;
      },
      getItem() {
        return this.value;
      },
    };
    assert.equal(writePlan(storage, ['d2d']), true);
    assert.deepEqual(readPlan(storage), ['d2d']);
  });
});
describe('dates and calendar export', () => {
  it('formats dates in IST regardless of the browser timezone', () => {
    assert.match(dateLabel('2027-01-15T20:00:00Z'), /16 Jan 2027/);
    assert.match(timeLabel(example), /9:00.*11:00.*IST/);
    assert.equal(validDate('2027-01-16T09:00:00'), false);
    assert.equal(dateLabel(null), 'Date to be announced');
  });
  it('exports only events with a confirmed start and end', () => {
    for (const event of catalog) {
      const dated = Boolean(event.startsAt && event.endsAt);
      assert.equal(calendarContent(event) !== null, dated, event.id);
    }
    for (const id of ['valorant', 'bgmi', 'codm', 'clash-royale'])
      assert.equal(calendarContent(catalog.find((e) => e.id === id)), null);
    assert.equal(
      calendarContent({ ...example, endsAt: example.startsAt }),
      null,
    );
  });
  it('exports UTC timestamps, escapes content and folds UTF-8 at 75 octets', () => {
    const output = calendarContent({
      ...example,
      name: 'Quiz; one, two',
      lede: 'One\nTwo ' + 'च'.repeat(70),
    });
    assert.match(output, /DTSTART:20270116T033000Z/);
    assert.match(output, /DTEND:20270116T053000Z/);
    assert.ok(output.includes('Quiz\\; one\\, two'));
    assert.ok(output.replaceAll('\r\n ', '').includes('DESCRIPTION:One\\nTwo'));
    for (const line of output.split('\r\n'))
      assert.ok(Buffer.byteLength(line) <= 75);
    assert.match(output, /END:VCALENDAR\r\n$/);
  });
  it('rejects unsafe external links', () => {
    assert.equal(safeUrl('javascript:alert(1)'), null);
    assert.equal(
      safeUrl('https://example.org/rules'),
      'https://example.org/rules',
    );
  });
});

describe('proposal data', () => {
  it('lists fifteen competitions plus the arcade zone and the ceremony', () => {
    assert.equal(catalog.filter((e) => e.kind === 'event').length, 15);
    assert.equal(catalog.filter((e) => e.kind === 'zone').length, 1);
    assert.equal(catalog.filter((e) => e.kind === 'ceremony').length, 1);
  });
  it('places every dated event inside the 26 Oct - 1 Nov window', () => {
    for (const event of catalog.filter((e) => validDate(e.startsAt))) {
      const at = Date.parse(event.startsAt);
      assert.ok(at >= Date.parse('2026-10-26T00:00:00+05:30'), event.id);
      assert.ok(at <= Date.parse('2026-11-01T23:59:00+05:30'), event.id);
    }
  });
  it('puts every event on at least one schedule receipt', () => {
    for (const event of catalog) assert.ok(event.slots.length > 0, event.id);
  });
});
