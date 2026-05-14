/**
 * Calculate moon phase and related lunar information
 * Using Meeus's lunation algorithm
 */

export function getMoonPhase(date = new Date()) {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  const day = date.getDate();

  let c = 0;
  let e = 0;
  let jd = 0;
  let b = 0;

  if (month < 3) {
    year--;
    month += 12;
  }

  ++month;
  c = 365.25 * year;
  e = 30.6 * month;
  jd = c + e + day - 694039.09; // Julian date
  jd /= 29.5305882; // Divide by the Moon cycle
  b = parseInt(jd);
  jd -= b; // Decimal part
  b = Math.round(jd * 8); // Scale fraction from 0-8

  if (b >= 8) {
    b = 0;
  }

  // Moon phase names and illumination
  const phases = [
    {
      name: "New Moon",
      illumination: 0,
      emoji: "🌑",
      description: "A time for new beginnings and setting intentions",
    },
    {
      name: "Waxing Crescent",
      illumination: 0.125,
      emoji: "🌒",
      description: "Intentions take root, growth begins",
    },
    {
      name: "First Quarter",
      illumination: 0.25,
      emoji: "🌓",
      description: "Take action, overcome challenges",
    },
    {
      name: "Waxing Gibbous",
      illumination: 0.375,
      emoji: "🌔",
      description: "Refine and adjust your path",
    },
    {
      name: "Full Moon",
      illumination: 0.5,
      emoji: "🌕",
      description: "Culmination, release, and gratitude",
    },
    {
      name: "Waning Gibbous",
      illumination: 0.375,
      emoji: "🌖",
      description: "Reflect and share wisdom",
    },
    {
      name: "Last Quarter",
      illumination: 0.25,
      emoji: "🌗",
      description: "Let go, forgive, release",
    },
    {
      name: "Waning Crescent",
      illumination: 0.125,
      emoji: "🌘",
      description: "Rest, surrender, prepare for renewal",
    },
  ];

  return phases[b];
}

export function getNextMoonPhases(fromDate = new Date(), count = 4) {
  const phases = [];
  const avgLunarCycle = 29.5305882;

  // Calculate approximate dates for next key phases
  const keyPhaseNames = [
    "New Moon",
    "First Quarter",
    "Full Moon",
    "Last Quarter",
  ];

  for (let i = 0; i < count; i++) {
    const daysAhead = (i + 1) * (avgLunarCycle / 4);
    const futureDate = new Date(
      fromDate.getTime() + daysAhead * 24 * 60 * 60 * 1000,
    );
    const phase = getMoonPhase(futureDate);

    if (keyPhaseNames.includes(phase.name)) {
      phases.push({
        ...phase,
        date: futureDate.toISOString(),
      });
    }
  }

  return phases;
}

export function getMoonSpreadRecommendation(moonPhase) {
  const recommendations = {
    "New Moon": {
      spreadId: "new-moon-intentions",
      spreadName: "New Moon Intentions",
      positions: ["What to Plant", "How to Nurture", "Outcome"],
      theme: "Setting intentions for the lunar cycle ahead",
    },
    "Waxing Crescent": {
      spreadId: "waxing-moon",
      spreadName: "Waxing Moon Growth",
      positions: ["What is Growing", "What Needs Attention", "Next Step"],
      theme: "Nurturing your intentions as they take root",
    },
    "First Quarter": {
      spreadId: "decision",
      spreadName: "Decision Crossroads",
      positions: [
        "The Situation",
        "Path A",
        "Path B",
        "What You Need",
        "True Desire",
      ],
      theme: "Overcoming obstacles with clarity and determination",
    },
    "Waxing Gibbous": {
      spreadId: "self-love",
      spreadName: "Self-Love Check-In",
      positions: [
        "How You See Yourself",
        "What You Need",
        "What to Release",
        "Affirmation",
      ],
      theme: "Fine-tuning your approach with self-compassion",
    },
    "Full Moon": {
      spreadId: "full-moon-release",
      spreadName: "Full Moon Release",
      positions: [
        "What Has Come to Light",
        "What to Celebrate",
        "What to Release",
      ],
      theme: "Gratitude and letting go under the full moon",
    },
    "Waning Gibbous": {
      spreadId: "chakra",
      spreadName: "Chakra Alignment",
      positions: [
        "Root",
        "Sacral",
        "Solar Plexus",
        "Heart",
        "Throat",
        "Third Eye",
        "Crown",
      ],
      theme: "Reflecting on insights and rebalancing your energy",
    },
    "Last Quarter": {
      spreadId: "shadow-work",
      spreadName: "Shadow Work",
      positions: [
        "The Shadow",
        "The Trigger",
        "The Root",
        "The Lesson",
        "Integration",
      ],
      theme: "Letting go with compassion and embracing your shadow",
    },
    "Waning Crescent": {
      spreadId: "waning-moon",
      spreadName: "Waning Moon Reflection",
      positions: ["Lesson Learned", "What to Forgive", "Preparation"],
      theme: "Surrendering and preparing for rebirth",
    },
  };

  return recommendations[moonPhase] || recommendations["New Moon"];
}
