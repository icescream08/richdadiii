// RichDNA™ submissions — saves each completed assessment to Supabase so the
// owner can see it on /admin. Kept separate from RichDNA.dc.html so a
// re-export of that page only loses a small hook.

import { SUPABASE_URL, SUPABASE_KEY, loadCreateClient } from './supabase-config.js';

// Same display rule as the RichDNA dashboard: in the giving context
// "Receiving Gifts" reads wrong, so it is shown as "Sending Gifts".
const givingLabel = (name) => (name === 'Receiving Gifts' ? 'Sending Gifts' : name);

const scoresOf = (res, label) => res.results.map((r) => ({ name: label(r.name), pct: r.pct }));

export function newSubmissionId() {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  // Older Safari (< 15.4) has getRandomValues but not randomUUID.
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = [...b].map((x) => x.toString(16).padStart(2, '0')).join('');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

export function buildSubmission({ id, user, identity, love, answersR, answersG }) {
  return {
    id,
    first_name: user.firstName.trim(),
    last_name: user.lastName.trim(),
    email: user.email.trim(),
    birthdate: user.birthdate,
    gender: user.gender || '',
    western_sign: identity.western.sign,
    chinese_animal: identity.chinese.animal,
    life_path_number: identity.lifePath.number,
    life_path_title: identity.lifePath.title,
    receiving_top: love.receiving.top.name,
    giving_top: givingLabel(love.giving.top.name),
    receiving_scores: scoresOf(love.receiving, (n) => n),
    giving_scores: scoresOf(love.giving, givingLabel),
    answers: { answersR, answersG },
  };
}

let visitorClient = null;
// Always anonymous: never picks up the owner's admin session, which has no
// insert permission.
async function getVisitorClient() {
  if (!visitorClient) {
    const createClient = await loadCreateClient();
    visitorClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
  }
  return visitorClient;
}

// Starts saving one completed assessment and returns its new row id, or
// undefined if it couldn't even start. Never throws — the visitor must
// always reach their results.
export function saveCompletion({ user, identity, love, answersR, answersG }, client) {
  try {
    const id = newSubmissionId();
    saveSubmission(buildSubmission({ id, user, identity, love, answersR, answersG }), client);
    return id;
  } catch (e) {
    console.warn('RichDNA: could not prepare submission', e && e.message ? e.message : e);
    return undefined;
  }
}

// Never throws; resolves true when the row was stored.
export async function saveSubmission(row, client) {
  try {
    const db = client || (await getVisitorClient());
    const { error } = await db.from('richdna_submissions').insert(row);
    if (error) throw error;
    return true;
  } catch (e) {
    console.warn('RichDNA: could not save submission', e && e.message ? e.message : e);
    return false;
  }
}
