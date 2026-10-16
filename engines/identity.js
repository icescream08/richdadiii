// RichDNA™ Identity Engine — Western Zodiac, Chinese Zodiac, Life Path
// Framework data is presented as self-reflection material, never as fact or destiny.

export const WESTERN = [
  { sign: 'Capricorn', symbol: '♑', range: 'Dec 22 – Jan 19', start: [12, 22], end: [1, 19],
    positives: ['Disciplined', 'Ambitious', 'Patient', 'Responsible'],
    growth: ['Allowing rest without guilt', 'Expressing emotion openly', 'Flexibility when plans change'] },
  { sign: 'Aquarius', symbol: '♒', range: 'Jan 20 – Feb 18', start: [1, 20], end: [2, 18],
    positives: ['Original', 'Independent', 'Humanitarian', 'Forward-thinking'],
    growth: ['Staying grounded in the present', 'Letting people in emotionally', 'Following through on details'] },
  { sign: 'Pisces', symbol: '♓', range: 'Feb 19 – Mar 20', start: [2, 19], end: [3, 20],
    positives: ['Compassionate', 'Intuitive', 'Creative', 'Adaptable'],
    growth: ['Setting firm boundaries', 'Turning vision into structure', 'Guarding energy from over-empathy'] },
  { sign: 'Aries', symbol: '♈', range: 'Mar 21 – Apr 19', start: [3, 21], end: [4, 19],
    positives: ['Courageous', 'Decisive', 'Energetic', 'Pioneering'],
    growth: ['Patience with slower processes', 'Listening before acting', 'Finishing what is started'] },
  { sign: 'Taurus', symbol: '♉', range: 'Apr 20 – May 20', start: [4, 20], end: [5, 20],
    positives: ['Steadfast', 'Practical', 'Loyal', 'Grounded'],
    growth: ['Embracing change willingly', 'Releasing stubbornness', 'Taking calculated risks'] },
  { sign: 'Gemini', symbol: '♊', range: 'May 21 – Jun 20', start: [5, 21], end: [6, 20],
    positives: ['Curious', 'Articulate', 'Versatile', 'Quick-minded'],
    growth: ['Depth over breadth', 'Consistency in commitments', 'Stillness and focus'] },
  { sign: 'Cancer', symbol: '♋', range: 'Jun 21 – Jul 22', start: [6, 21], end: [7, 22],
    positives: ['Nurturing', 'Loyal', 'Intuitive', 'Protective'],
    growth: ['Direct communication of needs', 'Not taking things personally', 'Stepping outside comfort zones'] },
  { sign: 'Leo', symbol: '♌', range: 'Jul 23 – Aug 22', start: [7, 23], end: [8, 22],
    positives: ['Confident', 'Generous', 'Warm', 'Natural leader'],
    growth: ['Sharing the spotlight', 'Receiving feedback with grace', 'Leading through service'] },
  { sign: 'Virgo', symbol: '♍', range: 'Aug 23 – Sep 22', start: [8, 23], end: [9, 22],
    positives: ['Analytical', 'Diligent', 'Service-hearted', 'Detail-oriented'],
    growth: ['Progress over perfection', 'Self-compassion', 'Delegating with trust'] },
  { sign: 'Libra', symbol: '♎', range: 'Sep 23 – Oct 22', start: [9, 23], end: [10, 22],
    positives: ['Diplomatic', 'Fair-minded', 'Gracious', 'Relational'],
    growth: ['Deciding without over-deliberating', 'Healthy conflict', 'Pleasing purpose over people'] },
  { sign: 'Scorpio', symbol: '♏', range: 'Oct 23 – Nov 21', start: [10, 23], end: [11, 21],
    positives: ['Focused', 'Resilient', 'Perceptive', 'Deeply loyal'],
    growth: ['Trusting before testing', 'Releasing control', 'Forgiving quickly'] },
  { sign: 'Sagittarius', symbol: '♐', range: 'Nov 22 – Dec 21', start: [11, 22], end: [12, 21],
    positives: ['Optimistic', 'Adventurous', 'Honest', 'Big-picture thinker'],
    growth: ['Commitment through the mundane', 'Tact in truth-telling', 'Roots as well as wings'] },
];

