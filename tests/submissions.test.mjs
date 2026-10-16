import test from 'node:test';
import assert from 'node:assert/strict';
import { computeIdentity } from '../engines/identity.js';
import * as LL from '../engines/love-language.js';
import { buildSubmission, saveSubmission, newSubmissionId } from '../engines/submissions.js';

// Receiving: Quality Time items strongly agreed, everything else 0.
// Giving: gift items strongly agreed, everything else 0.
const itemsR = LL.subset(LL.RECEIVING, 20);
const itemsG = LL.subset(LL.GIVING, 20);
const answersR = Object.fromEntries(itemsR.map((q) => [q.id, q.lang === 3 ? 4 : 0]));
const answersG = Object.fromEntries(itemsG.map((q) => [q.id, q.lang === 2 ? 4 : 0]));
const love = { receiving: LL.score(itemsR, answersR), giving: LL.score(itemsG, answersG) };
const user = { firstName: '  Ana ', lastName: ' Cruz ', email: ' ana@example.com ', birthdate: '1990-05-15', gender: '' };
const id = '11111111-1111-4111-8111-111111111111';

function row() {
  return buildSubmission({ id, user, identity: computeIdentity(user.birthdate), love, answersR, answersG });
}

test('buildSubmission maps identity results to columns', () => {
  const r = row();
  assert.equal(r.id, id);
  assert.equal(r.western_sign, 'Taurus');
  assert.equal(r.chinese_animal, 'Horse');
  assert.equal(r.life_path_number, 3);
  assert.equal(r.life_path_title, 'The Communicator');
  assert.equal(r.birthdate, '1990-05-15');
  assert.equal(r.gender, '');
});

test('buildSubmission trims name and email', () => {
  const r = row();
  assert.equal(r.first_name, 'Ana');
  assert.equal(r.last_name, 'Cruz');
  assert.equal(r.email, 'ana@example.com');
});

test('buildSubmission stores top love languages, giving gifts shown as Sending Gifts', () => {
  const r = row();
  assert.equal(r.receiving_top, 'Quality Time');
  assert.equal(r.giving_top, 'Sending Gifts');
  assert.equal(r.giving_scores.some((s) => s.name === 'Receiving Gifts'), false);
  assert.equal(r.giving_scores.some((s) => s.name === 'Sending Gifts'), true);
});

test('buildSubmission stores all five scores summing to 100', () => {
  const r = row();
  for (const scores of [r.receiving_scores, r.giving_scores]) {
    assert.equal(scores.length, 5);
    assert.equal(scores.reduce((a, s) => a + s.pct, 0), 100);
    assert.deepEqual(Object.keys(scores[0]).sort(), ['name', 'pct']);
  }
});

test('buildSubmission keeps raw answers', () => {
  assert.deepEqual(row().answers, { answersR, answersG });
});

test('saveSubmission resolves false and never throws when the client fails', async () => {
  const failing = { from() { throw new Error('network down'); } };
  const warn = console.warn; console.warn = () => {};
  try {
    assert.equal(await saveSubmission(row(), failing), false);
  } finally { console.warn = warn; }
});

test('saveSubmission resolves false when Supabase returns an error', async () => {
  const erroring = { from: () => ({ insert: async () => ({ error: { message: 'denied' } }) }) };
  const warn = console.warn; console.warn = () => {};
  try {
    assert.equal(await saveSubmission(row(), erroring), false);
  } finally { console.warn = warn; }
});

test('saveSubmission inserts the row into richdna_submissions and resolves true', async () => {
  const calls = [];
  const ok = { from: (t) => ({ insert: async (r) => { calls.push([t, r]); return { error: null }; } }) };
  assert.equal(await saveSubmission(row(), ok), true);
  assert.deepEqual(calls, [['richdna_submissions', row()]]);
});

test('newSubmissionId returns a v4 uuid', () => {
  assert.match(newSubmissionId(), /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
});
