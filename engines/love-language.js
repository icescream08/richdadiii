// RichDNA™ Love Language Engine — two independent assessments (Receiving / Giving)
// Situational agreement items; scores are calculated, never asked directly.

export const LANGS = ['Acts of Service', 'Words of Affirmation', 'Receiving Gifts', 'Quality Time', 'Physical Touch'];

export const SCALE = [
  { label: 'Strongly disagree', points: 0 },
  { label: 'Disagree', points: 1 },
  { label: 'Neutral', points: 2 },
  { label: 'Agree', points: 3 },
  { label: 'Strongly agree', points: 4 },
];

// lang index: 0 AS · 1 WA · 2 RG · 3 QT · 4 PT
export const RECEIVING = [
  { id: 'r01', lang: 0, text: 'When someone does a chore I\u2019ve been putting off — like washing the dishes or fixing something — I feel really cared for.' },
  { id: 'r02', lang: 1, text: 'A kind, specific compliment (like \u201cI love how patient you are\u201d) can make my whole week.' },
  { id: 'r03', lang: 2, text: 'A small surprise gift — even just my favorite snack — shows me someone was thinking about me.' },
  { id: 'r04', lang: 3, text: 'I feel like I really matter when someone puts their phone away and gives me their full attention.' },
  { id: 'r05', lang: 4, text: 'A hug or a hand on my shoulder calms me down faster than any words.' },
  { id: 'r06', lang: 0, text: 'It means more when someone helps me with something hard (like moving or a big project) than when they just say nice things.' },
  { id: 'r07', lang: 1, text: 'When someone tells me exactly why they appreciate me, I feel truly seen.' },
  { id: 'r08', lang: 2, text: 'I keep little things people give me — notes, tickets, small gifts — because they remind me I\u2019m loved.' },
  { id: 'r09', lang: 3, text: 'I\u2019d rather have one long, unrushed talk with someone than get a present from them.' },
  { id: 'r10', lang: 4, text: 'Hugs and sitting close are how I feel most connected to the people I love.' },
  { id: 'r11', lang: 0, text: 'I feel most supported when people actually show up and help — not just offer to.' },
  { id: 'r12', lang: 1, text: 'Hearing \u201cYou\u2019ve got this — I believe in you\u201d before something big helps me more than practical help.' },
  { id: 'r13', lang: 2, text: 'When someone brings me something \u201cjust because\u201d — like a coffee or a snack — I feel extra special.' },
  { id: 'r14', lang: 3, text: 'When I haven\u2019t had real one-on-one time with someone I love, I start to feel distant from them.' },
  { id: 'r15', lang: 4, text: 'After a rough day, what I want most is to sit close to someone I trust.' },
  { id: 'r16', lang: 0, text: 'A friend coming over to help me move would mean more to me than a heartfelt card.' },
  { id: 'r17', lang: 1, text: 'I replay kind words people said to me — sometimes days or weeks later.' },
  { id: 'r18', lang: 2, text: 'It\u2019s not about the price — the thought behind a gift is what makes me feel loved.' },
  { id: 'r19', lang: 3, text: 'Being invited along on someone\u2019s ordinary day — even grocery shopping — makes me feel close to them.' },
  { id: 'r20', lang: 4, text: 'A warm hello — a hug or a pat on the back — tells me the relationship is safe and good.' },
];

export const GIVING = [
  { id: 'g01', lang: 0, text: 'When someone I love is stressed, I jump in and take something off their plate — like running an errand for them.' },
  { id: 'g02', lang: 1, text: 'I often tell people exactly what I admire about them (\u201cYou\u2019re so good at staying calm\u201d).' },
  { id: 'g03', lang: 2, text: 'I often see small things at a store and think, \u201cThis would be perfect for\u2026\u201d someone I love.' },
  { id: 'g04', lang: 3, text: 'I show love by clearing my schedule to spend real time with someone.' },
  { id: 'g05', lang: 4, text: 'When someone shares good news, I naturally hug them or give a high-five.' },
  { id: 'g06', lang: 0, text: 'I show I care by handling things — errands, fixing stuff, planning — without being asked.' },
  { id: 'g07', lang: 1, text: 'Writing an encouraging text or note to someone comes naturally to me.' },
  { id: 'g08', lang: 2, text: 'I put real thought into gifts, sometimes planning them weeks or months ahead.' },
  { id: 'g09', lang: 3, text: 'Setting up one-on-one time with people I care about is a big priority for me.' },
  { id: 'g10', lang: 4, text: 'When comforting someone, my first instinct is a hug — not advice.' },
  { id: 'g11', lang: 0, text: 'I say \u201cLet me do that for you\u201d more often than \u201cI love you.\u201d' },
  { id: 'g12', lang: 1, text: 'When a friend doubts themselves, my first move is to encourage them out loud.' },
  { id: 'g13', lang: 2, text: 'I love bringing things back for people — from trips, or even just from the store.' },
  { id: 'g14', lang: 3, text: 'I show I care by asking deeper questions and really listening to the answers.' },
  { id: 'g15', lang: 4, text: 'I sit close to the people I love — being across the room feels too far.' },
  { id: 'g16', lang: 0, text: 'I\u2019d rather spend an afternoon helping someone than an hour talking about feelings.' },
  { id: 'g17', lang: 1, text: 'I make a point of celebrating people\u2019s wins out loud (\u201cThat\u2019s amazing — tell me everything!\u201d).' },
  { id: 'g18', lang: 2, text: 'I say \u201cthank you\u201d or \u201cI\u2019m sorry\u201d best with a small, carefully chosen gift.' },
  { id: 'g19', lang: 3, text: 'My favorite way to celebrate someone is long, unhurried time together.' },
  { id: 'g20', lang: 4, text: 'A pat on the back or a warm handshake is my natural way to encourage people.' },
];