export function westernZodiac(date) {
  const m = date.getMonth() + 1, d = date.getDate();
  for (const z of WESTERN) {
    const [sm, sd] = z.start, [em, ed] = z.end;
    if (sm > em) { // wraps year (Capricorn)
      if ((m === sm && d >= sd) || (m === em && d <= ed)) return z;
    } else if ((m === sm && d >= sd) || (m === em && d <= ed) || (m > sm && m < em)) {
      return z;
    }
  }
  return WESTERN[0];
}

export const CHINESE = [
  { animal: 'Rat', hanzi: '鼠', strengths: ['Resourceful', 'Quick-witted', 'Adaptable', 'Observant'],
    opportunities: ['Trusting others with responsibility', 'Long-range patience'] },
  { animal: 'Ox', hanzi: '牛', strengths: ['Dependable', 'Strong-willed', 'Methodical', 'Honest'],
    opportunities: ['Welcoming new methods', 'Expressing feelings openly'] },
  { animal: 'Tiger', hanzi: '虎', strengths: ['Brave', 'Confident', 'Charismatic', 'Driven'],
    opportunities: ['Pausing before leaping', 'Sharing leadership'] },
  { animal: 'Rabbit', hanzi: '兔', strengths: ['Gracious', 'Considerate', 'Artistic', 'Diplomatic'],
    opportunities: ['Facing conflict directly', 'Backing bold decisions'] },
  { animal: 'Dragon', hanzi: '龍', strengths: ['Visionary', 'Energetic', 'Confident', 'Inspiring'],
    opportunities: ['Listening as much as leading', 'Grace under criticism'] },
  { animal: 'Snake', hanzi: '蛇', strengths: ['Wise', 'Discerning', 'Composed', 'Strategic'],
    opportunities: ['Opening up to trusted people', 'Acting before certainty is total'] },
  { animal: 'Horse', hanzi: '馬', strengths: ['Energetic', 'Independent', 'Warm', 'Adventurous'],
    opportunities: ['Staying power in long seasons', 'Slowing down to plan'] },
  { animal: 'Goat', hanzi: '羊', strengths: ['Gentle', 'Creative', 'Empathetic', 'Peace-making'],
    opportunities: ['Asserting personal needs', 'Decisiveness under pressure'] },
  { animal: 'Monkey', hanzi: '猴', strengths: ['Inventive', 'Clever', 'Sociable', 'Problem-solver'],
    opportunities: ['Depth of follow-through', 'Consistency over novelty'] },
  { animal: 'Rooster', hanzi: '雞', strengths: ['Precise', 'Hardworking', 'Courageous', 'Candid'],
    opportunities: ['Softening delivery of truth', 'Flexibility with imperfection'] },
  { animal: 'Dog', hanzi: '狗', strengths: ['Loyal', 'Principled', 'Protective', 'Sincere'],
    opportunities: ['Optimism about people', 'Releasing worry'] },
  { animal: 'Pig', hanzi: '豬', strengths: ['Generous', 'Diligent', 'Good-natured', 'Trustworthy'],
    opportunities: ['Discernment with generosity', 'Guarding personal margin'] },
];

// Approximation: years beginning before ~Feb 4 belong to the previous animal year.
export function chineseZodiac(date) {
  let y = date.getFullYear();
  const m = date.getMonth() + 1, d = date.getDate();
  if (m < 2 || (m === 2 && d < 4)) y -= 1;
  return CHINESE[((y - 4) % 12 + 12) % 12];
}

