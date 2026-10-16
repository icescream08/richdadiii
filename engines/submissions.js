// RichDNA™ submissions — saves each completed assessment to Supabase so the
// owner can see it on /admin. Kept separate from RichDNA.dc.html so a
// re-export of that page only loses a small hook.

import { SUPABASE_URL, SUPABASE_KEY, loadCreateClient } from './supabase-config.js';

// Same display rule as the RichDNA dashboard: in the giving context
// "Receiving Gifts" reads wrong, so it is shown as "Sending Gifts".
const givingLabel = (name) => (name === 'Receiving Gifts' ? 'Sending Gifts' : name);

const scoresOf = (res, label) => res.results.map((r) => ({ name: label(r.name), pct: r.pct }));

export function newSubmissionId() {
  return crypto.randomUUID();
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