// Balanced subset: k items per language, preserving order. n must be a multiple of 5.
export function subset(items, n) {
  const k = Math.max(1, Math.floor(n / 5));
  const taken = [0, 0, 0, 0, 0];
  return items.filter((it) => taken[it.lang] < k && ++taken[it.lang]);
}

// answers: { [id]: points 0..4 } → sorted results with share percentages
export function score(items, answers) {
  const totals = [0, 0, 0, 0, 0];
  const max = [0, 0, 0, 0, 0];
  for (const it of items) {
    const a = answers[it.id];
    if (a == null) continue;
    totals[it.lang] += a;
    max[it.lang] += 4;
  }
  const sum = totals.reduce((a, b) => a + b, 0);
  const results = LANGS.map((name, i) => ({
    name,
    raw: totals[i],
    pct: sum > 0 ? Math.round((totals[i] / sum) * 100) : 20,
  })).sort((a, b) => b.raw - a.raw);
  // Normalize rounding so shares total 100
  const drift = 100 - results.reduce((a, r) => a + r.pct, 0);
  results[0].pct += drift;
  return { results, top: results[0] };
}

export const LANG_META = {
  'Acts of Service': {
    receiving: {
      summary: 'You tend to feel most loved when care shows up as action — help given, burdens lifted, follow-through kept.',
      strengths: ['Notices and values real effort', 'Loyal to people who show up', 'Grounded, practical view of love'],
      growth: ['Tell people what help means to you', 'Receive words and rest, not just work'],
    },
    giving: {
      summary: 'You tend to express love through action — solving, serving, and showing up before you\u2019re asked.',
      strengths: ['Dependable in crisis', 'Love that people can stand on', 'Sees needs before they\u2019re spoken'],
      growth: ['Say the words, not just do the work', 'Serve without keeping score'],
    },
  },
  'Words of Affirmation': {
    receiving: {
      summary: 'You tend to feel most loved when someone puts their appreciation into sincere, specific words.',
      strengths: ['Deeply motivated by encouragement', 'Remembers and treasures kindness', 'Sensitive to tone and meaning'],
      growth: ['Anchor identity deeper than feedback', 'Hear love in actions that lack words'],
    },
    giving: {
      summary: 'You tend to express love by speaking life — encouragement, gratitude, and truth said out loud.',
      strengths: ['Builds people\u2019s confidence', 'Celebrates others generously', 'Turns feelings into language'],
      growth: ['Back words with consistent action', 'Learn quieter ways to love the quiet'],
    },
  },
  'Receiving Gifts': {
    receiving: {
      summary: 'You tend to feel most loved through thoughtful tokens — proof that someone was thinking of you when you weren\u2019t there.',
      strengths: ['Sees the meaning behind things', 'Treasures memories in physical form', 'Notices thoughtfulness others miss'],
      growth: ['Voice the meaning, so it isn\u2019t misread as materialism', 'Receive love that comes empty-handed'],
    },
    giving: {
      summary: 'You tend to express love through carefully chosen gifts — physical symbols of attention and thought.',
      strengths: ['Exceptionally thoughtful', 'Makes moments memorable', 'Remembers what people mention wanting'],
      growth: ['Let presence count as a present', 'Give within your means, without guilt'],
    },
  },
  'Quality Time': {
    receiving: {
      summary: 'You tend to feel most loved when someone gives you their full, undivided presence.',
      strengths: ['Builds deep, real relationships', 'Fully present with people', 'Values people over things'],
      growth: ['Communicate the need before resentment builds', 'Value small moments, not only long ones'],
    },
    giving: {
      summary: 'You tend to express love with your presence — protected time, deep questions, full attention.',
      strengths: ['Makes people feel truly seen', 'Listens beneath the surface', 'Invests time where it matters'],
      growth: ['Respect that others feel love differently', 'Guard time without guarding affection'],
    },
  },
  'Physical Touch': {
    receiving: {
      summary: 'You tend to feel most loved through warm, appropriate physical connection — closeness that words can\u2019t replace.',
      strengths: ['Reads warmth and safety quickly', 'Comforts and is comforted easily', 'Naturally affectionate presence'],
      growth: ['Express the need clearly and respectfully', 'Build connection across distance too'],
    },
    giving: {
      summary: 'You tend to express love through warm, appropriate touch — a hug, a hand on the shoulder, closeness.',
      strengths: ['Instinctively comforting', 'Communicates safety without words', 'Warms up a room'],
      growth: ['Honor different comfort levels', 'Pair touch with words and time'],
    },
  },
};
