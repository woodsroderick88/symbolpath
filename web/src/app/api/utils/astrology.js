/**
 * Astrology calculation utilities
 * Calculate sun sign, approximate moon sign, and provide astrological insights
 */

const zodiacSigns = [
  {
    name: "Aries",
    symbol: "♈",
    element: "Fire",
    startMonth: 3,
    startDay: 21,
    endMonth: 4,
    endDay: 19,
  },
  {
    name: "Taurus",
    symbol: "♉",
    element: "Earth",
    startMonth: 4,
    startDay: 20,
    endMonth: 5,
    endDay: 20,
  },
  {
    name: "Gemini",
    symbol: "♊",
    element: "Air",
    startMonth: 5,
    startDay: 21,
    endMonth: 6,
    endDay: 20,
  },
  {
    name: "Cancer",
    symbol: "♋",
    element: "Water",
    startMonth: 6,
    startDay: 21,
    endMonth: 7,
    endDay: 22,
  },
  {
    name: "Leo",
    symbol: "♌",
    element: "Fire",
    startMonth: 7,
    startDay: 23,
    endMonth: 8,
    endDay: 22,
  },
  {
    name: "Virgo",
    symbol: "♍",
    element: "Earth",
    startMonth: 8,
    startDay: 23,
    endMonth: 9,
    endDay: 22,
  },
  {
    name: "Libra",
    symbol: "♎",
    element: "Air",
    startMonth: 9,
    startDay: 23,
    endMonth: 10,
    endDay: 22,
  },
  {
    name: "Scorpio",
    symbol: "♏",
    element: "Water",
    startMonth: 10,
    startDay: 23,
    endMonth: 11,
    endDay: 21,
  },
  {
    name: "Sagittarius",
    symbol: "♐",
    element: "Fire",
    startMonth: 11,
    startDay: 22,
    endMonth: 12,
    endDay: 21,
  },
  {
    name: "Capricorn",
    symbol: "♑",
    element: "Earth",
    startMonth: 12,
    startDay: 22,
    endMonth: 1,
    endDay: 19,
  },
  {
    name: "Aquarius",
    symbol: "♒",
    element: "Air",
    startMonth: 1,
    startDay: 20,
    endMonth: 2,
    endDay: 18,
  },
  {
    name: "Pisces",
    symbol: "♓",
    element: "Water",
    startMonth: 2,
    startDay: 19,
    endMonth: 3,
    endDay: 20,
  },
];

export function getSunSign(birthDate) {
  const date = new Date(birthDate);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  for (const sign of zodiacSigns) {
    if (
      (month === sign.startMonth && day >= sign.startDay) ||
      (month === sign.endMonth && day <= sign.endDay)
    ) {
      return sign;
    }
  }

  return zodiacSigns[0]; // Default to Aries
}

export function getApproximateMoonSign(birthDate) {
  // Simplified moon sign approximation (moon changes signs every ~2.5 days)
  // This is a rough estimate - true calculation requires birth time and location
  const date = new Date(birthDate);
  const daysSinceEpoch = Math.floor(date.getTime() / (1000 * 60 * 60 * 24));
  const moonCycle = 27.3; // Sidereal month
  const signIndex =
    Math.floor((daysSinceEpoch % moonCycle) / (moonCycle / 12)) % 12;

  return zodiacSigns[signIndex];
}

export function getZodiacPersonality(signName) {
  const personalities = {
    Aries: {
      traits: ["Bold", "Pioneering", "Courageous"],
      tarotCards: ["The Emperor", "The Tower"],
      readingFocus: "Action and leadership",
    },
    Taurus: {
      traits: ["Grounded", "Sensual", "Patient"],
      tarotCards: ["The Hierophant", "The Empress"],
      readingFocus: "Material stability and pleasure",
    },
    Gemini: {
      traits: ["Curious", "Communicative", "Adaptable"],
      tarotCards: ["The Lovers", "The Magician"],
      readingFocus: "Communication and duality",
    },
    Cancer: {
      traits: ["Nurturing", "Intuitive", "Protective"],
      tarotCards: ["The Chariot", "The Moon"],
      readingFocus: "Emotions and home",
    },
    Leo: {
      traits: ["Confident", "Generous", "Creative"],
      tarotCards: ["Strength", "The Sun"],
      readingFocus: "Self-expression and vitality",
    },
    Virgo: {
      traits: ["Analytical", "Helpful", "Precise"],
      tarotCards: ["The Hermit", "Temperance"],
      readingFocus: "Service and refinement",
    },
    Libra: {
      traits: ["Balanced", "Diplomatic", "Aesthetic"],
      tarotCards: ["Justice", "The Lovers"],
      readingFocus: "Relationships and harmony",
    },
    Scorpio: {
      traits: ["Intense", "Transformative", "Mysterious"],
      tarotCards: ["Death", "Judgement"],
      readingFocus: "Transformation and depth",
    },
    Sagittarius: {
      traits: ["Optimistic", "Philosophical", "Adventurous"],
      tarotCards: ["Temperance", "The Wheel of Fortune"],
      readingFocus: "Expansion and meaning",
    },
    Capricorn: {
      traits: ["Ambitious", "Disciplined", "Practical"],
      tarotCards: ["The Devil", "The World"],
      readingFocus: "Achievement and structure",
    },
    Aquarius: {
      traits: ["Innovative", "Humanitarian", "Independent"],
      tarotCards: ["The Star", "The Fool"],
      readingFocus: "Vision and community",
    },
    Pisces: {
      traits: ["Compassionate", "Mystical", "Fluid"],
      tarotCards: ["The Moon", "The Hanged Man"],
      readingFocus: "Spirituality and surrender",
    },
  };

  return personalities[signName] || personalities["Aries"];
}