export const LIFE_PATHS = {
  1: { title: 'The Pioneer', description: 'Naturally drawn to initiative and independence. You tend to be at your best when you are building something new and owning the outcome.',
    traits: ['Independent', 'Driven', 'Original', 'Self-reliant'], leadership: 'Leads from the front — sets direction, moves first, and gives others something to rally behind.' },
  2: { title: 'The Diplomat', description: 'Naturally drawn to harmony, partnership, and the quiet details that hold teams together. Your influence often works through relationships rather than volume.',
    traits: ['Cooperative', 'Sensitive', 'Supportive', 'Peacemaking'], leadership: 'Leads through partnership — builds consensus, reads the room, and strengthens the bonds between people.' },
  3: { title: 'The Communicator', description: 'Naturally drawn to expression, creativity, and connection. Ideas tend to come alive when you speak, write, or create.',
    traits: ['Expressive', 'Optimistic', 'Creative', 'Sociable'], leadership: 'Leads through inspiration — casts vision in words and energy that make people want to participate.' },
  4: { title: 'The Builder', description: 'Naturally drawn to order, systems, and honest work. You tend to trust process over hype and create things designed to last.',
    traits: ['Disciplined', 'Practical', 'Reliable', 'Methodical'], leadership: 'Leads through structure — builds the systems, standards, and routines that make excellence repeatable.' },
  5: { title: 'The Explorer', description: 'Naturally drawn to freedom, variety, and change. You tend to learn by doing and adapt faster than most.',
    traits: ['Adventurous', 'Versatile', 'Curious', 'Energetic'], leadership: 'Leads through momentum — thrives in change, opens new territory, and keeps teams from stagnating.' },
  6: { title: 'The Guardian', description: 'Naturally drawn to responsibility, care, and community. People tend to trust you with what matters most to them.',
    traits: ['Nurturing', 'Responsible', 'Loyal', 'Service-hearted'], leadership: 'Leads through stewardship — protects the people and values in their care and models sacrificial service.' },
  7: { title: 'The Seeker', description: 'Naturally drawn to depth, analysis, and truth. You tend to need solitude to do your best thinking — and it shows in the quality of your conclusions.',
    traits: ['Analytical', 'Introspective', 'Wise', 'Perceptive'], leadership: 'Leads through insight — asks the question no one else asked and brings depth to shallow conversations.' },
  8: { title: 'The Executive', description: 'Naturally drawn to achievement, stewardship, and scale. You tend to think in terms of results, resources, and legacy.',
    traits: ['Ambitious', 'Authoritative', 'Strategic', 'Resilient'], leadership: 'Leads through command of results — sets high standards, manages resources wisely, and builds enterprises.' },
  9: { title: 'The Humanitarian', description: 'Naturally drawn to compassion, completion, and causes larger than yourself. Your work tends to feel most meaningful when it serves many.',
    traits: ['Compassionate', 'Idealistic', 'Generous', 'Wise'], leadership: 'Leads through purpose — connects daily work to a larger mission and lifts the people others overlook.' },
  11: { title: 'The Illuminator', description: 'A master-number pattern blending intuition with inspiration. You tend to sense what others miss and carry ideas that feel ahead of their time.',
    traits: ['Intuitive', 'Inspiring', 'Idealistic', 'Perceptive'], leadership: 'Leads through vision — illuminates possibilities others cannot yet see and calls people to higher ground.' },
  22: { title: 'The Master Builder', description: 'A master-number pattern blending big vision with practical discipline. You tend to be wired to turn dreams into durable institutions.',
    traits: ['Visionary', 'Disciplined', 'Pragmatic', 'Large-scale thinker'], leadership: 'Leads through architecture — designs systems and organizations big enough to outlive their founder.' },
  33: { title: 'The Master Teacher', description: 'A master-number pattern blending compassion with responsibility. You tend to grow most by helping others grow.',
    traits: ['Devoted', 'Compassionate', 'Uplifting', 'Responsible'], leadership: 'Leads through mentorship — develops people patiently and measures success by who they become.' },
};

function reduceNum(n) {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n).split('').reduce((a, c) => a + Number(c), 0);
  }
  return n;
}

export function lifePath(date) {
  const m = reduceNum(date.getMonth() + 1);
  const d = reduceNum(date.getDate());
  const y = reduceNum(String(date.getFullYear()).split('').reduce((a, c) => a + Number(c), 0));
  const n = reduceNum(m + d + y);
  return { number: n, ...LIFE_PATHS[n] };
}

export function computeIdentity(birthdateStr) {
  const [y, m, d] = birthdateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return {
    western: westernZodiac(date),
    chinese: chineseZodiac(date),
    lifePath: lifePath(date),
  };
}
