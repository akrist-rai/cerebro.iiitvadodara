import { test, expect } from '@playwright/test';
import { EVENT_DETAILS, FEST_DETAILS } from '../../src/lib/event-details.js';

test('event discovery combines search and track filters, including empty state', async ({
  page,
}) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('.stamp')).toHaveCount(17);
  await page.getByRole('searchbox').fill('robo');
  await expect(page.locator('.stamp')).toHaveCount(2);
  await page.locator('.filters').getByRole('button', { name: /^Code/ }).click();
  await expect(page.getByText('No events found.')).toBeVisible();
  await page.getByRole('button', { name: 'Show all events' }).click();
  await expect(page.locator('.stamp')).toHaveCount(17);
  await page
    .getByRole('combobox', { name: 'Event mode' })
    .selectOption('Online');
  await expect(page.locator('.stamp')).toHaveCount(6);
  await expect(page.locator('.stamp[data-event-id="codeclash"]')).toContainText(
    'CodeClash',
  );
  expect(errors).toEqual([]);
});

test('saved events persist and header opens the personal schedule', async ({
  page,
}) => {
  await page.goto('/');
  await page
    .getByRole('button', { name: 'Save Equinox to my plan', exact: true })
    .click();
  await expect(
    page.getByRole('button', {
      name: 'Remove Equinox from my plan',
      exact: true,
    }),
  ).toHaveAttribute('aria-pressed', 'true');
  await page.reload();
  await page
    .getByRole('button', { name: 'My schedule, 1 saved events' })
    .click();
  await expect(page.locator('.schedule-row')).toHaveCount(1);
  await expect(page.locator('.schedule-row')).toContainText('Equinox');
  await page
    .getByRole('button', { name: 'Remove Equinox from schedule', exact: true })
    .click();
  await expect(page.locator('.schedule-row')).toHaveCount(0);
  await expect(
    page.getByText('A little space for your favourites.'),
  ).toBeVisible();
});

test('direct event links show all operational fields and the official registration link', async ({
  page,
}) => {
  await page.goto('/#event/robo-race');
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole('heading', { name: 'Robo Race', exact: true }),
  ).toBeVisible();
  for (const text of [
    'Allotted room',
    'Organizing club:',
    'Team size',
    'Eligibility',
    'The people behind it',
  ])
    await expect(dialog.getByText(text, { exact: true })).toBeVisible();
  // Confirmed data from the proposal and the Unstop listing is on the page.
  await expect(
    dialog.getByText('Courtyard, 9th Block', { exact: true }),
  ).toBeVisible();
  await expect(
    dialog.getByRole('heading', { name: 'Technical specifications' }),
  ).toBeVisible();
  await expect(
    dialog.getByRole('link', { name: /Register for Robo Race/ }),
  ).toHaveAttribute('href', /^https:\/\/unstop\.com\//);
  await expect(
    dialog.getByRole('button', { name: 'Add to calendar' }),
  ).toBeVisible();
  await page.keyboard.press('Tab');
  expect(
    await page.evaluate(() =>
      document.querySelector('dialog[open]').contains(document.activeElement),
    ),
  ).toBeTruthy();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(page).not.toHaveURL(/#event\//);
});

test('leagues with unannounced slots stay honest about their times', async ({
  page,
}) => {
  await page.goto('/#event/valorant');
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByText('Match slots to be announced')).toBeVisible();
  await expect(
    dialog.getByRole('button', { name: 'Add to calendar' }),
  ).toHaveCount(0);
});

test('registration desk selects an event and focuses registration with safe pending state', async ({
  page,
}) => {
  await page.goto('/#register');
  const dialog = page.getByRole('dialog');
  await expect(
    dialog.getByRole('heading', { name: 'Make your move.' }),
  ).toBeVisible();
  await dialog.getByRole('button', { name: /CodeClash/ }).click();
  await expect(
    dialog.getByRole('heading', { name: 'Registration opens soon.' }),
  ).toBeFocused();
  await expect(
    dialog.getByRole('button', {
      name: 'Registration opening soon',
      exact: true,
    }),
  ).toBeVisible();
  await expect(dialog.getByRole('link', { name: /Register for/ })).toHaveCount(
    0,
  );
  await dialog.getByRole('button', { name: 'Close event details' }).click();
  await expect(dialog).not.toBeVisible();
});

