import test from 'node:test';
import assert from 'node:assert/strict';
import { filterRows, toExportRows, exportFilename } from '../engines/admin-data.js';

const LANG = ['Acts of Service', 'Words of Affirmation', 'Receiving Gifts', 'Quality Time', 'Physical Touch'];
const GIVE = LANG.map((n) => (n === 'Receiving Gifts' ? 'Sending Gifts' : n));
const pcts = (names, vals) => names.map((name, i) => ({ name, pct: vals[i] }));

const ana = {
  id: 'a', created_at: '2026-10-16T03:05:00+00:00',
  first_name: 'Ana', last_name: 'Cruz', email: 'ana@x.com', birthdate: '1990-05-15', gender: 'female',
  western_sign: 'Taurus', chinese_animal: 'Horse', life_path_number: 3, life_path_title: 'The Communicator',
  receiving_top: 'Quality Time', giving_top: 'Sending Gifts',
  // stored sorted by score, not in LANG order
  receiving_scores: pcts(['Quality Time', 'Acts of Service', 'Words of Affirmation', 'Receiving Gifts', 'Physical Touch'], [60, 10, 10, 10, 10]),
  giving_scores: pcts(['Sending Gifts', 'Acts of Service', 'Words of Affirmation', 'Quality Time', 'Physical Touch'], [52, 12, 12, 12, 12]),
};
const jo = { ...ana, id: 'j', first_name: `O'Brien, "Jo"`, last_name: 'Ünal 😀', email: 'jo@y.org' };

test('filterRows matches name or email case-insensitively', () => {
  assert.deepEqual(filterRows([ana, jo], 'ANA').map((r) => r.id), ['a']);
  assert.deepEqual(filterRows([ana, jo], 'y.org').map((r) => r.id), ['j']);
  assert.deepEqual(filterRows([ana, jo], 'ana cruz').map((r) => r.id), ['a']);
});

test('filterRows with empty or blank query returns all rows', () => {
  assert.equal(filterRows([ana, jo], '').length, 2);
  assert.equal(filterRows([ana, jo], '   ').length, 2);
});

test('toExportRows has the 22 columns in order', () => {
  const [r] = toExportRows([ana]);
  assert.deepEqual(Object.keys(r), [
    'Date', 'First name', 'Last name', 'Email', 'Birthdate', 'Gender',
    'Western zodiac', 'Chinese zodiac', 'Life path', 'Life path title',
    'Receives love through', 'Gives love through',
    ...LANG.map((n) => `Receiving – ${n} %`),
    ...GIVE.map((n) => `Giving – ${n} %`),
  ]);
});

test('toExportRows formats date in Manila time and maps scores by language', () => {
  const [r] = toExportRows([ana]);
  assert.equal(r.Date, '2026-10-16 11:05');
  assert.equal(r['Life path'], 3);
  assert.equal(r['Receiving – Quality Time %'], 60);
  assert.equal(r['Receiving – Acts of Service %'], 10);
  assert.equal(r['Giving – Sending Gifts %'], 52);
  assert.equal(r['Gives love through'], 'Sending Gifts');
});

test('toExportRows keeps punctuation, accents and emoji verbatim', () => {
  const [r] = toExportRows([jo]);
  assert.equal(r['First name'], `O'Brien, "Jo"`);
  assert.equal(r['Last name'], 'Ünal 😀');
});

test('exportFilename uses the Manila date', () => {
  assert.equal(exportFilename(new Date('2026-10-16T03:00:00Z')), 'RichDNA-submissions-2026-10-16.xlsx');
  assert.equal(exportFilename(new Date('2026-10-16T17:00:00Z')), 'RichDNA-submissions-2026-10-17.xlsx');
});

test('loginMessage hides whether an email is the admin account', async () => {
  const { loginMessage } = await import('../engines/admin-data.js');
  const ok = loginMessage('a@b.co', null);
  assert.deepEqual(loginMessage('a@b.co', { message: 'Signups not allowed for otp' }), ok);
  assert.equal(ok.ok, true);
  assert.match(ok.text, /a@b\.co/);
});

test('loginMessage reports real failures such as rate limits', async () => {
  const { loginMessage } = await import('../engines/admin-data.js');
  const r = loginMessage('a@b.co', { message: 'email rate limit exceeded' });
  assert.equal(r.ok, false);
  assert.match(r.text, /rate limit/);
});
