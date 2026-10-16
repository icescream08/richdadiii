// RichDNA™ Recommendation Engine — personalized next steps based on love languages,
// life path pattern, and assessment responses (never birthdate alone).

const PATH_GROUP = {
  1: 'driver', 8: 'driver', 22: 'driver',
  3: 'creative', 5: 'creative',
  2: 'relational', 6: 'relational', 33: 'relational',
  4: 'builder', 7: 'builder',
  9: 'visionary', 11: 'visionary',
};

const BOOK_WHY = {
  driver: 'You\u2019re wired to drive results — this book helps you make sure the vehicle you\u2019re driving (your skills, systems, and income engine) is worthy of your ambition.',
  creative: 'Your energy and ideas need a vehicle that can keep up. This book walks through evaluating and upgrading the vehicle carrying you toward your goals.',
  relational: 'You invest deeply in people — this book helps you build a vehicle strong enough to provide for and protect the people you love.',
  builder: 'You already think in systems. This book gives you a framework for auditing the biggest system of all: the vehicle carrying your life\u2019s work.',
  visionary: 'Your vision deserves infrastructure. This book helps you choose and upgrade a vehicle capable of carrying a mission bigger than yourself.',
};

const BOOTCAMP_WHY = {
  driver: 'High standards and high output are your default — the Bootcamp channels that drive into disciplined systems so results compound instead of burning you out.',
  creative: 'Discipline is the multiplier your creativity is waiting for. The Bootcamp installs the routines that turn inspiration into consistent output.',
  relational: 'You give generously to others — the Bootcamp builds the personal systems that let you serve from overflow instead of exhaustion.',
  builder: 'You respect process — the Bootcamp is process: structured, measurable, and built for people who take mastery seriously.',
  visionary: 'Vision without systems stays a dream. The Bootcamp turns your long-range picture into weekly disciplines you can execute.',
};

const ARTICLE_BY_RECEIVING = {
  'Acts of Service': { title: 'Systems of Service: Building Habits That Care for People', why: 'Because you feel love through action, learning to systematize acts of care will deepen every relationship you steward.' },
  'Words of Affirmation': { title: 'The Discipline of Encouragement: Words That Build Legacy', why: 'Because words carry weight for you, mastering intentional communication multiplies your influence at home and at work.' },
  'Receiving Gifts': { title: 'Meaning Over Materialism: The Stewardship of Symbols', why: 'Because thoughtful tokens speak to you, this piece explores giving and receiving with meaning — without drifting into consumption.' },
  'Quality Time': { title: 'Deep Time: Protecting Presence in a Distracted Age', why: 'Because presence is your currency of love, learning to defend undistracted time will strengthen your closest bonds.' },
  'Physical Touch': { title: 'The Connected Life: Building Warmth Into Your Week', why: 'Because connection grounds you, this piece covers building genuine closeness into a disciplined, busy life.' },
};

const VIDEO_BY_GROUP = {
  driver: { title: 'Discipline Over Motivation — The Executive Operating System', why: 'A deep dive on leading yourself first: standards, scoreboards, and the daily disciplines of high performers.' },
  creative: { title: 'Turning Talent Into Systems — Consistency for Creatives', why: 'How expressive, versatile people build the structure that turns bursts of brilliance into a durable body of work.' },
  relational: { title: 'Leading Through Service — Strength for People-Builders', why: 'How nurturers and diplomats set boundaries, avoid burnout, and lead the people they love with strength.' },
  builder: { title: 'The Architecture of Habits — Building Things That Last', why: 'For methodical minds: designing routines, environments, and systems engineered to outlast motivation.' },
  visionary: { title: 'From Vision to Legacy — Executing a Mission Bigger Than You', why: 'How purpose-driven people break decade-sized visions into seasons, systems, and next steps.' },
};

export function recommend({ lifePathNumber, receivingTop, givingTop }) {
  const group = PATH_GROUP[lifePathNumber] || 'builder';
  return [
    {
      icon: '\uD83D\uDCD8', category: 'Book', title: 'Upgrade Your Vehicle',
      why: BOOK_WHY[group],
      cta: 'Get the book', url: 'https://richdadiii.com',
    },
    {
      icon: '\uD83C\uDF93', category: 'Program', title: 'Richdadiii Bootcamp',
      why: BOOTCAMP_WHY[group] + ' Your giving language — ' + givingTop + ' — is an asset the cohort format is built to sharpen.',
      cta: 'Join the Bootcamp', url: 'https://richdadiii.com',
    },
    {
      icon: '\uD83D\uDCDA', category: 'Article', title: ARTICLE_BY_RECEIVING[receivingTop].title,
      why: ARTICLE_BY_RECEIVING[receivingTop].why,
      cta: 'Read the article', url: 'https://richdadiii.com',
    },
    {
      icon: '\uD83C\uDFA5', category: 'Video', title: VIDEO_BY_GROUP[group].title,
      why: VIDEO_BY_GROUP[group].why,
      cta: 'Watch now', url: 'https://richdadiii.com',
    },
  ];
}