test('official registration links and calendar downloads activate with confirmed data', async ({
  page,
}) => {
  const fixture = structuredClone(EVENT_DETAILS);
  const start = new Date(Date.now() + 7 * 86400000).toISOString();
  fixture.equinox = {
    ...fixture.equinox,
    startsAt: start,
    endsAt: new Date(Date.parse(start) + 7200000).toISOString(),
    room: 'Test Room',
    club: 'Test Club',
    registration: {
      status: 'open',
      url: 'https://example.org/official-registration',
      deadline: new Date(Date.parse(start) - 86400000).toISOString(),
    },
  };
  await page.route('**/src/lib/event-details.js*', (route) =>
    route.fulfill({
      contentType: 'application/javascript',
      body:
        'export const EVENT_DETAILS = ' +
        JSON.stringify(fixture) +
        '; export const FEST_DETAILS = ' +
        JSON.stringify(FEST_DETAILS) +
        ';',
    }),
  );
  await page.goto('/#event/equinox');
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByText('Test Room', { exact: true })).toBeVisible();
  await expect(dialog.getByText('Free entry', { exact: true })).toBeVisible();
  const register = dialog.getByRole('link', { name: /Register for Equinox/ });
  await expect(register).toHaveAttribute(
    'href',
    'https://example.org/official-registration',
  );
  await expect(register).toHaveAttribute('rel', 'noopener noreferrer');
  const download = page.waitForEvent('download');
  await dialog.getByRole('button', { name: 'Add to calendar' }).click();
  expect((await download).suggestedFilename()).toBe('cerebro-equinox.ics');
});

test('layout stays within the viewport and mobile navigation works', async ({
  page,
}, testInfo) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  for (const section of [
    '#top',
    '#about',
    '#tracks',
    '#events',
    '#schedule',
    '#partners',
  ]) {
    await page.locator(section).scrollIntoViewIfNeeded();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBeTruthy();
  }
  if (testInfo.project.name === 'mobile') {
    await page.getByRole('button', { name: 'Open navigation' }).click();
    const navigation = page.getByRole('navigation', {
      name: 'Mobile navigation',
    });
    await expect(navigation).toBeVisible();
    await navigation.getByRole('link', { name: /Schedule/ }).click();
    await expect(navigation).not.toBeVisible();
    expect(page.url()).toContain('#schedule');
  }
});

test('event stamps open briefings and the sticky registration shortcut works', async ({
  page,
}) => {
  await page.goto('/');
  await page
    .getByRole('button', { name: 'View Clue to Canvas', exact: true })
    .click();
  const dialog = page.getByRole('dialog');
  await expect(
    dialog.getByRole('heading', { name: 'Clue to Canvas', exact: true }),
  ).toBeVisible();
  await dialog
    .getByRole('button', { name: 'Registration', exact: true })
    .click();
  const heading = dialog.getByRole('heading', {
    name: 'Registration opens soon.',
  });
  await expect(heading).toBeFocused();
  await expect(heading).toBeInViewport();
  await dialog.getByRole('button', { name: 'Close event details' }).click();
  await page
    .locator('header')
    .getByRole('button', { name: 'Register', exact: true })
    .click();
  await expect(
    dialog.getByRole('heading', { name: 'Make your move.' }),
  ).toBeVisible();
});

test('command palette jumps to an event with the keyboard', async ({
  page,
}) => {
  await page.goto('/');
  await page.keyboard.press('Control+k');
  const palette = page.getByRole('dialog', { name: 'Command palette' });
  await expect(palette).toBeVisible();
  await palette.getByRole('combobox').fill('clash royale');
  await page.keyboard.press('Enter');
  await expect(
    page
      .getByRole('dialog')
      .getByRole('heading', { name: 'Clash Royale League', exact: true }),
  ).toBeVisible();
});
