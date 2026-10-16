// RichDNA™ admin — pure helpers for searching and exporting submissions.

const LANGS = ['Acts of Service', 'Words of Affirmation', 'Receiving Gifts', 'Quality Time', 'Physical Touch'];
const GIVING_LANGS = LANGS.map((n) => (n === 'Receiving Gifts' ? 'Sending Gifts' : n));

// Date/time parts in Philippine time, regardless of the viewer's timezone.
function manilaParts(date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Manila', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(date);
  return Object.fromEntries(parts.map((p) => [p.type, p.value]));
}

export function formatManila(iso) {
  const p = manilaParts(new Date(iso));
  return `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}`;
}

export function filterRows(rows, query) {
  const q = (query || '').trim().toLowerCase();
  if (!q) return rows;
  return rows.filter((r) =>
    `${r.first_name} ${r.last_name}`.toLowerCase().includes(q) || (r.email || '').toLowerCase().includes(q));
}

const pctOf = (scores, name) => {
  const hit = (scores || []).find((s) => s.name === name);
  return hit ? hit.pct : '';
};

export function toExportRows(rows) {
  return rows.map((r) => {
    const out = {
      'Date': formatManila(r.created_at),
      'First name': r.first_name,
      'Last name': r.last_name,
      'Email': r.email,
      'Birthdate': r.birthdate,
      'Gender': r.gender,
      'Western zodiac': r.western_sign,
      'Chinese zodiac': r.chinese_animal,
      'Life path': r.life_path_number,
      'Life path title': r.life_path_title,
      'Receives love through': r.receiving_top,
      'Gives love through': r.giving_top,
    };
    for (const n of LANGS) out[`Receiving – ${n} %`] = pctOf(r.receiving_scores, n);
    for (const n of GIVING_LANGS) out[`Giving – ${n} %`] = pctOf(r.giving_scores, n);
    return out;
  });
}

export function exportFilename(date) {
  const p = manilaParts(date);
  return `RichDNA-submissions-${p.year}-${p.month}-${p.day}.xlsx`;
}