// Planet → Symbol archetype mapping for transit events
// When a planet enters a new sign (ingress), it triggers a symbol event
// The stage reflects the disruptive nature of a sign change
const PLANET_SYMBOL_MAP = {
  Saturn: {
    symbol: "Mountain",
    stage: "Crisis",
    theme: "restructuring",
    visual: "⛰️",
  },
  Jupiter: {
    symbol: "Tree",
    stage: "Growth",
    theme: "expansion",
    visual: "🌳",
  },
  Mars: {
    symbol: "Flame",
    stage: "Crisis",
    theme: "confrontation",
    visual: "🔥",
  },
  Venus: { symbol: "River", stage: "Growth", theme: "flow", visual: "🏞️" },
  Mercury: {
    symbol: "Key",
    stage: "Awakening",
    theme: "discovery",
    visual: "🔑",
  },
  Uranus: { symbol: "Tower", stage: "Crisis", theme: "collapse", visual: "🗼" },
  Neptune: {
    symbol: "Labyrinth",
    stage: "Crisis",
    theme: "confusion",
    visual: "🌀",
  },
  Pluto: {
    symbol: "Serpent",
    stage: "Crisis",
    theme: "transformation",
    visual: "🐍",
  },
};

// Approximate planetary sign positions for slow-moving planets
// These are simplified ingress dates — in a real app, use an ephemeris API
function getSlowPlanetSign(planet, date) {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-indexed
  const day = date.getDate();
  const dayOfYear = Math.floor(
    (date - new Date(year, 0, 0)) / (1000 * 60 * 60 * 24),
  );

  // Simplified sign assignments based on known astronomical transits
  // Saturn: ~2.5 years per sign
  // Jupiter: ~1 year per sign
  switch (planet) {
    case "Saturn": {
      // Saturn moves through signs roughly every 2.5 years
      // Approximate: shifted by ~30° per 2.5 years from a known epoch
      const saturnCycle = 29.5; // years for full cycle
      const yearsFromEpoch = year - 2020 + month / 12;
      const signOffset = Math.floor((yearsFromEpoch / saturnCycle) * 12) % 12;
      // Saturn was in Aquarius early 2020
      const baseSign = 10; // Aquarius index
      return zodiacSigns[(baseSign + signOffset) % 12];
    }
    case "Jupiter": {
      // Jupiter moves through signs roughly every 1 year
      const jupiterCycle = 11.86;
      const yearsFromEpoch = year - 2020 + month / 12;
      const signOffset = Math.floor((yearsFromEpoch / jupiterCycle) * 12) % 12;
      // Jupiter was in Capricorn early 2020
      const baseSign = 9; // Capricorn index
      return zodiacSigns[(baseSign + signOffset) % 12];
    }
    default:
      return zodiacSigns[0];
  }
}

// Detect recent planetary ingresses (planet entering a new sign)
export function getPlanetaryIngresses(date) {
  const ingresses = [];
  const slowPlanets = ["Saturn", "Jupiter"];

  for (const planet of slowPlanets) {
    const currentSign = getSlowPlanetSign(planet, date);
    // Check 30 days ago to detect recent ingress
    const pastDate = new Date(date.getTime() - 30 * 24 * 60 * 60 * 1000);
    const pastSign = getSlowPlanetSign(planet, pastDate);

    if (currentSign.name !== pastSign.name) {
      const mapping = PLANET_SYMBOL_MAP[planet];
      ingresses.push({
        planet,
        type: "ingress",
        fromSign: pastSign.name,
        toSign: currentSign.name,
        element: currentSign.element,
        influence: `${planet} enters ${currentSign.name} — a shift in ${mapping.theme}`,
        symbol: mapping.symbol,
        stage: mapping.stage,
        theme: mapping.theme,
        visual: mapping.visual,
      });
    }
  }

  return ingresses;
}

export { PLANET_SYMBOL_MAP };

export function getCurrentTransits() {
  // Simplified transit information (in a real app, you'd use an ephemeris API)
  const now = new Date();
  const month = now.getMonth();

  // Mock retrograde information based on typical patterns
  const retrogrades = [
    {
      planet: "Mercury",
      retrograde: month % 4 === 0,
      influence: "Communication, travel, technology",
    },
    {
      planet: "Venus",
      retrograde: month === 5 || month === 11,
      influence: "Love, values, beauty",
    },
    {
      planet: "Mars",
      retrograde: month === 9 || month === 10,
      influence: "Action, desire, conflict",
    },
  ];

  const activeRetrogrades = retrogrades.filter((r) => r.retrograde);

  // Also include recent planetary ingresses
  const ingresses = getPlanetaryIngresses(now);

  return {
    retrogrades: activeRetrogrades,
    ingresses,
  };
}

export function getAstrologicalReadingInsight(sunSign, moonSign, cards) {
  const sunPersonality = getZodiacPersonality(sunSign);
  const moonPersonality = getZodiacPersonality(moonSign);

  return {
    sunFocus: sunPersonality.readingFocus,
    moonFocus: moonPersonality.readingFocus,
    recommendedCards: [
      ...sunPersonality.tarotCards,
      ...moonPersonality.tarotCards,
    ],
    insight: `As a ${sunSign} Sun with ${moonSign} Moon, focus on ${sunPersonality.readingFocus} while honoring your emotional need for ${moonPersonality.readingFocus}.`,
  };
}
